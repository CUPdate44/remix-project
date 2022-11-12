FROM nginx:1.23.2-alpine
WORKDIR /

COPY ./temp_publish_docker/ /usr/share/nginx/html/

EXPOSE 80
