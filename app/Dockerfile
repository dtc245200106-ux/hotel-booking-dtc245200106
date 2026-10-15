FROM node:18-alpine

# Tao user thuong (non-root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY server.js .

# Chuyen quyen so huu cho appuser
RUN chown -R appuser:appgroup /app

# Chuyen sang user thuong
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
