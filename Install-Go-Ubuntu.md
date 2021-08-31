# Installing Go on Ubuntu server

## Get zip from go download page 
```bash:
cd ~
curl -O https://dl.google.com/go/go1.15.6.linux-amd64.tar.gz
```

## Verify the checksum of the tar
```bash:
sha256sum go1.15.6.linux-amd64.tar.gz
```
Then verify the checksum [here](https://golang.org/dl/)

## Extract the tar
```bash:
tar xvf go1.10.3.linux-amd64.tar.gz
```
## Change ownership and move to ```/usr/local```
```bash:
sudo chown -R root:root ./go
sudo mv go /usr/local
```
## Set up GO Paths and Env
```bash:
sudo nano ~/.profile
```
Add these lines to the bottom of the document:
```bash:
export GOROOT=/usr/local/go
export GOPATH=$HOME/gowrk
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
```
Refresh the profile:
```bash:
source ~/.profile
```
## Create the directory for go workspace, get files, build binary

```bash:
mkdir $HOME/gowrk
mkdir -p gowrk/src/github.com/evergreen-innovations
cd gowrk/src/github.com/evergreen-innovations

git clone https://github.com/evergreen-innovations/catapult-device-automation.git

cd catapult-device-automation
go build 
```

