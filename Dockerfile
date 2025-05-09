FROM node:20

WORKDIR /app

ENV COLYSEUS_SEAT_RESERVATION_TIME=300

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2567

CMD [ "npm", "start" ]