onmessage = function (message) {
    let data = message.data;

    let height = Number(data.h);
    let width = Number(data.w);
    let idt = data.idt;
    let blocks = data.blc;
    let render_level = data.render_level;
    let root_position = [0, 0, 4];


    let list = [];
    let bp = "顺序：自下而上，自左至右；即第一行为最上面一行\n";
    let row = [];
    let mcfunc = "";

    for (let y = 0; y < height; y++) {
        if (y % 5 == 0) {
            let percent = y / height * 100;
            this.postMessage({
                terminate: false,
                per: percent
            });
            this.console.log('当前进度:' + percent + '%');
        }
        let col = [];
        let temp_col = [];
        for (let i = 0; i < render_level; i++) {
            temp_col[i] = [];
        }
        for (let x = 0; x < width; x++) {
            let pixel = getPixelXY(idt, x, y);
            let diff = 10000000000;
            let best = [];
            if (render_level == 1) {
                for (let i = 0; i < blocks.length; i++) {
                    let rgb = blocks[i].rgb;
                    let r1 = pixel[0],
                        g1 = pixel[1],
                        b1 = pixel[2];
                    let r2 = rgb[0],
                        g2 = rgb[1],
                        b2 = rgb[2];
                    let rmean = (r1 + r2) / 2;
                    let deltaR = r1 - r2,
                        deltaG = g1 - g2,
                        deltaB = b1 - b2;
                    let tempDiff = Math.sqrt(
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
                for (let i = 0; i < blocks.length; i++) {
                    for (let j = 0; j < blocks.length; j++) {
                        for (let a = 0; a < blocks.length; a++) {
                            for (let b = 0; b < blocks.length; b++) {
                                let avgR = (blocks[i].rgb[0] + blocks[j].rgb[0] + blocks[a].rgb[0] + blocks[b].rgb[0]) / 4;
                                let avgG = (blocks[i].rgb[1] + blocks[j].rgb[1] + blocks[a].rgb[1] + blocks[b].rgb[1]) / 4;
                                let avgB = (blocks[i].rgb[2] + blocks[j].rgb[2] + blocks[a].rgb[2] + blocks[b].rgb[2]) / 4;
                                let r1 = pixel[0],
                                    g1 = pixel[1],
                                    b1 = pixel[2];
                                let r2 = avgR,
                                    g2 = avgG,
                                    b2 = avgB;
                                let rmean = (r1 + r2) / 2;
                                let deltaR = r1 - r2,
                                    deltaG = g1 - g2,
                                    deltaB = b1 - b2;
                                let tempDiff = Math.sqrt(
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
            if (render_level == 1) {
                temp_col[0].push(best[0]);
            } else if (render_level == 2) {
                temp_col[0].push(best[0]), temp_col[0].push(best[1]);
                temp_col[1].push(best[2]), temp_col[1].push(best[3]);
            }
            for (let i = 0; i < best.length; i++) {
                list[blocks[best[i]].id] = list[blocks[best[i]].id] == null ? 1 : list[blocks[best[i]].id] + 1;
            }
        }
        row[y] = col;
        //this.console.log(temp_col);
        //this.console.log(temp_col[0])
        //蓝图

        for (let i = 0; i < temp_col.length; i++) {
            let temp_row = temp_col[i];
            let last = -1;
            let cnt = 0;
            let info = "第" + (y * render_level + i + 1) + "行\t";
            for (let j = 0; j < temp_row.length; j++) {
                let id = temp_row[j];
                //this.console.log(id);
                let yx = root_position[0] + y * render_level + i;
                let xx = root_position[0] + j;
                let zx = root_position[2];

                let cmd = "setblock " + xx + " " + zx + " " + yx + " " + blocks[id].mcn;
                mcfunc+= cmd+"\n";

                if (last == -1) {
                    last = id;
                    cnt = 1;
                } else {
                    if (last == id) {
                        cnt++;
                    } else if (last != id) { //last != id
                        info += blocks[last].name + "*" + cnt + "\t";
                        last = id;
                        cnt = 1;
                    }
                    if (j == temp_row.length - 1) {
                        info += blocks[last].name + "*" + cnt + "\t";
                    }
                }
            }
            bp += info + "\n";
        }
    }
    this.console.log(mcfunc);
    this.postMessage({
        terminate: true,
        row: row,
        bp: bp,
        list: list,
        mcfunction: mcfunc
    });
}

// 魔法®
function getPixel(imgData, index) {
    let i = index * 4,
        d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}