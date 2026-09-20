# REST — orquestador de despliegue

Este repositorio integra tres proyectos mediante submodulos Git: `app` (Flutter), `admin` (React/Vite) y `backend` (Express).

| Rama de REST | Entorno | API |
|---|---|---|
| `develop` | test | `https://api-test.restapp.site` |
| `main` | production | `https://api.restapp.site` |

Cada clon usa un unico `.env` privado. `API_URL` se inyecta como
`API_BASE_URL` en Flutter y como `VITE_API_URL` en el Panel. Por eso ambos
frontends quedan apuntando a la misma API seleccionada por el orquestador.

## Clonado y estructura del VPS

```bash
git clone --recurse-submodules https://github.com/devHarlemHM/REST.git
git submodule update --init --recursive
```

```text
/opt/rest/test        -> rama develop
/opt/rest/production  -> rama main
```

## Gateway compartido

Los seis dominios apuntan a `179.197.239.216`. El gateway se inicia una sola vez, normalmente desde el clon de produccion:

```bash
cp env/gateway.example .env.gateway
docker compose --env-file .env.gateway -f docker-compose.gateway.yml up -d --build
```

Tras resolver DNS, ejecuta el perfil `ssl` para solicitar el certificado y recrea Nginx para activar HTTPS.

## Produccion

```bash
cp env/production.example .env
# Reemplaza los secretos.
chmod 600 .env
grep '^API_URL=' .env
docker compose --env-file .env up -d --build
```

La verificacion debe mostrar `API_URL=https://api.restapp.site`.

## Pruebas

```bash
cp env/test.example .env
# Reemplaza los secretos.
chmod 600 .env
grep '^API_URL=' .env
docker compose --env-file .env up -d --build
```

La verificacion debe mostrar `API_URL=https://api-test.restapp.site`.

Los proyectos y volumenes son independientes. Solo comparten `rest-edge`; PostgreSQL, Ollama y Sentiment permanecen en redes internas separadas.

## Actualizacion

### Solo frontends de pruebas

Actualiza `app` y `admin` desde los commits fijados en `REST/develop` y los
reconstruye con `API_URL=https://api-test.restapp.site` definido en
`/opt/rest/test/.env`. `--no-deps` evita recrear el backend y sus servicios:

```bash
cd /opt/rest/test
git switch develop
git pull --ff-only origin develop
git submodule sync --recursive
git submodule update --init --recursive app admin
grep '^API_URL=' .env
docker compose --env-file .env build --pull app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
docker compose --env-file .env ps app admin
```

### Solo frontends de produccion

Ejecuta este bloque cuando los cambios ya hayan sido integrados en `main`.
El archivo `/opt/rest/production/.env` debe conservar
`API_URL=https://api.restapp.site`:

```bash
cd /opt/rest/production
git switch main
git pull --ff-only origin main
git submodule sync --recursive
git submodule update --init --recursive app admin
grep '^API_URL=' .env
docker compose --env-file .env build --pull app admin
docker compose --env-file .env up -d --force-recreate --no-deps app admin
docker compose --env-file .env ps app admin
```

Para actualizar todo el entorno, incluida la infraestructura del backend, usa
`docker compose --env-file .env up -d --build` sin limitar los servicios.

No ejecutes `backend/docker-compose.yml`: el Compose raiz es la unica orquestacion del VPS.
