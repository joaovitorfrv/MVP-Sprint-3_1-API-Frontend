// Módulo de Tarefas
const taskModule = (function() {
    // Configuração da API
    const API_BASE_URL = 'http://localhost:5000/api';
    let tasksLoaded = false; // Flag para controlar se as tarefas já foram carregadas

    // Função para criar um elemento de tarefa
    // Função para criar um elemento de tarefa
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    taskElement.dataset.id = task.id;
    taskElement.dataset.done = task.done;
    taskElement.dataset.priority = task.priority; // Armazenar a prioridade
    
    // Adicionar classe de prioridade para estilização
    taskElement.classList.add(`priority-${task.priority}`);

    // Criar checkbox
    const checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');
    if (task.done) {
        checkbox.classList.add('checked');
    }
    
    checkbox.addEventListener('click', () => {
        const currentDone = taskElement.dataset.done === 'true';
        toggleTaskStatus(task.id, !currentDone);
    });

    // Criar conteúdo da tarefa
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    // Título da tarefa
    const taskTitle = document.createElement('div');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = task.name || "Sem título";
    
    // Prioridade da tarefa (exibida como descrição)
    const taskPriority = document.createElement('div');
    taskPriority.classList.add('task-description');
    
    // Adicionar ícone de prioridade
    const priorityLabel = getPriorityLabel(task.priority);
    taskPriority.innerHTML = `<span class="priority-indicator priority-${task.priority}"></span> ${priorityLabel}`;

    // Adicionar título e prioridade ao conteúdo
    taskContent.appendChild(taskTitle);
    taskContent.appendChild(taskPriority);

    // Criar botões de ação
    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    // Botão de editar
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', () => showEditTaskModal(task));

    // Botão de excluir
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    // Adicionar botões às ações
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    // Montar o elemento completo
    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskContent);
    taskElement.appendChild(taskActions);

    return taskElement;
}

// Função auxiliar para obter o rótulo da prioridade
function getPriorityLabel(priority) {
    switch (parseInt(priority)) {
        case 1: return "Prioridade: Baixa";
        case 2: return "Prioridade: Média-Baixa";
        case 3: return "Prioridade: Média";
        case 4: return "Prioridade: Média-Alta";
        case 5: return "Prioridade: Alta";
        default: return `Prioridade: ${priority}`;
    }
}
    // Função para adicionar uma tarefa à lista sem recarregar tudo
    function addTaskToList(task) {
        const tasksList = document.getElementById('tasks-list');
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    }

    // Função para mostrar indicador de carregamento
    function showLoadingIndicator() {
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '<div class="loading-indicator">Carregando tarefas...</div>';
    }

    // Função para carregar todas as tarefas
async function loadTasks() {
    if (tasksLoaded) return; // Evitar carregamentos duplicados
    
    try {
        showLoadingIndicator();
        
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error('Erro ao buscar tarefas');

        const data = await response.json();
        let tasks = data.tasks;

        // Ordenar tarefas por prioridade (maior para menor)
        tasks.sort((a, b) => {
            // Primeiro por prioridade (decrescente)
            const priorityDiff = b.priority - a.priority;
            
            // Se a prioridade for igual, ordenar por status (não concluídas primeiro)
            if (priorityDiff === 0) {
                return a.done === b.done ? 0 : a.done ? 1 : -1;
            }
            
            return priorityDiff;
        });

        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = ''; // Limpar a lista atual

        // Adicionar cada tarefa à lista
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
        
        tasksLoaded = true; // Marcar que as tarefas foram carregadas
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '<div class="error-message">Erro ao carregar tarefas</div>';
    }
}

    // Função para alternar o status de uma tarefa (concluída/não concluída)
    async function toggleTaskStatus(id, done) {
        try {
            // Atualizar a interface imediatamente para feedback instantâneo
            const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
            const checkbox = taskElement.querySelector('.checkbox');
            
            // Atualizar a interface
            if (done) {
                checkbox.classList.add('checked');
            } else {
                checkbox.classList.remove('checked');
            }

            // Atualizar o atributo data-done para manter o estado
            taskElement.dataset.done = done;

            // Obter os valores atuais da tarefa para não perder dados
            const taskTitle = taskElement.querySelector('.task-title').textContent;
            const priorityText = taskElement.querySelector('.task-description').textContent;
            const priority = parseInt(priorityText.replace('Prioridade: ', '')) || 3; // Valor padrão se não for um número

            // Preparar os dados para enviar usando FormData
            const formData = new FormData();
            formData.append('name', taskTitle);
            formData.append('priority', priority);
            formData.append('done', done);

            // Enviar a atualização para o servidor
            const response = await fetch(`${API_BASE_URL}/task?id=${id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                // Se falhar, reverter a interface e recarregar
                loadTasks();
                throw new Error('Erro ao atualizar status da tarefa');
            }
            
            const data = await response.json();
            
            // Atualizar o estado da tarefa no elemento após confirmação do servidor
            taskElement.dataset.done = data.done;
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error);
            loadTasks(); // Recarregar para garantir consistência
        }
    }

// Função para excluir uma tarefa
async function deleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            // Remover o elemento da interface imediatamente para feedback instantâneo
            const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
            if (taskElement) {
                taskElement.remove();
            }

            // Enviar requisição para excluir no servidor
            const response = await fetch(`${API_BASE_URL}/task?id=${id}`, {
                method: 'DELETE'
            });

            // Tentar obter a resposta como JSON, independentemente do status HTTP
            let data;
            try {
                data = await response.json();
                console.log("Resposta da exclusão:", data);
            } catch (e) {
                console.error("Erro ao processar resposta JSON:", e);
                // Se não conseguir processar como JSON, considerar como falha
                throw new Error("Erro ao processar resposta do servidor");
            }
            
            // Verificar se a mensagem indica sucesso, mesmo que o status seja 404
            if (data && data.message === 'Task removida') {
                console.log(`Tarefa ${id} excluída com sucesso`);
                
                // Definir tasksLoaded como false para forçar recarregamento
                tasksLoaded = false;
                
                // Recarregar a lista para manter a ordenação
                loadTasks();
                return; // Sair da função, pois a exclusão foi bem-sucedida
            }
            
            // Se chegou aqui, houve algum problema
            console.error("Erro na resposta:", data);
            
            // Não mostrar alerta, apenas recarregar a lista
            tasksLoaded = false;
            loadTasks();
            
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            
            // Definir tasksLoaded como false para forçar recarregamento
            tasksLoaded = false;
            
            // Recarregar a lista para garantir consistência
            loadTasks();
        }
    }
}

    // Função para mostrar o modal de adicionar tarefa
    function showAddTaskModal() {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        const modalTitle = modal.querySelector('h3');

        // Configurar o modal para adicionar
        modalTitle.textContent = 'Nova Tarefa';
        form.dataset.mode = 'add';
        form.dataset.taskId = '';

        // Limpar o formulário
        form.reset();
        
        // Definir valor padrão para prioridade
        document.getElementById('task-priority').value = "3";

        // Mostrar o modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        modal.classList.remove('hidden');

        // Focar no primeiro campo para facilitar a entrada
        document.getElementById('task-title').focus();
    }

    // Função para mostrar o modal de editar tarefa
    function showEditTaskModal(task) {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        const modalTitle = modal.querySelector('h3');

        // Configurar o modal para edição
        modalTitle.textContent = 'Editar Tarefa';
        form.dataset.mode = 'edit';
        form.dataset.taskId = task.id;

        // Preencher o formulário com os dados da tarefa
        document.getElementById('task-title').value = task.name || '';
        document.getElementById('task-priority').value = task.priority || 3;

        // Mostrar o modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        modal.classList.remove('hidden');

        // Focar no primeiro campo para facilitar a entrada
        document.getElementById('task-title').focus();
    }

    // Função para salvar uma tarefa (adicionar ou atualizar)
    async function saveTask(event) {
        event.preventDefault(); // Impede o comportamento padrão do formulário

        const form = document.getElementById('task-form');
        const mode = form.dataset.mode;
        const taskId = form.dataset.taskId;
        const title = document.getElementById('task-title').value.trim();
        const priority = parseInt(document.getElementById('task-priority').value);

        if (!title) {
            alert('Preencha o título da tarefa!');
            return;
        }

        // Fechar o modal imediatamente para feedback instantâneo
        closeModal();

        try {
            if (mode === 'add') {
                // Criar uma tarefa temporária para exibição imediata
                const tempId = 'temp-' + Date.now();
                const tempTask = { id: tempId, name: title, priority, done: false };
                addTaskToList(tempTask);

                // Preparar os dados para enviar
                const formData = new FormData();
                formData.append('name', title);
                formData.append('priority', priority);
                
                // Enviar a requisição para a API
                const response = await fetch(`${API_BASE_URL}/task`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    // Se falhar, remover a tarefa temporária
                    document.querySelector(`.task-item[data-id="${tempId}"]`)?.remove();
                    throw new Error(`Erro ao salvar tarefa: ${response.statusText}`);
                }

                // Obter a resposta do servidor
                const data = await response.json();
                
                // Remover a tarefa temporária
                document.querySelector(`.task-item[data-id="${tempId}"]`)?.remove();
                
                // Adicionar a tarefa real com o ID do servidor
                addTaskToList({
                    id: data.id,
                    name: data.name,
                    priority: data.priority,
                    done: data.done
                });
                loadTasks(); // Recarregar a lista para manter a ordenação
            } else if (mode === 'edit') {
                // Atualizar a interface imediatamente
                const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
                if (taskElement) {
                    const taskTitle = taskElement.querySelector('.task-title');
                    const taskPriority = taskElement.querySelector('.task-description');
                    
                    taskTitle.textContent = title;
                    taskPriority.textContent = `Prioridade: ${priority}`;
                }

                // Obter o status atual da tarefa
                const isDone = taskElement.querySelector('.checkbox').classList.contains('checked');

                // Preparar os dados para enviar
                const formData = new FormData();
                formData.append('name', title);
                formData.append('priority', priority);
                formData.append('done', isDone);
                
                // Enviar a requisição para a API
                const response = await fetch(`${API_BASE_URL}/task?id=${taskId}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) {
                    // Se falhar, recarregar a lista para restaurar o estado correto
                    loadTasks();
                    throw new Error(`Erro ao atualizar tarefa: ${response.statusText}`);
                } else {
                    loadTasks();
                }
            }
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            alert('Não foi possível salvar a tarefa. Verifique o console para mais detalhes.');
            loadTasks(); // Recarregar para garantir consistência
        }
    }

    // Função para fechar todos os modais (compartilhada)
    function closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Função de inicialização
    function init() {
        // Limpar o exemplo de tarefa do HTML
        document.getElementById('tasks-list').innerHTML = '';
        
        // Iniciar o carregamento das tarefas imediatamente
        loadTasks();

        // Configurar o formulário de tarefa
        document.getElementById('task-form').addEventListener('submit', saveTask);

        // Configurar o botão de adicionar tarefa
        document.getElementById('add-task').addEventListener('click', showAddTaskModal);
    }

    // Iniciar o carregamento das tarefas o mais cedo possível
    // Isso é executado assim que o módulo é carregado, antes mesmo do DOMContentLoaded
    showLoadingIndicator();
    
    // Tentar carregar as tarefas imediatamente se o DOM já estiver pronto
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        loadTasks();
    }

    // Expor funções públicas
    return {
        init,
        loadTasks,
        showAddTaskModal,
        saveTask,
        closeModal
    };
})();

// Inicializar o módulo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    taskModule.init();
});

// Adicionar um pouco de CSS para o indicador de carregamento
document.head.insertAdjacentHTML('beforeend', `
<style>
.loading-indicator {
    text-align: center;
    padding: 20px;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
}
.empty-list {
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