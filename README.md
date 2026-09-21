# REST

Orquestador principal del proyecto. Integra estos repositorios como submódulos:

- `app`: aplicación Flutter.
- `admin`: panel React/Vite.
- `backend`: API Express.

## Índice

1. [Cómo se selecciona la API](#1-cómo-se-selecciona-la-api)
2. [Preparar el proyecto](#2-preparar-el-proyecto)
3. [Ejecutar desde la terminal](#3-ejecutar-desde-la-terminal)
4. [Ejecutar los frontends con Docker](#4-ejecutar-los-frontends-con-docker)
5. [Comandos 2 en 1](#5-comandos-2-en-1-cambiar-url-y-levantar)
6. [Seguridad de los `.env`](#6-seguridad-de-los-env)
7. [Actualizar pruebas en el VPS](#7-actualizar-pruebas-en-el-vps)
8. [Actualizar producción en el VPS](#8-actualizar-producción-en-el-vps)
9. [Logs y verificación](#9-logs-y-verificación)

## 1) Cómo se selecciona la API

Las URLs no están escritas en el código de los frontends. Cada frontend lee su
propio `.env`:

| Entorno | URL de la API |
|---|---|
| Local | `http://localhost:3000` |
| Pruebas | `https://api-test.restapp.site` |
| Producción | `https://api.restapp.site` |
| Universidad | `http://179.197.239.216:3000` |

Variables utilizadas:

| Lugar | Variable |
|---|---|
| App Flutter | `API_BASE_URL` |
| Panel React/Vite | `VITE_API_URL` |
| Orquestador Docker | `API_URL` |

En el orquestador, Docker Compose toma `API_URL` y la entrega automáticamente
a ambos frontends durante el build:

```text
API_URL ──> API_BASE_URL  (Flutter)
        └─> VITE_API_URL  (Panel)
```

Después de cambiar una URL hay que volver a ejecutar o reconstruir el frontend.

## 2) Preparar el proyecto

### Clonado inicial

```powershell
git clone --recurse-submodules https://github.com/devHarlemHM/REST.git
cd REST
git switch develop
git submodule update --init --recursive
```

Si el repositorio ya estaba clonado:

```powershell
git pull origin develop
git submodule sync --recursive
git submodule update --init --recursive
```

### Requisitos

- Flutter SDK para ejecutar `app`.
- Node.js 24 y npm para ejecutar `admin`.
- Docker Desktop si se utilizarán contenedores.
- Una API disponible: local, pruebas o producción.

## 3) Ejecutar desde la terminal

Abre dos terminales desde la raíz del repositorio: una para Flutter y otra para
el panel.

### 3.1) Conectarse a Local

Primero levanta el backend local con Docker:

```powershell
cd backend
docker compose up -d --build
docker compose ps
```

La API queda disponible en `http://localhost:3000`. La primera ejecución puede
tardar mientras descarga e inicializa los modelos.

Terminal 1 — Flutter:

```powershell
cd app

@'
API_BASE_URL=http://localhost:3000
ANDROID_API_BASE_URL=http://10.0.2.2:3000
'@ | Set-Content .env

flutter pub get
flutter run --dart-define-from-file=.env
```

Terminal 2 — Panel:

```powershell
cd admin

'VITE_API_URL=http://localhost:3000' | Set-Content .env

npm install
npm run dev
```

El panel queda disponible en `http://localhost:5173`.

### 3.2) Conectarse a Pruebas

Terminal 1 — Flutter:

```powershell
cd app
'API_BASE_URL=https://api-test.restapp.site' | Set-Content .env
flutter run --dart-define-from-file=.env
```

Terminal 2 — Panel:

```powershell
cd admin
'VITE_API_URL=https://api-test.restapp.site' | Set-Content .env
npm run dev
```

### 3.3) Conectarse a Producción

> Producción contiene datos reales. Utiliza esta opción con cuidado.

Terminal 1 — Flutter:

```powershell
cd app
'API_BASE_URL=https://api.restapp.site' | Set-Content .env
flutter run --dart-define-from-file=.env
```

Terminal 2 — Panel:

```powershell
cd admin
'VITE_API_URL=https://api.restapp.site' | Set-Content .env
npm run dev
```

### 3.4) Generar una APK

Primero selecciona el entorno escribiendo la URL correspondiente en
`app/.env`. Después ejecuta:

```powershell
cd app
flutter build apk --release --dart-define-from-file=.env
```

La APK queda en:

```text
app/build/app/outputs/flutter-apk/app-release.apk
```

Para un teléfono físico conectado al backend local, reemplaza `10.0.2.2` por
la IP LAN del computador, por ejemplo `http://192.168.1.100:3000`.

## 4) Ejecutar los frontends con Docker

Los contenedores independientes utilizan los mismos `.env` creados en la
sección anterior.

### Flutter Web

```powershell
cd app
docker compose --env-file .env -p restapp up -d --build --force-recreate
```

Disponible en `http://localhost:8081`.

### Panel

```powershell
cd admin
docker compose --env-file .env -p rest-panel up -d --build --force-recreate
```

Disponible en `http://localhost:8080`.

### Ver logs

```powershell
# Desde app
docker compose --env-file .env -p restapp logs -f app

# Desde admin
docker compose --env-file .env -p rest-panel logs -f admin
```

### Detenerlos

```powershell
# Desde app
docker compose --env-file .env -p restapp down

# Desde admin
docker compose --env-file .env -p rest-panel down

# Desde backend, si también levantaste la API local
docker compose down
```

## 5) Comandos 2 en 1: cambiar URL y levantar

Ejecuta estos comandos desde la raíz del repositorio. Cada comando actualiza el
`.env` y levanta inmediatamente el frontend. Para ejecución por terminal abre
dos terminales: una para Flutter y otra para el panel.

### 5.1) Local desde la terminal

Terminal 1 — Flutter:

```powershell
@('API_BASE_URL=http://localhost:3000','ANDROID_API_BASE_URL=http://10.0.2.2:3000') | Set-Content app/.env; Set-Location app; flutter run --dart-define-from-file=.env
```

Terminal 2 — Panel:

```powershell
'VITE_API_URL=http://localhost:3000' | Set-Content admin/.env; Set-Location admin; npm run dev
```

### 5.2) Pruebas desde la terminal

Terminal 1 — Flutter:

```powershell
'API_BASE_URL=https://api-test.restapp.site' | Set-Content app/.env; Set-Location app; flutter run --dart-define-from-file=.env
```

Terminal 2 — Panel:

```powershell
'VITE_API_URL=https://api-test.restapp.site' | Set-Content admin/.env; Set-Location admin; npm run dev
```

### 5.3) Producción desde la terminal

> Estos comandos se conectan a datos reales de producción.

Terminal 1 — Flutter:

```powershell
'API_BASE_URL=https://api.restapp.site' | Set-Content app/.env; Set-Location app; flutter run --dart-define-from-file=.env
```

Terminal 2 — Panel:

```powershell
'VITE_API_URL=https://api.restapp.site' | Set-Content admin/.env; Set-Location admin; npm run dev
```

### 5.4) Local con Docker

Este único comando configura y levanta los dos frontends:

```powershell
@('API_BASE_URL=http://localhost:3000','ANDROID_API_BASE_URL=http://10.0.2.2:3000') | Set-Content app/.env; 'VITE_API_URL=http://localhost:3000' | Set-Content admin/.env; docker compose --env-file app/.env -f app/docker-compose.yml -p restapp up -d --build --force-recreate; docker compose --env-file admin/.env -f admin/docker-compose.yml -p rest-panel up -d --build --force-recreate
```

### 5.5) Pruebas con Docker

```powershell
'API_BASE_URL=https://api-test.restapp.site' | Set-Content app/.env; 'VITE_API_URL=https://api-test.restapp.site' | Set-Content admin/.env; docker compose --env-file app/.env -f app/docker-compose.yml -p restapp up -d --build --force-recreate; docker compose --env-file admin/.env -f admin/docker-compose.yml -p rest-panel up -d --build --force-recreate
```

### 5.6) Producción con Docker

> Este comando conecta ambos contenedores a la API real de producción.

```powershell
'API_BASE_URL=https://api.restapp.site' | Set-Content app/.env; 'VITE_API_URL=https://api.restapp.site' | Set-Content admin/.env; docker compose --env-file app/.env -f app/docker-compose.yml -p restapp up -d --build --force-recreate; docker compose --env-file admin/.env -f admin/docker-compose.yml -p rest-panel up -d --build --force-recreate
```

Después de levantar con Docker:

- Flutter Web: `http://localhost:8081`.
- Panel: `http://localhost:8080`.

## 6) Seguridad de los `.env`

- Los `.env` reales están ignorados por Git.
- Solo se versionan archivos `.env.example` sin secretos.
- No subas `POSTGRES_PASSWORD`, `JWT_SECRET`, tokens ni llaves privadas.
- Las URLs de una API consumida por el navegador son públicas por naturaleza.
- Las variables `VITE_*` se incorporan al JavaScript compilado; nunca guardes
  secretos en ellas.

## 7) Actualizar pruebas en el VPS

El clon de pruebas está en `~/rest/rest-develop`. Su `.env` debe conservar:

```dotenv
COMPOSE_PROJECT_NAME=rest-test
NODE_ENV=testing
API_URL=https://api-test.restapp.site
```

No reemplaces el `.env` completo porque contiene los secretos del servidor.

```bash
set -e
cd ~/rest/rest-develop

git status
git branch "backup/vps-test-$(date +%Y%m%d-%H%M%S)"
git fetch origin develop
git switch develop
git reset --hard origin/develop

git submodule sync --recursive
git submodule update --init --recursive --force app admin

grep '^API_URL=' .env
# Debe mostrar: API_URL=https://api-test.restapp.site

docker compose --env-file .env build --pull --no-cache app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
docker compose --env-file .env ps app admin
```

Estos comandos no recrean backend, PostgreSQL, Ollama ni Sentiment.

## 8) Actualizar producción en el VPS

Ejecuta esta sección después de integrar `develop` en `main`. El `.env` de
producción debe conservar:

```dotenv
COMPOSE_PROJECT_NAME=rest-production
NODE_ENV=production
API_URL=https://api.restapp.site
```

```bash
set -e
cd ~/rest/rest-main

git status
git branch "backup/vps-production-$(date +%Y%m%d-%H%M%S)"
git fetch origin main
git switch main
git reset --hard origin/main

git submodule sync --recursive
git submodule update --init --recursive --force app admin

grep '^API_URL=' .env
# Debe mostrar: API_URL=https://api.restapp.site

docker compose --env-file .env build --pull --no-cache app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
docker compose --env-file .env ps app admin
```

## 9) Logs y verificación

### Revisiones desplegadas

```bash
git log -1 --oneline
git submodule status app admin
```

### Pruebas

```bash
docker logs --tail=100 -f rest-test-app-1
docker logs --tail=100 -f rest-test-admin-1
docker logs --tail=100 -f rest-test-backend-1
docker logs --tail=100 -f rest-test-ollama-1
```

### Producción

```bash
docker logs --tail=100 -f rest-production-app-1
docker logs --tail=100 -f rest-production-admin-1
docker logs --tail=100 -f rest-production-backend-1
docker logs --tail=100 -f rest-production-ollama-1
```

### Estado de las APIs

```bash
curl -fsS https://api-test.restapp.site/health
curl -fsS https://api.restapp.site/health
```

## Actualizar todo el entorno del VPS

Solo cuando también sea necesario reconstruir backend y servicios internos:

```bash
docker compose --env-file .env up -d --build
```

No ejecutes `backend/docker-compose.yml` en el VPS. El `docker-compose.yml` de
este repositorio es el orquestador de cada entorno desplegado.
