const LifeCoverInsurance = artifacts.require("LifeCoverInsurance.sol");

module.exports = function(deployer) {
  deployer.deploy(LifeCoverInsurance, '0xf11D92588dceb0c55251281B8FE385B4F77C3F1A' , 50, 100);
};
 