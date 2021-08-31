## Pre-requisites
The document assumes that the person reading:
1. Can login to AWS using SSH and AWS console.
2. Has basic knowledge of IP addresses.
3. Understands what security groups, haproxy and EC2 instances are.

## Modifying IP rules

Use this document to modify the IP addresses that are ```allowed``` to access the CATAPULT services. One would need to perform this when a previously added public IP address changes or a new IP address needs to be added.

To check the public IP address, you can use [this site](https://whatismyipaddress.com/).

The CATAPULT project currently has two sites:
* catapult.evergreeninnovations.co
* dev.evergreeninnovations.co
* prometheus.evergreeninnovations.co

To allow uses to the ```catapult``` subdomain, one would need to modify the [AWS Security Group](#modifying-aws-security-group). In the future this domain will be open to everyone and the access will be controller via customer login credentials (username and password).

The allow the users subdomains ```dev``` and ```prometheus``` one would need to modify the [AWS Security Group](#modifying-aws-security-group), as well as [HAProxy config file](#modifying-haproxy-config-file). This domain is more restrictive and should only be accessed by approved operators/engineers.

## Modifying AWS Security Group

1. Login to AWS using AWS console link and credentials provided to you by the AWS administrator. Contact the administrator if you do not have the credentials or appropriate permissions to perform changes to EC2 security groups.

2. Under ```Services```, search for ``EC2``.

3. Select ```Instances```

4. Choose the instance named ```BastionHost```. Select the ```Security``` tab which is located on the bottom panel.

5. Click on the associated ```Security groups```, this starts with ```sg-```.

6. For the chosen security group, In the ```Inbound rules``` tab, click on ```Edit inbound rules```.

7. Add the access ```TYPE```. There are some pre-defined types that can be used such as ```HTTP``` which always is on port 80, HTTPS which is always on 443. For a custom rule, we typically choose ```Custom TCP```.

8. Next, choose the ```PROTOCOL```, this represents the protocol being used - usually ```TCP```. 

9. Add the ```Port``` on the EC2 instance to which the traffic needs to be allowed. 

10. Select the ```Source``` IP address from which the access needs to be allowed. One can add ```Custom``` IP address by choosing the custom option from the dropdown and entering the IP address. This IP address is the public IP obtained from [here](https://whatismyipaddress.com/).

Add ```/32``` to the IP address suffix. The ```/32``` restricts access to only the IP address specified.

## Modifying HAProxy config file

To add the IP in the haproxy config file.

1. SSH into the AWS BastionHost server. Contact admin for access keys, and permissions.

```
ssh-add -K <Path to private key>.pem
ssh -A ubuntu@ec2-3-16-251-23.us-east-2.compute.amazonaws.com -p 7000
```

2. Open the ```haproxy.cfg``` in the editor of your choice.

```
sudo nano /etc/haproxy/haproxy.cfg 
```

3. Add the IP address to which you get from [here](https://whatismyipaddress.com/) under heading named ```frontend https_in```.

```shell
frontend https_in
  bind 0.0.0.0:443 ssl crt /etc/haproxy/certs/catapult.evergreeninnovations.co.pem
  option forwardfor
  http-request set-header X-Forwarded-Proto https
  mode http
  timeout client 86400000
  acl network_allowed src 66.60.144.68 207.183.255.30 45.23.191.125 67.166.130.2 98.41.47.229 <add new IP here>
  acl subdom1 hdr(host) -m str dev.evergreeninnovations.co # for subdomain1
  http-request set-header X-Forwarded-Port 9045            # forward request to port 9045
```

4. Save and exit

5. Restart haproxy
```shell
sudo systemctl restart haproxy
```
Check status
```
sudo systemctl status haproxy
```