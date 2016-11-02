NodeJS Backend for Event listener
================

** Check `backup.txt` for configutaion settings **


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

## Connect the musicoin genesis blockchain

Open a new `screen` session, and then execute as root:
```
screen
[ENTER]
sudo su -
cd ~
```

### Follow the steps below for setting geth:

`git clone https://github.com/BerryAI/.musicoin.git` then enter your password (Limited preview only)

`ls -la` to check `.musicoin` exists

`geth --datadir ~/.musicoin init ~/.musicoin/musicoin_genesis.json`

`geth --datadir ~/.musicoin --networkid 55313716 --identity Musicoin --port 30303 --rpc --rpcapi=db,eth,net,web3,personal --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain localhost console`

`Ctrl+a then d` to detach current `screen` session. Geth console continues running in backend


### Follow the steps below for setting event listener:

_Prerequisites 1: MusicoinLogger contract has to be deployed into the network in advance. Otherwise no events can be listened._

_Prerequisites 2: Cloud SQL access have to be enabled for this instance. Otherwise it cannot be connected from NodeJS application. See https://console.cloud.google.com/sql/instances for settings_


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

