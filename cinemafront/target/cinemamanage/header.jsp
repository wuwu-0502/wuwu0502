<%@ page import="java.util.List" %>
<%@ page import="com.cinema.entity.Movie" %>
<%@ taglib prefix="C" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE HTML>
<html>
<html xmlns:wb="http://open.weibo.com/wb">

<head>
    <link rel="shortcut icon" href="" />
    <title>阿八影院欢迎您!</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="阿八影院,电影,影院" />
    <meta name="description" content="阿八影院电影是一个能够让您在线购买电影票的在线选座平台，同时网易电影还提供电影排期，影院信息查询等服务，方便您足不出户，在家中在线购票。" />    <meta name="baidu-site-verification" content="JbG7IdK46dmV88mo" />
    <meta name="baidu-site-verification" content="YikRVdr4Vs" />
    <link rel="stylesheet" href="dist/css/bootstrap.min.css">
    <script src="dist/js/jquery.min.js"></script>
    <script src="dist/js/bootstrap.min.js"></script>
    <%--<script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>--%>
    <%--<script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>--%>

    <link rel="stylesheet" href="css/base.css" />
    <link rel="stylesheet" href="css/core.css" />
    <link rel="stylesheet" href="css/index/index2014.css" />
    <link rel="stylesheet" href="css/mv_list.css" />
    <script src="js/jquery-1.4.2.js"></script>
    <script src="js/easyCore.js"></script>
    <script src="js/js2/dialog.js"></script>
    <script src="js/autoComplete.js"></script>
    <script src="js/wb.js" type="text/javascript" charset="utf-8"></script>

    <script>
        if(!!window.Core) {
            Core.cdnBaseUrl = "http://pimg1.126.net/movie";
            Core.cdnFileVersion = "1495696323";
            Core.curCity = { 'name': '北京', 'id': '1006', 'spell': 'beijing' };
        }
    </script>

    <script src="js/xframe.js"></script>


    <style>
        .modal-header {
            text-align: center;
            background-color: #E34551;
            border-radius: 5px;
            letter-spacing: 7px;
            font-size: large;
        }

        ul li{
            margin-left: 10px;
            /*margin-top: 40px;*/
        }

        .hotCinema li{
            width: 915px;
            height: 98px;
        }
        #mvTopSearch{
            pos-right: 0px;
        }
        .search{
            padding: 0px;
        }
    </style>
</head>

<body class="login-bg" style="background-color: seashell">


<nav id="topNav" style="background-color: rgba(234,236,238,0.19)">
    <div id="topNavWrap">
        <div id="topNavLeft">阿八电影

            <c:if test="${!empty user || !empty user.u_name}">
                <a href="#" >欢迎您 - ${user.u_name}</a>
            </c:if>
            <c:if test="${empty user}">
                <a href="login.jsp">登录</a>
                <a href="register.jsp">立即注册&gt;&gt;</a>
            </c:if>

        </div>
        <ul id="topNavRight">
            <li>
                <c:if test="${empty user}">
                <a href="login.jsp" target="_blank">我的订单</a>&nbsp;&nbsp;<span id="topEpayInfo"></span>
                </c:if>
                <c:if test="${!empty user}">
                <a href="odr/getallOrder?u_id=${user.u_id}" target="_blank">我的订单</a>&nbsp;&nbsp;<span id="topEpayInfo"></span>
                </c:if>

            <c:if test="${!empty user}">
                | <a href="user/logout?username=${user.u_name}" > 安全退出</a>
            </c:if>
            <li class="last">
                <a href="javascript:;" rel="nofollow" target="_blank" onMouseOver="$(this).parent().addClass('kf');" onMouseOut="$(this).parent().removeClass('kf');">联系客服</a>&nbsp;&nbsp;
                <div class="none">客服电话：0512-12345678</div>
            </li>
        </ul>
        <script>
            Core.getUnPayedOrderCount();
        </script>
    </div>
</nav>
<section class="searchBoxInd clearfix2">
    <div class="searchWrap">
        <a href="home.jsp"><img src="images/logos/logo2014.png" href="home.jsp" style="width: 130px;height: 73px;float:left;"></a>
        <div id="switchTopCity" class="switchTopCity">
            <div class="curCity  " id="curCity" pid="1006" pspell="beijing">
                <span class="cityName myCityBar" id="myCity" pid="1006" pspell="beijing">天津</span>
                <i class="triangle2"></i>
                <input id="cityUrl" class="cityUrl" type="hidden" value="/beijing/movie/page-1-type-0.html">
                <div class="cityList" id="cityTopList">
                    <div class="title">
                        <a href="javascript:;" class="close"></a>
                        <input type="text" class="cityTopSearch textGray" value="请输入城市或城市拼音" autocomplete="off" maxlength="15">
                        <input type="button" title="" class="cityTopSearchBtn" value="">
                        <ul class="titleChar">
                            <li class="on first" rel="#cityList_0">热门</li>
                            <li class="" rel="#cityList_1">A~G</li>
                            <li class="" rel="#cityList_2">H~L</li>
                            <li class="" rel="#cityList_3">M~T</li>
                            <li class="" rel="#cityList_4">W~Z</li>
                        </ul>
                    </div>
                    <div id="cityListBox" class="cityListBox">
                        <div id="cityList_0" class="cityListGroup hotCity">
                            <dl>
                                <dd>
                                    <a href="/beijing/movie/page-1-type-0.html" rel="nofollow">北京</a>
                                    <a href="/shanghai/movie/page-1-type-0.html" rel="nofollow">上海</a>
                                    <a href="/guangzhou/movie/page-1-type-0.html" rel="nofollow">广州</a>
                                    <a href="/shenzhen/movie/page-1-type-0.html" rel="nofollow">深圳</a>
                                    <a href="/hangzhou/movie/page-1-type-0.html" rel="nofollow">杭州</a>
                                    <a href="/nanjing/movie/page-1-type-0.html" rel="nofollow">南京</a>
                                    <a href="/chengdu/movie/page-1-type-0.html" rel="nofollow">成都</a>
                                    <a href="/chongqing/movie/page-1-type-0.html" rel="nofollow">重庆</a>
                                </dd>
                            </dl>
                        </div>
                        <div id="cityList_1" class="cityListGroup none">
                            <dl>
                                <dt>A</dt>
                                <dd>
                                    <a href="/anlu/movie/page-1-type-0.html" rel="nofollow">安陆</a>
                                    <a href="/anning/movie/page-1-type-0.html" rel="nofollow">安宁</a>
                                    <a href="/ankang/movie/page-1-type-0.html" rel="nofollow">安康</a>
                                    <a href="/anshun/movie/page-1-type-0.html" rel="nofollow">安顺</a>
                                    <a href="/anyang/movie/page-1-type-0.html" rel="nofollow">安阳</a>
                                    <a href="/anqing/movie/page-1-type-0.html" rel="nofollow">安庆</a>
                                    <a href="/anshan/movie/page-1-type-0.html" rel="nofollow">鞍山</a>
                                </dd>
                            </dl>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ul class="shift">
            <li>
                <a class="active" href="home.jsp" rel="nofollow">首页</a>
            </li>
            <li class="movie" id="movieLink">
                <a class="" href="onshow.jsp">榜单</a>
            </li>
        </ul>
        <div class="search" >
            <div class="ie6">
                <form action="movie/search" method="post"><%--/search.jsp#from=search--%>
                    <input type="text" <%--value="${mvName}"--%> placeholder="请输入影片名称" class="text textGray" name="mvTopSearch" id="mvTopSearch" autocomplete="off" maxlength="20"
                           style="bottom: 0px;right: 0px; width: 208px;height: 36px;"/>
                    <%--<input type="hidden" name="city" value="suzhou" />--%>
                    <input type="submit" value="" class="sub" id="topSearchBtn" title="" />
                </form>
            </div>
        </div>
    </div>
</section>





<%--<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>--%>
<%--&lt;%&ndash;--%>
  <%--Created by IntelliJ IDEA.--%>
  <%--User: bruce--%>
  <%--Date: 2017/7/21--%>
  <%--Time: 14:21--%>
  <%--To change this template use File | Settings | File Templates.--%>
<%--&ndash;%&gt;--%>
<%--<%@ page contentType="text/html;charset=UTF-8" language="java" %>--%>
<%--<html>--%>
<%--<head>--%>
    <%--<title>Title</title>--%>
    <%--&lt;%&ndash;<link rel="stylesheet" href="dist/css/bootstrap.min.css">--%>
    <%--<script src="dist/js/jquery.min.js"></script>--%>
    <%--<script src="dist/js/bootstrap.min.js"></script>&ndash;%&gt;--%>

   <%--&lt;%&ndash; <link rel="stylesheet" href="dist/css/bootstrap.min.css">&ndash;%&gt;--%>
<%--</head>--%>
<%--<body>--%>
<%--<noscript><div id="noScript">--%>
    <%--<div>--%>
        <%--<h2>请开启浏览器的Javascript功能</h2><p>亲，没它我们玩不转啊！求您了，开启Javascript吧！<br/>不知道怎么开启Javascript？那就请<a href="http://www.baidu.com/s?wd=%E5%A6%82%E4%BD%95%E6%89%93%E5%BC%80Javascript%E5%8A%9F%E8%83%BD" target="_blank">猛击这里</a>！</p></div>--%>
    <%--</div>--%>
<%--</noscript>--%>
<%--<nav id="topNav">--%>
    <%--<div id="topNavWrap">--%>
        <%--<div id="topNavLeft">阿八电影--%>
            <%--<c:if test="${!empty user || !empty user.userName}">--%>
                <%--<a href="#" >欢迎您 - ${user.userName}</a>--%>
            <%--</c:if>--%>
            <%--<c:if test="${empty user}">--%>
                <%--<a href="user/backLoginEdit" >登录</a>--%>
                <%--<a href="user/backRegisterEdit" >立即注册&gt;&gt;</a>--%>
            <%--</c:if>--%>

        <%--</div>--%>
        <%--<ul id="topNavRight">--%>
            <%--<li>--%>
                <%--<c:if test="${empty user}">--%>
                <%--<a href="user/backLoginEdit" target="_blank">我的订单</a>&nbsp;&nbsp;<span id="topEpayInfo"></span>|</li>--%>
                <%--</c:if>--%>
                <%--<c:if test="${!empty user}">--%>
                    <%--<a href="order/list" target="_blank">我的订单</a>&nbsp;&nbsp;<span id="topEpayInfo"></span>|</li>--%>
                <%--</c:if>--%>
            <%--</li>--%>
            <%--<li>--%>
                <%--<c:if test="${!empty user}">--%>
                    <%--<a href="user/safeExit" > 安全退出</a>|--%>
                <%--</c:if>--%>
            <%--<li class="last">--%>
                <%--<a href="javascript:;" rel="nofollow" target="_blank" onMouseOver="$(this).parent().addClass('kf');" onMouseOut="$(this).parent().removeClass('kf');">联系客服</a>&nbsp;&nbsp;--%>
                <%--<div class="none">客服电话：0512-12345678</div>--%>
            <%--</li>--%>
        <%--</ul>--%>
        <%--<script>--%>
            <%--Core.getUnPayedOrderCount();--%>
        <%--</script>--%>
    <%--</div>--%>
<%--</nav>--%>
<%--<section class="searchBoxInd clearfix2">--%>
    <%--<div class="searchWrap">--%>
        <%--<a href="homePage.html" class="logo2014" title="阿八电影" style="float:left;"></a>--%>
        <%--<div id="switchTopCity" class="switchTopCity">--%>
            <%--<div class="curCity  " id="curCity" pid="1006" pspell="beijing">--%>
                <%--<span class="cityName myCityBar" id="myCity" pid="1006" pspell="beijing">天津</span>--%>
                <%--<i class="triangle2"></i>--%>
                <%--<input id="cityUrl" class="cityUrl" type="hidden" value="/beijing/movie/page-1-type-0.html">--%>
                <%--<div class="cityList" id="cityTopList">--%>
                    <%--<div class="title">--%>
                        <%--<a href="javascript:;" class="close"></a>--%>
                        <%--<input type="text" class="cityTopSearch textGray" value="请输入城市或城市拼音" autocomplete="off" maxlength="15">--%>
                        <%--<input type="button" title="" class="cityTopSearchBtn" value="">--%>
                        <%--<ul class="titleChar">--%>
                            <%--<li class="on first" rel="#cityList_0">热门</li>--%>
                            <%--<li class="" rel="#cityList_1">A~G</li>--%>
                            <%--<li class="" rel="#cityList_2">H~L</li>--%>
                            <%--<li class="" rel="#cityList_3">M~T</li>--%>
                            <%--<li class="" rel="#cityList_4">W~Z</li>--%>
                        <%--</ul>--%>
                    <%--</div>--%>
                    <%--<div id="cityListBox" class="cityListBox">--%>
                        <%--<div id="cityList_0" class="cityListGroup hotCity">--%>
                            <%--<dl>--%>
                                <%--<dd>--%>
                                    <%--<a href="/beijing/movie/page-1-type-0.html" rel="nofollow">北京</a>--%>
                                    <%--<a href="/shanghai/movie/page-1-type-0.html" rel="nofollow">上海</a>--%>
                                    <%--<a href="/guangzhou/movie/page-1-type-0.html" rel="nofollow">广州</a>--%>
                                    <%--<a href="/shenzhen/movie/page-1-type-0.html" rel="nofollow">深圳</a>--%>
                                    <%--<a href="/hangzhou/movie/page-1-type-0.html" rel="nofollow">杭州</a>--%>
                                    <%--<a href="/nanjing/movie/page-1-type-0.html" rel="nofollow">南京</a>--%>
                                    <%--<a href="/chengdu/movie/page-1-type-0.html" rel="nofollow">成都</a>--%>
                                    <%--<a href="/chongqing/movie/page-1-type-0.html" rel="nofollow">重庆</a>--%>
                                <%--</dd>--%>
                            <%--</dl>--%>
                        <%--</div>--%>
                        <%--<div id="cityList_1" class="cityListGroup none">--%>
                            <%--<dl>--%>
                                <%--<dt>A</dt>--%>
                                <%--<dd>--%>
                                    <%--<a href="/anlu/movie/page-1-type-0.html" rel="nofollow">安陆</a>--%>
                                    <%--<a href="/anning/movie/page-1-type-0.html" rel="nofollow">安宁</a>--%>
                                    <%--<a href="/ankang/movie/page-1-type-0.html" rel="nofollow">安康</a>--%>
                                    <%--<a href="/anshun/movie/page-1-type-0.html" rel="nofollow">安顺</a>--%>
                                    <%--<a href="/anyang/movie/page-1-type-0.html" rel="nofollow">安阳</a>--%>
                                    <%--<a href="/anqing/movie/page-1-type-0.html" rel="nofollow">安庆</a>--%>
                                    <%--<a href="/anshan/movie/page-1-type-0.html" rel="nofollow">鞍山</a>--%>
                                <%--</dd>--%>
                            <%--</dl>--%>

                        <%--</div>--%>
                    <%--</div>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<ul class="shift">--%>
            <%--<li>--%>
                <%--<a class="active" href="" rel="nofollow">首页</a>--%>
            <%--</li>--%>
            <%--<li class="movie" id="movieLink">--%>
                <%--<a class="" href="javascript:;">电影<i class="triangle2"></i></a>--%>
                <%--<dl id="movieMenu">--%>
                    <%--<dd>--%>
                        <%--<a href="onshow.html" rel="nofollow">正在热映</a>--%>
                    <%--</dd>--%>
                    <%--<dd>--%>
                        <%--<a href="upComing.html" rel="nofollow">即将上映</a>--%>
                    <%--</dd>--%>
                <%--</dl>--%>
            <%--</li>--%>
            <%--<li>--%>
                <%--<a class="" href="cinema.html" rel="nofollow">影院</a>--%>
            <%--</li>--%>
        <%--</ul>--%>
        <%--<div class="search" >--%>
            <%--<div class="ie6">--%>
                <%--<form action="/search.html#from=search" id="top_sform">--%>
                    <%--<input type="text" value="${mvName}" placeholder="请输入影片名称" class="text textGray" name="keywords" id="mvTopSearch" autocomplete="off" maxlength="20"--%>
                           <%--style="bottom: 0px;right: 0px; width: 208px;height: 36px;"/>--%>
                    <%--<input type="hidden" name="city" value="suzhou" />--%>
                    <%--<input type="submit" value="" class="sub" id="topSearchBtn" title="" />--%>
                <%--</form>--%>
            <%--</div>--%>
        <%--</div>--%>
    <%--</div>--%>
<%--</section>--%>
<%--<div class="photo_box">--%>
    <%--<script>--%>
        <%--Core.autoBanner = true;--%>
    <%--</script>--%>
    <%--<a href="javascript:;" class="photo_big_bar photo_big_left"><b style="display: inline;"></b></a>--%>
    <%--<a href="javascript:;" class="photo_big_bar photo_big_right"><b style="display: block;"></b></a>--%>
    <%--<div class="photo_b_box">--%>
        <%--<ul class="photo_b_list ">--%>
            <%--<li style="background-image: url(images/bianxingjinggang.jpg);background-color: #070709;">--%>
                <%--<a href="purcase.html" target="_blank"></a>--%>
            <%--</li>--%>
            <%--<li style="background-image: url(images/xiongshi.jpg);background-color: #f1cf4a;">--%>
                <%--<a href="purcase.html" target="_blank"></a>--%>
            <%--</li>--%>
            <%--<li style="background-image: url(images/yixing.jpg);background-color: #020001;">--%>
                <%--<a href="purcase.html" target="_blank"></a>--%>
            <%--</li>--%>
            <%--<li style="background-image: url(images/shenqinvxia.jpg);background-color: #02100a;">--%>
                <%--<a href="purcase.html" target="_blank"></a>--%>
            <%--</li>--%>
        <%--</ul>--%>
    <%--</div>--%>
<%--</div>--%>

    <%--&lt;%&ndash;<script src="dist/js/jquery.min.js"/>--%>
    <%--<script src="dist/js/bootstrap.min.js"/>&ndash;%&gt;--%>

<%--</body>--%>
<%--</html>--%>
