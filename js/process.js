let InputErrorMsg = '请输入中文汉字~'
let RecommendMsg = '多个字的五笔编码仅供参考'
let DefaultImgSrc = 'images/nopic.jpg'

/* 隐藏五笔框 */
function clearWubi() {
	$('#show_hanzi').val('');
	$('#show_wubi_code').val('');
	$('#show_wubi_imgs').html('');
	$('#show_part').hide();
	$('#show_tip').hide();
}

/* 显示五笔框 */
function showWubi(hanzi) {
	let wubi_code = getWubi(hanzi);
	let wubi_img = 'gifs/'+hanzi+'.gif';
	$('#show_hanzi').html(hanzi);
	$('#show_wubi_code').html(wubi_code);
	getWubiImg(hanzi);
	$('#show_part').show();
}

/* 显示错误提示 */
function showError(msg) {
	$('#show_tip').html(msg);
	$('#show_tip').show();
}

/* 获取汉字的五笔编码 */
function getWubi(hanzi) {
	let wubi_code = '';
	switch(hanzi.length) {
		case 0: 
			wubi_code = '';
		case 1:
			wubi_code = Hanzi_Wubi[hanzi];
			break;
		case 2: {
			let wubi_code0 = Hanzi_Wubi[hanzi[0]];
			let wubi_code1 = Hanzi_Wubi[hanzi[1]];
			wubi_code = wubi_code0.substr(0, 2) + wubi_code1.substr(0, 2);
			showError(RecommendMsg);
			break;
		}
		case 3: {
			let wubi_code0 = Hanzi_Wubi[hanzi[0]];
			let wubi_code1 = Hanzi_Wubi[hanzi[1]];
			let wubi_code2 = Hanzi_Wubi[hanzi[2]];
			wubi_code = wubi_code0.substr(0, 1) + wubi_code1.substr(0, 1) + wubi_code2.substr(0, 2);
			showError(RecommendMsg);
			break;
		}
		default: {
			let wubi_code0 = Hanzi_Wubi[hanzi[0]];
			let wubi_code1 = Hanzi_Wubi[hanzi[1]];
			let wubi_code2 = Hanzi_Wubi[hanzi[2]];
			let wubi_codeX = Hanzi_Wubi[hanzi[hanzi.length-1]];
			wubi_code = wubi_code0.substr(0, 1) + wubi_code1.substr(0, 1) + wubi_code2.substr(0, 1) + wubi_codeX.substr(0, 1);
			showError(RecommendMsg);
			break;
		}
	}
	return wubi_code;
}

/* 获取汉字的拆分图解 */
function getWubiImg(hanzi) {
	hanzi = hanzi.split('');
	if (hanzi.length < 4) {
		// 0-3个字
		for (var i = 0; i < hanzi.length; i++) {
			let img = getWubiImgSrc(hanzi[i]);
			$('#show_wubi_imgs').append(img);
		}
	} else {
		// 4个字以上
		for (var i = 0; i < 3; i++) {
			let img = getWubiImgSrc(hanzi[i]);
			$('#show_wubi_imgs').append(img);
		}
		let img = getWubiImgSrc(hanzi[hanzi.length-1]);
		$('#show_wubi_imgs').append(img);
	}
	/* 图片事件绑定 */
	$('img').bind('error', function(){
		 $(this).attr('src', DefaultImgSrc);
	});
}

/* 汉字的拆分图-路径 */
function getWubiImgSrc(hanzi) {
	let src = "<img src='gifs/" + hanzi + ".gif'>";
	return src;
}

/* 输入验证 
 * 除了汉字外的字都去掉
 */
function checkInput(str) {
	console.log('before: ' + str);
	let reg = /[^\u4e00-\u9fa5]/g;
	str = str.replace(reg, '');
	console.log('after : ' + str);
	return str;
}

/* 测试 - 调整样式 */
function testWubi() {
	let hanzi = '搜索';
	let wubi_code = Hanzi_Wubi[hanzi];
	let wubi_img = getWubiImg(hanzi);
	$('#show_hanzi').html(hanzi);
	$('#show_wubi_code').html(wubi_code);
}

$(function(){

	clearWubi();

	$("#input_hanzi").focus();

	/* 刷新按钮 点击事件 */
	$('#refresh').click(function(){
		$('#input_hanzi').val('');
		clearWubi();
	});

	/* 文本框实时监测输入
	 * 输入为空时，重置五笔框 
	 */
	$("#input_hanzi").bind('input propertychange', function () {
		let hanzi = $('#input_hanzi').val();
		if (hanzi == '') {
			clearWubi();
		}
    });

	/* 按键触发事件 */
	$('#input_hanzi').keyup(function(e){
		e.preventDefault();
		if (e.keyCode == 13) {
			/* Enter键触发事件 */
			clearWubi();
			let hanzi = $('#input_hanzi').val();
			let valid_hanzi = checkInput(hanzi);
			if (valid_hanzi != '') {
				showWubi(valid_hanzi);
			} else {
				showError(InputErrorMsg);
			}
	    } 
	});

	/* TODO：清除快捷键（Ctrl+Enter）触发事件 */

	

});

