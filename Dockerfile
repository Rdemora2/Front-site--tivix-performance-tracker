FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_API_PREFIX
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_PREFIX=${VITE_API_PREFIX}
ENV VITE_ENVIRONMENT=production
ENV NODE_ENV=production

RUN npm run build


FROM nginx:1.29.1-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]