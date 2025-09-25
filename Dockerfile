FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_API_PREFIX
ARG VITE_ENVIRONMENT
ARG NODE_ENV
ARG VITE_APP_TITLE
ARG VITE_APP_VERSION
ARG VITE_ENABLE_ANALYTICS
ARG VITE_ENABLE_ERROR_REPORTING
ARG VITE_ENABLE_DEV_TOOLS

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_PREFIX=${VITE_API_PREFIX}
ENV VITE_ENVIRONMENT=${VITE_ENVIRONMENT}
ENV NODE_ENV=${NODE_ENV}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_ENABLE_ANALYTICS=${VITE_ENABLE_ANALYTICS}
ENV VITE_ENABLE_ERROR_REPORTING=${VITE_ENABLE_ERROR_REPORTING}
ENV VITE_ENABLE_DEV_TOOLS=${VITE_ENABLE_DEV_TOOLS}

RUN npm run build

FROM nginx:1.29.1-alpine

RUN apk --no-cache add gettext

RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/templates

COPY nginx/nginx.conf.template /etc/nginx/templates/nginx.conf.template

COPY nginx/entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]