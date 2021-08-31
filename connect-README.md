# CATAPULT Documentation
The repository for the CATAPULT project components

The general instructions to SSH into AWS EC2 instances. SSH is short for Secure Shell, which is a secure way to access a computer over a network.

There are two types of AWS instances. One is the public instance which is hosted in the public subnet and another is a private instance that is hosted in the private instance. The private instance is not directly accessible from the internet. Refer to [catapult specification repository](https://github.com/BoxpowerInc/catapult-specification) for details.

In order to SSH into the AWS network, the IP address needs to be added by the administrator to the AWS security group. This will be changed in the future to a VPN based solution.

## SSH into private instance

SSH uses a PEM file to authenticate the user. The PEM key is also referred to as private keys.

1. Add the SSH key to the SSH authentication agent to login into the server using SSH.

```shell
ssh-add -K ~/Dropbox\ \(EGI\)/egi_tech_int/07-catapult/05-aws/pemKey/CatapultSSHKeyPair.pem
```
2. SSH into the server. ```-A``` option is used for forwarding the identity of the user. This enables us to SSH into the private instance from the public instance without copying over the PEM file. 
```shell
ssh -A ubuntu@ec2-3-16-251-23.us-east-2.compute.amazonaws.com -p 7000
```

3. To further SSH into the private instance.
```shell
ssh ubuntu@ip-10-0-11-94.us-east-2.compute.internal
```

## Connecting to RDS instance using pgAdmin

1. Install ```pgAdmin```
```shell
https://www.pgadmin.org/download/
```

2. Launch ```pgAdmin```. Right click on ```Servers -> Create Server```. Select the ```SSH Tunnel``` tab and enter information below:
```shell
Use SSH Tunneling: Yes
Tunnel host: ec2-3-16-251-23.us-east-2.compute.amazonaws.com
Tunnel port: 7000
Username: ubuntu 
Authentication: Identity file
Identity file: <browse path to the pem file on your machine>
```

Enter the below in the ```Connection``` tab:
```shell
Host: catapult-thingsboard-db.cxgbu6eiupvo.us-east-2.rds.amazonaws.com
Port: 5432
Maintainance database: catapultDatabase or postgres
User: egiAdmin
Password: egiAdmin2020 
Database: thingsboard
```

Click on ```Save```.
