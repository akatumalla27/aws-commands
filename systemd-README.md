## Systemd

Create and open file 
```
sudo vim /etc/systemd/system/tou.service
```

Copy the text below
```
[Unit]
Description=Supervisor
Wants=network-online.target
After=network-online.target

[Service]
User=ubuntu
Type=simple
Restart=always
RestartSec=10
ExecStart=/opt/config/tou/./tou "/opt/config/tou/config-cloud.json"

[Install]
WantedBy=multi-user.target
```

Change ownership of directory if needed:
sudo chown -R ubuntu:ubuntu /opt/config/tou/

Removing the ```User``` option gives root level access. 

Restart

```
sudo systemctl daemon-reload
sudo systemctl restart tou.service
sudo systemctl status tou.service
sudo systemctl stop tou.service
```
