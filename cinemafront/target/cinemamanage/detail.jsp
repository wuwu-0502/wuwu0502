<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="shortcut icon" href="#">
    <title>购买</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="mobile-agent"
          content="format=html5;url=http://piao.163.com/wap/movie/detail.html?movieId=48488&amp;cityCode=320500">
    <meta name="mobile-agent"
          content="format=xhtml;url=http://piao.163.com/wap/movie/detail.html?movieId=48488&amp;cityCode=320500">
    <meta name="mobile-agent"
          content="format=wml;url=http://piao.163.com/wap/movie/detail.html?movieId=48488&amp;cityCode=320500">

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/core.css">
    <link rel="stylesheet" href="css/detail_new.css">
    <link rel="stylesheet" type="text/css" href="layui/css/layui.css" />
    <script src="js/jquery.js"></script>
    <script src="layui/layui.all.js"></script>
    <script src="layer-v3.1.1/layer/layer.js"></script>

    <script src="js/easyCore.js"></script>
    <script src="js/js2/dialog.js"></script>
    <script src="js/autoComplete.js"></script>


    <script>
        if (!!window.Core) {
            Core.cdnBaseUrl = "http://pimg1.126.net/movie";
            Core.cdnFileVersion = "1495696265";
            Core.curCity = {'name': '苏州', 'id': '1017', 'spell': 'suzhou'};
        }
    </script>


    <style type="text/css">
        .div-inline{display: inline}
        #name{font-size:16px}
        #name{color: #337ab7}
        #date{
            color: #00a7d0;}
        p{font-size:16px}
        @-webkit-keyframes loginPopAni {
                               0% {
                                   opacity: 0;
                                   -webkit-transform: scale(0);
                               }
                               15% {
                                   -webkit-transform: scale(0.667);
                               }
                               25% {
                                   -webkit-transform: scale(0.867);
                               }
                               40% {
                                   -webkit-transform: scale(1);
                               }
                               55% {
                                   -webkit-transform: scale(1.05);
                               }
                               70% {
                                   -webkit-transform: scale(1.08);
                               }
                               85% {
                                   opacity: 1;
                                   -webkit-transform: scale(1.05);
                               }
                               100% {
                                   opacity: 1;
                                   -webkit-transform: scale(1);
                               }
                           }

    @keyframes loginPopAni {
        0% {
            opacity: 0;
            transform: scale(0);
        }
        15% {
            transform: scale(0.667);
        }
        25% {
            transform: scale(0.867);
        }
        40% {
            transform: scale(1);
        }
        55% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(1.08);
        }
        85% {
            opacity: 1;
            transform: scale(1.05);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }</style>
</head>
<body>

<%@include file="header.jsp"%>

<div id="stars"></div>
<div class="wrap990">
    <section class="mv_info_box clearfix">
        <div id="share" class="share">
            <div class="share_inner">影片分享到<b></b>
                <div class="shareDiv" id="shareDiv"><a class="cpShareLink" rel="neteasyweibo"
                                                       href="http://t.163.com/article/user/checkLogin.do?link=http://piao.163.com&amp;source=%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;info=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.163&amp;togImg=true&amp;images="
                                                       title="网易微博" target="_blank"><em
                        class="cpShareIcon neteasyweibo"></em></a><a class="cpShareLink" rel="sinaweibo"
                                                                     href="http://v.t.sina.com.cn/share/share.php?url=http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.sina&amp;title=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;searchPic=true&amp;pic="
                                                                     title="新浪微博" target="_blank"><em
                        class="cpShareIcon sinaweibo"></em></a><a class="cpShareLink" rel="qqweibo"
                                                                  href="http://share.v.t.qq.com/index.php?c=share&amp;a=index&amp;site=http://caipiao.163.com&amp;url=http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.qq&amp;title=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;pic="
                                                                  title="腾讯微博" target="_blank"><em
                        class="cpShareIcon qqweibo"></em></a><a class="cpShareLink" rel="qqzone"
                                                                href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.qqzone&amp;desc=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.qqzone&amp;summary=%20&amp;title=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8,%E5%85%91%E6%8D%A2%E5%88%B8,%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4,%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;site=http://caipiao.163.com&amp;otype=share&amp;pics="
                                                                title="QQ空间" target="_blank"><em
                        class="cpShareIcon qqzone"></em></a><a class="cpShareLink" rel="renren"
                                                               href="http://widget.renren.com/dialog/share?resourceUrl=http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.renren&amp;title=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;description=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.renren&amp;charset=utf-8&amp;pic="
                                                               title="人人网" target="_blank"><em
                        class="cpShareIcon renren"></em></a><a class="cpShareLink" rel="kaixin"
                                                               href="http://www.kaixin001.com/rest/records.php?content=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;url=http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.kaixin&amp;starid=0&amp;aid=0&amp;style=11&amp;pic="
                                                               title="开心网" target="_blank"><em
                        class="cpShareIcon kaixin"></em></a><a class="cpShareLink" rel="douban"
                                                               href="http://shuo.douban.com/!service/share?href=http%3A%2F%2Fpiao.163.com%2Fsuzhou%2Fmovie%2F48488.html%23from%3Dt.douban&amp;name=%E6%82%9F%E7%A9%BA%E4%BC%A0-%E5%9C%A8%E7%BA%BF%E8%B4%AD%E7%A5%A8%2C%E5%85%91%E6%8D%A2%E5%88%B8%2C%E4%B8%8A%E6%98%A0%E6%97%B6%E9%97%B4%2C%E9%A2%84%E5%91%8A%E7%89%87-%E7%BD%91%E6%98%93%E7%94%B5%E5%BD%B1&amp;image="
                                                               title="豆瓣网" target="_blank"><em
                        class="cpShareIcon douban"></em></a></div>
            </div>
        </div>

        <div class="poster">
            <img src="images/movieImg/zhanlang2.jpg" width="200" height="267" alt="${detailMovie.m_img}">
        </div>
        <dl class="mv_info">
            <dt class="overflow">
                <span class="mv_name"><h2>${detailMovie.m_name}</h2></span>
            </dt>
            <dd class="summary"></dd>
            <dd class="des">上映地区：<em class="">${detailMovie.m_address}</em></dd>
            <dd class="des">导演：${detailMovie.m_director}</dd>
            <dd class="des role" id="role" style="height: auto;">
                <span style="float:left;">主演：</span>
                <div class="role_list" id="roleList">
                    <span>${detailMovie.m_player}</span>
                </div>
            </dd>
            <dd class="other"><span>${detailMovie.m_languge}</span><span>${detailMovie.m_sort}</span>
                <span>
                    ${detailMovie.m_time}分钟
                </span>
            </dd>
        </dl>
        <script>
            Core.movieId = 48488;
        </script>
    </section>
    <article class="mv_body_990 clearfix mt10">
        <section class="mv_info_box clearfix">
            <div id="pq">
                <ul class="mv_detail_tab" id="mvTabs">
                    <li rel="#part2" class="active" id="">影院排期</li>
                    <li rel="#part1" class="" id="commentTab">剧情影评</li>
                </ul>
            </div>

            <div class="mv_comment_box" id="part1" style="display: none;">
                <div class="mv_comm_plot">
                    <div class="title">
                        <h2>剧情简介：</h2>
                    </div>
                    <p>${detailMovie.m_tip}</p>
                </div>
                <div class="mv_comm_short">
                    <div class="title clearfix">
                        <h2>影评</h2>
                        <span id="commCount_S" class="tip">（共 <em>${comments.size()}</em> 条）</span>
                        <c:if test="${!empty user || !empty user.u_name}">
                            <a href="javascript:void(0);" id="writeScommt" class="btn_e34551 btn_89_29" onclick="addComment()">发表新影评</a>
                        </c:if>
                        <c:if test="${empty user}">
                            <a href="login.jsp" id="writeScommt" class="btn_e34551 btn_89_29">发表新影评</a>
                        </c:if>

                    </div>

                    <div class="no_short_warp" id="noShortPart">
                        <div class="no_short_box">
                            <b class="icon_no"></b>
                            <span class="text">
										<span class="h">还木有影评！你来说两句吧！</span>
								</span>
                        </div>
                    </div>
                </div>
                <dl class="list clearfix" id="sCommentList">

                    <c:forEach items="${comments}" var="comt">
                        <hr/>
                        <dd>
                            <div class="infor">
                                <div class="div-inline" id="name">${comt.u_name}</div>
                                <div class="div-inline">看过</div>
                                <div class="div-inline stars" id="comments-list"></div>
                                <div class="div-inline" id="date">${comt.c_date}</div>
                            </div>
                            <br/>
                            <div id="detail">${comt.c_word}</div>
                        </dd>
                    </c:forEach>

                </dl>
                <%--<div id="moreScommt" class="more hide">--%>
                    <%--<a href="javascript:">再显示<em>20</em>条影评</a>--%>
                <%--</div>--%>
            </div>


            <div class="mv_comment_box" id="part2" style="display: block;">
                <div class="movieTabC pos_r movieTabC_in clearfix">
                    <dl class="area clearfix">
                        <dt>日期：</dt>
                        <dd>
                            <ul class="areaList areaList_new overflow clearfix areaList_hidden timeTabsList"
                                id="timeTabs">
                                <li class="active"><i class="low"></i>
                                    <a href="javascript:" id="showtime" onclick="showSs(this)"><i class="sub" ></i></a>
                                </li>
                                <li><i class="low"></i>
                                    <a href="javascript:" id="showtime2" onclick="showSs(this)"><i class="sub"></i></a>
                                </li>
                                <li><i class="low"></i>
                                    <a href="javascript:" id="showtime3" onclick="showSs(this)"><i class="sub"></i></a>
                                </li>
                                <li><i class="low"></i>
                                    <a href="javascript:" id="showtime4" onclick="showSs(this)"><i class="sub"></i></a>
                                </li>
                            </ul>
                        </dd>
                    </dl>
                </div>
                <ul class="movie_s_tab" id="mvSubTabs">
                    <li class="active" rel="#subPart1"><span class="seat">在线选座</span></li>
                </ul>
                <div class="movie_s_cont" id="subPart1" style="display:block;">
                    <table class="cinemaAdd" width="100%" id="cnTbl">
                        <thead>
                        <tr>
                            <th width="18%">放映时间</th>
                            <th width="13%">语言版本</th>
                            <th width="15%">放映厅</th>
                            <th width="18%">选座预览</th>
                            <th width="18%">现价/影院价(元)</th>
                            <th width="18%">选座购票</th>
                        </tr>
                        </thead>
                        <tbody id="movieTbody" class="movieTbodyAct">
                        </tbody>
                    </table>
                </div>

                <script type="text/javascript">
                    (function (window, $) {
                        if (Core.isInFrame) {
                            //邮箱应用链接增加前缀
                            var len = $("#cinemaContent").find("a[rBtn]").length;
                            var rBtn = $("a[rBtn]");
                            $("#cinemaContent").find(".groupBtn").attr("target", "_blank");//特惠新窗口跳到主站
                            for (var i = 0; i < len; i++) {
                                $(rBtn[i]).attr("href", "/mailapp" + $(rBtn[i]).attr("href").replace("http://piao.163.com", ""));
                            }
                        }
                    })(window, jQuery);
                </script>

                <div class="movieTabC" id="dateContent">
                    <div id="areaContent" style="zoom:1;">
                        <script type="text/javascript">
                            //126邮箱应用没有影院相关页面，删除链接
                            (function (window, $) {
                                if (Core.isInFrame) {
                                    //邮箱应用链接增加前缀
                                    $("#ticketCinemaName").attr("href", "javascript:;").css({
                                        "cursor": "default",
                                        "text-decoration": "none"
                                    });
                                }
                            })(window, jQuery);
                        </script>
                    </div>
                </div>
            </div>

        </section>
    </article>
</div>

<div id="sideBar" class="">
    <a id="toTop" href="javascript:;" rel="nofollow" title="回到顶部" hidefocus="true"></a>
</div>
<%@include file="footer.jsp"%>
<script>
    $(function () {
        showTime();
        var time=new Date();
        var month=time.getMonth();
        var date=time.getDate();
        var day=time.getDay();
        month=month+1;
        var now_time=month+'-'+date;
        $.ajax({
            url:"sc/getallss",
            dataType:"json",
            data:"date="+now_time+"&m_id="+${detailMovie.m_id},
            type:"POST",
            success:function (schedules) {
                $("#movieTbody").empty();
                $.each(schedules,function (index,item) {
                    $("#movieTbody").append('<tr>\n' +
                        '                                        <td><span>'+item.s_starttime+'</span></br><span style="font-size:12px">预计'+item.s_endtime+'散场</span></td>\n' +
                        '                                        <td>'+item.s_language+'</td>\n' +
                        '                                        <td>'+item.h_id+'号'+item.h_name+'厅'+'</td>\n' +
                        '                                        <td>宽松</td>\n' +
                        '                                        <td>'+item.s_price+'</td>\n' +
                        '<c:if test="${!empty user || !empty user.u_name}">'+
                        '                                        <td class="td-manage">\n' +
                        '                                            <a title="选座购票" href="sc/pass?s_id='+item.s_id+'">\n' +
                        '                                                <i class="layui-icon">&#xe63c;</i></a>\n' +
                        '                                        </td>   </c:if>\n' +
                        '<c:if test="${empty user}">'+
                        '                                        <td class="td-manage">\n' +
                        '                                            <a title="选座购票" href="login.jsp">\n' +
                        '                                                <i class="layui-icon">&#xe63c;</i></a>\n' +
                        '                                        </td>   </c:if>\n' +
                        '                                    </tr>')
                })
            }
        });
        $.ajax({
            url:'cc/getallcs',
            dataType:'json',
            data:'m_id='+${detailMovie.m_id},
            success:function () {

            }
        });

        <%--$.each(${comments},function (index,item) {--%>
            <%--layui.use(['rate'], function(){--%>
                <%--var rate = layui.rate;--%>
                <%--rate.render({--%>
                    <%--elem: '.stars'--%>
                    <%--,value: item.c_score--%>
                    <%--,readonly: true--%>
                    <%--,half:true--%>
                <%--});--%>
            <%--});--%>
        <%--});--%>

    });
    function showTime(){
        var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
        // 当前时间
        var time=new Date();
        var month=time.getMonth();
        var date=time.getDate();
        var day=time.getDay();
        month=month+1;
        var now_time='0'+month+'-'+date+' '+show_day[day]+' '+'(今天)';
        // 向后一天
        var nexttime=new Date(time.getTime()+24*60*60*1000);
        var nextmonth=nexttime.getMonth();
        var nextdate=nexttime.getDate();
        var nextday=nexttime.getDay();
        nextmonth=nextmonth+1;
        var next_time='0'+nextmonth+'-'+nextdate+' '+show_day[nextday];
        // 向后两天
        var nexttime2=new Date(time.getTime()+2*24*60*60*1000);
        var nextmonth2=nexttime2.getMonth();
        var nextdate2=nexttime2.getDate();
        var nextday2=nexttime2.getDay();
        nextmonth2=nextmonth2+1;
        var next_time2='0'+nextmonth2+'-'+nextdate2+' '+show_day[nextday2];
        //向后三天
        var nexttime3=new Date(time.getTime()+3*24*60*60*1000);
        var nextmonth3=nexttime3.getMonth();
        var nextdate3=nexttime3.getDate();
        var nextday3=nexttime3.getDay();
        nextmonth3=nextmonth3+1;
        var next_time3='0'+nextmonth3+'-'+nextdate3+' '+show_day[nextday3];
        document.getElementById('showtime').innerHTML=now_time;
        document.getElementById('showtime2').innerHTML=next_time;
        document.getElementById('showtime3').innerHTML=next_time2;
        document.getElementById('showtime4').innerHTML=next_time3;
        setTimeout("showTime();",1000);
    }
    function showSs(obj) {
        var str=obj.innerHTML;
        $.ajax({
            url:"sc/getallss",
            dataType:"json",
            data:"date="+str.split(" ")[0]+"&m_id="+${detailMovie.m_id},
            type:"POST",
            success:function (schedules) {
                $("#movieTbody").empty();
                $.each(schedules,function (index,item) {
                    $("#movieTbody").append('<tr>\n' +
                        '                                        <td><span>'+item.s_starttime+'</span></br><span>预计'+item.s_endtime+'散场</span></td>\n' +
                        '                                        <td>'+item.s_language+'</td>\n' +
                        '                                        <td>'+item.h_id+'号'+item.h_name+'厅'+'</td>\n' +
                        '                                        <td>宽松</td>\n' +
                        '                                        <td>'+item.s_price+'</td>\n' +
                        '                                        <td class="td-manage">\n' +
                        '                                            <a title="选座购票" href="sc/pass?s_id='+item.s_id+'">\n' +
                        '                                                <i class="layui-icon">&#xe63c;</i></a>\n' +
                        '                                        </td>\n' +
                        '                                    </tr>')
                })
            }
        });
    }






</script>

<script>
    function addComment() {
        layer.open({
            type: 2, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
            shade:0.1, //遮罩层透明度
            area:['850px','500px'], //弹出层宽高
            title:'写评论',//弹出层标题
            content: 'comment-add.jsp' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        });
    }
</script>

<script src="js/share.js"></script>
<script src="js/movie/mvCommon.js"></script>
<script src="js/imgSlide.js"></script>
<script src="js/imgZoom.js"></script>
<script src="js/photoview.js"></script>
<script src="js/mvCinema.js"></script>
<%--<script src="js/comment.js"></script>--%>
<script src="js/mvDetail.js"></script>
<script>Core && Core.fastInit && Core.fastInit("1");</script>
<div id="autoCompleteList"></div>
<script type="text/javascript">
    Core.statistics_adsage("ca");
</script>

<script src="js/ntes.js"></script>
<script>_ntes_nacc = "dianying";
neteaseTracker();</script>


</body>
</html>
