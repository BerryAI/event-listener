var express = require('express');
var fs = require('fs');
var app = express();
var dateFormat = require('dateformat');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

var options = require('./options');
var favicon = require('serve-favicon');

var MyContract;
var myContractInstance;
var myContractInstanceAddress;


var mysql = require('mysql');

function handleError (err) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            console.error(err.stack || err);
        }
    }
}

function connect () {
    connection = mysql.createConnection({
        host    : options.storageConfig.host,
        user    : options.storageConfig.user,
        password: options.storageConfig.password,
        database: options.storageConfig.database
    });
    connection.connect(handleError);
    connection.on('error', handleError);
}

var connection;
connect();




var record_database = function(
        block_id, msg_sender, msg_value, contract_address, block_hash, log_index,
        transaction_hash, transaction_index, event_name, description
){

    var query = 'INSERT INTO contract_event ' +
        '(`block_id`, `msg_sender`, `msg_value`, `contract_address`, `block_hash`, `log_index`, `transaction_hash`, `transaction_index`, `event_name`, `description`, `datetime`)' +
        'VALUES (?,?,?,?,?, ?,?,?,?,?, now()); ';

    connection.query(
        query,
        [block_id, msg_sender, web3.toBigNumber(msg_value).toNumber(), contract_address, block_hash, log_index, transaction_hash, transaction_index, event_name, description]
    , function(err, rows, fields) {
        if (err) throw err;
    });

}


var watchEvents = function(contract){

    if(typeof playEvent !== 'undefined' && playEvent){
        eventIssueManagementFee.stopWatching();
    }
    if(typeof licenseUpdateEvent !== 'undefined' && licenseUpdateEvent){
        licenseUpdateEvent.stopWatching();
    }
    if(typeof transferEvent !== 'undefined' && transferEvent){
        transferEvent.stopWatching();
    }
    if(typeof resourceUpdateEvent !== 'undefined' && resourceUpdateEvent){
        resourceUpdateEvent.stopWatching();
    }
    if(typeof metadataUpdateEvent !== 'undefined' && metadataUpdateEvent){
        metadataUpdateEvent.stopWatching();
    }


    playEvent = contract.playEvent({}, function(error, result) {
        if (!error) {
            var description = "playEvent by " + result.args.sender + ". plays: " + result.args.plays;
            var msg = "["+ result.blockNumber +"] playEvent recorded";
            msg += "\n    - address: " + result.address + "";
            msg += "\n    - blockHash: " + result.blockHash + "";
            msg += "\n    - logIndex: " + result.logIndex + "";
            msg += "\n    - transactionHash: " + result.transactionHash + "";
            msg += "\n    - transactionIndex: " + result.transactionIndex + "";
            msg += "\n    - event: " + result.event + "";
            console.log(msg);


            // record_database(result.blockNumber, result.args.msg_sender, result.args.msg_value, result.address, result.blockHash, result.logIndex,
            //                 result.transactionHash, result.transactionIndex, result.event, description);
        }
    });

    licenseUpdateEvent = contract.licenseUpdateEvent({}, function(error, result) {
        if (!error) {
            var description = "licenseUpdateEvent by " + result.args.sender + ". version: " + result.args.version;
            var msg = "["+ result.blockNumber +"] licenseUpdateEvent recorded";
            msg += "\n    - address: " + result.address + "";
            msg += "\n    - blockHash: " + result.blockHash + "";
            msg += "\n    - logIndex: " + result.logIndex + "";
            msg += "\n    - transactionHash: " + result.transactionHash + "";
            msg += "\n    - transactionIndex: " + result.transactionIndex + "";
            msg += "\n    - event: " + result.event + "";
            console.log(msg);
        }
    });

    transferEvent = contract.transferEvent({}, function(error, result) {
        if (!error) {
            var description = "transferEvent by " + result.args.sender + ". oldOwner: " + result.args.oldOwner + ". newOwner: " + result.args.newOwner;
            var msg = "["+ result.blockNumber +"] transferEvent recorded";
            msg += "\n    - address: " + result.address + "";
            msg += "\n    - blockHash: " + result.blockHash + "";
            msg += "\n    - logIndex: " + result.logIndex + "";
            msg += "\n    - transactionHash: " + result.transactionHash + "";
            msg += "\n    - transactionIndex: " + result.transactionIndex + "";
            msg += "\n    - event: " + result.event + "";
            console.log(msg);
        }
    });

    resourceUpdateEvent = contract.resourceUpdateEvent({}, function(error, result) {
        if (!error) {
            var description = "resourceUpdateEvent by " + result.args.sender + ". oldResource: " + result.args.oldResource + ". newResource: " + result.args.newResource;
            var msg = "["+ result.blockNumber +"] resourceUpdateEvent recorded";
            msg += "\n    - address: " + result.address + "";
            msg += "\n    - blockHash: " + result.blockHash + "";
            msg += "\n    - logIndex: " + result.logIndex + "";
            msg += "\n    - transactionHash: " + result.transactionHash + "";
            msg += "\n    - transactionIndex: " + result.transactionIndex + "";
            msg += "\n    - event: " + result.event + "";
            console.log(msg);
        }
    });


    metadataUpdateEvent = contract.metadataUpdateEvent({}, function(error, result) {
        if (!error) {
            var description = "metadataUpdateEvent by " + result.args.sender + ". oldResource: " + result.args.oldResource + ". newResource: " + result.args.newResource;
            var msg = "["+ result.blockNumber +"] metadataUpdateEvent recorded";
            msg += "\n    - address: " + result.address + "";
            msg += "\n    - blockHash: " + result.blockHash + "";
            msg += "\n    - logIndex: " + result.logIndex + "";
            msg += "\n    - transactionHash: " + result.transactionHash + "";
            msg += "\n    - transactionIndex: " + result.transactionIndex + "";
            msg += "\n    - event: " + result.event + "";
            console.log(msg);
        }
    });





};


app.get('/', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('views/index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/api/currentAddress', function(req, res){
    console.log('GET /api/currentAddress');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({"status": "success", "message": "", "address": myContractInstanceAddress}));
});

app.get('/logs', function(req, res){
    console.log('GET /logs')
    contract = req.query.contract;

    var query = "SELECT * FROM `contract_event` ";

    // Query data from MySQL
    if(contract){
        query = query + " WHERE `contract_address` = ? ";
    }else{
        contract = "";
    }

    // order by the latest event
    query = (query + " ORDER BY `contract_event`.`datetime` DESC;");
    console.log(query)
    console.log("contract = " + contract);


    connection.query(query, [contract], function(err, rows){

        if(err)
            console.log("Error Selecting : %s ",err );

        for(var _i in rows){
            rows[_i].datetime_string = dateFormat(rows[_i].datetime, "mmm dd yyyy, hh:MM:ss TT") + " UTC";
            rows[_i].msg_value_wei = Number(rows[_i].msg_value);
            rows[_i].msg_value_ether = rows[_i].msg_value_wei / Math.pow(10, 18);
        }

        res.render('logs', {
            data: rows,
            contract: contract
        });
    });

});


app.post('/updateContract', function(req, res){
    console.log('POST /updateContract');

    address = req.body.address;
    if(!address){
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"status": "failed", "message": "MISSING_PARAMETER", "details": "address"}));
        return
    }

    abiDefinition = req.body.abiDefinition;
    if(!abiDefinition){
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"status": "failed", "message": "MISSING_PARAMETER", "details": "abiDefinition"}));
        return
    }

    MyContract = web3.eth.contract(JSON.parse(abiDefinition));
    myContractInstance = MyContract.at(address);
    myContractInstanceAddress = address;

    watchEvents(myContractInstance);

    res.header("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({"status": "success", "message": ""}));
});


app.post('/compile/solidity', function(req, res){
    console.log('POST /compile/solidity')

    source_string = req.body.source_string
    if(!source_string){
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"status": "failed", "message": "MISSING_PARAMETER"}));
        return
    }
    try{
        result = web3.eth.compile.solidity(source_string)
    }catch(err){
        console.log(err.message)
        if(err.message.indexOf("Expected import directive or contract definition.") > -1){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                "status": "failed",
                "message": "CONTRACT_INVALID",
                "details": "Expected import directive or contract definition."
            }));
        }else if(err.message.indexOf("solc: exit status") > -1){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                "status": "failed",
                "message": "CONTRACT_INVALID",
                "details": err.message
            }));
        }else if(err.message.indexOf("Invalid JSON RPC response") > -1){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                "status": "failed",
                "message": "CONTRACT_INVALID",
                "details": err.message
            }));
        }else{
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                "status": "failed",
                "message": "ETH_SERVER_CONNECTION_ERROR"
            }));
        }
        return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
});




app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Thanks for trying, but nothing here :(');
});

app.get('*', function(req, res){
    console.log('Not found')
    res.writeHead(400, {'Content-Type': 'text/html'});
    res.end("Page not found");
});

port = 5000;
app.listen(port);
console.log('Listening at http://localhost:' + port)
