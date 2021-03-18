const createHash = require('crypto').createHash;
const blakejs = require('blakejs')
const Buffer = require('safe-buffer').Buffer
const base58 = require('bs58')

function ripemd160(buffer) {
    return Buffer.from(createHash('rmd160').update(buffer).digest())
}

function sha256(buffer) {
    return Buffer.from(createHash('sha256').update(buffer).digest())
}

function bitcoin160(buffer) {
    return ripemd160(sha256(buffer))
}

function dsha256(buffer) {
    return sha256(sha256(buffer))
}

function blake2b256(buffer) {
    return Buffer.from(blakejs.blake2b(buffer, null, 32))
}

function blake2b512(buffer) {
    return Buffer.from(blakejs.blake2b(buffer, null, 64))
}

function hash160(buffer) {
    return ripemd160(blake2b256(buffer))
}

function dblake2b256(buffer) {
    return blake2b256(blake2b256(buffer))
}

function toAddress(buffer, version) {
    let addr = Buffer.concat([Buffer.from(version), ripemd160(sha256(buffer))]);
    let checkSum = sha256(sha256(addr)).slice(0, 4);
    return base58.encode(Buffer.concat([addr, checkSum]));
}

module.exports = {
    sha256: sha256,
    dsha256: dsha256,
    ripemd160: ripemd160,
    bitcoin160: bitcoin160,
    blake2b256: blake2b256,
    blake2b512: blake2b512,
    hash160: hash160,
    dblake2b256: dblake2b256,
    toAddress: toAddress
}
