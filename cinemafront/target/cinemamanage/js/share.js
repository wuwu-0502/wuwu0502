/*
 * 分享公共模块
 * 2012-04-20 马超 创建
 * 2012-04-24 马超 完善各个分享的url地址
 * 2012-06-15 马超 增加来源信息到分享url中（如果from未被占用的话）
 * 2012-07-25 马超 取消新浪微博的自动搜索图片的设置
 * 2012-08-10 马超 调整各个分享的url地址
 * 2012-08-13 马超 增加分享图片参数（单个图片）
 *
 * 此为原生javascript组件
 * 样式在彩票(freemaker)的全局通用core.css中
 *
 * 调用接口
 * Share.iconShare(wrap[,title[,url[,pic]]][,list][,callback]);
 * Share.comboShare(wrap[,title[,url[,pic]]][,list][,callback]);
 * 参数：
 * wrap		Dom容器
 * title	分享标题，默认document.title
 * url		分享url，默认document.URL
 * pic		分享的图片，无默认,多个图片地址用逗号隔开
 * list		分享列表（Array），如 ["sinaweibo","easyweibo","kaixin"]，默认全分享
 * callback	用户点击后触发的回调，接收分享类型参数字符串
 */
var Share = (function(window){
  	var Config = {
	  	neteasyweibo : {
	  		title : "网易微博",
	  		url : "http://t.163.com/article/user/checkLogin.do?link=http://piao.163.com&source="+ encodeURIComponent('网易电影') +"&info={content}&togImg=true&images={pic}",
	  		flag : "163"
	  	},
	  	sinaweibo : {
	  		title : "新浪微博",
	  		url : "http://v.t.sina.com.cn/share/share.php?url={url}&title={title}&searchPic=true&pic={pic}",
	  		flag : "sina"
	  	},
	  	qqweibo : {
	  		title : "腾讯微博",
	  		url : "http://share.v.t.qq.com/index.php?c=share&a=index&site=http://caipiao.163.com&url={url}&title={title}&pic={pic}",
	  		flag : "qq"
	  	},
	  	qqzone : {
	  		title : "QQ空间",
	  		url : "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&desc={content}&summary= &title="+ document.title +"&site=http://caipiao.163.com&otype=share&pics={pic}",
	  		flag : "qqzone"
	  	},
	  	renren : {
	  		title : "人人网",
	  		url : "http://widget.renren.com/dialog/share?resourceUrl={url}&title={title}&description={content}&charset=utf-8&pic={pic}",
	  		flag : "renren"
	  	},
	  	kaixin : {
	  		title : "开心网",
	  		//url : "http://www.kaixin001.com/~repaste/repaste.php?rurl={url2}&rtitle={title2}&rcontent={content2}"
	  		url : "http://www.kaixin001.com/rest/records.php?content={title}&url={url}&starid=0&aid=0&style=11&pic={pic}",
	  		flag : "kaixin"
	  	},
	  	douban : {
	  		title : "豆瓣网",
	  		url : "http://shuo.douban.com/!service/share?href={url}&name={title}&image={pic}",
	  		flag : "douban"
	  	}/*,
	  	pengyou : {
	  		title : "朋友网",
	  		url : "http://pengyou.qq.com/index.php?mod=usershare&act=onekey&to=xiaoyou&url={url}",
	  		flag : "pengyou"
	  	}*/
	  };
	  
	  /*
	   * 字符串格式化
	   */
	  var format = function(str, obj){
	  	//执行替换
	  	return String(str).replace(/\{([\w\.]+)\}/g, function(match, key) {
	  		//数据源为对象，则遍历逐级查找数据
	  		var fnPath = key.split("."), val = obj, i=0;
	  		for(; i<fnPath.length; i++)
	  			val = val[fnPath[i]];
	  		return val === undefined ? match : val;
	  	});
	  },
	  /*
	   * 类型检查
	   */
	  toString = Object.prototype.toString,
	  isFunction = function(a){return toString.call(a)==="[object Function]"},
	  isArray = function(a){return toString.call(a)==="[object Array]"},
	  /*
	   * 分享链接模版
	   */
	  shareLink = '<a class="cpShareLink" rel="{name}" href="{url}" title="{title}" target="_blank"><em class="cpShareIcon {name}"></em>{lnkTxt}</a>',
	  /*
	   * 输出简易的图标链接
	   */
	  iconShare = function( title, url, pic, list, showTxt ){
	  	var html=[], n = list.length, i=0, name, obj;
	  	for(; i<n; i++){
	  		name = list[i].toLowerCase();
	  		obj = Config[name];
	  		obj && html.push(format(shareLink, {
	  			name : name,
	  			title : obj.title,
	  			url : getShareLink(title, url, pic, obj),
	  			lnkTxt : showTxt?obj.title:""
	  		}));
	  	}
	  	return html.join("");
	  },
	  getShareLink = function(title, url, pic, obj){
	  	url = url.replace(/{flag}/g, obj.flag);
	  	return format(obj.url, {
	  		url : encodeURIComponent(url),
	  		url2 : escape(url),
	  		pic : encodeURIComponent(pic),
	  		pic2 : escape(pic),
	  		title : encodeURIComponent(title),
	  		title2 : escape(title),
	  		content : encodeURIComponent(title+url),
	  		content2 : escape(title+url)
	  	});
	  },
	  /*
	   * 浮动框分享
	   */
	  floatShare = function(){},
	  /*
	   * 详细的自定义分享
	   */
	  customShare = function(wrap, list, addInfo, title, url){};
	  	
	  /*
	   * 返回操作接口
	   * wrap必须是Dom对象
	   */
	  return {
		  iconShare : function(wrap, title, url, pic, list, callback, showTxt){
			  //解析参数
			  if( !wrap || wrap.nodeType !== 1 )
				  return;
			  var t = title || document.title, a, x, n, i, click,
				  u = url || document.URL,
				  p = pic || "",
				  l = list || null,
				  fn = callback || null;
			  if( isArray(u) ){
				  l = u;
				  u = document.URL;
			  }
			  if( isArray(t) ){
				  l = t;
				  t = document.title;
			  }
			  if( isArray(p) ){
				  l = p;
				  p = "";
			  }
			  if( isFunction(l) ){
				  fn = l;
				  l = null;
			  }
			  if( isFunction(u) ){
				  fn = u;
				  u = document.URL;
			  }
			  if( isFunction(t) ){
				  fn = t;
				  t = document.title;
			  }
			  if( isFunction(p) ){
				  fn = p;
				  p = "";
			  }
			  //如果没有制定list，则全部输出
			  if( l == null ){
				  l = [];
				  for(x in Config)
					  l.push(x);
			  }
			  //添加来源分享信息（from=t）
			  u = u.replace(/#.+$/g,"");//删除hash信息，以免添加来源参数错误
			  u += (u.indexOf("#")+1 ? "&" : "#")+"from=t.{flag}";
			  //输出分享链接
			  wrap.innerHTML = iconShare(t, u, p, l, showTxt);
			  //检查是否需要绑定回调
			  if( fn ){
				  a = wrap.getElementsByTagName("a");
				  n = a.length;
				  click = function(){
					  var me = this, type = me.getAttribute("rel");
					  window.setTimeout(function(){fn.call(me, type)},200);
				  };
				  for(i=0; i<n; i++)
					  a[i].onclick = click;
			  }
		  },
		  comboShare : function( wrap, title, url, pic, list, callback ){ this.iconShare( wrap, title, url, pic, list, callback, true ); },
		  /*
		   * 立即分享，专为脚本直接调用而设
		   */
		  shareNow : function( title, url, name, target ){
			  var obj = Config[name],
				  page = obj ? getShareLink(title, url, obj) : null;
			  page && window.open(page, target || "_blank");
		  }
	  };
})(window);