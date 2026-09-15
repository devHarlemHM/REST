#!/bin/sh
set -eu

: "${ADMIN_DOMAIN:?ADMIN_DOMAIN is required}"
: "${APP_DOMAIN:?APP_DOMAIN is required}"
: "${API_DOMAIN:?API_DOMAIN is required}"
: "${TEST_ADMIN_DOMAIN:?TEST_ADMIN_DOMAIN is required}"
: "${TEST_APP_DOMAIN:?TEST_APP_DOMAIN is required}"
: "${TEST_API_DOMAIN:?TEST_API_DOMAIN is required}"
: "${HTTP_PORT:?HTTP_PORT is required}"
: "${HTTPS_PORT:?HTTPS_PORT is required}"
: "${ADMIN_PORT:?ADMIN_PORT is required}"
: "${APP_PORT:?APP_PORT is required}"
: "${TEST_ADMIN_PORT:?TEST_ADMIN_PORT is required}"
: "${TEST_APP_PORT:?TEST_APP_PORT is required}"
: "${BACKEND_PORT:?BACKEND_PORT is required}"
: "${TEST_BACKEND_PORT:?TEST_BACKEND_PORT is required}"

if [ -f "/etc/letsencrypt/live/${ADMIN_DOMAIN}/fullchain.pem" ]; then
  template=/opt/restapp/templates/https.conf.template
else
  template=/opt/restapp/templates/http.conf.template
fi

envsubst '${HTTP_PORT} ${HTTPS_PORT} ${ADMIN_DOMAIN} ${APP_DOMAIN} ${API_DOMAIN} ${TEST_ADMIN_DOMAIN} ${TEST_APP_DOMAIN} ${TEST_API_DOMAIN} ${ADMIN_PORT} ${APP_PORT} ${TEST_ADMIN_PORT} ${TEST_APP_PORT} ${BACKEND_PORT} ${TEST_BACKEND_PORT}' < "$template" > /etc/nginx/conf.d/default.conf
exec "$@"
