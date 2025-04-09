FROM node:22

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g @angular/cli

ENTRYPOINT [ "sh", "run.sh" ]
