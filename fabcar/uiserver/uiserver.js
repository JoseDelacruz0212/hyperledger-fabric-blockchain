var express = require('express');
const cors=require('cors');
var bodyParser = require('body-parser');


var app = express();
app.use(cors());
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
//const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
//      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
app.set("view engine", "pug");

app.get('/api/', function (req, res) {

        res.render('index');

});

app.get('/api/createcar', function (req, res) {

        res.render('createcar');

});



app.get('/api/getAlltransactions', async function (req, res) {
        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get('appUser1');
                if (!identity) {
                        console.log('An identity for the user "appUser1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');

                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryAllCars');
                console.log(JSON.parse(result));
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                res.status(200).json({ response:JSON.parse(result.toString()) });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                
        }
});
app.get('/api/query/:user_id', async function (req, res) {
        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get('appUser1');
                if (!identity) {
                        console.log('An identity for the user "appUser1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryCar', req.params.user_id);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                res.status(200).json({ response:JSON.parse(result.toString()) });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                
        }
});

app.get('/api/history/:user_id', async function (req, res) {
        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get('appUser1');
                if (!identity) {
                        console.log('An identity for the user "appUser1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('getHistoryForTransaction', req.params.user_id);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                res.status(200).json({ response:JSON.parse(result.toString()) });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                
        }
});



app.post('/api/addTransaction/', urlencodedParser, async function (req, res) {
        try {

                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get('appUser1');
                if (!identity) {
                        console.log('An identity for the user "appUser1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')

                await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.colour, req.body.owner);

                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                
        }
})





app.put('/api/changeowner/:car_index', async function (req, res) {
        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get('appUser1');
                if (!identity) {
                        console.log('An identity for the user "appUser1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser1', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('chafngeCarOwner', req.params.car_index, req.body.owner);
                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                
        }
})

app.listen(8080);
