FROM node:14-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install


FROM builder as runner
WORKDIR /app
COPY . .
RUN yarn build && yarn test
EXPOSE 3000
CMD yarn start
