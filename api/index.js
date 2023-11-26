const express = require('express');
const axios = require('axios');
const Web3 = require('web3');

///
const providerUrl = 'https://alfajores-forno.celo-testnet.org';
// const abi = JSON.parse(fs.readFileSync('build/contracts/LifeCoverInsurance.json').abi);
const abi = require('../build/contracts/LifeCoverInsurance.json').abi;

const contractAddress =  process.env.LIFECOVERADDRESS || '0x24552BAd4A0382f099AcE8fE30D6A0a2f47F6FB6';

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
const contract = new web3.eth.Contract(abi, contractAddress);

// Create Express app
const app = express();
const port = process.env.API_PORT || 4343;

// API base path
const apiBasePath = '/api';

// Set up middleware for parsing JSON requests
app.use(express.json());

// Endpoint for purchasing a policy
app.post(`${apiBasePath}/purchase-policy`, async (req, res) => {
    const { insuredID, coverageAmount, senderAddress, privateKey } = req.body;

    try {
        const gas = await contract.methods
            .purchasePolicy(insuredID, coverageAmount)
            .estimateGas({ from: senderAddress });

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                gas,
                to: contractAddress,
                data: contract.methods.purchasePolicy(insuredID, coverageAmount).encodeABI(),
                from: senderAddress,
            },
            privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.json({ success: true, transactionHash: receipt.transactionHash });
    } catch (error) {
        console.log({error});
        res.status(500).json({ success: false, error: error.message });
    }
});


// Endpoint for filing a claim
app.post(`${apiBasePath}/file-claim`, async (req, res) => {
    try {
        // Extract necessary data from request body
        const { policyHolderId, policyId, deathTimestamp } = req.body;
        // Estimate gas
        const gasLimit = await contract.methods.fileClaim(policyId, deathTimestamp).estimateGas({ from: policyHolderId });

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice();

        // Create transaction object
        const transactionObject = {
            from: policyHolder,
            to: contractAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: contract.methods.fileClaim(deathTimestamp).encodeABI(),
        };

        // Sign transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, privateKey);

        // Send transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        console.log('Transaction receipt:', receipt);
        res.json({ message: 'Claim filed successfully' });
    } catch (error) {
        console.error('Error filing a claim:', error);
        res.json({ message: error.toString() });
    }


});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});