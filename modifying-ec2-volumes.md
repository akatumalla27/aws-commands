## Check current space on EBS volume

df -h

df -hT
Filesystem     Type      Size  Used Avail Use% Mounted on
udev           devtmpfs  3.8G     0  3.8G   0% /dev
tmpfs          tmpfs     767M  984K  766M   1% /run
/dev/nvme0n1p1 ext4      7.7G  7.0G  736M  91% /
tmpfs          tmpfs     3.8G     0  3.8G   0% /dev/shm
tmpfs          tmpfs     5.0M     0  5.0M   0% /run/lock
tmpfs          tmpfs     3.8G     0  3.8G   0% /sys/fs/cgroup
/dev/loop0     squashfs   98M   98M     0 100% /snap/core/10185
/dev/loop1     squashfs   29M   29M     0 100% /snap/amazon-ssm-agent/2012
/dev/loop2     squashfs   61M   61M     0 100% /snap/core20/634
/dev/loop3     squashfs   48M   48M     0 100% /snap/certbot/652
/dev/loop4     squashfs   56M   56M     0 100% /snap/core18/1932
/dev/loop5     squashfs   29M   29M     0 100% /snap/amazon-ssm-agent/2333
tmpfs          tmpfs     767M     0  767M   0% /run/user/1000
* To check whether the volume has a partition that must be extended, use the lsblk command to display information about the NVMe block devices attached to your instance. 

lsblk

NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0         7:0    0 97.8M  1 loop /snap/core/10185
loop1         7:1    0 28.1M  1 loop /snap/amazon-ssm-agent/2012
loop2         7:2    0   61M  1 loop /snap/core20/634
loop3         7:3    0 47.5M  1 loop /snap/certbot/652
loop4         7:4    0 55.4M  1 loop /snap/core18/1932
loop5         7:5    0 28.1M  1 loop /snap/amazon-ssm-agent/2333
nvme0n1     259:0    0   20G  0 disk 
└─nvme0n1p1 259:1    0    8G  0 part /

sudo growpart /dev/nvme0n1 1


lsblk

df -h

On [ext4 file system] Use the resize2fs command to extend the file system on each volume.

sudo resize2fs /dev/nvme0n1p1
