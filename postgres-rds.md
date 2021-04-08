Install postgres client
```
sudo apt-get install postgresql-client
```
From public server (IP -> ip-10-0-1-189)
```
sudo psql --host catapultdatabase.cjkelvolrvnc.us-east-2.rds.amazonaws.com -U egiAdmin catapultDatabase <database name>
```
To exit ``` \q```

```shell
thingsboard=> select * from pg_stat_activity where pid=29721;

 datid |   datname   |  pid  | usesysid | usename  | application_name | client_addr | client_hostname | client_port |         backend_start         | xact_start |          query_start          |         state_change          | wait_event_type | wait_event | state | backend_xid | backend_xmin | query  |  backend_type  
-------+-------------+-------+----------+----------+------------------+-------------+-----------------+-------------+-------------------------------+------------+-------------------------------+-------------------------------+-----------------+------------+-------+-------------+--------------+--------+----------------
 16402 | thingsboard | 29721 |    16399 | egiAdmin |                  | 10.0.11.82  |                 |       43450 | 2021-01-04 19:41:43.353807+00 |            | 2021-01-04 19:50:38.536663+00 | 2021-01-04 19:50:38.537454+00 | Client          | ClientRead | idle  |             |              | COMMIT | client backend
(1 row)
```
Tunnel:
```
sudo ssh -N -L 5431:catapultdatabase.cjkelvolrvnc.us-east-2.rds.amazonaws.com:5432 -i SSHKeyPair.pem ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com -p 7000 

sudo scp -i SSHKeyPair.pem -P 7000 SSHKeyPair.pem  ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com:/home/ubuntu/tunnel/.
sudo scp -i SSHKeyPair.pem -P 7000  tunnel.sh ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com:/home/ubuntu/tunnel/.

```
tunnel.sh

```
#!/bin/bash
remote_host=ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com
remote_port=5431
local_port=5432 
identity_file="SSHKeyPair.pem"
db_host=catapultdatabase.cjkelvolrvnc.us-east-2.rds.amazonaws.com 
cmd="ssh -p 7000 -fN -L ${remote_port}:${db_host}:${local_port} -i ${identity_file} ${remote_host} -o ExitOnForwardFailure=yes"

while true; do
    pgrep -fx "$cmd" >/dev/null 2>&1 || $cmd
    sleep 10
done
```

```
sudo psql --host localhost --port 5431 -U egiAdmin catapultDatabase
```
