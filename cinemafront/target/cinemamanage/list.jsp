<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>

<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="shortcut icon" href="list">
    <title>阿八影院</title>
    <link rel="stylesheet" type="text/css" href="css/order/base.css"/>
    <link rel="stylesheet" type="text/css" href="css/order/bmap.css"/>
    <link rel="stylesheet" type="text/css" href="css/order/core.css"/>
    <link rel="stylesheet" type="text/css" href="css/order/iSelect.css"/>
    <link rel="stylesheet" type="text/css" href="css/order/myorder.css"/>

    <script src="js/order/jquery-1.4.2.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/order/dialog.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/order/easyCore.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/order/iSelect.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/order/list.js" type="text/javascript" charset="utf-8"></script>


    <style type="text/css">
        #button1 {
            -webkit-border-radius: 4;
            -moz-border-radius: 4;
            border-radius: 4px;
            text-shadow: 0px 1px 0px #283966;
            -webkit-box-shadow: inset 0px 39px 0px -24px #9fb4f2;
            -moz-box-shadow: inset 0px 39px 0px -24px #9fb4f2;
            box-shadow: inset 0px 39px 0px -24px #9fb4f2;
            font-family: Arial;
            color: #ffffff;
            font-size: 12px;
            background: #7892c2;
            padding: 8px 20px 8px 20px;
            border: solid #4e6096 1px;
            text-decoration: none;
            margin-left:82%;
        }

        #button1:hover {
            color: #ffffff;
            background: #476e9e;
            text-decoration: none;
        }
    </style>
</head>

<body>

<%@include file="header.jsp"%>

<div class="ctLocation">
    <div class="topLine"></div>
    <div class="location">您的位置：
        <a href="">首页</a><em>&gt;</em>我的订单</div>
</div>
<article class="ctMain clearfix">
    <section class="ctSider mt10">
        <ul class="leftNav" id="leftNav">
            <li class="active">
                <a href="list" class="out">我的订单</a>
            </li>
        </ul>
    </section>

        <section class="ctCont mt10">
            <div class="ctSearch">
                <div class="right">
                    <input type="text" value="请输入电影名称、影院名称、订单号" class="text textGray" name="searchValue" id="searchValue" style="display: none">
                    <input type="submit" value="搜索" class="sub" id="search" hidden>
                </div>
            </div>
            <table class="ctTable">
                <thead>
                <tr>
                    <th width="15%" class="num SimSun">订单号</th>
                    <th width="17%">下单时间</th>
                    <th width="15%">影片</th>
                    <th width="8%">总额(元)</th>
                    <th width="8%">订单状态</th>
                    <th width="20%">操作</th>

                </tr>
                </thead>
            </table>
            <c:forEach items="${orders}" var="order">
                <dl class="ctList active">
                    <dt>
                    <table>
                        <thead>
                        <tr>
                            <th width="15%" class="num SimSun" sk="1">${order.o_no}</th>
                            <th width="17%" class="SimSun">${order.o_subtime}</th>
                            <th width="15%" class="SimSun">${order.m_name}</th>
                            <th width="8%">
                                <em class="count">
                                    <fmt:formatNumber value="${order.od_price}" maxFractionDigits="2"/>
                                </em>
                            </th>
                            <th width="8%" class="SimSun">
                                <c:if test="${order.o_status == 0}"> 未付款</c:if>
                                <c:if test="${order.o_status == 1}">已付款</c:if>
                                <c:if test="${order.o_status == 2}">已完成</c:if>
                            </th>


                            <th width="12%">
                                <a href="home.jsp" target="_blank" class="resBuy">重新购票</a>
                            </th>
                            <th width="8%">
                                <span class="detail">详情</span>
                            </th>
                        </tr>
                        </thead>
                    </table>
                    </dt>
                    <dd>
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                            <tr>
                                <th><span class="blank">&nbsp;</span>订票类型：</th>
                                <td>
                                    订座票
                                    <span class="blank">&nbsp;</span>
                                </td>
                            </tr>
                            <tr>
                                <th><span class="blank">&nbsp;</span>观影日期：</th>
                                <td>${order.s_data}<span class="blank">&nbsp;</span></td>
                            </tr>
                            <tr>
                                <th><span class="blank">&nbsp;</span>场次信息：</th>
                                <td>${order.h_id}号厅${order.h_name}<span class="blank">&nbsp;</span></td>
                            </tr>
                            <tr>
                                <th><span class="blank">&nbsp;</span>座位信息：</th>
                                <td>${order.od_seat}<span class="blank">&nbsp;</span></td>
                            </tr>
                            </tbody>

                        </table>
                        <c:if test="${order.o_status==0}"><button id="button1" onclick="gotoConfirm()">去付款</button></c:if>
                    </dd>
                </dl>
            </c:forEach>

            <input type="hidden" name="recordPerPage" value="20">
            <input type="hidden" name="currentPage" id="currentPage">
        </section>
</article>


<script>
    Core && Core.fastInit && Core.fastInit("1");
</script>
<script src="js/order/ntes.js" type="text/javascript" charset="utf-8"></script>
<script>
    _ntes_nacc = "shop";
    neteaseTracker();

    function gotoConfirm(){
        window.location.href="confirm.jsp"
    }
</script>


</body>

</html>