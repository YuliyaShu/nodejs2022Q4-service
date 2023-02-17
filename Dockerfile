FROM node:lts-alpine
EXPOSE ${PORT}
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
RUN npm install && npm cache clean --force
RUN npm i nodemon -g
RUN npm run build
COPY . .
RUN npx prisma generate
USER node
CMD ["npm", "run", "start:dev"]
