
chmod 400 Dropbox\ \(EGI\)/egi_tech_int/07-catapult/05-aws/pemKey/SSHKeyPair.pem 

ssh-add -K Dropbox\ \(EGI\)/egi_tech_int/07-catapult/05-aws/pemKey/SSHKeyPair.pem 

ssh -A ubuntu@ec2-3-131-54-4.us-east-2.compute.amazonaws.com -p 7000

ssh ubuntu@ip-10-0-11-82.us-east-2.compute.internal

sudo apt install postgresql-client-common

sudo apt-get install postgresql-client

psql -h catapultdatabase.cjkelvolrvnc.us-east-2.rds.amazonaws.com -p 5432 --username=egiAdmin  --dbname=postgres

psql -h catapultdatabase.cjkelvolrvnc.us-east-2.rds.amazonaws.com -p 5432 --username=egiAdmin  --dbname=thingsboard

sudo /usr/share/thingsboard/bin/install/install.sh --loadDemo

 ===================================================
 :: ThingsBoard ::       (v3.1.1)
 ===================================================

Starting ThingsBoard Installation...
Installing DataBase schema for entities...
Installing SQL DataBase schema part: schema-entities.sql
Installing SQL DataBase schema indexes part: schema-entities-idx.sql
Installing DataBase schema for timeseries...
Installing SQL DataBase schema part: schema-ts-psql.sql
Successfully executed query: CREATE TABLE IF NOT EXISTS ts_kv_indefinite PARTITION OF ts_kv DEFAULT;
Loading system data...
Loading demo data...
Installation finished successfully!
ThingsBoard installed successfully!


sudo service thingsboard start

sudo service thingsboard status
● thingsboard.service - thingsboard
   Loaded: loaded (/lib/systemd/system/thingsboard.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-10-30 18:44:12 UTC; 47s ago
 Main PID: 10560 (thingsboard.jar)
    Tasks: 85 (limit: 4915)
   CGroup: /system.slice/thingsboard.service
           ├─10560 /bin/bash /usr/share/thingsboard/bin/thingsboard.jar
           └─10587 /usr/bin/java -Dsun.misc.URLClassPath.disableJarChecking=true -Dplatform=deb -Dinstall.data_dir=/usr/share/thingsboard/data -Xloggc:/var/log/thingsboard/gc.log -XX:+IgnoreUnrecognizedVMOptions -XX:+Hea

Oct 30 18:44:12 ip-10-0-11-82 systemd[1]: Started thingsboard.
Oct 30 18:44:16 ip-10-0-11-82 thingsboard.jar[10560]:  ===================================================
Oct 30 18:44:16 ip-10-0-11-82 thingsboard.jar[10560]:  :: ThingsBoard ::       (v3.1.1)
Oct 30 18:44:16 ip-10-0-11-82 thingsboard.jar[10560]:  ===================================================
