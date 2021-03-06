const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/WalleTokenFactory.json');
const compiledWalleToken = require('../ethereum/build/WalleToken.json');

let accounts;
let factory;
let WalleTokenAddress;
let WalleToken;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createWalleToken('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [WalleTokenAddress] = await factory.methods.getDeployedWalleTokens().call();
  WalleToken = await new web3.eth.Contract(
    JSON.parse(compiledWalleToken.interface),
    WalleTokenAddress
  );
});

