/*
 * 影评（长评/影评 弹框后的操作）
 */
(function(window,$,Core,undefined){	
	//邮箱应用入口标识
	var  core=Core;
	if(core.isInFrame){
		core.mailApp="/mailapp";
		core.mailTarget="_self";
		//if(core.cdnBaseUrl.indexOf("imgimg.126.net") > 0){//测试环境订单入口，积分入口需要加81端口
			//core.mailAppOrder=":81/mailapp";
		//}else{//在线确认，在线环境不加端口
			core.mailAppOrder="/mailapp";
		//}
	}else{//主站
		core.mailApp="";
		core.mailAppOrder="";	
		core.mailTarget="_blank";
	}
	$.extend(Core,{			
		//写影评按钮事件
		writeSCmtEvent: function(){
			var core = Core;
			if(!core.easyNav.isLogin(true)){//判断登录先 
				core.login(core.urlAddHash("tab","comment"));
				return;
			}
			if(!core.movieId) return;
			
			//打开评论弹框
			core.commentDialog(0);
		},
		//发表影评按钮事件
		sendComment_S: function(){			
			var core = Core, easyNav = core.easyNav;
			if(!core.easyNav.isLogin(true)){//判断登录先 
				core.login(core.urlAddHash("tab","comment"));
				return;
			}
			if(!core.movieId) return;
			
			//输入框校验
			var	cmtS=$(this).parent().parent(),txtArea=cmtS.find('>.comm_area'),err=cmtS.find('.err');
				msg = txtArea.val();
			if(msg=='亲，说两句吧~'){
				txtArea.focus().removeClass('textGray').val('');
				err.text('您还没输入影评内容呢！').removeClass('hide2');
				return false;
			}
			var len = msg.length;
			if(len <6 || len > 300) {
				txtArea.focus();
				err.text('影评字数不够6字哟！').removeClass('hide2');
				return false;
			}

			var strRegex = '^(http://|ftp://|https://|www){0,1}[^\u4e00-\u9fa5\\s]*?\\.(com|net|cn|me|tw|fr)[^\u4e00-\u9fa5\\s]*$';
			var re=new RegExp(strRegex);			
			if(re.test(msg)) {
				err.text('影评内容不允许包含链接!').removeClass('hide2');
				return false;
			}
			//同步到新浪微博
			if($('#sinaWeiBoCbx')[0].checked){
				var url= "http://v.t.sina.com.cn/share/share.php?url={url}&title={title}&searchPic=true";
				this.href=$.format(url,{url:encodeURIComponent(document.URL+'#from=t.sina'),title:encodeURIComponent(msg)});
			}
			err.addClass('hide2');
			var btnSub = cmtS.find('.sub')
			var param={
				req_id: core.movieId,
				req_type:"movie",
				postType:1,
				category:5,				
				text:encodeURIComponent(msg)//未encodeURIComponent "+"显示成空格
			}
			$.ajax({
				dataType: "jsonp",				
				url: "http://qz.dianying.163.com/w/req_sendPosts",
				//url: "http://127.0.0.1/mv/ajax/ajax.html",
				data: param,
				success:  function( rs ){	
					rs = typeof rs == "object" ? rs : core.parseJSON(rs);
					switch(+rs.result){//100 成功  500 失败  201 参数有误
						case 100://添加成功
							//成功提示框
							core.showDialog('<div class="commDialog_result"><a href="javascript:;" class="closeBtn closePop"></a><b></b><h3>感谢你的评论！</h3> <a class="btn closePop mt20" href="javascript:;">确认</a></div>');
													
							//新影评放在列表第一条
							var sCommentList=$("#sCommentList"),
								noShortPart = $("#noShortPart");
							sCommentList.prepend($.format('<dd {0}><div class="infor"><div class="name">{1}</div><div class="time">{2}</div></div> <div class="detail">{3}</div></dd>', sCommentList.find('li').length ? "" : " class='last'", rs.nickname || "",core.formatCreatTime(rs.date), $.safeHTML(rs.text) ));
							var c = $('#commCount_S').find('em').text();
							$('#commCount_S').find('em').text((+c)+1);//评论数加1
							
							if(noShortPart.length){
								//删除没有评论的提示信息
								noShortPart.remove();	
							}
							break;
						case 202: //发帖或者回复包含敏感词
							core.showDialog('<div class="commDialog_result commDialog_fail"><a href="javascript:;" class="closeBtn closePop"></a><b></b><p class="msg">您的评论含有不合法字符！</p> <a class="btn closePop" href="javascript:;">确认</a></div>');
							break;
						case 205: //某一用户在指定日期内超过最大评论次数
							core.showDialog('<div class="commDialog_result commDialog_fail"><a href="javascript:;" class="closeBtn closePop"></a><b></b><p class="msg">您今天发表的评论太多啦！明天再来吧！</p> <a class="btn closePop" href="javascript:;">确认</a></div>');
							break;	
						case 207: //帖子内容不允许包含链接
							core.showDialog('<div class="commDialog_result commDialog_fail"><a href="javascript:;" class="closeBtn closePop"></a><b></b><p class="msg">您的评论不能包含链接！</p> <a class="btn closePop" href="javascript:;">确认</a></div>');
							break;					
						case 421: //帐户未登录
							core.login(core.urlAddHash("tab","comment"));
							break;
						default: //其他
							core.showDialog('<div class="commDialog_result commDialog_fail"><a href="javascript:;" class="closeBtn closePop"></a><b></b><p class="msg">'+rs.resultDesc+'</p> <a class="btn closePop" href="javascript:;">确认</a></div>');
					}
				},
				error: function(rs){
					rs = typeof rs == "object" ? rs : core.parseJSON(rs);
					core.showDialog('<div class="commDialog_result commDialog_fail"><a href="javascript:;" class="closeBtn closePop"></a><b></b><p class="msg">'+(!!rs && !!rs.resultDesc ? rs.resultDesc :"您的网络链接有问题，请稍后重试")+'</p> <a class="btn closePop" href="javascript:;">确认</a></div>');
				}
			});	
		},		
		/* 
		 * 长评/影评弹框接口
		 * movieId 电影id
		 * type:0 影评，1 长评
		 * initOp 可选配置参数
		 */
		commentDialog : function(type, extCss){
			var core=Core;
			if( !core.movieId )return;
			var commentDialogHTML = $([
				'<div class="commDialog">',
					'<a href="javascript:;" class="close"></a>',
					'<ul id="typeTab" class="typeTab"><li class="active" rel="#commDialog_S">发表新影评</li></ul>',
					'<div id="commDialog_S" class="commDialog_S">',
						'<p>评论要求6 - 300字，您还可以输入 <em class="num">300</em> 字 </p>',
						'<textarea class="comm_area textGray" rows="" cols="" name="message" maxlength="300" onkeyup="this.value = this.value.substring(0,300)">亲，说两句吧~</textarea>',
						'<div class="note">',
							'<div id="shareComment" class="shareComment">同步到：',
								'<input type="checkBox" id="sinaWeiBoCbx" checked="checked" />',
								'<label for="sinaWeiBoRadio">',
								'<a target="_blank" title="新浪微博" href="javascript:;" rel="sinaweibo" class="cpShareLink">',
								'<em class="cpShareIcon sinaweibo"></em>新浪微博</a></label>',
							'</div>',							
							'<a rel="1" class="sub" href="javascript:;" target="_blank">发表</a>',
							'<span class="err hide2">影评字数不够6字哟！</span>',
						'</div></div>'
					].join(""));
			$.dialog();
			$.dialog({
				title : "",
				content : commentDialogHTML.get(0),
				width : 0,
				css : extCss || "",
				animate : 0,
				button : [],
				init : function(){
					$('.iDialogClose').remove();//移除弹框右上角的默认关闭按钮	
					var core=Core,typeTab=$('#typeTab'),
						cmt=$('.commDialog',this),cmtS=cmt.find('.commDialog_S');	
						
					//长评/影评tab切换
					$('#typeTab').bindTab(function(){
						if($(this).attr('rel') == '#commDialog_L'){
							//如果点击的是写长评的tab，要先发个请求验证是否已发3条长评
							core.long_comment_check();
						}
					},"click"); 
					
					//弹框 关闭按钮
					cmt.find('>.close').click(function(){
						$.dialog();	
					});
					//影评界面相关事件
					var msg = cmtS.find('[name=message]'),//信息区域
						btnSub = cmtS.find('.sub'),//发表按钮
						err = cmtS.find('.err');//错误提示
					core.focusBlurTip(msg, "亲，说两句吧~");
					
					msg.keyup(function(){//同步剩余数字
						cmtS.find('.num').text(300 - this.value.length);
						err.html("").addClass("hide");
					});
					btnSub.click(core.sendComment_S);//发表影评按钮点击事件			
				}
			});
		},
		//评论提示框
		showDialog:function(content){
			Core.showDialogFunc({
				  content:content,				
				  width:450,
				  init:function(){
					  $('.iDialogClose').remove();//移除弹框右上角关闭按钮
					  $('.closePop,this').click(function(){$.dialog()});	
				  }
			});
				
		},
		//给登录后的回调地址添加标记
		urlAddHash: function(name,value){
			var url = document.URL;
			if(url.indexOf("#") == -1){
				url += "#"+name+"="+value;	
			}else{
				url	+= "&"+name+"="+value;	
			}	
			return url;
		}
	});
	
	
})(window,jQuery,Core);

var writeScommt = document.getElementById("writeScommt");
var ping = document.getElementById("iDialog0");

writeScommt.onblur=function () {
	ping.hidden=true;
}

writeScommt.onclick = function () {
	ping.hidden = false;
}