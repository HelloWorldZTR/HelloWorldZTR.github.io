onmessage = function (message) {
    var data = message.data;

    var height = Number(data.h);
    var width = Number(data.w);
    var idt = data.idt;
    var blocks = data.blc;
    var render_level = data.render_level;
    var root_position = [0, 0, 4];

    var mcfunction = "";
    var list = [];
    var bp = "顺序：自下而上，自左至右；即第一行为最上面一行\n";
    var row = [];
    //this.console.log(data);

    var cmd_header = '/summon minecraft:falling_block ~ ~1 ~ {id: "minecraft:falling_block",Time: 1,DropItem: 0, Block: "minecraft:command_block", Passengers: [{'
    var cmd_part = 'id: "minecraft:falling_block",Time: 1,DropItem: 0,Block: "minecraft:command_block",Passengers: [{\n';
    var cmd_last = 'id: "minecraft:falling_block",Time: 1,DropItem: 0,Block: "minecraft:redstone_block"\n    }],\n';

    var data_part_header = 'TileEntityData: {auto: 1,Command: "';
    var data_part_end = '"}}],';
    var data_end_header  = 'TileEntityData: {auto: 1,Command: "';
    var data_end_end = '"}}]}';

    mcfunction = cmd_header;
    var mcfunction_end = data_end_end;

    var mcfunc = "";

    for (var y = 0; y < height; y++) {
        if (y % 5 == 0) {
            var percent = y / height * 100;
            this.postMessage({
                terminate: false,
                per: percent
            });
            this.console.log('当前进度:' + percent + '%');
        }
        var col = [];
        var temp_col = [];
        for (var i = 0; i < render_level; i++) {
            temp_col[i] = [];
        }
        for (var x = 0; x < width; x++) {
            var pixel = getPixelXY(idt, x, y);
            var diff = 10000000000;
            var best = [];
            //TODO 效率提升
            //TODO list 和 蓝图
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
            if (render_level == 1) {
                temp_col[0].push(best[0]);
            } else if (render_level == 2) {
                temp_col[0].push(best[0]), temp_col[0].push(best[1]);
                temp_col[1].push(best[2]), temp_col[1].push(best[3]);
            }
            for (var i = 0; i < best.length; i++) {
                list[blocks[best[i]].id] = list[blocks[best[i]].id] == null ? 1 : list[blocks[best[i]].id] + 1;
            }
        }
        row[y] = col;
        //this.console.log(temp_col);
        //this.console.log(temp_col[0])
        //蓝图

        for (var i = 0; i < temp_col.length; i++) {
            var temp_row = temp_col[i];
            var last = -1;
            var cnt = 0;
            var info = "第" + (y * render_level + i + 1) + "行\t";
            for (var j = 0; j < temp_row.length; j++) {
                var id = temp_row[j];
                //this.console.log(id);
                var yx = root_position[0] + y * render_level + i;
                var xx = root_position[0] + j;
                var zx = root_position[2];

                var cmd = "setblock " + xx + " " + zx + " " + yx + " " + blocks[id].mcn;
                mcfunc+= cmd+"\n";
                
                if(j==temp_row.length-1 && i==temp_col.length-1 && x==width-1 && y==height-1){
                    mcfunction += cmd_last;
                }
                else {
                    mcfunction += cmd_part;
                }

                if(j==0 && i==0 && y==0 && x==0) {
                    mcfunction_end = data_end_header + cmd + mcfunction_end;
                }
                else {
                    mcfunction_end = data_part_header + cmd + data_part_end + mcfunction_end;
                }

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
    mcfunction += mcfunction_end;
    this.console.log(mcfunction);
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
    var i = index * 4,
        d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}