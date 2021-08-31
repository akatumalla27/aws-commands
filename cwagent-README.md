## Installing CW Agent on Ubuntu 18.04

* All commands are run as sudo 
```shell
sudo -s
```
* Download Cloudwatch package
```
curl -o /root/amazon-cloudwatch-agent.deb https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
```
* Install 
```
dpkg -i -E /root/amazon-cloudwatch-agent.deb
```

* Modify the linux user account that the installer created ```cwagent``` and add it to the ```adm``` group, which will give it read permission to many of the default Ubuntu system logs.
```
usermod -aG adm cwagent
```
* Create an IAM Role for the EC2 server and attach the role to EC2 instance.

There is a template policy which I used now ```CloudWatchAgentServerPolicy``` but this should be more restricted in the future.

* Create the directory and place the config file in the location.

```
mkdir /home/cwagent/
mkdir /home/cwagent/.aws
touch /home/cwagent/.aws/config
```
* Add the below info to the config file, change region as appropriate

```
vi /home/cwagent/.aws/config

[AmazonCloudWatchAgent]
output = text
region = us-east-2
```
* Create cloudwatch settings file as json

```
vi /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```
```shell
{
	"agent": {
		"metrics_collection_interval": 60,
		"run_as_user": "cwagent",
		"credentials_path":"/home/cwagent/.aws/credentials"
	},
	"logs": {
		"logs_collected": {
			"files": {
				"collect_list": [
					{
						"file_path": "/var/log/syslog",
						"log_group_name": "ec2-servers-log-group",
						"log_stream_name": "{hostname}/syslog",
						"timestamp_format" :"%b %d %H:%M:%S"
					}
                                ]
                        }
               }
       }
}
```

The above reads logs from ```/var/log/syslog``` (system logs) and publishes them to cloudwatch.

* Enable and start the service

```
systemctl enable amazon-cloudwatch-agent.service
service amazon-cloudwatch-agent start
```
## To monitor memory and disk metrics for EC2 Ubuntu 18.04

* Install packages

```
sudo apt-get update
sudo apt-get install unzip
sudo apt-get install libwww-perl libdatetime-perl
```
* Download scripts
```
curl https://aws-cloudwatch.s3.amazonaws.com/downloads/CloudWatchMonitoringScripts-1.2.2.zip -O
```
* Unzip

```
unzip CloudWatchMonitoringScripts-1.2.2.zip
```
* Remove zip

```
rm CloudWatchMonitoringScripts-1.2.2.zip
```
* Change directory

```
cd aws-scripts-mon
```
* Verify scripts

```
./mon-put-instance-data.pl --mem-util --verify --verbose
```

It should look like below

```shell
No credential methods are specified. Trying default IAM role.
Using IAM role <PrivatetoCloudWatch>
Endpoint: https://monitoring.us-east-2.amazonaws.com
Payload: {"Namespace":"System/Linux","MetricData":[{"Value":36.3762585796908,"MetricName":"MemoryUtilization","Timestamp":1604950199,"Unit":"Percent","Dimensions":[{"Value":"i-0c20bc3be2d370984","Name":"InstanceId"}]}],"__type":"com.amazonaws.cloudwatch.v2010_08_01#PutMetricDataInput"}

Verification completed successfully. No actual metrics sent to CloudWatch.

```
* To collects all available memory utilization and disk space utilization, type the following command below to transport the metrics logs to Amazon CloudWatch.

```
./mon-put-instance-data.pl --mem-util --disk-space-util --disk-path=/
```

Output:

Successfully reported metrics to CloudWatch. Reference Id: xxx

* Cron schedule

```
crontab -e
```
* report memory and disk space utilization to CloudWatch logs for every five minutes time interval:

```
/5 * * * * ~/aws-scripts-mon/mon-put-instance-data.pl --mem-util --disk-space-util --disk-path=/ --from-cron
```