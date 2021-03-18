const Buffer = require('safe-buffer').Buffer
const base58check = require('./base58check').default
const Network = require('./networks')
const Script = require('./script')
const types = require('./types')
const typecheck = require('./typecheck')
const hash = require('./hash');
const base58 = require('bs58');

module.exports = {
    fromBase58Check: fromBase58Check,
    toBase58Check: toBase58Check,
    toOutputScript: toOutputScript,
    toAddress: toAddress,
}

function fromBase58Check(address) {
    const payload = base58check.decode(address)
    if (payload.length < 22) throw new TypeError(address + ' is too short')
    if (payload.length > 22) throw new TypeError(address + ' is too long')

    const version = payload.readUInt16BE(0)
    const hash = payload.slice(2)

    return {version: version, hash: hash}
}

function toBase58Check(hash, version) {
    typecheck(types.Hash160, hash)
    const payload = Buffer.allocUnsafe(22)
    payload.writeUInt16BE(version, 0)
    hash.copy(payload, 2)
    return base58check.encode(payload)
}

function toOutputScript(address, network) {
    network = network || Network.privnet
    const decode = fromBase58Check(address)
    if (decode) {
        if (decode.version === network.pubKeyHashAddrId) return Script.Output.P2PKH(decode.hash)
        if (decode.version === network.ScriptHashAddrID) return Script.Output.P2SH(decode.hash)
        throw Error('Unknown version ' + decode.version)
    }
    throw Error('fail to base58check decode ' + address)
}

//生成地址
function toAddress(buff, version) {
    // const a = Buffer.from(version);
    // const b = hash.ripemd160(hash.sha256(buff));
    //
    // const ubc = Buffer.concat([
    //     Buffer.from(version),
    //     hash.ripemd160(hash.sha256(buff))
    // ]);
    // const checkSum = hash.sha256((hash.sha256(ubc))).slice(0, 4);
    // return base58.encode(Buffer.concat([ubc, checkSum]));


    let a;
    if (version === 'TN') a = Buffer.from([0x0f, 0x89]);
    else if (version === 'MN') a = Buffer.from([0x0f, 0x4e]);

    const b = hash.ripemd160(hash.sha256(buff));

    const buf = Buffer.concat([
        a,
        hash.ripemd160(hash.sha256(buff))
    ]);
    const checkSum = hash.sha256((hash.sha256(buf))).slice(0, 4);
    return base58.encode(Buffer.concat([buf, checkSum]))
}
