FROM node:16-alpine3.14
WORKDIR /app

ADD ./package.json ./yarn.lock ./
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
