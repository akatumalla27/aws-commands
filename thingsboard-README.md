# ThingsBoard documentation

We are using Ubuntu Server 18.04 LTS. According the thingsboard documentation -

```
choose Ubuntu Server 18.04 LTS. We recommend this distribution and OS version for our product.
```

Reference: https://thingsboard.io/docs/user-guide/install/cluster/aws-self-hosted-setup/

## Initial Commands on EC2 instance 

### Install java

ThingsBoard is java based and needs java installed on the system.

```shell
sudo apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;
```

```shell
sudo apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;
```
```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
```

* Installation of ThingsBoard.

Change version below as needed based on latest release [here](https://github.com/thingsboard/thingsboard/releases).
```
sudo apt-get -y update && apt-get -y upgrade
sudo apt-get -y install wget
sudo wget https://github.com/thingsboard/thingsboard/releases/download/v3.1.1/thingsboard-3.1.1.deb
sudo dpkg -i thingsboard-3.1.1.deb 
```

* Copy ThingsBoard settings from ```thingsboard.yml``` and ```thingsboard.conf``` files.

Before copying the new files, it is recommended to take a backup of the old or default files.
```
sudo cp /etc/thingsboard/conf/thingsboard.yml /etc/thingsboard/conf/thingsboard.yml.bk
sudo cp /etc/thingsboard/conf/thingsboard.conf /etc/thingsboard/conf/thingsboard.conf.bk
```

Repo for ```.yml``` and ```.conf``` https://github.com/BoxpowerInc/catapult-thingsboard.

```
git clone git@github.com:BoxpowerInc/catapult-thingsboard.git
cd catapult-infrastructure/thingsboard
cp thingsboard.yml /etc/thingsboard/conf/thingsboard.yml
cp thingsboard.conf /etc/thingsboard/conf/thingsboard.conf
```

```
sudo /usr/share/thingsboard/bin/install/install.sh --loadDemo
```

* In above step, change the database connection settings in ```thingsboard.conf``` file in lines 31,32,33.
```
export SPRING_DATASOURCE_URL=jdbc:postgresql://<aws rds db url>:5432/thingsboard
export SPRING_DATASOURCE_USERNAME=<db username>
export SPRING_DATASOURCE_PASSWORD=<db password>
```

* In AWS, create a AWS RDS instance. In the security group of the EC2 instance, allow traffic from the private subnet security group. The database is in a private subnet (not accessible directly from the internet). It should look something like below
```
Inbound rules

	  Type         Protocol       Port range          Source                     Description - optional
  All traffic	   All	           All	       sg-06612dd603c423ab7 (default)	      -
```

## To look at ThingsBoard logs

```
sudo tail -f /var/log/thingsboard/thingsboard.log
```

## To upgrade the thingsboard version
```
https://thingsboard.io/docs/user-guide/install/upgrade-instructions
https://thingsboard.io/docs/user-guide/install/upgrade-instructions/#upgrading-to-32
```
```
wget https://github.com/thingsboard/thingsboard/releases/download/v3.2/thingsboard-3.2.deb
sudo dpkg -i thingsboard-3.2.deb
```


```shell
sudo vi /etc/thingsboard/conf/thingsboard.yml 

sudo service thingsboard start
sudo service thingsboard restart
sudo service thingsboard status
```

The below command might work but is not tested.
```
sudo /usr/share/thingsboard/bin/install/upgrade-tb.sh
```