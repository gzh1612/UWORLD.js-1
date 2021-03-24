const UWorld = require('./src');

/**
 * 随机生成
 */
const keyPair = UWorld.ec.fromEntropy();
console.log('-----', '随机生成');
console.log('privateKey', keyPair.privateKey.toString('hex'));
console.log('publicKey', keyPair.publicKey.toString('hex'));
console.log('WIF', keyPair.toWIF());
/**
 * 根据私钥生成
 */
const privateKey = '473aa59e3e4be4c4111912de7607d201de5c84f2f6ebfce41b99155c04871252';
const keyPairByPrivateKey = UWorld.ec.fromPrivateKey(Buffer.from(privateKey, 'hex'));
console.log('-----', '根据私钥生成');
console.log('privateKey', keyPairByPrivateKey.privateKey.toString('hex'));
/**
 * 根据WIF私钥生成
 */
const privateKeyWIF = 'KycAsEvWNeDXMJLHgPAkWTzSP4zPYRC8S5RZnMbcXEAkUe4W1DVZ';
const keyPairByPrivateKeyWIF = UWorld.ec.fromWIF(privateKeyWIF);
console.log('-----', '根据WIF私钥生成');
console.log('privateKey', keyPairByPrivateKeyWIF.privateKey.toString('hex'));
console.log('WIF', keyPairByPrivateKeyWIF.toWIF());
/**
 * 生成地址
 */
const address = UWorld.address.toAddress(keyPairByPrivateKey.publicKey, UWorld.networks.mainnet);
console.log('-----', '生成地址');
console.log('address', address)
/**
 * 交易签名
 */
let nonce = 6;//通过api获取 nonce值
const params = {
    type: 0,//type:0 交易
    from: address,
    network: UWorld.networks.testnet,
    privateKey: Buffer.from(privateKey, 'hex'),
    nonce: nonce + 1,
    amount: 10 * 1e8,
    to: 'UWDTx1ABvPaNiXEtbYqGzrjHo9MYFZgZpxSq',//转账地址
    note: '啊啊啊',
};
console.log('-----', '交易签名');
//发送code到api进行交易
// const code = UWorld.tx_v2.sign(params);
// console.log('code', code);
/**
 * 合约发布
 */
const paramsContract = {
    type: 1,
    network: UWorld.networks.testnet,
    privateKey: Buffer.from(privateKey, 'hex'),
    from: address,
    nonce: nonce + 1,
    note: '',
    // receiver: '发送到谁的地址上',
    receiver: address,
    // name: '币名称',
    name: '币名称',
    // shorthand: '币缩写，全大写',
    shorthand: 'AAAAA',
    amount: 10000 * 1e8,
};
//发送 contract 到api进行 contract 发布
// const contract = UWorld.tx_v2.sign(paramsContract);
// console.log('-----', '合约发布');
// console.log('contract', contract);


// const fetch = require('node-fetch');
//
// fetch('http://8.210.5.46:5000/api/v1/tx/raw', {
//     method: 'POST',
//     headers: {'content-type': 'application/json'},
//     body: JSON.stringify({raw: JSON.stringify(contract)})
// }).then(res => res.json()).then(res => {
//     console.log(res);
// })

