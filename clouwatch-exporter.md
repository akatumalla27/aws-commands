
* Cloudwatch metrics specification

nano /opt/prometheus/dist/cloudwatch_exporter/cloudwatch.json

```json
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
"aws_dimensions" :["InstanceId"],
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

cd /etc/systemd/system
nano prometheus_cloudwatch_exporter.service

```shell
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

curl http://localhost:9106/metrics

```shell
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
