
function gzip(str) {//加密
    var binaryString = pako.gzip(str, { to: 'string' });
    return btoa(binaryString);
}
function ungzip(b64Data) {//解密
    var strData = atob(b64Data);
    // Convert binary string to character-number array
    var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
    // Turn number array into byte-array
    var binData = new Uint8Array(charData);
    // // unzip
    var data = pako.inflate(binData);
    // Convert gunzipped byteArray back to ascii string:
    strData = decodeUTF8(new Uint8Array(data));
    return strData;
}
function decodeUTF8(arr) {//转为utf8编码字符串
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }
    return decodeURIComponent(escape(str));
}