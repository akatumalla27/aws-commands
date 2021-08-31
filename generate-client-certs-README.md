# Client Certs

* Create root CA certiicate

```shell
openssl req -newkey rsa:1024 -sha1 -keyout rootkey.pem -out rootreq.pem

openssl x509 -req -in rootreq.pem -sha1 -signkey rootkey.pem -out rootcert.pem
```

* Install the above generate CA certificate as trusted certificate (valid for linux)

```shell
sudo mkdir /usr/share/ca-certificates/extra

sudo cp rootcert.pem /usr/share/ca-certificates/extra/rootcert.crt

sudo dpkg-reconfigure ca-certificates
```
* Select your cert for installation. Press Space and your certificate is marked for installation. Run the below command after,

```shell
sudo update-ca-certificates
```

* Create intermediate certificate signed by root CA,
```shell
openssl req -newkey rsa:1024 -sha1 -keyout skey.pem -out sreq.pem

sudo openssl x509 -req -in sreq.pem -sha1 -CA /etc/ssl/certs/rootcert.pem -CAkey rootkey.pem -CAcreateserial -out scert.pem
```

* Create client certificate signed by intermediate CA,

```shell
openssl req -newkey rsa:1024 -sha1 -keyout ckey.pem -out creq.pem

openssl x509 -req -in creq.pem -sha1 -CA scert.pem -CAkey skey.pem -CAcreateserial -out ccert.pem
```

* Verify the validity of the cert.
```shell
openssl verify -CAfile scert.pem ccert.pem
ccert.pem: OK
```
or
```
cat ccert.pem | openssl verify -CAfile scert.pem
```
* Repeat the above for server cert
```
openssl req -newkey rsa:1024 -sha1 -keyout serverkey.pem -out serverreq.pem

openssl x509 -req -in serverreq.pem -sha1 -CA certs/scert.pem -CAkey certs/skey.pem -CAcreateserial -out servercert.pem

openssl verify -CAfile certs/scert.pem servercert.pem
servercert.pem: OK

sudo -E bash -c 'cat servercert.pem serverkeyunec.pem > fullserver.pem'
```
## On HAProxy

In the MQTT ```bind``` options portion.
```
ca-file <path to ca cert>/scert.pem verify required
```
The ca-file setting mentions the PEM file from which to load CA certificates used to verify
client's certificate. The verify required option specifies that the sent client cert must be verified to create a valid connection.

## On site controller machine

* Copy the certs from the server. 
```
scp -r ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com:/home/ubuntu/certs .
```
* Unencrypt the encrypted pem key.

```shell
openssl rsa -in servenc.key -out serv.key
```
```
openssl pkey -in servenc.key -out serv.key -des3
```

To generate private keys to use Decrypt key method, use:
```
openssl genrsa -aes128
```
```
openssl genrsa -out withpassword.pem -aes128 2048

```

* Steps to generate password encrypted client cert and key
```
This command creates a private key
openssl genrsa -out withpassword.pem -aes128 2048

This command creates a self-signed certificate (withpassword.crt) from an existing private key (withpassword.key):
openssl req -key withpassword.pem -new -x509 -days 365 -out withpassword.crt

Certificate signing request
openssl x509  -in withpassword.crt -signkey withpassword.pem -x509toreq -out withpassword.csr

Generate client cert
openssl x509 -req -in withpassword.csr -sha1 -CA ../certs/scert.pem -CAkey ../certs/skey.pem -CAcreateserial -out clientcert.pem

Convert client cert to .crt format
openssl x509 -req -in withpassword.csr -sha1 -CA ../certs/scert.pem -CAkey ../certs/skey.pem -days 365 -out clientcert.crt

Verify cert
openssl verify -CAfile ../certs/scert.pem clientcert.crt
```
