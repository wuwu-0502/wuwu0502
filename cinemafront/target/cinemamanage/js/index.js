/*
 * 首页js
 */
(function(window,$,Core){

$.extend(Core, {
	//初始化加载
	quickInit: function(){
		//ipad等设备上如果没有MP4播放路径则删除预览按钮
		if($.isIos){
			var pvbar = $(".playBar");
			pvbar.each(function(i){
				var obj = $(this);
				if(!obj.attr("ipvurl")){
					obj.remove();
				}
			});
		}
		//剧照轮播效果
		$.imgScroll({
			autoScroll:true,
			imgBigList:$('#slideBox'),
			barList:$('#icon_num3')
		});
		
		//首页头部提示
		/*if($("#indexTip")[0]){
			//首次打开显示，再打开不再显示
			if( $.cookie('indexTipShow')){				
				$("#indexTip").hide();				
			}else{
				$("#indexTip").show();
				$.cookie('indexTipShow','1',{'expires':365,'path':'/','domain':'piao.163.com'});//过期时间一年	
			}
			//关闭提示框
			$("#indexTip b").click(function(){
				$("#indexTip").hide();
			})
		}*/
	},
	//入口函数
	myInit : function(){
		var core=this;		
		
		//从其他站点链接到电影票主站时（126邮箱）
		var urlTab=$.getHashPara('tab');
		if(urlTab == 'coming'){//显示即将上映
			$('#tab_play').find('li:first').get(0).className='hotOff';
			$('#tab_play').find('li:last').get(0).className='soonOn';
			
			$('#playLists').addClass('hide');
			$('#soonOnSort').removeClass('hide');
			$('#cplayLists').removeClass('hide');
		}
		
		//查看预告片
		$("#playListBox").delegate('.playBar','click',function(){
			core.view($.isIos ? this.getAttribute("ipvurl") : this.getAttribute("pvurl"));	
		});
		//即将上映排序切换
		$('#soonOnSort').click(function(e){
		  	var e=window.event||e;
		  	var target=e.target||e.srcElement;
			if(target.tagName.toLowerCase()=='a'){
				$(this).find('a').removeClass('red');
				$(target).addClass('red');
				core.getSoonOnList($(target).attr('sortType'));				
			}
		});
		
		//想看按钮事件
		$("#playListBox").delegate('.want_see','click',function(){
			Core.wantToSee($(this));
		});
		
		$("li","#tab_play").click(this.mvTabSwitch);
		//初始化想看事件
		this.initEmlEvent();
		
		//兑换码入口 todo:
		$('#redeemCodeEntryBtn').click(function(){			
			//检查是否需要打开登录窗
			if(core.easyNav.isLogin(true)){
			  	core.redeemCodeDialog();
				//core.getCodeSubminted();
			}else{
				core.login();	
			}
		});
		//重写title		
		if($.browser.msie && $("#vtit")[0]){
			var title=$("#vtit").val();
			document.title=title;
			setInterval(function(){	document.title=title;},	1000);
		};	
	},
	//电影tab切换
	mvTabSwitch: function(){
		var obj = $(this), attr = obj.attr("rel"), sibLi = obj.siblings("li"),soonOnSort=$(".soonOnSort");
		if(obj.hasClass("hotOn") || obj.hasClass("soonOn")) return;
		if(attr == "#playLists"){
			obj[0].className = "hotOn";	
			sibLi[0].className = "soonOff";
			soonOnSort.addClass('hide');
		}else{
			obj[0].className = "soonOn";	
			sibLi[0].className = "hotOff";	
			soonOnSort.removeClass('hide');
		}
		$(attr).removeClass('hide');
		$(sibLi.attr("rel")).addClass('hide');
	},
	//即将上映电影列表 排序方式sortType ：排序方式 1为默认 2 为按热度 3为 按上映日期
	getSoonOnList:function(sortType){
		Core.post("/movie/upComing.html",{'sortType':sortType},function(err,rs){
			var box=$('#cplayLists');
			if(!err && rs){
				box && box.length && box.replaceWith(rs);	
			}
			$('#cplayLists').removeClass('hide');
		});
	}
});

})(window,jQuery,Core);