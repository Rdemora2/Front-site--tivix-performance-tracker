#!/bin/sh

set -e

echo "=== Nginx Configuration ==="
echo "NGINX_FRONTEND_NAMES: ${NGINX_FRONTEND_NAMES}"
echo "API_DOMAIN: ${API_DOMAIN}"
echo "=========================="

envsubst '${NGINX_FRONTEND_NAMES} ${API_DOMAIN}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "=== Generated Nginx Config ==="
cat /etc/nginx/conf.d/default.conf
echo "=============================="

nginx -t

exec "$@"
