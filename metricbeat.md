## Installation

The steps are valid for Ubuntu 18.04.

```
curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-7.6.2-amd64.deb 
sudo dpkg -i metricbeat-7.6.2-amd64.deb
```
Check for the latest version [here](https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-installation-configuration.html).

## Modify config

First, we need to disable the system module that is enabled by default. Otherwise, we will be seeing system metrics in Kibana collected from our host. 
This is not mandatory but is recommended if you want to keep a cleaner Kibana workspace.
```
sudo metricbeat modules disable system
```
Verify with:
```
ls /etc/metricbeat/module.d
Output:
envoyproxy.yml.disabled     kvm.yml.disabled         postgresql.yml.disabledaerospike.yml.disabled      etcd.yml.disabled        logstash.yml.disabled   prometheus.yml.disabledapache.yml.disabled         golang.yml.disabled      memcached.yml.disabled  rabbitmq.yml.disabledaws.yml.disabled            graphite.yml.disabled    mongodb.yml.disabled    redis.yml.disabledceph.yml.disabled           haproxy.yml.disabled     mssql.yml.disabled      system.yml.disabledcouchbase.yml.disabled      http.yml.disabled        munin.yml.disabled      traefik.yml.disabledcouchdb.yml.disabled        jolokia.yml.disabled     mysql.yml.disabled      uwsgi.yml.disableddocker.yml.disabled         kafka.yml.disabled       nats.yml.disabled       vsphere.yml.disableddropwizard.yml.disabled     kibana.yml.disabled      nginx.yml.disabled      windows.yml.disabledelasticsearch.yml.disabled  kubernetes.yml.disabled  php_fpm.yml.disabled    zookeeper.yml.disabled
```

The next step is to configure the AWS module.

```
sudo vim /etc/metricbeat/module.d/aws.yml.disabled
```

The permissions will be set by the aws role attached with the instance in AWS.

```
sudo nano /etc/metricbeat/modules.d/aws.yml

sudo nano /etc/metricbeat/modules.d/system.yml
```

```
sudo service metricbeat restart

sudo service metricbeat status

To start metricbeat on boot: systemctl enable metricbeat
```
