# Life Cover Insurance Smart Contract (PrimePRISM)

PrimePrism is a cutting-edge insurance platform built on blockchain technology, specifically Celo. It ensures transparent and secure insurance solutions by integrating advanced verification processes, geolocation features, and smart contracts. This platform empowers both individuals and insurance providers, offering clarity, reliability, and an unyielding commitment to preventing fraud in the insurance industry.

## Smart Contract: LifeCoverInsurance.sol

The main smart contract, `LifeCoverInsurance.sol`, is responsible for managing life insurance policies. It includes features such as purchasing policies, checking insured status, filing claims, and handling policy expiration.

## Oracle Integration for Death Verification

To enhance the reliability of the life insurance system, this project integrates with an Oracle deployed on the blockchain. The Oracle serves the purpose of verifying death data using a feed from the Home Affairs to obtain the latest information about deceased individuals.

### Oracle Contract

The Oracle contract interacts with external data sources, in this case, the Home Affairs feed, to fetch the most up-to-date data on deceased people. This information is crucial for accurately determining the status of insured individuals.

The integration ensures that the life insurance system receives timely and verified data, providing a robust mechanism for confirming the demise of policyholders.

## API

The API provides endpoints for interacting with the life insurance smart contract. Below are examples of how to consume the API:

## Purchase Policy with ERC-20 account/address

- ### Endpoint 1: `POST /api/purchase-policy`

  **Request:**

  ```json
  {
    "policyHolder": "0x123abc",
    "premiumAmount": 50,
    "coverageAmount": 100,
    "tokenAddress": "0xYourTokenAddress" // payments processed via automated withdrawals or sweep transactions
  }
  ```

**Response**

  ```json
  {
  "transactionHash": "0xTransactionHash"
  }
````

- Endpoint 2: `POST /api/file-claim`

  **Request:**

  ```json
  {
    "policyHolder": "0x123abc",
    "endDate": 1638297600
  }
  ```

  **Response**

  ```json
  {
    "message": "Claim filed successfully"
  }
  ```

## SDK: JavaScript Library

The SDK provides a JavaScript library for simplified interaction with the life insurance smart contract. Below are examples of how to use the SDK in your application:

- **Purchase Policy with ERC-20 Tokens**

  ```js
  const InsuranceSDK = require("./InsuranceSDK");

  const insuranceSDK = new InsuranceSDK("0xYourContractAddress", web3);

  insuranceSDK
    .purchasePolicyWithERC20("0x123abc", 50, 100, "0xYourTokenAddress")
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  ```

- **File Claim**

```js
const InsuranceSDK = require("./InsuranceSDK");

const insuranceSDK = new InsuranceSDK("0xYourContractAddress", web3);

insuranceSDK
  .fileClaim("0x123abc", 1638297600)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

### Deployment

network_name : "https://alfajores-forno.celo-testnet.org"

```bash

2_lifecover_insurance.js
========================

  Deploying 'LifeCoverInsurance'
  ------------------------------
  > transaction hash:    0x12f62e04d7d77e6daf47f81498f60e6f69a98b2b7405589d633b1371434c1477
  > Blocks: 1            Seconds: 4
  > contract address:    0x24552BAd4A0382f099AcE8fE30D6A0a2f47F6FB6
  > block number:        21121796
  > block timestamp:     1700995031
  > account:             0xf11D92588dceb0c55251281B8FE385B4F77C3F1A
  > balance:             28.48386801
  > gas used:            1345096 (0x148648)
  > gas price:           10 gwei
  > value sent:          0 ETH
  > total cost:          0.01345096 ETH

  > Saving migration to chain.
  > Saving artifacts
  -------------------------------------
  > Total cost:          0.01345096 ETH

```
