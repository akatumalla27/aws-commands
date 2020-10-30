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

Reference: https://certbot.eff.org/lets-encrypt/ubuntubionic-haproxy.html
