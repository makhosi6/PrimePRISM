const express = require('express');
const Web3 = require('web3');
const LifeCoverInsuranceABI = require('./LifeCoverInsuranceABI.json');

const app = express();
const port = 3000;

const apiBasePath = '/api';
const web3 = new Web3('https://your-ethereum-node-url'); // Replace with your Ethereum node URL
const contractAddress = '0xYourContractAddress'; // Replace with the actual address of your deployed contract
const contract = new web3.eth.Contract(LifeCoverInsuranceABI, contractAddress);

app.use(express.json());

app.post(`${apiBasePath}/purchase-policy-erc20`, async (req, res) => {
    const { policyHolder, premiumAmount, coverageAmount, tokenAddress } = req.body;

    try {
        const response = await purchasePolicyWithERC20(policyHolder, premiumAmount, coverageAmount, tokenAddress);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to purchase policy with ERC-20 tokens' });
    }
});

app.get(`${apiBasePath}/check-insured-status`, async (req, res) => {
    try {
        const response = await checkInsuredStatus();
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to check insured status' });
    }
});

app.post(`${apiBasePath}/file-claim`, async (req, res) => {
    const { policyHolder, deathTimestamp } = req.body;

    try {
        const response = await fileClaim(policyHolder, deathTimestamp);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to file a claim' });
    }
});

app.get(`${apiBasePath}/contract-balance`, async (req, res) => {
    try {
        const response = await getContractBalance();
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve contract balance' });
    }
});

async function purchasePolicyWithERC20(policyHolder, premiumAmount, coverageAmount, tokenAddress) {
    try {
        // Encode the function call
        const data = contract.methods.purchasePolicyWithERC20(premiumAmount, coverageAmount).encodeABI();

        // Get gas price and gas limit
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = await contract.methods.purchasePolicyWithERC20(premiumAmount, coverageAmount).estimateGas();

        // Create transaction object
        const transactionObject = {
            from: policyHolder,
            to: contractAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data,
        };

        // Sign and send the transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, 'privateKey');
        const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return { transactionHash };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to purchase policy with ERC-20 tokens');
    }
}

async function checkInsuredStatus() {
    try {
        // Additional logic for checking insured status...
        return { status: true };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to check insured status');
    }
}

async function fileClaim(policyHolder, deathTimestamp) {
    try {
        // Additional logic for filing a claim...
        return { message: 'Claim filed successfully' };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to file a claim');
    }
}

async function getContractBalance() {
    try {
        // Additional logic for retrieving contract balance...
        const balance = await contract.methods.getContractBalance().call();
        return { balance };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve contract balance');
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
