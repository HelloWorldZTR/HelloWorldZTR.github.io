let width; //现在的宽度
let height; //现在的高度
let final_width;
let final_height;
let cvs; //预览canvas
let ctx; //cvs的content
let idt; //content的imagedata
let img; //原始Image
let filename;
/**
 * 方块
 * @param {String} mcn 旧版命名
 * @param {String} new_mcn 新版命名
 * @param {String} name 可读的命名
 * @param {Number} id 字典中的index
 * @param {String} src 图片地址
 * @param {Array} rgb rgb值
 */
function Block(mcn, new_mcn, name, id, src, rgb) {
    this.mcn = mcn, this.new_mcn = new_mcn, this.name = name, this.id = id, this.src = src, this.rgb = rgb;
}
//方块字典
const blocks = new Array(
        new Block('wool 15', 'black_wool', '黑色羊毛', 0, 'https://i.loli.net/2020/05/23/LfWvgJ4QB6jixDX.png', new Array(20, 21, 25)),
        new Block('wool 11', 'blue_wool', '蓝色羊毛', 1, 'https://i.loli.net/2020/05/23/vKYTm3zPfOLZS6M.png', new Array(53, 57, 157)),
        new Block('wool 12', 'brown_wool', '棕色羊毛', 2, 'https://i.loli.net/2020/05/23/Zt8b2ikBEFHlarV.png', new Array(113, 71, 40)),
        new Block('wool 9', 'cyan_wool', '青色羊毛', 3, 'https://i.loli.net/2020/05/23/Y8qQbOtZIe5Rp2l.png', new Array(21, 136, 144)),
        new Block('wool 7', 'gray_wool', '灰色羊毛', 4, 'https://i.loli.net/2020/05/23/Md9TVqx3ybUgEKf.png', new Array(63, 68, 71)),
        new Block('wool 13', 'green_wool', '绿色羊毛', 5, 'https://i.loli.net/2020/05/23/OYzkALha98VdgSW.png', new Array(84, 109, 27)),
        new Block('wool 3', 'light_blue_wool', '淡蓝色羊毛', 6, 'https://i.loli.net/2020/05/23/WnIYFBsGj138xai.png', new Array(58, 175, 218)),
        new Block('wool 8', 'light_gray_wool', '淡灰色羊毛', 7, 'https://i.loli.net/2020/05/23/715JZIlmOd6boNM.png', new Array(142, 143, 135)),
        new Block('wool 5', 'lime_wool', '黄绿色羊毛', 8, 'https://i.loli.net/2020/05/23/uGvEfnO3KBSsgHT.png', new Array(111, 184, 25)),
        new Block('wool 2', 'magenta_wool', '洋红色羊毛', 9, 'https://i.loli.net/2020/05/23/dNPcp2SWwAUQH1R.png', new Array(190, 69, 180)),
        new Block('wool 1', 'orange_wool', '橙色羊毛', 10, 'https://i.loli.net/2020/05/23/L7P2aZ9hkj4Qcox.png', new Array(241, 119, 20)),
        new Block('wool 6', 'pink_wool', '粉色羊毛', 11, 'https://i.loli.net/2020/05/23/qDiNEI1Jhv6YBgC.png', new Array(238, 141, 171)),
        new Block('wool 10', 'purple_wool', '紫色羊毛', 12, 'https://i.loli.net/2020/05/23/4L5MKaTnBRFYywf.png', new Array(119, 40, 170)),
        new Block('wool 14', 'red_wool', '红色羊毛', 13, 'https://i.loli.net/2020/05/23/lwVCI5R8ZPHzqxt.png', new Array(160, 39, 34)),
        new Block('wool 0', 'white_wool', '白色羊毛', 14, 'https://i.loli.net/2020/05/23/4dr5iqu36aZGbsy.png', new Array(255, 255, 255)),
        new Block('wool 4', 'yellow_wool', '黄色羊毛', 15, 'https://i.loli.net/2020/05/23/alwkYHR4z2oLWuJ.png', new Array(248, 196, 39)),

        new Block('wool 15', 'black_concrete', '黑色混凝土', 16, 'https://i.loli.net/2020/05/30/dkTE5j7XK12e6BW.png', new Array(8, 10, 15)),
        new Block('wool 11', 'blue_concrete', '蓝色混凝土', 17, 'https://i.loli.net/2020/05/30/i6oCbhxFtZ5uYMG.png', new Array(44, 46, 143)),
        new Block('wool 12', 'brown_concrete', '棕色混凝土', 18, 'https://i.loli.net/2020/05/30/bIkgBhsDm7H59Ki.png', new Array(96, 59, 31)),
        new Block('wool 9', 'cyan_concrete', '青色混凝土', 19, 'https://i.loli.net/2020/05/30/NmJgeraxcMjCsdv.png', new Array(21, 119, 136)),
        new Block('wool 7', 'gray_concrete', '灰色混凝土', 20, 'https://i.loli.net/2020/05/30/X64QmlJUj8IxFih.png', new Array(54, 57, 61)),
        new Block('wool 13', 'green_concrete', '绿色混凝土', 21, 'https://i.loli.net/2020/05/30/EZj9f4wdy2thJMb.png', new Array(73, 91, 36)),
        new Block('wool 3', 'light_blue_concrete', '淡蓝色混凝土', 22, 'https://i.loli.net/2020/05/30/t63FpKxHUW49fdD.png', new Array(35, 137, 198)),
        new Block('wool 8', 'light_gray_concrete', '淡灰色混凝土', 23, 'https://i.loli.net/2020/05/30/8IHWJTtYa1LE6Uj.png', new Array(125, 125, 115)),
        new Block('wool 5', 'lime_concrete', '黄绿色混凝土', 24, 'https://i.loli.net/2020/05/30/azMRBl1K7GIjrY4.png', new Array(94, 168, 24)),
        new Block('wool 2', 'magenta_concrete', '洋红色混凝土', 25, 'https://i.loli.net/2020/05/30/oui3CJFpRlG1BUc.png', new Array(169, 48, 159)),
        new Block('wool 1', 'orange_concrete', '橙色混凝土', 26, 'https://i.loli.net/2020/05/30/fYswW4eZc9Xirmk.png', new Array(224, 97, 0)),
        new Block('wool 6', 'pink_concrete', '粉色混凝土', 27, 'https://i.loli.net/2020/05/30/G9SMjXurCAvHYzI.png', new Array(213, 101, 142)),
        new Block('wool 10', 'purple_concrete', '紫色混凝土', 28, 'https://i.loli.net/2020/05/30/oVlsuYIB7CardDA.png', new Array(100, 31, 156)),
        new Block('wool 14', 'red_concrete', '红色混凝土', 29, 'https://i.loli.net/2020/05/30/nHO1NVAk7iPRw5M.png', new Array(142, 32, 32)),
        new Block('wool 0', 'white_concrete', '白色混凝土', 30, 'https://i.loli.net/2020/05/30/8OXl5i9Z2C6QVYc.png', new Array(207, 213, 214)),
        new Block('wool 4', 'yellow_concrete', '黄色混凝土', 31, 'https://i.loli.net/2020/05/30/1yNip7bK65ZmL9z.png', new Array(240, 175, 21))
    ),
    blocks2 = new Array(
        new Block('wool 15', 'black_wool', '黑色羊毛', 0, 'https://i.loli.net/2020/05/23/LfWvgJ4QB6jixDX.png', new Array(20, 21, 25)),
        new Block('wool 11', 'blue_wool', '蓝色羊毛', 1, 'https://i.loli.net/2020/05/23/vKYTm3zPfOLZS6M.png', new Array(53, 57, 157)),
        new Block('wool 12', 'brown_wool', '棕色羊毛', 2, 'https://i.loli.net/2020/05/23/Zt8b2ikBEFHlarV.png', new Array(113, 71, 40)),
        new Block('wool 9', 'cyan_wool', '青色羊毛', 3, 'https://i.loli.net/2020/05/23/Y8qQbOtZIe5Rp2l.png', new Array(21, 136, 144)),
        new Block('wool 7', 'gray_wool', '灰色羊毛', 4, 'https://i.loli.net/2020/05/23/Md9TVqx3ybUgEKf.png', new Array(63, 68, 71)),
        new Block('wool 13', 'green_wool', '绿色羊毛', 5, 'https://i.loli.net/2020/05/23/OYzkALha98VdgSW.png', new Array(84, 109, 27)),
        new Block('wool 3', 'light_blue_wool', '淡蓝色羊毛', 6, 'https://i.loli.net/2020/05/23/WnIYFBsGj138xai.png', new Array(58, 175, 218)),
        new Block('wool 8', 'light_gray_wool', '淡灰色羊毛', 7, 'https://i.loli.net/2020/05/23/715JZIlmOd6boNM.png', new Array(142, 143, 135)),
        new Block('wool 5', 'lime_wool', '黄绿色羊毛', 8, 'https://i.loli.net/2020/05/23/uGvEfnO3KBSsgHT.png', new Array(111, 184, 25)),
        new Block('wool 2', 'magenta_wool', '洋红色羊毛', 9, 'https://i.loli.net/2020/05/23/dNPcp2SWwAUQH1R.png', new Array(190, 69, 180)),
        new Block('wool 1', 'orange_wool', '橙色羊毛', 10, 'https://i.loli.net/2020/05/23/L7P2aZ9hkj4Qcox.png', new Array(241, 119, 20)),
        new Block('wool 6', 'pink_wool', '粉色羊毛', 11, 'https://i.loli.net/2020/05/23/qDiNEI1Jhv6YBgC.png', new Array(238, 141, 171)),
        new Block('wool 10', 'purple_wool', '紫色羊毛', 12, 'https://i.loli.net/2020/05/23/4L5MKaTnBRFYywf.png', new Array(119, 40, 170)),
        new Block('wool 14', 'red_wool', '红色羊毛', 13, 'https://i.loli.net/2020/05/23/lwVCI5R8ZPHzqxt.png', new Array(160, 39, 34)),
        new Block('wool 0', 'white_wool', '白色羊毛', 14, 'https://i.loli.net/2020/05/23/4dr5iqu36aZGbsy.png', new Array(255, 255, 255)),
        new Block('wool 4', 'yellow_wool', '黄色羊毛', 15, 'https://i.loli.net/2020/05/23/alwkYHR4z2oLWuJ.png', new Array(248, 196, 39)),

        new Block('wool 15', 'black_concrete', '黑色混凝土', 16, 'https://i.loli.net/2020/05/30/dkTE5j7XK12e6BW.png', new Array(8, 10, 15)),
        new Block('wool 11', 'blue_concrete', '蓝色混凝土', 17, 'https://i.loli.net/2020/05/30/i6oCbhxFtZ5uYMG.png', new Array(44, 46, 143)),
        new Block('wool 12', 'brown_concrete', '棕色混凝土', 18, 'https://i.loli.net/2020/05/30/bIkgBhsDm7H59Ki.png', new Array(96, 59, 31)),
        new Block('wool 9', 'cyan_concrete', '青色混凝土', 19, 'https://i.loli.net/2020/05/30/NmJgeraxcMjCsdv.png', new Array(21, 119, 136)),
        new Block('wool 7', 'gray_concrete', '灰色混凝土', 20, 'https://i.loli.net/2020/05/30/X64QmlJUj8IxFih.png', new Array(54, 57, 61)),
        new Block('wool 13', 'green_concrete', '绿色混凝土', 21, 'https://i.loli.net/2020/05/30/EZj9f4wdy2thJMb.png', new Array(73, 91, 36)),
        new Block('wool 3', 'light_blue_concrete', '淡蓝色混凝土', 22, 'https://i.loli.net/2020/05/30/t63FpKxHUW49fdD.png', new Array(35, 137, 198)),
        new Block('wool 8', 'light_gray_concrete', '淡灰色混凝土', 23, 'https://i.loli.net/2020/05/30/8IHWJTtYa1LE6Uj.png', new Array(125, 125, 115)),
        new Block('wool 5', 'lime_concrete', '黄绿色混凝土', 24, 'https://i.loli.net/2020/05/30/azMRBl1K7GIjrY4.png', new Array(94, 168, 24)),
        new Block('wool 2', 'magenta_concrete', '洋红色混凝土', 25, 'https://i.loli.net/2020/05/30/oui3CJFpRlG1BUc.png', new Array(169, 48, 159)),
        new Block('wool 1', 'orange_concrete', '橙色混凝土', 26, 'https://i.loli.net/2020/05/30/fYswW4eZc9Xirmk.png', new Array(224, 97, 0)),
        new Block('wool 6', 'pink_concrete', '粉色混凝土', 27, 'https://i.loli.net/2020/05/30/G9SMjXurCAvHYzI.png', new Array(213, 101, 142)),
        new Block('wool 10', 'purple_concrete', '紫色混凝土', 28, 'https://i.loli.net/2020/05/30/oVlsuYIB7CardDA.png', new Array(100, 31, 156)),
        new Block('wool 14', 'red_concrete', '红色混凝土', 29, 'https://i.loli.net/2020/05/30/nHO1NVAk7iPRw5M.png', new Array(142, 32, 32)),
        new Block('wool 0', 'white_concrete', '白色混凝土', 30, 'https://i.loli.net/2020/05/30/8OXl5i9Z2C6QVYc.png', new Array(207, 213, 214)),
        new Block('wool 4', 'yellow_concrete', '黄色混凝土', 31, 'https://i.loli.net/2020/05/30/1yNip7bK65ZmL9z.png', new Array(240, 175, 21))
    )
/**
 * 阈值转换
 * @param {*} ctx 
 * @param {*} imageData 
 * @param {*} threshold 阈值
 * @param {*} mode 1:黑白
 */
function thresholdConvert(ctx, imageData, threshold, mode) {
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        let alpha = data[i + 3];
        // 灰度计算公式
        let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        let color = gray >= threshold ? 255 : 0;
        data[i] = (mode == 0 && color == 0) ? red : color; // red
        data[i + 1] = (mode == 0 && color == 0) ? green : color; // green
        data[i + 2] = (mode == 0 && color == 0) ? blue : color; // blue
        data[i + 3] = alpha >= threshold ? 255 : 0; // 去掉透明
    }
    ctx.putImageData(imageData, 0, 0);
};
/**
 * 取得像素值
 * @param {*} imgData 
 * @param {*} index 
 */
function getPixel(imgData, index) {
    let i = index * 4,
        d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}
/**
 * 取得像素值   
 * @param {*} imgData 
 * @param {*} x 像素坐标
 * @param {*} y 像素坐标
 */
function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
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

$(function () {
    //添加所有方块
    //羊毛
    let woolTable = document.getElementById('woolTable');
    for (let i = 0; i < blocks.length; i++) {
        let item = blocks[i];
        let row = document.createElement('tr');

        let cell0 = document.createElement('td');
        let cell1 = document.createElement('td');
        let cell2 = document.createElement('td');
        let cell3 = document.createElement('td');
        let image = new Image();
        let mcn = document.createElement('td');
        let new_mcn = document.createElement('td');
        cell0.innerHTML = '<input class="selector1" type="checkbox">';
        cell1.innerHTML = item.id;
        cell2.innerHTML = item.name;
        cell3.appendChild(image);
        image.src = item.src;
        mcn.innerHTML = item.mcn;
        new_mcn.innerHTML = item.new_mcn;

        row.appendChild(cell0);
        row.appendChild(cell1);
        row.appendChild(mcn);
        row.appendChild(new_mcn);
        row.appendChild(cell2);
        row.appendChild(cell3);
        woolTable.appendChild(row);
    }
    $('#woolModalWool').prop('checked', true);
    $('#woolTable').find('tr').each(function () {
        let row = this;
        let id = Number(row.children[1].innerText);
        let checkbox = row.children[0].children[0];
        if (id >= 0 && id <= 15)
            checkbox.checked = true;
    });
    $('#woolModalAll').change(function () {
        if ($('#woolModalAll').prop('checked')) {
            $('.selector1').prop('checked', true);
            $('.follow-selector1').prop('checked', true);
        } else {
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
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
                if (id >= 0 && id <= 15)
                    checkbox.checked = true;
            });
        } else {
            $('#woolTable').find('tr').each(function () {
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
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
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
                console.log(id + checkbox);
                if (id >= 16 && id <= 31)
                    checkbox.checked = true;
            });
        } else {
            $('#woolTable').find('tr').each(function () {
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
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
    let alltable = document.getElementById('allTable');
    for (let i = 0; i < blocks2.length; i++) {
        let item = blocks2[i];
        let row = document.createElement('tr');
        let cell0 = document.createElement('td');
        let cell1 = document.createElement('td');
        let cell2 = document.createElement('td');
        let cell3 = document.createElement('td');
        let image = new Image();
        let mcn = document.createElement('td');
        let new_mcn = document.createElement('td');
        cell0.innerHTML = '<input class="selector2" type="checkbox" value="' + item.id + '" checked>';
        cell1.innerHTML = item.id;
        cell2.innerHTML = item.name;
        cell3.appendChild(image);
        image.src = item.src;
        mcn.innerHTML = item.mcn;
        new_mcn.innerHTML = item.new_mcn;

        row.appendChild(cell0);
        row.appendChild(cell1);
        row.appendChild(mcn);
        row.appendChild(new_mcn);
        row.appendChild(cell2);
        row.appendChild(cell3);
        allTable.appendChild(row);
    }
    let selector2 = document.getElementsByClassName('selector2');
    $('.follow-selector2').prop('checked', true);
    $('#allModalAll').change(function () {
        console.log($('#allModalAll').prop('checked'))
        if ($('#allModalAll').prop('checked')) {
            $('.selector2').prop('checked', true);
            $('.follow-selector2').prop('checked', true);
        } else {
            $('.selector2').removeProp('checked');
            $('.follow-selector2').prop('checked', false);
        }
    });
    $('#allModalWool').change(function () {
        if ($('#allModalWool').prop('checked')) {
            $('#allTable').find('tr').each(function () {
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
                if (id >= 0 && id <= 15)
                    checkbox.checked = true;
            });
        } else {
            $('#allTable').find('tr').each(function () {
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
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
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
                if (id >= 16 && id <= 31)
                    checkbox.checked = true;
            });
        } else {
            $('#allTable').find('tr').each(function () {
                let row = this;
                let id = Number(row.children[1].innerText);
                let checkbox = row.children[0].children[0];
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
        console.log('📄开始载入图像...')

        img = $('img#preview')[0];
        let file = this.files[0];
        filename = file.name;
        let reader = new FileReader();
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
            // let pixek = getPixel(idt, 852);
            // let pixel = getPixelXY(idt, 1, 1);
            // console.log(pixel);
            //Init paramiters
            document.getElementById('width').value = width;
            document.getElementById('height').value = height;
            $('#DEBUG').append(cvs);
            changeThs();
            adjustRenderLevel();

            console.log('载入图像完成✅')
        }
    });
});
/**
 * 读取自定义的信息
 */
function getCostomBlockInfo() {
    customBlocks1.length = 0;
    customBlocks2.length = 0;
    let wools = $('#woolTable');
    // console.log(wools.find('tr'));
    wools.find('tr').each(function () {
        let children = this.children;
        let checkedbox = children[0];
        let id = Number(children[1].innerText);
        if (checkedbox.children[0].checked) {
            customBlocks1.push(blocks[id]);
        }
    })
    let alls = $('#allTable');
    alls.find('tr').each(function () {
        let children = this.children;
        let checkedbox = children[0];
        let id = Number(children[1].innerText);
        if (checkedbox.children[0].checked) {
            customBlocks2.push(blocks2[id]);
        }
    })
}
let customBlocks1 = new Array();
let customBlocks2 = new Array();
/**
 * 处理图像并绘制结果
 */
function doImage() {
    console.log("📄开始处理图像...");
    let img, width, height, material, render_level, hasPreview, position, old_mcn;
    try {
        img = $('img#preview')[0];
        width = Number(document.getElementById('width').value);
        height = Number(document.getElementById('height').value);
        material = document.getElementById('wool').checked ? 0 : 1; // 0:羊毛 1:全物品
        hasPreview = true;
        position = [];
        old_mcn = $('#use-old-mcn').prop('checked');
        $('#render_level input[name="anti"]').each(function () {
            if (this.checked) {
                render_level = Number(this.value);
            }
        });
        $('.axis').each(function () {
            position.push(Number(this.value));
        });
    } catch (e) {
        console.error(e);
        window.alert('出错了');
        return;
    }
    console.log('宽度:' + width);
    console.log('高度:' + height);
    console.log('材料:' + material == 0 ? '羊毛' : '全物品');
    console.log('渲染等级:' + render_level);
    console.log('位置:' + position.toString);

    if (width == 0 || height == 0) {
        window.alert("不合法的宽高");
        return;
    } else if (material > 1 || material < 0) {
        window.alert("不合法的类型");
        return;
    } else if (width >= 300 || height >= 300) {
        window.alert("尺寸过大，将不会渲染预览");
        hasPreview = false;
    }
    $('#pg').attr("style", 'width: 0%');
    getCostomBlockInfo();
    let worker = new Worker("js/worker.js");
    if (material == 0) { //羊毛
        let msg = {
            h: height,
            w: width,
            blc: customBlocks1,
            idt: idt,
            render_level: render_level,
            position: position,
            use_old_mcn: old_mcn
        };
        worker.postMessage(msg);
    } else { //全物品
        let msg = {
            h: height,
            w: width,
            blc: customBlocks2,
            idt: idt,
            render_level: render_level,
            position: position,
            use_old_mcn: old_mcn
        };
        worker.postMessage(msg);
    }
    worker.onmessage = function (message) {
        let data = message.data;
        if (data.terminate) {
            let row = data.row;
            let OFFSET = 16; //16px
            let rescvs_ = $('.result-canvas1')[0];
            let rescvs = document.createElement('canvas');
            rescvs.className = 'result-canvas1';
            rescvs.height = row.length * OFFSET * render_level;
            rescvs.width = row[0].length * OFFSET * render_level;
            let resctx = rescvs.getContext('2d');
            if (hasPreview) { //只渲染小尺寸图像
                if ($('#wool').prop('checked')) {
                    //羊毛模式
                    for (let i = 0; i < row.length; i++) {
                        let col = row[i];
                        for (let j = 0; j < col.length; j++) {
                            let cell = col[j];
                            for (let a = 0; a < render_level; a++) {
                                for (let b = 0; b < render_level; b++) {
                                    let bl = cell[a * render_level + b];
                                    let bld = customBlocks1[bl];
                                    let src = bld.src;
                                    let image = new Image(OFFSET, OFFSET);
                                    image.src = src;
                                    resctx.drawImage(image, j * OFFSET * render_level + b * OFFSET, i * OFFSET *
                                        render_level + a * OFFSET)
                                }
                            }
                        }
                    }
                    $('#result-box-inner')[0].removeChild(rescvs_);
                    $('#history-result')[0].appendChild(rescvs_);
                    $('#result-box-inner')[0].appendChild(rescvs);
                } else {
                    //普通模式
                    for (let i = 0; i < row.length; i++) {
                        let col = row[i];
                        for (let j = 0; j < col.length; j++) {
                            let src = blocks2[col[j]].src;
                            let image = new Image(OFFSET, OFFSET);
                            image.src = src;
                            resctx.drawImage(image, j * OFFSET, i * OFFSET);
                        }
                    }
                    $('#result-box-inner')[0].removeChild(rescvs_)
                    $('#history-result')[0].appendChild(rescvs_);
                    $('#result-box-inner')[0].appendChild(rescvs);
                }
            }
            //绘制蓝图及物料清单
            let bp = data.bp;
            document.getElementById('blueprint').innerHTML = bp;
            document.getElementById('list').style = "";
            document.getElementById('list-inner').innerHTML = "";
            for (let i = 0; i < data.list.length; i++) {
                if (data.list[i] != null) {
                    let row = document.createElement('tr');

                    let name = blocks[i].name;
                    let cnt = data.list[i];
                    let cell0 = document.createElement('td');
                    let img = new Image();
                    img.src = blocks[i].src;
                    cell0.appendChild(img);
                    let cell1 = document.createElement('td');
                    cell1.innerHTML = name;
                    let cell2 = document.createElement('td');
                    cell2.innerHTML = cnt;

                    row.appendChild(cell0);
                    row.appendChild(cell1);
                    row.appendChild(cell2);

                    document.getElementById('list-inner').appendChild(row);
                }
            }
            let mcfuntion = data.mcfunction;
            download("download", filename + ".mcfunction", mcfuntion);
            download("download_bp", filename + ".txt", bp);
            $("#pgModal").modal("hide");
            worker.terminate();
            console.log('图像处理完成✅');
        } else {
            let data = message.data;
            let per = data.per;
            $('#pg').attr("style", 'width:' + per + '%');
        }
    }
    worker.onerror = function (error) {
        console.log(error.filename, error.lineno, error.message);
    }
}
/**
 * 重置所有设置
 */
function doReset() {
    let origin_width = img.width;
    let origin_height = img.height
    $('#width').attr('value', origin_width).val(origin_width);
    $('#height').attr('value', origin_height).val(origin_height);
    $('#wool').attr('checked', true);
    $('#ths').attr('value', 200).val(200);
    $('#1x').prop('checked', true);
    width = origin_width;
    height = origin_height;
    ctx.drawImage(img, 0, 0, width, height);
    idt = ctx.getImageData(0, 0, width, height);
    changeThs();
    adjustRenderLevel();
}

function adjustHeight() {
    if (document.getElementById('lock_ratio').checked) {
        let tempWidth = Number(document.getElementById('width').value);
        let tempHeight = Math.floor(height * tempWidth / width);
        tempWidth = Math.floor(width * tempHeight / height);
        console.log('h=' + tempHeight);
        console.log('w=' + tempWidth);
        document.getElementById('width').value = tempWidth;
        document.getElementById('height').value = tempHeight;
        height = tempHeight;
        width = tempWidth;
        changeThs();
        adjustRenderLevel();
    }
}

function adjustWidth() {
    if (document.getElementById('lock_ratio').checked) {
        let tempHeight = Number(document.getElementById('height').value);
        let tempWidth = Math.floor(width * tempHeight / height);
        tempHeight = Math.floor(height * tempWidth / width);
        console.log('h=' + tempHeight);
        console.log('w=' + tempWidth);
        document.getElementById('width').value = tempWidth;
        document.getElementById('height').value = tempHeight;
        height = tempHeight;
        width = tempWidth;
        changeThs();
        adjustRenderLevel();
    }
}

function adjustRenderLevel() {
    let render_level;
    $('#render_level input[name="anti"]').each(function () {
        if (this.checked) {
            render_level = Number(this.value);
        }
    });
    final_height = height * render_level;
    final_width = width * render_level;
    $('#rendv')[0].innerHTML = '最终尺寸:' + final_width + '*' + final_height;
}


function changeThs() {
    document.getElementById('DEBUG').removeChild(cvs);
    cvs = document.createElement('canvas');
    cvs.height = height;
    cvs.width = width;
    ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    idt = ctx.getImageData(0, 0, width, height);
    let blackwhite = $('#blackwhite').prop('checked') == true ? 1 : 0;
    let ths = Number(document.getElementById('ths').value);
    thresholdConvert(ctx, idt, ths, blackwhite);
    document.getElementById('thsv').innerHTML = ths;
    document.getElementById('DEBUG').appendChild(cvs);
}
//打开自定义窗口
function openCustom() {
    let isWool = document.getElementById('wool').checked;
    //  console.log(isWool);
    if (isWool) {
        $('#woolModal').modal('show');
    } else {
        $('#allModal').modal('show');
    }
}
/**
 * 添加下载链接
 * @param {String} id 元素的id 
 * @param {String} filename 文件名
 * @param {String} text 文件内容
 */
function download(id, filename, text) {
    let element = document.getElementById(id);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
}