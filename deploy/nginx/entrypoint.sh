#!/bin/sh
set -eu

: "${ADMIN_DOMAIN:?ADMIN_DOMAIN is required}"
: "${APP_DOMAIN:?APP_DOMAIN is required}"

if [ -f "/etc/letsencrypt/live/${ADMIN_DOMAIN}/fullchain.pem" ]; then
  template=/opt/restapp/templates/https.conf.template
else
  template=/opt/restapp/templates/http.conf.template
fi

envsubst '${ADMIN_DOMAIN} ${APP_DOMAIN}' < "$template" > /etc/nginx/conf.d/default.conf
exec "$@"
