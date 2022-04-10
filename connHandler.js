const NET = require('net');

class ConnectionHandler {

    static get StatusCode()
    {
        return "30";
    }

    static get OpenCode()
    {
        return "31";
    }

    static get PrefixASCII() {
        return ConnectionHandler.HEXtoASCII("02");
    }

    static get SuffixASCII() {
        return ConnectionHandler.HEXtoASCII("03");
    }

    static Open(ip, port, address, callback)
    {
        try
        {
            let boardAddress = parseInt(address) - 1;
            let lockAddress = 53 + parseInt(address);
            ConnectionHandler.write(ip, port, boardAddress, lockAddress, ConnectionHandler.OpenCode, ()=>callback(true), true);
            
        }
        catch(err)
        {
            callback(false);
        }
    }

    static Status(ip, port, address, callback)
    {
        try
        {
            // let boardAddress = parseInt(address) - 1;
            let lockAddress = 53;
            ConnectionHandler.write(ip, port, 0, lockAddress, ConnectionHandler.StatusCode, (d)=>{
                callback(d);
            });
        }
        catch(err)
        {
            callback(false);
        }
    }

    static write(host, port, boardAddress, address, data, callback, ignoreResponse) {
        let client = new NET.Socket();
        client.connect(port, host, () => {
                client.on('data', (data) => {
                    if(!data) callback(false);
                    let resArr = [];
                    let firstBit = data[3].toString(2).padStart(8, '0');
                    let secondBit = data[4].toString(2).padStart(8, '0');
                    for(let i = 7;i >= 0; i--) resArr.push(firstBit[i] == "1" ? 0 : 1);
                    for(let i = 7;i >= 0; i--) resArr.push(secondBit[i] == "1" ? 0 : 1);
                    callback(resArr);
                    client.destroy();
                });
            let rawData = ConnectionHandler.PrefixASCII +
                          ConnectionHandler.DecimalToASCII(boardAddress) + 
                          ConnectionHandler.HEXtoASCII(data) + 
                          ConnectionHandler.SuffixASCII + 
                          ConnectionHandler.DecimalToASCII(address);
            client.write(rawData + "\n");
            if (ignoreResponse) {
                setTimeout(()=>{
                    client.destroy();
                    callback(true)
                }, 1000);
            }
        });
    }
    
    static DecimalToASCII(data)
    {
        return ConnectionHandler.HEXtoASCII(parseInt(data, 10).toString(16));
    }

    static HEXtoASCII(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    static ASCIItoHEX(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n++) {
            var hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }
        return arr1.join('');
    }
}

module.exports = ConnectionHandler;