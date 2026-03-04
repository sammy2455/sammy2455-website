---
title: "HE-LLO: desplegar un sitio Next.js en infraestructura propia — de PM2 a Docker"
title_en: "HE-LLO: deploying a Next.js site on self-hosted infrastructure — from PM2 to Docker"
date: "2021-04-15"
tags: ["Next.js", "Docker", "DevOps", "Proxmox", "PM2", "Nginx"]
description: "Cómo desplegué el sitio de presentación y blog de HE-LLO S.A. en infraestructura propia: contenedor LXC en Proxmox, Nginx Proxy Manager, SSL y la evolución de PM2 a Docker."
description_en: "How I deployed HE-LLO S.A.'s presentation site and blog on self-hosted infrastructure: LXC container in Proxmox, Nginx Proxy Manager, SSL and the evolution from PM2 to Docker."
---

# HE-LLO: desplegar un sitio Next.js en infraestructura propia

El sitio de **HE-LLO S.A.** era algo concreto y acotado: una web de presentación corporativa con blog, construida en **Next.js** alrededor de **2019**.

No era una aplicación compleja. Lo interesante del proyecto no fue la aplicación en sí, sino **cómo la desplegamos**: sin Vercel, sin servicios gestionados, en infraestructura propia detrás del mismo rack donde ya vivía el media server.

El foco real estuvo en dos frentes — el CSS y JS escritos desde cero, y toda la configuración de infraestructura para que el sitio viviera en un contenedor LXC dentro de Proxmox, accesible públicamente con SSL.

---

## Infraestructura compartida

El sitio corre en un servidor separado al del media server, pero comparte la misma capa de red. El tráfico externo sigue el mismo camino:

```
Internet
   │
   ▼
IP pública dedicada
   │
   ▼
Router MikroTik  (NAT / firewall)
   │
   ▼
Nginx Proxy Manager  (SSL / routing)
   │
   ├──▶  Emby (media server)
   └──▶  Proxmox → VM → Contenedor LXC → Next.js
```

Nginx Proxy Manager enruta por dominio: cada subdominio apunta a su servicio correspondiente en la red interna. El certificado SSL se gestiona automáticamente vía Let's Encrypt desde el mismo NPM.

---

## Proxmox: el entorno

El servidor que aloja el sitio corre **Proxmox VE**. Dentro se creó una VM con Ubuntu Server, y dentro de esa VM un **contenedor LXC** para aislar el servicio.

```bash
# Crear el contenedor desde plantilla Ubuntu
pct create 200 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
  --hostname hello-web \
  --memory 1024 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp \
  --rootfs local-lvm:8 \
  --unprivileged 1

pct start 200
pct enter 200
```

Dentro del contenedor, solo lo necesario: Node.js vía `nvm` y Git.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20
```

---

## El sitio: Next.js con CSS y JS propios

Una web de presentación con blog — páginas estáticas en su mayoría, con el blog generado desde archivos Markdown. Sin base de datos ni API externa.

Lo que requirió trabajo real fue el **CSS escrito desde cero**. En 2019 Tailwind no tenía la adopción que tiene hoy, y el proyecto usó estilos propios: layouts con Flexbox y Grid, responsividad con media queries escritas a mano, consistencia visual gestionada manualmente entre páginas.

```
he-llo/
├── pages/
│   ├── index.js         # presentación
│   ├── blog/
│   │   ├── index.js     # listado de posts
│   │   └── [slug].js    # post individual
│   └── ...
├── components/
├── styles/
│   ├── globals.css
│   └── ...
├── content/             # posts en Markdown
└── next.config.js
```

La generación del blog usaba `getStaticPaths` + `getStaticProps` para leer los archivos Markdown en build time. Sin CMS, sin base de datos, sin moving parts innecesarios.

---

## Primera versión: PM2

El primer despliegue fue directo: clonar el repo, hacer el build y levantar el proceso con **PM2**.

```bash
git clone https://github.com/org/he-llo-web.git /srv/app/hello
cd /srv/app/hello
npm ci && npm run build
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hello-web',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/srv/app/hello',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

En Nginx Proxy Manager: un Proxy Host apuntando a la IP del contenedor en el puerto 3000, SSL con Let's Encrypt activado. Minutos de configuración y el sitio estaba online con HTTPS.

Para este caso de uso, PM2 era más que suficiente. El sitio era mayormente estático, el tráfico moderado y el proceso estable.

---

## Segunda versión: Docker

La migración a Docker llegó después, no porque PM2 fallara, sino porque **declarar el entorno en un Dockerfile simplifica todo lo que viene después**: actualizar Node, mover el servicio a otro host, reproducir el entorno localmente sin configurar nada.

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

El build multi-etapa mantiene la imagen final liviana: solo el output de Next.js en modo `standalone`, sin `node_modules` completos ni código fuente.

Para habilitar standalone hay que declararlo explícitamente:

```javascript
// next.config.js
const nextConfig = {
  output: 'standalone',
}
module.exports = nextConfig
```

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file: .env.production
    restart: unless-stopped
```

```bash
docker compose up -d --build
```

Nginx Proxy Manager no cambió nada — sigue apuntando al mismo puerto. El cambio fue completamente interno al entorno de ejecución.

---

## PM2 vs Docker para este caso

| | PM2 | Docker |
|---|---|---|
| Setup inicial | Muy rápido | Requiere Dockerfile |
| Entorno | Depende del host | Declarativo y portable |
| Actualizar Node | Afecta todo el sistema | Aislado por imagen |
| Rollback | Manual | Imagen anterior |
| Veredicto | Perfecto para arrancar | Mejor a largo plazo |

La conclusión práctica: **PM2 fue la decisión correcta para el primer despliegue**. Docker llegó cuando tuvo sentido operacionalmente, no como decisión de arquitectura inicial.

---

## Lo que realmente enseñó este proyecto

Desplegar un sitio simple en infraestructura propia enseña más que hacerlo en un servicio gestionado — no porque sea mejor en todos los casos, sino porque te obliga a entender cada capa: cómo llega el tráfico, dónde termina el SSL, por qué el proceso necesita reiniciarse automáticamente, qué pasa cuando actualizas Node en el host.

Son problemas que Vercel resuelve por ti, y está bien que lo haga. Pero resolverlos una vez desde cero tiene valor propio.

---

*¿Preguntas sobre este setup? Escríbeme en [LinkedIn](https://www.linkedin.com/in/sammy2455/) o por [email](mailto:jhonnyalbert245@gmail.com).*
