# 📘 Dashboard de Produtividade – Integração com Microsserviços

![Badge](https://img.shields.io/badge/status-em%20desenvolvimento-green)
![Badge](https://img.shields.io/badge/arquitetura-microsserviços-blue)

## 🧠 Descrição Geral

Este projeto implementa um dashboard de produtividade pessoal que integra tarefas, eventos e favoritos em uma única interface, com o objetivo de minimizar distrações e priorizar o foco do usuário. O sistema foi desenvolvido como um estudo acadêmico para aplicação prática de conceitos de arquitetura distribuída e comunicação entre microsserviços.

## 🏗️ Arquitetura

O projeto está estruturado com base em uma arquitetura de microsserviços, composta por:

- **Frontend**: Interface de usuário para visualização e interação com os dados
- **API Gateway**: Ponto único de entrada que roteia as requisições para os serviços apropriados
- **Microsserviços**:
  - API Tasks: Gerenciamento de tarefas e afazeres
  - API Bookmarks: Gerenciamento de favoritos e links
  - API Events: Gerenciamento de eventos e compromissos

## 🔗 Repositórios Relacionados

| Serviço | Repositório |
|---------|-------------|
| Frontend | Este repositório |
| API Tasks | [github.com/joaovitorfrv/MVP-Sprint-3_2-API-Tasks](https://github.com/joaovitorfrv/MVP-Sprint-3_2-API-Tasks) |
| API Bookmarks | [github.com/joaovitorfrv/MVP-Sprint-3_3-API-Bookmarks](https://github.com/joaovitorfrv/MVP-Sprint-3_3-API-Bookmarks) |
| API Events | [github.com/joaovitorfrv/MVP-Sprint-3_4-API-Events](https://github.com/joaovitorfrv/MVP-Sprint-3_4-API-Events) |
| API Gateway | [github.com/joaovitorfrv/MVP-Sprint-3_5-API-Gateway](https://github.com/joaovitorfrv/MVP-Sprint-3_5-API-Gateway) |

## 🛠️ Instruções de Execução

Existem duas formas de executar o projeto: modo manual (Python com ambiente virtual) ou modo completo (Docker).

### Modo Manual (Python + venv)

#### 1. Clone os repositórios

```bash
# Clone o repositório frontend (este repositório)
git clone [URL_DO_REPOSITORIO_FRONTEND] frontend
cd frontend

# Clone os repositórios das APIs
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_2-API-Tasks api-tasks
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_3-API-Bookmarks api-bookmarks
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_4-API-Events api-events
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_5-API-Gateway api-gateway
```

#### 2. Configuração e execução de cada API

Para cada uma das APIs (Tasks, Bookmarks, Events e Gateway), siga os passos abaixo:

##### API Tasks (localhost:5001)

```bash
cd api-tasks

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o serviço
python app.py
```

##### API Bookmarks (localhost:5002)

```bash
cd api-bookmarks

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o serviço
python app.py
```

##### API Events (localhost:5003)

```bash
cd api-events

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o serviço
python app.py
```

##### API Gateway (localhost:5000)

```bash
cd api-gateway

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o serviço
python app.py
```

#### 3. Configuração e execução do Frontend (localhost:8080)

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação
npm run serve
```

### Modo Docker

O Docker permite executar todo o ambiente de forma isolada e padronizada.

#### 1. Clone os repositórios

```bash
# Clone o repositório frontend (este repositório)
git clone [URL_DO_REPOSITORIO_FRONTEND] frontend
cd frontend

# Clone os repositórios das APIs
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_2-API-Tasks api-tasks
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_3-API-Bookmarks api-bookmarks
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_4-API-Events api-events
git clone https://github.com/joaovitorfrv/MVP-Sprint-3_5-API-Gateway api-gateway
```

#### 2. Criar rede Docker

```bash
docker network create api-network
```

#### 3. Build e execução dos containers

Construa e execute os containers na seguinte ordem:

##### API Tasks

```bash
cd api-tasks
docker build -t api-tasks .
docker run -d -p 5001:5001 --name api-tasks --network api-network api-tasks
```

##### API Bookmarks

```bash
cd api-bookmarks
docker build -t api-bookmarks .
docker run -d -p 5002:5002 --name api-bookmarks --network api-network api-bookmarks
```

##### API Events

```bash
cd api-events
docker build -t api-events .
docker run -d -p 5003:5003 --name api-events --network api-network api-events
```

##### API Gateway

```bash
cd api-gateway
docker build -t api-gateway .
docker run -d -p 5000:5000 --name api-gateway --network api-network api-gateway
```

##### Frontend

```bash
cd frontend
docker build -t frontend .
docker run -d -p 8080:8080 --name frontend --network api-network frontend
```

#### 4. Acesso à aplicação

Após a execução de todos os containers, a aplicação estará disponível nos seguintes endereços:

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **API Gateway**: [http://localhost:5000](http://localhost:5000)

## 📌 Endpoints Principais

### API Gateway (localhost:5000)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/status` | GET | Verifica o status do gateway e conectividade com os microsserviços |

### Tasks (via Gateway)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/tasks` | GET | Lista todas as tarefas |
| `/api/tasks` | POST | Cria uma nova tarefa |
| `/api/tasks/` | GET | Obtém uma tarefa específica |
| `/api/tasks/` | PUT | Atualiza uma tarefa |
| `/api/tasks/` | DELETE | Remove uma tarefa |

### Bookmarks (via Gateway)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/bookmarks` | GET | Lista todos os favoritos |
| `/api/bookmarks` | POST | Cria um novo favorito |
| `/api/bookmarks/` | GET | Obtém um favorito específico |
| `/api/bookmarks/` | PUT | Atualiza um favorito |
| `/api/bookmarks/` | DELETE | Remove um favorito |

### Events (via Gateway)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/events` | GET | Lista todos os eventos |
| `/api/events` | POST | Cria um novo evento |
| `/api/events/` | GET | Obtém um evento específico |
| `/api/events/` | PUT | Atualiza um evento |
| `/api/events/` | DELETE | Remove um evento |

## 💡 Objetivo do Projeto

Este projeto foi desenvolvido como experimento acadêmico para demonstrar e aplicar conceitos de:

- **Arquitetura de Microsserviços**: Divisão de responsabilidades em serviços independentes
- **API Gateway**: Implementação de ponto único de entrada para todos os serviços
- **Flask + REST**: Utilização do framework Flask para criação de APIs RESTful
- **Docker**: Containerização dos serviços para facilitar implantação e escalabilidade
- **Comunicação entre Serviços**: Implementação de padrões de comunicação entre microsserviços
- **Integração Frontend**: Desenvolvimento de interface que consome múltiplos serviços

## 📋 Requisitos

- Python 3.8+
- Node.js 14+
- Docker e Docker Compose (para modo Docker)
- Navegador web moderno

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico por João Vitor M. Frugiuele.

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.
