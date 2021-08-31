## Audience
The document is meant to be used by a developer. It is assumed that they know the basics of SSH.

## Purpose
The document explains the steps to give a new user the ability to perform SSH into the deployed EC2 server.

## Steps
1. Generate SSH Key Pair using the command below.
```shell
ssh-keygen -t rsa
```
Input the location to store the key pair generated on your computer. The default location is ```~/.ssh/id_rsa```.

```shell
ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/alekhya/.ssh/id_rsa):  <Enter custom location here>
```

The private key begins and ends with text that is similar shown below.
```shell
-----BEGIN OPENSSH PRIVATE KEY-----
<Encrypted text here>
-----END OPENSSH PRIVATE KEY-----
```
***The above key should be shared with anyone or stored outside the machine on which the key is generated.***
The public key is typically stored with an extension ```.pub ```. 

2. Next, copy the contents of the public key that ends with ```.pub```.

To view the contents, you can type the below command on your terminal.
```
cat <path given in step1>/id_rsa.pub
```

3. Send the contents of the file to the AWS administrator. Email: ```alekhya@evergreeninnovations.co```.

4. The AWS administrator will perform the steps outlined in the [next section](#aws-administrator-steps)

5. Once you receive an access confirmation email by the admin, you can now ssh into the EC2 servers following the below commands:
```shell
ssh-add -K <path given in step1>/id_rsa
```
To SSH into the BastionHost:
```shell
ssh -A ubuntu@ec2-3-16-251-23.us-east-2.compute.amazonaws.com -p 7000
```
To SSH into the AppInstance:
```
ssh ubuntu@ip-10-0-11-94.us-east-2.compute.internal
```

## AWS Administrator steps
***This section contains the steps that the AWS administrator needs to perform to authenticate the user to SSH into an EC2 instance.***
The public key should be generated and emailed to the admin before the below steps can be perform.
1. Add the SSH key to the SSH authentication agent to login into the server using SSH.
```shell
ssh-add -K ~/Dropbox\ \(EGI\)/egi_tech_int/07-catapult/05-aws/pemKey/CatapultSSHKeyPair.pem
```
2. Login to the BastionHost using your ```.pem``` key.
```shell
ssh -A ubuntu@ec2-3-16-251-23.us-east-2.compute.amazonaws.com -p 7000
```
3. Copy the contents of the public key sent by the user and append them to ```~/.ssh/authorized_keys``` file.
```shell
sudo nano  ~/.ssh/authorized_keys
```
4. Next, SSH into the AppInstance.
```shell
ssh ubuntu@ip-10-0-11-94.us-east-2.compute.internal
```
5. Repeat Step3.

6. Send an access confirmation email to the user which informs them that they have been granted developer access to the EC2 instances. 