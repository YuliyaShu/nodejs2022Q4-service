FROM node:lts-alpine
EXPOSE ${PORT}
WORKDIR /usr/app
COPY package*.json .
RUN npm install && npm cache clean --force
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "start:dev"]
