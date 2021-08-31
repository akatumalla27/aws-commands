# Prometheus and Alertmanager setup

## Install Prometheus

* Latest prometheus version link below:

https://prometheus.io/download/#prometheus

Install the latest version.

```shell
sudo su -
export RELEASE="2.23.0"
wget https://github.com/prometheus/prometheus/releases/download/v${RELEASE}/prometheus-${RELEASE}.linux-amd64.tar.gz
```
* Extract the tar:
```shell
tar xvf prometheus-${RELEASE}.linux-amd64.tar.gz
```
* Change directory
```shell
cd prometheus-${RELEASE}.linux-amd64/
```
* Prometheus needs its own user and group
```shell
groupadd --system prometheus
grep prometheus /etc/group

useradd -s /sbin/nologin -r -g prometheus prometheus
id prometheus
```

* Create config and data directories
```shell
mkdir -p /etc/prometheus/{rules,rules.d,files_sd}  /var/lib/prometheus
cp prometheus promtool /usr/local/bin/
ls /usr/local/bin/
cp -r consoles/ console_libraries/ /etc/prometheus/
```

* Create a systemd unit file

```shell
# cat /etc/systemd/system/prometheus.service

[Unit]
Description=Prometheus systemd service unit
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=prometheus
Group=prometheus
ExecReload=/bin/kill -HUP $MAINPID
ExecStart=/usr/local/bin/prometheus \
--config.file=/etc/prometheus/prometheus.yml \
--storage.tsdb.path=/var/lib/prometheus \
--web.console.templates=/etc/prometheus/consoles \
--web.console.libraries=/etc/prometheus/console_libraries \
--web.listen-address=0.0.0.0:9091

SyslogIdentifier=prometheus
Restart=always

[Install]
WantedBy=multi-user.target
```
* Make your changes as needed to ```prometheus.yml``` file
* The ownership of Prometheus files and data should be its user and group.
```shell
chown -R prometheus:prometheus /etc/prometheus/  /var/lib/prometheus/
chmod -R 775 /etc/prometheus/ /var/lib/prometheus/
```

* Start and enable Prometheus service to start on boot.
```shell
systemctl start prometheus
systemctl enable prometheus
systemctl status prometheus
```
* To check config, ``` cd /usr/local/bin/```
```shell
./promtool check config /etc/prometheus/prometheus.yml
```
or 

```shell
sudo /usr/local/bin/./promtool check config /etc/prometheus/prometheus.yml
```

## Install Alertmanager

```shell
sudo apt update
sudo apt install prometheus-alertmanager
```

* Start and check alertmanager service

```shell
systemctl restart prometheus-alertmanager 
systemctl status prometheus-alertmanager
sudo systemctl enable prometheus-alertmanager (to run on boot)
```


## Blackbox exporter for HTTP endpoints
https://github.com/prometheus/blackbox_exporter
* Blackbox install
```shell
wget https://github.com/prometheus/blackbox_exporter/releases/download/v0.12.0/blackbox_exporter-0.12.0.linux-amd64.tar.gz
tar -xzf blackbox_exporter-*.linux-amd64.tar.gz
nohup ./blackbox_exporter > blackbox.log 2>&1 &
nano blackbox.yml
```
You wouldn't need to change anything in the yaml file.

* Copy the files to a location

```shell 
sudo mkdir /usr/local/bin/blackbox_exporter
sudo cp blackbox_exporter-0.12.0.linux-amd64/blackbox_exporter /usr/local/bin/blackbox_exporter/.
sudo cp blackbox_exporter-0.12.0.linux-amd64/blackbox_exporter.yml /usr/local/bin/blackbox_exporter/.
```

* Create a ```blackbox_exporter``` user and group

```shell
sudo useradd -M -r -s /bin/false blackbox_exporter
sudo id blackbox_exporter
sudo chown blackbox_exporter:blackbox_exporter /usr/local/bin/blackbox_exporter
```

* Create a systemd file
```shell
sudo vim /etc/systemd/system/blackbox_exporter.service
[Unit]
Description=Prometheus BlackBox Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=blackbox_exporter
Group=blackbox_exporter
Type=simple
Restart=always
RestartSec=10
ExecStart=/usr/local/bin/blackbox_exporter/blackbox_exporter --config.file="/usr/local/bin/blackbox_exporter/blackbox.yml"

[Install]
WantedBy=multi-user.target
```

* Check and enable service on boot

```
sudo systemctl daemon-reload
sudo systemctl start blackbox_exporter.service
sudo systemctl status blackbox_exporter.service
sudo systemctl enable blackbox_exporter.service

```

## Node exporter for system metrics
https://github.com/prometheus/node_exporter

* Create a user 
```shell
useradd -M -r -s /bin/false node_exporter
id node_exporter
```
* Download and install node exporter. Find the latest version https://prometheus.io/download/#node_exporter.
```shell
wget https://github.com/prometheus/node_exporter/releases/download/v1.0.1/node_exporter-1.0.1.linux-amd64.tar.gz
tar xzf node_exporter-*
cp node_exporter-* /usr/local/bin/
```

* Change ownership
```shell
chown node_exporter:node_exporter /usr/local/bin/node_exporter
```

* Systemd setup
```shell
vim /etc/systemd/system/node_exporter.service
```

```shell
[Unit]
Description=Prometheus Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```
* For more statistics,

```shell
ExecStart=/usr/local/bin/node_exporter --collector.cpu --collector.meminfo --collector.loadavg --collector.filesystem

systemctl daemon-reload

systemctl start node_exporter.service
systemctl enable node_exporter.service
```

* Add target to prometheus.yml
```shell
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'private_server'
    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s
    static_configs:
      - targets: ['10.0.11.82:9100']
```


## Cloudwatch exporter
https://github.com/prometheus/cloudwatch_exporter

* Install, needs maven and jdk

```shell
git clone https://github.com/prometheus/cloudwatch_exporter.git
apt-get install maven openjdk-8-jdk
cd cloudwatch_exporter
mvn package
```

* Create an IAM role with ```CloudWatchReadOnlyAccess``` policy attached. Attach it to the EC2 instance.

* Specify metrics to be collected in ```cloudwatch.json``` file. This could also be written as a YAML file.

```shell
{
"region" : "us-east-2",
"period_seconds": 300,
"metrics": [

{
"aws_namespace":"AWS/RDS",
"aws_metric_name": "FreeStorageSpace",
"aws_dimensions" :["DBInstanceIdentifier"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"AWS/RDS",
"aws_metric_name": "BurstBalance",
"aws_dimensions" :["DBInstanceIdentifier"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"AWS/RDS",
"aws_metric_name": "DiskQueueDepth",
"aws_dimensions" :["DBInstanceIdentifier"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"AWS/RDS",
"aws_metric_name": "FreeableMemory",
"aws_dimensions" :["DBInstanceIdentifier"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"System/Linux",
"aws_metric_name": "MemoryUtilization",
"aws_dimensions" :["InstanceId"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"System/Linux",
"aws_metric_name": "DiskSpaceUtilization",
"aws_dimensions" :["Filesystem","InstanceId","MountPath"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"AWS/EC2",
"aws_metric_name": "StatusCheckFailed_Instance",
"aws_dimensions" :["InstanceId"],
"aws_statistics": ["Average"]
},
{
"aws_namespace":"AWS/EC2",
"aws_metric_name": "StatusCheckFailed_System",
"aws_dimensions" :["InstanceId"],
"aws_statistics": ["Average"]
} 

]

}
```
* Systemd settings
```shell
cd /etc/systemd/system 
nano prometheus_cloudwatch_exporter.service

[Unit]
Description=Cloudwatch Prometheus exporter
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/bin/java -jar /opt/prometheus/dist/cloudwatch_exporter/target/cloudwatch_exporter-0.9.1-SNAPSHOT-jar-with-dependencies.jar 9106 /opt/prometheus/dist/cloudwatch_exporter/cloudwatch.json

[Install]
WantedBy=multi-user.target
```

* To start stop cloudwatch

```shell
systemctl daemon-reload
systemctl start prometheus_cloudwatch_exporter
systemctl restart prometheus_cloudwatch_exporter
systemctl status prometheus_cloudwatch_exporter
```
* To check the metrics endpoint

```
curl http://localhost:9106/metrics
```
```
# HELP tagging_api_requests_total API requests made to the Resource Groups Tagging API
# TYPE tagging_api_requests_total counter
# HELP aws_rds_free_storage_space_average CloudWatch metric AWS/RDS FreeStorageSpace Dimensions: [DBInstanceIdentifier] Statistic: Average Unit: Bytes
# TYPE aws_rds_free_storage_space_average gauge
aws_rds_free_storage_space_average{job="aws_rds",instance="",dbinstance_identifier="catapultdatabase",} 1.37649709056E10 1606774500000
# HELP aws_rds_burst_balance_average CloudWatch metric AWS/RDS BurstBalance Dimensions: [DBInstanceIdentifier] Statistic: Average Unit: Percent
# TYPE aws_rds_burst_balance_average gauge
aws_rds_burst_balance_average{job="aws_rds",instance="",dbinstance_identifier="catapultdatabase",} 99.0 1606774500000
# HELP aws_rds_disk_queue_depth_average CloudWatch metric AWS/RDS DiskQueueDepth Dimensions: [DBInstanceIdentifier] Statistic: Average Unit: Count
# TYPE aws_rds_disk_queue_depth_average gauge
aws_rds_disk_queue_depth_average{job="aws_rds",instance="",dbinstance_identifier="catapultdatabase",} 0.013282693980698358 1606774500000
# HELP aws_rds_freeable_memory_average CloudWatch metric AWS/RDS FreeableMemory Dimensions: [DBInstanceIdentifier] Statistic: Average Unit: Bytes
# TYPE aws_rds_freeable_memory_average gauge
aws_rds_freeable_memory_average{job="aws_rds",instance="",dbinstance_identifier="catapultdatabase",} 2.3355400192E9 1606774500000
# HELP system_linux_memory_utilization_average CloudWatch metric System/Linux MemoryUtilization Dimensions: [InstanceId] Statistic: Average Unit: Percent
# TYPE system_linux_memory_utilization_average gauge
system_linux_memory_utilization_average{job="system_linux",instance="",instance_id="i-0c20bc3be2d370984",} 73.8696961269181 1606774500000
# HELP aws_ec2_status_check_failed_instance_average CloudWatch metric AWS/EC2 StatusCheckFailed_Instance Dimensions: [InstanceId] Statistic: Average Unit: Count
# TYPE aws_ec2_status_check_failed_instance_average gauge
aws_ec2_status_check_failed_instance_average{job="aws_ec2",instance="",instance_id="i-0c20bc3be2d370984",} 0.0 1606774500000
aws_ec2_status_check_failed_instance_average{job="aws_ec2",instance="",instance_id="i-02e6eee91a2e442da",} 0.0 1606774500000
# HELP aws_ec2_status_check_failed_system_average CloudWatch metric AWS/EC2 StatusCheckFailed_System Dimensions: [InstanceId] Statistic: Average Unit: Count
# TYPE aws_ec2_status_check_failed_system_average gauge
aws_ec2_status_check_failed_system_average{job="aws_ec2",instance="",instance_id="i-0c20bc3be2d370984",} 0.0 1606774500000
aws_ec2_status_check_failed_system_average{job="aws_ec2",instance="",instance_id="i-02e6eee91a2e442da",} 0.0 1606774500000
# HELP aws_resource_info AWS information available for resource
# TYPE aws_resource_info gauge
# HELP cloudwatch_exporter_scrape_duration_seconds Time this CloudWatch scrape took, in seconds.
# TYPE cloudwatch_exporter_scrape_duration_seconds gauge
cloudwatch_exporter_scrape_duration_seconds 0.309158686
# HELP cloudwatch_exporter_scrape_error Non-zero if this scrape failed.
# TYPE cloudwatch_exporter_scrape_error gauge
cloudwatch_exporter_scrape_error 0.0
# HELP cloudwatch_requests_total API requests made to CloudWatch
# TYPE cloudwatch_requests_total counter
cloudwatch_requests_total{action="listMetrics",namespace="AWS/RDS",} 12.0
cloudwatch_requests_total{action="getMetricStatistics",namespace="AWS/EC2",} 12.0
cloudwatch_requests_total{action="listMetrics",namespace="AWS/EC2",} 6.0
cloudwatch_requests_total{action="getMetricStatistics",namespace="System/Linux",} 3.0
cloudwatch_requests_total{action="getMetricStatistics",namespace="AWS/RDS",} 12.0
cloudwatch_requests_total{action="listMetrics",namespace="System/Linux",} 6.0
```
