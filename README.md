# Frontend - App de Produtividade

## Descrição
Este é o componente frontend do App de Produtividade, uma aplicação web que integra diversos serviços para ajudar na organização pessoal. A interface oferece gerenciamento de tarefas, eventos, bookmarks e outras funcionalidades em um dashboard intuitivo.

## Arquitetura do Projeto
O App de Produtividade é composto pelos seguintes microsserviços:
1. **API Gateway** - Ponto de entrada centralizado para a aplicação
2. **Task Service** - Gerenciamento de tarefas e prioridades
3. **Event Service** - Gerenciamento de eventos e calendário
4. **Bookmark Service** - Gerenciamento de favoritos/bookmarks
5. **Frontend** - Interface de usuário da aplicação

## Estrutura do Frontend
- `index.html` - Página principal da aplicação
- `css/` - Arquivos de estilo
  - `style.css` - Estilos principais da aplicação
- `js/` - Scripts JavaScript
  - `scripts.js` - Configurações gerais e inicialização
  - `tasks.js` - Gerenciamento de tarefas
  - `events.js` - Gerenciamento de eventos
  - `bookmark.js` - Gerenciamento de bookmarks
  - `quotes.js` - Funcionalidade de frases inspiradoras
  - `clock.js` - Funcionalidade do relógio e data

## Funcionalidades
- **Dashboard Pessoal**: Interface centralizada com todas as informações importantes
- **Gerenciamento de Tarefas**: Criar, editar, marcar como concluída e excluir tarefas
- **Calendário de Eventos**: Agendar e gerenciar compromissos
- **Bookmarks**: Salvar e acessar links favoritos
- **Relógio e Data**: Exibição de hora atual e data
- **Clima**: Informações meteorológicas da localização atual
- **Frases Inspiradoras**: Exibição de frases motivacionais

## Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet para acessar APIs externas (clima, etc.)
- Serviços backend em execução (API Gateway, Task Service, Event Service, Bookmark Service)

## Instalação e Execução

### Método 1: Servidor Web Local
```bash
# Instalar um servidor web simples (se necessário)
npm install -g http-server

# Navegar até o diretório do frontend
cd frontend

# Iniciar o servidor
http-server -p 8080
```

### Método 2: Docker
```bash
# Construir a imagem
docker build -t productivity-frontend .

# Executar o container
docker run -p 8080:80 productivity-frontend
```

Após a execução, acesse a aplicação em `http://localhost:8080`.

## Configuração
Para conectar o frontend aos serviços backend, verifique e ajuste a variável `API_BASE_URL` no arquivo `js/scripts.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Certifique-se de que esta URL aponta para o seu API Gateway.

## Integração com Serviços Backend
O frontend se comunica com os seguintes endpoints através do API Gateway:
- `/api/task` - Gerenciamento de tarefas
- `/api/event` - Gerenciamento de eventos
- `/api/bookmark` - Gerenciamento de bookmarks

## Desenvolvimento
Para contribuir com o desenvolvimento:
1. Clone o repositório
2. Faça suas alterações
3. Teste localmente
4. Envie um pull request

## Responsividade
A interface é responsiva e se adapta a diferentes tamanhos de tela, desde desktops até dispositivos móveis.
