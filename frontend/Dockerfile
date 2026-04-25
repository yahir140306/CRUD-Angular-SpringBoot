FROM node:20-alpine

WORKDIR /app

# Copiamos package.json primero (caché: si no cambia, no reinstala)
COPY package*.json ./

# Instalamos dependencias de Node
RUN npm install

# Copiamos el resto del código
COPY . .

# Angular dev server
EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
