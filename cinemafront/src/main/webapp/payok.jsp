<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>阿八电影-选座购票,购买电影票,电影排期,电影院查询</title>

    <meta name="keywords" content="阿八电影,选座购票,买电影票,在线购票,影讯,热映影片">
    <meta name="description" content="阿八电影是一个能够让您在线购买电影票的在线选座平台，同时枫林晚电影还提供电影排期，影院信息查询等服务，方便您足不出户，在家中在线购票。看电影，来枫林晚电影选座">

    <link rel="stylesheet" href="css/fast/reset.css">
    <style>
        #payok {
            display: block;
            margin: 100px auto;
            width: 300px;
        }
        span{
            font-size: 30px;
            color: #e34551;
            font-family:sans-serif;
        }
    </style>

</head>

<body>

<%@include file="header.jsp" %>
<div style="width: 100%;height: 250px">
    <div id="payok"><span>恭喜您，购票成功！</span></div>
</div>


<div id="sideBar" class="">
    <a id="toTop" href="javascript:;" rel="nofollow" title="回到顶部" hidefocus="true"></a>
</div>
<%@include file="footer.jsp" %>

<script type="text/javascript" src="layer-v3.1.1/layer/layer.js"></script>
<script type="text/javascript" src="layui/layui.all.js"></script>
<script src="js/jquery.js"></script>

<script type="text/javascript">

</script>


</body>

</html>
