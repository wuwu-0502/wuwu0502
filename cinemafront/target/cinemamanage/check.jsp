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


</head>

<body>

<%@include file="header.jsp" %>


<div class="demo clearfix">
    <!---左边座位列表----->
    <div id="seat_area">
        <div class="front">屏幕</div>
    </div>
    <!---右边选座信息----->
    <div class="booking_area">
        <p>电影：<span>${detailMovie.m_name}</span></p>
        <p>时间：<span>${schedule.s_data}</span><span>&nbsp;&nbsp;${schedule.s_starttime}</span></p>
        <p>座位：</p>
        <ul id="seats_chose"></ul>
        <p>票数：<span id="tickects_num">0</span></p>
        <p>总价：<b>￥<span id="total_price">0</span></b></p>

        <input type="button" class="btn" value="确定购买" onclick="gotoBuy()">

        <div id="legend"></div>
    </div>
</div>

<div id="sideBar" class="">
    <a id="toTop" href="javascript:;" rel="nofollow" title="回到顶部" hidefocus="true"></a>
</div>
<%@include file="footer.jsp" %>

<script type="text/javascript" src="layer-v3.1.1/layer/layer.js"></script>
<script type="text/javascript" src="layui/layui.all.js"></script>
<script src="js/jquery.js"></script>
<script type="text/javascript" src="js/js2/jquery.seat-charts.min.js"></script>
<script type="text/javascript">
    var price = ${schedule.s_price}; //电影票价
    console.log(price)

    //设置占用数组
    var seatuse='${schedule.s_seatuse}'
    seatuse = seatuse.substring(0, seatuse.length - 1)
    seatuse = seatuse.split(';')
    console.log(seatuse)

    //添加座位占用(累加占用；本次占用)
    var newuse='${schedule.s_seatuse}'
    var thisuse=''

    //座位排次座次
    var userseat=''

    $(document).ready(function () {
        var $cart = $('#seats_chose'), //座位区
            $tickects_num = $('#tickects_num'), //票数
            $total_price = $('#total_price'); //票价总额

        //设置座位数组
        var seat = ''
        var seats = new Array
        var emptyseats = new Array
        var empty = '${schedule.h_empty}'
        empty = empty.substring(0, empty.length - 1)
        emptyseats = empty.split(';')
        var r = ${schedule.h_row}
        var c = ${schedule.h_column}
        if (r > 0 && c > 0) {
            for (var i = 1; i <= r; i++) {
                for (var j = 1; j <= c; j++) {
                    if (emptyseats.indexOf(i + '_' + j) == -1) seat += 'c'
                    else seat += '_'
                }
                seat += ','
            }
        }
        seat = seat.substring(0, seat.length - 1)
        seats = seat.split(',')

        var sc = $('#seat_area').seatCharts({
            map: seats,
            naming: { //设置行列等信息
                top: false, //不显示顶部横坐标（行）
                getLabel: function (character, row, column) { //返回座位信息
                    return column;
                }
            },
            legend: { //定义图例
                node: $('#legend'),
                items: [
                    ['c', 'available', '可选座'],
                    ['c', 'unavailable', '已售出']
                ]
            },
            click: function () {
                if (this.status() == 'available') { //若为可选座状态，添加座位
                    $('<li>' + (this.settings.row + 1) + '排' + this.settings.label + '座</li>')
                        .attr('id', 'cart-item-' + this.settings.id)
                        .data('seatId', this.settings.id)
                        .appendTo($cart);
                    userseat+=(this.settings.row + 1) + '排' + this.settings.label +'座'+';'
                    console.log(userseat)
                    newuse +=this.settings.id+';'
                    thisuse +=this.settings.id+';'
                    $tickects_num.text(sc.find('selected').length + 1); //统计选票数量
                    $total_price.text(getTotalPrice(sc) + price); //计算票价总金额

                    return 'selected';
                } else if (this.status() == 'selected') { //若为选中状态
                    newuse = newuse.replace(this.settings.id + ';', '')
                    thisuse = newuse.replace(this.settings.id + ';', '')
                    userseat = userseat.replace((this.settings.row + 1) + '排' + this.settings.label +'座'+';', '')
                    console.log(userseat)
                    $tickects_num.text(sc.find('selected').length - 1); //更新票数量
                    $total_price.text(getTotalPrice(sc) - price); //更新票价总金额
                    $('#cart-item-' + this.settings.id).remove(); //删除已预订座位

                    return 'available';
                } else if (this.status() == 'unavailable') { //若为已售出状态
                    return 'unavailable';
                } else {
                    return this.style();
                }
            }
        });
        //设置已售出的座位
        sc.get(seatuse).status('unavailable');

    });

    function getTotalPrice(sc) { //计算票价总额
        var total = 0;
        sc.find('selected').each(function () {
            total += price;
        });
        return total;
    }
    function CurentTime()
    {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss = now.getSeconds();           //秒
        var clock = year + "";
        if (month < 10)
            clock += "0";

        clock += month + "";

        if (day < 10)
            clock += "0";

        clock += day + "";

        if (hh < 10)
            clock += "0";

        clock += hh + "";
        if (mm < 10) clock += '0';
        clock += mm + "";

        if (ss < 10) clock += '0';
        clock += ss;
        return (clock);
    }

    function gotoBuy() {
        var odernum=this.CurentTime()+'${user.u_name}'
        console.log(odernum)
        console.log(userseat)
        console.log($("#total_price").text())

        $.ajax({
            url:"user/check",
            data:'h_id=${schedule.h_id}&m_id=${detailMovie.m_id}&u_id=${user.u_id}&s_id=${schedule.s_id}'+'&o_no='+odernum+'&od_seat='+userseat+'&od_price='+$("#total_price").text()+'&s_seatuse='+newuse+'&thisuse='+thisuse,
            dataType: 'text',
            success:function (data) {
                window.location.href='confirm.jsp'
            },
            error:function () {
            }
        });

    }
</script>


</body>

</html>
