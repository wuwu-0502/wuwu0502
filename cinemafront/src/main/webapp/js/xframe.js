/*
 * 防止iframe嵌入，保护脚本
 * 2013-04-15 马超 增加
 */
(function(window,$){
if(window.top!=window.self){
	var killMySelf = function(){
		$(function(){$(document.body).remove();})
	};
	try{
		window.top.location.href = "http://piao.163.com";
	}catch(e){
		killMySelf();
	}
	try{
		if( window.top.document.URL !== "http://piao.163.com" ){
			killMySelf();
		}
	}catch(e){
		killMySelf();
	}
}
})(window,jQuery);