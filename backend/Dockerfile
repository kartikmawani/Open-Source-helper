 
FROM node:20-alpine AS builder
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm ci
 
COPY . .
 
RUN npm run build

 
FROM node:20-alpine AS runner
 
ENV NODE_ENV=production
 
USER node
WORKDIR /home/node/app
 
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
 
EXPOSE 4000
 
CMD ["node", "dist/app.js"]