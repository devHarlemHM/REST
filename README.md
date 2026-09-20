# REST — Orquestador de despliegue

Este repositorio integra mediante submodulos Git:

- `app`: aplicación Flutter.
- `admin`: Panel React/Vite.
- `backend`: API Express.

## 1) Entornos desplegados

| Clon | Rama | `APP_ENV` | `API_URL` |
|---|---|---|---|
| `/opt/rest/test` | `develop` | `test` | `https://api-test.restapp.site` |
| `/opt/rest/production` | `main` | `production` | `https://api.restapp.site` |

`APP_ENV` selecciona el entorno y `API_URL` fija la URL exacta con prioridad.
El Compose las inyecta así:

| Orquestador | Flutter | Panel |
|---|---|---|
| `APP_ENV` | `API_ENV` | `VITE_API_ENV` |
| `API_URL` | `API_BASE_URL` | `VITE_API_URL` |

Por esta razón los contenedores del VPS no utilizan la configuración local
predeterminada de los frontends.

## 2) Archivo `.env`

Cada clon del VPS conserva un único `.env` privado. No reemplaces el archivo
durante una actualización porque contiene secretos.

Pruebas debe incluir:

```dotenv
APP_ENV=test
API_URL=https://api-test.restapp.site
```

Produccion debe incluir:

```dotenv
APP_ENV=production
API_URL=https://api.restapp.site
```

Protege el archivo y verifica solamente las variables publicas:

```bash
chmod 600 .env
grep -E '^(APP_ENV|API_URL)=' .env
```

## 3) Clonado inicial

```bash
git clone --recurse-submodules https://github.com/devHarlemHM/REST.git
git submodule update --init --recursive
```

Estructura esperada:

```text
/opt/rest/test        -> rama develop
/opt/rest/production  -> rama main
```

## 4) Gateway compartido

Los dominios públicos apuntan al gateway compartido. Se inicia una sola vez,
normalmente desde el clon de producción:

```bash
cd /opt/rest/production
cp env/gateway.example .env.gateway
docker compose --env-file .env.gateway -f docker-compose.gateway.yml up -d --build
```

## 5) Despliegue inicial de pruebas

```bash
cd /opt/rest/test
cp env/test.example .env
# Reemplaza POSTGRES_PASSWORD, JWT_SECRET y las demás credenciales.
chmod 600 .env
grep -E '^(APP_ENV|API_URL)=' .env
docker compose --env-file .env up -d --build
```

Debe mostrar:

```text
APP_ENV=test
API_URL=https://api-test.restapp.site
```

## 6) Despliegue inicial de produccion

```bash
cd /opt/rest/production
cp env/production.example .env
# Reemplaza POSTGRES_PASSWORD, JWT_SECRET y las demás credenciales.
chmod 600 .env
grep -E '^(APP_ENV|API_URL)=' .env
docker compose --env-file .env up -d --build
```

Debe mostrar:

```text
APP_ENV=production
API_URL=https://api.restapp.site
```

## 7) Actualizar y recrear frontends de pruebas

Este procedimiento actualiza solamente `app` y `admin`. No recrea backend,
PostgreSQL, Ollama ni Sentiment.

```bash
cd /opt/rest/test

git switch develop
git pull --ff-only origin develop
git submodule sync --recursive
git submodule update --init --recursive app admin

grep -E '^(APP_ENV|API_URL)=' .env

docker compose --env-file .env build --pull --no-cache app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
docker compose --env-file .env ps app admin
```

## 8) Actualizar y recrear frontends de produccion

Ejecuta este procedimiento después de integrar los cambios en `main`:

```bash
cd /opt/rest/production

git switch main
git pull --ff-only origin main
git submodule sync --recursive
git submodule update --init --recursive app admin

grep -E '^(APP_ENV|API_URL)=' .env

docker compose --env-file .env build --pull --no-cache app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
docker compose --env-file .env ps app admin
```

## 9) Verificacion

Pruebas:

```bash
docker logs --tail=100 rest-test-app-1
docker logs --tail=100 rest-test-admin-1
curl -fsS https://api-test.restapp.site/health
```

Produccion:

```bash
docker logs --tail=100 rest-production-app-1
docker logs --tail=100 rest-production-admin-1
curl -fsS https://api.restapp.site/health
```

Para confirmar las revisiones desplegadas:

```bash
git log -1 --oneline
git submodule status app admin
```

## 10) Actualizar todo el entorno

Para reconstruir también backend y servicios internos:

```bash
docker compose --env-file .env up -d --build
```

No ejecutes `backend/docker-compose.yml`; el Compose raíz es la única
orquestación del VPS.
