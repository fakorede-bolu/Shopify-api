FROM node:8.11.1

WORKDIR /usr/src/budget-api

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]
