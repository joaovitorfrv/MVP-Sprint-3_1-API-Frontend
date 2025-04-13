// Serviço para comunicação com a API
const EventService = {
    // Obter todos os eventos
    async getEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) throw new Error('Erro ao buscar eventos');
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            throw error;
        }
    },

    // Obter um evento específico
    async getEvent(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/event`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            
            if (!response.ok) throw new Error('Evento não encontrado');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar evento ${id}:`, error);
            throw error;
        }
    },

    // Criar um novo evento
    async createEvent(eventData) {
        try {
            const formData = new FormData();
            formData.append('title', eventData.title);
            formData.append('date', eventData.date);
            formData.append('hour', eventData.hour);
            
            const response = await fetch(`${API_BASE_URL}/event`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Erro ao criar evento');
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            throw error;
        }
    },

    // Atualizar um evento existente
    async updateEvent(id, eventData) {
        try {
            // Dados do evento a atualizar
            const formData = new FormData();
            if (eventData.title) formData.append('title', eventData.title);
            if (eventData.date) formData.append('date', eventData.date);
            if (eventData.hour) formData.append('hour', eventData.hour);
            
            // ID do evento a atualizar
            const idFormData = new FormData();
            idFormData.append('id', id);
            
            const response = await fetch(`${API_BASE_URL}/event?${new URLSearchParams(idFormData)}`, {
                method: 'PUT',
                body: formData
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar evento');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao atualizar evento ${id}:`, error);
            throw error;
        }
    },

    // Excluir um evento
    async deleteEvent(id) {
        try {
            const url = new URL('http://localhost:5000/api/event');
            url.searchParams.append('id', id);
            
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            // Obter os dados da resposta
            const data = await response.json();
            
            // Verificar se o evento foi removido com sucesso, mesmo com código 404
            if (data.message === 'Evento removido') {
                return data; // Sucesso, mesmo com código 404
            } else {
                throw new Error(data.message || 'Erro ao excluir evento');
            }
        } catch (error) {
            console.error(`Erro ao excluir evento ${id}:`, error);
            throw error;
        }
    }
};

// Manipulador do DOM para eventos
const DOMHandlerEvents = {
    // Criar elemento de evento para a lista
    createEventElement(event, callbacks) {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.dataset.id = event.id;
        
        // Formatar a data para exibição
        const dateObj = new Date(event.date + 'T' + event.hour);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
        
        eventItem.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-datetime">${formattedDate} às ${event.hour}</div>
            <div class="event-actions">
                <button class="edit-button"><i class="fas fa-edit"></i></button>
                <button class="delete-button"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Adicionar event listeners
        const editButton = eventItem.querySelector('.edit-button');
        const deleteButton = eventItem.querySelector('.delete-button');
        
        editButton.addEventListener('click', () => callbacks.editEvent(event));
        deleteButton.addEventListener('click', () => callbacks.deleteEvent(event.id));
        
        return eventItem;
    },
    
    // Mostrar mensagem quando não há eventos
    showEmptyList() {
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = `
            <div class="empty-list">Nenhum evento encontrado</div>
        `;
    }
};

// Controlador principal de eventos
const EventManager = {
    // Inicializar o gerenciador de eventos
    init() {
        // Elementos do DOM
        this.eventsList = document.getElementById('events-list');
        this.addEventButton = document.getElementById('add-event');
        this.eventForm = document.getElementById('event-form');
        this.eventModal = document.getElementById('event-modal');
        
        // Configurar event listeners
        this.addEventButton.addEventListener('click', this.showAddEventModal.bind(this));
        this.eventForm.addEventListener('submit', this.saveEvent.bind(this));
        
        // Carregar eventos iniciais
        this.loadEvents();
    },
    
    // Carregar todos os eventos
    async loadEvents() {
        try {
            this.eventsList.innerHTML = '<div class="loading">Carregando eventos...</div>';
            
            const data = await EventService.getEvents();
            this.eventsList.innerHTML = '';
            
            if (data.events && data.events.length > 0) {
                data.events.forEach(event => {
                    const eventElement = DOMHandlerEvents.createEventElement(event, {
                        editEvent: this.showEditEventModal.bind(this),
                        deleteEvent: this.deleteEvent.bind(this)
                    });
                    this.eventsList.appendChild(eventElement);
                });
            } else {
                DOMHandlerEvents.showEmptyList();
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            this.eventsList.innerHTML = '<div class="error">Erro ao carregar eventos</div>';
        }
    },
    
    // Mostrar modal para adicionar evento
    showAddEventModal() {
        // Limpar o formulário
        this.eventForm.reset();
        this.eventForm.dataset.mode = 'add';
        
        // Preencher com a data atual
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        document.getElementById('event-title').value = '';
        document.getElementById('event-date').value = today;
        document.getElementById('event-time').value = currentTime;
        
        // Atualizar título do modal
        document.querySelector('#event-modal h3').textContent = 'Novo Evento';
        
        // Mostrar o modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        this.eventModal.classList.remove('hidden');
    },
    
    // Mostrar modal para editar evento
    showEditEventModal(event) {
        // Preencher o formulário com os dados do evento
        this.eventForm.dataset.mode = 'edit';
        this.eventForm.dataset.eventId = event.id;
        
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.hour;
        
        // Atualizar título do modal
        document.querySelector('#event-modal h3').textContent = 'Editar Evento';
        
        // Mostrar o modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        this.eventModal.classList.remove('hidden');
    },
    
    // Salvar evento (criar ou atualizar)
    async saveEvent(event) {
        event.preventDefault();
        
        const form = document.getElementById('event-form');
        const mode = form.dataset.mode;
        const eventId = form.dataset.eventId;
        
        const title = document.getElementById('event-title').value.trim();
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        
        if (!title || !date || !time) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Fechar o modal
        closeModal();
        
        try {
            const eventData = {
                title,
                date,
                hour: time,
                city: LocationManager.getCityName() // Usar a cidade atual do usuário
            };
            
            if (mode === 'add') {
                await EventService.createEvent(eventData);
            } else if (mode === 'edit') {
                await EventService.updateEvent(eventId, eventData);
            }
            
            // Recarregar a lista de eventos
            this.loadEvents();
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            alert('Não foi possível salvar o evento. Tente novamente.');
        }
    },
    
    // Excluir evento
    async deleteEvent(id) {
        if (!confirm('Tem certeza que deseja excluir este evento?')) return;
        
        try {
            await EventService.deleteEvent(id);
            
            // Remover o elemento do DOM
            const eventElement = document.querySelector(`.event-item[data-id="${id}"]`);
            if (eventElement) eventElement.remove();
            
            // Verificar se a lista ficou vazia
            if (this.eventsList.children.length === 0) {
                DOMHandlerEvents.showEmptyList();
            }
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            alert('Não foi possível excluir o evento. Tente novamente.');
        }
    }
};

// Inicializar o gerenciador de eventos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    EventManager.init();
});