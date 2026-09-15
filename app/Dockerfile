# syntax=docker/dockerfile:1
FROM ghcr.io/cirruslabs/flutter:stable AS build

WORKDIR /app

COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get

COPY . .

ARG API_BASE_URL
RUN flutter build web --release --dart-define=API_BASE_URL=${API_BASE_URL}

FROM nginx:1.28-alpine

ARG FRONTEND_PORT
ENV FRONTEND_PORT=${FRONTEND_PORT}
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/build/web /usr/share/nginx/html

EXPOSE ${FRONTEND_PORT}
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider "http://127.0.0.1:${FRONTEND_PORT}" || exit 1
