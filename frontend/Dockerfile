FROM node:21 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:1.25

WORKDIR /app

COPY --from=build --chown=app:app /app/build /var/www/html
COPY --chown=app:app nginx.conf /etc/nginx/conf.d/default.conf

RUN groupadd app && \
    useradd -m -d /app -g app app
RUN chown -R app:app /app && chmod -R 755 /app && \
    chown -R app:app /var/cache/nginx && \
    chown -R app:app /var/log/nginx && \
    chown -R app:app /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R app:app /var/run/nginx.pid

USER app
EXPOSE 80
