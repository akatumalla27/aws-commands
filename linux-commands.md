# Linux Commands

* RAM

top

free -m (in mb)

free -g (in gb)

watch -n 1 free -m

vmstat -s

* Source Location of processes:

less /proc/meminfo

* Free cache

sudo sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

sudo sysctl -w vm.drop_caches=3


 sudo tcpdump -XX -i ens5 dst 10.0.1.45
