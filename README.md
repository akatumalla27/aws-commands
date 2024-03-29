# Welcome to the CATAPULT project!

## Refer [Wiki](https://github.com/BoxpowerInc/catapult-documentation/wiki) for documentation.

---

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

### Help
Please contact the developer at Evergreen Innovations ```alekhya@evergreeninnovations.co``` for any questions or queries.

