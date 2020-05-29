onmessage = function (message) {
    var data = message.data;
    var height = Number(data.h);
    var width = Number(data.w);
    var idt = data.idt;
    var blocks = data.blc;
    var list = new Array();
    var bp = "顺序：自下而上，自左至右\n"
    var row = new Array();
    this.console.log(data);
    for (var y = 0; y < height; y++) {
        if(y%10==0) {
            var percent = y/height*100;
            this.postMessage({
                terminate: false,
                per: percent
            });
        }
        var info = "第" + (height - y) + "行: ";
        var col = new Array();
        var cnt = 0;
        var last;
        for (var x = 0; x < width; x++) {
            var pixel = getPixelXY(idt, x, y);
            var diff = 10000000000;
            var best = 0;
            for (var i = 0; i < blocks.length; i++) {
                var tempRGB = blocks[i].rgb;
                var tempDiff = Math.abs(tempRGB[0] - pixel[0]) + Math.abs(tempRGB[1] - pixel[1]) + Math.abs(tempRGB[2] - pixel[2]);
                if (tempDiff < diff) {
                    diff = tempDiff;
                    best = i;
                }
            }
            list[blocks[best].id] = list[blocks[best].id] == null ? 0 : list[blocks[best].id] + 1;
            col[x] = blocks[best].id;
            if (last == null) {
                cnt++;
                last = best;
            }
            else {
                if (last == best) {
                    cnt++;
                }
                else {//best != last
                    info += cnt + "*" + blocks[last].name + " ";
                    cnt = 1;
                    last = best;
                }
                if (x == width - 1) {
                    info += cnt + "*" + blocks[last].name + " ";
                }
            }
        }
        row[y] = col;
        // console.log(info);
        bp += info + "\n";
    }
    this.postMessage({
        terminate: true,
        row: row,
        bp: bp,
        list: list
    })
}

// 魔法®
function getPixel(imgData, index) {
    var i = index * 4, d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}
function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}