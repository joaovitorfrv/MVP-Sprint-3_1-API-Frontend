// Módulo de Bookmarks
const bookmarkModule = (function() {
    // Configuração da API
    const API_BASE_URL = 'http://localhost:5000/api';

    // Função para criar um elemento de bookmark
    function createBookmarkElement(bookmark) {
        const bookmarkElement = document.createElement('div');
        bookmarkElement.classList.add('bookmark-item');
        bookmarkElement.dataset.id = bookmark.id;

        // Criar favicon
        const favicon = document.createElement('img');
        favicon.src = bookmark.icon_url || `https://www.google.com/s2/favicons?domain=${bookmark.url}`;
        favicon.alt = '';

        // Criar link
        const link = document.createElement('a');
        link.href = bookmark.url;
        link.textContent = bookmark.title;
        link.target = '_blank';

        // Criar botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteBookmark(bookmark.id);
        });

        // Montar o elemento
        bookmarkElement.appendChild(favicon);
        bookmarkElement.appendChild(link);
        bookmarkElement.appendChild(deleteButton);

        return bookmarkElement;
    }

    // Função para adicionar um novo bookmark à lista sem recarregar tudo
    function addBookmarkToList(bookmark) {
        const bookmarksList = document.getElementById('bookmarks-list');
        const bookmarkElement = createBookmarkElement(bookmark);
        bookmarksList.appendChild(bookmarkElement);
    }

    // Função para carregar todos os bookmarks
    async function loadBookmarks() {
        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks`);
            if (!response.ok) throw new Error('Erro ao buscar bookmarks');

            const data = await response.json();
            const bookmarks = data.bookmarks;

            const bookmarksList = document.getElementById('bookmarks-list');
            bookmarksList.innerHTML = ''; // Limpar a lista atual

            // Adicionar cada bookmark à lista
            bookmarks.forEach(bookmark => {
                const bookmarkElement = createBookmarkElement(bookmark);
                bookmarksList.appendChild(bookmarkElement);
            });
        } catch (error) {
            console.error('Erro ao carregar bookmarks:', error);
        }
    }

    // Função para excluir um bookmark
    async function deleteBookmark(id) {
        if (confirm('Tem certeza que deseja excluir este link?')) {
            try {
                // Remover o elemento da interface imediatamente para feedback instantâneo
                const bookmarkElement = document.querySelector(`.bookmark-item[data-id="${id}"]`);
                if (bookmarkElement) {
                    bookmarkElement.remove();
                }

                // Enviar requisição para excluir no servidor
                const response = await fetch(`${API_BASE_URL}/bookmark?id=${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    // Se falhar, recarregar a lista para restaurar o estado correto
                    loadBookmarks();
                    throw new Error('Erro ao excluir bookmark');
                }
            } catch (error) {
                console.error('Erro ao excluir bookmark:', error);
            }
        }
    }

    // Função para mostrar o modal de adicionar bookmark
    function showBookmarkModal() {
        const modal = document.getElementById('bookmark-modal');
        const form = document.getElementById('bookmark-form');

        // Limpar o formulário
        form.reset();

        // Mostrar o modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        modal.classList.remove('hidden');

        // Focar no primeiro campo para facilitar a entrada
        document.getElementById('bookmark-title').focus();
    }

    // Função para salvar um bookmark
    async function saveBookmark(event) {
        event.preventDefault(); // Impede o comportamento padrão do formulário

        const title = document.getElementById('bookmark-title').value.trim();
        const url = document.getElementById('bookmark-url').value.trim();

        if (!title || !url) {
            alert('Preencha todos os campos!');
            return;
        }

        // Fechar o modal imediatamente para feedback instantâneo
        closeModal();

        try {
            // Criar um bookmark temporário para exibição imediata
            const tempId = 'temp-' + Date.now();
            const tempBookmark = { id: tempId, title, url };
            addBookmarkToList(tempBookmark);

            // Enviar a requisição para a API
            const response = await fetch(`${API_BASE_URL}/bookmarks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, url })
            });

            if (!response.ok) {
                // Se falhar, remover o bookmark temporário e recarregar a lista
                document.querySelector(`.bookmark-item[data-id="${tempId}"]`)?.remove();
                throw new Error(`Erro ao salvar bookmark: ${response.statusText}`);
            }

            // Recarregar a lista para obter o ID correto do servidor
            loadBookmarks();
        } catch (error) {
            console.error('Erro ao salvar bookmark:', error);
            alert('Não foi possível salvar o bookmark. Verifique o console para mais detalhes.');
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
        // Inicializar o painel de bookmarks
        document.getElementById('bookmark-toggle').addEventListener('click', () => {
            const panel = document.getElementById('bookmark-panel');
            panel.classList.toggle('hidden'); // Alterna a visibilidade do painel
        });

        // Carregar bookmarks
        loadBookmarks();

        // Configurar o formulário de bookmark
        document.getElementById('bookmark-form').addEventListener('submit', saveBookmark);

        // Configurar o botão de adicionar bookmark
        document.getElementById('add-bookmark').addEventListener('click', showBookmarkModal);
    }

    // Expor funções públicas
    return {
        init,
        loadBookmarks,
        showBookmarkModal,
        saveBookmark,
        closeModal
    };
})();

// Inicializar o módulo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    bookmarkModule.init();
});
