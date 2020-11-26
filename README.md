ssh -A ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com

ssh ubuntu@ip-10-0-11-82.us-east-2.compute.internal

CW Ref:

https://linuxbeast.com/tutorials/aws/monitor-memory-and-disk-metrics-for-amazon-ec2-ubuntu-18-04/

https://www.petefreitag.com/item/868.cfm

Metricbeat:

curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-7.6.2-amd64.deb
sudo dpkg -i metricbeat-7.6.2-amd64.deb

https://logz.io/blog/monitor-ec2-metricbeat-elk/


sudo nano /etc/metricbeat/modules.d/aws.yml

sudo nano /etc/metricbeat/modules.d/system.yml

sudo service metricbeat restart

sudo service metricbeat status


To start metricbeat on boot:
systemctl enable metricbeat

https://www.elastic.co/guide/en/beats/metricbeat/current/running-with-systemd.html
