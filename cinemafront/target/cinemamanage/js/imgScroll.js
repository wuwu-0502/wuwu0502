
/*
*图片轮播组件，带大图和缩略图（jQuery组件）
*2013-08-06  田刚
*参数：options = {
*		showType:0,//大图展示效果类型 0:fade,1:slide,2:zoom逐渐放大，
*		isLoop:false,//是否连续循环，
*		autoScroll:false,//是否自动切换
*		autoAgainTimeSpan : 3000,//自动切换停止后 无操作重启的时间间隔 3s
*		delayTime:3000,//自动切换间隔时间,(delayTime - duration = 大图两次滑动的时间间隔)
*		duration:500,//大图每次滑动需要的时间
*		imgBigList:null,//大图列表
*		imgSmallList:null,//切换大图的缩略图列表 
*		barList:null,//切换大图的图标列表,导航点
*  		leftBtn:null,//大图向左按钮
*  		rightBtn:null,//大图向右按钮
*		eventType:'mouseover',//切换的事件类型，click、mouseover
*		onChange:null,//图片切换完成后 回调
*		onInit:null//初始化时执行
*	}
*使用：$.imgScroll（options）；
*
*/
(function($){	
	$.imgScroll=function(options){
		var opt = $.extend({
			showType:0,//大图展示效果类型 0:fade,1:slide,2:zoom逐渐放大，
			isLoop:false,//是否连续循环，
			autoScroll:false,//是否自动切换
			autoAgainTimeSpan : 3000,//自动切换停止后 无操作重启的时间间隔 3s
			delayTime:3000,//自动切换间隔时间,(delayTime - duration = 大图两次切换的时间间隔)
			duration:300,//大图每次切换需要的时间
			imgBigList:null,//大图列表
			imgSmallList:null,//切换大图的缩略图列表 
			barList:null,//切换大图的图标列表,导航点
	  		leftBtn:null,//大图向左按钮
	  		rightBtn:null,//大图向右按钮
			eventType:'mouseover',//切换的事件类型，click、mouseover
			onChange:null,//图片切换完成后 回调
			onInit:null//初始化时执行
		},options);

		var	imgBigCache = opt.imgBigList.find('li'),//缓存大图列表项
			
			islock=0,//当前动画进行时，将其锁住
			curIndex=0,//记录当前图片序号
			oldIndex=0,//
			totalNum = imgBigCache.length,//大图总数
			bWidth=imgBigCache.first().outerWidth(true),//大图每次移动距离（一个大图的宽度）
			bHeight=imgBigCache.first().outerHeight(),//大图每次移动距离（一个大图的宽度）
		
			isAutoStop=false,//标志是否停止自动切换
			autoStopTime=new Date();//记录停止的时刻
		
		if(opt.showType != 1){ //slide
			opt.imgBigList.addClass('photo_b_list_fixed')//大图列表设置固定宽度
							.find('li:first').addClass('active');				
		}

		//如果有小图列表
		if(!!opt.imgSmallList){
			var sWidth=opt.imgSmallList.find('li:first').outerWidth(true),//一个小图的宽度  152px
				sTotalNum=opt.imgSmallList.find('li').length,//小图总数
				sViewSize = Math.floor(opt.imgSmallList.parent().width() / sWidth);//一页显示的小图个数(即可视区域)

		}else if(!opt.barList){//没有小图时，默认使用导航点
			var bar_list=$('<div class="photo_bar_list"></div>');
			for(var i=0;i<totalNum;i++){
				bar_list.append('<a href="javascript:;" index="'+i+'"></a>');
			}
			bar_list.find('a:first').addClass('active');
			
			opt.imgBigList.after(bar_list);
			opt.barList = bar_list;
		}

		//如果开启自动切换 ，且大图总数大于1
		if(opt.autoScroll && totalNum > 1){
			//自动切换,图片默认向左滑动，
			function autoScrollFunc(){
				var t = setInterval(function(){
					if(isAutoStop){//停止自动切换
						clearInterval(t);
						checkTimeSpan();
						return false;
					}
					showFunc(-1);
				},opt.delayTime);	
			}
			autoScrollFunc();
			
			//间隔1s，检查当前时间与停止时间间隔是否超过制定的时间间隔（3s），超过后重起自动切换
			function checkTimeSpan(){
				var t = setInterval(function(){
					var dt=new Date();
					//(当前时间-最后一次点击时的时间)
					if(dt - autoStopTime >= opt.autoAgainTimeSpan){						
						isAutoStop=false;
						clearInterval(t);
						autoScrollFunc();
					}
				},1000)	
			}
		}

		//如果有缩略图，绑定缩略图点击事件
		if(!!opt.imgSmallList){
	  		opt.imgSmallList.find('li').bind(opt.eventType,function(e){
	  			if($(this).hasClass('active')) return;
				showFunc(0,$(this).index(),true);
	  		});

		}
		//如果导航点，绑定导航点点击事件  
		if(!!opt.barList){
			opt.barList.find('a').first().addClass('active');
	  		opt.barList.find('a').bind(opt.eventType,function(e){
				if($(this).hasClass('active')) return;
				showFunc(0,opt.barList.find('a').index(this),true);
			});
		}

		//如果有左右按钮,绑定按钮点击事件-------------
		if(!!opt.leftBtn){
			//向左箭头
			opt.leftBtn.click(function(){			
				showFunc(1,true);
			});
		}		
		if(!!opt.rightBtn){
			//向右箭头
			opt.rightBtn.click(function(){
				showFunc(-1,true);
			});
		}
		//------------------------------------------------
		
		//外部初始化方法
		!!opt.onInit && opt.Init();

		/*
		 *图片切换操作,
		 *index：点击缩略图时，直接传图片序号
		 *direc：大图移动方向，-1往左，1往右
		 *autoStopFlag:开启自动切换时，标记是否停止自动滑动（点击缩略图或箭头）
		*/
		var showFunc=function(direc,index,autoStopFlag){
			if(islock){	
				return ;	
			}
			islock=1;//加锁

			if(typeof index == 'boolean'){
				autoStopFlag=index;
				index=undefined;
			}

			if(opt.autoScroll && autoStopFlag){
	  			isAutoStop=true;//标记停止自动切换
	  			autoStopTime=new Date();//记录停止自动切换的时刻
			}
			var showType=opt.showType;
			if(showType == 0){
				_fade(direc,index);
			}else if(showType == 1){
				_slide(direc,index);
			}else if(showType == 2){
				_zoom(direc,index);
			}else if(showType == 3){
				_slideV(direc,index);
			}
		},
		//渐隐渐现
		_fade=function(direc,index){
			oldIndex=curIndex;			
			if(index >= 0){//点击缩略图，直接传index
				curIndex=index;	
				direc=0;
			}
			if(direc < 0){//点击向右箭头
				if(curIndex >= totalNum - 1){//当前已为最后一个
					curIndex=-1;
				}
				++curIndex;
			}else if(direc > 0){//点击向左箭头
				if(curIndex <= 0){//当前为第一个
					curIndex = totalNum;
				}
				--curIndex;
			}
			//改变切换区域选中状态
			if(!!opt.imgSmallList){
				opt.imgSmallList.find('>.active').removeClass('active');
				opt.imgSmallList.find('li').eq(curIndex).addClass('active');
			}
			if(!!opt.barList){
				opt.barList.find('>.active').removeClass('active');
				opt.barList.find('a').eq(curIndex).addClass('active');
			}

			//动画效果 
			var lis=opt.imgBigList.find('li');
			lis.eq(oldIndex).stop(true,true).attr('class','preImg');//停止上一次动画
			lis.eq(curIndex).addClass('active').css({'opacity':0.2})
						.animate({'opacity':1},opt.duration,function(){							
							lis.removeClass('preImg');//当前图片变化期间的 底色
							!!opt.onChange && opt.onChange(curIndex);
						});

			islock=0;//解锁
						
		},
		//滑动
		_slide=function(direc,index){
			if(index >= 0){//点击缩略图，直接传index
				curIndex=index;	
				direc=0;
			}
			if(direc < 0){//点击向右箭头
				if(curIndex >= totalNum - 1){//当前已为最后一个
					if(opt.isLoop){
						//如果连续循环显示，复制第一个图片加到图片列表最后
						opt.imgBigList.append(imgBigCache.first().clone());
					}else{
						curIndex=-1;
					}
				}
				++curIndex;
			}else if(direc > 0){//点击向左箭头
				if(curIndex <= 0){//当前为第一个
					if(opt.isLoop){
						//如果连续循环显示，复制最后一个图片加到图片列表最前，同时改变列表的marginLeft值
						opt.imgBigList.prepend(imgBigCache.last().clone());
						opt.imgBigList.css({'margin-left': -bWidth});
					}else if(curIndex <= 0){
						curIndex = totalNum;
					}
				}
				--curIndex;
			}
			//margin-left
			var marleft = -(curIndex * bWidth);
			if(curIndex < 0){
				//此时为连续循环显示,将显示 追加到最前的图片
				marleft = 0;
			}
			var curIndex_t=curIndex;
			if(opt.isLoop && direc != 0){
				if(curIndex_t > (totalNum - 1)){
					//当前显示的是加到列表最后的图片
					curIndex_t = 0;
				}else if(curIndex_t < 0){
					//当前显示的是加到列表最前的图片
					curIndex_t = totalNum - 1;
				}
			}
			//改变切换区域选中状态
			if(!!opt.imgSmallList){
				opt.imgSmallList.find('>.active').removeClass('active');
				opt.imgSmallList.find('li').eq(curIndex_t).addClass('active');
			}
			if(!!opt.barList){
				opt.barList.find('>.active').removeClass('active');
				opt.barList.find('a').eq(curIndex_t).addClass('active');
			}
			//动画效果
			opt.imgBigList.stop(true,true).animate({'margin-left':marleft},opt.duration,function(){
				//islock=0;//动画完成后，解锁
				var index_t = curIndex;

				//如果为连续循环显示，且点击的左右箭头
				if(opt.isLoop && direc != 0){
					if(index_t > (totalNum - 1)){
						//当前显示的是加到列表最后的图片，此时调整列表位置显示第一个图片，同时删除追加的图片
						curIndex = 0;
						opt.imgBigList.css({'margin-left': 0});
						opt.imgBigList.find('li:last').remove();
					}
					if(index_t < 0){
						//当前显示的是加到列表最前的图片，此时先删除追加的图片，同时调整列表位置显示最后一个图片
						curIndex = totalNum - 1;
						opt.imgBigList.find('li:first').remove();
						opt.imgBigList.css({'margin-left': -(curIndex * bWidth)});
					}
				}
				!!opt.onChange && opt.onChange(curIndex);
			});	
			islock=0;//动画完成后，解锁
		},
		//上下滑动
		_slideV=function(direc,index){
			if(index >= 0){//点击缩略图，直接传index
				curIndex=index;	
				direc=0;
			}
			if(direc < 0){//点击向右箭头
				if(curIndex >= totalNum - 1){//当前已为最后一个
					if(opt.isLoop){
						//如果连续循环显示，复制第一个图片加到图片列表最后
						opt.imgBigList.append(imgBigCache.first().clone());
					}else{
						curIndex=-1;
					}
				}
				++curIndex;
			}else if(direc > 0){//点击向左箭头
				if(curIndex <= 0){//当前为第一个
					if(opt.isLoop){
						//如果连续循环显示，复制最后一个图片加到图片列表最前，同时改变列表的marginLeft值
						opt.imgBigList.prepend(imgBigCache.last().clone());
						opt.imgBigList.css({'margin-top': -bHeight});
					}else if(curIndex <= 0){
						curIndex = totalNum;
					}
				}
				--curIndex;
			}
			//margin-left
			var martop = -(curIndex * bHeight);
			if(curIndex < 0){
				//此时为连续循环显示,将显示 追加到最前的图片
				martop = 0;
			}
			var curIndex_t=curIndex;
			if(opt.isLoop && direc != 0){
				if(curIndex_t > (totalNum - 1)){
					//当前显示的是加到列表最后的图片
					curIndex_t = 0;
				}else if(curIndex_t < 0){
					//当前显示的是加到列表最前的图片
					curIndex_t = totalNum - 1;
				}
			}
			//改变切换区域选中状态
			if(!!opt.imgSmallList){
				opt.imgSmallList.find('>.active').removeClass('active');
				opt.imgSmallList.find('li').eq(curIndex_t).addClass('active');
			}
			if(!!opt.barList){
				opt.barList.find('>.active').removeClass('active');
				opt.barList.find('a').eq(curIndex_t).addClass('active');
			}
			//动画效果
			opt.imgBigList.stop(true,true).animate({'margin-top':martop},opt.duration,function(){
				//islock=0;//动画完成后，解锁
				var index_t = curIndex;

				//如果为连续循环显示，且点击的左右箭头
				if(opt.isLoop && direc != 0){
					if(index_t > (totalNum - 1)){
						//当前显示的是加到列表最后的图片，此时调整列表位置显示第一个图片，同时删除追加的图片
						curIndex = 0;
						opt.imgBigList.css({'margin-top': 0});
						opt.imgBigList.find('li:last').remove();
					}
					if(index_t < 0){
						//当前显示的是加到列表最前的图片，此时先删除追加的图片，同时调整列表位置显示最后一个图片
						curIndex = totalNum - 1;
						opt.imgBigList.find('li:first').remove();
						opt.imgBigList.css({'margin-top': -(curIndex * bHeight)});
					}
				}
				!!opt.onChange && opt.onChange(curIndex);
			});	
			islock=0;//动画完成后，解锁
		},
		//逐渐放大 todo:
		_zoom=function(direc,index){
			oldIndex=curIndex;			
			if(index >= 0){//点击缩略图，直接传index
				curIndex=index;	
				direc=0;
			}
			if(direc < 0){//点击向右箭头
				if(curIndex >= totalNum - 1){//当前已为最后一个
					curIndex=-1;
				}
				++curIndex;
			}else if(direc > 0){//点击向左箭头
				if(curIndex <= 0){//当前为第一个
					curIndex = totalNum;
				}
				--curIndex;
			}
			//改变切换区域选中状态
			if(!!opt.imgSmallList){
				opt.imgSmallList.find('>.active').removeClass('active');
				opt.imgSmallList.find('li').eq(curIndex).addClass('active');
			}
			if(!!opt.barList){
				opt.barList.find('>.active').removeClass('active');
				opt.barList.find('a').eq(curIndex).addClass('active');
			}

			//动画效果 ,(样式scale里transition时间要>=opt.delayTime，不然自动切换时有停顿)
			var lis=opt.imgBigList.find('li');
			lis.eq(oldIndex).attr('class','');
			lis.eq(curIndex).addClass('active scale origin'+Math.floor(Math.random()*5));//有5个变化基点：

			!!opt.onChange && opt.onChange(curIndex);

			islock=0;//解锁
			
		};
	};
})(jQuery);
