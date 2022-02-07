FROM node:16-alpine AS build

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build


FROM nginx:latest

COPY --from=build /app/dist/gis /usr/share/nginx/html

EXPOSE 80
