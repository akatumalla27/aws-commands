## ThingsBoard 

```shell
sudo vi /etc/thingsboard/conf/thingsboard.yml 

sudo service thingsboard start

sudo service thingsboard status
```

Websocket Timeout Error:

https://thingsboard.io/docs/user-guide/install/config/

```shell
server.ws.send_timeout 	TB_SERVER_WS_SEND_TIMEOUT 	5000 	Timeout for sending data to client WebSocket session in milliseconds
```
