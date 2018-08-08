
/* 隐藏五笔框 */
function clearWubi() {
	$('#show_hanzi').val('');
	$('#show_wubi_code').val('');
	$('#show_wubi_img').attr('src', 'images/nopic.jpg');
	$('#show_part').hide();
	$('#show_tip').hide();
}

/* 显示五笔框 */
function showWubi(hanzi) {
	let wubi_code = getWubi(hanzi);
	let wubi_img = 'gifs/'+hanzi+'.gif';
	$('#show_hanzi').html(hanzi);
	$('#show_wubi_code').html(wubi_code);
	$('#show_wubi_img').attr('src', wubi_img);
	
	/* 图片不存在 */
	$('#show_wubi_img').bind('error', function() {
		$('#show_wubi_img').attr('src', 'images/nopic.jpg'); 
	}); 

	$('#show_part').show();
}

/* 显示错误提示 */
function showError(msg) {
	$('#show_tip').html(msg);
	$('#show_tip').show();
}

/* 获取汉字的五笔编码 TODO：支持词组*/
function getWubi(hanzi) {
	let wubi_code = Hanzi_Wubi[hanzi];
	return wubi_code;
}

/* 输入验证 
 * 除了汉字外的字都去掉
 * 只保留第一个汉字 TODO：支持词组
 */
function checkInput(str) {
	console.log('before: ' + str);
	let reg = /[^\u4e00-\u9fa5]/g;
	str = str.replace(reg, '').substr(0, 1);
	console.log('after : ' + str);
	return str;
}

/* 测试 - 调整样式 */
function testWubi() {
	let hanzi = '搜';
	let wubi_code = 'rvh';
	let wubi_img = 'gifs/' + hanzi + '.gif';
	$('#show_hanzi').html(hanzi);
	$('#show_wubi_code').html(wubi_code);
	$('#show_wubi_img').attr('src', wubi_img);
	$('#show_part').show();
}

$(function(){

	clearWubi();

	/* 刷新按钮 点击事件 */
	$('#refresh').click(function(){
		$('#input_hanzi').val('');
		clearWubi();
	});

	/* 文本框实时监测输入
	 * 输入为空时，隐藏五笔显示框 
	 */
	$("#input_hanzi").bind('input propertychange',function () {
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
			let hanzi = $('#input_hanzi').val();
			let valid_hanzi = checkInput(hanzi);
			if (valid_hanzi != '') {
				showWubi(valid_hanzi);
			} else {
				showError('输入不合法');
			}
	    } else if (e.keyCode == 9 ) {
	    	/* Tab键触发事件   TODO：Ctrl+Enter */
	    	console.log('Clear');
	    }
	});

});
