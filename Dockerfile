# Etapa base: usa o Nginx como servidor web
FROM nginx:alpine

# Copia seus arquivos estáticos para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta (opcional, já que o Nginx usa 80)
EXPOSE 80
