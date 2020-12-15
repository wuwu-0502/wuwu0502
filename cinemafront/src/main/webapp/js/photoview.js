/*
 * 影评（长评）组件(业务组件)
 */
(function(window,$,Core,undefined){
	var bigPic = {
		init: function(dataArr, index, op){
			if(!dataArr || dataArr.length == 0 ) return;
			var len = dataArr.length;
			this.picData =  dataArr;
			this.curIndex = index || 0;
			this.picCount = len;
			var op = op || {};
			this.maxWidth = op.maxWidth || 900;
			this.maxHeight = op.maxHeight || 600;
			/*for(var i = 0; i < len; i++){
				if(dataArr[i] == showUrl){
					this.curIndex = i;	
				}	
			}*/
			//生成大图html代码
			this.generateHtml();	
		},
		generateHtml: function(){
			var dialog = this.dialog = $("#mvBigPicPart"),_this = this;
			if(!dialog[0]){
				str = $.format('<div id="mvBigPicPart" class="show_poster"><a href="javascript:;" class="close"></a><img src="{0}"  alt="" id="mvBigPic" /><span class="show_loading" style="display:none;"></span><a href="javascript:;" class="show_left" hidefocus="true"><b {1}></b></a><a href="javascript:;" class="show_right" hidefocus="true"><b {2}></b></a><span class="span_ie6"></span></div>', this.picData[this.curIndex], this.curIndex <= 0 ? 'style="display:none;"' : '', this.curIndex >= this.picCount-1 ? 'style="display:none;"' : '');
				$(document.body).append(str);
				this.bindDomEvent();
				this.showPic();
				this.showLayout();
			}else{
				$("#mvBigPic")[0].src = "";
				this.showPic();
				dialog.show();
				this.showLayout();
			}
			$(document).bind("keydown", this.docKeydownEv);
		},
		docKeydownEv: function(e){
			bigPic.keycodeHandler(e);	
		},
		showLayout: function(){
			var zIndex = $("#mvBigPicPart").css("z-index") - 1 || 9999,
				getWH = function(p){
					return Math.max(document.documentElement[p], document.body[p])
				}
			$(document.body).append($.format('<div class="iDialogLayout" style="z-index: {0}; width:{1}px; height:{2}px" ></div>', zIndex, getWH("scrollWidth"), getWH("scrollHeight") ) );
			$(window).resize(function(){
				$(".iDialogLayout").css({width:getWH("scrollWidth") , height:getWH("scrollHeight")});	
			});
		},
		hideLayout: function(){
			$(".iDialogLayout").remove();
			$(window).unbind("resize");
		},
		//绑定事件
		bindDomEvent: function(){
			var dialog = this.dialog = $("#mvBigPicPart"), _this = bigPic;
			dialog.find(".close").click($.proxy(this.closeBigPic,this)).disableDarg();
			dialog.find(".show_left").click($.proxy(this.prevPic,this)).disableDarg();
			dialog.find(".show_right").click($.proxy(this.nextPic,this)).disableDarg();
		},
		//关闭大图复层 只是隐藏
		closeBigPic: function(){
			$("#mvBigPicPart").hide();
			this.hideLayout();
			//关闭浮层即写在keydown事件
			$(document).unbind("keydown", this.docKeydownEv);	
		},
		//前一张大图
		prevPic: function(){
			this.showPic(this.curIndex--);
		},
		//后一张大图
		nextPic: function(){
			this.showPic(this.curIndex++);
		},
		//显示大图
		showPic: function(){
			var mvBigPic = $("#mvBigPic");
			if(this.curIndex < 0){
				this.curIndex = 0;
				return;
			}
			if(this.curIndex > this.picCount-1){
				this.curIndex = this.picCount-1;
				return;
			}
			if(this.curIndex==0){
				this.dialog.find(".show_left b").hide();
			}else{
				this.dialog.find(".show_left b").show();	
			}
			if(this.curIndex == this.picCount-1){
				this.dialog.find(".show_right b").hide();	
			}else{
				this.dialog.find(".show_right b").show();	
			}
			var img = new Image(), w, h, _this = this;
			img.onload = function(){
				var w = img.width, h = img.height;
				if(w > _this.maxWidth){
					w = _this.maxWidth;
					h = w * img.height / img.width;
				}
				if(h > _this.maxHeight){
					h = _this.maxHeight;
					w = h * img.width / img.height;
				}	
				_this.dialog.find(".show_loading")[0].style.display = "none";
				mvBigPic[0].src = _this.picData[_this.curIndex];		
				mvBigPic.css({width: w + "px", height: h + "px"});
				img = null;
			}
			this.dialog.find(".show_loading")[0].style.display = "inline-block";
			img.src = this.picData[this.curIndex];	
		},
		//绑定上下左右箭头事件
		keycodeHandler: function(e){
			var keyCode = e.keyCode;
			switch( keyCode ){
				case 38: //上
				case 37: //左
					this.prevPic();
					e.preventDefault();
					break;
				case 40: //下
				case 39: //右
					this.nextPic();
					e.preventDefault();
					break;
				case 27: //esc键就关闭大图浮动层
					this.closeBigPic();
					break;
			}
		}
	};
	Core.showBigMvpic = function(dataArr, index, op){
		bigPic.init(dataArr, index, op);
	}
})(window,jQuery,Core);