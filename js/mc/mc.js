    /**
    * [thresholdConvert 阈值处理]
    * @param  {[type]} ctx       [description]
    * @param  {[type]} imageData [description]
    * @param  {[type]} threshold [阈值]
    * @param  {[type]} mode      [模式：0：彩色，1：黑白]
    * @return {[type]}           [description]
    */
   function thresholdConvert(ctx, imageData, threshold, mode) {
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        var alpha = data[i + 3];
        // 灰度计算公式
        var gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        var color = gray >= threshold ? 255 : 0;
        data[i] = (mode == 0 && color == 0) ? red : color;    // red
        data[i + 1] = (mode == 0 && color == 0) ? green : color;  // green
        data[i + 2] = (mode == 0 && color == 0) ? blue : color;   // blue
        data[i + 3] = alpha >= threshold ? 255 : 0;               // 去掉透明
    }
    ctx.putImageData(imageData, 0, 0);
};
// 魔法®
function getPixel(imgData, index) {
    var i = index * 4, d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}
function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}
function Block(name, id, src, rgb) {
    this.name = name;
    this.id = id;
    this.src = src;
    this.rgb = rgb;
    // this.getName = function () { return this.name; }
    // this.getId = function () { return this.id; }
    // this.getSrc = function () { return this.src; }
    // this.getRGB = function () { return this.rgb; }
    // this.getImage = function () {
    //     return new Image().src = this.src;
    // }
}
$(document).on('click', '#close-preview', function () {
    $('.image-preview').popover('hide');
    // Hover befor close the preview
    $('.image-preview').hover(
        function () {
            $('.image-preview').popover('show');
        },
        function () {
            $('.image-preview').popover('hide');
        }
    );
});
var width;  //现在的宽度
var height; //现在的高度
var cvs;    //预览canvas
var ctx;    //cvs的content
var idt;    //content的imagedata
var img;    //原始Image
//方块字典
var blocks = new Array(
    new Block('黑色羊毛', 0, 'https://i.loli.net/2020/05/23/LfWvgJ4QB6jixDX.png', new Array(20, 21, 25)),
    new Block('蓝色羊毛', 1, 'https://i.loli.net/2020/05/23/vKYTm3zPfOLZS6M.png', new Array(53, 57, 157)),
    new Block('棕色羊毛', 2, 'https://i.loli.net/2020/05/23/Zt8b2ikBEFHlarV.png', new Array(113, 71, 40)),
    new Block('青色羊毛', 3, 'https://i.loli.net/2020/05/23/Y8qQbOtZIe5Rp2l.png', new Array(21, 136, 144)),
    new Block('灰色羊毛', 4, 'https://i.loli.net/2020/05/23/Md9TVqx3ybUgEKf.png', new Array(63, 68, 71)),
    new Block('绿色羊毛', 5, 'https://i.loli.net/2020/05/23/OYzkALha98VdgSW.png', new Array(84, 109, 27)),
    new Block('淡蓝色羊毛', 6, 'https://i.loli.net/2020/05/23/WnIYFBsGj138xai.png', new Array(58, 175, 218)),
    new Block('淡灰色羊毛', 7, 'https://i.loli.net/2020/05/23/715JZIlmOd6boNM.png', new Array(142, 143, 135)),
    new Block('黄绿色羊毛', 8, 'https://i.loli.net/2020/05/23/uGvEfnO3KBSsgHT.png', new Array(111, 184, 25)),
    new Block('洋红色羊毛', 9, 'https://i.loli.net/2020/05/23/dNPcp2SWwAUQH1R.png', new Array(190, 69, 180)),
    new Block('橙色羊毛', 10, 'https://i.loli.net/2020/05/23/L7P2aZ9hkj4Qcox.png', new Array(241, 119, 20)),
    new Block('粉色羊毛', 11, 'https://i.loli.net/2020/05/23/qDiNEI1Jhv6YBgC.png', new Array(238, 141, 171)),
    new Block('紫色羊毛', 12, 'https://i.loli.net/2020/05/23/4L5MKaTnBRFYywf.png', new Array(119, 40, 170)),
    new Block('红色羊毛', 13, 'https://i.loli.net/2020/05/23/lwVCI5R8ZPHzqxt.png', new Array(160, 39, 34)),
    new Block('白色羊毛', 14, 'https://i.loli.net/2020/05/23/4dr5iqu36aZGbsy.png', new Array(255, 255, 255)),
    new Block('黄色羊毛', 15, 'https://i.loli.net/2020/05/23/alwkYHR4z2oLWuJ.png', new Array(248, 196, 39)),
    new Block('黑色混凝土', 16, 'https://i.loli.net/2020/05/30/dkTE5j7XK12e6BW.png'),
    new Block('蓝色混凝土', 17, 'https://i.loli.net/2020/05/30/i6oCbhxFtZ5uYMG.png'),
    new Block('棕色混凝土', 18, 'https://i.loli.net/2020/05/30/bIkgBhsDm7H59Ki.png'),
    new Block('青色混凝土', 19, 'https://i.loli.net/2020/05/30/NmJgeraxcMjCsdv.png'),
    new Block('灰色混凝土', 20, 'https://i.loli.net/2020/05/30/X64QmlJUj8IxFih.png'),
    new Block('绿色混凝土', 21, 'https://i.loli.net/2020/05/30/EZj9f4wdy2thJMb.png'),
    new Block('淡蓝色混凝土', 22, 'https://i.loli.net/2020/05/30/t63FpKxHUW49fdD.png'),
    new Block('淡灰色混凝土', 23, 'https://i.loli.net/2020/05/30/8IHWJTtYa1LE6Uj.png'),
    new Block('黄绿色混凝土', 24, 'https://i.loli.net/2020/05/30/azMRBl1K7GIjrY4.png'),
    new Block('洋红色混凝土', 25, 'https://i.loli.net/2020/05/30/oui3CJFpRlG1BUc.png'),
    new Block('橙色混凝土', 26, 'https://i.loli.net/2020/05/30/fYswW4eZc9Xirmk.png'),
    new Block('粉色混凝土', 27, 'https://i.loli.net/2020/05/30/G9SMjXurCAvHYzI.png'),
    new Block('紫色混凝土', 28, 'https://i.loli.net/2020/05/30/oVlsuYIB7CardDA.png'),
    new Block('红色混凝土', 29, 'https://i.loli.net/2020/05/30/nHO1NVAk7iPRw5M.png'),
    new Block('白色混凝土', 30, 'https://i.loli.net/2020/05/30/8OXl5i9Z2C6QVYc.png'),
    new Block('黄色混凝土', 31, 'https://i.loli.net/2020/05/30/1yNip7bK65ZmL9z.png'),
    new Block('注意⚠️混凝土暂时不能使用', 32, ''),
    new Block('', 33, '')
)
var blocks2 = new Array(
    new Block('黑色羊毛', 0, 'https://i.loli.net/2020/05/23/LfWvgJ4QB6jixDX.png', new Array(20, 21, 25)),
    new Block('蓝色羊毛', 1, 'https://i.loli.net/2020/05/23/vKYTm3zPfOLZS6M.png', new Array(53, 57, 157)),
    new Block('棕色羊毛', 2, 'https://i.loli.net/2020/05/23/Zt8b2ikBEFHlarV.png', new Array(113, 71, 40)),
    new Block('青色羊毛', 3, 'https://i.loli.net/2020/05/23/Y8qQbOtZIe5Rp2l.png', new Array(21, 136, 144)),
    new Block('灰色羊毛', 4, 'https://i.loli.net/2020/05/23/Md9TVqx3ybUgEKf.png', new Array(63, 68, 71)),
    new Block('绿色羊毛', 5, 'https://i.loli.net/2020/05/23/OYzkALha98VdgSW.png', new Array(84, 109, 27)),
    new Block('淡蓝色羊毛', 6, 'https://i.loli.net/2020/05/23/WnIYFBsGj138xai.png', new Array(58, 175, 218)),
    new Block('淡灰色羊毛', 7, 'https://i.loli.net/2020/05/23/715JZIlmOd6boNM.png', new Array(142, 143, 135)),
    new Block('黄绿色羊毛', 8, 'https://i.loli.net/2020/05/23/uGvEfnO3KBSsgHT.png', new Array(111, 184, 25)),
    new Block('洋红色羊毛', 9, 'https://i.loli.net/2020/05/23/dNPcp2SWwAUQH1R.png', new Array(190, 69, 180)),
    new Block('橙色羊毛', 10, 'https://i.loli.net/2020/05/23/L7P2aZ9hkj4Qcox.png', new Array(241, 119, 20)),
    new Block('粉色羊毛', 11, 'https://i.loli.net/2020/05/23/qDiNEI1Jhv6YBgC.png', new Array(238, 141, 171)),
    new Block('紫色羊毛', 12, 'https://i.loli.net/2020/05/23/4L5MKaTnBRFYywf.png', new Array(119, 40, 170)),
    new Block('红色羊毛', 13, 'https://i.loli.net/2020/05/23/lwVCI5R8ZPHzqxt.png', new Array(160, 39, 34)),
    new Block('白色羊毛', 14, 'https://i.loli.net/2020/05/23/4dr5iqu36aZGbsy.png', new Array(255, 255, 255)),
    new Block('黄色羊毛', 15, 'https://i.loli.net/2020/05/23/alwkYHR4z2oLWuJ.png', new Array(248, 196, 39)),
    //TODO:: ADD more blocks
    new Block('黄绿色染色玻璃', 16, 'https://i.loli.net/2020/05/24/pnlw4P6ECS8YsR7.png', new Array(127, 204, 25))
)
$(function () {
    //添加所有方块
    //羊毛
    var woolTable = document.getElementById('woolTable');
    for (var i = 0; i < blocks.length; i++) {
        var item = blocks[i];
        var row = document.createElement('tr');
        var cell0 = document.createElement('td');
        cell0.innerHTML = '<input class="selector1" type="checkbox">';
        var cell1 = document.createElement('td');
        cell1.innerHTML = item.id;
        var cell2 = document.createElement('td');
        cell2.innerHTML = item.name;
        var cell3 = document.createElement('td');
        var image = new Image(); image.src = item.src;
        cell3.appendChild(image);
        row.appendChild(cell0);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        woolTable.appendChild(row);
    }
    $('#woolModalWool').prop('checked', true);
    $('#woolTable').find('tr').each(function () {
        var row = this;
        // for (var i = 0; i <= 15; i++) {
        // row = this.children[i];
        var id = Number(row.children[1].innerText);
        var checkbox = row.children[0].children[0];
        console.log(id + checkbox);
        if (id >= 0 && id <= 15)
            checkbox.checked = true;
    });
    $('#woolModalAll').change(function () {
        if ($('#woolModalAll').prop('checked')) {
            $('.selector1').prop('checked', true);
            $('.follow-selector1').prop('checked', true);
        }
        else {
            $('.selector1').removeProp('checked');
            $('.follow-selector1').prop('checked', false);
        }
    });
    $('.selector1').change(function () {
        if (!this.checked) {
            $('#woolModalAll').prop('checked', false);
        }
    });
    $('#woolModalWool').change(function () {
        if ($('#woolModalWool').prop('checked')) {
            $('#woolTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 0 && id <= 15)
                    checkbox.checked = true;
            });
        }
        else {
            $('#woolTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 0 && id <= 15)
                    checkbox.checked = false;
            });
            if ($('#woolModalAll').prop('checked')) {
                $('#woolModalAll').prop('checked', false);
            }
        }
    });
    $('#woolModalConc').change(function () {
        if ($('#woolModalConc').prop('checked')) {
            $('#woolTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 16 && id <= 31)
                    checkbox.checked = true;
            });
        }
        else {
            $('#woolTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 16 && id <= 31)
                    checkbox.checked = false;
            });
            if ($('#woolModalAll').prop('checked')) {
                $('#woolModalAll').prop('checked', false);
            }
        }
    });
    //全物品
    var alltable = document.getElementById('allTable');
    for (var i = 0; i < blocks2.length; i++) {
        var item = blocks2[i];
        var row = document.createElement('tr');
        var cell0 = document.createElement('td');
        cell0.innerHTML = '<input class="selector2" type="checkbox" value="' + item.id + '" checked>';
        var cell1 = document.createElement('td');
        cell1.innerHTML = item.id;
        var cell2 = document.createElement('td');
        cell2.innerHTML = item.name;
        var cell3 = document.createElement('td');
        var image = new Image(); image.src = item.src;
        cell3.appendChild(image);
        row.appendChild(cell0);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        allTable.appendChild(row);
    }
    var selector2 = document.getElementsByClassName('selector2');
    $('.follow-selector2').prop('checked', true);
    $('#allModalAll').change(function () {
        console.log($('#allModalAll').prop('checked'))
        if ($('#allModalAll').prop('checked')) {
            $('.selector2').prop('checked', true);
            $('.follow-selector2').prop('checked', true);
        }
        else {
            $('.selector2').removeProp('checked');
            $('.follow-selector2').prop('checked', false);
        }
    });
    $('#allModalWool').change(function () {
        if ($('#allModalWool').prop('checked')) {
            $('#allTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 0 && id <= 15)
                    checkbox.checked = true;
            });
        }
        else {
            $('#allTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 0 && id <= 15)
                    checkbox.checked = false;
            });
            if ($('#allModalAll').prop('checked')) {
                $('#allModalAll').prop('checked', false);
            }
        }
    });
    $('#allModalConc').change(function () {
        if ($('#allModalConc').prop('checked')) {
            $('#allTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 16 && id <= 31)
                    checkbox.checked = true;
            });
        }
        else {
            $('#allTable').find('tr').each(function () {
                var row = this;
                // for (var i = 0; i <= 15; i++) {
                // row = this.children[i];
                var id = Number(row.children[1].innerText);
                var checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 16 && id <= 31)
                    checkbox.checked = false;
            });
            if ($('#allModalAll').prop('checked')) {
                $('#allModalAll').prop('checked', false);
            }
        }
    });
    // Clear event
    $('.image-preview-clear').click(function () {
        $('.image-preview').attr("data-content", "").popover('hide');
        $('.image-preview-filename').val("");
        $('.image-preview-clear').hide();
        $('.image-preview-input input:file').val("");
        $(".image-preview-input-title").text("Browse");
    });
    // Create the preview image
    $(".image-preview-input input:file").change(function () {
        img = $('img#preview')[0];
        var file = this.files[0];
        var reader = new FileReader();
        // Set preview image into the popover data-content
        reader.onload = function (e) {
            $(".image-preview-input-title").text("Change");
            $(".image-preview-clear").show();
            $(".image-preview-filename").val(file.name);
            // img.attr('src', e.target.result);
            img.src = e.target.result;
            // $(".image-preview").attr("data-content", $(img)[0].outerHTML).popover("show");
        }
        reader.readAsDataURL(file);
        img.onload = function (e) {
            if (cvs != null)
                document.getElementById("DEBUG").removeChild(cvs)
            width = img.width;
            height = img.height;

            cvs = document.createElement('canvas');
            cvs.height = height;
            cvs.width = width;
            ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            idt = ctx.getImageData(0, 0, width, height);
            // var pixek = getPixel(idt, 852);
            // var pixel = getPixelXY(idt, 1, 1);
            // console.log(pixel);
            //Init paramiters
            document.getElementById('width').value = width;
            document.getElementById('height').value = height;
            $('#DEBUG').append(cvs);
            // TODO::PROCCESS IMAGE
            // doImage();
            changeThs();
        }
    });
});
function getCostomBlockInfo() {
    customBlocks1.length = 0;
    customBlocks2.length = 0;
    var wools = $('#woolTable');
    // console.log(wools.find('tr'));
    wools.find('tr').each(function () {
        var children = this.children;
        var checkedbox = children[0];
        var id = Number(children[1].innerText);
        if (checkedbox.children[0].checked) {
            customBlocks1.push(blocks[id]);
        }
    })
    var alls = $('#allTable');
    alls.find('tr').each(function () {
        var children = this.children;
        var checkedbox = children[0];
        var id = Number(children[1].innerText);
        if (checkedbox.children[0].checked) {
            customBlocks2.push(blocks2[id]);
        }
    })
}
var customBlocks1 = new Array();
var customBlocks2 = new Array();
function doImage() {
    console.log("开始处理图像");
    var img = $('img#preview')[0];
    var width = Number(document.getElementById('width').value);
    var height = Number(document.getElementById('height').value);
    var material;
    if (document.getElementById('Block').checked) {
        material = 0;
    }
    else {
        material = 1;
    }
    console.log(width);
    console.log(height);
    console.log(material);
    if (width == 0 || height == 0) {
        window.alert("不合法的宽高")
    }
    else if (material > 1 || material < 0) {
        window.alert("不合法的类型")
    }
    // cvs = document.createElement('canvas');
    // cvs.height = height;
    // cvs.width = width;
    // ctx = cvs.getContext('2d');
    // ctx.drawImage(img, 0, 0, width, height);
    // idt = ctx.getImageData(0, 0, width, height);
    // TODO::delete this
    // $('#DEBUG').append(cvs);
    // var result = document.createElement('div');
    // result.id = 'result';
    // document.getElementById('result-box').appendChild(result);
    $('#pg').attr("style", 'width: 0%');
    getCostomBlockInfo();
    var worker = new Worker("/js/mc/worker.js");
    if (material == 0) {//羊毛
        var msg = {
            h: height,
            w: width,
            blc: customBlocks1,
            idt: idt
        };
        worker.postMessage(msg);
    }
    else {//全物品
        var msg = {
            h: height,
            w: width,
            blc: customBlocks2,
            idt: idt
        };
        worker.postMessage(msg);
    }
    worker.onmessage = function (message) {
        var data = message.data;
        if (data.terminate) {
            // var row = data.row;
            // for (var x = 0; x < row.length; x++) {
            //     var col = row[x];
            //     for (var y = 0; y < col.length; y++) {
            //         var cell = new Image();
            //         if ($('#Block').prop('checked'))
            //             cell.src = blocks[col[y]].src;
            //         else
            //             cell.src = blocks2[col[y]].src;
            //         document.getElementById('result').append(cell);
            //     }
            //     document.getElementById('result').appendChild(document.createElement('br'));
            // }
            var row = data.row;
            var OFFSET = 16;//16px
            var rescvs_ = $('.result-canvas1')[0];
            var rescvs = document.createElement('canvas');
            rescvs.className = 'result-canvas1';
            rescvs.width = row.length * OFFSET;
            rescvs.height = row[0].length * OFFSET;
            var resctx = rescvs.getContext('2d');
            if ($('#Block').prop('checked')) {
                //羊毛模式
                for (var i = 0; i < row.length; i++) {
                    var col = row[i];
                    for (var j = 0; j < col.length; j++) {
                        var src = blocks[col[j]].src;
                        var image = new Image(OFFSET, OFFSET);
                        image.src = src;
                        resctx.drawImage(image, j * OFFSET, i * OFFSET);
                    }
                }
                $('#result-box-inner')[0].removeChild(rescvs_);
                $('#history-result')[0].appendChild(rescvs_);
                // 
                $('#result-box-inner')[0].appendChild(rescvs);
            }
            else {
                //普通模式
                for (var i = 0; i < row.length; i++) {
                    var col = row[i];
                    for (var j = 0; j < col.length; j++) {
                        var src = blocks2[col[j]].src;
                        var image = new Image(OFFSET, OFFSET);
                        image.src = src;
                        resctx.drawImage(image, j * OFFSET, i * OFFSET);
                    }
                }
                $('#result-box-inner')[0].removeChild(rescvs_)
                $('#history-result')[0].appendChild(rescvs_);
                // 
                $('#result-box-inner')[0].appendChild(rescvs);
            }
            //绘制蓝图及物料清单
            var bp = data.bp;
            document.getElementById('blueprint').innerHTML = bp;
            document.getElementById('list').style = "";
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i] != null) {
                    var row = document.createElement('tr');
                    var name = blocks[i].name;
                    var cnt = data.list[i];
                    var cell0 = document.createElement('td');
                    var img = new Image();
                    img.src = blocks[i].src;
                    cell0.appendChild(img);
                    var cell1 = document.createElement('td');
                    cell1.innerHTML = name;
                    var cell2 = document.createElement('td');
                    cell2.innerHTML = cnt;
                    row.appendChild(cell0);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    document.getElementById('list-inner').appendChild(row);
                }
            }
            $("#pgModal").modal("hide");
            worker.terminate();
        }
        else {
            var data = message.data;
            var per = data.per;
            $('#pg').attr("style", 'width:' + per + '%');
        }
    }
    worker.onerror = function (error) {
        console.log(error.filename, error.lineno, error.message);
    }
    // var list = new Array();
    // if (material == 0) {
    //     var bp = "顺序：自下而上，自左至右\n"
    //     for (var y = 0; y < height; y++) {
    //         // if(y%16==0) {
    //         //     var percent = y / height;
    //         //     $('#pg').attr("aria-valuenow", percent);
    //         //     $('#pg').attr("style", 'width:'+percent*100+'%');
    //         //     console.log(percent);
    //         //     $("#text").text(percent);
    //         // }
    //         var info = "第" + (height - y) + "行: ";
    //         var row = document.createElement('br');
    //         var cnt = 0;
    //         var last;
    //         for (var x = 0; x < width; x++) {
    //             var pixel = getPixelXY(idt, x, y);
    //             var cell = new Image();
    //             var diff = 10000000000;
    //             var best = 0;
    //             for (var i = 0; i < blocks.length; i++) {
    //                 var tempRGB = blocks[i].getRGB();
    //                 var tempDiff = Math.abs(tempRGB[0] - pixel[0]) + Math.abs(tempRGB[1] - pixel[1]) + Math.abs(tempRGB[2] - pixel[2]);
    //                 if (tempDiff < diff) {
    //                     diff = tempDiff;
    //                     best = i;
    //                 }
    //             }
    //             cell.src = blocks[best].getSrc();
    //             document.getElementById('result').appendChild(cell);
    //             list[best] = list[best] == null ? 0 : list[best] + 1;
    //             if (last == null) {
    //                 cnt++;
    //                 last = best;
    //             }
    //             else {
    //                 if (last == best) {
    //                     cnt++;
    //                 }
    //                 else {//best != last
    //                     info += cnt + "*" + blocks[last].getName() + " ";
    //                     cnt = 1;
    //                     last = best;
    //                 }
    //                 if (x == width - 1) {
    //                     info += cnt + "*" + blocks[last].getName() + " ";
    //                 }
    //             }
    //         }
    //         // console.log(info);
    //         bp += info + "\n";
    //         document.getElementById('result').appendChild(row);
    //     }
    //     document.getElementById('blueprint').innerHTML = bp;
    //     $('#pgModal').modal("hide");
    // }
    // else {
    // }
}
//重置所有设置
function doReset() {
    // document.getElementById('width').value = width == null ? 0 : width;
    // document.getElementById('height').value = height == null ? 0 : height;
    var origin_width = img.width;
    var origin_height = img.height
    $('#width').attr('value', origin_width).val(origin_width);
    $('#height').attr('value', origin_height).val(origin_height);
    $('#Block').attr('checked', true);
    $('#ths').attr('value', 200).val(200);
    width = origin_width;
    height = origin_height;
    ctx.drawImage(img, 0, 0, width, height);
    idt = ctx.getImageData(0, 0, width, height);
    changeThs();
}
function adjustHeight() {
    if (document.getElementById('lock_ratio').checked) {
        var tempWidth = Number(document.getElementById('width').value);
        // var ratio = Math.floor(tempWidth / width);
        // console.log("Ratio="+ratio)
        var tempHeight = Math.floor(height * tempWidth / width);
        tempWidth = Math.floor(width * tempHeight / height);
        console.log('h=' + tempHeight);
        console.log('w=' + tempWidth);
        document.getElementById('width').value = tempWidth;
        document.getElementById('height').value = tempHeight;
        height = tempHeight;
        width = tempWidth;
        changeThs();
    }
}
function adjustWidth() {
    if (document.getElementById('lock_ratio').checked) {
        var tempHeight = Number(document.getElementById('height').value);
        // var ratio = Math.floor(tempHeight / height);
        // console.log("Ratio="+ratio)
        var tempWidth = Math.floor(width * tempHeight / height);
        tempHeight = Math.floor(height * tempWidth / width);
        console.log('h=' + tempHeight);
        console.log('w=' + tempWidth);
        document.getElementById('width').value = tempWidth;
        document.getElementById('height').value = tempHeight;
        height = tempHeight;
        width = tempWidth;
        changeThs();
    }
}
function test() {
    getCostomBlockInfo();
    console.log(customBlocks1);
    console.log(customBlocks2);
}
function changeThs() {
    document.getElementById('DEBUG').removeChild(cvs);
    cvs = document.createElement('canvas');
    cvs.height = height;
    cvs.width = width;
    ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    idt = ctx.getImageData(0, 0, width, height);
    var blackwhite = $('#blackwhite').prop('checked') == true ? 1 : 0;
    var ths = Number(document.getElementById('ths').value);
    thresholdConvert(ctx, idt, ths, blackwhite);
    // console.log(ths,blackwhite)
    document.getElementById('thsv').innerHTML = ths;
    document.getElementById('DEBUG').appendChild(cvs);
}
//打开自定义窗口
function openCustom() {
    var isWool = document.getElementById('Block').checked;
    //  console.log(isWool);
    if (isWool) {
        $('#woolModal').modal('show');
    }
    else {
        $('#allModal').modal('show');
    }
}