FROM node:18-alpine
<<<<<<< HEAD
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
=======

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

>>>>>>> 279528a2dd30a2df8df9bd0b24fdf5bb0e4ba5d2
CMD ["node", "server.js"]
