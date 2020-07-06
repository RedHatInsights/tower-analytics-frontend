FROM node:10.15


WORKDIR /app
COPY package.json /app
RUN npm --version
RUN npm install
#COPY . /app
#CMD npm run start:container

