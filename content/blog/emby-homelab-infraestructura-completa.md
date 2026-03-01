---
title: "Emby en producción: de cero al rack — infraestructura completa de un media server casero"
title_en: "Emby in production: from zero to rack — complete homelab media server infrastructure"
date: "2025-01-15"
tags: ["DevOps", "Linux", "Homelab", "Networking", "Docker"]
description: "Cómo construí un servidor de streaming personal con hardware real: instalación del rack, servidor con GPU para transcoding, Ubuntu Server, red con router/switch/firewall, IP pública, dominio y subdominio propios."
description_en: "How I built a personal streaming server with real hardware: rack installation, GPU server for transcoding, Ubuntu Server, network with router/switch/firewall, public IP, custom domain and subdomain."
---

## El proyecto

Cuando empecé a acumular películas, series y contenido personal en discos externos dispersos, decidí centralizar todo en un servidor propio. No quería depender de servicios en la nube ni pagar suscripciones infinitas. Quería control total: mi hardware, mi red, mis reglas.

El resultado es un servidor Emby accesible desde cualquier lugar del mundo a través de `emby.devslab.cloud`, corriendo sobre infraestructura completamente propia. Este artículo documenta cada capa de esa infraestructura.

---

## Hardware — el rack y el servidor

### Elección del rack

Opté por un **rack de pared de 9U** (open frame) que ocupa poco espacio y permite buena ventilación pasiva. Monté en él:

- El servidor principal
- El switch gestionable
- El patch panel
- El UPS (Sistema de alimentación ininterrumpida)

Un rack de pared es suficiente para un homelab doméstico y evita el ruido de ventiladores de un rack de suelo de datacenter.

### El servidor

El componente más crítico fue elegir un servidor con **GPU dedicada para transcoding por hardware**. Emby soporta transcoding por software (solo CPU), pero con múltiples clientes simultáneos la CPU se satura y la latencia sube.

Especificaciones del servidor:

| Componente | Detalle |
|---|---|
| CPU | Intel Core i7-10700 (8 núcleos / 16 hilos) |
| RAM | 32 GB DDR4 ECC |
| GPU | NVIDIA GTX 1650 (4 GB GDDR6) |
| Almacenamiento OS | SSD NVMe 256 GB |
| Almacenamiento media | 2× HDD 4 TB en RAID 1 (espejo) |
| NIC | Gigabit Ethernet onboard |

La **GTX 1650** soporta NVENC (codificación) y NVDEC (decodificación) por hardware. Con ella, Emby transcodifica flujos 4K a 1080p con un uso de CPU menor al 15%, mientras que por software consumía el 90%.

---

## Sistema operativo — Ubuntu Server 22.04 LTS

### Por qué Ubuntu Server

- LTS garantiza soporte hasta 2027
- Drivers NVIDIA bien documentados para Ubuntu
- Enorme base de documentación
- `apt` confiable para actualizaciones de seguridad

### Instalación headless

Instalé Ubuntu Server 22.04.3 LTS desde USB en modo **minimal**, sin interfaz gráfica. El servidor corre headless (sin monitor) y se administra 100% por SSH.

```bash
# Actualizar el sistema tras la instalación
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y curl wget git htop net-tools ufw
```

### Drivers NVIDIA en Ubuntu Server

Este paso es crítico. Sin los drivers correctos, Emby no puede usar la GPU.

```bash
# Verificar GPU detectada
lspci | grep -i nvidia

# Instalar drivers recomendados
sudo ubuntu-drivers autoinstall

# Reiniciar
sudo reboot

# Verificar instalación
nvidia-smi
```

La salida de `nvidia-smi` debe mostrar la GPU, el driver y la memoria disponible. Si aparece correctamente, el transcoding por hardware está listo.

### Configurar acceso SSH con llave pública

```bash
# En el servidor: crear directorio y archivo authorized_keys
mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys

# En el cliente: generar par de llaves
ssh-keygen -t ed25519 -C "homelab-admin"

# Copiar llave pública al servidor
ssh-copy-id usuario@IP_LOCAL_SERVIDOR
```

Después de copiar la llave, deshabilité el login por contraseña editando `/etc/ssh/sshd_config`:

```bash
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
```

---

## Red — router, switch y firewall

Esta fue la capa que más tiempo tomó diseñar bien. El objetivo era:

1. Aislar el servidor del resto de la red doméstica
2. Exponer solo el puerto necesario al exterior (443)
3. Tener una VLAN de administración separada

### Topología de red

```
Internet
    │
    ▼
[Modem ISP] — IP pública dinámica (DDNS)
    │
    ▼
[Router/Firewall — pfSense]
    ├── VLAN 10 — Doméstica (192.168.10.0/24) — PCs, móviles
    └── VLAN 20 — Servidores (192.168.20.0/24) — Homelab
            │
            ▼
    [Switch gestionable — VLAN trunk]
            │
            ▼
    [Servidor Emby — 192.168.20.10]
```

### Switch gestionable

Usé un **switch TP-Link TL-SG108E** (8 puertos, gestionable por web). Configuré:

- **Puerto 1**: trunk hacia el router (lleva VLAN 10 y 20 taggeadas)
- **Puertos 2-4**: acceso VLAN 20 (servidores)
- **Puertos 5-8**: acceso VLAN 10 (doméstica)

### pfSense como router y firewall

pfSense corriendo en un mini-PC (4 GB RAM, SSD 32 GB) hace de router principal. Las reglas de firewall relevantes:

```
# Regla 1: Bloquear tráfico VLAN Servidores → VLAN Doméstica
Source: VLAN20_net  →  Destination: VLAN10_net  →  Action: BLOCK

# Regla 2: Permitir tráfico Doméstica → Servidores (acceso LAN)
Source: VLAN10_net  →  Destination: VLAN20_net  →  Port: 443  →  Action: ALLOW

# Regla 3: NAT + Port Forward desde exterior hacia servidor
WAN:443  →  192.168.20.10:443  →  Action: ALLOW
WAN:80   →  192.168.20.10:80   →  Action: ALLOW (solo para Let's Encrypt)
```

La VLAN de servidores **no puede iniciar conexiones** hacia la red doméstica, pero la doméstica sí puede acceder al servidor en los puertos permitidos.

### IP pública y DDNS

Mi ISP asigna **IP pública dinámica** (cambia cada cierto tiempo). La solución es DDNS (Dynamic DNS): un cliente que actualiza automáticamente el registro DNS cuando la IP cambia.

En pfSense configuré el cliente DDNS integrado apuntando a **Cloudflare**:

- Proveedor: Cloudflare
- Hostname: `devslab.cloud`
- Token API: token de Cloudflare con permisos `Zone:DNS:Edit`
- Intervalo de chequeo: 5 minutos

Cada 5 minutos pfSense verifica si la IP pública cambió y, si es así, actualiza el registro A en Cloudflare automáticamente.

---

## Dominio y subdominio

### Registro del dominio

Registré `devslab.cloud` en **Cloudflare Registrar**. Mantenerlo todo en Cloudflare simplifica la gestión: DNS, certificados y proxy en un mismo panel.

### Configuración DNS en Cloudflare

| Tipo | Nombre | Contenido | Proxy |
|------|--------|-----------|-------|
| A | `devslab.cloud` | IP pública dinámica (actualizada por DDNS) | ☁️ Activado |
| CNAME | `emby` | `devslab.cloud` | ☁️ Activado |

El subdominio `emby.devslab.cloud` apunta via CNAME al registro A principal. Si la IP cambia, solo hay que actualizar el registro A y todos los subdominios lo heredan.

> **Importante**: mantuve el proxy de Cloudflare **activado** (`☁️`). Esto oculta la IP real del servidor detrás de la CDN de Cloudflare, añadiendo una capa de protección contra ataques directos a la IP.

---

## Nginx como reverse proxy con SSL

### Por qué reverse proxy

Emby escucha en el puerto `8096` (HTTP) y `8920` (HTTPS). En lugar de exponer esos puertos directamente, Nginx actúa como intermediario:

```
Internet → 443 → Nginx → 8096 → Emby
```

Esto permite centralizar los certificados SSL, agregar headers de seguridad y potencialmente servir múltiples servicios desde el mismo servidor.

### Docker Compose — Nginx + Certbot + Emby

```yaml
# docker-compose.yml
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
      - emby
    restart: unless-stopped

  certbot:
    image: certbot/certbot:latest
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
    entrypoint: >
      sh -c "trap exit TERM;
             while :; do
               certbot renew --webroot -w /var/www/certbot --quiet;
               sleep 12h & wait $${!};
             done"

  emby:
    image: emby/embyserver:latest
    environment:
      - UID=1000
      - GID=1000
    volumes:
      - ./emby/config:/config
      - /mnt/media:/media:ro
    devices:
      - /dev/dri:/dev/dri        # Intel Quick Sync (fallback)
    runtime: nvidia              # Para NVENC/NVDEC
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
    restart: unless-stopped
```

### Configuración de Nginx para Emby

```nginx
# nginx/conf.d/emby.conf

# Redirigir HTTP → HTTPS
server {
    listen 80;
    server_name emby.devslab.cloud;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS con reverse proxy
server {
    listen 443 ssl http2;
    server_name emby.devslab.cloud;

    ssl_certificate     /etc/letsencrypt/live/emby.devslab.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/emby.devslab.cloud/privkey.pem;

    # Seguridad SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;

    # Tamaño máximo de cuerpo (para subida de subtítulos, etc.)
    client_max_body_size 100M;

    # Proxy hacia Emby
    location / {
        proxy_pass         http://emby:8096;
        proxy_http_version 1.1;

        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # WebSocket (necesario para Emby)
        proxy_set_header   Upgrade    $http_upgrade;
        proxy_set_header   Connection "upgrade";

        # Timeouts generosos para streaming
        proxy_read_timeout  600s;
        proxy_send_timeout  600s;
    }
}
```

### Obtener certificado Let's Encrypt

```bash
# Primera vez: obtener certificado manualmente
docker run --rm \
  -v ./certbot/www:/var/www/certbot \
  -v ./certbot/conf:/etc/letsencrypt \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d emby.devslab.cloud \
  --email jhonnyalbert245@gmail.com \
  --agree-tos --no-eff-email

# Levantar la stack completa
docker compose up -d
```

---

## Resultado y métricas

Con toda la infraestructura en pie, el servidor lleva más de un año corriendo sin interrupciones planificadas. Algunas métricas reales:

| Métrica | Valor |
|---|---|
| Uptime promedio | 99.2 % |
| Transcoding 4K → 1080p (GPU) | ~12% uso GPU, &lt;5% CPU |
| Transcoding 1080p (SW, sin GPU) | ~85% CPU |
| Clientes simultáneos soportados | 4–6 sin degradación |
| Latencia media desde Internet | 320 ms (Ecuador → servidor) |
| Renovación SSL automática | ✅ Certbot cada 90 días |

---

## Lecciones aprendidas

**La GPU es imprescindible** para más de 2 clientes concurrentes. El salto de CPU a GPU en transcoding no es marginal, es un cambio de categoría.

**pfSense es overkill para un homelab**, pero aprendí más de redes en 2 semanas configurándolo que en meses de teoría. La separación por VLANs da una sensación real de control.

**Cloudflare como proxy** añade protección sin costo y simplifica enormemente la gestión de certificados y DNS dinámico.

**El rack de pared** fue la mejor decisión estética y funcional: todo ordenado, accesible y ventilado.

---

*¿Tienes dudas sobre algún componente de esta infraestructura? Escríbeme en [LinkedIn](https://www.linkedin.com/in/sammy2455/) o por [email](mailto:jhonnyalbert245@gmail.com).*
