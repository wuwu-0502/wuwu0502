<%@ page import="java.util.List" %>
<%@ page import="com.cinema.entity.Movie" %>
<%@ taglib prefix="C" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<%@include file="header.jsp"%>

<body style="background-color: seashell">
<div class="photo_box">
    <script>
        Core.autoBanner = true;
    </script>
    <a href="javascript:;" class="photo_big_bar photo_big_left"><b style="display: inline;"></b></a>
    <a href="javascript:;" class="photo_big_bar photo_big_right"><b style="display: block;"></b></a>
    <div class="photo_b_box">
        <ul class="photo_b_list ">
            <li style="background-image: url(images/bianxingjinggang.jpg);background-color: #070709;">
                <a href="purcase.html" target="_blank"></a>
            </li>
            <li style="background-image: url(images/xiongshi.jpg);background-color: #f1cf4a;">
                <a href="purcase.html" target="_blank"></a>
            </li>
            <li style="background-image: url(images/yixing.jpg);background-color: #020001;">
                <a href="purcase.html" target="_blank"></a>
            </li>
            <li style="background-image: url(images/shenqinvxia.jpg);background-color: #02100a;">
                <a href="purcase.html" target="_blank"></a>
            </li>
        </ul>
    </div>
</div>

<section class="bodyMain mainCont1">
    <a class="fastBuyNav " href="onshow.jsp"></a>
    <section class="mainCont clearfix">
        <%--<a href="movie/sort"></a>--%>
        <div class="mainLeft">
            <h2 class="colTitle">
                <span class="colText">热映电影推荐</span>
                <a href="onshow.jsp" rel="nofollow" target="_blank" class="colMore">全部热映电影&gt;</a>
            </h2>

            <script>
                $(function () {
                    $.ajax({
                        url:"movie/sort",
                        dataType:"json",
                        type:"post",
                        async:false,
                        success:function (movs) {
                            var i = 0
                            var j = 0
                            $.each(movs,function (index, item) {
                                var sc=item.c_score
                                var score=Math.round(sc)
                                if (i < 2) {
                                    i++
                                    $("#sort").append('<ul class="movie_con"  style="margin-bottom: 10px;">\n' +
                                        '                        <li class="l1"  >\n' +
                                        '                            <div class="showImg">\n' +
                                        '                                <em class="mvType mvType3d"></em>\n' +
                                        '                                <a target="_blank" title="'+item.m_name+'" href="movie/detail?mvId='+item.m_id+'" rel="nofollow"><img width="220" height="300" alt="'+item.m_name+'" src="images/movieImg/'+item.m_img+'"></a>\n' +
                                        '                            </div>\n' +
                                        '                        </li>\n' +
                                        '                        <li class="l2" style="height: 300px; ">\n' +
                                        '                            <h3>\n' +
                                        '                                <a target="_blank" title="'+item.m_name+'"  href="movie/detail?mvId='+item.m_id+'" rel="nofollow">'+item.m_name+'</a>\n' +
                                        '                            </h3>\n' +
                                        '                            <p class="p2">\n' +
                                        '                                <em>评分:'+score+'</em>\n' +
                                        '                            </p>\n' +
                                        '                            <p class="p2">2019-08-28上映</p>\n' +
                                        '                            <p class="p2" style="font-size:12px;">'+item.m_tip+'</p>\n' +
                                        '\n' +
                                        '                                <%--<span class="lowPrice">未获取<i>元起</i></span>--%>\n' +
                                        '                            <a target="_blank" class="showBtn" href="movie/detail?mvId='+item.m_id+'" rel="nofollow">选座购票</a>\n' +
                                        '                        </li>\n' +
                                        '                    </ul>')
                                }
                                else if (1 < i < 6) {
                                    $("#sort2").append('<li>\n' +
                                        '                            <div class="showImg">\n' +
                                        '                                <a target="_blank" title="'+item.m_name+'" href="movie/detail?mvId='+item.m_id+'" rel="nofollow"><img width="220" height="300" alt="'+item.m_name+'" src="images/movieImg/'+item.m_img+'" title="图片加载异常"></a>\n' +
                                        '                            </div>\n' +
                                        '                            <div class="m_con">\n' +
                                        '                                <em>'+score+'分</em>\n' +
                                        '                                    <%--<strong>未获取</strong>元起--%>\n' +
                                        '\n' +
                                        '                            </div>\n' +
                                        '                            <br>\n' +
                                        '                            <p>\n' +
                                        '                                <a target="_blank" class="showBtn" href="movie/detail?mvId='+item.m_id+'" rel="nofollow">选座购票</a>\n' +
                                        '                            </p>\n' +
                                        '                        </li>')
                                    i++
                                }
                                if (j < 5){
                                    $("#movieSort").append('<li><em class="score fr">评分:'+score+'</em><b class="b'+j+'"></b>\n' +
                                        '                    <a href="/beijing/movie/48542.html" target="_blank" title="'+item.m_name+'">'+item.m_name+'</a>\n' +
                                        '                </li>')
                                    j++
                                }
                            })
                        }
                    });
                });

            </script>

            <div class="hotMovie clearfix" id="sort">
            </div>
            <div class="hotMovie2 clearfix" >

                <ul class="posterStyle clearfix" id = "sort2">
                </ul>
            </div>
        </div>
        <div class="mainRight">
            <div class="side1">
                <div class="side1Client" ></div>
                <dl class="side1Pro">
                    <dt>购票流程</dt>
                    <dd><b class="b1"></b>1.选择场次</dd>
                    <dd><b class="b2"></b>2.在线选座位并支付</dd>
                    <dd><b class="b3"></b>3.短信获取取票码</dd>
                    <dd><b class="b4"></b>4.凭码自助取票</dd>
                </dl>
            </div>
        </div>
    </section>
    <section class="mainCont clearfix mt15">
        <div class="mainLeft upIndex">
            <h2 class="showTitle clearfix">
                <a href="onshow.jsp" rel="nofollow" class="colMore" target="_blank">全部即将上映电影&gt;</a>
                <a href="javascript:;" class="active upMovieTab" rel="upMovie1">最受期待</a><span class="fg">/</span><a href="javascript:;" class="upMovieTab" rel="upMovie2">即将上映</a>
            </h2>

            <script>
                $(function () {
                    $.ajax({
                        url: "movie/upcome1",
                        dataType: "json",
                        type: "post",
                        async: false,
                        success: function (movs) {
                            $.each(movs, function (index, item) {
                                var flag = item.m_flag
                                if (flag == 2) {
                                    $("#upMov1").append('<li>\n' +
                                        '                            <i class="dot"></i>\n' +
                                        '                            <div class="wantNum"><em class="wantSeeSum">9573</em>人想看</div>\n' +
                                        '                            <div class="showImg">\n' +
                                        '                                <a target="_blank" title="'+item.m_name+'" href="movie/detail?mvId='+item.m_id+'" rel="nofollow"><img width="220" height="300" alt="'+item.m_name+'" src="images/movieImg/'+item.m_img+'"></a>\n' +
                                        '                            </div>\n' +
                                        '                            <div class="title">\n' +
                                        '                                <span class="playTime2">2019-09-10 上映</span>\n' +
                                        '                                <p class="t1">\n' +
                                        '                                    <a target="_blank" title="'+item.m_name+'" href="/beijing/movie/48491.html" rel="nofollow">'+item.m_name+'</a>\n' +
                                        '                                </p>\n' +
                                        '                            </div>\n' +
                                        '\n' +
                                        '                            <p>\n' +
                                        '                                <a href="javascript:;" class="want_see " pid="9573">想看</a>\n' +
                                        '                            </p>\n' +
                                        '                        </li>')
                                } else if (flag == 3) {
                                    $("#upMov2").append('<li>\n' +
                                        '                            <i class="dot"></i>\n' +
                                        '                            <div class="playTime">2019-09-20上映</div>\n' +
                                        '                            <div class="showImg">\n' +
                                        '                                <a target="_blank" title="'+item.m_name+'" href="/beijing/movie/48647.html" rel="nofollow"><img width="220" height="300" alt="'+item.m_name+'" src="images/movieImg/'+item.m_img+'"></a>\n' +
                                        '                            </div>\n' +
                                        '                            <div class="title">\n' +
                                        '                                <span class="see_sum"><em class="wantSeeSum">9486</em>人想看</span>\n' +
                                        '                                <p class="t1">\n' +
                                        '                                    <a target="_blank" title="'+item.m_name+'" href="/beijing/movie/48647.html" rel="nofollow">'+item.m_name+'</a>\n' +
                                        '                                </p>\n' +
                                        '                            </div>\n' +
                                        '                            <p>\n' +
                                        '                                <a href="javascript:;" class="want_see " pid="9486">想看</a>\n' +
                                        '                            </p>\n' +
                                        '                        </li>')
                                }
                            })
                        }
                    });
                })
            </script>
            <div class="upMovie" id="upMovie1">
                <ul class="posterStyle clearfix" id="upMov1">
                    <%--<c:forEach items="${popularList}" var="pm">--%>
                        <%--<li>--%>
                            <%--<i class="dot"></i>--%>
                            <%--<div class="wantNum"><em class="wantSeeSum">${pm.popular}</em>人想看</div>--%>
                            <%--<div class="showImg">--%>
                                <%--<a target="_blank" title="${pm.mvName}" href="movie/detail?mvId=${pm.id}" rel="nofollow"><img width="220" height="300" alt="${pm.mvName}" src="images/movieImg/${pm.cover.imgName}"></a>--%>
                            <%--</div>--%>
                            <%--<div class="title">--%>
                                <%--<span class="playTime2">${pm.showDate} 上映</span>--%>
                                <%--<p class="t1">--%>
                                    <%--<a target="_blank" title="${pm.mvName}" href="/beijing/movie/48491.html" rel="nofollow">${pm.mvName}</a>--%>
                                <%--</p>--%>
                            <%--</div>--%>

                            <%--<p>--%>
                                <%--<a href="javascript:;" class="want_see " pid="${pm.popular}">想看</a>--%>
                            <%--</p>--%>
                        <%--</li>--%>
                    <%--</c:forEach>--%>

                </ul>
            </div>

            <div class="upMovie hide" id="upMovie2">
                <ul class="posterStyle clearfix" id="upMov2">
                    <%--<c:forEach items="${commingList}" var="cm">--%>
                        <%--<li>--%>
                            <%--<i class="dot"></i>--%>
                            <%--<div class="playTime">${cm.showDate}上映</div>--%>
                            <%--<div class="showImg">--%>
                                <%--<a target="_blank" title="${cm.mvName}" href="/beijing/movie/48647.html" rel="nofollow"><img width="220" height="300" alt="${cm.mvName}" src="images/movieImg/${cm.cover.imgName}"></a>--%>
                            <%--</div>--%>
                            <%--<div class="title">--%>
                                <%--<span class="see_sum"><em class="wantSeeSum">${cm.popular}</em>人想看</span>--%>
                                <%--<p class="t1">--%>
                                    <%--<a target="_blank" title="${cm.mvName}" href="/beijing/movie/48647.html" rel="nofollow">${cm.mvName}</a>--%>
                                <%--</p>--%>
                            <%--</div>--%>
                            <%--<p>--%>
                                <%--<a href="javascript:;" class="want_see " pid="${cm.popular}">想看</a>--%>
                            <%--</p>--%>
                        <%--</li>--%>
                    <%--</c:forEach>--%>

                </ul>
            </div>
        </div>

        <div class="mainRight">
            <h2 class="colTitle"><span class="colText">电影周排行榜</span></h2>
            <ul class="weeklyTop" id="movieSort">
                <%--<li><em class="score fr">7.5</em><b class="b0"></b>--%>
                    <%--<a href="/beijing/movie/48542.html" target="_blank" title="神偷奶爸3">神偷奶爸3</a>--%>
                <%--</li>--%>
                <%--<li><em class="score fr">7.0</em><b class="b1"></b>--%>
                    <%--<a href="/beijing/movie/48489.html" target="_blank" title="大护法">大护法</a>--%>
                <%--</li>--%>
                <%--<li><em class="score fr">7.2</em><b class="b2"></b>--%>
                    <%--<a href="/beijing/movie/48488.html" target="_blank" title="悟空传">悟空传</a>--%>
                <%--</li>--%>
                <%--<li><em class="score fr">8.0</em><b class="b3"></b>--%>
                    <%--<a href="/beijing/movie/48522.html" target="_blank" title="变形金刚5：最后的骑士">变形金刚5：最后...</a>--%>
                <%--</li>--%>
                <%--<li><em class="score fr">8.0</em><b class="b4"></b>--%>
                    <%--<a href="/beijing/movie/48484.html" target="_blank" title="京城81号Ⅱ">京城81号Ⅱ</a>--%>
                <%--</li>--%>
            </ul>
        </div>
    </section>

</section>



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
