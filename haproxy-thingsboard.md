## Install HAProxy

sudo add-apt-repository ppa:vbernat/haproxy-1.8
sudo apt-get update
sudo apt-get install haproxy

## Edit config 
sudo vi /etc/haproxy/haproxy.cfg

## Check validity of config file
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

## Start server
sudo service haproxy restart

## Lets Encrypt

Install snapd 

sudo snap install core; sudo snap refresh core

sudo snap install --classic certbot

sudo ln -s /snap/bin/certbot /usr/bin/certbot

sudo certbot certonly -a standalone --http-01-port 54321 -d catapult.evergreeninnovations.co 

## To add subdomains
sudo certbot certonly -a standalone --http-01-port 54321 -d catapult.evergreeninnovations.co -d dev.evergreeninnovations.co --expand



Reference: https://certbot.eff.org/lets-encrypt/ubuntubionic-haproxy.html

## After generating files

PEM encoded files at - /etc/letsencrypt/live/catapult.evergreeninnovations.co/

Combine fullchain.pem and privkey.pem.

sudo mkdir -p /etc/haproxy/certs

DOMAIN='catapult.evergreeninnovations.co' sudo -E bash -c 'cat /etc/letsencrypt/live/$DOMAIN/fullchain.pem /etc/letsencrypt/live/$DOMAIN/privkey.pem > /etc/haproxy/certs/$DOMAIN.pem'

sudo chmod -R go-rwx /etc/haproxy/certs

# Setting environmental variables in haproxy
```
sudo vi /etc/default/haproxy
VARIABLE_NAME="variable value"
sudo vi /etc/haproxy/haproxy.cfg
"${VARIABLE_NAME}"
```
