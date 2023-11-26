const {InsuranceSDK} = require('./InsuranceSDK')

const insuranceSDK = new InsuranceSDK('0xYourContractAddress', web3);

insuranceSDK.purchasePolicyWithERC20('0x123abc', 100, 1000, '0xYourTokenAddress')
    .then(result => console.log(result))
    .catch(error => console.error(error));

insuranceSDK.checkInsuredStatus()
    .then(result => console.log(result))
    .catch(error => console.error(error));

insuranceSDK.fileClaim('0x123abc', 1638297600) 
    .then(result => console.log(result))
    .catch(error => console.error(error));

insuranceSDK.getContractBalance()
    .then(result => console.log(result))
    .catch(error => console.error(error));