## Install docker 
https://docs.docker.com/engine/install/ubuntu/

Follow post installation steps as well.

https://docs.docker.com/engine/install/linux-postinstall/

## Install docker-compose
https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04

## Place the ELK compose files on the server

scp -r docker-elk/* ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com:/home/ubuntu/elk/.

create a .env file with ```ELK_VERSION=7.6.2```

## Start 

docker-compose up -d


