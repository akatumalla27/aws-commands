# Let's Encrypt cert renewal 

Domains to renew as of 2020-11-23:
```
catapult.evergreeninnovations.co
dev.evergreeninnovations.co
prometheus.evergreeninnovations.co
```
pre-renewal.sh adds a rule to security group to allow port 80 access from Anywhere (ipv4 and ipv6)
```shell
aws ec2 authorize-security-group-ingress  --group-id sg-003d701ce1baa2623 --ip-permissions IpProtocol=tcp,FromPort=80,ToPort=80,Ipv6Ranges='[{CidrIpv6=::/0}]'
aws ec2 authorize-security-group-ingress --group-id sg-003d701ce1baa2623 --protocol tcp --port 80 --cidr 0.0.0.0/0
```
post-renewal.sh removes the rule which on port 80 which allows access from Anywhere (ipv4 and ipv6)

```shell
aws ec2 revoke-security-group-ingress  --group-id sg-003d701ce1baa2623 --ip-permissions IpProtocol=tcp,FromPort=80,ToPort=80,Ipv6Ranges='[{CidrIpv6=::/0}]'
aws ec2 revoke-security-group-ingress --group-id sg-003d701ce1baa2623 --protocol tcp --port 80 --cidr 0.0.0.0/0
```

Command to test the cert renewal:

```shell
sudo certbot certonly -a standalone --http-01-port 54321  --dry-run --pre-hook "/home/ubuntu/cert-renewal-scripts/./pre-renewal.sh" --post-hook "/home/ubuntu/cert-renewal-scripts/./post-renewal.sh"  -d catapult.evergreeninnovations.co -d dev.evergreeninnovations.co -d prometheus.evergreeninnovations.co
```

Add the pre and post renewal scripts to ```/etc/letsencrypt/renewal-hooks/pre``` and ```/etc/letsencrypt/renewal-hooks/post```.

Once certificates are issued successfully, the haproxy cert files need to be updated and the service haproxy needs a restart. This can be done using a deploy hook. This script has commands to be run in a shell once for each successfully issued certificate. The script should be placed at ```/etc/letsencrypt/renewal-hooks/deploy/deploy-hook.sh```

```shell
#!/bin/sh
# Concatenate new cert files, with less output (avoiding the use tee and its output to stdout)
if [ "$RENEWED_LINEAGE" = "/etc/letsencrypt/live/catapult.evergreeninnovations.co" ]
then
bash -c "cat /etc/letsencrypt/live/catapult.evergreeninnovations.co/fullchain.pem /etc/letsencrypt/live/catapult.evergreeninnovations.co/privkey.pem > /etc/haproxy/certs/catapult.evergreeninnovations.co.pem"
# Reload  HAProxy
service haproxy reload
elif [ "$RENEWED_LINEAGE" = "/etc/letsencrypt/live/dev.evergreeninnovations.co" ]
then
bash -c "cat /etc/letsencrypt/live/dev.evergreeninnovations.co/fullchain.pem /etc/letsencrypt/live/dev.evergreeninnovations.co/privkey.pem > /etc/haproxy/certs/dev.evergreeninnovations.co.pem"
# Reload  HAProxy
service haproxy reload
fi
```
Test renewal:
```
certbot renew --dry-run
```

Newer certbot verisons (installed v1.9.0), have the renewal cron job created automatically at ```/etc/cron.d/certbot```:
```shell
# /etc/cron.d/certbot: crontab entries for the certbot package
#
# Upstream recommends attempting renewal twice a day
#
# Eventually, this will be an opportunity to validate certificates
# haven't been revoked, etc.  Renewal will only occur if expiration
# is within 30 days.
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
# At minute 0 past every 12th hour
0 */12 * * * root test -x /usr/bin/certbot && perl -e 'sleep int(rand(3600))' && certbot -c /usr/local/etc/letsencrypt/cli.ini -q renew
```

The run config is at:
```
nano /usr/local/etc/letsencrypt/cli.ini
```

