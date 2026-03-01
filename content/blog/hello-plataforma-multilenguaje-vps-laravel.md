---
title: "HE-LLO: despliegue de una plataforma multilenguaje en VPS con Laravel, Vue.js y Docker"
title_en: "HE-LLO: deploying a multilanguage platform on VPS with Laravel, Vue.js and Docker"
date: "2025-02-20"
tags: ["Laravel", "Vue.js", "Docker", "DevOps", "VPS", "Nginx"]
description: "Cómo configuré y desplegué desde cero la plataforma web de HE-LLO S.A. en un VPS: stack LEMP containerizado con Docker, Nginx como reverse proxy, SSL automático, variables de entorno y CI manual con Git hooks."
description_en: "How I configured and deployed HE-LLO S.A.'s web platform on a VPS from scratch: LEMP stack containerized with Docker, Nginx as reverse proxy, automatic SSL, environment variables and manual CI with Git hooks."
---

## Contexto

Durante mi tiempo en **HE-LLO S.A.** (2022–2023), participé en el diseño y despliegue de la plataforma web corporativa: una aplicación multilenguaje construida con **Laravel** en el backend y **Vue.js** en el frontend.

El reto técnico principal no fue el código en sí, sino llevar esa aplicación a producción de forma ordenada, reproducible y segura sobre un VPS, usando prácticamente el mismo stack con el que trabajo hoy en mi sitio personal. Este artículo documenta esa experiencia.

---

## El stack

| Capa | Tecnología |
|------|-----------|
| Backend API | Laravel 10 (PHP 8.2) |
| Frontend | Vue.js 3 + Vite |
| Base de datos | MySQL 8.0 |
| Servidor web | Nginx 1.25 |
| Containerización | Docker + Docker Compose |
| SSL | Let's Encrypt + Certbot |
| OS del VPS | Ubuntu 22.04 LTS |
| Proveedor VPS | DigitalOcean (Droplet 2 vCPU / 4 GB RAM) |

El nombre del stack es **LEMP**: Linux + (E)Nginx + MySQL + PHP. Containerizado, cada servicio corre en su propio contenedor con recursos aislados.

---

## Arquitectura del proyecto

```
he-llo-app/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── nginx/
│   └── conf.d/
│       └── app.conf
├── backend/                # Laravel
│   ├── Dockerfile
│   └── ...
└── frontend/               # Vue.js
    ├── Dockerfile
    └── ...
```

La separación entre `docker-compose.yml` (desarrollo) y `docker-compose.prod.yml` (producción) es clave: permite tener hot-reload en local sin contaminar la configuración de producción.

---

## Dockerfiles

### Backend — Laravel (PHP-FPM)

```dockerfile
# backend/Dockerfile
FROM php:8.2-fpm-alpine

# Dependencias del sistema
RUN apk add --no-cache \
    bash curl git zip unzip \
    libpng-dev libjpeg-dev freetype-dev \
    oniguruma-dev libxml2-dev

# Extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
       pdo pdo_mysql mbstring exif pcntl bcmath gd xml opcache

# Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar código y dependencias
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permisos de Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
```

### Frontend — Vue.js (build estático)

```dockerfile
# frontend/Dockerfile
# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: servir con Nginx
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

El build multi-etapa es importante: la imagen final solo contiene el HTML/CSS/JS compilado y Nginx. No lleva Node.js, `node_modules` ni código fuente.

```nginx
# nginx-spa.conf — manejo de rutas en SPA (Vue Router)
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Docker Compose de producción

```yaml
# docker-compose.prod.yml
services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - backend
      - frontend
    restart: always

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
    entrypoint: >
      sh -c "trap exit TERM;
             while :; do
               certbot renew --webroot -w /var/www/certbot --quiet;
               sleep 12h & wait $${!};
             done"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    env_file: .env
    volumes:
      - ./backend/storage:/var/www/html/storage
    depends_on:
      db:
        condition: service_healthy
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always

  db:
    image: mysql:8.0
    env_file: .env
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

volumes:
  db_data:
```

El `healthcheck` en MySQL es fundamental: evita que el backend intente conectarse antes de que la base de datos esté lista, un error silencioso muy común en primeros despliegues.

---

## Configuración de Nginx en el VPS

```nginx
# nginx/conf.d/app.conf

# Redirigir HTTP → HTTPS
server {
    listen 80;
    server_name he-llo.com www.he-llo.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name he-llo.com www.he-llo.com;

    ssl_certificate     /etc/letsencrypt/live/he-llo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/he-llo.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Frontend Vue.js
    location / {
        proxy_pass         http://frontend:80;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Laravel — prefijo /api
    location /api/ {
        proxy_pass         http://backend:9000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        fastcgi_pass       backend:9000;
        fastcgi_index      index.php;
        include            fastcgi_params;
        fastcgi_param      SCRIPT_FILENAME /var/www/html/public/index.php;
    }
}
```

El routing es simple: todo lo que empieza con `/api/` va al contenedor de Laravel (PHP-FPM), el resto va al frontend estático de Vue.

---

## Variables de entorno y seguridad

Nunca se sube el `.env` al repositorio. En el VPS se crea manualmente:

```bash
# En el VPS, dentro del directorio del proyecto
cp .env.example .env
nano .env   # editar los valores reales
```

```bash
# .env (estructura, sin valores reales)
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...          # generada con php artisan key:generate
APP_URL=https://he-llo.com

DB_CONNECTION=mysql
DB_HOST=db                  # nombre del servicio en Docker
DB_PORT=3306
DB_DATABASE=hello_db
DB_USERNAME=hello_user
DB_PASSWORD=...

REDIS_HOST=redis
REDIS_PORT=6379

# i18n — idiomas disponibles
APP_LOCALE=es
APP_FALLBACK_LOCALE=en
APP_SUPPORTED_LOCALES=es,en
```

> El `DB_HOST=db` apunta al nombre del servicio Docker, no a `localhost`. Dentro de la red de Docker Compose, los servicios se resuelven por su nombre.

---

## Internacionalización (i18n) en Laravel + Vue

La plataforma soporta español e inglés. La estrategia fue:

**Backend (Laravel)**: el idioma se detecta por el header `Accept-Language` o por un parámetro en la URL (`/es/...` / `/en/...`). El middleware `SetLocale` aplica `App::setLocale()` en cada request.

```php
// app/Http/Middleware/SetLocale.php
public function handle(Request $request, Closure $next): Response
{
    $locale = $request->segment(1);   // extrae 'es' o 'en' de la URL

    if (in_array($locale, config('app.supported_locales'))) {
        App::setLocale($locale);
    }

    return $next($request);
}
```

**Frontend (Vue.js)**: usé `vue-i18n` con archivos de traducción por idioma. El idioma activo se persiste en `localStorage` y se sincroniza con la URL.

```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') ?? 'es',
  fallbackLocale: 'en',
  messages: { es, en },
})
```

---

## CI manual con Git hooks

Sin un sistema de CI/CD formal, implementé un **post-receive hook** en Git para automatizar el despliegue al hacer push a la rama `main`.

```bash
# En el VPS: crear un repositorio bare
mkdir -p /srv/git/hello.git
cd /srv/git/hello.git
git init --bare
```

```bash
# /srv/git/hello.git/hooks/post-receive
#!/bin/bash
set -e

TARGET="/srv/app/hello"
GIT_DIR="/srv/git/hello.git"
BRANCH="main"

while read oldrev newrev ref; do
    if [[ $ref == "refs/heads/$BRANCH" ]]; then
        echo "▶ Desplegando rama $BRANCH..."

        git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH

        cd $TARGET

        echo "▶ Instalando dependencias PHP..."
        docker compose -f docker-compose.prod.yml exec -T backend \
            composer install --no-dev --optimize-autoloader

        echo "▶ Ejecutando migraciones..."
        docker compose -f docker-compose.prod.yml exec -T backend \
            php artisan migrate --force

        echo "▶ Limpiando caché..."
        docker compose -f docker-compose.prod.yml exec -T backend \
            php artisan config:cache
        docker compose -f docker-compose.prod.yml exec -T backend \
            php artisan route:cache

        echo "▶ Reconstruyendo frontend..."
        docker compose -f docker-compose.prod.yml build frontend

        echo "▶ Reiniciando servicios..."
        docker compose -f docker-compose.prod.yml up -d --no-deps frontend backend

        echo "✅ Despliegue completado."
    fi
done
```

```bash
chmod +x /srv/git/hello.git/hooks/post-receive
```

Desde el equipo local, el despliegue se reduce a:

```bash
# Agregar el remoto del VPS (solo una vez)
git remote add vps usuario@IP_VPS:/srv/git/hello.git

# Desplegar
git push vps main
```

---

## Primer despliegue en el VPS

```bash
# 1. Conectarse al VPS
ssh usuario@IP_VPS

# 2. Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 3. Clonar el proyecto
git clone /srv/git/hello.git /srv/app/hello
cd /srv/app/hello

# 4. Crear .env de producción
cp .env.example .env && nano .env

# 5. Obtener certificado SSL (primer lanzamiento)
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d he-llo.com -d www.he-llo.com \
  --email jhonnyalbert245@gmail.com \
  --agree-tos --no-eff-email

# 6. Levantar la stack completa
docker compose -f docker-compose.prod.yml up -d

# 7. Ejecutar migraciones iniciales
docker compose -f docker-compose.prod.yml exec backend \
  php artisan migrate --seed
```

---

## Lecciones aprendidas

**Docker Compose en producción funciona perfectamente** para proyectos de esta escala. No necesitas Kubernetes para una plataforma con tráfico moderado; la complejidad operacional no vale la pena.

**Los healthchecks en la base de datos** evitaron al menos 3 bugs de race condition durante el desarrollo inicial. Son una línea de YAML que salva horas de debugging.

**El hook post-receive** es elegante para equipos pequeños. No requiere ninguna herramienta externa y el flujo `git push vps main` es intuitivo para cualquier desarrollador.

**La separación de archivos Compose** (dev vs prod) parece overhead al principio pero es fundamental: en local quieres hot-reload, logs verbosos y sin SSL; en producción quieres lo contrario.

---

*¿Tienes preguntas sobre este stack o el despliegue en VPS? Escríbeme en [LinkedIn](https://www.linkedin.com/in/sammy2455/) o por [email](mailto:jhonnyalbert245@gmail.com).*
