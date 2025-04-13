// TaskModule: Gerenciador de tarefas com padrão de módulo revelação
const TaskModule = (function() {
    // Configuração e estado
    const API_BASE_URL = 'http://localhost:5000/api';
    let tasksLoaded = false;
    
    // Serviço de API - Responsabilidade única para comunicação com o servidor
    const TaskService = {
        async fetchTasks() {
            const response = await fetch(`${API_BASE_URL}/tasks`);
            if (!response.ok) throw new Error('Erro ao buscar tarefas');
            return response.json();
        },
        
        async createTask(taskData) {
            const formData = new FormData();
            formData.append('name', taskData.name);
            formData.append('priority', taskData.priority);
            
            const response = await fetch(`${API_BASE_URL}/task`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error(`Erro ao criar tarefa: ${response.statusText}`);
            return response.json();

            
        },
        
        async updateTask(id, taskData) {
            const formData = new FormData();
            if (taskData.name !== undefined) formData.append('name', taskData.name);
            if (taskData.priority !== undefined) formData.append('priority', taskData.priority);
            if (taskData.done !== undefined) formData.append('done', taskData.done);
            
            const response = await fetch(`${API_BASE_URL}/task?id=${id}`, {
                method: 'PUT',
                body: formData
            });
            
            if (!response.ok) throw new Error(`Erro ao atualizar tarefa: ${response.statusText}`);
            return response.json();
        },
        
        async deleteTask(id) {
            const response = await fetch(`${API_BASE_URL}/task?id=${id}`, {
                method: 'DELETE'
            });
            
            try {
                return await response.json();
            } catch (e) {
                throw new Error("Erro ao processar resposta do servidor");
            }
        }
    };
    
    // Utilitários - Funções auxiliares reutilizáveis
    const Utils = {
        getPriorityLabel(priority) {
            const labels = {
                1: "Prioridade: Baixa",
                2: "Prioridade: Média-Baixa",
                3: "Prioridade: Média",
                4: "Prioridade: Média-Alta",
                5: "Prioridade: Alta"
            };
            return labels[parseInt(priority)] || `Prioridade: ${priority}`;
        },
        
        sortTasks(tasks) {
            return [...tasks].sort((a, b) => {
                const priorityDiff = b.priority - a.priority;
                if (priorityDiff === 0) {
                    return a.done === b.done ? 0 : a.done ? 1 : -1;
                }
                return priorityDiff;
            });
        }
    };
    
    // Manipulação do DOM - Responsável por criar e atualizar elementos na interface
    const DOMHandler = {
        getElement(selector) {
            return document.querySelector(selector);
        },
        
        showLoading() {
            const tasksList = this.getElement('#tasks-list');
            tasksList.innerHTML = '<div class="loading-indicator">Carregando tarefas...</div>';
        },
        
        showError(message) {
            const tasksList = this.getElement('#tasks-list');
            tasksList.innerHTML = `<div class="error-message">${message}</div>`;
        },
        
        showEmptyList() {
            const tasksList = this.getElement('#tasks-list');
            tasksList.innerHTML = '<div class="empty-list">Nenhuma tarefa encontrada</div>';
        },
        
        clearTasksList() {
            this.getElement('#tasks-list').innerHTML = '';
        },
        
        createTaskElement(task, handlers) {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', `priority-${task.priority}`);
            taskElement.dataset.id = task.id;
            taskElement.dataset.done = task.done;
            taskElement.dataset.priority = task.priority;
            
            // Checkbox
            const checkbox = document.createElement('div');
            checkbox.classList.add('checkbox');
            if (task.done) checkbox.classList.add('checked');
            checkbox.addEventListener('click', () => handlers.toggleStatus(task.id, task.done === false));
            
            // Conteúdo
            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');
            
            const taskTitle = document.createElement('div');
            taskTitle.classList.add('task-title');
            taskTitle.textContent = task.name || "Sem título";
            
            const taskPriority = document.createElement('div');
            taskPriority.classList.add('task-description');
            const priorityLabel = Utils.getPriorityLabel(task.priority);
            taskPriority.innerHTML = `<span class="priority-indicator priority-${task.priority}"></span> ${priorityLabel}`;
            
            taskContent.appendChild(taskTitle);
            taskContent.appendChild(taskPriority);
            
            // Ações
            const taskActions = document.createElement('div');
            taskActions.classList.add('task-actions');
            
            const editButton = document.createElement('button');
            editButton.classList.add('edit-button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.addEventListener('click', () => handlers.editTask(task));
            
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener('click', () => handlers.deleteTask(task.id));
            
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);
            
            // Montar elemento
            taskElement.appendChild(checkbox);
            taskElement.appendChild(taskContent);
            taskElement.appendChild(taskActions);
            
            return taskElement;
        },
        
        renderTasks(tasks, handlers) {
            const tasksList = this.getElement('#tasks-list');
            this.clearTasksList();
            
            if (!tasks.length) {
                this.showEmptyList();
                return;
            }
            
            tasks.forEach(task => {
                const taskElement = this.createTaskElement(task, handlers);
                tasksList.appendChild(taskElement);
            });
        },
        
        showModal(id, title, task = null) {
            const modal = this.getElement('#task-modal');
            const form = this.getElement('#task-form');
            const modalTitle = modal.querySelector('h3');
            
            modalTitle.textContent = title;
            form.dataset.mode = id;
            form.dataset.taskId = task ? task.id : '';
            
            form.reset();
            
            if (task) {
                this.getElement('#task-title').value = task.name || '';
                this.getElement('#task-priority').value = task.priority || 3;
            } else {
                this.getElement('#task-priority').value = "3";
            }
            
            this.getElement('#modal-overlay').classList.remove('hidden');
            modal.classList.remove('hidden');
            this.getElement('#task-title').focus();
        },
        
        closeModal() {
            this.getElement('#modal-overlay').classList.add('hidden');
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        },
        
        getFormData() {
            const form = this.getElement('#task-form');
            return {
                mode: form.dataset.mode,
                taskId: form.dataset.taskId,
                title: this.getElement('#task-title').value.trim(),
                priority: parseInt(this.getElement('#task-priority').value)
            };
        }
    };
    
    // Controlador - Gerencia o fluxo de dados e a lógica de negócios
    const TaskController = {
        async loadTasks() {
            if (tasksLoaded) return;
            
            try {
                DOMHandler.showLoading();
                
                const data = await TaskService.fetchTasks();
                const sortedTasks = Utils.sortTasks(data.tasks);
                
                DOMHandler.renderTasks(sortedTasks, {
                    toggleStatus: this.toggleTaskStatus.bind(this),
                    editTask: this.showEditTaskModal.bind(this),
                    deleteTask: this.deleteTask.bind(this)
                });
                
                tasksLoaded = true;
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
                DOMHandler.showError('Erro ao carregar tarefas');
            }
        },
        
        async toggleTaskStatus(id, done) {
            try {
                const taskElement = DOMHandler.getElement(`.task-item[data-id="${id}"]`);
                const checkbox = taskElement.querySelector('.checkbox');
                
                if (done) {
                    checkbox.classList.add('checked');
                } else {
                    checkbox.classList.remove('checked');
                }
                
                taskElement.dataset.done = done;
                
                const taskTitle = taskElement.querySelector('.task-title').textContent;
                const priorityText = taskElement.querySelector('.task-description').textContent;
                const priority = parseInt(priorityText.match(/\d+/)[0]) || 3;
                
                await TaskService.updateTask(id, { name: taskTitle, priority, done });
            } catch (error) {
                console.error('Erro ao alternar status:', error);
                tasksLoaded = false;
                this.loadTasks();
            }
        },
        
        async deleteTask(id) {
            if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
            
            try {
                const taskElement = DOMHandler.getElement(`.task-item[data-id="${id}"]`);
                if (taskElement) taskElement.remove();
                
                const data = await TaskService.deleteTask(id);
                
                if (data && data.message === 'Task removida') {
                    console.log(`Tarefa ${id} excluída com sucesso`);
                } else {
                    console.error("Resposta inesperada:", data);
                }
                
                tasksLoaded = false;
                this.loadTasks();
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
                tasksLoaded = false;
                this.loadTasks();
            }
        },
        
        showAddTaskModal() {
            DOMHandler.showModal('add', 'Nova Tarefa');
        },
        
        showEditTaskModal(task) {
            DOMHandler.showModal('edit', 'Editar Tarefa', task);
        },
        
        async saveTask(event) {
            event.preventDefault();
            
            const formData = DOMHandler.getFormData();
            
            if (!formData.title) {
                alert('Preencha o título da tarefa!');
                return;
            }
            
            DOMHandler.closeModal();
            
            try {
                if (formData.mode === 'add') {
                    await this.createTask(formData);
                } else if (formData.mode === 'edit') {
                    await this.updateTask(formData);
                }
            } catch (error) {
                console.error('Erro ao salvar tarefa:', error);
                alert('Não foi possível salvar a tarefa.');
                tasksLoaded = false;
                this.loadTasks();
            }
        },
        
        async createTask(formData) {
            const tempId = 'temp-' + Date.now();
            const tempTask = { 
                id: tempId, 
                name: formData.title, 
                priority: formData.priority, 
                done: false 
            };
            
            const tasksList = DOMHandler.getElement('#tasks-list');
            const taskElement = DOMHandler.createTaskElement(tempTask, {
                toggleStatus: this.toggleTaskStatus.bind(this),
                editTask: this.showEditTaskModal.bind(this),
                deleteTask: this.deleteTask.bind(this)
            });
            
            tasksList.appendChild(taskElement);
            
            try {
                const data = await TaskService.createTask({
                    name: formData.title,
                    priority: formData.priority
                });
                
                DOMHandler.getElement(`.task-item[data-id="${tempId}"]`)?.remove();
                
                tasksLoaded = false;
                this.loadTasks();
            } catch (error) {
                DOMHandler.getElement(`.task-item[data-id="${tempId}"]`)?.remove();
                throw error;
            }
        },
        
        async updateTask(formData) {
            const taskElement = DOMHandler.getElement(`.task-item[data-id="${formData.taskId}"]`);
            if (!taskElement) return;
            
            const isDone = taskElement.querySelector('.checkbox').classList.contains('checked');
            
            try {
                await TaskService.updateTask(formData.taskId, {
                    name: formData.title,
                    priority: formData.priority,
                    done: isDone
                });
                
                tasksLoaded = false;
                this.loadTasks();
            } catch (error) {
                throw error;
            }
        },
        
        init() {
            DOMHandler.clearTasksList();
            this.loadTasks();
            
            DOMHandler.getElement('#task-form').addEventListener('submit', this.saveTask.bind(this));
            DOMHandler.getElement('#add-task').addEventListener('click', this.showAddTaskModal);
            
            // Adicionar estilos para os indicadores
            this.addStyles();
        },
        
        addStyles() {
            document.head.insertAdjacentHTML('beforeend', `
                <style>
                .loading-indicator, .empty-list {
                    text-align: center;
                    padding: 20px;
                    color: rgba(255, 255, 255, 0.7);
                    font-style: italic;
                }
                .error-message {
                    text-align: center;
                    padding: 20px;
                    color: #ff6b6b;
                    font-style: italic;
                }
                </style>
            `);
        }
    };
    
    // Inicialização imediata
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        DOMHandler.showLoading();
    }
    
    // API pública
    return {
        init: TaskController.init.bind(TaskController),
        loadTasks: TaskController.loadTasks.bind(TaskController),
        showAddTaskModal: TaskController.showAddTaskModal.bind(TaskController),
        saveTask: TaskController.saveTask.bind(TaskController),
        closeModal: DOMHandler.closeModal.bind(DOMHandler)
    };
})();

// Inicialização
document.addEventListener('DOMContentLoaded', TaskModule.init);