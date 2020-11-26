## Installation

sudo apt update

sudo apt install prometheus-alertmanager


## Setup alerting in prometheus

cd /etc/prometheus/
nano rules/rules.yml 

nano prometheus.yml 

systemctl restart prometheus
systemctl status prometheus

systemctl restart prometheus-alertmanager
systemctl status prometheus-alertmanager


check config:

wget https://github.com/prometheus/prometheus/releases/download/v2.5.0/prometheus-2.5.0.linux-amd64.tar.gz

tar -xzf prometheus-*.tar.gz

sudo rm prometheus-2.5.0.linux-amd64.tar.gz 


./promtool check config /etc/prometheus/prometheus.yml


http endpoint:

wget https://github.com/prometheus/blackbox_exporter/releases/download/v0.12.0/blackbox_exporter-0.12.0.linux-amd64.tar.gz

tar -xzf blackbox_exporter-*.linux-amd64.tar.gz

nohup ./blackbox_exporter > blackbox.log 2>&1 &

nano blackbox.yml

