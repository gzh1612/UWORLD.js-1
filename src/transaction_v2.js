const hash = require('./hash');
const ec = require('./ec');
const address = require('./address');
const signature = require('./signature');
const transaction = require('./transaction');

const Buffer = require('safe-buffer').Buffer;


// JS字符串转Byte[]
const stringToBytes = (str) => {
    let ch, st, re = [];
    for (let i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);  // get char
        st = [];                 // set up "stack"
        do {
            st.push(ch & 0xFF);  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }
        while (ch);
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat(st.reverse());
    }
    // return an array of bytes
    return re;
};

//获取当前时间戳
const getTimeStamp = () => {
    let time = new Date().getTime().toString();
    time = time.substring(0, time.length - 3);
    return parseInt(time)
};


//交易 json
const toJson = (params) => {
    if (!params) params = {};
    let json = {
        txhead: {
            txhash: params.txhash === undefined ? '0x0000000000000000000000000000000000000000000000000000000000000000' : params.txhash,
            txtype: params.type === undefined ? 0 : params.type,//0:转账交易 , 1:token发布
            from: params.from,//我的地址
            nonce: params.nonce,
            fees: 200000,//手续费
            // time: 1616486781,
            time: getTimeStamp(),
            note: params.note === undefined ? '' : params.note,
            signscript: {
                signature: params.signature === undefined ? '' : params.signature,
                pubkey: params.pubkey === undefined ? '' : params.pubkey,
            },
        },
    };
    if (params.type === 0) {
        json.txbody = {
            contract: params.contract === undefined ? 'UWD' : params.contract,
            to: params.to,
            amount: params.amount,
        };
    } else if (params.type === 1) {
        //生成 token 地址
        const contractAddr = address.toTokenAddress(params.from, params.shorthand, params.network);
        json.txhead.fees = 1024000000;
        json.txbody = {
            contract: contractAddr,             //生成的token地址
            to: params.receiver,                //接收钱的地址
            name: params.name,                  //token名称
            abbr: params.shorthand,             //token缩写
            description: '',
            increase: false,                    //是否支持增发
            amount: params.amount,              //金额
        };
    }
    return json
};

//交易签名
const sign = (params) => {
    const keyPair = ec.fromPrivateKey(params.privateKey);
    let result = JSON.parse(JSON.stringify(params));
    //生成hash
    let txhash = hash.sha256(Buffer.from(encodeUtf8(JSON.stringify(toJson(result)))));
    txhash = `0x${Buffer.from(txhash).toString('hex')}`;
    console.log('txhash', txhash);
    //去掉 0x 后转 buffer
    const bufferHash = Buffer.from(txhash.substring(2), 'hex');
    //签名
    let sign = keyPair.sign(bufferHash);
    sign = signature.encode(sign, transaction.SIGHASH_ALL);
    sign = Buffer.from(sign).toString('hex');
    //赋值
    result.txhash = `${txhash}`;
    result.signature = sign;
    result.pubkey = Buffer.from(keyPair.publicKey).toString('hex');
    return toJson(result);
};

//编码
function encodeUtf8(text) {
    const code = encodeURIComponent(text);
    const bytes = [];
    for (let i = 0; i < code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
            const hex = code.charAt(i + 1) + code.charAt(i + 2);
            const hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    return bytes;
}

module.exports = {
    sign,
    toJson,
    getTimeStamp,
};
