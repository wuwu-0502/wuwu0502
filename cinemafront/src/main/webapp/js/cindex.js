/*
 * 影院模块搜索页js
 * edit by 姜运宝 date: 2012-10-31
 * 待定id列表： 隐藏input:  key
 * 20130916 改版 by tiangang
 *
 */
(function(window,$,Core){

$.extend(Core, {	
	//页面加载完之前运行
	quickInit: function(){
	},	
	cinemaListCache:[],//缓存一份请求到的影院列表，数组有顺序
	cinemaInViewList:[],//存储可视区域内的影院列表 
	
	//入口函数
	myInit : function(){
		var core=Core;
		
		core.emphisisKey();//关键字标红
		core.initSearchInput();//初始化搜索输入框
		
		//区域选择处文案 修改
		if(core.postData.category != 'ALL' && $('#all_type_box a.active > span').length){
			$('#sel_cinema > span').text($('#all_type_box a.active > span').text());
		}
		
		core.pageEventBind();//页面事件绑定
					
		core.initMap();//初始化地图
		
		//ajax请求影院列表信息
		core.getCinemaList();
	},	
	//关键字标红
	emphisisKey: function(){
		var key = Core.postData.keywords;
		if(!key) return;
		key=key.toUpperCase();	
		$("#cinema_list").find('.c_name > a').each(function(){
			var obj = $(this), cont = obj.html(), idx = cont.toUpperCase().indexOf(key), len = key.length;						
			if(idx >= 0){
				var reg = new RegExp(key, "gi");//不区分大小写，全局匹配
				obj.html(cont.replace(reg,"<em>"+ cont.substr(idx,len)+"</em>"));
			}
		});	
	},
	//初始化搜索输入框
	initSearchInput:function(){
		var core=Core, 
			cKeyWords = $("#cinema_search_input");//关键字输入框
		cKeyWords.focus(function(){
			if(this.value=='请输入影院名称'){
				this.value='';
			}
			$(this).removeClass('textGray');
		}).blur(function(){
			if(this.value==''){
				this.value='请输入影院名称'
				$(this).addClass('textGray');
			}	
		}).keyup(function(e){
			if(e.keyCode == 13){//回车
				window.setTimeout(searchHandler, 200);
			}else{
				var v=this.value;
				this.value=v.replace(/\\/gi,'');	
			}
		}).autoSearch("/com.cinema/search_tip.html?city=" +  Core.curCity.spell + "&keywords={key}&callback={callback}", function(data){
			//window.cb1378200184015({"p":"a","list":[{"key":"激战","url":"1500","type":"m"},{"key":"少年派的奇幻漂流","url":"1448","type":"m"}]});	
			var key = data.p, list = data.list, arr = [], v = this.value.trim(), n = list.length, i=0, reg;
			if( key === v ){
				reg = new RegExp("^(.*)("+ $.safeRegStr(key) +")(.*)$","i");
				for(; i<n; i++)
					arr[i] = {
						text : list[i].key,
						value : "/com.cinema/" + list[i].url + ".html#from=com.cinema.searchenter",
						textShow : list[i].key.replace(reg,"$1<b>$2</b>$3")
					};
			}
			return arr;
		},{
			itemTmpl : '<a class="{itemCss}" href="{value}" title="{text}">{textShow}</a>',
			sameWidth:true,
			listCss:"searchCinemaCss",
			fireDefault:true,
			onHide : function( reason, text, value ,link){
				if( reason == "inputConfirm" ){
					window.location = $(link).attr('href');
				}
			}
		});
		$("#cinema_search_btn").click(searchHandler);//点击搜索按钮
		
		//搜索操作
		function searchHandler(txt){
			var keys = $("#cinema_search_input").val();
			
			if(!!keys && keys.trim() == "请输入影院名称"){
			  keys='';	
			};			
			core.postData.keywords=keys;
			
			keys=encodeURIComponent(encodeURI(keys));
			window.location='/'+core.postData.city+'/com.cinema/category-ALL-area-0-type-0.html?keywords='+keys+'#from=com.cinema.search';
		}				
	},
	//修改地图悬浮文案
	titleFloat:function(){
		var core=Core,
			cinema_float_mid=$('#cinema_float_mid'),
			district=$('#all_type_box').find('.type_detail > .active span').text(),//区域
			type=$('#cinema_tab').find('.active').attr('t'),typeStr='',//选座、兑换券、团购
			keyword=core.postData.keywords,
			totalCount=core.cinemaListCache.length;//core.totalCount;
		
		if(!!keyword && keyword != '请输入影院名称'){//关键字优先
			//搜索到"<em>嘉华国际</em>"影院共<em class="ml5 mr5">200</em>家
			cinema_float_mid.html(['搜索到“<em>',keyword,'</em>”影院共<em class="ml5 mr5">',totalCount,'</em>家'].join(''))
						.parent().removeClass('hide');	
		}else{
			switch(+type){
			  case 0:typeStr='';//全部
			  break;
			  case 1:typeStr='可选座';
			  break;
			  case 2:typeStr='可购买兑换券';
			  break;
			  case 3:typeStr='有团购';
			  break;	
			}
			if(/全部/gi.test(district)){
				district='';
			}
			//北京市五道口可选座影院共2家
			cinema_float_mid.html([core.curCity.name,'市',district,typeStr,'影院共<em>',totalCount,'</em>家'].join(''))
			  			.parent().removeClass('hide');	
		}
		
		$('#num').text(core.totalCount);//修改总数
		if(totalCount>0){//总数大于1时，显示 区域选择
			$('.cinema_sel_right').removeClass('hide');
		}
		
	},
	//页面事件绑定
	pageEventBind:function(){
		var core=Core;
		var all_type_box=$('#all_type_box'),
			sel_cinema=$('#sel_cinema');
			
		//点击导航里的影院时，将地址里的关键字编码处理
		$('.searchBoxInd').find('ul').click(function(e){
			var target=e.target||e.srcElement,
				li=$(target).closest('.yy');
			if(li.length){
				var a=li.find('a'),	
					href=a.attr('href');	
				a.attr('href',href.replace(core.postData.keywords,encodeURIComponent(encodeURI(core.postData.keywords))));
			}
		});
		//点击"全部、选座..."tab时，将地址里的关键字编码处理-
		$('#cinema_tab').click(function(e){
			var target=e.target||e.srcElement,
				a=$(target).closest('a');
			if(a.length){
				var href=a.attr('href');	
				a.attr('href',href.replace(core.postData.keywords,encodeURIComponent(encodeURI(core.postData.keywords))));
			}
		});
		$(document).click(function(e){
			var target = e.target || e.srcElement,
				a=$(target).closest('.sel_cinema'),
				div=$(target).closest('.all_type_box');	
			if(a.length <= 0 && div.length <= 0){
				all_type_box.addClass('hide');
				sel_cinema.removeClass('sel_cinema_border');
				sel_cinema.find('i').removeClass('triangleToUp');
			}
		});
		//显示/隐藏商圈、区域、地铁浮层
		sel_cinema.click(function(){
			var self=$(this),i=self.find('i');
			if(all_type_box.hasClass('hide')){
				self.addClass('sel_cinema_border');
				i.addClass('triangleToUp');
				all_type_box.removeClass('hide');		
			}else{
				self.removeClass('sel_cinema_border');
				i.removeClass('triangleToUp');
				all_type_box.addClass('hide');	
			}
		});
		//点击"区域选项"tab时，将地址里的关键字编码处理
		all_type_box.click(function(e){
			var target=e.target||e.srcElement,
				a=$(target).closest('a');
			if(a.length){
				if(a.hasClass('close')){//关闭按钮，隐藏图层				
					all_type_box.addClass('hide');
					sel_cinema.removeClass('sel_cinema_border');
					sel_cinema.find('i').removeClass('triangleToUp');
				}else{
					var href=a.attr('href');
					a.attr('href',href.replace(core.postData.keywords,encodeURIComponent(encodeURI(core.postData.keywords))));
				}
			}
		});
		$('#cinema_left_overflow').jScrollPane();//加载影院列表滚动条
		
		//影院列表点击事件
		$('#cinema_list').click(function(e){
			var target=e.target||e.srcElement,
				li=$(target).closest('li'),
				a=$(target).closest('a');
			if(li.length && !!li.attr('cid')){
				core.showInfoBox(li.attr('cid'));//显示信息框	
			}
		})
		.delegate('li','mouseenter',function(){
			if(!$(this).attr('cid')){
				return false;
			}
			var cid=$(this).attr('cid'),
				marker = Core.markerMap.get(cid);
			if(!marker) return false;
				
			if(!!$(this).data('active')){//当前项 为已选中项
				$('#'+cid,'#cinemaMapBox').parent().css('z-index',core.marker_zIndexMax++);	//将标注层级设为最高
				return false;
			}		
			marker.setContent(marker.getContent().replace('bubble_red','bubble_blue'));	//改变标注颜色		
			$('#'+marker.cid,'#cinemaMapBox').parent().css('z-index',core.marker_zIndexMax++);//将标注层级设为最高
			$(this).parent().data('active_cid', $(this).parent().find('.active').attr('cid'));
			$(this).addClass('active');
		})
		.delegate('li','mouseleave',function(){
			if(!$(this).attr('cid') || !!$(this).data('active')) return false;
			
			var cid=$(this).attr('cid'),
				marker = Core.markerMap.get(cid);
			if(!marker) return false;
			
			marker.setContent(marker.getContent().replace('bubble_blue','bubble_red'));//改变标注颜色
			$('#'+$(this).parent().data('active_cid'),'#cinemaMapBox').parent().css('z-index',core.marker_zIndexMax++);//将当前被选中的标注层级设为最高
			$(this).removeClass('active');
		});
	},
	/*
	 *分页
	 */
	totalCount:0,//总个数
	pageSize:20,//每页个数
	curPageIndex:1,//当前页码
	initSplitPage:function(settings){
		var opt=$.extend({			
				totalCount:0,//总个数
				nearPageNum:3,//当前页附近的页数
				urlTmpl:"",////url链接模版，?page={p},{p}将被特定的页数替换
				wrapCss:"splitPages",//包装容器的样式
				lineBreak:false,
				renderTo:$(document),//父级
				onInit:function(){}//初始化后执行
			},settings);
		//	
		var core=Core,
			splitPages=$('.splitPages'),
			curPageIndex=core.curPageIndex,
			pageSize=core.pageSize,
			pageCount=Math.ceil(opt.totalCount/pageSize),//总页数
			showCount=opt.nearPageNum * 2+2;//显示的数字按钮个数
		if(pageCount <= 1){//不足两页，不加载分页控件
			splitPages.remove();
			return;
		}
		if(splitPages.length == 0){//分页控件不存在
			splitPages=$('<div class="splitPages"></div>');
			$('#cinema_list').after(splitPages);			
		}
		
		//分页事件
		splitPages.unbind('click').click(function(e){
			var target = e.target||e.srcElement,
				a=$(target).closest('a');
			if(!a.length) return false;
			
			var core=Core;
	  		if(core.cinemaInViewList.length == 0 && core.cinemaListCache.length == 0){
	  			 return;//缓存列表为空，不能分页
	  		}	  		
			var self=$(this);
			if(a.hasClass('next')){//点击下一页
				if(curPageIndex == opt.pageCount){//点击时为最后一页
					return false;
				}
				
				oldIndex = curPageIndex++;
			}else if(a.hasClass('pre')){//点击上一页
				if(curPageIndex <= 1){//点击时为第一页
					return false;
				}
				
				oldIndex = curPageIndex--;
			}else{//点击数字				
				oldIndex = curPageIndex
				curPageIndex = +a.text();	
			}
			core.curPageIndex=curPageIndex;//存储当前页码			
			_showLinkRange();
			
			core.isSetCenter=true;
						
			core.updateList(false);//分页时更新左侧列表信息
			core.createMarkers();//创建对应的标注
			
			return false;						
		});
		
		
		//显示按钮个数
		var ahtml='<a index="{index}" href="javascript:;">{index}</a>',
			spanHtml='<span index={index}>{index}</span>',
			oldIndex;
		function _showLinkRange(){
			if(pageCount <= showCount + 1 ){//此时页码全部显示，没有省略号: 1 2 3 4 5 6 7 8 9
				var html = curPageIndex==1?['<span class="noPre"><b></b></span>']:['<a href="javascript:;" class="pre"><b></b></a>'];
				for(var i=1,j=pageCount;i<=j;i++){
					html.push($.format('<a href="javascript:;" index="{index}">{index}</a>',{'index':i}));
				}


				if(curPageIndex==pageCount){
					html.push('<span class="noNext"><b></b></span>');	
				}else{
					html.push('<a href="javascript:;" class="next"><b></b></a>');	
				}
			}else if(curPageIndex <= opt.nearPageNum + 2){//情况一: 1 2 3 4 5 6 7 8 ... n 
				var html = curPageIndex==1?['<span class="noPre"><b></b></span>']:['<a href="javascript:;" class="pre"><b></b></a>'];
				for(var i=1,j=opt.nearPageNum * 2 + 2;i<=j;i++){
					html.push($.format('<a href="javascript:;" index="{index}">{index}</a>',{'index':i}));
				}
				html.push('<em>...</em>');
				html.push($.format('<a href="javascript:;" index="{index}">{index}</a>',{'index':pageCount}));
				html.push('<a href="javascript:;" class="next"><b></b></a>');
							
			}else if(curPageIndex > pageCount - opt.nearPageNum - 2){//情况三: 1 ... 11 12 13 14 15 16 17 18
				var html=['<a href="javascript:;" class="pre"><b></b></a>','<a href="javascript:;" index="1">1</a>','<em>...</em>'];
				for(var i=pageCount - opt.nearPageNum * 2 - 1,j=pageCount;i<=j;i++){
					html.push($.format('<a href="javascript:;" index="{index}">{index}</a>',{'index':i}));
				}
				if(curPageIndex==pageCount){
					html.push('<span class="noNext"><b></b></span>');	
				}else{
					html.push('<a href="javascript:;" class="next"><b></b></a>');	
				}
								
			}else{//情况二: 1 ... 3 4 5 * 7 8 9 ... n		
				var html=['<a href="javascript:;" class="pre"><b></b></a>','<a href="javascript:;" index="1">1</a>','<em>...</em>'];
				for(var i=curPageIndex - opt.nearPageNum,j=curPageIndex + opt.nearPageNum;i<=j;i++){
					html.push($.format('<a href="javascript:;" index="{index}">{index}</a>',{'index':i}));
				}
				html.push('<em>...</em>');
				html.push($.format('<a href="javascript:;" index="{index}">{index}</a>',{'index':pageCount}));
				html.push('<a href="javascript:;" class="next"><b></b></a>');
									
			}			
			splitPages.html('').append(html.join(''));
			splitPages.find('span[index]').replaceWith($.format(ahtml,{'index':oldIndex}));
			splitPages.find('a[index="'+curPageIndex+'"]').replaceWith($.format(spanHtml,{'index':curPageIndex}));	
			
		}
		_showLinkRange();//初始化时加载，此时为第一页
		
		$('#cinema_left_overflow').jScrollPane();//加载影院列表滚动条
		opt.onInit();
		
		return 	splitPages;	
	},
	noRS:'<li class="cinema_noRS"><b></b><span class="ml5">未找到相关影院</span></li>',
	htmlGoback:'<li class="cinema_goback last"><a href="/'+Core.curCity.spell+'/com.cinema/category-ALL-area-0-type-0.html">返回全部影院</a></li>',
	//分页时更新左侧列表信息
	updateList:function(isInitSplitPage){
		var core=Core,
			cList=[];
		if(core.scrollFlag){//用来创建标注的可是区域内影院列表,地图缩放、拖拽后
			cList=core.cinemaInViewList;
		}else{//此时未进行地图缩放、拖拽操作，取原始数据，
			cList=core.cinemaListCache	
		}
		
		core.titleFloat();//设置悬浮文案
		
		var cinemaList=$('#cinema_list');
		if(cList.length == 0){ //缓存列表为空
			cinemaList.html(core.noRS);
			cinemaList.append(core.htmlGoback);
			$('.splitPages').remove();//清除分页控件
			$('#cinema_left_overflow').jScrollPane();//加载影院列表滚动条
			return;
		}
		var drg=document.createDocumentFragment(),
			pageSize=core.pageSize,//每页个数
			startIndex=(core.curPageIndex - 1) * pageSize,//每页第一个序号
			endIndex=startIndex + pageSize,//每页最后一个序号
			htmlTml=['<li cid="{cid}">',
						'<div class="c_name"><span class="bubble_red">{index}</span><a target="_blank" href="/cinema/{cid}.html#from=com.cinema.enter">{name}</a></div>',
						'<div class="c_price"><span><em>¥{lowPrice}</em><i>起</i></span></div>',
						'<div class="c_add">地址：{address}</div>',
						'<div class="c_tel">电话：{tel}</div>',
						'<div class="c_btn mt8"></div>',
					'</li>'].join(''),//列表项模板
			li,cinema;
		for(var i=startIndex,n=1;i<endIndex;i++,n++){
			cinema=cList[i];
			if(!cinema){//比如：一页个数不足一页，循环到最后一个时，退出循环
				break;
			}
			li=$($.format(htmlTml,{'index':n,'cid':cinema.id,'name':cinema.name,'address':cinema.address||'','tel':cinema.tel||'','lowPrice':cinema.lowPrice||''}));
			
			//评分
			if(!!cinema.grade && cinema.grade > 0){
				var grade=cinema.grade;
				li.find('.c_name').append('<span class="score_s ml5">'+Math.floor(grade)+'.<em class="s">'+Math.floor(grade*10%10)+'</em></span>');
			}
			//价格
			var s=cinema.isSeatSupport||0+cinema.isCouponSupport||0+cinema.isGroupBuySupport||0;
			var c_price=li.find('.c_price');
			if(!cinema.lowPrice || s<1){//没有价格，或不能购票，不显示价格
				c_price.html('');
			}
			//支持在线选座
			if(cinema.isSeatSupport==1){
				c_price.append('<span class="icon_z"></span>');
			}
			//支持优惠券
			if(cinema.isCouponSupport==1){
				c_price.append('<span class="icon_q"></span>');
			}
			//支持团购
			if(cinema.isGroupBuySupport==1){
				c_price.append('<span class="icon_t"></span>');
			}
			//支持imax
			if(cinema.isImaxSupport==1){
				c_price.append('<span class="mtype_imax"></span>');
			}
			if(c_price.find('span').length == 0){
				c_price.remove();
			}
			//按钮
			var	c_btn=li.find('.c_btn');
			if(s >= 1){
				if(cinema.isSeatSupport == 1){
					c_btn.html('<a href='+cinema.id+'"/cinema/.html?ticketType=0#from=com.cinema.enter" class="btn_e34551 btn_89_29" target="_blank">购&nbsp;&nbsp;票</a>');
				}else{					
					c_btn.html('<a href='+cinema.id+'"/cinema/.html?ticketType=1#from=com.cinema.enter" class="btn_e34551 btn_89_29" target="_blank">购&nbsp;&nbsp;票</a>');
				}			
			}else if(!!cinema.movieList && cinema.movieList.length > 0){
				c_btn.html('<a href='+cinema.id+'"/cinema/.html?ticketType=1#pq=1&from=com.cinema.enter" class="btn_45a2e3 btn_89_29"  target="_blank">查看排期</a>');
			}else{
				c_btn.remove();//没有按钮，则去掉按钮显示区域
			}
			
			drg.appendChild(li.get(0));
			if(i+1 == cList.length){//最后一个
				drg.appendChild($(core.htmlGoback).get(0));
			}
			
		}
		cinemaList.html(drg);
		core.emphisisKey();//关键字标红
				
		if(isInitSplitPage){
			//初始化分页控件
			core.initSplitPage({
				totalCount :core.totalCount,
				nearPageNum:1
			});	
		}		
		$('#cinema_left_overflow').jScrollPane();//加载影院列表滚动条
		var jspPane=cinemaList.parent(),
			jspContainer=jspPane.parent();
		jspPane.css({'top':'0px'});
		jspContainer.find('.jspDrag').css({'top':'0px'});
	},
	//getCinemaList 请求参数 （定义在ftl里）
	/*postData:{
		city:Core.curCity.id,
		category:'ALL',//区域类型:ALL, Circle, District,Subway
		area:0,//区域id 
		keywords:$('#cinema_search_input').val(),//关键字
		type:$('#cinema_tab').find('>.active').attr('t')//0全部，1支持在线选座，2支持兑换券，3是否支持团购
	},	*/
	//通过ajax请求一份传到页面上的影院列表信息，并缓存到cinemaListCache
	getCinemaList:function(){
		var core=Core,loading=core.loading;
		loading = core.loadingPanel({'renderTo':$('#cinema_left_overflow')});//初始化loading层
		core.post('/com.cinema/getJsonList.html',core.postData,function(err,rs){
			!!loading && loading.clear();//移除loading层
		
			if(!err){rs=core.parseJSON(rs)
				var cinemaList=rs.cinemaList||[];//core.testData_cinemaList().cinemaList;//
				core.cinemaListCache=cinemaList;//缓存列表
				core.totalCount=cinemaList.length;//记录总个数
				
				core.updateList(true);//更新左侧列表信息
				
				//每次请求回来数据后，先判断当前如果是第一页（可能请求回来前点击了分页按钮），就把把第一页数据标注到地图上					
				setTimeout(function(){//地图可能还未加载完，所以等下
					core.createMarkers();//创建对应的标注
				},200);	
			}
		});
	},
	isSetCenter:true,//标记是否设置地图中心
	scrollFlag:false,//标记地图是否被拖拽、滚动过
	
	//地图相关----------------------------------------------------------
	bjPoint:new BMap.Point(116.395645,39.929986),//(天安门附近)
	centerPoint:new BMap.Point(116.395645,39.929986),//地图中心点(经、纬)，
	marker_zIndexMax:0,//记录地图标注的最大zIndex值
	infoBoxOffset:{'t':40,'b':0,'l':52,r:0},//信息框的额外偏移量(左上方缩放控件宽度52,地图上的悬浮层高度40)
	
	markerClickTimePrev:null,//记录上一次点击标注点的时间
	markerClickTimeSpan:300,//毫秒，两次点击标注点的最小时间间隔
	mapZoomendTimePrev:null,//记录上一次地图缩放结束的时间
	mapZoomendTimeSpan:800,//毫秒，两次地图缩放结束的最小时间间隔
	mapMoveTimePrev:null,//记录上一次地图移动结束的时间
	mapMoveTimeSpan:700,//毫秒，两次地图移动结束的最小时间间隔
	mapCenterPointPrev:new BMap.Point(116.395645,39.929986),//记录上一次地图移动结束后的中心坐标
	mapCenterPointSpan:50,//像素，两次地图移动结束后的最小中心距离
	
	mapScale:{//地图比例尺信息
		8:{zoom:8,//缩放级别
			scale:50000,//比例尺（m）
			width:68//比例尺图标宽度，像素
		},
		9:{zoom:9,scale:25000,width:68},
		10:{zoom:10,scale:20000,width:110},
		11:{zoom:11,scale:10000,width:110},

		12:{zoom:12,scale:5000,width:110},
		13:{zoom:13,scale:2000,width:85},
		14:{zoom:14,scale:1000,width:86},
		15:{zoom:15,scale:500,width:86},
		16:{zoom:16,scale:200,width:70},
		17:{zoom:17,scale:100,width:70},
		18:{zoom:18,scale:50,width:70},
		19:{zoom:19,scale:20,width:56}
	}, 
	infoBoxCollection:{},//信息框集合
	markerMap:new $.HashMap(),//地图标注集合
	
	map:null,//地图对象
	mrg:null,//标注管理器
	
	//初始化地图
	initMap:function(){
		var core=Core;
			map = new BMap.Map("cinemaMapBox");	
		if(!!(+core.coord.lng) && !!(+core.coord.lat)){//初始化地图是，如果存在当前城市坐标
			core.centerPoint = new BMap.Point(+core.coord.lng,+core.coord.lat);
		}
		map.centerAndZoom(core.centerPoint, 11);
		//map.setZoom(12);
		map.setMinZoom(10);//设置地图允许的最小级别
		//map.enableDragging();//启用地图拖拽，默认启用。 
		map.enableScrollWheelZoom();//启用滚轮放大缩小，默认禁用。 
		map.disableDoubleClickZoom();//启用双击放大，默认启用。 
		map.setDefaultCursor("default");//设置地图默认的鼠标指针样式。参数cursor应符合CSS的cursor属性规范。 
		
		map.addControl(new BMap.NavigationControl());// 添加平移缩放控件
		map.addControl(new BMap.ScaleControl()); //添比例尺控件
		
		//地图容器发生变化是触发  map.checkResize();
		map.addEventListener('resize', function(){
			//var point = this.getCenter();
			//console.log('resize==');
			
		});
		//地图缩放后触发
		map.addEventListener('zoomend', function(){
			//var point = this.getCenter();//返回地图当前中心点坐标。			
			//console.log('zoomend==:');
			
			var now=new Date();
			if((now - Core.mapZoomendTimePrev) < Core.mapZoomendTimeSpan){
				//地图缩放时间间隔小于 mapZoomendTimeSpan(800ms),不执行操作
				return;
			}
			core.mapZoomendTimePrev=now;//记录当前时间
			
			//地图缩放后过滤影院列表中坐标在可视区域的影院
			core.isSetCenter=false;
			core.filterPointInView();
			
		});
		//地图停止拖拽时触发。 
		map.addEventListener('dragend',function(){
			var now=new Date();
			if((now - Core.mapMoveTimePrev) < Core.mapMoveTimeSpan){//
				//地图缩放时间间隔小于 mapZoomendTimeSpan(700ms),不执行操作
				return;
			}
			core.mapMoveTime=now;//记录当前时间
			
			var centerPixSpan=core.calculatePix(core.mapCenterPointPrev,this.getCenter());//地图移动前后中心点的距离，像素
			if(Math.abs(centerPixSpan.x) < core.mapCenterPointSpan && Math.abs(centerPixSpan.y) < core.mapCenterPointSpan){
				//地图拖拽移动前后中心点的x方向或y方向距离（像素），大于mapCenterPointSpan，不执行操作
				return;
			}			
			core.mapCenterPointPrev=this.getCenter();//记录当前视图中心坐标
			
			//地图缩放后过滤影院列表中坐标在可视区域的影院
			core.isSetCenter=false;
			core.filterPointInView();
		});
		/*//地图移动结束时触发此事件。
		map.addEventListener('moveend', function(){
			console.log('moveend==');
			
		});*/
		/*//当地图所有图块完成加载时触发此事件，只在最开始时用一次。
		var handler_tilesloaded=function(){
			console.log('tilesloaded==');
			
			//map.panTo(core.centerPoint);//将地图的中心点更改为给定的点
			map.removeEventListener('tilesloaded',handler_tilesloaded);//移除事件监听
		};
		map.addEventListener('tilesloaded', handler_tilesloaded);*/
		
		core.map = map;
		//core.mgr = new BMapLib.MarkerManager(map,{});//创建标注管理器
		
	},
	//地图拖拽、缩放后过滤影院列表中坐标在可视区域的影院， todo:
	filterPointInView:function(){
		var core=Core,
			map=core.map;
		  	bounds=map.getBounds(),//返回地图可视区域，以地理坐标表示。 
			swPoint=bounds.getSouthWest(),//返回矩形区域的西南角坐标。 
			nePoint=bounds.getNorthEast();//返回矩形区域的东北角坐标。
		core.scrollFlag=true;
		
		var cinemaListCache=core.cinemaListCache,
			cinemaInViewList=core.cinemaInViewList=[],//清空先
			item,
			lng,//经度
			lat;//纬度
		for(var i=0,j=cinemaListCache.length;i<j;i++){
			item=cinemaListCache[i];
			lng=item.longitude;
			lat=item.latitude;
			if(lng > swPoint.lng && lng < nePoint.lng && lat > swPoint.lat && lat < nePoint.lat ){
				//经度大于西南角的经度，小于东北角的经度，且纬度大于西南角的纬度，小于东北角的纬度
				cinemaInViewList.push(item);
			}			
		}
			
		core.totalCount = cinemaInViewList.length;//修改总个数
		
		core.curPageIndex = 1;//过滤后，由于要刷新列表和地图，所有当前页码置为1
		
		core.updateList(true);//更新左侧列表信息
		core.createMarkers();//创建对应的标注	
	},
	/*
	 *批量创建地图标注 ，对应左侧列表的当页数据
	 */
	createMarkers:function(){
		var core=Core,
			cList=[];
		if(core.scrollFlag){//用来创建标注的可是区域内影院列表,地图缩放、拖拽后
			cList=core.cinemaInViewList;
		}else{//此时未进行地图缩放、拖拽操作，取原始数据，
			cList=core.cinemaListCache	
		}
		
		var map=core.map,mgr=core.mgr,markerMap=core.markerMap;
		//改变条件时，清除所有信息框-------------------------------------		
		core.infoBoxCollection={};//清楚信息框缓存
		markerMap.clear();//清空标注缓存
		map.clearOverlays(); //清除地图上所有覆盖物。
		//----------------------------------------------------------------------
		
		if(cList.length == 0) return;//缓存列表为空	
		
		var markerHtmlTml='<div cid="{cid}" id="{cid}" class="marker"><a class="bubble_red" title="{cname}"><label>{index}</label></a></div>',
			richMarker,item,cid,
			pageSize=core.pageSize,
			startIndex=(core.curPageIndex - 1) * pageSize,//每页第一个序号
			endIndex=startIndex+pageSize,//每页最后一个序号
			lng,lat,//经纬度
			lngMin,lngMax,//存储当前页影院的最大和最小经纬度
			latMin,latMax;
		
		//每次只创建pageSize个标注,一页
		for(var i=startIndex,n=1;i<endIndex;i++,n++){
			item=cList[i];
			if(!item){//比如：一页个数不足一页，循环到最后一个时，退出循环
				break;
			}
			lng=+item.longitude;
			lat=+item.latitude;	
			if(!!lng && !!lat){//坐标为0或没有的，不处理
				!lngMin && (lngMin=lngMax=lng) && (latMin=latMax=lat);//第一次先给存个值
				lngMin > lng && (lngMin = lng); 
				lngMax < lng && (lngMax = lng); 
				latMin > lat && (latMin = lat); 
				latMax < lat && (latMax = lat); 				
			}
			
			cid=item.id;
			//创建富媒体标注
			richMarker = new BMapLib.RichMarker($.format(markerHtmlTml,{'cid':cid,'cname':item.name,'index':n}), new BMap.Point(lng,lat),{
					"anchor" : new BMap.Size(-12, -37)//坐标点相对于图标左上角的偏移量，默认取图片中心点
			});
			richMarker.cinemaInfo=item;//在标注上存储影院信息
			richMarker.cid=cid;	
			
			markerMap.put(cid,richMarker);
						
			//标注点击事件
			richMarker.addEventListener("click", function(e) {
				var now=new Date();
				if((now - core.markerClickTimePrev) < core.markerClickTimeSpan){
					//标注点击时间间隔,不执行操作
					return;
				}
				core.markerClickTimePrev=now;//记录点击时间
				core.showInfoBox(this.cid,true);//显示信息框
			});			
			map.addOverlay(richMarker);//将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次。
			richMarker.disableDragging();//禁止标注被拖拽	
			
			//地图标注zIndex值
			var index = +($('#'+richMarker.cid,'#cinemaMapBox').parent().css('z-index'));
			core.marker_zIndexMax < index && (core.marker_zIndexMax = index);//记录最大zindex值
			
		}//中国经纬度范围：70 < lng < 140,2 < lat < 55
		//console.log(lngMin,lngMax,latMin,latMax,(lngMin+lngMax)/2,(latMin+latMax)/2);
		if(!!lngMin && !!lngMax){
			core.centerPoint=new BMap.Point((lngMin+lngMax)/2,(latMin+latMax)/2);//重新设置中心点,取最大和最小经纬度的平均值
		}
		if(core.isSetCenter){
			map.panTo(core.centerPoint);//将地图的中心点更改为给定的点
		}
	},
	//显示信息框，点击标注和左侧列表项时调用, cid:标注对应的影院id
	showInfoBox:function(cid,isCheck){
		var core=Core,
			markerMap=core.markerMap,
			infoBoxCollection=core.infoBoxCollection,
			marker=markerMap.get(cid);
		
		//先隐藏所有信息框
		for(var key in infoBoxCollection){
			!!infoBoxCollection[key] && infoBoxCollection[key].hide();
		}
		//并且将所有标注颜色设置成红色
		var val=markerMap.values(),m;
		for(var i=0;i<val.length;i++){
			m=val[i];
			m.setContent(m.getContent().replace('bubble_blue','bubble_red'));
		}		
		marker.setContent(marker.getContent().replace('bubble_red','bubble_blue'));//改变标注颜色
		//marker.setZIndex(99999);
		$('#'+marker.cid,'#cinemaMapBox').parent().css('z-index',core.marker_zIndexMax++);//将当前标注显示在最上面
		
		//获取和标注对应的信息框
		var infoBox=infoBoxCollection[cid];
		
		if(!infoBox){//如果当前信息框不存在，则创建,并缓存
			infoBoxCollection[cid]=core.createInfoBox(marker);
		}else{
			core.isSetCenter=false; 
			infoBox._panBox();//信息框平移到可视区内
			infoBox.show();//显示信息框
		}
		
		//标记对应的列表项被选中
		var cinemaList=$('#cinema_list'),len=cinemaList.find('li').length,li;
		li = cinemaList.find('li[cid="'+cid+'"]');
		cinemaList.find('>.active').removeClass('active');
		cinemaList.find('li').data('active','');
		li.addClass('active').data('active','1');//标记是否被选中，hover时用
		
		//判断对应列表项是否在可是区域内,点击标注时检查
		if(isCheck){
			var jspPane=cinemaList.parent(),
				jspContainer=jspPane.parent(),
				clientH=jspContainer.height()-41,//可视区域高度,(浮层高度41)
				scrollTop=Math.abs(parseInt(jspPane.css('top'))),//列表因滚动而隐藏的高度
				h=li.outerHeight(),//当前列表显示的高度
				top=0;//当前列表项到列表顶部的距离
			li.prevAll().each(function(k,v){
				top+=$(v).outerHeight();
			});
			//判断不在可是区域内
			if((top + h) > (clientH + scrollTop) || top < scrollTop){
				//后3个靠底，其于的移动到可视区域的顶部，
				if(li.index() >= (len-3)){ //todo:
					var t=0,jspPanelH=jspPane.height();
					li.nextAll().each(function(k,v){
						t+=$(v).outerHeight();
					});	
					t+=60;//分页区域高度60
					top=jspPanelH - clientH - t;//列表总高度-可视区域高度-列表下方因滚动隐藏的高度
				}
				jspPane.css({'top':-top+'px'});	
				//滚动条相关对象
				var jspTrack=jspContainer.find('.jspTrack'),
					jspDrag=jspContainer.find('.jspDrag');
				//根据比例算top值
				var dragTop=(jspTrack.height() - jspDrag.height())*top/(jspPane.height() - clientH);
				jspContainer.find('.jspDrag').css({'top':dragTop+'px'});
			}
		}
	},
	
	//创建信息框
	createInfoBox:function(marker){		
		var core=Core,cinema=marker.cinemaInfo,
			htmlTml=['<div class="cinema_map_info" cid="{cid}">',
				'<a href="javascript:;" class="map_close" cid="{cid}"></a>',
            	'<div class="map_shadow"></div>',
            	'<span class="map_arrow"></span>',
            	'<div class="cinema_map_top">',
                	'<div class="c_name f14 fb"><a href="/cinema/{cid}.html?#from=com.cinema.enter" target="_blank">{name}</a></div>',
                    '<div class="c_price"><span><em>¥{lowPrice}</em><i>起</i></span></div>',
                    '<div class="c_add">地址：{address}</div>',
                    '<div class="c_tel">电话：{tel}</div>',
                '</div>',
                '<div class="cinema_map_bottom">',
                	'<div class="c_btn"></div>',
                '</div>',
            '</div>'].join(''),
			content=$($.format(htmlTml,{'cid':cinema.id,'name':cinema.name,'lowPrice':cinema.lowPrice||'','address':cinema.address||'','tel':cinema.tel||''}));	
		//关键字标红
		var key = Core.postData.keywords;
		if(!!key){
			key=key.toUpperCase();	
			var obj = content.find('.c_name > a'), cont = cinema.name, idx = cont.toUpperCase().indexOf(key), len = key.length;						
			if(idx >= 0){
				var reg = new RegExp(key, "gi");//不区分大小写，全局匹配
				obj.html(cont.replace(reg,"<em>"+ cont.substr(idx,len)+"</em>"));
			}
		}
		
		//评分
		if(!!cinema.grade && cinema.grade > 0){
			var grade=cinema.grade;
			content.find('.c_name').append('<span class="score_s ml5">'+Math.floor(grade)+'.<em class="s">'+Math.floor(grade*10%10)+'</em></span>');
		}
		//价格
		var s=cinema.isSeatSupport||0+cinema.isCouponSupport||0+cinema.isGroupBuySupport||0;
		var c_price=content.find('.c_price');
		if(!cinema.lowPrice || s < 1){
			c_price.html('');
		}
		//支持在线选座
		if(cinema.isSeatSupport==1){
			c_price.append('<span class="icon_z"></span>');
		}
		//支持优惠券
		if(cinema.isCouponSupport==1){
			c_price.append('<span class="icon_q"></span>');
		}
		//支持团购
		if(cinema.isGroupBuySupport==1){
			c_price.append('<span class="icon_t"></span>');
		}
		//支持imax
		if(cinema.isImaxSupport==1){
			c_price.append('<span class="mtype_imax"></span>');
		}
		if(c_price.find('span').length == 0){
			c_price.remove();
		}
		//按钮
		var	c_btn=content.find('.c_btn');
		if(s >= 1){
			if(cinema.isSeatSupport == 1){
				c_btn.html('<a href='+cinema.id+'"/cinema/.html?ticketType=0#from=com.cinema.enter" class="btn_e34551 btn_89_29" target="_blank">购&nbsp;&nbsp;票</a>');
			}else{					
				c_btn.html('<a href='+cinema.id+'"/cinema/.html?ticketType=1#from=com.cinema.enter" class="btn_e34551 btn_89_29" target="_blank">购&nbsp;&nbsp;票</a>');
			}			
		}else if(!!cinema.movieList && cinema.movieList.length > 0){
			c_btn.html('<a href='+cinema.id+'"/cinema/.html?ticketType=1#pq=1&from=com.cinema.enter" class="btn_45a2e3 btn_89_29"  target="_blank">查看排期</a>');
		}else{
			c_btn.parent().remove();//没有按钮，则去掉按钮显示区域
			content.find('.cinema_map_top').css({'padding-bottom':'20px'});
		}
		
		
		content.find('.map_close').click(function(){
			var cid=$(this).attr('cid');
			!!core.infoBoxCollection[cid] && core.infoBoxCollection[cid].hide();
		});
		//创建信息框
		var infoBox = new BMapLib.InfoBox(core.map,content.get(0),{
			closeIconUrl: core.cdnBaseUrl+'/images/transparent.gif', //设置关闭按钮图标
			enableAutoPan: true //信息框是否平移到可视区内
		});
		var pos = core.pointMove(marker.getPosition(),-26,66);//偏移后的坐标，即信息框显示的位置(向右偏移26px，向上偏移66px)
		infoBox.open(pos);//打开信息框
		
		infoBox.cid=cinema.id;
		return infoBox;
	},
	//坐标偏移计算(x、y单位为像素)
	pointMove:function(oldPoint,x,y){
		var core=Core, map=core.map,
			oldPix = map.pointToPixel(oldPoint),
			x = !!x?x:0,y = !!y?y:0,
			newPix = new BMap.Pixel(oldPix.x - x, oldPix.y - y),
			newPoint = map.pixelToPoint(newPix);
		
		return newPoint;
	},
	//计算两坐标点(point1,point2)间的像素差
	calculatePix:function(point1,point2){
		var map=Core.map,
			pix1=map.pointToPixel(point1),//创建像素点对象实例。像素坐标的坐标原点为地图区域的左上角。 
			pix2=map.pointToPixel(point2);
			
		return {'x':pix2.x-pix1.x,'y':pix2.y-pix1.y};
	},
	//影院列表测试数据
	testData_cinemaList:function(){
		return {"cinemaList":[{
					"id":30510,
					"name":"UME国际影城双井店1",
			        "spell":"umeguojiyingchengshuangjingdian",
					"address":"详细地址的北京清河多大北京清河北京清河北京清河北京清河北京清河北京清河的",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.395645",
			        "latitude":"39.929986",
			        "lowPrice":25,
			        "isSeatSupport": 0,
					"isCouponSupport": 0,
			        "isGroupBuySupport":0,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "tel":"010-82732228",
					"grade":8.5,
			        "movieList":[]
				},{
					"id":30511,
					"name":"UME国际影城双井店2",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3100952",
			        "latitude":"39.9242704",
			        "lowPrice":25,
			        "isSeatSupport": 0,
					"isCouponSupport": 0,
			        "isGroupBuySupport":0,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "tel":"010-82732228",
					"grade":4.5,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					}]
				},{
					"id":30512,
					"name":"五道五道口3",
			        "spell":"wudaowudaokou3",
					"address":"五道口清华园",
					"districtId": 1233,
					"isHot": 1,
			        "isSeatSupport": 0,
					"isCouponSupport": 0,
			        "isGroupBuySupport":1,
					"isSeatSupportNow": 1,
					"isCouponSupportNow": 0,
			        "longitude":"116.3490952",
			        "latitude":"39.9549704",
			        "lowPrice":35,
					"grade":6.5,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					},{
						"id": 2,
					    "name":"2012 3D"
					},{
						"id": 3,
					    "name":"人再囧途之泰囧"
					}]
				},{
					"id":30513,
					"name":"五道五道口电影城口电影城4",
			        "spell":"wudaowudaokoudianyingcheng",
					"address":"五道口清华园",
					"districtId": 1233,
					"isHot": 1,
			        "isSeatSupport": 1,
					"isSeatSupportNow": 1,
					"isCouponSupportNow": 1,
			        "longitude":"116.3300952",
			        "latitude":"39.9422704",
			        "lowPrice":35,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					},{
						"id": 2,
					    "name":"2012 3D"
					},{
						"id": 3,
					    "name":"人再囧途之泰囧"
					},{
						"id": 4,
					    "name":"人再囧途之泰囧"
					},{
						"id": 5,
					    "name":"人再囧途之泰囧"
					},{
						"id": 6,
					    "name":"人再囧途之泰囧"
					}]
				},{
					"id":30514,
					"name":"五道五道口电影城口电影城5",
			        "spell":"wudaowudaokoudianyingcheng",
					"address":"五道口清华园",
					"districtId": 1233,
					"isHot": 1,
			        "isSeatSupport": 1,
					"isSeatSupportNow": 1,
					"isCouponSupportNow": 1,
			        "longitude":"116.3500952",
			        "latitude":"39.9342704",
			        "lowPrice":35,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					},{
						"id": 2,
					    "name":"2012 3D"
					},{
						"id": 3,
					    "name":"人再囧途之泰囧"
					},{
						"id": 4,
					    "name":"人再囧途之泰囧"
					},{
						"id": 5,
					    "name":"人再囧途之泰囧"
					},{
						"id": 6,
					    "name":"人再囧途之泰囧"
					}]
				},{
					"id":30515,
					"name":"五道五道口电影城口电影城6",
			        "spell":"wudaowudaokoudianyingcheng",
					"address":"五道口清华园",
					"districtId": 1233,
					"isHot": 1,
			        "isSeatSupport": 1,
					"isSeatSupportNow": 1,
					"isCouponSupportNow": 1,
			        "longitude":"116.380952",
			        "latitude":"39.952704",
			        "lowPrice":35,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					},{
						"id": 2,
					    "name":"2012 3D"
					},{
						"id": 3,
					    "name":"人再囧途之泰囧"
					},{
						"id": 4,
					    "name":"人再囧途之泰囧"
					},{
						"id": 5,
					    "name":"人再囧途之泰囧"
					},{
						"id": 6,
					    "name":"人再囧途之泰囧"
					}]
				},{
					"id":30516,
					"name":"五道五道口电影城口电影城7",
			        "spell":"wudaowudaokoudianyingcheng",
					"address":"五道口清华园",
					"districtId": 1233,
					"isHot": 1,
			        "isSeatSupport": 1,
					"isSeatSupportNow": 1,
					"isCouponSupportNow": 1,
			        "longitude":"116.3600952",
			        "latitude":"39.972704",
			        "lowPrice":35,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					},{
						"id": 2,
					    "name":"2012 3D"
					},{
						"id": 3,
					    "name":"人再囧途之泰囧"
					},{
						"id": 4,
					    "name":"人再囧途之泰囧"
					},{
						"id": 5,
					    "name":"人再囧途之泰囧"
					},{
						"id": 6,
					    "name":"人再囧途之泰囧"
					}]
				},{
					"id":30517,
					"name":"五道五道口电影城口电影城8",
			        "spell":"wudaowudaokoudianyingcheng",
					"address":"五道口清华园",
					"districtId": 1233,
					"isHot": 1,
			        "isSeatSupport": 1,
					"isSeatSupportNow": 1,
					"isCouponSupportNow": 1,
			        "longitude":"116.3788952",
			        "latitude":"39.932704",
			        "lowPrice":35,
			        "movieList":[{
						"id": 1,
					    "name":"少年派的奇幻漂流"
					},{
						"id": 2,
					    "name":"2012 3D"
					},{
						"id": 3,
					    "name":"人再囧途之泰囧"
					},{
						"id": 4,
					    "name":"人再囧途之泰囧"
					},{
						"id": 5,
					    "name":"人再囧途之泰囧"
					},{
						"id": 6,
					    "name":"人再囧途之泰囧"
					}]
				},{
					"id":30518,
					"name":"UME国际影城双店9",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3800952",
			        "latitude":"39.982704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30519,
					"name":"UME国际影城双井店10",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3900952",
			        "latitude":"39.932704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30520,
					"name":"UME国际影城双井店11",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3130952",
			        "latitude":"39.992704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30522,
					"name":"UME国际影城双井店12",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3160952",
			        "latitude":"39.932704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30523,
					"name":"UME国际影城双井店13",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3250952",
			        "latitude":"39.932704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30524,
					"name":"UME国际影城双井店14",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3350952",
			        "latitude":"39.932704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30525,
					"name":"UME国际影城双井店15",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.350952",
			        "latitude":"39.922704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30526,
					"name":"UME国际影城双井店16",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.350952",
			        "latitude":"39.926704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				},{
					"id":30527,
					"name":"UME国际影城双井店17",
					"address":"北京清河",
					"districtId": 1244,
					"isHot": 1,
			        "longitude":"116.3090952",
			        "latitude":"39.92704",
			        "lowPrice":25,
			        "isSeatSupport": 1,
					"isCouponSupport": 1,
					"isSeatSupportNow": 0,
					"isCouponSupportNow": 0,
			        "isImaxSupport":0,
			        "isGroupBuySupport":0,
			        "tel":"010-82732228",
			        "movieList":[]
				}]
			};	
	}
});

$.extend(BMapLib.InfoBox.prototype,{
		/**
		 * 自动平移infobox，使其在视野中全部显示(重写infoBox.js里的_panBox)
		 * @return none
		 */
		_panBox: function(){
			if(!this._opts.enableAutoPan){
				return;
			}
			var mapH = parseInt(this._map.getContainer().offsetHeight,10),
				mapW = parseInt(this._map.getContainer().offsetWidth,10),
				boxH = this._boxHeight,
				boxW = this._boxWidth;
			//infobox窗口本身的宽度或者高度超过map container
			if(boxH >= mapH || boxW >= mapW){
				return;
			}
			//如果point不在可视区域内
			if(!this._map.getBounds().containsPoint(this._point)){
				this._map.setCenter(this._point);
			}
			var anchorPos = this._map.pointToPixel(this._point),
				panTop=0,panBottom=0,panX=0,panY=0,
				//左侧超出，
				panLeft = boxW / 2 - anchorPos.x + Core.infoBoxOffset.l, 
				//右侧超出
				panRight = boxW / 2 + anchorPos.x - mapW;
			if(this._marker){
				var icon = this._marker.getIcon();
			}
			//基于bottom定位，也就是infoBox在上方的情况
			switch(this._opts.align){
				case INFOBOX_AT_TOP:
					//上侧超出
					var h = this._marker ? icon.anchor.height + this._marker.getOffset().height - icon.infoWindowAnchor.height : 0;
					panTop = boxH - anchorPos.y + this._opts.offset.height + h + 2 + Core.infoBoxOffset.t; 
					break;
				case INFOBOX_AT_BOTTOM:
					//下侧超出
					var h = this._marker ? -icon.anchor.height + icon.infoWindowAnchor.height + this._marker.getOffset().height + this._opts.offset.height : 0;
					panBottom = boxH + anchorPos.y - mapH + h + 4;
					break;
			}
			panX = panLeft > 0 ? panLeft : (panRight > 0 ? -panRight : 0);
			panY = panTop > 0 ? panTop : (panBottom > 0 ? -panBottom : 0);
			this._map.panBy(panX,panY);
		}	
	});	

})(window,jQuery,Core);