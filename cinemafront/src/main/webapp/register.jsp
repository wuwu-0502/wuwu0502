<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>注册界面</title>
    <link rel="stylesheet" href="css/fast/reset.css"/>
    <link rel="stylesheet" href="css/common.css"/>
    <link rel="stylesheet" href="css/font-awesome.min.css"/>
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery.form.js"></script>
    <script type="text/javascript" src="layer-v3.1.1/layer/layer.js"></script>

</head>
<body>
<div class="wrap login_wrap">
    <div class="content">

        <div class="logo"></div>

        <div class="login_box">

            <div class="login_form">
                <div class="login_title">
                    注册
                </div>
                <form id="register" onsubmit="return checkRegister()">

                    <div class="form_text_ipt">
                        <input id="username" name="username" type="text" placeholder="用户名" onblur="checkUsername()">
                    </div>
                    <span id="username_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_text_ipt">
                        <input id="password" name="password" type="password" placeholder="密码" onblur="checkPwd()">
                    </div>
                    <span id="password_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_text_ipt">
                        <input id="repassword" name="repassword" type="password" placeholder="重复密码" onblur="checkRePwd()">
                    </div>
                    <span id="repassword_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_text_sex">
                        <label><span>男</span><input id="male" name="sex" type="radio" value="男" checked/></label>
                        <label><span>女</span><input id="female" name="sex" type="radio" value="女"/></label>
                    </div>

                    <div class="form_text_ipt">
                        <input id="phone" name="phone" type="text" placeholder="手机号" onblur="checkPhone()">
                    </div>
                    <span id="phone_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_text_ipt">
                        <input id="email" name="email" type="text" placeholder="邮箱" onblur="checkEmail()">
                    </div>
                    <span id="email_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_text_ipt">
                        <input id="question" name="question" type="text" placeholder="密码问题" onblur="checkQuestion()">
                    </div>
                    <span id="question_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_text_ipt">
                        <input id="answer" name="answer" type="text" placeholder="问题答案" onblur="checkAnswer()">
                    </div>
                    <span id="answer_info" style="padding-left: 35px; color: red;"></span>

                    <div class="form_btn">
                        <input type="submit" value="注册" />
                    </div>
                    <div class="form_reg_btn" style="padding-bottom: 15px;">
                        <span>已有帐号？</span><a href="login.jsp">马上登录</a>
                    </div>
                </form>

            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="js/common.js"></script>

<script>
    var flag1=0
    var flag2=0
    var flag3=0
    var flag4=0
    var flag5=0
    var flag6=0
    var flag7=0
    
    function checkUsername() {
        var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if ($("#username").val()=="") {
            $("#username_info").text("用户名不能为空")
            flag1=0
        } else if(!uPattern.test($("#username").val())){
            $("#username_info").text("4到16位(数字、字母、下划线_、减号-)")
            flag1=0
        }else{
            $("#username_info").text("")
            flag1=1
        }
    }

    function checkPwd() {
        var pwdPattern=/^(\w){6,20}$/;
        if ($("#password").val()=="") {
            $("#password_info").text("密码不能为空")
            flag2=0
        } else if(!pwdPattern.test($("#password").val())){
            $("#password_info").text("6到20位(数字、字母、下划线_、)")
            flag2=0
        }else{
            $("#password_info").text("")
            flag2=1
        }
    }

    function checkRePwd(){
        if ($("#password").val()!=$("#repassword").val()){
            $("#repassword_info").text("两次输入不相同")
            flag3=0
        } else {
            $("#repassword_info").text("")
            flag3=1
        }
    }

    function checkPhone(){
        var phonePattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16[6|7])|(17[0-3]|[5-9])|(18[0,5-9]))\d{8}$/;
        if ($("#phone").val()=="") {
            $("#phone_info").text("手机号不能为空")
            flag4=0
        } else if(!phonePattern.test($("#phone").val())){
            $("#phone_info").text("手机号格式不正确")
            flag4=0
        }else{
            $("#phone_info").text("")
            flag4=1
        }
    }

    function checkEmail(){
        var emailPattern = /^([a-zA-Z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if ($("#email").val()=="") {
            $("#email_info").text("邮箱不能为空")
            flag5=0
        } else if(!emailPattern.test($("#email").val())){
            $("#email_info").text("邮箱格式不正确")
            flag5=0
        }else{
            $("#email_info").text("")
            flag5=1
        }
    }

    function checkQuestion(){
        if ($("#question").val()==""){
            $("#question_info").text("密码问题不能为空")
            flag6=0
        } else {
            $("#question_info").text("")
            flag6=1
        }
    }
    function checkAnswer(){
        if ($("#answer").val()==""){
            $("#answer_info").text("问题答案不能为空")
            flag7=0
        } else {
            $("#answer_info").text("")
            flag7=1
        }
    }

    function checkRegister(){
        if (flag1==1&&flag2==1&&flag3==1&&flag4==1&&flag5==1&&flag6==1&&flag7==1) return true
        else console.log("no")
        return false

    }

    $("#register").ajaxForm({
        type: 'post',
        url: "user/create",
        success: function (data) {
            console.log("请求成功")
            layer.msg('创建成功!', {icon: 1, time: 1000});
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            console.log("请求失败")
            layer.msg('用户名已存在!', {icon: 2, time: 1000});
        }
    });
</script>
</body>
</html>
