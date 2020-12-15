/*
* 图片列表滑动组件（jQuery组件）
* 2013-08-05 田刚
*
*功能：
*1、点击箭头左右滑动，可以设置每次移动的个数、（不）满页显示、是否连续循环显示、是否自动滑动
*
*参数：options = {
*		isAutoSlide:true,//是否自动滑动,（自动滑动时满页显示且循环）
*		isLoop:false,//是否连续循环，为true时，始终满页显示，设置isFullPage无效，每次按moveSize移动
*		isFullPage:true,//是否始终满页显示图片,若为true，则可视区域外有几个就滑动多少距离，始终保持满页显示,
*		delayTime:3000,//自动滑动时，切换的时间间隔,(delayTime - duration)为两次滑动间停顿的时间
*		duration:500,//每次滑动需要的时间
*		moveSize:6,//一次移动的图片个数(移动幅度)
*		leftButton:  //左侧按钮id 或者jq对象
*		rightButton: //右侧按钮id 或者jq对象
*		listId:  //列表id 或者 jq对象
*		contentId: //容器id(可选，默认是list父节点)
*	}
*/
(function($){
	$.imgSlide=function(options){
		var ps = $.extend({
			isAutoSlide:false,
			isLoop:false,				
			isFullPage:false,
			delayTime:3000,
			duration:1000
		},options);
		var imgSlide={};

		var btnL = typeof ps.leftButton == "string" ? $("#" + ps.leftButton) : ps.leftButton, 
			btnR = typeof ps.rightButton == "string" ? $("#" + ps.rightButton) : ps.rightButton,
			list = typeof ps.listId == "string" ? $("#"+ps.listId) : ps.listId,
			content = !ps.contentId ? list.parent() : (typeof ps.contentId == "string" ? $("#"+ps.contentId) : ps.contentId),
			
			listCache=list.find('li'),//缓存最初的list，未做追加的
			liW=list.find('li:first').outerWidth(true),//显示一个图片的宽度
			countentW=content.width(),//显示区域宽度
			
			disableLBtn=true,//左箭头不可用
			disableRBtn=false,//右箭头可用

			totalNum = list.find('li').length,//图片总数	
			viewSize = Math.floor(countentW / liW),///一页显示的图片个数，即可视区域显示的图片个数（向下取整数）
			marLeft,//存储图片列表的 margin-left值
			isLock=0;//当前动画进行时，将其锁住,1:锁住，0：不锁
	
		//如果开启了自动滑动
		if(ps.isAutoSlide){
			var isAutoStop=false,//标记自动滑动是否停止
				autoStopTime=new Date(),//记录 自动滑动停止的 时间
				autoAgainTimeSpan = 3000;//自动滑动 无操作重启的时间间隔 3s
			
			ps.isLoop=true;//自动滑动时 循环
		}

		//图片总数，不超过一页,去掉左右箭头
		if(totalNum <= viewSize){
			!!btnL && btnL.remove();
			!!btnR && btnR.remove();
		}

		//移动幅度 默认取 一页显示的个数
		if(!ps.moveSize || ps.moveSize > viewSize){			
			ps.moveSize = viewSize;
		}
		
		//循环时，两端箭头按钮不禁用
		if(ps.isLoop){
			disableLBtn=false,
			disableRBtn=false,
			btnL.removeClass('noLeft');
			btnR.removeClass('noRight');
		}


		/*
		 *对外公开的方法：图片移动的具体操作, 
		 *direc: 图片移动方向 1:往左，-1：往右
		 *moveSize:一次移动的图片个数(移动幅度)
		 *autoStopFlag:开启自动滑动时，标记是否停止自动滑动（点击箭头或键盘方向键）
		*/
		imgSlide.slideFunc = function(direc,moveSize,autoStopFlag){
			if(direc > 0 && disableLBtn){
				//左箭头被禁用,为第一页
				return;
			}
			if(direc < 0 && disableRBtn){
				//右箭头被禁用，为最后一页
				return;
			}
			if(isLock){
				//当前动画被锁住
				return;	
			}
			isLock=1;//加锁
			
			if(typeof moveSize == 'boolean'){
				autoStopFlag = moveSize;
				moveSize='';
			}
			if(ps.isAutoSlide && autoStopFlag){
				isAutoStop=true;//标记自动滑动停止
				autoStopTime=new Date();//记录 自动滑动停止的 时间
			}
			moveSize = moveSize || ps.moveSize;
			marLeft=parseFloat(list.css('margin-left'));

			var totalNum_t = totalNum;//totalNum 始终不变，保持最初值
			//循环显示
			if(ps.isLoop){				
				totalNum_t=list.find('li').length;//此时 list可能有追加项
			}
			
			//计算未显示的图片个数
			var leftNum=Math.abs(marLeft / liW);///左边不在可视区的图片个数，可以为小数
			if(direc < 0){//点击右箭头后,图片往左移动
				leftNum = totalNum_t - viewSize - leftNum;//右边不在可视区的图片个数
			}

			liW = direc * Math.abs(liW);//取绝对值，始终为正数

			if(leftNum <= moveSize){  //未显示的图片个数 <= 移动幅度
				if(ps.isLoop){
					if(leftNum < moveSize){
						//循环显示，追加一个list
						fillItem(direc);
						leftNum = moveSize;//循环显示时，每次移动moveSize 个图片
						marLeft=parseFloat(list.css('margin-left'));//重新读取marginLeft					
					}
				}else{//不循环，改变箭头状态
					if(direc > 0){//点击左箭头
						btnL.addClass('noLeft');
						disableLBtn=true;
					}else{//点击右箭头后
						btnR.addClass('noRight');
						disableRBtn=true;
					}
				}

				if(ps.isFullPage){
					//始终满页显示图片,最后一次移动个数为剩余个数 
					marLeft = marLeft + leftNum * liW;
				}else{
					marLeft = marLeft + moveSize * liW;
				}		
			}else{
				marLeft= marLeft + moveSize * liW;				
			}
			//图片滑动动画
			list.stop().animate({"margin-left":marLeft},ps.duration,function(){
				if(ps.isLoop){//连续循环
					var leftNum=Math.abs(parseInt(marLeft / liW));//左边不在可视区的图片个数
					if(direc > 0){//往右滑动
						if(leftNum + viewSize <= totalNum){//此时leftNum + viewSize 小于等于 一个list长度
							list.find('li[t=1]').remove();//先移除追加项
							list.css({'margin-left':-leftNum * Math.abs(liW)});//改变图片列表位置
						}
					}else{//往左滑动
						var n=list.find('li').length - leftNum;//除了leftNum，剩下的图片个数(即viewSize+右边不在可视区域的图片个数)		
						if(n <= totalNum){//此时n 小于等于 一个list长度
							list.css({'margin-left':-(totalNum - n) * Math.abs(liW)});//改变图片列表位置
							list.find('li[t=1]').remove();//移除追加项
						}
					}
				}else{//不连续循环时，禁用相应的箭头
					if(direc > 0){//往右滑动
						btnR.removeClass('noRight');
						disableRBtn=false;
					}else{//往左滑动
						btnL.removeClass('noLeft');
						disableLBtn=false;
					}
				}
				
				isLock=0;//解锁
			});
		}
		//循环时用，追加图片列表 到头或尾部，
		function fillItem(direc){
			var dfg=document.createDocumentFragment(),
				lis=listCache.clone();//追加一个list
			lis.attr('t','1');//加标记
			
			if(direc > 0){
				var ml=parseFloat(list.css('margin-left'));
				ml = ml - totalNum * Math.abs(liW);
				list.prepend(lis).css({'margin-left':ml});//往左追加
			}else{
				list.append(lis);//往右追加
			}
		}
		//如果开启自动滑动
		if(ps.isAutoSlide){
			function autoSlide(){
				//自动滑动操作
				var t=setInterval(function(){
					if(isAutoStop){//如果标记停止自动滑动
						clearInterval(t);
						checkAutoAgain();
						return false;
					}
					imgSlide.slideFunc(-1);	
				},ps.delayTime);
			}
			autoSlide();

			//检查无操作时间间隔是否超过autoTimeSpan=3s，如果超过重启自动滑动
			function checkAutoAgain(){
				var t=setInterval(function(){
					var dt=new Date();
					if(dt - autoStopTime >= autoAgainTimeSpan){
						isAutoStop=false;
						clearInterval(t);
						autoSlide();
					}
				},1000);
			}
		}

		//绑定左右箭头事件，如果传入了点击对象的话
		!!btnL && btnL.unbind().bind('click',function(e){
			imgSlide.slideFunc(1,true);
		});
		!!btnR && btnR.unbind().bind('click',function(e){
			imgSlide.slideFunc(-1,true);
		});
		
		if(countentW > viewSize * Math.abs(liW)){//可视区域显示的图片个数不为整数
			//目前只处理一半的情况
			//图片列表项点击事件(如果图片只显示了一半，点击时移动显示完整)
			list.unbind().bind('click',function(e){
				var target=e.target||e.srcElement,
					liCur=$(target).closest('li');
				if(liCur.length){
					var index=$(liCur).index(),//当前点击的 图片的序列号
					marLeft=Math.abs(parseFloat(list.css('margin-left'))),
					countL=Math.floor(marLeft/liW),///左边隐藏的图片个数
					liW_t=Math.abs(liW);
	
					if((index + 1) * liW_t  > marLeft && (index + 1) * liW_t  < marLeft + liW_t){//点击左边显示一半的图片 
						imgSlide.slideFunc(1,0.5,true);
					}else if((index + 1) * liW_t  > marLeft + countentW){//点击右边显示一半的图片 
						imgSlide.slideFunc(-1,0.5,true);
					}
				}
			});
		}

		return imgSlide;
	}	
})(jQuery);




