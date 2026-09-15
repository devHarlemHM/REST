FROM nginx:1.28-alpine

ARG HTTP_PORT
ARG HTTPS_PORT
ENV HTTP_PORT=${HTTP_PORT} HTTPS_PORT=${HTTPS_PORT}

COPY templates/ /opt/restapp/templates/
COPY proxy_params /etc/nginx/proxy_params
COPY entrypoint.sh /opt/restapp/entrypoint.sh
RUN chmod +x /opt/restapp/entrypoint.sh

ENTRYPOINT ["/opt/restapp/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider "http://127.0.0.1:${HTTP_PORT}/nginx-health" || exit 1
