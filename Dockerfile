FROM node:18

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm i bcrypt --unsafe-perm=true --allow-root --save

COPY . .

CMD ["npm", "run", "dev"]