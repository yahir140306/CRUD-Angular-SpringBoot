# ── ETAPA 1: Compilar Angular ──────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos package.json primero (caché: si no cambia, no reinstala)
COPY package*.json ./

# Instalamos dependencias de Node
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos Angular en modo producción
# Genera archivos estáticos en /app/dist/frontend/browser/
RUN npm run build

# ── ETAPA 2: Servir con Nginx ──────────────────────────────────────────
# Nginx es un servidor web ultra-rápido y liviano
FROM nginx:alpine

# Copiamos los archivos compilados al directorio que Nginx sirve
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Puerto 80 es el estándar de HTTP
EXPOSE 80

# Nginx arranca automáticamente con la imagen base
