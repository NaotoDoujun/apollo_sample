FROM node:lts-slim AS build

RUN npm install -g @angular/cli
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json ./package.json
RUN npm install

COPY . /usr/src/app
RUN ng build

FROM nginx:latest AS base
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/ui_core /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]