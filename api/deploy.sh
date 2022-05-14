#!/bin/sh

docker build --target=production -t lah22:prod -t registry.digitalocean.com/lah22/prod .
docker push registry.digitalocean.com/lah22/prod