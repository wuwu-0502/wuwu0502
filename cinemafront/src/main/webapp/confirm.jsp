<%@ page import="java.util.List" %>
<%@ page import="com.cinema.entity.Movie" %>
<%@ taglib prefix="C" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>

<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>阿八电影-选座购票,购买电影票,在线支付,电影院查询</title>

    <meta name="keywords" content="阿八电影,选座购票,买电影票,在线购票,支付,热映影片">
    <meta name="description" content="阿八电影是一个能够让您在线购买电影票的在线选座平台，同时阿八电影还提供电影排期，影院信息查询等服务，方便您足不出户，在家中在线支付。看电影，来阿八电影选座">
    <meta http-equiv="X-Frame-Options" content="DENY">


    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet"  href="css/core.css">
    <link rel="stylesheet" href="css/detail.css">

    <script src="js/jquery.js"></script>
    <script src="layui/layui.all.js"></script>
    <script src="layer-v3.1.1/layer/layer.js"></script>
    <script src="js/easyCore.js"></script>
    <script src="js/dialog.js"></script>
    <script src="js/autoComplete.js"></script>



    <script src="js/xframe.js"></script>
</head>
<body>
<%@include file="header.jsp"%>


<div class="wrap">

        <div style="font-weight: bolder;font-size: 25px;background-color: #eaeaea; width: 960px;height: 46px;border-top: 3px solid #f44015;">&nbsp;&nbsp;&nbsp;确认购票信息</div>
        <div class="box_gray mt10">
            <ul class="playList sel_playList pay_playList clearfix">
                <li>
                    <div class="poster"><img src="images/movieImg/${detailMovie.m_img}" width="150" height="200" alt="${detailMovie.m_name}"></div>
                    <dl>
                        <dt>
                        <h2>${detailMovie.m_name}</h2>
                        </dt>
                        <dd class="summary" style="overflow:hidden;">简介:"${detailMovie.m_tip}"</dd>
                        <dd class="des">场次：${schedule.s_data}&nbsp;&nbsp;${schedule.s_starttime}&nbsp;&nbsp;${schedule.h_name}</dd>

                    </dl>
                    <table cellpadding="0" cellspacing="0" border="0">
                        <thead>
                        <tr>
                            <th width="25%" class="tel">
                                <div class="">
                                    <div class="notes"><em class="em1"></em><em class="em2"></em>请确认该号码无误，以免无法接收取票密码和打印电影票!</div>
                                    手机号码<b id="telWarming"></b>
                                </div>
                            </th>
                            <th width="20%">电影名称</th>
                            <th width="18%">时间</th>
                            <th width="22%">座位</th>
                            <th width="15%" style="padding-left:19px;text-align:left;">总额(元)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr id="onShowTR">
                            <td>${user.u_phone}</td>
                            <td>${detailMovie.m_name}</td>
                            <td>${schedule.s_data}&nbsp;&nbsp;${schedule.s_starttime}</td>
                            <td>${check.od_seat}</td>
                            <td class="count" id="totalPrice" style="padding-left:19px;text-align:left;"><span class="imp">¥${check.od_price}</span></td>
                        </tr>
                        </tbody>
                    </table>

                    <div class="coupon_count" style="padding-bottom:20px;border-bottom:1px dotted #808080;width:956px;">
                        <div class="m">应付金额：<em id="totalFavPrice">¥${check.od_price}</em></div>

                    </div>

                    <div class="timer"><script type="text/javascript">Core.closeTime ="30000",Core.productId ="593411258"</script>
                        <div id="last" class="last">
                            <div>
                                <span class="title"><b></b>剩余支付时间：</span>
                                <span class="time">
		                    	<span class="min" id="min">15</span>分
		                        <span class="sec" id="sec">00</span>秒
		                    </span>
                            </div>
                            <div class="notes">请在倒计时内完成付款！否则系统将自动释放已选座位。</div>
                        </div>
                        <div id="invalid" class="invalid" style="display:none;">
                            <span class="intitle"><b></b>该订单已失效</span>
                            <span class="btn ml8" onclick="backseat()">重新选座</span>
                        </div>
                    </div>

                    <div id="methodBox" style="display: block;">
                        <div class="subPay" style="width: 956px">
                            <div class="sub" style="_zoom:1;">
                                <input type="button" value="去付款" onclick="gotoPay()">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

</div>


<%@include file="footer.jsp"%>

<script src="js/pay.js"></script>
<script>Core && Core.fastInit && Core.fastInit("1");</script><div id="autoCompleteList"></div>

<script src="js/ntes.js"></script>
<script>_ntes_nacc = "dianying";neteaseTracker();</script>




<script>
    $(function () {
        console.log(123456789)
        if($(".timer")[0] && $(".timer").data("timer_flag") == 1){
            console.log("时间到")
        }
    })
    function backseat() {
        console.log("时间到了")
    }

    (function(window,$,Core){
//reset logout url
        Core.navConfig.logoutUrl = "/logout.html";
        $.extend(Core, {
            /*倒计时结束后，请求后台，根据是否支付成功状态做不同处理
	  倒计时结束后，如用户已经支付成功，倒计时显示为00：00
	  如用户还未支付，或支付失败，刚提示订单超时
	*/
            timerOverPost: function(){
                var displayGorderId=$("#displayGorderId").val().trim();
                Core.post("/order/check_pay_result.html",{order_id:displayGorderId},function(err,rs){
                    if(!err && rs){
                        var core = Core;
                        rs = core.parseJSON(rs);
                        switch(+rs.retcode){
                            case 200:
                                if(rs.isPayed){//支付成功,倒计时显示为00:00
                                    return;
                                }else{
                                    //支付失败，显示超时
                                    $("#last").hide();
                                    $("#invalid").show();
                                }
                                break;
                            default:
                                //失败，显示超时
                                $("#last").hide();
                                $("#invalid").show();
                        }
                    }
                });
            },
            timerStar: function(cTime){
                //利用时差倒计时：在倒计时开始的时候，保存一个剩余时间的变量，再保存一个当时的本地时间，然后每隔100毫秒，重复上述逻辑
                //利用本地时间计算时间差，然后从剩余时间中减去这个时间差就行

                //由于前台需要在14分钟的时间内，完成15分钟(900次)的倒计时，unit取14000/15
                var unit = 14000 / 15;
                var lastTime = cTime*unit;//从后台取到倒计时时间，并转化为毫秒，注意*unit，而不是1000
                var startTime = new Date();//获取起始时间
                var cache = {};
                var tMin=$("#min"),
                    tSec=$("#sec");
                var timer_flag=0;//标记倒计时结束不可提交表单,0可提交，1不可提交

                var autoTimer=window.setInterval(
                    function(){
                        var now = new Date();
                        var cost = now - startTime;
                        var t = lastTime - cost;
                        //检查缓存
                        var m = parseInt(t/60/unit);
                        var s = parseInt((t/unit)%60);

                        if( m != cache.m)
                        {
                            cache.m = m;
                            //update dom
                            tMin.html(cache.m<10?("0"+cache.m):cache.m);
                        }
                        if(s != cache.s ){
                            cache.s = s;
                            //update dom
                            tSec.html(cache.s<10?("0"+cache.s):cache.s);
                        }
                        if(m==0 && s==0){//倒计时结束
                            clearInterval(autoTimer);
                            timer_flag=1;
                            /*倒计时结束后，如用户已经支付成功，倒计时显示为00：00
                              如用户还未支付，或支付失败，刚提示订单超时
                            */
                            if($(".timer").data("pay_flag") && $(".timer").data("pay_flag") == 1){//用户已经去支付了，倒计时结束，不再弹层提示，只根据是否支付成功对倒计时区域文案调整
                                Core.timerOverPost();
                            }else{
                                console.log("时间到1")

                                $.ajax({
                                    url:"sc/backseat",
                                    data:'s_id=${schedule.s_id}&o_no=${check.o_no}&s_seatuse=${check.s_seatuse}&thisuse=${check.thisuse}',
                                    dataType: 'text',
                                    success:function (data) {
                                        //支付失败，显示超时
                                        $("#last").hide();
                                        $("#invalid").show();
                                        //用户没有点击支付，页面不会出现"付款"弹框，则可以弹层提示订单超时
                                        Core.showDialogCom(0,'<div class="mDialog selDialog"><h2><b></b>对不起了，订单已超时!</h2><br /><a href="check.jsp" class="btn_orange" style="margin-left:150px">重新选座</a></div>');
                                        $(".iDialogClose").remove();
                                    },
                                    error:function () {
                                    }
                                });

                            }
                        }
                        $(".timer").data("timer_flag",timer_flag);
                    }, 100);
            },
        });
    })(window,jQuery,Core);

    function gotoPay() {
        layer.open({
            type: 2, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
            shade:0.1, //遮罩层透明度
            area:['400px','500px'], //弹出层宽高
            title:'付款',//弹出层标题
            content: 'pay.jsp' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        });
    }
</script>

</body>
</html>