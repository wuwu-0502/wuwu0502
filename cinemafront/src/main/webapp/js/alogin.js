/**
 * Created by Lenovo on 2017/7/26.
 */


function  doLogin(param) {
    /*alert("验证");*/
    /*alert("start")*/
    //1.创建
    var xmlhttp = new XMLHttpRequest();
    var userNum = document.getElementById("name").value;
    var password = document.getElementById("pwd").value;
    var flag = document.getElementsByName("flag")[0];
    /*  alert(flag.value);*/
    var uErr = document.getElementById("uErr");
    var pErr = document.getElementById("pErr");


    //2.注册回调函数
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            //获取后台返回的信号量
            var str = xmlhttp.responseText;
             /*alert(str);*/
            if("0"==str){
                uErr.innerText="用户不存在";
                pErr.innerText="";
                uErr.class="danger";
            }else if("1"==str){
                uErr.innerText = "";
                pErr.innerText="密码不正确";
                pErr.class="danger";
            }else {
                window.location="/OnlineMovie/movie/list";
            }
        }
    }
    //3.打开一个请求,设置请求的连接信息
    //第一个参数代表http协议支持的请求的方式,通常是get和post
    //第二个参数代表请求资源的路径地址url
    //第三个参数有俩个值选择,true代表异步,false代表同步
    xmlhttp.open("post","/OnlineMovie/user/modelLogin",true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    //4.发送请求
    xmlhttp.send("userNum="+userNum+"&password="+password+"&flag="+flag.value);

    return false;
}
