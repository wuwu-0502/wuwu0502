<%@ page import="com.cinema.entity.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>登录</title>
    <link rel="stylesheet" href="css/fast/reset.css"/>
    <link rel="stylesheet" href="css/common.css"/>
    <link rel="stylesheet" href="css/font-awesome.min.css"/>
    <link rel="stylesheet" href="assets/less/unlock.css"/>
    <style type="text/css" media="screen">
        .bar {
            margin: 50px;
            margin-left: 0px;
            height: 40px;
            width: 300px;
        }
    </style>
</head>
<body>
<%
    //检查用户登录状态--1）存储到表中    2）JSP存储数据--session\cookie
    //查表中用户的登陆状态--获取结果
    //发送获取登陆状态的请求：js--同步或异步--ajax--jquery
    //访问login.jsp之前先调用控制器(绑定结果request/session)，让控制器查询到登陆状态，将结果传递到login.jsp
    //内置对象1）request
    User user = (User) request.getAttribute("user");//"0"  "1"
    if (user != null) {
        //跳转到home.jsp
        //传递记住用户信息的用户名和权限
        session.setAttribute("user", user);
        response.sendRedirect("home.jsp");
    }
%>
<div class="wrap login_wrap">
    <div class="content">
        <div class="logo"></div>
        <div class="login_box">

            <div class="login_form">
                <div class="login_title">
                    登录
                </div>
                <form action="home.html" method="post" onsubmit="return check()">

                    <div class="form_text_ipt">
                        <input id="username" name="username" type="text" placeholder="用户名" onblur="checkName()">
                        <span id="name_info"></span>
                    </div>

                    <div class="form_text_ipt">
                        <input id="password" name="password" type="password" placeholder="密码" onblur="checkPwd()">
                        <span id="pwd_info"></span>
                    </div>


                    <div class="bar3 bar" style="margin: 20px 29px 0;background-color: #FFFFFF;"></div>

                    <div class="form_check_ipt">
                        <div class="left check_left">
                            <label><input name="static" type="checkbox" id="static"> 下次自动登录</label>
                        </div>
                        <div class="right check_right">
                            <%--<a href="#">忘记密码</a>--%>
                        </div>
                    </div>
                    <div class="form_btn">
                        <button type="button"  onclick="check()">登录</button>
                        <%--<input type="submit" value="登录">--%>
                    </div>
                    <div class="form_reg_btn" style="padding-bottom: 15px;">
                        <span>还没有帐号？</span><a href="register.jsp">马上注册</a>
                    </div>
                </form>


            </div>
        </div>
    </div>
</div>
<script src='http://cdn.staticfile.org/jquery/1.10.0/jquery.min.js'></script>
<script src='assets/js/unlock.js'></script>
<script>
    var pwd_ok="";
    var flag1=0;
    var flag2=0;
    var flag3=0;
    var user
    $('.bar3').slideToUnlock({
        text: '滑动验证',
        succText: '验证成功',
        progressColor: '#FF7F50',
        succTextColor: '#fff',
        successFunc: function () {
            flag3=1
        }
    });


    function checkName(){
        //获取用户输入的用户名
        var username = $("#username").val();
        //获取显示用户名错误的span
        var name_info = $("#name_info");
        if(username!="" && username != null){
            //发送异步请求
            $.ajax({
                url:"user/login?username="+username,
                dataType: 'json',
                success:function (pwd) {
                    console.log(pwd.u_pwd)
                    if (pwd.u_pwd == "") {
                        flag1=0;
                    }else {
                        name_info.text("");
                        user=pwd
                        pwd_ok=pwd.u_pwd;
                        flag1=1;
                        // return true;
                    }
                },
                error:function () {
                    flag1=0
                    name_info.text("用户名不存在");
                }
            });
        }
    }
    //监听密码输入是否正确
    function checkPwd(obj) {
        if (flag1==1){
            // $(this).val();
            var pwd=$("#password").val();
            if (pwd==pwd_ok){
                $("#pwd_info").text("");
                flag2=1;
            }
            else {
                flag2=0;
                $("#pwd_info").text("密码错误");
            }

        } else {
            flag2=0;
            $("#pwd_info").text("请填写正确的用户名");
        }
        return false;
    }

    function check() {
        console.log(flag1)
        console.log(flag2)
        if (flag1==1&&flag2==1&&flag3==1){

            console.log('${user.u_name}')
            if ($("#static").prop('checked')){
                var username = $("#username").val();
                $.ajax({
                    url:"user/changeStatic?ustatic=1&username="+username,
                    async:false,
                    success:function (data) {
                        window.location.href='home.jsp';
                    }
                });
            }else{
                var username = $("#username").val();
                $.ajax({
                    url:"user/changeStatic?ustatic=0&username="+username,
                    async:false,
                    success:function (data) {
                        window.location.href='home.jsp';
                    }
                });
                window.location.href='home.jsp';
            }
        }
        else window.location.reload();
    }

</script>
</body>
</html>
