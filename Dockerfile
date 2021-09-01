# Keep this node version the same as package.json’s engines property. Heroku
# uses the version of node specified in package.json for deployed environments.
FROM node:16-alpine3.14
WORKDIR /app

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ADD ./package.json ./yarn.lock ./
RUN yarn install

ENTRYPOINT ["dockerize", "-wait", "tcp://db:5432", "yarn"]
CMD ["start"]
