const crc = require('crc').crc16xmodem;
const CryptoJS = require('crypto-js');
const key = CryptoJS.enc.Hex.parse('4CBB56AA780000C365FFEF4423122C2C')
const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')

module.exports.getToken = function(pid) {
    code = dwh(dechex(parseInt(Date.now()/1000))) + dwh(dechex(100)) + dwh(dechex(pid)) + "0000"
    let acrc = dechex(crc(new Buffer(code,'hex'))).toString();
	code += acrc.substr(2,2)+acrc.substr(0,2)
    code = CryptoJS.enc.Hex.parse(code)
    code = CryptoJS.AES.encrypt(code, key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.CBC
    }).toString()
    code = code.replace(/=/g, '_').replace(/\//g, ']').replace(/\+/g, '[')
    //console.log(code);
    return code
}
module.exports.parseToken = function(token) {
	token = token.replace(/_/g,'=').replace(/]/g,'\/').replace(/\[/g,'+');
	token = CryptoJS.AES.decrypt(token, key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.CBC
    }).toString();
	//console.log(token);
	let timestamp = hexdec(token[6]+token[7]+token[4]+token[5]+token[2]+token[3]+token[0]+token[1]);
	//console.log(timestamp);
	let magic = token.substr(8,8);
	//console.log(magic);
	let pid = hexdec(token[22]+token[23]+token[20]+token[21]+token[18]+token[19]+token[16]+token[17]);
	//console.log(pid);
	let isServer = token.substr(24,2);
	let padding = token.substr(26,2);
	let tcrc = token.substr(28,4);
	//console.log(tcrc);
	if(!(magic=='64000000'||magic=='78000000'))
	{return false;}
	//console.log('passed magic');
	let acrc = dechex(crc(new Buffer(token.substring(0,28),'hex'))).toString();
	acrc = acrc.substr(2,2)+acrc.substr(0,2)
	//console.log('actual crc:'+acrc)
	if(acrc.trim() !== tcrc.trim())
	{return false;}
	if((timestamp+708)<(Date.now()/1000))
	{return false;}
	isServer = isServer==='00'?false:true;
	return {pid:pid,isServer:isServer};
};
function dwh(h) {
    h = "0000000" + h
    s = h.substr(-8);
    s = s.substr(6, 2) + s.substr(4, 2) + s.substr(2, 2) + s.substr(0, 2)
    return s
}
function dechex(number) {
	//http://locutus.io/php/math/dechex/
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1
    }
    return parseInt(number, 10).toString(16)
}
function hexdec(hexString)
{
	//http://locutus.io/php/math/hexdec/
	hexString = (hexString + '').replace(/[^a-f0-9]/gi, '')
	return parseInt(hexString, 16);
}
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
