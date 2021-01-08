* Easy beats is an easy way to install filebeat for the demo:

https://github.com/josh-thurston/easyBEATS

sudo apt-get install git -y

git clone https://github.com/josh-thurston/easyBEATS

sudo chmod 755 easyBEATS

cd easyBEATS

nano easyBEATS

change filebeat version to the latest (as of 2020/11/06):

BEAT_VERSION="v7.9.3" #the version tag name or commit id of the Beats release you want to use
BEAT_NAME=( filebeat ) #metricbeat filebeat packetbeat auditbeat heartbeat
INSTALL_LOCAL=false # AK didnt use this yet

* Comment out lines which install Go, (if already present on the ARM machine)
```
  echo "Installing go..."
  wget https://dl.google.com/go/go1.13.8.linux-armv6l.tar.gz
  sudo tar -C /usr/share -xzf go1.13.8.linux-armv6l.tar.gz
  sudo chmod -R 775 /usr/share/go/
  sudo chmod -R 777 /usr/share/go/pkg/linux_arm/
  export PATH=$PATH:/usr/share/go/bin;
  export GOPATH=$HOME/${WORKING_DIR};
  rm go1.13.8.linux-armv6l.tar.gz;
``` 
* Run the script
./easyBEATS

* If any errors while running the above, you can run the script commands:
```
sudo mkdir -p /usr/share//bin;
sudo mkdir -p /etc/filebeat;
sudo mkdir -p /var/lib/filebeat
```
```
    sudo cp $HOME/${WORKING_DIR}/src/github.com/elastic/beats/${beat}/${beat} /usr/share/filebeat/bin
    sudo cp $HOME/${WORKING_DIR}/src/github.com/elastic/beats/${beat}/${beat}.reference.yml /etc/filebeat
    sudo cp $HOME/${WORKING_DIR}/src/github.com/elastic/beats/${beat}/${beat}.yml /etc/filebeat
```
* If modules present,
```
    sudo cp -R $HOME/${WORKING_DIR}/src/github.com/elastic/beats/${beat}/module /usr/share/filebeat
    sudo cp -R $HOME/${WORKING_DIR}/src/github.com/elastic/beats/${beat}/modules.d/ /etc/$filebeat

  sudo cp $HOME/Documents/easyBEATS/services/filebeat.service /lib/systemd/system
  sudo chmod -R 755 /etc/filebeat/;
  sudo chown -R root:root /etc/filebeat;
  sudo chown -R root:root /usr/share/filebeat/*;
  sudo /bin/systemctl daemon-reload;
  sudo systemctl enable filebeat;
```
* Edit yaml file as needed
```
cd /etc/filebeat
sudo nano filebeat.yml
```
* Run filebeat
```
sudo systemctl start filebeat.service

sudo systemctl restart filebeat.service

sudo systemctl status filebeat.service
```



