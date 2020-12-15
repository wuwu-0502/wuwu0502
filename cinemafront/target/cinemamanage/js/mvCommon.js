/*
 * 电影模块公共js： "想看"功能、兑换码入口、flash播放器
 *
 * 主要是“想看”按钮事件和蒙层显示flash。有几个页面用到故而提取出来
 * 注： 当前城市模块 城市id：myCity ，自定义属性pid为城市id
 * edit by jiangyunbao  at  2012-10-26
 */
(function(window,$,Core){	
/*判断浏览器是否是ipad iphone ipod*/
$.isIos = /(iPhone|iPad|iPod)/ig.test(navigator.userAgent);
$.extend(Core, {
	//绑定页面dom事件
	initEmlEvent: function(){
		//想看弹框事件初始化
		this.wantToSeeEventInit.init();
	},
	//是否是合法的邮箱
	isValidEmail: function( val ){
		return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val.trim());
	},
	//想看弹框
	adialog: null,
	wantToSeeMobile:'',//存储想看的手机号
	wantToSee: function(obj){
		var core=Core;
		//判断登录先
		if(!core.easyNav.isLogin(true)){
			core.login()
			return;
		}
		core.seeMvBtn = !!obj ? obj : $(this);
		if(!core.seeMvBtn.hasClass('want_see_active')){//想看
			var content=$('<div class="wantDialog"><h2>想看就留个方式呗，上映了俺提醒你<a href="javascript:;" class="closeBtn"></a></h2><div class="inputBox"><input type="checkbox" id="cbxMobile" rel="#wantToSeeMobile"><label for="wantToSeeMobile">手机：</label><input type="text" class="inputTxt" id="wantToSeeMobile" value="'+core.wantToSeeMobile+'" maxlength="11"/><p class="hide2">手机号码格式不正确!</p><input type="checkbox" id="cbxEmail" rel="#wantToSeeEmail"><label for="wantToSeeEmail">邮箱：</label><input type="text" class="inputTxt" id="wantToSeeEmail" value="' + $("em","#user163Name").text() + '"/><p class="hide2">邮箱格式不正确!</p></div><input type="button" value="确定" class="btnSub" id="btnSub" /></div>');
			var chk=$.isIE6? "defaultChecked" : "checked";
			if(!!core.wantToSeeMobile){//如果存在手机号，则默认选中
				content.find('#cbxMobile').get(0)[chk]='checked';							
			}
			if(!!$("em","#user163Name").text()){				
				content.find('#cbxEmail').get(0)[chk]='checked';				
			}
			core.adialog =core.showDialogFunc({content:content,width:632,type:"shell",init:function(){
				$('.iDialogClose').remove();//移除弹框右上角关闭按钮
				$('.closeBtn').click(function(){$.dialog()});	
			}});
			
		}else{//取消想看
			core.post('/movie/cancel_notify.html',{movieId:core.seeMvBtn.attr('pid'),city:core.curCity.id},function(err,rs){
				if(!err){						
					rs = core.parseJSON(rs);
					if(rs.retcode == 200 ){
						//更新按钮状态和数量，首页改版时结构与之前不同
						if(+core.seeMvBtn.find("i").length){
							var wantNum=core.seeMvBtn.find("i");
						}else{
							var wantNum=core.seeMvBtn.parents('li').find(".wantSeeSum");
						}	
						core.seeMvBtn.removeClass("want_see_active");
						wantNum.text(+wantNum.text()-1);
						core.seeMvBtn = null;
					}
				}
			});
		}
	},
	//想看弹框事件初始化
	wantToSeeEventInit:{
		init:function(){
			this.get_phone();
			$(document.body).delegate("#btnSub","click", this.subWantToSeeInfo)
						.delegate("#wantToSeeEmail","focus", this.emailOrMobileFocus)
						.delegate("#wantToSeeMobile","focus", this.emailOrMobileFocus)
						.delegate("#wantToSeeMobile","keyup", this.mobileKeyup)
						.delegate("#cbxEmail,#cbxMobile","click", this.cbxClick);
		},
		//通过用户中心获得登录手机号
		get_phone:function(){
			var core=Core;
			core.post('/movie/get_phone.html',{},function(err,rs){
				if(!err){						
					rs = core.parseJSON(rs);
					if(rs.retcode == 200 ){
						if($('#wantToSeeMobile')[0]){
							$('#wantToSeeMobile').text(rs.phone);
							var chk=$.isIE6? "defaultChecked" : "checked";
							$('#cbxMobile').get(0)[chk]='checked';
						}
						core.wantToSeeMobile=rs.phone||'';
					}
				}
			});
		},
		//提交想看信息
		subWantToSeeInfo: function(){
			var core = Core;
			//判断登录先
			if(!core.easyNav.isLogin(true)){
				core.login()
				return;
			}
			var d=core.wantToSeeEventInit.checkInput();
			if(!d.email && !d.mobile){//输入框为空
				return false;	
			}
			var data={email:d.email,phone:d.mobile,movieId:core.seeMvBtn.attr("pid"),city:core.curCity.id};
			core.post("/movie/mail.html",data,function(err, rs){
				$.dialog(core.adialog);
				if(!err){
					rs = core.parseJSON(rs);
					if(rs.retcode == 200){
						//更新按钮状态和数量，首页改版时结构与之前不同
						if(+core.seeMvBtn.find("i").length){
							var wantNum=core.seeMvBtn.find("i");
						}else{
							var wantNum=core.seeMvBtn.parents('li').find(".wantSeeSum");
						}						
						core.seeMvBtn.addClass("want_see_active");
						wantNum.text(+wantNum.text()+1);
						core.seeMvBtn = null;
					}else if(rs.retcode == 401){//未登录
						core.login()
					}
				}
			});
			
		},
		//想看窗口输入框验证
		checkInput: function(){
			var core = Core,input,err,val,
				data={};
			//手机号码验证
			if($('#cbxMobile').get(0).checked){	
				input=$('#wantToSeeMobile');
				err=input.next();//错误信息
				val = input.val().trim();
				if(val){
					if(!(/^1\d{10}$/g.test(val))){
						err.text('手机号码格式不正确！').removeClass('hide2');
						input.select();
						return false;
					}else{
						err.addClass('hide2');	
					}
				}else{//输入框为空
					err.text('请输入手机号！').removeClass('hide2');
					input.focus();
					return false;
				}
				data['mobile']=val;
			}
			
			//邮箱验证
			if($('#cbxEmail').get(0).checked){	
				input=$('#wantToSeeEmail');
				err=input.next();//错误信息
				val = input.val().trim();		
				if(val){
					if(!core.isValidEmail(val)){
						err.text('邮箱格式不正确！').removeClass('hide2');
						input.select();	
						return false;
					}else{
						err.addClass('hide2');	
					}
				}else{//输入框为空
					err.text('请输入邮箱！').removeClass('hide2');
					input.focus();
					return false;
				}
				data['email']=val;
			}
			return data;
		},
		//email focus事件
		emailOrMobileFocus: function(){
			if(this.value.length > 0){
				this.select();
			}
			//输入框获取焦点时，选择复选框
			$(this).prev().prev().get(0).checked=true;
		},
		//mobile keyup事件
		mobileKeyup:function(){
			var v=this.value.replace(/\D/g,'');
			this.value=v;
		},
		//复选框click事件 
		cbxClick:function(){
			var self=$(this),input = $(self.attr('rel'));
			if(!this.checked){
				if(input.val().length > 0){
					input.disabled('disabled');
				}
				input.next().addClass('hide2');
			}else{
				input.enabled('disabled');
			}
		}	
	},	
	//想看弹框事件初始化 end----------------------------------------------------------------
	
	//兑换码输入框,codeList:兑换码
	redeemCodeDialog:function(codeList){
		var core=Core;
		var inputArea='<span check="0" class="input" gbid=""><div style="float:left;position:relative;"><span class="code_err_text">兑票码不正确</span><span class="code_right_text"></span><input type="text" value="请输入一个兑票码" maxlength="12" class="code_input textGray"></div><a class="checkBtn ml14" href="javascript:;">验证</a><a href="javascript:;" class="fast_code_del ml15 none title="先不用这个码了">删除</a></span>';
		
		var rDialog=$('<div class="rDialog"><div id="warmE"> <h2>来吧亲，让我看看你的兑票码！<div class="notes"><em></em>兑票码不是代金券，是可以兑换多家影院电影票的电子码，由12位字母和数字组成，一码换一票</div><b class="help"></b></h2><h3>想要兑换几张票，就分别输入几个码，一次最多可以兑换<em>5</em>张</h3><div class="inputBox"></div></div><div class="mt10 clearfix"> <a class="add" id="addNewCode" href="javascript:;">我还有兑票码要输入</a></div><div class="rDialogFoot"><a id="subBtn" href="javascript:;" class="rDialogBtn rDialogBtn_disabled">去兑票</a><br/><span class="warnInfo hide2">请使用同一类型的码兑票</span></div></div>');
		
		var inputBox=rDialog.find('.inputBox');
		
		if(!!codeList && codeList.length >= 12){
			var codeArr=codeList.split('|'),len=codeArr.length,inputAreaTmp;
			for(var i=0,j=len;i<j;i++){
				if(!codeArr[i]){
					continue;
				}
				inputAreaTmp = $(inputArea)
				inputAreaTmp.find('.code_input').val(codeArr[i]);
				inputBox.append(inputAreaTmp);	
				
				if(inputBox.find('.code_input').length>=5){
					rDialog.find('#addNewCode').addClass('none');
					break;
				}									
			}
			inputBox.find('.code_input').removeClass('textGray');
			inputBox.find('.fast_code_del').removeClass('none');
			rDialog.find('#subBtn').addClass('rDialogBtn_disabled');					
		}else{
			inputBox.append(inputArea);
		}
		//问号 tips
		rDialog.find('.help').hover(function(){
				$(this).prev().css({"display":"block"});
			},function(){
				$(this).prev().css({"display":"none"});
			});
		//输入框只能输入数字字母
		inputBox.delegate('.code_input','keyup',function(){
			var reg=/[^0-9a-zA-Z]/g,val=this.value.trim();
			this.value=val.replace(reg,'');
		});
		inputBox.delegate('.code_input','mouseover',function(){
			$(this).addClass('input_hover');
		});
		inputBox.delegate('.code_input','mouseout',function(){
			$(this).removeClass('input_hover');
		});
		inputBox.delegate('.code_input','focus',function(){
			$(this).removeClass('textGray').addClass('input_focus');
			$(this).parent().removeClass('code_error');
			var val=$(this).val().trim();
			if(val=='请输入一个兑票码'){
				$(this).val('');
			}			
		});
		inputBox.delegate('.code_input','blur',function(){
			$(this).addClass('textGray').removeClass('input_focus');	
			var val=$(this).val().trim();
			if(val==''){
				$(this).val('请输入一个兑票码');
				$(this).parent().removeClass('active code_error');
			}		
		});	
		//验证按钮
		inputBox.delegate('.checkBtn','click',function(){
			var input=$(this).prev().find('input'),
				val=input.val().trim();
			if(val.length==12){
				var f=false;
				inputBox.find('.input[check="1"] .code_input').each(function(k,v){
					if(val == $(v).val().trim()){//输入了重复的通兑码
						f=true;
						return false;
					}	
				});
				if(f){
					alert('您输入了重复的通兑码！');
					input.get(0).select();
					return;	
				}
				
				var code_check=$(this).parent().find('.code_check'),code_check_val='';
				if(code_check.length>0){
					code_check_val=code_check.find('.code_check_input').val().trim();//验证码
					if(!code_check_val){
						code_check.find('.codeCheck_err_text').removeClass('none').text('请输入验证码');
						return;
					}
					//获取验证码后移除验证码输入框
					code_check.remove();					
					$(this).parent().removeClass('checkCode');
				}
				
				core.checkCode($(this).parent(),val,code_check_val);
			}else{
				$(this).parent().addClass('active code_error');
			}
		});	
		//删除输入框
		inputBox.delegate('.fast_code_del','click',function(){
			var pp = $(this).parent().parent();
			
			$(this).parent().remove();
			$('#addNewCode').removeClass('none');
			
			var count=inputBox.find('.input').length;
			if(count<=1){
				inputBox.find('.fast_code_del').addClass('none');
			}
			
			var flag = core.checkGbid(pp);
						
			if(inputBox.find('.input[check="0"]').length<=0 && flag){				
				$('#subBtn').removeClass('rDialogBtn_disabled');
			}
		});
		//添加输入框
		rDialog.find('#addNewCode').click(function(){
			var count=inputBox.find('.input').length;
			if(count>=5){
				return false;
			}	
			inputBox.append(inputArea);
			inputBox.find('.fast_code_del').removeClass('none');
			$('#subBtn').addClass('rDialogBtn_disabled');
			
			count=inputBox.find('.input').length;
			if(count>=5){
				$(this).addClass('none');
			}
		});
		//确定提交
		rDialog.find('#subBtn').click(function(){
			if($(this).hasClass('rDialogBtn_disabled')){
				return;
			}
			var codeStr="";
			if(inputBox.find('.input[check="0"]').length>0){
				alert('有未验证通兑码!');
				inputBox.find('.input[check="0"]').addClass('active');
			  	return;	
			}
			inputBox.find('.code_input').each(function(k,v){
				codeStr+='|'+v.value;	
			});
			Core.subMitCode(codeStr.substr(1),$(this));
		});
		$.dialog();
		$.dialog({
			title:"",
			content: rDialog,
			css:"fast_enter",
			width : 640,
			//position:{},
			button : []
		});
	},
	//获取已验证的通兑码(窗口弹出时默认显示)
	getCodeSubminted:function(){
		var core=Core;
		core.post('/order/rebate/code_get_submited.html',{},function(err,rs){
		  	if(!err){
				//rs=core.parseJson(rs);
				if(rs.retcode == 200){
					//var rs={"retcode":"200","retdesc":"操作成功","codeList":'000000000000|WWWWWWWWWWWW|WWWWWWWWWWWW|WWWWWWWWWWWW|WWWWWWWWWWWW',"groupBuyId":""};
					
					core.redeemCodeDialog(rs.codeList);				
				}else if(rs.retcode == 400){
					//alert('网络超时，请重试');				
					core.redeemCodeDialog();
				}else if(rs.retcode == 410){
					//登录超时或未登录
					$.dialog();
					core.login();
				}		
			}
		});
	},
	//判断groupBuyId 是否一样
	checkGbid:function(inputBox){
		var flag=true,
			warnInfo=inputBox.parent().parent().find('.rDialogFoot > .warnInfo'),				
			validInputs=inputBox.find('.input[check="1"]');//验证通过的input
		warnInfo.html('请使用同一类型的码兑票');	
		if(validInputs.length >= 2){//至少两个兑换码	
			var firstGbid = validInputs.first().attr('gbid');//存储第一个兑换码
			validInputs.each(function(index,item){
				var gbid=$(item).attr('gbid');				
				if(gbid != firstGbid){
					flag=false;
					return false;
				}
			});
			
			if(flag){
				warnInfo.addClass('hide2');
			}else{
				warnInfo.removeClass('hide2');	
			}
		}else{
			warnInfo.addClass('hide2');
		}
		return flag;
	},
	//通兑码输入校验接口
	checkCode:function(objSpan,rebate_code,check_code){
		var core=Core;
		core.post('/order/rebate/my_code_check.html',{'rebate_code':rebate_code,'check_code':check_code},function(err,rs){
			if(!err){rs = core.parseJSON(rs);
				//rs={"retcode":"300","retdesc":"操作成功","code":"11111|22222","codeName":"","groupBuyId":"000","needCheckCode":false,"check_code":"","checkCodeUrl":"http://127.0.0.1/mv/images/fastBuy/fast_code_check.gif"};				
				if(rs.retcode==200){
					objSpan.find('.code_right_text').text(rs.codeName);
					objSpan.removeClass('active code_error').addClass('code_right').attr("check","1");
					objSpan.attr("gbid",rs.groupBuyId);
					
					objSpan.find('.code_input').attr('disabled',true);
					objSpan.find('.checkBtn').remove();
					objSpan.find('.code_check').remove();
					
					var flag = core.checkGbid(objSpan.parent());
					
					if(objSpan.parent().find('.input[check="0"]').length<=0 && flag){
						$('#subBtn').removeClass('rDialogBtn_disabled');						
					}
				}else if(rs.retcode == 201 || rs.retcode == 202 || rs.retcode == 203 || rs.retcode == 206 || rs.retcode==207){
					//objSpan.find('.code_input').get(0).select();
					objSpan.addClass('active code_error');
					if(rs.retcode==201){
						objSpan.find('.code_err_text').text('兑票码不正确');
					}else if(rs.retcode==202){
						objSpan.find('.code_err_text').text('兑票码未生效');
					}else if(rs.retcode==203){
						objSpan.find('.code_err_text').text('兑票码已使用');
					}else if(rs.retcode==206){
						objSpan.find('.code_err_text').text('兑票码已过期');
					}else if(rs.retcode==207){
						objSpan.find('.code_err_text').text('兑票码被占用');
					}
					
					if(rs.needCheckCode){
						var code_check=objSpan.find('.code_check');
						code_check.find('input').val('');
						code_check.find('img').attr('src',rs.checkCodeUrl);	
						code_check.find('.codeCheck_err_text').addClass('none');
					}
				}else if(rs.retcode == 204 || rs.retcode == 205){
					//alert('验证码错误，请重新输入');
					var code_check=objSpan.find('.code_check');
					code_check.find('input').val('');
					code_check.find('img').attr('src',rs.checkCodeUrl);
					code_check.find('.codeCheck_err_text').removeClass('none').text('验证码不正确');
				}else if(rs.retcode == 300){
					//需要输入验证码					
					objSpan.addClass('active checkCode').removeClass('code_error');
					objSpan.append('<div class="code_check"><input type="text" class="code_check_input" maxlength="4"><img src="'+rs.checkCodeUrl+'" alt=""/><span class="codeCheck_err_text none">验证码不正确</span></div>');
					objSpan.find('.code_check > input').focus();
				}else if(rs.retcode == 400){
					alert('网络超时，请重试');
				}else if(rs.retcode == 410){
					//登录超时或未登录
					$.dialog();
					core.login();
				}
				
			}
		});
	},
	//提交通兑码
	subMitCode:function(codeStr,subBtn){
		var core=Core;
		core.post('/order/rebate/code_check_submit.html',{'rebate_code_list':codeStr},function(err,rs){
			if(!err){
				rs = core.parseJSON(rs);
				var warnInfo=subBtn.parent().find('span');//提示信息区域
				//rs={"retcode":"208","retdesc":"操作成功","inValidCodeList":"1111","groupBuyId":"000"};
				switch(+rs.retcode){//
					case 200:
	  					//快速选做页面弹窗
	  					$.dialog();
	  					$.dialog({
	  						type:"shell",
	  						title:"",
	  						content: '<div class="iDialogContent"><a id="fastBuyClose" href="javascript:;" class="fastBuyClose"></a><iframe scrolling="no" frameborder="0" style="width:100%;height:500px;overflow:hidden;" src="../fast/dispatch.html?groupBuyId='+rs.groupBuyId+'"></iframe></div>',
	  						width : 960,
	  						button : []
	  					});
	  					$(document).delegate('#fastBuyClose','click',function(){
	  						$.dialog();
	  					});
						break;
					case 202:
					case 203://alert('以下通兑码已被使用或者被占用\r\n'+rs.inValidCodeList);
						warnInfo.removeClass('hide2').html('以下通兑码已被使用或者被占用 '+rs.inValidCodeList);
						break;
					case 206://alert('一次最多可以兑换5张');
						warnInfo.removeClass('hide2').html('一次最多可以兑换5张');
						break;
					case 208://alert('抱歉哦！工程师小伙伴们正在紧急维修兑票码系统，请给多点时间，稍后再来试试。');
						warnInfo.removeClass('hide2').html('抱歉，工程师正在紧急维修兑票码系统，请稍后再试。');
						break;
					case 300://alert('您的兑换码有问题，\r\n请重新核对再提交！');
						warnInfo.removeClass('hide2').html('您的兑换码有问题，请重新核对再提交！');
						break;
					case 400:alert('网络超时，请重试');
						break;
					case 410:
						//登录超时或未登录
						$.dialog();
						core.login();
						break;
					
				}
			}			
		});
	},
	//预览flash
	view : function( url, op ){
		var div = $("<div style='width:720px;height:416px; overflow:hidden;background:black;'>").appendTo(document.body);
		var div_noFlash="<div style='width:500px;height:200px;line-height:200px;overflow:hidden;background:#fff;text-align:center;'>您的浏览器木有装flash播放器，无法播放预告片，请<a href='http:\/\/get.adobe.com\/cn\/flashplayer\/' target='_blank'>点此安装</a>！</div>";
		this.insertFlash(div, {
			path : url,
			id : "video"+ (+new Date()),
			width : 720,
			height : 416,
			fullScreen: true
		}, function(support, version){
			if(!$.isIos && (!support || version < 9)){
				$.dialog({
					title : "",
					content : div_noFlash,
					width : 0,
					height : 0,
					button : [],
					animate : 0,
					position: op && op.position ? op.position : "c",
					css : ""
				});
				div.remove();
				return false;
			}else{
				$.dialog({
					title : "",
					content : div,
					type : "insert",
					width : 0,
					height : 0,
					button : [],
					animate : 0,
					position: op && op.position ? op.position : "c",
					css : "",
					beforeClose: function(){
						div.empty();	
					}
				}, function(){
					div.remove();
				});
			}
		});
	},
	//网易宝嵌入页面预览flash
	viewS : function( url, op ){
		var div = $("<div style='width:620px;height:358px; overflow:hidden;background:black;'>").appendTo(document.body);
		var div_noFlash="<div style='width:500px;height:200px;line-height:200px;overflow:hidden;background:#fff;text-align:center;'>您的浏览器木有装flash播放器，无法播放预告片，请<a href='http:\/\/get.adobe.com\/cn\/flashplayer\/' target='_blank'>点此安装</a>！</div>";
		this.insertFlash(div, {
			path : url,
			id : "video"+ (+new Date()),
			width : 620,
			height : 358,
			fullScreen: true
		}, function(support, version){
			if(!$.isIos && (!support || version < 9)){
				$.dialog({
					title : "",
					content : div_noFlash,
					width : 0,
					height : 0,
					button : [],
					animate : 0,
					position: op && op.position ? op.position : "c",
					css : ""
				});
				div.remove();
				return false;
			}else{
				$.dialog({
					title : "",
					content : div,
					type : "insert",
					width : 0,
					height : 0,
					button : [],
					animate : 0,
					position: op && op.position ? op.position : "c",
					css : "",
					beforeClose: function(){
						div.empty();	
					}
				}, function(){
					div.remove();
				});
			}
		});
	}
});

})(window,jQuery,Core);