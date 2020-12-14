```
On Pi:
ssh-keygen -m PEM

cat ../id_rsa.pub

sudo go run reverse-tunnel_v3.go endpoints.json

On Machine:
ssh -p 10000 pi@localhost

sudo nano ~/.ssh/authorized_keys
```
