## Rules

The AWS private key to authenticate the reverse tunnel connection can not **EVER** leave AWS. It must never be copied from AWS to anyones local machine or Dropbox.

## Tunnel

Setting up a SSHtunnel will make a computer which is on an internal network behind the router reachable over the internet without modifying the router configurations.

## On the cloud server (AWS)

Login to the AWS public server, referred to as the **BastionHost**.

### Generate key-pair on cloud

```shell
ssh-keygen -t rsa -b 4096 -C "cloud"

Generating public/private rsa key pair.
Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub.
```

## On the site controller

Connect to the industrial PC via a monitor using HDMI/VGA port.

## Generate public-private key pairs on the on site machine eg. OnLogic PC

* Log in as root.
```shell
sudo -s
```

* Create a directory called ```tunnel``` under ```/etc```
```shell
mkdir /etc/tunnel
cd /etc/tunnel
```

* Generate authentication key pairs for SSH. Below is the example for ```site0```.
```shell
ssh-keygen -t rsa -b 4096 -C "site@site0"
```

Enter the location where the key should be saved:
```
root@site0:/etc/tunnel# ssh-keygen -t rsa -b 4096 -C "site@site0"

Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): ***/etc/tunnel/id_rsa***
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /etc/tunnel/id_rsa.
Your public key has been saved in /etc/tunnel/id_rsa.pub.
The key fingerprint is:
SHA256:sNIfpow5I2daqnftwbK1de3QmhDFso8TwP2AwEGboNo pi@large-home
The key's randomart image is:
+---[RSA 4096]----+
|  .o+.           |
| . ..= o .       |
|.   o = + o      |
|..   . + *       |
|. E . o S .      |
|     * + * o     |
|  . X.* * + o    |
|  .B.*.+ + =     |
|.oo...o   o .    |
+----[SHA256]-----+
```

* Copy the public key created on the cloud server to site controller

On **cloud server** :
```
cat /home/ubuntu/.ssh/id_rsa.pub
```
Copy the the key which ends with 'cloud'

On **site controller** :
```
sudo nano ~/.ssh/authorized_keys
```
Append it to the end of the file above.

* On the **site controller** add the tunnel script
```shell
cd /etc/tunnel

touch tunnel_ssh.sh 
nano tunnel_ssh.sh
```

* NOTE: Should eventually change remote host to XXX.boxpower.io. Note: the remote port number should be unique for each site.

The <remote port> option should be unique for each site.  Say we start at 50000 (Site0, 4027 63rd St), and then assign port numbers in the order in which sites are comissioned.  
 
Copy below content in tunnel_ssh.sh. Modify the port as stated above.

```
#!/bin/bash
remote_host=ubuntu@dev.evergreeninnovations.co
remote_port=10000 
local_port=22
identity_file="/etc/tunnel/id_rsa"
cmd="ssh -p 7000 -fN -R ${remote_port}:localhost:${local_port} -i ${identity_file} ${remote_host} -o ExitOnForwardFailure=yes"

while true; do
    pgrep -fx "$cmd" >/dev/null 2>&1 || $cmd
    sleep 10
done
```

* Make the script an executable
```
chmod +x tunnel_ssh.sh 
sudo ./tunnel_ssh.sh 
```
Run the shell script and add to known hosts once. (***TODO - automate this***)

* Add the created public key to the clouds authorized_keys file.
```
cat ~/.ssh/id_rsa.pub | ssh username@remote_host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

* To use private_key authentication, and disable password authentication on **site controller***
```shell
sudo nano /etc/ssh/sshd_config

# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication no 
```

* Create a systemd service 
```shell
cd /etc/systemd/system 
site0@site0:/etc/systemd/system $ sudo nano tunnel_ssh.service
```

Copy the below into tunnel_ssh.service.

```shell
[Unit]
Description=TunnelService
After=network-online.target

[Service]
ExecStart=/etc/tunnel/tunnel_ssh.sh
Restart=always
RestartSec=15s

[Install]
WantedBy=multi-user.target
```

## To check if the network status is read correctly

```shell
sudo systemctl is-enabled systemd-networkd-wait-online.service
sudo systemctl enable systemd-networkd-wait-online.service
```

* Restart system daemon for changes to take affect. 

```
$ sudo systemctl daemon-reload
$ sudo systemctl start tunnel_ssh.service
$ sudo systemctl status tunnel_ssh.service
$ sudo systemctl enable tunnel_ssh.service
```

```sudo systemctl restart tunnel_ssh.service``` to restart the service if already running.
