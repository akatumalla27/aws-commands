sudo apt-get update && sudo apt-get upgrade
openssl version -a
sudo apt install build-essential checkinstall zlib1g-dev -y


cd /usr/local/src/
sudo wget https://www.openssl.org/source/openssl-1.1.1c.tar.gz

sudo tar -xf openssl-1.1.1c.tar.gz

cd openssl-1.1.1c

## Install OpenSSL
sudo ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib

Check link: https://cloudwafer.com/blog/installing-openssl-on-ubuntu-16-04-18-04/

## Create server cert

openssl genrsa -out ec2server.key 2048

openssl rsa -in ec2server.key -noout -text

## Extract public key

openssl rsa -in example.org.key -pubout -out example.org.pubkey
Verify key
openssl rsa -in example.org.pubkey -pubin -noout -text

## CSR to prove ownership

openssl req -new -key ec2server.key -out ec2server.csr

ubuntu@ip-10-0-1-189:~$ openssl req -new -key ec2server.key -out ec2server.csr
Can't load /home/ubuntu/.rnd into RNG
140638791922112:error:2406F079:random number generator:RAND_load_file:Cannot open file:../crypto/rand/randfile.c:88:Filename=/home/ubuntu/.rnd
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CA
Locality Name (eg, city) []:Sacramento
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Evergreen Innovations LLC
Organizational Unit Name (eg, section) []:IT
Common Name (e.g. server FQDN or YOUR name) []:egi-cloudserver.org
Email Address []:alekhya@evergreeninnovations.co

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
