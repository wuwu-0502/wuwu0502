/*
 * 支付页面js
 * edit by xuying at 2012-11-06
  * 修改优惠券输入时onkeyup，只有值改变时才再次向后台发出请求
 */
(function(window,$,Core){
//reset logout url
Core.navConfig.logoutUrl = "/logout.html";
$.extend(Core, {
	//入口函数
	myInit: function(){
		var core=Core;
		
		//0元支付，记录用户初始支付状态,当不使用优惠券或优惠码时，将“立即兑票”变成初始状态		
		if($("#methodBox").is(":hidden")){
			core.showBox="methodUserBox";
		}
		if($("#methodUserBox").is(":hidden")){
			core.showBox="methodBox";
		}
		//邮箱应用入口标识
		if(core.isInFrame){
			core.mailApp="/mailapp";
			//if(core.cdnBaseUrl.indexOf("imgimg.126.net") > 0){//测试环境订单入口，积分入口需要加81端口
				//core.mailAppOrder=":81/mailapp";
			//}else{//在线确认，在线环境不加端口
				core.mailAppOrder="/mailapp";
			//}
		}else{//主站
			core.mailApp="";
			core.mailAppOrder="";	
		}
		
		//网上银行支付方式切换
		$("#payTab").bindTab("click");
		//手机号码确认提醒 
		this.warming();		
		//显示所有银行
		this.showAll();		
		//是否同意并接受网易商城服务协议
		this.subPay();
		//倒计时
		this.timerStar(this.closeTime);			
		//如兑票码已经使用过，则提示用户
		if(core.invalideCodes && core.invalideCodes.length > 0){
			var codes=core.invalideCodes.join("，");
			$.dialog({
					title : "",
					width : 500,
					button:["返回首页","*继续支付"],
					css:"rebate_dialog",
					content:'<div class="payMeg" style="padding-bottom:0;"><div class="main" style="text-align:center;font-size:14px;padding:40px 0px;"><div>兑票码'+codes+'不可以重复使用哦！</div>您可以按优惠价继续支付，也可以回到首页，更换兑票码重新兑票！</div></div>',
					beforeClose : function(btn_index){
						if(btn_index==1){
							//告之后台，删除已经生成的订单
							core.post("/order/close_order.html?order_id="+$("#order_id").val().trim(),function(err,rs){
								
								if(core.isInFrame){//邮箱应用
									window.location.href="http://piao.163.com/promoter/mail_126.html";	
								}else{//主站 Core.isInFrame=undefined
									window.location.href="http://piao.163.com";	
								}
							});
						}
					}
			});		
		};
		
		//当用户使用兑票码时，不可使用优惠券
		if(core.isUsingRC!=1){
	  		//使用优惠券
	  		this.initFav();
	  		//check_flag用来告之后台是否需要验证码,check_out标记用户输入是否超过三次
	  		core.check_flag=0,core.check_out=0;
	  		//切换到手动输入优惠券 
	  		this.showCodeText();
		}						 
		
		//绑定兑换按钮,支付完成按钮
		$("body").delegate("#checkExchange", "click", this.chargeBefore)
				 .delegate("#pay_btn_01","click", function(){var displayGorderId=$("#displayGorderId").val().trim();window.location.href="http://order.mall.163.com"+Core.mailAppOrder+"/movie/list.html?gorderId="+displayGorderId;})
				 .delegate("#nopay_btn_01","click", function(){var displayGorderId=$("#displayGorderId").val().trim();window.location.href="http://order.mall.163.com"+Core.mailAppOrder+"/movie/list.html?gorderId="+displayGorderId;})
				 .delegate("#pay_btn_02","click", function(){
					 if(core.isInFrame){//邮箱应用
						window.open("http://mall.163.com/help/movie.html");
					 }else{//主站 Core.isInFrame=undefined
						window.location.href="http://mall.163.com/help/movie.html";
					 }
				 });		
		
		//修改支付方式
		$("#payUserEdit").click(function(){Core.editPayMethod();});
		$("#payEdit").click(function(){Core.editPayMethod();});
		//取消修改支付方式
		$("#cancleEdit").click(function(){Core.cancelPayMethod();});
		$("#closeEdit").click(function(){Core.cancelPayMethod();});
		//确认修改支付方式
		$("#sureEdit").click(function(){Core.surePayMethod();});
		//绑定使用优惠券单选按钮
		if($("input:radio[name=use_radio]")[0]){
			this.selCodeType();
		}
		//用来记录手动输入的优惠码，当优惠码满10位，并且与上次输入内容有变化时，向后台请求验证是否是合法的码
		core.userFavTextVal='';
		
		//加载第三方合作铺码代码
		core.statistics_adsage();
	},
	//绑定使用优惠券单选按钮
	selCodeType : function(){
		$("input:radio[name=use_radio]").click(function(){
			var core=Core;
			//判断是否登录
			if(!core.easyNav.isLogin()){
				core.login();
				return false;
			}
			if($(this).val()==0){
				$("#userFavSel").show();
				$("#fav_sel_err").show();
				$("#userFavText").hide();
				$("#fav_err").hide();
				$("#coupon_num").attr("class","coupon_num");
				//当手机号使用优惠券个数有限制时，$("#userFavSel")里显示提示文案，不再使用优惠码
				//当用户有补偿码时，即使有个数限制，仍可使用补偿码
				if($("#userFavSel").is('select')){
					var favNum=$("#userFavSel").val().trim();
					if( favNum.length ==10 && favNum!="0000000000"){
						core.checkFavText();	
					}else{
						core.favPc = 0;	
						core.calPrice();	
					}
				}
			}else{
				$("#userFavText").show();
				$("#fav_err").show();
				$("#userFavSel").hide();
				$("#fav_sel_err").hide();	
				$("#coupon_num").attr("class","coupon_num");
				//当手机号使用优惠券个数有限制时，$("#userFavText")里显示提示文案，不再使用优惠码
				//当用户有补偿码时，即使有个数限制，仍可使用补偿码，但补偿码放在下拉里，用户可在下拉里选择，但不可手动输入码
				if($("#userFavText").is('input')){
					var favNum=$("#userFavText").val().trim();
					if( favNum.length ==10 && favNum!="输入十位优惠码"){
						core.checkFavText();	
					}else if(favNum!="输入十位优惠码"){
						core.favPc = 0;	
						core.calPrice();
						core.showFavTextErr(2,"优惠码是10位哦！");
					}else{
						core.favPc = 0;	
						core.calPrice();	
					}
				}
			}
		})
	},	
	//修改支付方式
	editPayMethod : function(){		
		//判断是否登录
		if(!Core.easyNav.isLogin()){
			Core.login();
			return false;
		}
		var scrollW=document.documentElement.scrollWidth;
		var scrollH=document.documentElement.scrollHeight;
		var T=(document.documentElement.clientHeight-$("#payment")[0].clientHeight)/2+document.documentElement.scrollTop;	
		$("#cover").css({ "width": scrollW, "height": scrollH}).show();		
		$("#payment").css({"top":T,"visibility":"visible"});	
		
		//$("#payTabC_1 .payMethod").addClass("other");
		//$("#payTabC_2 .payMethod").addClass("other");
		if($.isIE6 && $("#userFavSel")[0] && $("#userFavSel").is("select")){
			//ie6下隐藏select
			$("#userFavSel").css("visibility","hidden");	
		}
	},
	//取消修改支付方式
	cancelPayMethod : function(){
		$("#cover").hide();
		$("#payment").css({"visibility":"hidden"});
		if($.isIE6 && $("#userFavSel")[0] && $("#userFavSel").is("select")){
			//ie6下隐藏select
			$("#userFavSel").css("visibility","visible");	
		}
	},
	//确认修改支付方式
	surePayMethod : function(){
		var selVal=$("input:[name='paymethodList']:checked").val();	
		if(!selVal.trim()){
			$("#bankImg").removeClass().addClass("bank_img bank_0000");
		}else{
			$("#bankImg").removeClass().addClass("bank_img bank_"+selVal);
		}
		$("#cover").hide();
		$("#payment").css({"visibility":"hidden"});
		$("input[name='paymethod']").val(selVal);		
		//$("#methodBox").remove();
		$("#methodBox").hide();
		$("#methodUserBox").show();
		//0元支付，记录用户初始支付状态,当不使用优惠券或优惠码时，将"立即兑票"变成已选状态
		Core.showBox="methodUserBox";
		if($.isIE6 && $("#userFavSel")[0] && $("#userFavSel").is("select")){
			//ie6下隐藏select
			$("#userFavSel").css("visibility","visible");	
		}		
	},
	//切换到手动输入优惠券 
	showCodeText: function(){		
		if($("#showText")[0]){
			var core=Core;
			$("#showText").click(function(){
				//验证是否需要输入验证码
				Core.checkBefore();			
			})	
		}
	},
	checkBefore:function(){
		//检测是否需要用户输入验证码
		Core.post("/order/code_check_before.html",function(err,rs){
			if(!err && rs){
				var core = Core;
				rs = core.parseJSON(rs);
				if($.isIE6 && $("#userFavSel")[0] && $("#userFavSel").is("select")){
					//ie6下隐藏select
					$("#userFavSel").css("visibility","hidden");	
				}
				switch(+rs.retcode){
					case 200: //成功
						if(rs.needCheck){							
							core.showDialogCom(0,'<div class="meg"><div class="close"></div><ul><li><span class="th">请输入优惠码：</span><input type="text" class="text" id="codeText" maxlength="10"/></li><li><span class="th"></span><span class="err" id="codeErr"></span></li><li><span class="th">请输入验证码：</span><input type="text" class="text" style="width:93px;" id="checkNum" maxlength="4"/><img src="'+rs.checkCodeUrl+'" width="95" height="26" alt="" class="ml10" id="checkNumImg"/></li><li><span class="th"></span><span class="err" id="checkErr"></span></li><li><span class="th"></span><input type="button" value="兑换" class="btn_meg_charge" id="checkExchange"/></li></ul></div>');	
							check_out=0;
							check_flag=1;							
							//初始化优惠码
		  					core.initCode();
						}else{
							core.showDialogCom(0,'<div class="meg" id="initMeg"><div class="close"></div><ul><li><span class="th">请输入优惠码：</span><input type="text" class="text" id="codeText" maxlength="10"/><input type="button" value="兑换" class="btn_meg_charge ml8" id="checkExchange"/></li><li><span class="th"></span><span class="err" id="codeErr"></span></li></ul></div>');	
							check_out=1;
							check_flag=0;
							//初始化优惠码
		  					core.initCode();
						}
						break;
					case 410: //登录超时或尚未登录
						check_flag=0;
						core.showDialogCom(1,'<div class="movieDialog"><h2><b></b>优惠码格式错误，请重新输入！</h2></div>');	
						break;
					default://异常
						check_flag=0;
						core.showDialogCom(1,'<div class="movieDialog"><h2><b></b>出错了~</h2></div>');				
				}
			}
		});	
	},
	checkCode:function(){
		var code=$("#codeText").val().trim(),needCheckCode=0;
		if($("#checkNum")[0]){
			var checkCode=$("#checkNum").val().trim();
		}
		if(check_flag==1){
			needCheckCode=1;	
		}
		//检测优惠码和验证码是否正确
		Core.post("/order/my_code_check.html",{code:code,need_check_code:needCheckCode,check_code:checkCode},function(err,rs){
			if(!err && rs){
				var core = Core;	
				rs = core.parseJSON(rs);
				switch(+rs.retcode){
					case 200: //成功					
						$.dialog();	
						//设置下拉框为可用状态
						var userFav=$("#userFav"),userFavText=$("#userFavText"),html="";
						if(!userFav.attr("checked")){
							userFav.attr("checked",true);
							userFavText.attr("disabled",false);							
						}	
						if(!$('#userFavText option[value="'+rs.codeVo.code+'"]')[0]){//下拉列表中没有重复和用户输入重复的优惠券，则添加到下拉列表里
							html='<option value="'+rs.codeVo.code+'">'+rs.codeVo.codeName+'</option>';
							$("#userFavText option:eq(0)").after(html);
							userFavText.val(rs.codeVo.code);
							core.checkFavText();		
						}else{//如果下拉列表已经存在用户输入的优惠券，下拉列表里不再增加，直接选中此项显示给用户
							userFavText.val(rs.codeVo.code);
							core.checkFavText();
						}											
						break;
					case 203: //兑换券不存在			
						if(rs.needCheck && check_out){//此处用来判断登录时不需输入验证码，连续3次输错后提示输入验证码
							var codeVal=$("#codeText").val();
							$.dialog();	
							$("#initMeg").remove();
							core.showDialogCom(2,'<div class="meg"><div class="close"></div><ul><li><span class="th">请输入优惠码：</span><input type="text" class="text" id="codeText" maxlength="10" value="'+codeVal+'"/></li><li><span class="th"></span><span class="err" id="codeErr">优惠码不正确，请重新输入！</span></li><li><span class="th">请输入验证码：</span><input type="text" class="text" style="width:93px;" id="checkNum" maxlength="4"/><img src="'+rs.checkCodeUrl+'" width="95" height="26" alt="" class="ml10" id="checkNumImg"/></li><li><span class="th"></span><span class="err" id="checkErr"></span></li><li><span class="th"></span><input type="button" value="兑换" class="btn_meg_charge" id="checkExchange"/></li></ul></div>');	
							check_flag=1;
							//初始化优惠码
		  					core.initCode();		
						}else{
							$("#codeErr").html("优惠码不正确，请重新输入！");	
							if(rs.needCheck){//首次输入验证码后，每次兑换，用户输入错误刷新验证码	
								$("#checkNumImg").attr("src",rs.checkCodeUrl);		
							}
						};
						break;
					case 204: //校验码错误
						$("#checkErr").html(rs.retdesc);	
						$("#checkNumImg").attr("src",rs.checkCodeUrl);					
						break;
					case 205: //校验码过期		
						$("#checkErr").html(rs.retdesc);				
						$("#checkNumImg").attr("src",rs.checkCodeUrl);
						break;
					case 410: //登录超时或尚未登录						
						if(rs.needCheck && check_out){//兑换超过3次
							var codeVal=$("#codeText").val();
							$.dialog();	
							$("#initMeg").remove();
							core.showDialogCom(2,'<div class="meg"><div class="close"></div><ul><li><span class="th">请输入优惠码：</span><input type="text" class="text" id="codeText" maxlength="10" value="'+codeVal+'"/></li><li><span class="th"></span><span class="err" id="codeErr"></span></li><li><span class="th">请输入验证码：</span><input type="text" class="text" style="width:93px;" id="checkNum" maxlength="4"/><img src="'+rs.checkCodeUrl+'" width="95" height="26" alt="" class="ml10" id="checkNumImg"/></li><li><span class="th"></span><span class="err" id="checkErr">登录超时或尚未登录!</span></li><li><span class="th"></span><input type="button" value="兑换" class="btn_meg_charge" id="checkExchange"/></li></ul></div>');	
							check_flag=1;
							//初始化优惠码
		  					core.initCode();		
						}else{
							$("#codeErr").html("登录超时或尚未登录！");	
							if(rs.needCheck){//首次输入验证码后，每次兑换，用户输入错误刷新验证码	
								$("#checkNumImg").attr("src",rs.checkCodeUrl);		
							}		
						};
						break;
					default://异常										
						if(rs.needCheck && check_out){//兑换超过3次
							var codeVal=$("#codeText").val();
							$.dialog();	
							$("#initMeg").remove();
							core.showDialogCom(2,'<div class="meg"><div class="close"></div><ul><li><span class="th">请输入优惠码：</span><input type="text" class="text" id="codeText" maxlength="10" value="'+codeVal+'"/></li><li><span class="th"></span><span class="err" id="codeErr"></span></li><li><span class="th">请输入验证码：</span><input type="text" class="text" style="width:93px;" id="checkNum" maxlength="4"/><img src="'+rs.checkCodeUrl+'" width="95" height="26" alt="" class="ml10" id="checkNumImg"/></li><li><span class="th"></span><span class="err" id="checkErr">系统异常，请重新输入!</span></li><li><span class="th"></span><input type="button" value="兑换" class="btn_meg_charge" id="checkExchange"/></li></ul></div>');	
							check_flag=1;
							//初始化优惠码
		  					core.initCode();		
						}else{
							$("#codeErr").html("系统异常，请重新输入！");	
							if(rs.needCheck){//首次输入验证码后，每次兑换，用户输入错误刷新验证码		
								$("#checkNumImg").attr("src",rs.checkCodeUrl);		
							}									
						};
				}
			}
		});		
	},	
	//初始化优惠码
	initCode : function(){
		var input = $("#codeText");
		input.keyup(function(){
			var v = input.val().replace(/[^0-9a-zA-Z]/g, "").trim();
			if( v != this.value )
				this.value = v;
			$("#codeErr").html("");	
		}).blur(function(){
			var v = input.val().replace(/[^0-9a-zA-Z]/g, "").trim();
			if( v != this.value )
				this.value = v;			
		}).focus(function(){
			$("#codeErr").html("");	
		});			
		if($("#checkNum")[0]){
			$("#checkNum").focus(function(){
				$("#checkErr").html("");			
			}).click(function(){
				$("#checkErr").html("");			
			}).keyup(function(){
				$("#checkErr").html("");			
			});	
		}	
	},	
	//兑换前验证
	chargeBefore: function(){
		var codeText=$("#codeText"),checkNum=$("#checkNum");
		if(codeText[0]){
			var codeTextVal=codeText.val().trim();
			if(codeTextVal==""){
				$("#codeErr").html("请输入优惠码！");
				return false;	
			}
			if(codeTextVal.length < 10){
				$("#codeErr").html("请输入10位优惠码！");
				return false;	
			}	
		}
		if(checkNum[0]){
			var checkNumVal=checkNum.val().trim();
			if(checkNumVal==""){
				$("#checkErr").html("请输入验证码！");
				return false;	
			}	
			if(checkNumVal.length < 4){
				$("#checkErr").html("请输入4位验证码！");
				return false;	
			}	
		}
		Core.checkCode();		
	},
	//手机号码确认提醒 
	warming: function(){
		$("#telWarming").hover(
			function(){
				$(this).parent().addClass("active");	
			},
			function(){
				$(this).parent().removeClass("active");	
			}
		)
	},
	//计算价格  isCheckClick"是否是使用优惠券"checkbox点击（不适用优惠券时）  1是checkbox点击，且checkbox未勾选上
	calPrice : function(isCheckClick){
		var v = $("#totalPrice").text().replace(/[^0-9\.]/g, ""),
			favPrice = $("em","#favPrice"), f = this.favPc, tp,core=Core;
			
		if(isCheckClick && isCheckClick == 1){
			f = 0
		}
		favPrice.html(f ? f : 0);
			
		tp = (Number(v)-f).Round(2);	
		tp=tp>0?tp:0;
		$("#totalFavPrice").html("¥"+ tp);
		$("#scoreNum").text(Math.ceil(tp));
		//0元支付，不显示"选择支付方式"，且原"确认无误，去付款"按钮更改为"立即兑票"
		if(tp == 0){			
			$("#methodBox").hide();
			$("#methodUserBox").hide();
			$("#exchangeBox").show();
			Core.noPay=true;
		}else{
			$("#methodBox").hide();
			$("#methodUserBox").hide();
			$("#exchangeBox").hide();	
			$("#"+core.showBox).show();
			Core.noPay=false;
		}
	},
	//使用优惠券
	initFav : function(){
		var favText = $("#userFavText"),favSel = $("#userFavSel"),favTip = $("#favTip");
		
		if(parseFloat($("#totalPrice").text().replace(/[^0-9\.]/g, "")) <= 10){ //不可使用优惠券
			$("#coupon_num").hide();
			f = 0;
		}else{
			$("#coupon_num").show();
		}
		//绑定优惠码输入框blur、focus默认文字事件
		if(favText.length > 0){
			this.focusBlurTip(favText, "输入十位优惠码");}
		
		favSel.change(this.favTextCheck);
		
		favText.focus(this.favTextFocus).blur(this.favTextBlur).change(this.favTextCheck).keyup(this.favTextCheck).disableDarg().bind("paste", function(){
			var obj = this;
			window.setTimeout(function(){
				Core.favTextCheck.call(obj);
			},100);	
		});
	},
	//优惠码输入框focus事件
	favTextFocus: function(){
		if(this.value.length < 10){ //如果focus时输入小于10位则清除错误提示，恢复普通输入状态
			Core.showFavTextErr();
		}
	},
	favTextBlur: function(){
		var val = this.value.trim();
		if(!val || val == "输入十位优惠码"){
			//onkeyup时，只有值有所改变时，才会向后台发出请求，所以此处需置空Core.userFavTextVal
			Core.userFavTextVal='';
			return;	
		}
		if(this.value && this.value.length < 10){ //如果focus时输入小于10位则清除错误提示，恢复普通输入状态
			Core.showFavTextErr(2,"优惠码是10位哦！");
		}
	},
	//优惠券输入框校验
	favTextCheck: function(e){	
		var v = this.value.replace(/[^a-zA-z0-9]/g,''), core = Core;
		if( v != this.value ){
			this.value = v;
		}
		if($(this).is('select') && v =="0000000000"){
			//下拉选择已有优惠券时，"请选择"选项
			v=+v;	
			//切换到请选择，清空core.userFavTextVal
			core.userFavTextVal='';
		}
		if(!v || v.length < 10){
			core.favPc = 0;	
			core.calPrice();
			core.showFavTextErr();
		}else{
			//onkeyup时，只有值有所改变时，才会向后台发出请求
			if(v!=core.userFavTextVal){
				core.userFavTextVal=v;
				core.checkFavText();
			}	
		}
	},
	//验证优惠码是否存在
	favPc: 0, //保存优惠券价格
	checkFavText: function(){
		var orderId=$("#order_id").val();
		if($("input:radio[name='use_radio'][checked]").val()==0){//使用我的优惠券
			var favVal = $("#userFavSel").val().replace(/[^a-zA-z0-9]/g,'');
		}else if($("input:radio[name='use_radio'][checked]").val()==1){//手动输入优惠券
			var favVal = $("#userFavText").val().replace(/[^a-zA-z0-9]/g,'');
		}else{
			var favVal="";	
		}
		Core.post("/order/check_code.html",{code:favVal,order_id:orderId},function(err,rs){
			//var err = 0, rs = "{'retcode':203,'codeValid':true,'codeAmount':30}";			
			if(!err && rs){
				var core = Core;
				rs = core.parseJSON(rs);
				switch(+rs.retcode){
					case 200: //成功
						if(rs.codeValid){
							core.showFavTextErr(1);
							core.favPc = rs.codeAmount;
						}
						break;
					default:
						core.favPc = 0;
						core.showFavTextErr(2,!!rs.retdesc.trim()?rs.retdesc:"这个码不正确啦~");
				}
				//计算价格
				core.calPrice();
			}
		});
	},
	showFavTextErr: function( type, txt ){
		var cs = "coupon_num", flag = 0, userFavText = $("#userFavText");
		switch(type){			
			case 1: //正确 
				cs += " coupon_num_true";
				flag = 1;
				break;
			case 2: //错误
				cs += " coupon_num_error";
				break;
			/*case 3: //禁用
				cs = this.className + " coupon_num_disabled";*/
			default: //默认
				break;	
		}
		
		//$("#userFavText").data("flag", flag); //存放输入的优惠码是否正确，一遍submit的时候不校验
		
		/*存放输入的优惠码是否正确，
		由于手机号使用优惠券个数限制功能开启时，当用户手机号已受限，
		但还有补偿码时，$("#userFavText")不存在，所以将标记修改保存在$("#code")*/
		$("#code").data("flag", flag); 
		
		
		if($("input:radio[name='use_radio'][checked]").val()==0){//使用我的优惠券
			$("#fav_sel_err").text(txt || "");
		}else if($("input:radio[name='use_radio'][checked]").val()==1){//手动输入优惠券
			$("#fav_err").text(txt || "");
		}
		$("#coupon_num")[0].className = cs;		
	},
	//显示所有银行
	showAll: function(){
		$(".showAllBank").click(function(){
			if($(this).siblings(".otherBank").has("other")){
				$(this).siblings(".otherBank").removeClass("other");
				$(this).hide();
			}
		})
	},
	//是否同意并接受网易商城服务协议
	subPay: function(){		
		var core=Core;
		//用户有惯用支付方式
		if($("#btnAgree1").length){
			$("#btnAgree1").attr("checked",true);
			$("#btnAgree1").click(function(){	
				if($(this).attr("checked")){
					$("#subPay1").removeClass("disabled");
					$("#subPay1").attr("disabled",false);					
				}else{
					$("#subPay1").addClass("disabled");
					$("#subPay1").attr("disabled",true);
				}
			})	
		};	
		//用户无惯用支付方式，显示“立即兑票”
		if($("#btnAgree2").length){
			$("#btnAgree2").attr("checked",true);
			$("#btnAgree2").click(function(){	
				if($(this).attr("checked")){
					$("#subPay2").removeClass("disabled");
					$("#subPay2").attr("disabled",false);					
				}else{
					$("#subPay2").addClass("disabled");
					$("#subPay2").attr("disabled",true);
				}
			})	
		};	
		//0元支付，显示“立即兑票”
		if($("#btnAgree3").length){
			$("#btnAgree3").attr("checked",true);
			$("#btnAgree3").click(function(){	
				if($(this).attr("checked")){
					$("#exchangePay").removeClass("disabled");
					$("#exchangePay").attr("disabled",false);					
				}else{
					$("#exchangePay").addClass("disabled");
					$("#exchangePay").attr("disabled",true);
				}
			})	
		};	
		//有惯用支付方式，且支付金额不为0时	
		$("#subPay1").bind("click",core.subPayBtn); 	
		//无惯用支付方式，抵扣码数量大于等于选座数量，支付金额为0时,避免同名id
		$("#subPay2").bind("click",core.subPayBtn); 	
		//0元支付页面优化需求0226增加id=exchangePay，避免同名id
		$("#exchangePay").bind("click",core.subPayBtn); 	
	},
	subPayBtn: function(){
			var core=Core;
			//当用户使用兑票码时，提交时校验优惠券
			if(core.isUsingRC!=1){
				//校验优惠码
				var userFavText = $("#userFavText");	
				//校验优惠码
			
				if($("input:radio[name='use_radio'][checked]").val()==0){//使用我的优惠券
					if($("#userFavSel").val().trim() == "0000000000"){//如果用户勾选了"请选择"选项，则置空
						var favNum = "";
					}else{
						var favNum = $("#userFavSel").val().trim().replace(/[^a-zA-z0-9]/g,'');	
					}
				}else if($("input:radio[name='use_radio'][checked]").val()==1){//手动输入优惠券
					if($("#userFavText").val().trim() == "输入十位优惠码"){//如用户没有输入优惠码则不提交到后台
						var favNum ="";
					}else{
						var favNum = $("#userFavText").val().trim().replace(/[^a-zA-z0-9]/g,'');
					}
				}else{
					var favNum ="";	
				}
				
				
				if(!$("#coupon_num").is(":hidden") && favNum && (!/^[a-zA-z\d]{10}$/g.test(favNum) || $("#code").data("flag") != 1) && favNum!="0000000000"){
					core.showFavTextErr(2);
					$.dialog({
						title : "网易电影",
						width : 496,
						button:["*确定"],
						content: '<div class="mDialog selDialog"><h2><b></b>' + '优惠码错误，请重新输入十位优惠码！' + '</h2></div>'
					}, function(){
						$("#onShowTR").closest("table")[0].scrollIntoView();
						//userFavText.flash();
						return false;
					});
					return false;
				}	
				$("#code").val(favNum)
				if($("#coupon_num").is(":hidden") && $("#code")[0]){
					$("#code").val("")
				}	
			}
			//倒计时结束，不可提交表单
			if($(".timer")[0] && $(".timer").data("timer_flag") == 1){
				console.log("时间到")
				core.showDialogCom(0,'<div class="mDialog selDialog"><h2><b></b>对不起，订单已超时！</h2><br /><a href="checkjsp" class="btn_orange" style="margin-left:150px">重新选座</a></div>');
				$(".iDialogClose").remove();
				return false;
			}
			if(!core.easyNav.isLogin()){
				core.login();
				return false;
			}
			$("#payForm").submit(); 	
			//标记用户是否已经去支付了，用来判断倒计时结束后是否弹层
			$(".timer").data("pay_flag",1);
			//使用兑票码时，如不需要用户支付，弹出兑票窗口及相关文案，跳转
			if(core.noPay){
				$.dialog({
						title : "",
						width : 500,
						button:[],
						css:"payDialog",
						content:'<div class="payMeg"><h2>兑票</h2><div class="main"><strong>您可以根据您的兑票情况，选择相应操作：</strong></div><div class="btn"><input type="button" value="已成功兑票" id="nopay_btn_01"/><input type="button" value="兑票遇到问题" class="ml10" id="pay_btn_02"/></div></div>',
						beforeClose : function(){
							var displayGorderId=$("#displayGorderId").val().trim();
							
							window.location.href="http://order.mall.163.com"+Core.mailAppOrder+"/movie/list.html?gorderId="+displayGorderId;							
							
						}
				});	
			}else{
				//用户需要支付金额时，提示付款弹框，并根据是否已完成支付做不同跳转处理
				$.dialog({
						title : "",
						width : 500,
						button:[],
						css:"payDialog",
						content:'<div class="payMeg"><h2>付款</h2><div class="main"><strong>您可以根据您的付款情况，选择相应操作：</strong></div><div class="btn"><input type="button" value="已完成付款" id="pay_btn_01"/><input type="button" value="付款遇到问题" class="ml10" id="pay_btn_02"/></div></div>',
						beforeClose : function(){
							Core.payCloseHref();
						}
				});	
			}			
			
	},
	//关闭“付款”提示，向后台发送请求，根据返回用户是否支付成功做不同跳转
	payCloseHref: function(){
		var displayGorderId=$("#displayGorderId").val().trim();
		Core.post("/order/check_pay_result.html",{order_id:displayGorderId},function(err,rs){
			if(!err && rs){
				var core = Core;
				rs = core.parseJSON(rs);
				switch(+rs.retcode){
					case 200: //成功
						if(rs.isPayed){
							//用户已完成付款，跳转到用户的订单中心，所购买的订单需要开显示
							window.location.href="http://order.mall.163.com"+Core.mailAppOrder+"/movie/list.html?gorderId="+displayGorderId;
						}else{
							//用户没完成付款，则弹窗关闭，刷新页面，获取isFromOrderList标记状态，将使用优惠券部分置为不可用。
							window.location.reload();	
						}
						break;
					default:
						//用户没完成付款，则弹窗关闭，刷新页面，获取isFromOrderList标记状态，将使用优惠券部分置为不可用。
						window.location.reload();	
				}
			}
		});
	},
	/*倒计时结束后，请求后台，根据是否支付成功状态做不同处理
	  倒计时结束后，如用户已经支付成功，倒计时显示为00：00
	  如用户还未支付，或支付失败，刚提示订单超时
	*/
	// timerOverPost: function(){
	// 	var displayGorderId=$("#displayGorderId").val().trim();
	// 	Core.post("/order/check_pay_result.html",{order_id:displayGorderId},function(err,rs){
	// 		if(!err && rs){
	// 			var core = Core;
	// 			rs = core.parseJSON(rs);
	// 			switch(+rs.retcode){
	// 				case 200:
	// 					if(rs.isPayed){//支付成功,倒计时显示为00:00
	// 						return;
	// 					}else{
	// 						//支付失败，显示超时
	// 						$("#last").hide();
	// 						$("#invalid").show();
	// 					}
	// 					break;
	// 				default:
	// 					//失败，显示超时
	// 					$("#last").hide();
	// 					$("#invalid").show();
	// 			}
	// 		}
	// 	});
	// },
	// timerStar: function(cTime){
	// 	//利用时差倒计时：在倒计时开始的时候，保存一个剩余时间的变量，再保存一个当时的本地时间，然后每隔100毫秒，重复上述逻辑
	// 	//利用本地时间计算时间差，然后从剩余时间中减去这个时间差就行
	//
	// 	//由于前台需要在14分钟的时间内，完成15分钟(900次)的倒计时，unit取14000/15
	// 	var unit = 14000 / 15;
	// 	var lastTime = cTime*unit;//从后台取到倒计时时间，并转化为毫秒，注意*unit，而不是1000
	// 	var startTime = new Date();//获取起始时间
	// 	var cache = {};
	// 	var tMin=$("#min"),
	// 		tSec=$("#sec");
	// 	var timer_flag=0;//标记倒计时结束不可提交表单,0可提交，1不可提交
	//
	// 	var autoTimer=window.setInterval(
	// 		  function(){
	// 				var now = new Date();
	// 				var cost = now - startTime;
	// 				var t = lastTime - cost;
	// 				//检查缓存
	// 				var m = parseInt(t/60/unit);
	// 				var s = parseInt((t/unit)%60);
	//
	// 				if( m != cache.m)
	// 				{
	// 					cache.m = m;
	// 					//update dom
	// 					tMin.html(cache.m<10?("0"+cache.m):cache.m);
	// 				}
	// 				if(s != cache.s ){
	// 					cache.s = s;
	// 					//update dom
	// 					tSec.html(cache.s<10?("0"+cache.s):cache.s);
	// 				}
	// 				if(m==0 && s==0){//倒计时结束
	// 					clearInterval(autoTimer);
	// 					timer_flag=1;
	// 					/*倒计时结束后，如用户已经支付成功，倒计时显示为00：00
	// 					  如用户还未支付，或支付失败，刚提示订单超时
	// 					*/
	// 					if($(".timer").data("pay_flag") && $(".timer").data("pay_flag") == 1){//用户已经去支付了，倒计时结束，不再弹层提示，只根据是否支付成功对倒计时区域文案调整
	// 						Core.timerOverPost();
	// 					}else{
    //                         console.log("时间到1")
	// 						//支付失败，显示超时
	// 						$("#last").hide();
	// 						$("#invalid").show();
	// 						//用户没有点击支付，页面不会出现"付款"弹框，则可以弹层提示订单超时
	// 						Core.showDialogCom(0,'<div class="mDialog selDialog"><h2><b></b>对不起，订单已超时!</h2><br /><a href="check.jsp" class="btn_orange" style="margin-left:150px">重新选座</a></div>');
	// 						$(".iDialogClose").remove();
	// 					}
	// 				}
	// 				$(".timer").data("timer_flag",timer_flag);
	// 		  }, 100);
	// },
	//供十元优惠活动 页面调用
	showDialog: function(content){
		var ops = {
					title : "",
					width : 496,
					button:["*原价支付","换新号码"],
					//content: "<p style='padding:10px 20px;'>" + content + "</p>"
					content:'<div class="mDialog selDialog"><h2><b></b>' + content + '</h2></div>',
					check: Core.diaClose
				};
		return $.dialog(ops);
	},
	diaClose: function(i){
		if(i==0){	
			window.location.href = Core.mailApp+"/order/seat.html?ticket_id=" + $("#productId").val() + "&order_id=" + $("#order_id").val()+"&seatArea=1";	
		}
	},
	//弹框
	showDialogCom:function(showBtn,content){
		if(showBtn==0){
			$.dialog({
				title : "",
				width : 500,
				button:[],
				css : "codeDialog",
				content:content,
				beforeClose: function(){
					Core.hideSelect();
				}
			})
		}else if(showBtn==1){
			$.dialog({
				title : "",
				width : 500,
				button:["*确定"],
				css : "codeDialog",
				content:content,
				beforeClose: function(){
					Core.hideSelect();
				}
			})
		}else if(showBtn==2){			
			$.dialog({
				title : "",
				width : 500,
				button:[],
				css : "codeDialog",
				content:content,
				animate : 0,
				beforeClose: function(){
					Core.hideSelect();
				}
			})
			
		}
	},
	//ie6下隐藏select
	hideSelect: function(){		
		if($.isIE6 && $("#userFavSel")[0]){
			var userFavSel=$("#userFavSel");
			userFavSel.css("visibility","visible");
		}	
	}
});
})(window,jQuery,Core);