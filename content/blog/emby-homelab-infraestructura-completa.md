---
date: 2025-12-15
title: "Emby en producción: evolución real de un media server — de un Celeron a un rack completo"
title_en: "Emby in production: real evolution of a media server — from a Celeron to a full rack"
description: "La evolución real de mi servidor multimedia: desde un Celeron con 500GB hasta un Dell PowerEdge R720 con 21TB, GPUs Quadro, MikroTik, Nginx Proxy Manager y dominio propio."
description_en: "The real evolution of my personal media server: from a Celeron with 500GB to a Dell PowerEdge R720 with 21TB, Quadro GPUs, MikroTik networking and Nginx Proxy Manager."
tags: ['DevOps', 'Homelab', 'Networking', 'Media Server', 'Infrastructure']
---

# Emby en producción: evolución real de un media server

No toda infraestructura nace compleja. La mayoría crece por necesidad, a veces sin un plan claro, respondiendo a problemas concretos que van apareciendo con el tiempo. Este servidor es exactamente eso.

En **2019** arrancó de la forma más modesta posible: una máquina con **Intel Celeron, Ubuntu Server y un disco de 500GB**. El objetivo era simple — centralizar algunas películas y series para consumo personal, dejar de depender de discos externos desperdigados por el escritorio.

Lo que no anticipé fue que ese primer paso desencadenaría seis años de iteraciones continuas.

Hoy el sistema corre sobre un **Dell PowerEdge R720 montado en rack**, con más de **21TB de almacenamiento**, GPUs dedicadas para transcoding por hardware y una infraestructura de red completa con dominio público y reverse proxy. Este artículo documenta esa evolución — las decisiones, los cambios y el estado actual del sistema.

---

## El rack y el laboratorio

Toda la infraestructura actual vive dentro de un **rack de 48U** que aloja varios servidores corriendo en paralelo. El servidor de Emby convive con equipos dedicados a experimentos de red, desarrollo y virtualización.

El rack incluye:

- Servidor principal de media (el foco de este artículo)
- Servidores para desarrollo y virtualización con Proxmox
- Equipos de red — switches y router MikroTik
- Patch panels y cableado estructurado
- UPS para protección ante cortes

Este contexto importa porque el media server no es un proyecto aislado. Es **uno de varios servicios dentro de un homelab** que funciona como entorno real de práctica para networking, infraestructura y despliegue de aplicaciones.

---

## Hardware actual: Dell PowerEdge R720

El corazón del sistema es un **Dell PowerEdge R720**, un servidor de clase enterprise originalmente diseñado para datacenter. Representa un salto cualitativo enorme respecto al hardware con el que arrancó el proyecto.

| Componente        | Detalle                    |
|-------------------|----------------------------|
| Modelo            | Dell PowerEdge R720        |
| CPU               | 2 × Intel Xeon E5          |
| RAM               | 64 GB DDR3 ECC             |
| GPU               | 2 × NVIDIA Quadro M2000    |
| VRAM              | 4 GB GDDR5 por GPU         |
| Almacenamiento    | 21 TB totales              |
| Sistema operativo | Windows Server             |

El almacenamiento permite mantener bibliotecas amplias de películas, series y contenido personal sin compromisos. La memoria ECC reduce el riesgo de corrupción silenciosa de datos, algo que en un servidor que corre 24/7 no es un detalle menor.

---

## Transcoding por GPU con NVENC

Una de las adiciones más impactantes fue incorporar **dos NVIDIA Quadro M2000** al servidor.

Sin aceleración por hardware, el transcoding de video recae completamente sobre la CPU. Cuando varios usuarios reproducen streams simultáneos — especialmente desde dispositivos que no soportan el codec nativo — la carga puede saturar el procesador y degradar la experiencia de todos.

Con NVENC habilitado en Emby, **la GPU asume el trabajo de conversión de video**, liberando casi por completo la CPU para otras tareas. El resultado práctico es claro: más streams simultáneos, menor latencia al iniciar reproducción y mejor estabilidad general bajo carga.

Las Quadro tienen una ventaja puntual sobre las GeForce para este caso de uso: están diseñadas para **operación continua en entornos profesionales**, sin las restricciones artificiales de sesiones de encoding simultáneas que NVIDIA impone en sus GPUs de consumo.

---

## Por qué Windows Server

La versión inicial del servidor corría **Ubuntu Server** — una elección obvia para alguien con background en Linux.

Sin embargo, con el tiempo migré a **Windows Server**, y la razón es pragmática: la gestión del contenido multimedia en Windows es significativamente más simple. Herramientas de automatización de descargas, organización de bibliotecas, renombrado de archivos y clientes multimedia tienen mejor integración y soporte en este entorno.

Linux sigue siendo la plataforma que prefiero para la mayoría de los servicios del laboratorio, pero para un servidor de media dedicado, **Windows Server reduce la fricción operativa del día a día**.

---

## Emby como plataforma de streaming

La plataforma de streaming elegida es **Emby**. Permite organizar bibliotecas multimedia con metadatos automáticos, gestionar múltiples cuentas de usuario, hacer streaming remoto con transcoding adaptativo y ofrece clientes para prácticamente cualquier dispositivo: móviles, smart TVs, Chromecast, navegadores y más.

El servidor está expuesto públicamente bajo el subdominio:

```
emby.devslab.cloud
```

El dominio **devslab.cloud** funciona como espacio donde publico distintos experimentos y proyectos del laboratorio.

---

## Red y reverse proxy

### Topología de red

La red está gestionada por un **router MikroTik**, que centraliza el control de NAT, firewall y redirección de tráfico. La configuración prioriza una superficie de exposición mínima: hacia Internet solo están abiertos los puertos **80 y 443**. Todo el resto permanece dentro de la red privada.

### Nginx Proxy Manager

El acceso público a los servicios del laboratorio pasa por **Nginx Proxy Manager**, que actúa como reverse proxy centralizado. Esto permite:

- Gestionar certificados SSL automáticamente vía Let's Encrypt
- Enrutar tráfico hacia múltiples servicios internos bajo un mismo dominio
- Exponer servicios sin necesidad de abrir puertos adicionales en el router
- Centralizar la configuración HTTPS en un solo punto

El flujo de una petición entrante es el siguiente:

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
Nginx Proxy Manager  (SSL termination / routing)
   │
   ▼
Servidor Emby (red interna)
```

Este diseño permite que todos los servicios del laboratorio compartan la misma IP pública sin exponerse directamente.

---

## Línea de tiempo del proyecto

| Año  | Estado de la infraestructura                         |
|------|------------------------------------------------------|
| 2019 | Celeron + Ubuntu Server + 500 GB                     |
| 2020 | Expansión de almacenamiento                          |
| 2021 | Acceso remoto configurado                            |
| 2022 | Dominio propio + reverse proxy                       |
| 2023 | Infraestructura de red dedicada con MikroTik         |
| 2024 | Migración al Dell PowerEdge R720                     |
| 2025 | 21 TB de almacenamiento + GPUs Quadro M2000          |

---

## Conclusión

Lo que empezó como un pequeño servidor casero se convirtió, iteración tras iteración, en un **laboratorio de infraestructura funcional y en producción real**.

El stack actual combina hardware de servidor enterprise, almacenamiento a escala razonable, aceleración por GPU, red gestionada con MikroTik, reverse proxy con Nginx Proxy Manager y dominio propio — todo operando en conjunto de forma estable.

La lección más clara de este proyecto: **un homelab no se construye de una vez**. Crece respondiendo a necesidades reales, con hardware que muchas veces pasa por varias manos antes de llegar al rack. Y eso, lejos de ser una limitación, es precisamente lo que hace interesante el proceso.

La infraestructura nunca está del todo terminada. Eso tampoco es un problema.
