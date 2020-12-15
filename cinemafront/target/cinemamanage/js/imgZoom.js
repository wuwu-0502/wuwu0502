
/*
*影评图片放大
*2015-07-03 
*/
(function($){	
	$.imgZoom=function(options){
		var opt = $.extend({
			clickObj:options.obj,//通过clickObj绑定其他dom事件
			imgSrc:options.imgSrcObj,//大图地址
			curIndex:options.cInd//当前选中的图片
		},options);



		var photoBox=opt.clickObj.siblings(".photo_box"),
			showLeftBar=photoBox.find(".show_left_bar"),
			showRightBar=photoBox.find(".show_right_bar"),//包括大图左右按钮，和小图左右按钮


			showLeft=photoBox.find(".show_left"),//只是大图左右按钮，当只有一张时，不显示
			showRight=photoBox.find(".show_right"),
			showCenter=photoBox.find(".show_center"),


			showSmallLeft=photoBox.find(".show-small-left"),
			showSmallRight=photoBox.find(".show-small-right"),

			photoSmallList=photoBox.find(".photo_s_list"),//找到缩略图,因页面需绑定多个效果，所以通过查找dom绑定
			photoSmallListItem=photoSmallList.find("li"),
			imgLen=photoSmallListItem.length,
			photoBig=photoBox.find(".photo_big"),	
			imgBig=photoBig.find("img"),		
			curIndex=opt.curIndex;

	
		//大图数组
		//var imgBigSrc=["/mv/images/code/eleven/bg.png","/mv/images/code/eleven/img1.jpg","/mv/images/code/eleven/head_2.jpg","/mv/images/code/eleven/btn.png"];	
		var imgBigSrc=opt.imgSrc,
			c=curIndex,//记录上次点击index
			islock=0;

		function setImg(cIndex){
			if(islock){	
				return ;	
			}
			islock=1;//加锁

			//定位到指定图片
			//定位大图		

			imgBig.attr("src",imgBigSrc[cIndex]);

			if( $.isIE6 ){//ie6 不支持css max-width ,js限制
				var img = new Image();                
	            img.onload = function(){   
	                 var imgWIe=img.width,imgHIe=img.height,imgHIeZoom=450*imgHIe/imgWIe;    
	                 if(imgWIe > 450){
		            	imgBig.css("width","450px");
		            	//ie6 position:absolute;height:100%不起作用
						// showLeft.height(imgHIeZoom+"px");	
		    //          	showRight.height(imgHIeZoom+"px");
		    //          	showCenter.height(imgHIeZoom+"px");	            	
		             }else{
		             	imgBig.css("width","auto");
		             	//ie6 position:absolute;height:100%不起作用
		             	// showLeft.height(imgHIe+"px");
		             	// showRight.height(imgHIe+"px");
		             	// showCenter.height(imgHIe+"px");
		             }
		             img = null;
	            }                                   
	            img.src = imgBigSrc[cIndex];  
        	}      
         
			
			//定位缩略图
			photoSmallListItem.removeClass("active").eq(cIndex).addClass("active");
			//渐隐渐现效果	
			
			if(c!==cIndex){
				photoBig.find("li").css("opacity","0").animate({opacity: '1'}, { duration: 500 });
			}
			//当第一张时，左箭头置灰，当最后一张时，右箭头置灰		
			if(cIndex===0 && cIndex===imgLen-1){//只有一张时
				showSmallLeft.addClass("show-small-left-disable");
				showSmallRight.addClass("show-small-right-disable");
				showLeft.remove();
				showRight.remove();
				showCenter.css({"width":"100%","left":"0"})
			}else if(cIndex===0){
				showSmallLeft.addClass("show-small-left-disable");
				showSmallRight.removeClass("show-small-right-disable");
			}else if(cIndex===imgLen-1){
				showSmallLeft.removeClass("show-small-left-disable");
				showSmallRight.addClass("show-small-right-disable");
			}else{
				showSmallLeft.removeClass("show-small-left-disable");
				showSmallRight.removeClass("show-small-right-disable");
			}
			c=cIndex;
			islock=0;//解锁
		}
		
		setImg(curIndex);//刚展开定位当前图片

		//向左点
		showLeftBar.click(function(){
			if(curIndex < 0){
				curIndex=0;
			}
			if(curIndex > imgLen-1){
				curIndex=imgLen-1;
			}
			curIndex--;					
			
			if(curIndex < 1){
				showSmallLeft.addClass("show-small-left-disable");//点到第一张,缩略图向左按钮置灰
			}
			if(curIndex < 0){
				return;//点到第一张不可再点
			}			
			setImg(curIndex);
		})
		//向右点
		showRightBar.click(function(){
			if(curIndex < 0){
				curIndex=0;
			}
			if(curIndex > imgLen-1){
				curIndex=imgLen-1;
			}		
			curIndex++;

			if(curIndex > imgLen-2){//如共4张，大于等于第三张,即大于第二张，时置灰（索引0开始）
				showSmallRight.addClass("show-small-right-disable");//点到第一张,缩略图向左按钮置灰
			}
			if(curIndex > imgLen-1){
				return;//点到第一张不可再点
			}			
			setImg(curIndex);
		})
		//点缩略图时
		photoSmallListItem.click(function(){
			var clickItemIndex=$(this).index()-2;//此处减2，是因为dom结构中，li前有show-small-left，show-small-right,如不想减2，可修改dom，或把<a>放在</ul>前
			curIndex=clickItemIndex;
			//alert(curIndex);
			if(curIndex < 1){
				showSmallLeft.addClass("show-small-left-disable");
			}
			if(curIndex > imgLen-2){//如共4张，大于等于第三张,即大于第二张，时置灰（索引0开始）
				showSmallRight.addClass("show-small-right-disable");//点到第一张,缩略图向左按钮置灰
			}
			setImg(clickItemIndex);
		})
		//还原成小图
		showCenter.click(function(){
			photoBox.remove();
			opt.clickObj.show();
		})
		// if( $.isIE6 ){
		// 	//ie6 hover显示有问题
		// 	var photoBoxBig=$(".photo_box_b"),h=0;
		// 	photoBoxBig.find("a").hover(function(){
		// 		h=photoBoxBig.height();
		// 		$(this).find("b").show().css("top",(h/2)+"px");
		// 	},function(){
		// 		$(this).find("b").hide();
		// 	})
		// }		
	};
})(jQuery);
