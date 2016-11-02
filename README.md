NodeJS Backend for Event listener
================

** Check `backup.txt` for configuration settings **


## Installation


**Install the geth/ Ethereum packages**

```
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo add-apt-repository -y ppa:ethereum/ethereum-dev
sudo apt-get update
sudo apt-get install ethereum
sudo apt-get install ethminer
sudo apt-get install solc
```

**Install NodeJS related packages**

```
sudo apt-get install nodejs
sudo apt-get install npm
```

**Install git and screen if they are not installed**

```
sudo apt-get install git
sudo apt-get install screen
```


## Install go and compile a customized version of geth

Open a new `screen` session, and then execute as root:
```
screen
[ENTER]
sudo su -
cd ~
```

```
sudo apt-get update
sudo apt-get -y upgrade
sudo curl -O https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
sudo tar -xvf go1.6.linux-amd64.tar.gz
sudo mv go /usr/local
rm go1.6.linux-amd64.tar.gz
```

### Setting Go Paths

First, set Go's root value, which tells Go where to look for its files.

`sudo nano ~/.profile`

At the end of the file, add this line:

`export PATH=$PATH:/usr/local/go/bin`

Next, refresh your profile by running:

`source ~/.profile`


### Compile geth

`git clone https://github.com/Musicoin/blockchain.git`

`cd blockchain`

`make geth`

After it is successfully compiled, copy it so user can access it from any location of the machine.

`cp build/bin/geth /usr/bin`





## Connect the musicoin genesis blockchain

You will need to run Geth with RPC, please add more flags accordingly:

`geth --datadir ~/.musicoin --networkid 55313716 --identity Musicoin --port 30303 --rpc --rpcapi=db,eth,net,web3,personal --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain localhost console`

If you are running the mining node, you may simply execute:
`geth --identity Musicoin --networkid 55313716 --datadir ~/.musicoin console`

And then create a wallet before mining

`personal.newAccount()`
`miner.start()`

`Ctrl+a then d` to detach current `screen` session. Geth console continues running in backend


## Setting up event listener:

_Prerequisites: MusicoinLogger contract has to be deployed into the network in advance. Otherwise no events can be listened._

```
screen
[ENTER]
sudo su -
cd ~
```

`git clone https://github.com/Musicoin/event-listener.git`

`cd event-listener`

`npm install`

`cp config.json.tmpl config.json`

Edit `config.json`  and fill in the required values

`nodejs listener.js`

`Ctrl+a then d` to detach current `screen` session. NodeJS application continues running in backend

The server will be up at http://SERVER_IP_ADDRESS:5000. Then paste your contract source code in the form. After compiling, paste the contract address and pick the contract name deployed in the form. Once the form is submited, contract events will be listened.

Note: The script can watch one contract at one time. Only the last contract will be watched after re-configuration.


## Other requirements

### MySQL
- You will need a MySQL instance running to save log data. Copy the file `config.json.tmpl` as `config.json`, and fill in access info to your MySQL server.
- Check `schema.sql` for database schema.
- Cloud SQL access have to be enabled for this instance. Otherwise it cannot be connected from NodeJS application. See https://console.cloud.google.com/sql/instances for settings
