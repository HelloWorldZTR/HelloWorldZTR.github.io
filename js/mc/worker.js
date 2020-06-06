onmessage = function (message) {
    var data = message.data;

    var height = Number(data.h);
    var width = Number(data.w);
    var idt = data.idt;
    var blocks = data.blc;
    var render_level = data.render_level;

    var list = [];
    var bp = "顺序：自下而上，自左至右\n";
    var row = [];
    this.console.log(data);
    for (var y = 0; y < height; y++) {
        if (y % 10 == 0) {
            var percent = y / height * 100;
            this.postMessage({
                terminate: false,
                per: percent
            });
            this.console.log('当前进度:' + percent + '%');
        }
        var col = [];
        for (var x = 0; x < width; x++) {
            var pixel = getPixelXY(idt, x, y);
            var diff = 10000000000;
            var best = [];
            if (render_level == 1) {
                for (var i = 0; i < blocks.length; i++) {
                    var rgb = blocks[i].rgb;
                    var r1 = pixel[0],
                        g1 = pixel[1],
                        b1 = pixel[2];
                    var r2 = rgb[0],
                        g2 = rgb[1],
                        b2 = rgb[2];
                    var rmean = (r1 + r2) / 2;
                    var deltaR = r1 - r2,
                        deltaG = g1 - g2,
                        deltaB = b1 - b2;
                    var tempDiff = Math.sqrt(
                        (2 + rmean / 256) * (deltaR * deltaR) +
                        4 * (deltaG * deltaG) +
                        (2 + (255 - rmean) / 256) * (deltaB * deltaB)
                    );
                    if (tempDiff < diff) {
                        best = [i];
                        diff = tempDiff;
                    }
                }
            } else if (render_level == 2) {
                for (var i = 0; i < blocks.length; i++) {
                    for (var j = 0; j < blocks.length; j++) {
                        for (var a = 0; a < blocks.length; a++) {
                            for (var b = 0; b < blocks.length; b++) {
                                var avgR = (blocks[i].rgb[0] + blocks[j].rgb[0] + blocks[a].rgb[0] + blocks[b].rgb[0]) / 4;
                                var avgG = (blocks[i].rgb[1] + blocks[j].rgb[1] + blocks[a].rgb[1] + blocks[b].rgb[1]) / 4;
                                var avgB = (blocks[i].rgb[2] + blocks[j].rgb[2] + blocks[a].rgb[2] + blocks[b].rgb[2]) / 4;
                                var r1 = pixel[0],
                                    g1 = pixel[1],
                                    b1 = pixel[2];
                                var r2 = avgR,
                                    g2 = avgG,
                                    b2 = avgB;
                                var rmean = (r1 + r2) / 2;
                                var deltaR = r1 - r2,
                                    deltaG = g1 - g2,
                                    deltaB = b1 - b2;
                                var tempDiff = Math.sqrt(
                                    (2 + rmean / 256) * (deltaR * deltaR) +
                                    4 * (deltaG * deltaG) +
                                    (2 + (255 - rmean) / 256) * (deltaB * deltaB)
                                );
                                if (tempDiff < diff) {
                                    best = [i, j, a, b];
                                    diff = tempDiff;
                                }
                            }
                        }
                    }
                }
            }
            col[x] = best;
            // if (last == null) {
            //     cnt++;
            //     last = best;
            // } else {
            //     if (last == best) {
            //         cnt++;
            //     } else { //best != last
            //         info += cnt + "*" + blocks[last].name + " ";
            //         cnt = 1;
            //         last = best;
            //     }
            //     if (x == width - 1) {
            //         info += cnt + "*" + blocks[last].name + " ";
            //     }
            // }
        }
        row[y] = col;
    }
    this.postMessage({
        terminate: true,
        row: row,
        bp: bp,
        list: list
    });
}

// 魔法®
function getPixel(imgData, index) {
    var i = index * 4,
        d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}