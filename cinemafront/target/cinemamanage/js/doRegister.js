/**
 * Created by john on 2017/7/25.
 */

var userNum = document.getElementById("userNum");
var uname = document.getElementById("userName");
var pwd = document.getElementById("passw");
var pwd2 = document.getElementById("passw2");
var email = document.getElementById("email");
var phone = document.getElementById("tel");


//Ajax判断手机号码是否已经注册
var flag1 = false;

function doRegister(param) {
    //页面判断
    var flag = true;

    userNum.onblur = function () {

        var userNum = document.getElementById("userNum").value;
        var labelu = document.getElementById("labelu");
        var reg = /^[a-z][a-zA-Z0-9]+$/;
        if (!reg.test(userNum)) {
            labelu.innerHTML = "用户名不合法";
            flag1 = false;
            return;
        } else {
            labelu.innerHTML = "✔";
        }
        //如果前台验证通过，则再验证后台
        //1.创建
        var xmlhttp = new XMLHttpRequest();

        //2.注册回调函数
        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //获取后台返回的信号量
                var str = xmlhttp.responseText;
                // alert("后台传回："+str);
                if ("1" == str) {
                    flag1 = false;
                    labelu.innerText = "✖用户存在";
                    labelu.className="text-danger";

                } else {
                    flag1 = true;
                    labelu.innerText = "✔";
                    labelu.className="text-success";
                }
            }
        }

        //3.打开一个请求,设置请求的连接信息
        //第一个参数代表http协议支持的请求的方式,通常是get和post
        //第二个参数代表请求资源的路径地址url
        //第三个参数有俩个值选择,true代表异步,false代表同步
        xmlhttp.open("post", "/OnlineMovie/user/modelRegisterCheckUser", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        //4.发送请求
        xmlhttp.send("userNum=" + userNum);
    }


       if(param=='p'){
           userNum.onblur();
    }





    checkData(uname, "✖ 随便写点", function (val) {
        if (uname.value.length > 0) {
            return true;
        } else {
            flag = false;
            return false;
        }
    }, param);




        checkData(pwd, "✖ 字母开头", function (val) {
            var reg = /^[a-zA-Z][0-9A-Za-z]+$/;
            if (reg.test(val)) {
                return true;
            } else {
                flag = false;
                return false;
            }
        }, param);


        checkData(pwd2, "✖ 两次密码须一致", function (val) {
            if (pwd2.value != "" && pwd2.value.length > 0 && pwd2.value == pwd.value) {
                return true;
            } else {
                flag = false;
                return false;
            }
        }, param);


        checkData(email, "✖ 非有效的邮箱格式", function (val) {
            var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            if (reg.test(val)) {
                return true;
            } else {
                flag = false;
                return false;
            }
        }, param);



        checkData(phone, "✖ 非有效手机格式", function (val) {
            var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
            if (reg.test(val)) {
                return true;
            } else {
                flag = false;
                return false;
            }
        }, param);




        return flag && flag1;

}

//定义一个函数,用来检测数据
//obj代表各个需要验证的输入框
//info代表span错误时需要显示的内容.
//fun - 闭包函数
function checkData(obj, info, fun, param) {
    var label = obj.parentNode.nextElementSibling.children[0];
    //各个文本输入框添加onfocus事件
    obj.onfocus = function() {
        label.className = "text-info";
        this.parentNode.className = "col-sm-5";
        label.innerText="";
    }
    //添加需要验证的文本输入框的onblur事件
    obj.onblur = function() {
        if (fun(this.value)) {
            label.className = "text-success";
            this.parentNode.className = "col-sm-5 has-success";
            label.innerText = "✔";
            return true;
        } else {
            label.className = "text-danger";
            this.parentNode.className = "col-sm-5  has-error";
            label.innerText = info;
            return false;
        }
    }
    //判断doRegister是否为按钮触发的
    if (param == 'p') {
        obj.onblur();
    }
}

document.onkeydown = function(event){
    var e = window.event||event;
    if(e.keyCode==13){
        var btn = document.getElementById("btn");
        //alert(btn);
        btn.click();
    }
}