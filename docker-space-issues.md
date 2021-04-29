## Elasticsearch and Logstash

Follow logs:

```
docker logs -f --since 5m <container id>
```

## Disk space

Check disk space

```shell
Filesystem      Size  Used Avail Use% Mounted on
udev            3.8G     0  3.8G   0% /dev
tmpfs           776M  1.1M  774M   1% /run
/dev/nvme0n1p1   20G   13G  6.4G  68% /
tmpfs           3.8G     0  3.8G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           3.8G     0  3.8G   0% /sys/fs/cgroup
/dev/loop0       56M   56M     0 100% /snap/core18/1988
/dev/loop2      100M  100M     0 100% /snap/core/10908
/dev/loop3       33M   33M     0 100% /snap/amazon-ssm-agent/2996
/dev/loop1       34M   34M     0 100% /snap/amazon-ssm-agent/3552
/dev/loop5       50M   50M     0 100% /snap/certbot/1042
/dev/loop6       56M   56M     0 100% /snap/core18/1997
/dev/loop7       62M   62M     0 100% /snap/core20/975
/dev/loop8       62M   62M     0 100% /snap/core20/904
overlay          20G   13G  6.4G  68% /var/lib/docker/overlay2/4a81fd698af7c984ff9916448d9ed8201a09917dd227c5c3af877dfd4f887faf/merged
overlay          20G   13G  6.4G  68% /var/lib/docker/overlay2/032512b2e72c6a8249c238357ed368056cf959c609ea6ed3d8204e6c8c442d22/merged
overlay          20G   13G  6.4G  68% /var/lib/docker/overlay2/66568c45d02e89535ed30cc858944699cdf41978d4ab0a85ce82ff0872e84b58/merged
shm              64M     0   64M   0% /var/lib/docker/containers/77959d3cfdb490bdb650eaf441d84216a4e6e35cb2ea5bb8b4381a1bace14df3/mounts/shm
shm              64M     0   64M   0% /var/lib/docker/containers/62ba186a22612589f73dc39249bbb09dd90a928f47b24f39fbacccc089d9f78a/mounts/shm
shm              64M     0   64M   0% /var/lib/docker/containers/198d02002d92d1eed9f7248f791a69205862d1b37547ec8492188e39643e40c8/mounts/shm
/dev/loop10     100M  100M     0 100% /snap/core/10958
/dev/loop9       51M   51M     0 100% /snap/certbot/1093
overlay          20G   13G  6.4G  68% /var/lib/docker/overlay2/2fa8e3ec591df0fc6c4da5ab4f911a80eab16d2135aca1f6e80954e796a7b38a/merged
shm              64M     0   64M   0% /var/lib/docker/containers/e1baca3a8fd13609e838878a9659a69dbd89688d93cf9052ceb7a75bb9fe548a/mounts/shm
tmpfs           776M     0  776M   0% /run/user/1000
```

Check disk usage at the directory:

```shell
sudo du -a -h --max-depth=1 | sort -hr
```
```shell
Was:
14G	./docker
Now:
8.8G	./docker
```

## Docker stats
```
docker stats
```

```shell
CONTAINER ID        NAME                  CPU %               MEM USAGE / LIMIT     MEM %               NET I/O             BLOCK I/O           PIDS
e1baca3a8fd1        loving_panini         0.00%               12.96MiB / 7.569GiB   0.17%               212MB / 180MB       0B / 0B             6
198d02002d92        elk_logstash_1        3.85%               584.6MiB / 7.569GiB   7.54%               327MB / 454MB       104MB / 418kB       44
62ba186a2261        elk_kibana_1          0.48%               339.8MiB / 7.569GiB   4.38%               11.6GB / 7.18GB     395MB / 67.3MB      12
77959d3cfdb4        elk_elasticsearch_1   0.28%               632.2MiB / 7.569GiB   8.16%               4.22GB / 10.8GB     164MB / 1.21GB      63
```

## Clearing logs 

Elasticsearch generating lot of logs because of trial license expiring, lifecycle policies and full disk"

```shell
{"type": "server", "timestamp": "2021-04-29T17:34:06,582Z", "level": "WARN", "component": "o.e.l.LicenseService", "cluster.name": "docker-cluster", "node.name": "elasticsearch", "message": "LICENSE [EXPIRED] ON [SUNDAY, NOVEMBER 29, 2020].\n# IF YOU HAVE A NEW LICENSE, PLEASE UPDATE IT. OTHERWISE, PLEASE REACH OUT TO\n# YOUR SUPPORT CONTACT.\n# \n# COMMERCIAL PLUGINS OPERATING WITH REDUCED FUNCTIONALITY\n# - security\n#  - Cluster health, cluster stats and indices stats operations are blocked\n#  - All data operations (read and write) continue to work\n# - watcher\n#  - PUT / GET watch APIs are disabled, DELETE watch API continues to work\n#  - Watches execute and write to the history\n#  - The actions of the watches don't execute\n# - monitoring\n#  - The agent will stop collecting cluster and indices metrics\n#  - The agent will stop automatically cleaning indices older than [xpack.monitoring.history.duration]\n# - graph\n#  - Graph explore APIs are disabled\n# - ml\n#  - Machine learning APIs are disabled\n# - logstash\n#  - Logstash will continue to poll centrally-managed pipelines\n# - beats\n#  - Beats will continue to poll centrally-managed configuration\n# - deprecation\n#  - Deprecation APIs are disabled\n# - upgrade\n#  - Upgrade API is disabled\n# - sql\n#  - SQL support is disabled\n# - rollup\n#  - Creating and Starting rollup jobs will no longer be allowed.\n#  - Stopping/Deleting existing jobs, RollupCaps API and RollupSearch continue to function.\n# - transform\n#  - Creating, starting, updating transforms will no longer be allowed.\n#  - Stopping/Deleting existing transforms continue to function.\n# - analytics\n#  - Aggregations provided by Analytics plugin are no longer usable.\n# - ccr\n#  - Creating new follower indices will be blocked\n#  - Configuring auto-follow patterns will be blocked\n#  - Auto-follow patterns will no longer discover new leader indices\n#  - The CCR monitoring endpoint will be blocked\n#  - Existing follower indices will continue to replicate data", "cluster.uuid": "mJm0XW09ToiT1ujtZlHe4g", "node.id": "Ao6wx0TzTTqpn0YlTUTojQ"  }
```

Removing old elk logs from docker container

```shell
198d02002d92 -> container name 
: > $(docker inspect --format='{{.LogPath}}' 198d02002d92)
: > $(docker inspect --format='{{.LogPath}}' 77959d3cfdb4)
: > $(docker inspect --format='{{.LogPath}}' 62ba186a2261)
```

Actual path:
```shell
/var/lib/docker/containers/77959d3cfdb490bdb650eaf441d84216a4e6e35cb2ea5bb8b4381a1bace14df3
```
File looks like, but do not remove this directly:
```shell
-rw-r----- 1 root root 4514 Apr 29 19:14 77959d3cfdb490bdb650eaf441d84216a4e6e35cb2ea5bb8b4381a1bace14df3-json.log
```

## Kibana

We can use Elasticsearch API.

Get all indices:
```
GET /_cat/indices


green  open .kibana_task_manager_1   NPvZU0QlTqGtB0idLMfkIA 1 0    2 2  20.9kb  20.9kb
yellow open metricbeat-7.6.2         ZlFwByBCRRye5PsZvz1JwQ 1 1    2 0  89.3kb  89.3kb
green  open .apm-agent-configuration ODiisAv6STq8jlE4lBLAKg 1 0    0 0    283b    283b
yellow open filebeat-7.11.2          kaV0dnHUSDullsYpBbgCuw 1 1  759 0 346.1kb 346.1kb
green  open .kibana_1                kt3DEL_BRGaP7BaCjQqH3Q 1 0 1247 5 666.4kb 666.4kb
yellow open filebeat-7.9.3           DIvl9FQxTDqkr33wQ2ArSA 1 1    8 0 178.9kb 178.9kb
```
Around -> 1301.9kb -> 1.3mb

Delete old data in index:

```shell
DELETE /metricbeat-7.6.2
{
  "query": {
    "range": {
      "timestamp": {
        "gte": "now-30d/d",
        "lt": "now/d"
      }
    }
  }
}
```
```shell
DELETE /filebeat-7.11.2
{
  "query": {
    "range": {
      "timestamp": {
        "gte": "now-1d/d",
        "lt": "now/d"
      }
    }
  }
}
```

Delete index.

```shell
DELETE /ilm-history-*
```

Get cluster health:
```
GET _cluster/health
```

Adding alias:

```shell
POST /_aliases
{ "actions" :
  [ 
    { "add" : { 
  "index" : "filebeat-7.9.3", 
  "alias" : "sitesimulator-alias1" 
      }
    } 
  ]   
}
```
