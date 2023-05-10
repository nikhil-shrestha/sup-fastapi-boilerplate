FROM node:16.20.0-alpine
ARG NPM_TOKEN

WORKDIR /app

COPY ./package.json ./

RUN apk add --no-cache --virtual .build-deps make gcc g++ python3 && \
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
    npm install --legacy-peer-deps && \
    rm -f .npmrc && \
    apk del .build-deps

COPY . .

CMD ["npm", "run", "start"]