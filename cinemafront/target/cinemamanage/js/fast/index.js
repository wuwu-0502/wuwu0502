/*
 * 首页js
 */
(function(window,$,Core){
$.extend(Core, {
	//初始化加载
	quickInit: function(){
		
	},
	//入口函数
	myInit : function(){
		var core=this,data=core.data;
		$.extend(core.data,{
			"date":$('#curDate').attr('showDate').trim(),
			"span":$('#curTime').attr('sid').trim(),
			"districtId":$('#curDistrict').length>0?$('#curDistrict').attr('did').trim():'',
			"groupBuyId":$.getUrlPara("groupBuyId")
		})
		core.bindCityListEvent();
		core.bindDateTimeListEvent();
		
		core.bindMovieEvent();
		core.bindCinemaEvent();
		core.bindTicketEvent();
		core.initScroll();
		
		if(!!core.data.groupBuyId){
			$('#curCity').find('a').each(function(k,v){
				v.href+='?groupBuyId='+core.data.groupBuyId;	
			});
			if($('#fast_buy').length){
				$('#fast_buy').get(0).href+='&groupBuyId='+core.data.groupBuyId;
			}
		}
		
		//切换按钮
		$('#schedule').find('.change').click(function(){
			var t=data.type;
			data.type = t==0?1:0;
			data.cinemaId=$('#cinemaList').find('li[class="active"]').attr('cid')||0;
			data.movieId=$('#playList').find('li[class="active"]').attr('mid')||0;
			
			window.location.href=$.format(core.curUrl()+'type={type}&date={date}&span={span}&districtId={districtId}&movieId={movieId}&cinemaId={cinemaId}',data);	
		});
		
		//切换按钮tips
		if(!$.cookie('fastChangeTips')){
			$('#schedule').find('.notes').css({"display":"block"});
			//关闭切换tips
			$('#schedule').find('.notes > .close').click(function(){
				$.cookie('fastChangeTips','1',{'expires':365,'path':'/','domain':'piao.163.com'});//过期时间一年	
				$('#schedule').find('.notes').remove();
			});
		}
		
		//重写title		
		if($.browser.msie && $("#vtit")[0]){
			var title=$("#vtit").val();
			document.title=title;
			setInterval(function(){	document.title=title;},	1000);
		};	
	},
	
	//data:{//缓存参数
//		"type":0,
//		"date":$('#curDate').attr('showDate').trim(),
//		"span":$('#curTime').attr('sid').trim(),
//		"districtId":$('#curDistrict').attr('did').trim(),
//		"cinemaId":"",
//		"movieId":"",
//		"ticketId":"",
//		"groupBuyId":""
//	},
	//当前页面地址
	curUrl:function(){
		var url = $('#curUrl').val().trim()+'?';
		if(!!Core.data.groupBuyId){
			url+='groupBuyId='+Core.data.groupBuyId+'&';
		}
		//return url+'type={type}&date={date}&span={span}&districtId={districtId}&movieId={movieId}&cinemaId={cinemaId}';
		return url;
	},
	//初始化滚动条
	initScroll:function(){
		$('.fast_movie_box').jScrollPane();
		$('.fast_cinema_box').jScrollPane();
		$('.fast_sch_box').jScrollPane();
		
		
		
		
		$('.jspHorizontalBar').remove();
		$('.jspScrollable').removeAttr('tabindex');//360浏览器有篮筐
	},
	//初始化城市切换列表  
	bindCityListEvent : function(){
		var switchCity = $('#f_switchCity');
		//导航列表展开			
		switchCity.hover(
			function(){
				$('#quickSearchInp').blur();
				switchCity.addClass("active")
				  			.find('.triangle').addClass('triangleToUp');
				$('.cityListBox').jScrollPane();
				$('.jspHorizontalBar').remove();
				$('.jspScrollable').removeAttr('tabindex');//360浏览器有篮筐
			},
			function(){
				switchCity.removeClass("active")
							.find('.triangle').removeClass('triangleToUp');
			}
		);
	},
	//日期和时段列表事件
	bindDateTimeListEvent:function(){
		var core=Core,data=core.data,date=$('#date'),time=$('#time');
		date.hover(function(){
			$('#quickSearchInp').blur();
			date.addClass('active')
				  	.find('.triangle').addClass('triangleToUp');
		},function(){
			date.removeClass('active')
					.find('.triangle').removeClass('triangleToUp');
		});
		date.find('ul').click(function(e){
			var e=window.event||e;
			var target=e.srcElement||e.target;
			var li=$(target).closest('li');
			if(!!li){
				core.data.date=li.attr("showDate").trim();
				
				window.location.href=$.format(core.curUrl()+'type={type}&date={date}',data);
			}	
		});
		
		time.hover(function(){
			$('#quickSearchInp').blur();
			time.addClass('active')
				  	.find('.triangle').addClass('triangleToUp');
		},function(){
			time.removeClass('active')
					.find('.triangle').removeClass('triangleToUp');
		});
		time.find('ul').click(function(e){
			var e=window.event||e;
			var target=e.srcElement||e.target;
			var li=$(target).closest('li');
			if(!!li){
				core.data.span=li.attr("sid").trim();
				window.location.href=$.format(core.curUrl()+'type={type}&date={date}&span={span}',data);
			}	
		});
	},
	//电影列表事件
	bindMovieEvent:function(){
		var core=Core,data=core.data;
		
		$('#schedule').delegate("#playList","click",function(e){
			var e=window.event||e;
			var target=e.srcElement||e.target;
			var li=$(target).closest('li');
			if(li.length>0){
				data.cinemaId=$('#cinemaList').find('li[class="active"]').attr('cid')||0;					
				data.movieId=li.attr('mid')||0;
				
				if(data.type==1 && $('#cinemaList').find('li[class="active"]').length <= 0){
					data.type=0;
										
					window.location.href=$.format(core.curUrl()+'type={type}&date={date}&span={span}&districtId={districtId}&movieId={movieId}&cinemaId={cinemaId}',data);
					return;
				}
				$(this).find('li').removeClass('active');
				li.addClass('active');
				if(data.type==0){
					//电影列表在左边时
					core.getPost(2);
				}else{
					core.getPost(3);
				}	
			}
		});	
	},
	//影院列表事件
	bindCinemaEvent:function(){
		var core=Core,data=core.data,
			schedule=$('#schedule'),
			districtList=$("#districtList");
			
			
		//选择地区
		schedule.delegate('#curDistrict','mouseover',function(){
			$('#quickSearchInp').blur();
			$(this).parent().addClass('active');
			//如果城区太多，显示滚动条
			districtListHeight=parseFloat(districtList.outerHeight());			
			if(districtListHeight > 300){
				$('#districtList').css("height","400px").jScrollPane();
				$('.jspScrollable').removeAttr('tabindex');//360浏览器有篮筐
			};
			return false;
		}).delegate('#curDistrict','mouseout',function(){
			$(this).parent().removeClass('active');	
			return false;
		});		
		schedule.delegate('#districtList','mouseover',function(){
			$('#quickSearchInp').blur();
			$(this).parent().addClass('active');	
			return false;
		}).delegate('#districtList','mouseout',function(){
			$(this).parent().removeClass('active');	
			return false;
		});
		schedule.delegate('#districtList','click',function(e){
			var e=window.event||e,
				target=e.srcElement||e.target,
				li=$(target).closest('li');
			if(li.length>0){
				data.districtId=li.attr('did');
				data.cinemaId=0;
				window.location.href=$.format(core.curUrl()+'type={type}&date={date}&span={span}&districtId={districtId}',data);
			}
		});
		
		//快速搜索过滤
		schedule.delegate('#quickSearchInp','keyup',function(){
			var val=$(this).val().trim().toLowerCase(),
				flag=false;//标志是否有查找的项
			$('#cinemaList > li').each(function(k,v){
				var n=-1,m=-1;
				if(!!$(v).text()){
					n = $(v).text().toLowerCase().indexOf(val);	//name
				}
				if($(v).attr('spell')){
					m = $(v).attr('spell').toLowerCase().indexOf(val);//spell
				}
				if(n >= 0 || m >= 0 ){
					$(v).removeClass('none');
					flag=true;
				}else{
					$(v).addClass('none');	
				}
			});
			if(!flag){
				$('#cinemaList').find('.noResult').removeClass('none');
			}else{
				$('#cinemaList').find('.noResult').addClass('none');
			}
		});	
		schedule.delegate('#quickSearchInp','focus',function(){
			$(this).removeClass('textGray');
			if(this.value.trim()=='快速搜索影院'){
				this.value='';
			}
		});			
		schedule.delegate('#quickSearchInp','blur',function(){
			if(this.value.trim()==''){
				this.value='快速搜索影院';
				$(this).addClass('textGray');
			}
		});
		
		//点击影院
		schedule.delegate('#cinemaList','click',function(e){
			var core=Core,data=core.data,
				e=window.event||e,
				target=e.srcElement||e.target,
				li=$(target).closest('li');
				
			if(li.length>0){
				data.movieId=$('#playList').find('li[class="active"]').attr('mid')||0;
				data.cinemaId=li.attr('cid')||0;
				
				if(data.type==0 && $('#playList').find('li[class="active"]').length <= 0){
					data.type=1;
										
					window.location.href=$.format(core.curUrl()+'type={type}&date={date}&span={span}&districtId={districtId}&movieId={movieId}&cinemaId={cinemaId}',data);
					return;
				}
				$(this).find('li').removeClass('active');
				li.addClass('active');
				if(data.type==0){
					//影院列表在中间时
					core.getPost(3);
				}else{
					//影院列表在左边时
					core.getPost(2);
				}								
			}
		});
	},
	//场次页面事件
	bindTicketEvent:function(){
		var core=Core,data=core.data,schedule=$('#schedule');
		schedule.delegate('#ticketList','click',function(e){
			var e=window.event||e,
				target=e.srcElement||e.target,
				li=$(target).closest('li');
				if(li.length>0){
					$(this).find('li').removeClass('active');
					li.addClass('active');					
					data.ticketId=li.attr('tid').trim();
					data.cinemaId=$('#cinemaList').find('li[class="active"]').attr('cid')||0;
					data.movieId=$('#playList').find('li[class="active"]').attr('mid')||0;
					
					core.getPost(4);					
				}
		});
	},
	//请求页面
	getPost:function(type){
		var core=Core,data=core.data,url='/'+$('#curCity').attr('pspell').trim()+'/'+core.fastFlag,obj=$('#schedule'),loadingPanel;
		switch(type){
			case 1: 
				url+="/schedule.html";
				obj=$('#schedule');
				break;
			case 2:
				url+="/schedule2.html";
				obj=$('#schedule2');
				var left = data.type == 0?'270px':'240px';
				loadingPanel = core.loadingPanel({'renderTo':$('#schedule'),width:'710px',style:{'left':left,'top':'50px'}});//初始化loading层 
				break;
			case 3:
				url+="/schedule3.html";
				obj=$('#schedule3');
				loadingPanel = core.loadingPanel({'renderTo':$('#schedule'),width:'450px',style:{'left':'500px','top':'50px'}});
				break;
			case 4:
				url+="/schedule4.html";
				obj=$('#schedule4');
				loadingPanel = core.loadingPanel({'renderTo':$('#schedule'),width:'209px',style:{'left':'740px','top':'50px'}});
				break;
		}
		
		//url='/fast/schedule3.ftl';		
		core.post(url,core.data,function(err,rs){
			!!loadingPanel && loadingPanel.clear();//移除loading层
			if(!err){
				if(type==1){
					
				}else{
					obj.replaceWith(rs);
					if(!!data.groupBuyId){
						$('#fast_buy').get(0).href+='&groupBuyId='+data.groupBuyId;	
					}
					core.initScroll();
				}
			}
		});
	}
});

})(window,jQuery,Core);