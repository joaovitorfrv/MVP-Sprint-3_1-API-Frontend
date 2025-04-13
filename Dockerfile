FROM nginx:alpine

# Remover a configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos do frontend
COPY . /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
