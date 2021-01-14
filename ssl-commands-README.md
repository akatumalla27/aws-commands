openssl x509 -enddate -noout -in {/path/to/my/my.pem}

openssl rsa -in /home/pi/transfer/certs/serverKey.pem -passin pass:egiAdmin -out /home/pi/transfer/certs/serverKeyUn.pem
cat /home/pi/transfer/certs/serverCert.pem /home/pi/transfer/certs/serverKeyUn.pem >> /home/pi/transfer/certs/serverChain.pem

openssl rsa -in /home/pi/transfer/certs/interkey.pem -passin pass:egiAdmin -out /home/pi/transfer/certs/interkeyUn.pem
cat  /home/pi/transfer/certs/interkeyUn.pem /home/pi/transfer/certs/intercert.pem /home/pi/transfer/certs/rootcert.pem >> /home/pi/transfer/certs/ca-bundle.pem


cat /home/pi/transfer/certs/intercert.pem /home/pi/transfer/certs/interkeyUn.pem >> /home/pi/transfer/certs/interChain.pem
/usr/bin/sudo cp /home/pi/transfer/certs/interChain.pem /etc/site-simulator/certs/.



/usr/bin/sudo cp /home/pi/transfer/certs/ca-bundle.pem /etc/site-simulator/certs/.
/usr/bin/sudo cp /home/pi/transfer/certs/serverChain.pem /etc/site-simulator/certs/.
/usr/bin/sudo cp /home/pi/transfer/certs/clientCert.pem /etc/site-simulator/certs/.

openssl rsa -in /home/pi/transfer/certs/clientKey.pem -passin pass:egiAdmin -out /home/pi/transfer/certs/clientKeyUn.pem

/usr/bin/sudo cp /home/pi/transfer/certs/clientKeyUn.pem /etc/site-simulator/certs/.
