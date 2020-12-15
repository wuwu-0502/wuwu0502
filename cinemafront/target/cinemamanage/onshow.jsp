<%@ page import="java.util.List" %>
<%@ page import="com.cinema.entity.Movie" %>
<%@ taglib prefix="C" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>

<%@include file="header.jsp"%>
<html>
<head>
    <style>
        div[class="pic"]{
            width:200px;
            height:300px;
            margin-left:700px;
        }
        div{
            text-align:center;
        }
        div[class="all"]{
            transform:translateY(-140px);
        }
        div[class="main"]{
            transform:translateX(-150px);
        }
        div[class="num"]{
            transform:translateX(150px);
        }
        div[class="content"]{
            background-color:#FFF5EE;
        }
    </style>
</head>


<body style="background-color: #FFF5EE">
<!-- 登录模态框（Modal） -->
<div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title" id="myModalLabel">
                    用户登录
                </h4>
            </div>
            <div class="modal-body">
                <!--登录的form表单-->
                <form class="form-horizontal" role="form" onsubmit="return doLogin('p')" method="post">
                    <div class="form-group has-feedback" id="div1">
                        <label for="name" class="col-sm-2 control-label">用户名</label>
                        <div class="col-sm-5" id="user">

                            <input type="text" class="form-control" id="name" placeholder="请输入用户名" name="username"
                                   onblur="a()" value="${uNum}">
                            <span class="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger" id="uErr"></label>
                        </div>
                    </div>
                    <div class="form-group has-feedback" id="div2">
                        <label for="pwd" class="col-sm-2 control-label">密码</label>
                        <div class="col-sm-5" id="pd">
                            <input type="text" class="form-control" id="pwd" placeholder="请输入密码" name="password"
                                   onblur="a()" value="${uPwd}">
                            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger" id="pErr"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="flag">请记住我
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        <input type="submit" class="btn btn-primary" value="登录" <%--onclick="doLogin('p')"--%>>
                    </div>
                </form>
                <!--form结束-->
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
</div>
<!-- 登录modal end/.modal -->

<div class="modal fade" id="register" tabindex="-1" role="dialog" aria-labelledby="myModalRegister" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title" id="myModalRegister">
                    用户注册
                </h4>
            </div>
            <div class="modal-body">
                <!--注册的form表单-->
                <form action="user/modelRegister" class="form-horizontal" role="form"
                      onsubmit="return doRegister('p')" method="post">
                    <div class="form-group has-feedback">
                        <label for="userNum" class="col-sm-2 control-label">用户账号</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="userNum" name="userNum"  placeholder="小写字母开头,不含中文.">
                            <span class="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger" id="labelu" >请输入合法用户账户</label>
                        </div>
                    </div>

                    <div class="form-group has-feedback">
                        <label for="userName" class="col-sm-2 control-label">昵称</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="userName" name="userName"  placeholder="小写字母开头,不含中文.">
                            <span class="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger">请输入合法昵称</label>
                        </div>
                    </div>

                    <div class="form-group has-feedback">
                        <label for="passw" class="col-sm-2 control-label">密码</label>
                        <div class="col-sm-5">
                            <input type="password" class="form-control" id="passw" name="password"  placeholder="密码长度6-8位" >
                            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger">请输入合法密码</label>
                        </div>
                    </div>

                    <div class="form-group has-feedback">
                        <label class="col-sm-2 control-label">确认密码</label>
                        <div class="col-sm-5">
                            <input type="password" class="form-control" id="passw2" name="passw2"   placeholder="和密码保持一致">
                            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div class="col-sm-5" style="padding-top: 10px;">
                            <label class="alert-danger">两次密码必须一致</label>
                        </div>
                    </div>

                    <div class="form-group has-feedback">
                        <label class="col-sm-2 control-label">邮箱</label>
                        <div class="col-sm-5">
                            <input type="email" class="form-control" id="email" name="email"  placeholder="合法邮箱格式">
                            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger">请输入合法邮箱</label>
                        </div>
                    </div>

                    <div class="form-group has-feedback">
                        <label class="col-sm-2 control-label">电话</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control" id="tel" name="phone"  placeholder="合法手机格式">
                            <span class="glyphicon glyphicon-earphone form-control-feedback"></span>
                        </div>
                        <div class="col-sm-3" style="padding-top: 10px;">
                            <label class="alert-danger">输入合法手机格式</label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        <input type="submit" class="btn btn-primary" value="注册">
                    </div>

                </form>
                <!--form结束-->
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
</div>

<br><br>
<p class="update-time" style="margin-left: 50%">2019-08-21<span class="has-fresh-text" style="color: #e0a654">已更新</span></p>
<br>
<p class="board-content" style="margin-left: 30%;color: #b9b9b9">榜单规则：将昨日国内热映的影片，按照评分从高到低排列取前10名，每天上午10点更新。相关数据来源于“第八组”及“阿八影库”。</p>

<div id="sort" style="margin-left: 30%">

</div>
<br><br>
<script>
    $(function () {
        $.ajax({
            url:"movie/sort",
            dataType:"json",
            type:"post",
            async:false,
            success:function (movs) {
                var i = 0
                $.each(movs,function (index, item) {
                    if (i < 11) {
                        i++
                        $("#sort").append('<ul class="movie_con"  style="margin-bottom: 10px;">\n' +
                            '                        <li class="l1"  >\n' +
                            '                            <div class="showImg">\n' +
                            '                                <em class="mvType mvType3d"></em>\n' +
                            '                                <a target="_blank" title="'+item.m_name+'" href="movie/detail?mvId='+item.m_id+'" rel="nofollow"><img width="220" height="280" alt="'+item.m_name+'" src="images/movieImg/'+item.m_img+'"></a>\n' +
                            '                            </div>\n' +
                            '                        </li>\n' +
                            '                        <li class="l2" style="height: 300px; ">\n' +
                            '                            <h3>\n' +
                            '                                <a target="_blank" title="'+item.m_name+'"  href="movie/detail?mvId='+item.m_id+'" rel="nofollow">'+item.m_name+'</a>\n' +
                            '                            </h3>\n' +
                            '                            <p class="p2">\n' +
                            '                                <span class="star_bg"><b style="width:'+item.c_score+' / 10 *100}%" class="star"></b></span>\n' +
                            '                                <em>'+item.c_score+'</em>\n' +
                            '                            </p>\n' +
                            '                            <p class="p2">2019-08-28上映</p>\n' +
                            '                            <p class="p2" style="font-size:12px;">'+item.m_tip+'</p>\n' +
                            '\n' +
                            '                                <%--<span class="lowPrice">未获取<i>元起</i></span>--%>\n' +
                            '                            <a target="_blank" class="showBtn" href="movie/detail?mvId='+item.m_id+'" rel="nofollow">选座购票</a>\n' +
                            '                        </li>\n' +
                            '                    </ul>')
                    }
                })
            }
        });
    });

</script>

<div id="sideBar">
    <a id="toTop" href="javascript:;" rel="nofollow" title="回到顶部" hidefocus="true"></a>
</div>

<%@include file="footer.jsp"%>

<script src="js/imgScroll.js"></script>
<script src="js/movie/mvCommon.js"></script>
<script src="js/index/index2014.js"></script>

<script src="js/alogin.js"></script>
<script src="js/doRegister.js"></script>


<script>
    Core && Core.fastInit && Core.fastInit("1");
</script>
<script type="text/javascript">
    Core.statistics_adsage("ca");
</script>

<script src="js/ntes.js"></script>
<script>
    _ntes_nacc = "dianying";
    neteaseTracker();
</script>
<script>
    neteaseClickStat();
</script>
</body>

</html>
