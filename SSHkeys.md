```
On Pi:
ssh-keygen -m PEM

cat ../id_rsa.pub

sudo go run reverse-tunnel_v3.go endpoints.json

On Machine:
ssh -p 10000 pi@localhost

sudo nano ~/.ssh/authorized_keys
```
1. Launch and connect to EC2 instance running Amazon Linux 2.
2. Promote to root and edit /etc/ssh/sshd_config 
## sudo vi /etc/ssh/sshd_config
3. Edit line 17 (usually 17) #PORT 22. You'll need to un-comment the line and change the port to whatever you like. 
## PORT 9222
4. Save changes and exit
## :wq
5. Restart sshd 
## For Amazon Linux, RHEL 5, and SUSE Linux, use this command:
## sudo service sshd restart
## For Ubuntu, use this command:
## sudo service ssh restart
6. Add the new port in the INBOUND rules for your EC2 security group. Add a new TCP connection for 9222 for 0.0.0.0/0.
