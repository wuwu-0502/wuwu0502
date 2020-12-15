/*
 * 电影模块公共js
 * 主要是“想看”按钮事件和蒙层显示flash。有几个页面用到故而提取出来
 * 注： 当前城市模块 城市id：myCity ，自定义属性pid为城市id
 * edit by jiangyunbao  at  2012-10-26
 */
(function(window,$,Core){
$.extend(Core, {
	//选座兑换券tab切换事件，主要修改全局变量curCinemaTab
	subTabClick: function(e){		
		var obj =  $(e.target).closest("li"),core = Core, movieInfo = $("#movieInfo"), rel = obj.attr("rel"),
			postData = core.postData,buySeat,buyCoupon;
			
		if(!obj[0] || obj.hasClass("active")) return;
		obj.siblings().removeClass("active");
		obj.addClass("active");
		if(rel == "#subPart1"){
			//统计电影详情页面，在线选座点击次数
			try{
				buySeat='http://piao.163.com/'+Core.curCity.spell+'/movie/'+Core.movieId+'.html?buyseat';
				neteaseTracker(true,buySeat,"在线选座",null);
			}catch(e){}
			$("#subPart2").hide();
		}else{
			//统计电影详情页面，兑换券点击次数
			try{			
				buyCoupon='http://piao.163.com/'+Core.curCity.spell+'/movie/'+Core.movieId+'.html?buycoupon';
				neteaseTracker(true,buyCoupon,"在线选座",null);
			}catch(e){}
			$("#subPart1").hide();
		}
		$(rel).show();
		core.getPost();	
	},
	//详情页面表格鼠标滑过的效果
	overTable:function(){
		$("body").delegate(".movieTbodyAct tr", "mouseenter", function(){
			$(this).addClass("active");
		}).delegate(".movieTbodyAct tr", "mouseleave", function(){
			$(this).removeClass("active");
		})
	},
	//版本点击显示下拉列表
	dmFilterClick: function(e){
		var target = $(e.target), obj  = $(this), table = obj.closest("table"), core = Core;
  		
		if(target[0].tagName.toUpperCase() == "A"){
			core.dmFilterEv(target.parent());
		}else if(!table.attr("hasGetFilter")){ //在table上保存一个数据用以标志过滤数据是否已经生成，ajax请求数据后会将该值置为false
			core.getDmFilterList(obj.closest("table"));
			table.attr("hasGetFilter", true);
		}		
		if(obj.hasClass("active")){
			obj.removeClass("active");
		}else{
			obj.addClass("active");	
			if(obj.attr("isDocClick")) return;
			obj.attr("isDocClick",true);
			window.setTimeout(function(){		
				$(document.body).bind('click',function(e){
					var target = $(e.target), copy = target.closest(".copy");
					if(copy.length){
						return false;	
					}else{
						obj.removeClass("active");
					}
				});	
			},100);
		}
		e.stopPropagation();
	},
	//过滤表格数据
	dmFilterEv: function( obj ){		
		var	val = obj.attr("val"), movieTbody = obj.closest("table").find("tbody"), tr = movieTbody.find("tr[dm]");
		if(val == "-1"){
			tr.removeClass("hide");	
		}else{
			tr.each(function(){
				var obj = $(this);
				if(obj.attr("dm").toLowerCase() == val.toLowerCase()){
					obj.removeClass("hide");	
				}else{
					obj.addClass("hide");	
				}
			});
		}
	},
	uniqueArr: function(arr){
		var a = [], n= arr.length, i=0, copy={};
		for(; i<n; i++){
			if( !copy[arr[i]] ){
				a.push(arr[i]);
				copy[arr[i]] = true;
			}
		}
		return a;
	},
	//生成版本过滤下拉列表
	filterList: [],
	dmTypeMap: {"imax": "mtype_imax", "2d":"mtype_2d","3d":"mtype_3d","4d":"mtype_4d","数字":"mtype_num","胶片":"mtype_jp"},
	getDmFilterList: function(table){		
		var list = this.getListFromTbl(table);
		//var list = ["数字","3d","3d","2d","2d","胶片"];
		if(list && list.length){
			//去重
			//list && $.unique(list);			
			list = Core.uniqueArr(list);
			list.sort();
			var len = list.length, html = ['<li val="-1"><a href="javascript:;">全部</a></li>'];
			for(var i=0; i<len; i++){
				var txt = list[i];
				html[i+1] = '<li val="' + txt.toLowerCase() + '"><a href="javascript:;">' + txt + '</a></li>';
				//html[i] = '<li><a href="javascript:;"><span class="mtype ' + this.dmTypeMap[txt] + '"></span></a></li>';
			}
			table.find(".sel_copy").html(html.join(""));
		}
	},
	getListFromTbl: function(table){
		var dmList = [];
		table.find("tr").each(function(){
			var dm  = $(this).attr("dm");
			dm && dmList.push(dm);
		});
		return dmList;
	}
});

})(window,jQuery,Core);