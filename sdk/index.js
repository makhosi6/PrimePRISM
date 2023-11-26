class InsuranceSDK {
    constructor(contractAddress, web3Provider) {
        this.contract = new web3Provider.eth.Contract(LifeCoverInsuranceABI, contractAddress);
    }

    async purchasePolicyWithERC20(policyHolder, premiumAmount, coverageAmount, tokenAddress) {
        try {
            // Encode the function call
            const data = this.contract.methods.purchasePolicyWithERC20(premiumAmount, coverageAmount).encodeABI();

            // Get gas price and gas limit
            const gasPrice = await this.contract.eth.getGasPrice();
            const gasLimit = await this.contract.methods.purchasePolicyWithERC20(premiumAmount, coverageAmount).estimateGas();

            // Create transaction object
            const transactionObject = {
                from: policyHolder,
                to: this.contract.options.address,
                gas: gasLimit,
                gasPrice: gasPrice,
                data: data,
            };

            // Sign and send the transaction
            const signedTransaction = await this.contract.eth.accounts.signTransaction(transactionObject, 'privateKey'); // Replace with the private key
            const transactionHash = await this.contract.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            return { transactionHash };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to purchase policy with ERC-20 tokens');
        }
    }

    async checkInsuredStatus() {
        try {
            // Additional logic for checking insured status...
            return { status: true };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to check insured status');
        }
    }

    async fileClaim(policyHolder, deathTimestamp) {
        try {
            // Additional logic for filing a claim...
            return { message: 'Claim filed successfully' };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to file a claim');
        }
    }

   
}


