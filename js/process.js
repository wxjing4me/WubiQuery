let InputErrorMsg = '请输入中文汉字~'
let RecommendMsg = '多个字的五笔编码仅供参考'
let DefaultImgSrc = 'images/nopic.jpg'
let DefaultHanziNotFoundMsg = ' 字暂未收录，请重新输入~'
let hanziReg = /[^\u4e00-\u9fa5]/g;
let noLetterReg = /^[a-zA-Z]/;
let letterReg = /[a-zA-Z]/g;

/* 隐藏五笔框 */
function clearWubi() {
	$('#show_hanzi').val('');
	$('#show_wubi_code').val('');
	$('#show_wubi_imgs').html('');
	$('#show_wubi_explain').html('');
	$('#show_part').hide();
	$('#show_tip').hide();
}

/* 显示五笔框 */
function showWubi(hanzi) {
	let wubi_code = getWubiCodes(hanzi);
	if (wubi_code != '') {
		$('#show_hanzi').html(hanzi);
		$('#show_wubi_code').html(wubi_code);
		getWubiImgs(hanzi);
		$('#show_part').show();
	} else {
		/* 有汉字未收录 */
	}
}

/* 显示错误提示 */
function showError(msg) {
	$('#show_tip').html(msg);
	$('#show_tip').show();
}

/* 汉字不存在的报错信息 */
function hanziNotFoundMsg(string) {
	string = string.replace(letterReg, '');
	let hanzi_str = Array.from(new Set(string.split(''))).join('、');
	return hanzi_str + DefaultHanziNotFoundMsg;
}

/* 判断汉字是否收录
 * 若有收录，则返回该字的五笔编码
 * 若无，则返回该字
 */
function getWubiCode(hanzi) {
	let wubi_data = Hanzi_Wubi[hanzi];
	if (typeof(wubi_data) == "undefined" || typeof(wubi_data.wubi_code) == "undefined") {
		console.log(hanzi + ' [Not Found]');
	    return hanzi;
	} else {
		console.log(hanzi + ' [wubi] - ' + wubi_data.wubi_code);
		return wubi_data.wubi_code;
	}
}

/*
 * 判断汉字是否有注解
 * 前提：汉字已收录
 */
function getWubiExplain(hanzi) {
	let wubi_explain = Hanzi_Wubi[hanzi].wubi_explain;
	console.log(hanzi + ' [explain] - ' + wubi_explain);
	if (typeof(wubi_explain) != "undefined") {
		showExplain(wubi_explain);
	}
}

/* 显示注解 */
function showExplain(explain) {
	let explainStr = '<span style="font-weight: bold;">注解：</span>'+ explain ;
	$('#show_wubi_explain').html(explainStr);
}

/* 
 * 获取汉字的五笔编码-Main
 * return wubi_code = '' 表示其中有汉字未收录
 */
function getWubiCodes(hanzi) {
	let wubi_code = '';
	switch(hanzi.length) {
		case 0: 
			wubi_code = '';
			break
		case 1:
			let wubi_code0 = getWubiCode(hanzi);
			if (noLetterReg.test(wubi_code0)) {
				wubi_code = wubi_code0;
				getWubiExplain(hanzi);
			} else {
				let string = wubi_code0;
				showError(hanziNotFoundMsg(string));
				wubi_code = '';
			}
			break;
		case 2: {
			let wubi_code0 = getWubiCode(hanzi[0]);
			let wubi_code1 = getWubiCode(hanzi[1]);
			if (noLetterReg.test(wubi_code0) && noLetterReg.test(wubi_code1)) {
				wubi_code = wubi_code0.substr(0, 2) + wubi_code1.substr(0, 2);
				showError(RecommendMsg);
			} else {
				let string = wubi_code0 + wubi_code1;
				showError(hanziNotFoundMsg(string));
				wubi_code = '';
			}
			break;
		}
		case 3: {
			let wubi_code0 = getWubiCode(hanzi[0]);
			let wubi_code1 = getWubiCode(hanzi[1]);
			let wubi_code2 = getWubiCode(hanzi[2]);
			if (noLetterReg.test(wubi_code0) && noLetterReg.test(wubi_code1) &&noLetterReg.test(wubi_code2)) {
				wubi_code = wubi_code0.substr(0, 1) + wubi_code1.substr(0, 1) + wubi_code2.substr(0, 2);
				showError(RecommendMsg);
			} else {
				let string = wubi_code0 + wubi_code1 + wubi_code2;
				showError(hanziNotFoundMsg(string));
				wubi_code = '';
			}
			break;
		}
		default: {
			let wubi_code0 = getWubiCode(hanzi[0]);
			let wubi_code1 = getWubiCode(hanzi[1]);
			let wubi_code2 = getWubiCode(hanzi[2]);
			let wubi_codeX = getWubiCode(hanzi[hanzi.length-1]);
			if (noLetterReg.test(wubi_code0) && noLetterReg.test(wubi_code1) && noLetterReg.test(wubi_code2) && noLetterReg.test(wubi_codeX)) {
				wubi_code = wubi_code0.substr(0, 1) + wubi_code1.substr(0, 1) + wubi_code2.substr(0, 1) + wubi_codeX.substr(0, 1);
				showError(RecommendMsg);
			} else {
				let string = wubi_code0 + wubi_code1 + wubi_code2 + wubi_codeX;
				showError(hanziNotFoundMsg(string));
				wubi_code = '';
			}
			break;
		}
	}
	return wubi_code;
}

/* 获取汉字的拆分图解 */
function getWubiImgs(hanzi) {
	hanzi = hanzi.split('');
	if (hanzi.length < 4) {
		// 0-3个字
		for (var i = 0; i < hanzi.length; i++) {
			let img = getWubiImgByUrl(hanzi[i]);
			$('#show_wubi_imgs').append(img);
		}
	} else {
		// 4个字以上
		for (var i = 0; i < 3; i++) {
			let img = getWubiImgByUrl(hanzi[i]);
			$('#show_wubi_imgs').append(img);
		}
		let img = getWubiImgByUrl(hanzi[hanzi.length-1]);
		$('#show_wubi_imgs').append(img);
	}
	/* 图片事件绑定 */
	$('img').bind('error', function(){
		 $(this).attr('src', DefaultImgSrc);
	});
}

/* 汉字的拆分图-本地路径 */
function getWubiImgBySrc(hanzi) {
	let img = "<img src='gifs/" + hanzi + ".gif'>";
	return img;
}

/* 汉字的拆分图-网址
 * 前提：汉字已收录
 */
function getWubiImgByUrl(hanzi) {
	let wubi_img_url = Hanzi_Wubi[hanzi].wubi_img_url;
	console.log(hanzi + ' [img] - ' + wubi_img_url);
	let img = "<img src='" + DefaultImgSrc + "'>";
	if (typeof(wubi_img_url) != "undefined") {
		img = "<img src='" + wubi_img_url + "'>";
	}
	return img;
}

/* 输入验证 
 * 除了汉字外的字都去掉
 */
function checkInput(str) {
	console.log('checkInput before: ' + str);
	str = str.replace(hanziReg, '');
	console.log('checkInput after : ' + str);
	return str;
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
			console.group(hanzi);
			let valid_hanzi = checkInput(hanzi);
			if (valid_hanzi != '') {
				showWubi(valid_hanzi);
			} else {
				showError(InputErrorMsg);
			}
			console.groupEnd();
	    }
	});

});

