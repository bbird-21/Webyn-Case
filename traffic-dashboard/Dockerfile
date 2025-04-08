FROM node:22

WORKDIR /usr/src/app

# COPY . /usr/src/app
COPY package.json ./

RUN npm install -g @angular/cli

RUN npm install

ENTRYPOINT [ "sh", "run.sh" ]
