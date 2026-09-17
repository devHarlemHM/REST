# REST — orquestador de despliegue

Este repositorio integra tres proyectos mediante submodulos Git: `app` (Flutter), `admin` (React/Vite) y `backend` (Express).

| Rama de REST | Entorno | API |
|---|---|---|
| `develop` | test | `https://api-test.restapp.site` |
| `main` | production | `https://api.restapp.site` |

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
docker compose --env-file .env up -d --build
```

## Pruebas

```bash
cp env/test.example .env
# Reemplaza los secretos.
docker compose --env-file .env up -d --build
```

Los proyectos y volumenes son independientes. Solo comparten `rest-edge`; PostgreSQL, Ollama y Sentiment permanecen en redes internas separadas.

## Actualizacion

```bash
git pull --ff-only
git submodule sync --recursive
git submodule update --init --recursive
docker compose --env-file .env up -d --build
```

No ejecutes `backend/docker-compose.yml`: el Compose raiz es la unica orquestacion del VPS.
