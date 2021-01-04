```
psql --host catapultdatabase.cjkelvolrvnc.us-east-2.rds.amazonaws.com -U egiAdmin 

```

```shell
thingsboard=> select * from pg_stat_activity where pid=29721;

 datid |   datname   |  pid  | usesysid | usename  | application_name | client_addr | client_hostname | client_port |         backend_start         | xact_start |          query_start          |         state_change          | wait_event_type | wait_event | state | backend_xid | backend_xmin | query  |  backend_type  
-------+-------------+-------+----------+----------+------------------+-------------+-----------------+-------------+-------------------------------+------------+-------------------------------+-------------------------------+-----------------+------------+-------+-------------+--------------+--------+----------------
 16402 | thingsboard | 29721 |    16399 | egiAdmin |                  | 10.0.11.82  |                 |       43450 | 2021-01-04 19:41:43.353807+00 |            | 2021-01-04 19:50:38.536663+00 | 2021-01-04 19:50:38.537454+00 | Client          | ClientRead | idle  |             |              | COMMIT | client backend
(1 row)
```
