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
    // Deprecated

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

var record_music_play = function(block_id, contract_address, play_count){

    console.log("playEvent recorded at block_id=" + block_id + ", contract_address=" + contract_address)
    var query = 'INSERT INTO music_play ' +
        '(`block_id`, `contract_address`, `play_count`, `datetime`)' +
        'VALUES (?,?,?, now()); ';

    connection.query(
        query,
        [block_id, contract_address, play_count]
    , function(err, rows, fields) {
        if (err) throw err;
    });
}

var record_tip = function(block_id, contract_address, tip_amount, tip_count){

    console.log("tipEvent recorded at block_id=" + block_id + ", contract_address=" + contract_address)
    var query = "INSERT INTO music_tip (" +
"`block_id`, `contract_address`, `tip_amount`, `tip_count`, `datetime`)" +
"VALUES (?,?,?,?, now()); ";

    connection.query(
        query,
        [block_id, contract_address, tip_amount, tip_count]
    , function(err, rows, fields) {
        if (err) throw err;
    });
}

var record_work_release = function(block_id, contract_address, owner_address, title, artist){

    console.log("workReleasedEvent recorded at block_id=" + block_id + ", contract_address=" + contract_address)
    var query = "INSERT INTO music_work_release_bc (" +
"`block_id`, `contract_address`, `owner_address`, `title`, `artist`, `is_processed`, `datetime`)" +
"VALUES (?,?,?,?,?, 0,now()); ";

    connection.query(
        query,
        [block_id, contract_address, owner_address, title, artist]
    , function(err, rows, fields) {
        if (err) throw err;
    });
}

var record_license_release = function(block_id, contract_address, work_id){

    console.log("licenseReleasedEvent recorded at block_id=" + block_id + ", contract_address=" + contract_address)
    var query = "INSERT INTO music_license_release_bc (" +
"`block_id`, `contract_address`, `work_id`, `is_processed`, `datetime`)" +
"VALUES (?,?,?, 0,now()); ";

    connection.query(
        query,
        [block_id, contract_address, work_id]
    , function(err, rows, fields) {
        if (err) throw err;
    });
}



var record_license_update = function(block_id, contract_address, license_version){

    console.log("licenseUpdateEvent recorded at block_id=" + block_id + ", contract_address=" + contract_address)
    var query = "INSERT INTO music_license_update_bc (" +
"`block_id`, `contract_address`, `owner_address`, `version`, `artist_name`," +
"`song_name`, `album_name`, `resource_url` ,`artwork_url`, `is_processed`, `datetime`)" +
"VALUES (?,?,?,?,?, ?,?,?,?, 0, now()); ";

    var pppAbi = [{"constant":true,"inputs":[],"name":"resourceUrl","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_distributeBalanceFirst","type":"bool"}],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"tip","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"contributors","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"collectPendingPayment","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"licenseVersion","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"metadataVersion","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalEarned","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newMetadataUrl","type":"string"}],"name":"updateMetadataUrl","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"distributeBalance","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"royalties","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"workAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"newResourceUrl","type":"string"}],"name":"updateResourceUrl","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"play","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"playCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"contractVersion","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingPayment","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"royaltyAmounts","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"weiPerPlay","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalTipped","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"metadataUrl","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_weiPerPlay","type":"uint256"},{"name":"_royalties","type":"address[]"},{"name":"_royaltyAmounts","type":"uint256[]"},{"name":"_contributors","type":"address[]"},{"name":"_contributorShares","type":"uint256[]"}],"name":"updateLicense","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"contributorShares","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"tipCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"inputs":[{"name":"_loggerAddress","type":"address"},{"name":"_workAddress","type":"address"},{"name":"_weiPerPlay","type":"uint256"},{"name":"_resourceUrl","type":"string"},{"name":"_metadataUrl","type":"string"},{"name":"_royalties","type":"address[]"},{"name":"_royaltyAmounts","type":"uint256[]"},{"name":"_contributors","type":"address[]"},{"name":"_contributorShares","type":"uint256[]"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"plays","type":"uint256"}],"name":"playEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"plays","type":"uint256"},{"indexed":false,"name":"tipCount","type":"uint256"}],"name":"tipEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"version","type":"uint256"}],"name":"licenseUpdateEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"transferEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldResource","type":"string"},{"indexed":false,"name":"newResource","type":"string"}],"name":"resourceUpdateEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldMetadata","type":"string"},{"indexed":false,"name":"newMetadata","type":"string"}],"name":"metadataUpdateEvent","type":"event"}]

    var ppp = web3.eth.contract(pppAbi).at(contract_address);
    var metadataUrl = ppp.metadataUrl()

    // console.dir(ppp)

    connection.query(
        query,
        [block_id, contract_address, ppp.owner(), license_version, "",
        "", "", ppp.resourceUrl(), "", metadataUrl]
    , function(err, rows, fields) {
        if (err) throw err;
    });
}





var watchEvents = function(contract){

    if(typeof playEvent !== 'undefined' && playEvent){
        playEvent.stopWatching();
    }
    if(typeof tipEvent !== 'undefined' && tipEvent){
        tipEvent.stopWatching();
    }
    if(typeof workReleasedEvent !== 'undefined' && workReleasedEvent){
        workReleasedEvent.stopWatching();
    }
    if(typeof licenseReleasedEvent !== 'undefined' && licenseReleasedEvent){
        licenseReleasedEvent.stopWatching();
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
            record_music_play(result.blockNumber, result.args.sender, result.args.plays.toNumber())
        }
    });

    tipEvent = contract.tipEvent({}, function(error, result) {
        if (!error) {
            record_tip(result.blockNumber, result.args.sender, result.args.tipAmount.toNumber(), result.args.tipCount.toNumber())
        }
    });

    workReleasedEvent = contract.workReleasedEvent({}, function(error, result) {
        if (!error) {
            record_work_release(result.blockNumber, result.args.sender, result.args.owner, result.args.title, result.args.artist)
        }
    });

    licenseReleasedEvent = contract.licenseReleasedEvent({}, function(error, result) {
        if (!error) {
            record_license_release(result.blockNumber, result.args.sender, result.args.work)
        }
    });

    licenseUpdateEvent = contract.licenseUpdateEvent({}, function(error, result) {
        if (!error) {
            record_license_update(result.blockNumber, result.args.sender, result.args.version.toNumber())
        }
    });


    // TODO: requires new DB table for these events
    transferEvent = contract.transferEvent({}, function(error, result) {
        if (!error) {
            var description = "transferEvent by " + result.args.sender + ". oldOwner: " + result.args.oldOwner + ". newOwner: " + result.args.newOwner;
            var msg = "["+ result.blockNumber +"] transferEvent recorded";
            msg += "\n    - MusicoinLogger: " + result.address + "";
            msg += "\n    - contract: " + result.args.sender + "";

            console.dir(result);
            console.log(msg);

            record_database(result.blockNumber, result.args.msg_sender, result.args.msg_value, result.address, result.blockHash, result.logIndex,
                            result.transactionHash, result.transactionIndex, result.event, description);
        }
    });

    resourceUpdateEvent = contract.resourceUpdateEvent({}, function(error, result) {
        if (!error) {
            var description = "resourceUpdateEvent by " + result.args.sender + ". oldResource: " + result.args.oldResource + ". newResource: " + result.args.newResource;
            var msg = "["+ result.blockNumber +"] resourceUpdateEvent recorded";
            msg += "\n    - MusicoinLogger: " + result.address + "";
            msg += "\n    - contract: " + result.args.sender + "";

            console.dir(result);
            console.log(msg);

            record_database(result.blockNumber, result.args.msg_sender, result.args.msg_value, result.address, result.blockHash, result.logIndex,
                            result.transactionHash, result.transactionIndex, result.event, description);
        }
    });


    metadataUpdateEvent = contract.metadataUpdateEvent({}, function(error, result) {
        if (!error) {
            var description = "metadataUpdateEvent by " + result.args.sender + ". oldResource: " + result.args.oldResource + ". newResource: " + result.args.newResource;
            var msg = "["+ result.blockNumber +"] metadataUpdateEvent recorded";
            msg += "\n    - MusicoinLogger: " + result.address + "";
            msg += "\n    - contract: " + result.args.sender + "";

            console.dir(result);
            console.log(msg);

            record_database(result.blockNumber, result.args.msg_sender, result.args.msg_value, result.address, result.blockHash, result.logIndex,
                            result.transactionHash, result.transactionIndex, result.event, description);
        }
    });


};


app.get('/api/contract', function(req, res){
    console.log('GET /api/contract')
    contract_address = req.query.address;

    res.writeHead(200, {'Content-Type': 'application/json'});

    if (contract_address == ""){
        res.end(JSON.stringify({
            "success": false,
            "message": "MISSING_PARAMETER:address"
        }))
        return
    }

    var pppAbi = [{"constant":true,"inputs":[],"name":"resourceUrl","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_distributeBalanceFirst","type":"bool"}],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"tip","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"contributors","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"collectPendingPayment","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"licenseVersion","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"metadataVersion","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalEarned","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newMetadataUrl","type":"string"}],"name":"updateMetadataUrl","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"distributeBalance","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"royalties","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"workAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"newResourceUrl","type":"string"}],"name":"updateResourceUrl","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"play","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"playCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"contractVersion","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingPayment","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"royaltyAmounts","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"weiPerPlay","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalTipped","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"metadataUrl","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_weiPerPlay","type":"uint256"},{"name":"_royalties","type":"address[]"},{"name":"_royaltyAmounts","type":"uint256[]"},{"name":"_contributors","type":"address[]"},{"name":"_contributorShares","type":"uint256[]"}],"name":"updateLicense","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"contributorShares","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"tipCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"inputs":[{"name":"_loggerAddress","type":"address"},{"name":"_workAddress","type":"address"},{"name":"_weiPerPlay","type":"uint256"},{"name":"_resourceUrl","type":"string"},{"name":"_metadataUrl","type":"string"},{"name":"_royalties","type":"address[]"},{"name":"_royaltyAmounts","type":"uint256[]"},{"name":"_contributors","type":"address[]"},{"name":"_contributorShares","type":"uint256[]"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"plays","type":"uint256"}],"name":"playEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"plays","type":"uint256"},{"indexed":false,"name":"tipCount","type":"uint256"}],"name":"tipEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"version","type":"uint256"}],"name":"licenseUpdateEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"transferEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldResource","type":"string"},{"indexed":false,"name":"newResource","type":"string"}],"name":"resourceUpdateEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldMetadata","type":"string"},{"indexed":false,"name":"newMetadata","type":"string"}],"name":"metadataUpdateEvent","type":"event"}]
    var license = web3.eth.contract(pppAbi).at(contract_address);

    // for(i in contract){
    //     console.log(i)
    //     // console.log(contract[i])
    // }

    res.end(JSON.stringify({
        "success": true,
        "message": "",
        "contract": {
            "address": contract_address,
            "balance": web3.eth.getBalance(contract_address),
            "resourceUrl": license.resourceUrl(),
            "totalShares": license.totalShares().toNumber(),
            "contributors": license.contributors(),
            "licenseVersion": license.licenseVersion().toNumber(),
            "metadataVersion": license.metadataVersion().toNumber(),
            "totalEarned": license.totalEarned(),
            "royalties": license.royalties(),
            "workAddress": license.workAddress(),
            "owner": license.owner(),
            "playCount": license.playCount().toNumber(),
            "contractVersion": license.contractVersion(),
            "pendingPayment": license.pendingPayment().toNumber(),
            "royaltyAmounts": license.royaltyAmounts().toNumber(),
            "weiPerPlay": license.weiPerPlay().toNumber(),
            "totalTipped": license.totalTipped().toNumber(),
            // "metadataUrl": license.metadataUrl(),
            "contributorShares": license.contributorShares().toNumber(),
            "tipCount": license.tipCount().toNumber()
        }
    }));

});


app.get('/api/work', function(req, res){
    console.log('GET /api/work')
    work_address = req.query.address;

    res.writeHead(200, {'Content-Type': 'application/json'});

    if (work_address == ""){
        res.end(JSON.stringify({
            "success": false,
            "message": "MISSING_PARAMETER:address"
        }))
        return
    }

    var workAbi = [{"constant": true, "inputs": [], "name": "artist", "outputs": [{"name": "", "type": "string"} ], "type": "function"}, {"constant": true, "inputs": [], "name": "title", "outputs": [{"name": "", "type": "string"} ], "type": "function"}, {"constant": true, "inputs": [], "name": "workType", "outputs": [{"name": "", "type": "uint8"} ], "type": "function"}, {"constant": true, "inputs": [], "name": "imageUrl", "outputs": [{"name": "", "type": "string"} ], "type": "function"}, {"constant": true, "inputs": [], "name": "metadataUrl", "outputs": [{"name": "", "type": "string"} ], "type": "function"}, {"constant": true, "inputs": [], "name": "logger", "outputs": [{"name": "", "type": "address"} ], "type": "function"}, {"inputs": [{"name": "_loggerAddress", "type": "address"}, {"name": "_workType", "type": "uint8"}, {"name": "_title", "type": "string"}, {"name": "_artist", "type": "string"}, {"name": "_imageUrl", "type": "string"}, {"name": "_metadataUrl", "type": "string"} ], "type": "constructor"} ]
    var work = web3.eth.contract(workAbi).at(work_address);

    res.end(JSON.stringify({
        "success": true,
        "message": "",
        "work": {
            "address": work_address,
            "balance": web3.eth.getBalance(work_address),
            "artist": work.artist(),
            "title": work.title(),
            "workType": work.workType(),
            "imageUrl": work.imageUrl(),
            "metadataUrl": work.metadataUrl()
        }
    }));

});




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
    // onPlayEvent(myContractInstance, handle_new_license);
    // onNewLicensePublished(myContractInstance, handle_new_license);

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
