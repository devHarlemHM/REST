# REST — Orquestador de despliegue

Este repositorio integra mediante submódulos Git:

- `app`: aplicación Flutter.
- `admin`: panel React/Vite.
- `backend`: API Express.

## 1) Cómo se selecciona la API

Las URLs no están definidas en el código de los frontends. Cada instalación
conserva un `.env` privado y la variable `API_URL` decide a qué API se conectan
`app` y `admin`.

Docker Compose realiza este mapeo durante el build:

| `.env` del orquestador | Flutter | Panel |
|---|---|---|
| `API_URL` | `API_BASE_URL` | `VITE_API_URL` |

Por tanto, no se modifica código para cambiar de entorno: se cambia `API_URL`
en el `.env` correspondiente y se reconstruyen los dos frontends.

| Instalación | Rama | `API_URL` |
|---|---|---|
| Local | `develop` | `http://localhost:3000` |
| Pruebas | `develop` | `https://api-test.restapp.site` |
| Producción | `main` | `https://api.restapp.site` |
| Universidad | según corresponda | `http://179.197.239.216:3000` |

La URL pública de una API no es un secreto: cualquier navegador puede verla en
el tráfico de red. Contraseñas, tokens y llaves sí deben permanecer únicamente
en `.env` y nunca se deben subir a Git.

## 2) Archivos `.env` del VPS

Cada clon conserva su propio `.env`. Los archivos `env/test.example` y
`env/production.example` son plantillas sin secretos; no reemplaces el `.env`
real durante una actualización.

Pruebas (`~/rest/rest-develop/.env`):

```dotenv
COMPOSE_PROJECT_NAME=rest-test
NODE_ENV=testing
API_URL=https://api-test.restapp.site
```

Producción (`~/rest/rest-main/.env`):

```dotenv
COMPOSE_PROJECT_NAME=rest-production
NODE_ENV=production
API_URL=https://api.restapp.site
```

El resto de variables y secretos actuales se conservan sin cambios. Para
proteger y comprobar solo la URL:

```bash
chmod 600 .env
grep '^API_URL=' .env
```

## 3) Uso local del orquestador

Crea el `.env` desde una plantilla y establece la URL local:

```bash
cp env/test.example .env
sed -i 's|^API_URL=.*|API_URL=http://localhost:3000|' .env
# Completa POSTGRES_PASSWORD, JWT_SECRET y las demás credenciales.
docker compose --env-file .env up -d --build
```

Para usar otra API, cambia únicamente `API_URL` antes del build:

```dotenv
# Pruebas
API_URL=https://api-test.restapp.site

# Producción
API_URL=https://api.restapp.site

# Universidad
API_URL=http://179.197.239.216:3000
```

Después de cada cambio de URL hay que reconstruir `app` y `admin`, porque las
variables de Vite y Flutter se incorporan al frontend compilado:

```bash
docker compose --env-file .env build --no-cache app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
```

## 4) Gateway compartido

El gateway se inicia una sola vez, normalmente desde producción:

```bash
cd ~/rest/rest-main
cp env/gateway.example .env.gateway
docker compose --env-file .env.gateway -f docker-compose.gateway.yml up -d --build
```

## 5) Actualizar pruebas en el VPS

La ruta actual de pruebas es `~/rest/rest-develop`. El siguiente procedimiento
crea primero una rama de respaldo del commit local y después sincroniza el clon
exactamente con `origin/develop`. El `.env` no se pierde porque está ignorado
por Git.

```bash
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

Esto no recrea `backend`, PostgreSQL, Ollama ni Sentiment.

## 6) Actualizar producción en el VPS

Ejecuta estos comandos después de integrar `develop` en `main`. Si el clon de
producción tiene otro nombre, sustituye únicamente la primera ruta.

```bash
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

## 7) Verificación y logs

Revisiones desplegadas:

```bash
git log -1 --oneline
git submodule status app admin
```

Logs de pruebas:

```bash
docker logs --tail=100 -f rest-test-app-1
docker logs --tail=100 -f rest-test-admin-1
docker logs --tail=100 -f rest-test-backend-1
docker logs --tail=100 -f rest-test-ollama-1
```

Logs de producción:

```bash
docker logs --tail=100 -f rest-production-app-1
docker logs --tail=100 -f rest-production-admin-1
docker logs --tail=100 -f rest-production-backend-1
docker logs --tail=100 -f rest-production-ollama-1
```

Comprobar las APIs públicas:

```bash
curl -fsS https://api-test.restapp.site/health
curl -fsS https://api.restapp.site/health
```

## 8) Actualizar todo el entorno

Solo cuando también se deban reconstruir backend y servicios internos:

```bash
docker compose --env-file .env up -d --build
```

No ejecutes `backend/docker-compose.yml` en el VPS; el `docker-compose.yml` de
este repositorio es el orquestador de cada entorno.
