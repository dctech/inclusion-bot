# Keep this node version the same as package.json’s engines property. Heroku
# uses the version of node specified in package.json for deployed environments.
FROM node:16-alpine3.14
WORKDIR /app

ADD ./package.json ./yarn.lock ./
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
