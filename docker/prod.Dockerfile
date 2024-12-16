FROM node:20.11.0

WORKDIR /app

COPY  package*.json .
COPY  . .

RUN npm install 
RUN npm run build

ENV PORT=4000

EXPOSE 4000

CMD [ "npm", "start"]