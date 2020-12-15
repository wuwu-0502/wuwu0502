/*
 * 首页详情页js
 * 注： 当前城市模块 城市id：myCity ，自定义属性pid为城市id
 * edit by jiangyunbao  at  2012-10-26
 * 2012-11-30 号地区选择时修改影院显示高度
 * 2012-12-05 增加日期切换时记忆最后一次点击的影院
 * 2012-12-13 增加影评 id: #moreLcommt moreScommt  long_up
 * 2012-12-23 增加影讯和兑换券
 * 2012-12-27 改边页面内容获取方式，由后台生成不同的html插入相应位置
 * 2013-01-29 由于云图活动ajax请求地址不一样，增加Core.scheduleUrl, 如果页面有这个变量ajax就取这个变量，否则就取默认的
 */
(function(window,$,Core){
$.extend(Core, {	
	//入口函数
	myInit: function(){
		//主演高度控制
		if($("#roleList")[0]){
			if($("#roleList").innerHeight() >= 50){
				$("#role").css({"height":"50px","overflow":"hidden"})	
			}else{
				$("#role").css({"height":"auto"})	
			}
		}		
		var core=Core, hashPq = $.getHashPara("pq"), tab = $.getHashPara("tab"),		
			wantSeeBtn = $("#wantSeeBtn"),//即将上映时的 想看按钮
			mvTab=$("#mvTabs"),//影院排期和剧情tab
			commentTab = $("#commentTab"),//剧情&影评tab
			hallShow=$(".hallShow");//加载场次小图标
				
		//定位到排期tabg
		if(hashPq && $("#pq")[0]){ 
			$(document).scrollTop($("#pq").offset().top);	
		}
		
		//影片分享按钮
		$('#share').hover(function(){
			$(this).find('.share_inner').addClass('on');	
		},function(){
			$(this).find('.share_inner').removeClass('on');		
		});
		Share.iconShare($('#shareDiv').get(0));
		//Share.iconShare($('#shareDiv').get(0),$.format('分享《{name}》：{highlight} ',{name:core.movieInfo.name,highlight:core.movieInfo.highlight}),document.URL,core.movieInfo.logo);
		
		//绑定正在上映界面的事件
		core.bindHotEvent();
		
		//重写title		
		//if($.isIE678 && $("#vtit")[0]){
		if($.browser.msie && $("#vtit")[0]){
			var title=$("#vtit").val();			
			document.title=title;
			setInterval(function(){	document.title=title;},	1000);
		};	
		
		//绑定加载场次座位缩略图 初始化
		core.hollShowInit();		
		
		mvTab.bindTab("click"); //影院排期和剧情tab切换
		core.tabTop = mvTab.offset().top;//记录 影院排期和剧情tab的 offseTop
		core.mvTab=mvTab;
		$(window).scroll(core.setPosition);//影院排期和剧情tab 悬浮定位
		
		/*影片详情页 tab数超过1时 才用click事件*/	
		if(mvTab.find('li').length > 1 ){
			commentTab.click(core.commentTabClick);//剧情&影评tab点击事件
			/*定位到剧情&影评tab*/	
			if(tab == "comment"){
				commentTab.click();	
			}
		}else{
		  //查看全文
		  core.showCommentContent($("#lCommentList").find(".detail"));
		  //评论相关事件 初始化
		  core.bindCommentEv();	
		}
		
		//想看按钮点击事件
		if(wantSeeBtn.length){
			wantSeeBtn.click(function(){
				core.wantToSee($(this));
			});
			core.initEmlEvent();
		}
		
		//预告片
		if($("#mvPlayer")[0]){
			var playUrl=$("#mvPlayer").attr("purl");
			var coverPicUrl=$.getParaFromString(playUrl,"coverpic");
			if(coverPicUrl){//purl中有图片地址
				var img = new Image(),w,h;
					maxWidth=parseInt($("#mvPlayer").css("width")),
					maxHeight=parseInt($("#mvPlayer").css("height"));
				
				img.onload = function(){
					w = img.width, h = img.height;				
					if(w > maxWidth){
						w = maxWidth;
						h = w * img.height / img.width;
					}
					if(h > maxHeight){
						h = maxHeight;
						w = h * img.width / img.height;
					}	
					$("#mvPlayer #coverPic").attr("src",coverPicUrl).css({"width":w+"px","height":h+"px"});
					img = null;
				}
				img.src = coverPicUrl;	
			}
			
			//查看预告片
			$("#mvPlayer").click(function(){
				core.view($.isIos ? this.getAttribute("ipurl") : this.getAttribute("purl"));	
			});
		}
		/*测试加载影评，应该在“剧情影评”tab里加载
		//core.getCommt();
		//加载更多影评
		$("#moreScommt").click(function(){
			core.getCommt();
		})
		//展示评论大图
		core.imgObj={};			
		core.showBigPoster();*/
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
	//绑定加载场次座位缩略图 初始化
	hollShowInit:function(){
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
	},
	//绑定加载场次座位缩略图 
	loadSecTimes:{},
	loadSec : function(obj,ticketId){
		var core=Core,loadSecTimes=core.loadSecTimes,hallTip=$();
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
					ml=parseFloat(w-70)/2*(-1);
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
	},	
	//绑定正在上映界面的事件
 	bindHotEvent: function(){	
		var core = Core,part2 = $("#part2");
		
		
		//页面第一次加载时，如果当前被选中的日期有低价影院，则区域处显示‘低价影院’（低价影院日期不包括今天）
		var low = $('#timeTabs').find('>.active >.low');
		if(low.length){
			$('#district_areaList').find('li:last-child').removeClass('hide');
		}
		//----------------------------------------------
		
		$(document).click(function(e){
			var target = e.target || e.srcElement,
				div=$(target).closest('#all_type_box'),
				span=$(target).closest('.sel_cinema_left');	
			if(div.length <= 0 && span.length <= 0){
				$('#all_type_box').addClass('hide');
				$('#all_cinema').find('.sel_cinema_left > i').removeClass('triangleToUp');
			}
		});
		//日期列表点击事件  
		part2.delegate('#timeTabs','click',core.timeTabsClick)			
		//区域点击事件(全部影院、常去影院、低价影院标签)
		.delegate('#district_areaList','click',function(e){
			var core=Core,
				target=e.target||e.srcElement,
				li=$(target).closest('li'),
				a=$(target).closest('.sel_cinema'),
				notesTip=$(target).closest('.notesTip');
			if(li.length && ((li.hasClass('all_cinema') && a.length) || !li.hasClass('all_cinema'))){
				if(li.attr("cType") && li.attr("cType")=="ALL"){
					//统计点击
					try{
						movieAllClick='http://piao.163.com/movieall.html';
						neteaseTracker(true,movieAllClick,"全部影院",null);
					}catch(e){}
				}
				//常去影院
				if(li.attr("cType") && li.attr("cType")=="Offen"){
					//统计点击
					try{
						offenClick='http://piao.163.com/movieofen.html';
						neteaseTracker(true,offenClick,"常去影院",null);
					}catch(e){}
				}
				//最低价
				if(li.attr("cType") && li.attr("cType")=="LowPrice"){
					//统计点击
					try{
						lowpriceClick='http://piao.163.com/moviecheap.html';
						neteaseTracker(true,lowpriceClick,"低价影院",null);
					}catch(e){}
				}	
									
				li.addClass('active')
					.siblings().removeClass('active');
				$('#cinema_search').addClass('textGray').val('快速搜索影院');//重置输入框
				
				core.by='district';
				core.getPost();	
							
			}else if(notesTip.length){//tips关闭
				var i=$(target).closest('.close');
				if(i.length){
					$.cookie('notesTipShow','1',{'expires':365,'path':'/','domain':'piao.163.com'});//过期时间一年	
		  			notesTip.remove();
		  			return false;
				}				
			}
		})

		//筛选点击事件, 显示浮层
		.delegate('#all_cinema > .sel_cinema_left','click',function(e){
			var i=$(this).find('i'),all_type_box = $('#all_type_box');
			if(all_type_box.hasClass('hide')){
				i.addClass('triangleToUp');
				all_type_box.removeClass('hide');
			}else{
				i.removeClass('triangleToUp');
				all_type_box.addClass('hide');
			}
			return false;//必须要阻止事件冒泡
		})
		//商圈、区域、地铁列表点击事件
		.delegate("#all_type_box", "click", function(e){
			var core=Core,
				target=e.srcElement || e.target,
				a=$(target).closest('a');
			if(!a.length) return;
			
			$('#all_cinema').find('.sel_cinema_left > i').removeClass('triangleToUp');
			$(this).addClass('hide');// 隐藏全部影院浮层	
			$(this).find('a').removeClass('active');
			if(!a.hasClass('close')){
				var all_cinema=$('#all_cinema');
				//将选中的"商圈、区域、地铁"的cType和typeId都标记到"#all_cinema"上
				all_cinema.attr('cType',a.closest('.type_module').attr('cType'));
				all_cinema.attr('typeId',a.attr('typeId'));
				all_cinema.addClass('active')
						.siblings().removeClass('active');
				all_cinema.find('.sel_cinema > span').text(a.find('span').text());//将选中的商圈、地铁、区域名称显示在全部电影处
									
				a.addClass('active');
				
				$('#cinema_search').addClass('textGray').val('快速搜索影院');//重置输入框
				
				core.by='district';
				core.getPost();	
			}
			return false;
		})		
		//影院搜索框相应事件绑定-----------------------------------------
		.delegate("#cinema_search", "click", function(e){
			var core=Core;
			$(this).removeClass('textGray');
			if(this.value == '快速搜索影院'){
				this.value='';
			}
			//逻辑：点击输入框时，先判断是否有搜索结果缓存，如果没有，则查询一次得到全部影院并缓存，然后keyup时再根据关键字过滤
			if(!core.cacheOfSearchCinemaList){
				core.toSearchCinema(1);//查询当前日期的 全部影院
			}else{
			  	core.filterSearchCinema(this,true);//过滤搜索结果
			}
		})
		.delegate("#cinema_search", "blur", function(e){
			if(this.value == ''){
				this.value='快速搜索影院';
				$(this).addClass('textGray');
			}
		})
		.delegate("#cinema_search", "keyup", function(e){
			var core=Core,
				cinema_search=$('#cinema_search'),
				cinema_search_list=$('#cinema_search_list'),
				lastOn=cinema_search_list.find('.on');
			switch(e.keyCode){
				case 38: //上
					if(!cinema_search_list.hasClass('hide')){
						if(lastOn.length && lastOn.prev().length){
							lastOn.removeClass('on');						
							lastOn = lastOn.prev().addClass('on');
							cinema_search.val(lastOn.text());
						}
					}
					break;
				case 40: //下
					if(!cinema_search_list.hasClass('hide')){
						if(lastOn.length){
							if(lastOn.next().length){
								lastOn.removeClass('on');
								lastOn = lastOn.next().addClass('on');
							}
						}else{
							lastOn = cinema_search_list.find('a').first().addClass('on');							
						}
						cinema_search.val(lastOn.text());
					}
					break;
				case 13: //回车
					//统计搜索
					try{
						buyKeyCode='http://piao.163.com/'+Core.curCity.spell+'/movie/'+Core.movieId+'.html#from=movie.enter'
						neteaseTracker(true,buyKeyCode,"影院搜索",null);
					}catch(e){}
					
					if(!cinema_search_list.hasClass('hide') && lastOn.length){
						this.value=lastOn.text();
					}
					$('#cinema_search_list').addClass('hide');
					core.showFilterResult(this.value);//回车 显示过滤的结果
					break;
				default:
					core.filterSearchCinema(this,true);//实时过滤搜索结果
					break;
			}	
		})
		//影院搜索框确定按钮 点击事件
		.delegate("#cinema_search_btn", "click", function(e){
			var core=Core;
			//统计搜索
			try{
				buyClick='http://piao.163.com/'+Core.curCity.spell+'/movie/'+Core.movieId+'.html#from=movie.enter'
				neteaseTracker(true,buyClick,"影院搜索",null);
			}catch(e){}
			if(!core.cacheOfSearchCinemaList){//没有缓存
				core.toSearchCinema(2);//查询当前日期的 全部影院
			}else{
				core.showFilterResult($("#cinema_search").val());//显示过滤的结果
			}
		})
		//影院搜索下拉列表 点击事件
		.delegate("#cinema_search_list", "mouseenter", function(e){
			$(this).removeClass('hide');
		})
		.delegate("#cinema_search_list", "mouseleave", function(e){
			$(this).addClass('hide');
		})
		.delegate("#cinema_search_list", "click", function(e){			
			var core=Core,target = e.srcElement || e.target,
				a=$(target).closest('a');
			if(a.length){
				$('#cinema_search').val(a.text());//给输入框赋值
				
				$('#district_areaList').find('li').removeClass('active');
				$('#areaContent').find('.mv_cinema_rs>.arrow').get(0).className='arrow arrow4';
								
				//分页区域更新
				var li=$($.format('<li cid="{id}"  isSeatSupportNow="{isSeatSupportNow}" class="active"><a href="javascript:;"><i class="sub"></i>{name}</a></li>',{name:a.text(),id:a.attr('cid'),isSeatSupportNow:a.attr('isSeatSupportNow')}));			
				$('#cinamaList').parent().attr('style','');
				$('#cinamaList').css('margin-top','0').html(li);
				$('#cinema_page').html('');
			
				$(this).addClass('hide');
				core.by='com.cinema';
				core.getPost({cinemaId:a.attr('cid'),cinemaType:'ALL'});	
			}			
		})
		.delegate("#cinema_search_list > a", "mouseenter", function(e){
			$(this).addClass('on');
		})
		.delegate("#cinema_search_list > a", "mouseleave", function(e){
			$(this).removeClass('on');
		})
		//影院搜索框相应事件绑定 end-----------------------------------------
		
		//影院列表点击事件 
		.delegate("#cinamaList", "click", core.cinemaListClick)
		//影院列表分页点击事件 
		.delegate("#cinema_page", "click", function(e){
			var target=e.srcElement || e.target,
				a=$(target).closest('a');
			if(a.length){
				var cinamaList=$('#cinamaList'),span=$(this).find('span'),arr=span.text().split('/'),
					pageIndex=+arr[0],//当前页码
					pageCount=+arr[1];//总页数
					
				if(a.hasClass('page_left')){//左翻按钮
					if(pageIndex <= 1)return;
					pageIndex--;
					if(pageIndex == 1){//第一页，禁用左翻按
						a.addClass('page_left_end');
					}
					a.next().removeClass('page_right_end');//点击左翻按钮后，右翻按钮可用
				}else{//右翻按钮
					if(pageIndex >= pageCount)return;
					pageIndex++;
					if(pageIndex == pageCount){//最后一页，禁用右翻按
						a.addClass('page_right_end');
					}
					a.prev().removeClass('page_left_end');//同理
				}
				span.text(pageIndex+'/'+pageCount);
				cinamaList.fadeOut('fast',function(){
					cinamaList.css('margin-top',-((pageIndex - 1) * 105)+'px');
					cinamaList.fadeIn('fast');
				});
			}
		})
		//在线选座和兑换券点击事件    
		.delegate("#mvSubTabs", "click", function(e){
			var core=Core;
			core.by='ticket';
		  	core.subTabClick(e);		  	
		})
		//绑定表头版本点击事件
		.delegate("#dmspan","click",core.dmFilterClick);
		
		$(document).click(function(e){
			var target=e.target||e.srcElement;
			//点击非搜索输入框和搜索列表的区域，搜索列表隐藏
			if($(target).attr('id') != 'cinema_search' && $(target).attr('id') != 'cinema_search_list'){
				$('#cinema_search_list').addClass('hide');
			}
		});
		core.overTable();//详情页面表格鼠标滑过的效
		
	},
	//日期列表点击事件
	timeTabsClick:function(e){
		var core=Core,target=e.target||e.srcElement,
			li=$(target).closest('li'),
			a=$(target).closest('a');
		if(li.length){//点击日期
			li.siblings('.active').removeClass('active');
			li.addClass('active');
			
			core.cacheOfSearchCinemaList=null;//情况搜索影院的缓存
			core.by='date';
			core.getPost();
		}else if(a.length){//更多按钮
			var dateList=$(this),i=a.find('i');
			if(i.hasClass('triangleToUp')){
				dateList.css({"height":"30px"});
				i.removeClass('triangleToUp');
			}else{				
				dateList.css({"height":"auto"});
				i.addClass('triangleToUp'); 
			}
		}
	},	
	//影院列表点击事件
	cinemaListClick:function(e){
		var core=Core,target=e.target||e.srcElement,
		li=$(target).closest('li'),
		refreshBtn=$(target).closest('.refresh');
		if(li.length){
			li.siblings('.active').removeClass('active');
			li.addClass('active');
			
			core.by='com.cinema';
		  	core.getPost();	
		}else if(refreshBtn.length){//暂无最低价影院，刷新一下试试
		    window.location.reload();	
		}
	},
	//快速搜索影院 相关-----------------------------
	//缓存搜到的全部影院  null  [{id:1,name:'五道口',spell:'wudaokou'},{id:2,name:'中关村',spell:'zhongguancun'},{id:3,name:'国贸',spell:'guomao'}]
	cacheOfSearchCinemaList:null,
	////查询当前日期的 全部影院
	toSearchCinema:function(type){
		var core=Core;
		core.post('/movie/cinema_tip.html',{'city':core.curCity.id,movieId:core.movieId,date:$(".active","#timeTabs").attr("day")},function(err,rs){
			if(!err){rs=core.parseJSON(rs);
				//core.cacheOfSearchCinemaList = [{id:1,name:'五道口',spell:'wudaokou'},{id:2,name:'中关村',spell:'zhongguancun'},{id:3,name:'国贸',spell:'guomao'}];
				core.cacheOfSearchCinemaList=rs.list;//存储搜到的影院
				
				if(type == 1){//点击输入框
					core.filterSearchCinema($('#cinema_search').get(0),true);//过滤搜索结果，下拉列表
				}else{//点击搜索按钮
					core.filterSearchCinema($('#cinema_search').get(0));//过滤搜索结果，下拉列表
					core.showFilterResult($("#cinema_search").val());//显示过滤的结果
				}
			}
		});
	},
	//从缓存中过滤搜索到的影院，显示到搜索下拉列表(点击确认或回车)，isShow：过滤后是否显示结果下拉列表
	filterSearchCinema:function(input,isShow){
		var core=Core,scList=core.cacheOfSearchCinemaList,
			keyWord=input.value,//输入框关键字
			keyWord2=input.value.toLowerCase(),//输入框关键字

			frg=document.createDocumentFragment(),
			cinema_search_list=$('#cinema_search_list'),//显示搜索结果的列表
			reg = new RegExp("^(.*)("+ $.safeRegStr(keyWord) +")(.*)$","i"),
			maxShow=0;

		if(!scList || !keyWord) {
			cinema_search_list.html('').addClass('hide');//清空列表先;
			return;
		}
		var len=scList.length,item,
			flag=false;//标记是否有匹配项
		for(var i=0,n=0;i<len;i++){
			if(n >= 9){//列表只显示前9个				
				break;
			}
			item=scList[i];
			
			//模糊匹配名字
			//20140711修改，名称中匹配的显示在前，拼音匹配显示在后，比“深圳UA影院”在修改前不在前十个，没有显示出来
			if(item.name.toLowerCase().indexOf(keyWord2) >= 0){
				n++;
				flag=true;				
				var a=$($.format('<a cid={id} href="javascript:;" isSeatSupportNow="{isSeatSupportNow}">{name}</a>',{name:item.name.replace(reg,"$1<em>$2</em>$3"),id:item.id,isSeatSupportNow:item.isSeatSupportNow}));
				frg.appendChild(a.get(0));				
			}
			maxShow=n;			
		}
		//不足9条，匹配拼音
		if(maxShow < 9){
			for(var i=0,n=0;i<len;i++){
				if(maxShow+n >= 9){//列表只显示前9个
					break;
				}
				item=scList[i];
				//模糊匹配拼音
				//20140711修改，名称中匹配的显示在前，拼音匹配显示在后，比“深圳UA影院”在修改前不在前十个，没有显示出来
				if(item.name.toLowerCase().indexOf(keyWord2) < 0 && item.spell.toLowerCase().indexOf(keyWord2) >= 0){
					n++;
					flag=true;
					var a=$($.format('<a cid={id} href="javascript:;" isSeatSupportNow="{isSeatSupportNow}">{name}</a>',{name:item.name.replace(reg,"$1<em>$2</em>$3"),id:item.id,isSeatSupportNow:item.isSeatSupportNow}));
					frg.appendChild(a.get(0));				
				}		
			}
		}
		
		
		cinema_search_list.html('').addClass('hide');//清空列表先
		
		if(flag){//如果有匹配项
			cinema_search_list.html(frg);
			if(isShow){
				cinema_search_list.removeClass('hide');
			}
		}
	},
	
	//点击确认或回车后，显示全部过滤的结果   keyword:输入框关键字
	showFilterResult:function(keyWord){
		var core=Core,scList=core.cacheOfSearchCinemaList,
			frg=document.createDocumentFragment(),
			n=0,//标记匹配的	个数
			cinema_search_list=$('#cinema_search_list'),//显示搜索结果的列表
			cinamaList=$('#cinamaList');//影院列表
		if(!scList || !keyWord)return;
		
		$('#district_areaList').find('li').removeClass('active');
		$('#areaContent').find('.mv_cinema_rs>.arrow').get(0).className='arrow arrow4';
		
		if(cinema_search_list.find('a').length <=0 ){
			cinamaList.parent().attr('style','');
			cinamaList.css('margin-top','0').html('<div id="noWaiting" class="noWaiting noTop"><b></b>暂无相关影院，<a href="javascript:;">查看全部影院</a></div>');
			$('#cinema_page').remove();
			$('#cinemaContent').addClass('hide').html('');
			
			//暂无相关影院，查看全部影院
			cinamaList.find('a').bind('click',function(){
				core.by='district';
				core.getPost({cinemaType:'ALL'});	
			});
			return;
		}
		
		var len=scList.length,item;
		for(var i=0;i<len;i++){
			item=scList[i];
			//模糊匹配名字和拼音
			if(item.name.indexOf(keyWord) >= 0 || item.spell.indexOf(keyWord) >= 0){
				var li=$($.format('<li cid="{id}" isSeatSupportNow="{isSeatSupportNow}"><a href="javascript:;"><i class="sub"></i>{name}</a></li>',{name:item.name,id:item.id,isSeatSupportNow:item.isSeatSupportNow}));				
				frg.appendChild(li.get(0));
				n++;
			}
		}	
		if(n > 0){//有匹配结果
			cinamaList.parent().attr('style','');
			cinamaList.css('margin-top','0').html(frg).find('li:first-child').addClass('active');//默认选中第一个
			$('#cinema_page').remove();//移除分页按钮先
			var pageCount=Math.ceil(n/9);
			if(pageCount > 1){//超过一页时，才显示分页按钮
				cinamaList.parent().css({'overflow':'hidden','height':'110px','position':'relative'})
					.after('<div id="cinema_page" class="cinema_page"><span>1/' + pageCount + '</span><a class="page_left page_left_end"></a><a class="page_right"></a></div>');
			}
			
			//影院列表默认选中第一个后，此处发请求 获取选座列表等信息
			core.by='com.cinema';
			core.getPost({cinemaType:'ALL'});
		}		
	},
	//快速搜索影院 相关 end-----------------------------
	
	by:'',//标记当前点击的区域  date,district,com.cinema,ticket
	//绑定正在上映页面dom事件
	postData: {//存放post数据  todo:
		city:Core.curCity.id,
		date:'',
		movieId:Core.movieId,
		cinemaId:'',
		cinemaType:'',//点击全部影院 ALL 点击常去影院 Offen 点击最低价影院LowPrice   点击地区District  点击商圈 Circle 点击地铁地铁Subway
		typeId :''	//如地区id，商圈id，地铁id 
	}, 
	//重置参数传递
	resetPostData: function(data){
		var core=Core;
		$.extend(core.postData,{
			date: $(".active","#timeTabs").attr("day"),
			cinemaId: $(".active","#cinamaList").attr("cid"),
			cinemaType:$('#district_areaList').find('>.active').attr('cType'),
			typeId :$('#district_areaList').find('>.active').attr('typeId')
		});
		if(!!data){
			$.extend(core.postData,data);
		}
	},
	//ajax获取数据  data:参数
	getPost: function(data){
		var core = Core,box,loadingPanel,url='/movie/schedule1.html';
		core.resetPostData(data);
		//console.log(core.by);
		switch(core.by){
			case "date": //日期选择
				box = $("#dateContent");
				url='/movie/schedule2.html';
				loadingPanel = core.loadingPanel({'renderTo':$('#part2'),'height':box.outerHeight(),'style':{'top':'auto','bottom':'0'}});//初始化loading层
				break;
			case "district": //地区选择 
				box = $("#areaContent");
				url='/movie/schedule3.html';
				loadingPanel = core.loadingPanel({'renderTo':box,'height':box.outerHeight()});
				break;
			case "com.cinema": //影院选择
				box = $("#cinemaContent");
				url='/movie/schedule4.html';
				core.postData.isSeatSupportNow = $(".active","#cinamaList").attr("isSeatSupportNow");//点击影院是传此参数
				loadingPanel = core.loadingPanel({'renderTo':box,'height':box.outerHeight()});
				break;
			case "ticket": //选座兑换券选择
				box = $("#cinemaContent");
				url='/movie/schedule4.html';
				core.postData.ticketType= $(".active","#mvSubTabs").attr("rel") == "#subPart2" ? 1 : 0;//只在点击此tab时，传ticketType
				break;
		}
		core.post(core.scheduleUrl || url, core.postData,function(err,rs){
			!!loadingPanel && loadingPanel.clear();//移除loading层
			$('#part2').attr('style','');//点击日期时，显示loading层会给#part2加上样式{'position':'relative','overflow':'hidden'}，此处将其去掉
			if(!err && rs){
				if(box && box.length){
					box.replaceWith(rs);
					if(core.by == 'date'){//更新区域列表
						var low = $('#timeTabs').find('>.active >.low');
						if(low.length){//切换日期时，当前日期有最低价，则在区域处显示低价影院
							$('#district_areaList').find('li:last-child').removeClass('hide');
						}
					}else if(core.by == 'district'){//更新影院列表
						box=$("#areaContent");
						var cinemaType=core.postData.cinemaType,
							len=$('#district_areaList').find('li').length;
						//改变箭头指向位置
						if(cinemaType == 'Offen'){//常去影院始终在第一个位置
							box.find('.mv_cinema_rs>.arrow').get(0).className='arrow arrow2';
						}else if(cinemaType == 'LowPrice'){
							if(len==2){
								box.find('.mv_cinema_rs>.arrow').get(0).className='arrow arrow2';
							}else{
								box.find('.mv_cinema_rs>.arrow').get(0).className='arrow arrow3';
							}
						}else{
							box.find('.mv_cinema_rs>.arrow').get(0).className='arrow';
							if(cinemaType == 'ALL'){//点击返回全部
								var all_cinema = $('#all_cinema'),all_type_box=$('#all_type_box');
								all_cinema.addClass('active').attr('typeId','1').attr('cType','ALL');
								all_cinema.find('.sel_cinema > span').text('全部影院');
								all_type_box.find('a').removeClass('active');
								all_type_box.find('.all').addClass('active');
								$('#cinema_search').addClass('textGray').val('快速搜索影院');
							}
						}			
					}
					//重置
					core.postData.ticketType = '';	
					core.postData.isSeatSupportNow='';
				}				
			}
		},"@getList");
	},
	
	//剧情与影评界面的 事件--------------------------------------------------------------------------
	//绑定剧照事件
	bindPhotoEv: function(){
		var core = this;
		//绑定剧照滑动效果
		var obj = $.imgSlide({
			moveSize:4,
			duration:600,
			leftButton:"leftPBtn",// 左侧按钮id 或者jq对象
			rightButton:"rightPBtn",// 右侧按钮id 或者jq对象
			listId: "sphotoList"//列表id 或者 jq对象
			//contentId: $('.c_detail_poster')//容器id(可选，默认是list复节点)动
		}); 
		
		
		
		$("#sphotoList").find("li").each(function(index, element) {
            $(element).click(function(){
				$(this).siblings(".active").removeClass("active");
				$(this).addClass("active");
				core.showBigMvpic(core.bigPhotoUrls, index);
			});
		});
	},
	
	//显示或隐藏评论内容，如果评论内容搞定超过b的高度，则显示 查看全文按钮
	showCommentContent: function( box ){
		box.each(function(){
			var b = this, li = $(this).closest("li");
			if(b.scrollHeight <= b.clientHeight){
				li.find(".btn_all").html("");
			}else{
				li.find(".detailDot").show();
			}	
		});
	},
	//剧情&影评tab点击事件
	commentTabClick: function(){
		var core = Core, obj = $(this);
		
		//剧情&影评未加载,且moviedId存在时，才加载
		if(!obj.data("isLoad") && core.movieId){//todo: comment_list.html，list_comment.ftl
			core.post("/movie/comment_list.html",{movieId:core.movieId}, function(err, rs){
				if(!err && rs){
					$("#part1").html(rs);
					obj.data("isLoad", true);//标记已加载
					//查看全文
					core.showCommentContent($("#lCommentList").find(".detail"));
					//评论相关事件 初始化
					core.bindCommentEv();					
				}
			});
		}
	},
	
	//评论相关事件 初始化
	bindCommentEv: function(){		
		var core=Core,txtArea = $("#shortTxtArea");
		$("#writeScommt").click(core.writeSCmtEvent);//写影评按钮
		//$("#moreScommt").find('a').click(core.moreScommt);//在显示20条影评		
		
		$("body").delegate(".btn_all a","click",core.moreInfoEv);//查看全文按钮事件
		
		//剧照列表
		if($("#sphotoList")[0]){
			core.bindPhotoEv();
		}
		//加载影评
		core.getCommt();
		$("#moreScommt").click(function(){
			core.getCommt();
		})
		//展示评论大图	
		core.imgObj={};	
		core.showBigPoster();

	},
	//查看全文按钮事件
	moreInfoEv: function(){
		var obj = $(this), spans = obj.parent().siblings(".detail").find("span[spec=1]"), li = obj.closest("li"),
			detailDot = li.find(".detailDot");
		if(obj.hasClass("up")){
			li.removeClass("active");
			detailDot.show();
			obj.removeClass("up").text("[查看全文]");
		}else{
			li.addClass("active");
			detailDot.hide();
			obj.addClass("up").text("[收起]");
		}
	},	
	template : function(tmpl, data, sp){
		//默认分隔符
		var f = sp || "%",
		//动态创建函数
		fn = new Function("var p=[],me=this,data=me,print=function(){p.push.apply(p,arguments);};p.push('" +
			// Convert the template into pure JavaScript
			tmpl
			  .replace(/[\r\t\n]/g, " ")
			  .replace(new RegExp("<"+ f + "=\\s*([^\\t]*?);*\\s*" + f +">", "g"), "<"+ f +"print($1);"+ f +">")
			  .split("<"+f).join("\t")
			  .replace(new RegExp("((^|"+ f +">)[^\\t]*)'", "g"), "$1\r")
			  .replace(new RegExp("\\t=(.*?)"+ f +">", "g"), "',$1,'")
			  .split("\t").join("');")
			  .split(f+">").join("p.push('")
			  .split("\r").join("\\'")
		  + "');return p.join('');");
		//返回
		return data ? fn.call( data ) : fn;
	},
	//获取影评
	getCommt:function(){		
		var core = Core,
			sCommentList = $("#sCommentList"),
			noShortPart=$("#noShortPart"),
			temp=$("#tmpGetPosts").html();

		if(sCommentList.find("dd").length > 0){//非首次加载，即加载更多
			var sId=sCommentList.find("dd:last-child").attr("sId");
		}

		var	param = {
			req_id: core.movieId,
			req_type:"movie",
			sort:"time",
			count:20,
			maxId:!!sId ? sId : 0
		};

		$.ajax({
			dataType: "jsonp",				
			url: "http://qz.dianying.163.com/w/req_getPosts",
			//url: "http://127.0.0.1/mv/ajax/movie/req_getPosts.html",
			data: param,
			success:  function( rs ){	
				var moreScommt=$("#moreScommt"),commCount_S=$("#commCount_S");
				rs = typeof rs == "object" ? rs : core.parseJSON(rs);
				if(+rs.result === 100){
					if(!sId && (!rs.posts || rs.posts.length === 0)){//首次请求，即第一页，无数据，显示暂无影评
						noShortPart.show();
						return;
					}
					if(!rs.posts || rs.posts.length === 0){							
						if(!sId){//首次请求，即第一页，显示暂无评论						
							noShortPart.show();
						}else{//点更多无数据							
							moreScommt.addClass("hide");
							sCommentList.find("dd:last-child").addClass("last");
						}
						return;
					}
					
					//将图片地址存入数组				
					//var core.imgSrcArr=[];					
					// if(!!rs.posts && rs.posts.length > 0){
					// 	for(var i=0;i<rs.posts.length;i++){
					// 		var objTemp={
					// 	       "imageListSmallSrc": [],
					// 	       "imageListBigSrc": []
					// 	    };
					// 		if(!!rs.posts[i].imageList && rs.posts[i].imageList.length > 0){
					// 			for(var j=0;j<rs.posts[i].imageList.length;j++){
					// 				objTemp.imageListSmallSrc[j]=rs.posts[i].imageList[j].thumbnailUrl;
					// 				objTemp.imageListBigSrc[j]=rs.posts[i].imageList[j].originalUrl;
					// 			}	
					// 		}else{
					// 			objTemp.imageListSmallSrc=[];
					// 			objTemp.imageListBigSrc=[];
					// 		}
					// 		core.imgSrcArr.push(objTemp);	
					// 		objTemp=null;						
					// 	}
					// }

					//根据帖子id，保存图片地址，无图片不保存		
					if(!!rs.posts && rs.posts.length > 0){
						for(var i=0;i<rs.posts.length;i++){
							var arrTemp1=[];
							var arrTemp2=[];
							if(!!rs.posts[i].imageList && rs.posts[i].imageList.length > 0){
								for(var j=0;j<rs.posts[i].imageList.length;j++){
									arrTemp1.push(rs.posts[i].imageList[j].thumbnailUrl);
									arrTemp2.push(rs.posts[i].imageList[j].originalUrl);
								}	
							}
							core.imgObj["imgS"+rs.posts[i].id]=arrTemp1;
							core.imgObj["imgB"+rs.posts[i].id]=arrTemp2;
							rs.posts[i].createTime=Core.formatCreatTime(rs.posts[i].createTime);
						}
					}

					sCommentList.find("dd:last-child").removeClass("last");
					sCommentList.append(core.template(temp,rs.posts));
					sCommentList.find("dd:last-child").addClass("last");
					commCount_S.find('em').text(rs.board.mainPostsNum);//评论数，主帖数
					
					if(!rs.moreFlag || rs.moreFlag !==1){//无更多
						moreScommt.addClass("hide");
					}else{
						moreScommt.removeClass("hide");
					}
				}else{
					if(!sId){//首次请求，即第一页，显示暂无评论							
						noShortPart.show();
					}else{//点更多无数据							
						moreScommt.addClass("hide");
						sCommentList.find("dd:last-child").addClass("last");
					}
				}
			},
			error: function(){
				if(!sId){//首次请求，即第一页，显示暂无评论							
					noShortPart.show();
				}else{//点更多无数据							
					moreScommt.addClass("hide");
					sCommentList.find("dd:last-child").addClass("last");
				}
			}			
		});	
	},
	formatCreatTime: function(oTime){
		var createTime ="",createData="";
		createData=oTime.substring(0,10);

		createTime=parseInt(((new Date(Core.nowTime))-new Date(oTime.replace(/-/g,"/")))/1000);//秒,为取整更准确
		createTime=createTime <= 0 ? 1: createTime;
		// 1分钟---60秒 内显示：XX秒之前
		// 60分钟---3600秒 内显示：XX分钟之前
		// 24小时---86400秒内显示：XX小时之前
		// 24小时以外显示：2014-07-22		
		if(createTime <= 60){
			createTime=Math.ceil(createTime)+"秒之前";
		}else if(createTime <= 3600){
			createTime=Math.ceil(createTime/60)+"分钟之前";
		}else if(createTime <= 86400){
			//12.582777777777778小时之前
			createTime=Math.ceil(createTime/60/60)+"小时之前";
		}else{
			createTime=createData;
		}
		return createTime;
	},
	showBigPoster : function(){
		var sCommentList=$("#sCommentList"),core=Core,temp=$("#tmpBigPosts").html();
		sCommentList.delegate(".comment-pic-small li","click",function(){
			var _parent=$(this).parent(),
				clickID=_parent.parent().attr("sid"),
				indClickImg=$(this).index(),
				detail=_parent.parent().find(".detail");
			
			_parent.hide().after(core.template(temp,core.imgObj["imgS"+clickID]));
			//解决首次点击，photo_box的margin-top无效，让页面repaint一下
			detail.css("color","#333");
            var opt={
                obj:_parent,
                cInd:indClickImg,
                imgSrcObj:core.imgObj["imgB"+clickID]
            }
            //等一会loading的加载，否则会闪现找不到图片的图标
            setTimeout(function(){
            	$.imgZoom(opt);
            },100)            
		})			
	}
	
});
})(window,jQuery,Core);