/*
 * 影院模块详情页js
 */
(function(window,$,Core){

$.extend(Core, {
	//入口函数
	myInit : function(){
		var core=this;
		//定位到排期tab
		var hashPq = $.getHashPara("pq");	
		if(hashPq && $("#pq")[0]){ 
			$(document).scrollTop($("#pq").offset().top);	
		}
		
		//收藏		
		$('#collect_cinema').click(function(){
			core.doCollect(this);
		});
		// 影院信息纠错	
		$('#feedback_cinema').click(function(){
			core.doFeedback();
		});
		
		//点击 “更多信息、查看更多”,影院介绍,取票机信息,特色信息,优惠信息等定位
		$('.commentSub').click(function(e){
			var target=e.target||e.srcElement,a=$(target).closest('a');
			if(a.length){
				mvTab.find('li').last().addClass('active')
										.siblings().removeClass('active');
				$('#subPart2').css({'display':'block'});
				$('#subPart1').css({'display':'none'});
			}
		});
		//点击底部介绍中"在线选座"
		$('.seatSub').click(function(e){
			var target=e.target||e.srcElement,a=$(target).closest('a');
			if(a.length){
				mvTab.find('li').eq(0).addClass('active')
										.siblings().removeClass('active');
				$('#subPart2').css({'display':'none'});
				$('#subPart1').css({'display':'block'});
			}
		});
		//相关影院
		core.showAboutCinema();			
		//显示缩略地图
		core.showSmallMap();	

		//团购和优惠券处事件
		core.initGroupCoupon();
		
		
		//在线选座和影院详情 tab切换
		var mvTab=$("#mvTabs");
		mvTab.find('li').click(core.subTabClick);
		core.tabTop = mvTab.offset().top;//记录 影院排期和剧情tab的 offseTop
		core.mvTab=mvTab;
		$(window).scroll(core.setPosition);//影院排期和剧情tab 悬浮定位
		
		
		core.bindEvent();//在线选座部分事件 
		
		//近期热映电影
		$('body').delegate('#photo_list_recent','click',function(e){
			var target=e.target||e.srcElement,
				li=$(target).closest('li');
			if(li.length){
				li.addClass('active')
					.siblings().removeClass('active');
					
				$('.recentMovie').find('dl').eq(li.index()).removeClass('hide')
															  .siblings('dl').addClass('hide');
			}
			
		});
	},
	//相关影院
	showAboutCinema: function(){
		var relCinemaBox=$(".relCinemaBox"),
			relCinema=$(".relCinema"),
			boxH=relCinemaBox.height(),
			contH=relCinema.height(),
			relCinemaBar=$(".relTitle").find(".relCinemaBar"),
			isShow=relCinemaBar.attr("data-show");

		if(contH > boxH){
			relCinemaBar.removeClass("hide");
		}
		relCinemaBar.click(function(){
			if(!isShow){
				isShow=1;
				$(this).html("展开>>");
				relCinemaBox.removeClass("relCinemaShow");
			}else{
				isShow=0;
				$(this).html("收起>>");
				relCinemaBox.addClass("relCinemaShow");				
			}
		})
	},
	//收藏
	doCollect:function(obj){
		var core=Core,btn=$(obj);
		if(!core.easyNav.isLogin(true)){
			core.login();
			return;
		}
		if(btn.hasClass('collected')){//已收藏
			core.post('/com.cinema/cellectCancel.html',{'cinema_id':btn.parent().attr('cid')},function(err,rs){
				if(!err){rs=core.parseJSON(rs);
					if(+rs.retcode == 200){
						btn.text('收藏').removeClass('collected');
					}else if(+rs.retcode == 464){//未登录
						if(!core.easyNav.isLogin(true)){
							core.login();
							return;
						}
					}else{//500 460
						alert('系统异常，请重试！');
					}
				}
			});			
		}else{//未收藏	
			core.post('/com.cinema/cellect.html',{'cinema_id':btn.parent().attr('cid'),'city':core.curCity.id},function(err,rs){
				if(!err){rs=core.parseJSON(rs);
					if(+rs.retcode == 200){
						btn.text('已收藏').addClass('collected');
					}else if(+rs.retcode == 464){//未登录
						if(!core.easyNav.isLogin(true)){
							core.login();
							return;
						}
					}else{//500 460
						alert('系统异常，请重试！');
					}
				}
			});			
		}
	},
	//影院信息纠错 todo:
	doFeedback:function(){
		var feedbackDialogHTML = $([
				'<div class="commDialog feedbackDialog">',
					'<a href="javascript:;" class="close"></a>',
				    '<p id="typeTab" class="dialogTitle">影院信息纠错</p>',
					'<div class="feedback">',
						'<p class="title">',$('.cinemaInfo').find('.mv_name').attr('title'),'</p>',
						'<ul class="feedbackLevel clearfix"><li><input id="c5" type="checkbox" value="5" name="checklevel"><label for="r5" class="levelFace"><span>名称错误</span></label></li><li><input id="c4" type="checkbox" value="4" name="checklevel"><label for="r4" class="levelFace"><span>地址错误</span></label></li><li><input id="c3" type="checkbox" value="3" name="checklevel"><label for="r3" class="levelFace"><span>电话错误</span></label></li><li><input id="c2" type="checkbox" value="2" name="checklevel"><label for="r2" class="levelFace"><span>优惠错误</span></label></li><li class="last"><input id="c1" type="checkbox" value="1" name="checklevel"><label for="r1" class="levelFace"><span>其他错误</span></label></li></ul>',
						'<textarea class="comm_area textGray" rows="" cols="" name="message">帮助我们提供一下正确信息吧~</textarea>',
						'<div class="note"><a rel="1" class="sub" href="javascript:;">提交</a><span class="err hide2">请输入错误信息内容！</span></div></div>',
				'</div>'].join(""));
		$.dialog();
		$.dialog({
			title : "",
			content : feedbackDialogHTML.get(0),
			width : 0,
			animate : 0,
			button : [],
			init : function(){
				$('.iDialogClose').remove();//移除弹框右上角的默认关闭按钮
				var core=Core,
					cmt=$('.commDialog',this);
					
				//弹框 关闭按钮
				cmt.find('>.close').click(function(){
					$.dialog();	
				});
				cmt.find('.comm_area').focus(function(){
					if(this.value == '帮助我们提供一下正确信息吧~'){
						this.value='';
					}
					$(this).removeClass('textGray');
				}).blur(function(){
					if(!this.value){
						this.value = '帮助我们提供一下正确信息吧~';
						$(this).addClass('textGray');
					}	
				});
				//提交
				cmt.find('.sub').click(function(){
					var core=Core,
						name=cmt.find('.title').text(),
						quesType='',content=cmt.find('.comm_area').val(),
						err = cmt.find('.err');
					if(!content || content == '帮助我们提供一下正确信息吧~'){
						err.removeClass('hide2');
						return false;
					}
					err.addClass('hide2');
					cmt.find(':checkbox').each(function(k,v){
						if(this.checked){
							quesType+=';'+$(this).next().text();
						}	
					});
					if(!!quesType){
						quesType = quesType.substr(1);
					}
					$.dialog();
					core.post('/com.cinema/submitCinemaCorrect.html',{'content':content,'name':name,'quesType':quesType},function(err,rs){
						//err=0,rs='{"retcode":"200"}';
						if(!err){rs=core.parseJSON(rs);
							if(+rs.retcode == 200){
								core.showDialogFunc({'content':'<div class="commDialog_result feedbackDialog_result"><a class="closeBtn closePop" href="javascript:;"></a><b></b><h3>感谢您提供的信息！</h3><a href="javascript:;" class="btn closePop">确认</a></div>','width':'','init':function(){								
									$('.iDialogClose').remove();//移除弹框右上角关闭按钮
									$('.closePop,this').click(function(){$.dialog()});		
								}});
							}else{//500：服务器异常
								$.dialog();
							}
						}
					});					
				});

			}
		});
	},
	
	//排期和剧情tab浮动定位
	setPosition: function(){
		var core=Core,curTop = (document.documentElement.scrollTop || document.body.scrollTop);
		if(curTop > core.tabTop){
			core.mvTab.addClass("tab_fixed");	
		}else{
			core.mvTab.removeClass("tab_fixed");
		}
	},	
	//团购和优惠券处事件
	initGroupCoupon:function(){
		//团购和优惠券 更多/收起按钮
		var groupCoupon = $('.groupCoupon'),
			boxs=groupCoupon.find('.boxs'),
			moreBtn=groupCoupon.find('.moreBtn'),
			couponHelp=groupCoupon.find('.couponHelp');
		if(moreBtn.length){
			moreBtn.click(function(){
				var groupCoupon = $(this).parent();
				if(groupCoupon.hasClass('groupCoupon_showMore')){//收起
					$(this).html('更多&nbsp;&nbsp;&nbsp;&nbsp;<i></i>');					
					groupCoupon.removeClass('groupCoupon_showMore');

					boxs.height(82);
				}else{//展开
					$(this).html('收起&nbsp;&nbsp;&nbsp;&nbsp;<i></i>');
					groupCoupon.addClass('groupCoupon_showMore');
					
					boxs.find('.box').removeClass('hide');
					boxs.height(82*(Math.ceil(parseInt(groupCoupon.attr('t'))/2))+2);
					
				}
			});
		}
		//优惠券使用说明 tips
		if(couponHelp.length){
			couponHelp.hover(function(e){
				var target = e.target || e.srcElement,
					partnerId=$(this).attr("partnerId") || 0,
					cinemaId=$(this).attr("cid") || 0,
					couponIntro=groupCoupon.find('.couponIntro'),
					box = $(target).closest('.box'),
					index=box.index(),
					left=0,
					i_left=$(this).position().left + 71;//小箭头的left，71:名称到左边框的距离
					
				if(index % 2 == 1){//为右边一列
					left=212;
					i_left += 373;//373:一个box的宽度
				}
				//只有一个box时
				if($(".box").length ==1){
					if($(this).position().left > 272){
						left=212;
					}
					i_left = $(this).position().left + 71;
				}	

				//通过offset().top算出couponIntro的bottom值,不可用 $(this).position().top，取的是相对前一个relative的值

				
				var baseBot=$(".boxWrap").offset().top+$(".boxWrap").height()-$(this).offset().top;	
				couponIntro.css({'bottom':(baseBot+10)+'px','left':left+'px'}).removeClass('hide')
																	.find('i').css({'left':(i_left - left)+'px'});
				e.stopPropagation();
			},function(e){
				var target = e.target || e.srcElement;
				groupCoupon.find('.couponIntro').addClass('hide');
				e.stopPropagation();
			});
		}	
	},

	//在线选座部分事件
	bindEvent:function(){		
		//详情页面表格鼠标滑过的效果 
		$("body").delegate(".movieTbodyAct tr", "mouseenter", function(){
			$(this).addClass("active");
		}).delegate(".movieTbodyAct tr", "mouseleave", function(){
			$(this).removeClass("active");
		})
		//点击日期、影片
	    $("#mainContent").delegate(".dataList", "click", this.filterData)
						.delegate("#dmspan","click",this.dmFilterClick) //绑定表头版本点击事件
						.delegate(".btn_pre","click",function(){//查看预告片	
							Core.view(this.getAttribute("pvurl"));	
						}) 
						.delegate('.moreDate','click',function(){//日期  more
							if($(this).hasClass('moreDate')){
								//放映排期日期  more
								var date=$(this).parent();
								if($(this).hasClass('on')){
									date.css({"height":"34px"});
									$(this).removeClass('on')
											.find('i').removeClass('triangleToUp');
								}else{
									var liCount=date.find('li').length,
										rows=Math.ceil(liCount/4);				
									date.css({"height":rows * 34 +'px'});
									$(this).addClass('on')
											.find('i').addClass('triangleToUp');
								}
								return false;
							}
						})
						
		
		//绑定加载场次座位缩略图 开始--------------------------------------------------------------
		//绑定加载场次座位缩略图---再试一次
		$('body').delegate('.tryAgain','click',function(){
			var core=Core,obj = $(this).closest(".hallWrap"),ticketId=obj.attr('tId'),loadSecTimes=core.loadSecTimes;
			if(!loadSecTimes[ticketId] || (!!loadSecTimes[ticketId] && loadSecTimes[ticketId] < 4)){
				core.loadSec(obj,ticketId);
			}else{
				obj.find(".hallTip").html('<i></i><div class="load_text seat_box" seatLoad="false">还是加载失败<br />看看其他时间吧</div>');	
			}
		});
		//鼠标放在座位图上时，不消失，以便用户可以点击"再试一次"		
		$("body").delegate(".hallTip", "mouseenter", function(){
			$(this).show();	
		}).delegate(".hallTip", "mouseleave", function(){
			$(this).hide();
		});
		//鼠标放在座位图上时，不消失，以便用户可以点击"再试一次"		
		$("body").delegate(".hallBar", "mouseenter", function(){
			var core = Core, obj = $(this).closest('.hallWrap'),ticketId=obj.attr('tId'),loadSecTimes=core.loadSecTimes;
				if(!obj.data("isLoad")){//首次加载或加载失败
					if(!loadSecTimes[ticketId] || (!!loadSecTimes[ticketId] && loadSecTimes[ticketId] < 4)){
						core.loadSec(obj,ticketId);	
					}else{
						obj.find(".hallTip").show().html('<i></i><div class="load_text seat_box" seatLoad="false">还是加载失败<br />看看其他时间吧</div>');
					}
				}else{//已经加载成功，下次不需再请求，直接显示成功结果
					obj.find(".hallTip").show();	
				}	
		}).delegate(".hallBar", "mouseleave", function(){
			var core = Core, obj = $(this).closest('.hallWrap');
			obj.find(".hallTip").hide();	
		})	
		//绑定加载场次座位缩略图 结束---------------------------------------------------------
	},
	//postData: null, //存放post数据 页面初始化时赋值
	filterData: function(e){
		var core = Core, postData = core.postData ,
			obj = $(e.target), li = obj.closest("li"), pid = obj.attr("pid"), 
			ulId = li.closest("ul").attr("id"),
			isSchedule = li.closest("ul").attr("t");//如果有值，则为影院排期
			
		!!li.length && li.find('a').blur();//避免有虚线框
		
		if(!li.length || li.hasClass("active") || !ulId) return;
		li.siblings(".active").removeClass("active");
		li.addClass("active");
		
		ulId = ulId.trim();
		if(ulId == "timeTabs"){ //日期选择		
			postData.by = "date";
			if(isSchedule){//显示影院排期时，点击日期列表
				core.getFilms(li.attr('day'));
				return;
			}
		}else if(ulId == "photo_list"){ //电影选择
			postData.by = "movie";
		}
		core.resetPostData();
		
		if(ulId=='rightTab'){
			postData.by = "movie";
			postData.target = 'rightTab';
			core.postData.movieId=li.find('a').attr('pid');
			
		}
		if(!postData.by) return;
		
		core.getPost();
		
		e.stopPropagation();
	},
	//重置参数传递
	resetPostData: function(){
		$.extend(this.postData,{
			date: $(".active","#timeTabs").attr("day"),
			movieId: $(".active","#photo_list").find("a").attr("pid")
		});
	},
	//ajax获取数据
	getPost: function(){
		var core = Core,box,loadingPanel,
			url='/com.cinema/schedule.html';
		switch(core.postData.by){
			case "tab": //选座和兑换券tab
				box = $("#today");
				break;
			case "date": //日期选择
				box = $("#dateContent");
				loadingPanel = core.loadingPanel({'renderTo':box});//初始化loading层
				break;
			case "movie": //电影选择
				box = $("#movieContent");
				if(this.postData.target == 'rightTab'){
					this.postData.target='';
					loadingPanel = core.loadingPanel({'renderTo':$("#dateContent")});
				}else{
					loadingPanel = core.loadingPanel({'renderTo':box});;
				}	
				break;
		}
		core.post(url, this.postData, function(err,rs){
			!!loadingPanel && loadingPanel.clear();//移除loading层
			if(!err && rs){
				var postData = core.postData, type = postData.by;
				if(type == 'movie'){
					if($('#rightTab').find('li:last').hasClass('active')){
						$('.c_detail_poster').fadeOut('fast');	
					}
					//淡出 淡入
					box.length && box.fadeOut("fast",function(){
						box.replaceWith(rs);
						$("#movieContent").fadeIn("slow");//200ms
						var dPoster = $('.c_detail_poster'),bList=$('#photo_list'),len=bList.find('li').length;
						
						if($('#rightTab').find('li:first').hasClass('active') && dPoster.css('display')=='none'){
							dPoster.addClass('noLeft').removeClass('noRight');
							bList.find('li').removeClass('active').first().addClass('active');
							bList.css({'left':0}).attr('curPage','1');
							if(len <= 6){
								dPoster.addClass('noRight');
							}								
							dPoster.fadeIn('slow');	
						}
					}); 
				}else{
					box.length && box.replaceWith(rs);
				}
			}
		}, "@getList");
	},
	//获取放映排期信息
	getFilms:function(showDate){
		var core=this;
		core.post('/com.cinema/schedule2.html',{"city":core.postData.city,"cinemaId":core.postData.cinemaId,"date":showDate},function(err,rs){
			if(!err && rs){
				$('#filmInfos').replaceWith(rs);
			}	
		});	
	},
	//在线选座和影院详情tab切换事件
	subTabClick: function(e){
		var obj =  $(e.target).closest("li"),core = Core, movieInfo = $("#movieInfo"), rel = obj.attr("rel"),
			postData = core.postData,buySeat,buyCoupon;
			
		if(!obj[0] || obj.hasClass("active")) return;
		obj.siblings().removeClass("active");
		obj.addClass("active");
		if(rel == "#subPart1"){
			//统计影院详情页面，在线选座点击次数
			buySeat='http://piao.163.com/com.cinema/'+postData.cinemaId+'.html?buyseat';
			neteaseTracker(true,buySeat,"在线选座",null);
			$("#subPart2").hide();
		}else{
			//统计影院详情页面，兑换券点击次数
			buyCoupon='http://piao.163.com/com.cinema/'+postData.cinemaId+'.html?buycoupon';
			neteaseTracker(true,buyCoupon,"兑换券",null);
			$("#subPart1").hide();
		}
		$(rel).show();
		window.setTimeout(function(){
			core.setPosition(); /*ie下切换时如果其中一个tab长度不够，tab回不到原来的位置 ie6下如果不加延时回不到原来的位置*/
		},10);	
	},
	//初始化缩略地图
	showSmallMap:function(){
		var core=Core,
			map = new BMap.Map("mapDiv",{enableDragging:false,defaultCursor:'pointer'}),//创建地图
			point=new BMap.Point(parseFloat(core.coord.split(',')[0]),parseFloat(core.coord.split(',')[1]));//创建坐标点
		map.centerAndZoom(point, 15);//设置地图中心坐标		
		map.disableDoubleClickZoom();//禁止鼠标双击放大地图
		
		var marker = new BMap.Marker(point);  // 创建标注
		//地图点击事件监听
		map.addEventListener("click", function(e){
	    });
		map.addOverlay(marker);//将标注添加到地图中  
		
		$('.seeBig').click(function(){
			//获取影院信息，展示地图
			Core.cinemaMapDialog(core.postData.cinemaId);			
		});
	},
	
	//绑定加载场次座位缩略图 开始
	loadSecTimes:{},
	loadSec : function(obj,ticketId){
		var core=Core,loadSecTimes=core.loadSecTimes;
		if(!loadSecTimes[ticketId]){
			loadSecTimes[ticketId]=0;	
		}
		obj.find(".hallTip").html('<i></i><div class="load_text seat_box" seatLoad="false"><img src="'+Core.cdnBaseUrl+'/images/detail/loading2.gif?v=20130629" width="20" height="20" alt="" /><div>加载中</div></div>').show();
		core.get("/order/seatPreview.html",{ticket_id:ticketId},function(err, rs){
			if(!err && rs){//请求成功
					var hallTip=obj.find(".hallTip");
					hallTip.html("<i></i>"+rs);
					var seatBox=obj.find(".seat_box"),seatLoad=seatBox.attr("seatLoad");
					//场次已放映，不再加载
					if(seatLoad=="over"){
						obj.data("isLoad", true);
						loadSecTimes[ticketId]=3;
					}else if(seatLoad=="error"){//出错，点击再试一次重新加载，最多三次机会
						obj.data("isLoad", false);
						loadSecTimes[ticketId]++;
						if(loadSecTimes[ticketId] > 3){
							hallTip.html('<i></i><div class="load_text seat_box" seatLoad="false">还是加载失败<br />看看其他时间吧</div>');	
						}
					}else if(seatLoad=="success"){//加载成功，根据场次大小显示
						var w,h,ml,mt;
						obj.data("isLoad", true);
						w=parseFloat(seatBox.css("width"))+20;//20是内边距
						h=parseFloat(seatBox.css("height"))+20;
						ml=parseFloat(w-66)/2*(-1);
						mt=parseFloat(h)*(-1);
						hallTip.css({"width" : w+"px","height" : h+"px","margin-left" : ml+"px","margin-top" : mt+"px"});
					}	
			}else{//请求失败
				obj.data("isLoad", false);
				var i=loadSecTimes[ticketId];
				if(i < 4){
					obj.find(".hallTip").html('<i></i><div class="load_text seat_box" seatLoad="error">加载失败，<a href="javascript:;"  class="tryAgain imp">再试一次</a></div>');
					loadSecTimes[ticketId]=++i;
				}else{
					obj.find(".hallTip").html('<i></i><div class="load_text seat_box" seatLoad="false">还是加载失败<br />看看其他时间吧</div>');	
				}
			}
		});	
	}
	//绑定加载场次座位缩略图 结束
})

})(window,jQuery,Core);