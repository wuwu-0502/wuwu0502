/*
 * 选座页面js
 * edit by xuying at 2012-11-15
 */
(function (window, $, Core) {
//reset logout url
    Core.navConfig.logoutUrl = "/logout.html";
    $.extend(Core, {
        //入口函数
        myInit: function () {
            var core = Core;
            //根据hash判断后退，刷新
            if (!!location.hash && $.trim(location.hash) !== "#") {
                location.hash = "";
                window.location.reload();
            }
            //邮箱应用入口标识
            if (core.isInFrame) {
                core.mailApp = "/mailapp";
                //if(core.cdnBaseUrl.indexOf("imgimg.126.net") > 0){//测试环境订单入口，积分入口需要加81端口
                //core.mailAppOrder=":81/mailapp";
                //}else{//在线确认，在线环境不加端口
                core.mailAppOrder = "/mailapp";
                //}
            } else {//主站
                core.mailApp = "";
                core.mailAppOrder = "";
            }

            //如已登录发送请求加载座位图
            //if(core.seatLogin){
            core.loadingOK = false;
            core.TimeoutFlag = false;
            core.loadSeat();
            //}
            //选座
            $('body').delegate('#seat_area', 'click', function (e) {
                var target = e.target || e.srcElement;
                //座位可点，无需登录
                if ($(target).hasClass('ableSeat') || $(target).hasClass('selSeat')) {
                    core.selectSeat.call(target)
                }
            });
            //场次加载失败---再试一次
            $('body').delegate('#tryAgain', 'click', function () {
                core.loadingOK = false;
                core.TimeoutFlag = false;
                core.loadSeat();
            });
            //使用优惠券用户重新选择
            $('body').delegate('#reSelSch2', 'click', function () {
                if ($("#groupBuyId")[0]) {//如果用户使用通兑券，出现错误，点击"重新选择"，弹出更改场次弹框
                    var groupBuyId = $("#groupBuyId").val(), city = Core.city;
                    //通兑券弹窗
                    $.dialog({
                        type: "shell",
                        title: "",
                        content: '<div class="iDialogContent"><a id="fastBuyClose" href="javascript:;" class="fastBuyClose"></a><iframe scrolling="no" frameborder="0" style="width:100%;height:500px;overflow:hidden;" src="/' + city + '/group/schedule.html?groupBuyId=' + groupBuyId + '"></iframe></div>',
                        width: 960,
                        button: []
                    });
                    $(".iDialogLayout").removeClass("iOpacityZero");
                    $(document).delegate('#fastBuyClose', 'click', function () {
                        $.dialog();
                    });
                }
            });
            //正常用户重新选择
            $('body').delegate('#reSelSch1', 'click', function () {
                var city = core.city, movieId = core.movieId;
                window.location.href = 'http://piao.163.com' + Core.mailApp + '/movie/detail.html?movieId=' + movieId + '&city=' + city;
            });
            //链接到选座页面统一定位到选座区域
            var hashPq = $.getUrlPara("seatArea");
            if (hashPq && $("#seatArea")[0]) { //定位到排期
                $(document).scrollTop($("#seatArea").offset().top);
            }
            $("#seatSub").click(this.submitForm);
            //$(".ableSeat","#seat_area").click(this.selectSeat);

            //更改场次
            if ($("#sBar")[0]) {
                $("#sBar").click($.proxy(this.moreScreen, this));
                //更改场次表格鼠标滑过
                this.overTable();
                $("body").click(function (e) {
                    var obj = $(e.target), div = obj.closest("div");
                    if (obj[0].id == "sBar" || div[0] && div[0].id == "sList") return;
                    var changeScreen = $("#changeScreen");
                    if (changeScreen.hasClass("active")) {
                        changeScreen.removeClass("active");
                    }
                });
            }
            //初始化手机号
            this.initPhone();
        },
        //加载座位图
        loadSeat: function () {
            var core = Core, loadingSeat = $("#loading_seat"), ticketId = $("#ticketId").val();
            loadingSeat.css({
                "height": "400px",
                "padding-top": "110px"
            }).html('<img src="' + Core.cdnBaseUrl + '/images/detail/loading.gif" width="60" height="60" alt="正在加载..."><p class="mt10">我在努力加载中，麻烦稍等一下下~</p>');
            //设置定时器，检查请求时间，如果超过30秒没有响应，提示用户“系统繁忙，重新加载”，注意此时已发送的请求并没有取消，但要控制返回结果不可再显示到页面
            //core.TimeoutFlag=true;标记已经超时
            //core.loadingOK=true;标记请求已经成功返回，不再记录时间
            core.time = 0;
            var loadTimer = setInterval(function () {
                core.time++;
                if (core.loadingOK == true) {//请求已返回不再倒计时
                    clearInterval(loadTimer);
                }
                if (core.time > 30) {
                    core.TimeoutFlag = true;//标记倒计时结束，页面显示倒计时后结果，即使请求再回来也不可再修改页面
                    loadingSeat.css({
                        "height": "auto",
                        "padding": "0px"
                    }).html('<div class="loading_seat">很抱歉影院系统繁忙，请<a href="javascript:;" id="tryAgain">重新加载</a>座位图</div>');
                    clearInterval(loadTimer);
                }
            }, 1000)

            //core.post("http://127.0.0.1/order/seat_info.ftl",{ticket_id:ticketId},function(err, rs){
            core.post("/order/seat_info.html", {ticket_id: ticketId}, function (err, rs) {
                if (!err && rs) {//请求成功
                    if (!core.TimeoutFlag) {//倒计时没结束前，请求结果有效
                        core.loadingOK = true;//设置请求成功标记，如请求已有返回结束，不再倒计时

                        loadingSeat.html(rs).css({"height": "auto", "padding": "0px"});
                        var errorCodeVal = loadingSeat.find("#errorCode").val();
                        var usCode = false;
                        if ((Core.isUsingRC && Core.isUsingRC == 1) || (Core.isUsingCode && Core.isUsingCode == 1)) {//使用优惠券用户
                            usCode = true;
                        } else {//正常用户
                            usCode = false;
                        }
                        switch (errorCodeVal) {
                            case "200": //座位加载成功
                                if (core.maxCols) {
                                    //修改座位区滚动条样式
                                    core.seatScroll();
                                }
                                break;
                            case "201": //
                                if (usCode) {//使用优惠券用户
                                    loadingSeat.html(rs + '<div class="loading_seat">很抱歉当前场次未开放售票，请您<a href="javascript:;" id="reSelSch2">重新选择</a>其他场次。</div>')
                                } else {//正常用户
                                    loadingSeat.html(rs + '<div class="loading_seat">抱歉当前场次未开放售票，请您<a href="javascript:;" id="reSelSch1">重新选择</a>其他场次。（请注意所选影院）</div>');
                                }
                                break;
                            case "205": //影院选择
                                if (usCode) {//使用优惠券用户
                                    loadingSeat.html(rs + '<div class="loading_seat">很抱歉当前场次已停止在线选座购票，请您<a href="javascript:;" id="reSelSch2">重新选择</a>其他场次。</div>');
                                } else {//正常用户
                                    loadingSeat.html(rs + '<div class="loading_seat">很抱歉当前场次已停止在线选座购票，请您<a href="javascript:;" id="reSelSch1">重新选择</a>其他场次。（请注意所选影院）</div>');
                                }
                                break;
                            default://其他错误
                                if (usCode) {//使用优惠券用户
                                    loadingSeat.html(rs + '<div class="loading_seat">很抱歉影院系统问题，本场次暂时不能选座，请您<a href="javascript:;" id="reSelSch2">重新选择</a>其他场次。</div>');
                                } else {//正常用户
                                    loadingSeat.html(rs + '<div class="loading_seat">很抱歉影院系统问题，本场次暂时不能选座，请您<a href="javascript:;" id="reSelSch1">重新选择</a>其他场次。（请注意所选影院）</div>');
                                }
                                break;
                        }

                    }
                }
            }, "@try")
        },
        //修改座位区滚动条样式
        seatScroll: function () {
            var maxColsWidth, x, jspPaneLeft, jspDragLeft, maxCols = Core.maxCols;
            $('#seat_area').jScrollPane();
            $('#seat_area').removeAttr("tabindex");
            //出现滚动条时居中显示座位
            if (maxCols > 21) {
                x = 31
                maxColsWidth = maxCols * x;
                jspPaneLeft = (maxColsWidth - 680) / 2 * (-1) - 20;
                jspDragLeft = +($(".jspDrag").css("width").replace(/[a-z]/g, ""));
                jspDragLeft = (680 - jspDragLeft) / 2;
                //alert(jspDragLeft);
                $("#seat_area .jspPane").css("left", jspPaneLeft + "px");
                $("#seat_area .jspDrag").css("left", jspDragLeft + "px");
            }
        },
        //初始化手机号
        initPhone: function () {
            function getPositionForInput(ctrl) {
                var CaretPos = 0;
                if (ctrl.selectionStart || ctrl.selectionStart == '0') {// Firefox support
                    CaretPos = ctrl.selectionStart;
                } else if (document.selection) { // IE Support
                    ctrl.focus();
                    var Sel = document.selection.createRange();
                    Sel.moveStart('character', -ctrl.value.length);
                    CaretPos = Sel.text.length;
                }
                return (CaretPos);
            }

            function setCursorPosition(ctrl, pos) {
                if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                } else if (ctrl.setSelectionRange) {
                    ctrl.setSelectionRange(pos, pos);
                    ctrl.focus();
                }
            }

            var input = $("#mobileText");
            if (input.val().length >= 11) {
                var v = input.val().replace(/[^\d]/g, "").trim();
                input.val(v.substr(0, 3) + "-" + v.substr(3, 4) + "-" + v.substring(7));

            }
            input.keydown(function (e) {
                if (e.keyCode == 109 || e.keyCode == 173) {
                    return false;
                }
            }).keyup(function (e) {
                var c = getPositionForInput(this);
                if (input.val().length >= 13) {
                    input.val(input.val().substr(0, 13));
                    var v = input.val().replace(/[^\d]/g, "").trim();
                    input.val(v.substr(0, 3) + "-" + v.substr(3, 4) + "-" + v.substring(7));
                }
                var v = input.val().replace(/[^\d]/g, "").trim();
                var v1 = "", v2 = "", v3 = "", tel = "";
                v = v.substring(0);
                v1 = v;
                if (v.length > 3) {
                    v1 = v.substr(0, 3);
                    v2 = v.substring(3);
                    if (v2.length > 4) {
                        v2 = v.substr(3, 4);
                        v3 = v.substring(7);
                    }
                }
                if (v1 != "") {
                    input.val(v1);
                }
                if (v2 != "") {
                    input.val(v1 + "-" + v2);
                }
                if (v3 != "") {
                    input.val(v1 + "-" + v2 + "-" + v3);
                }
                if (input.val().substr(c - 1, 1) == "-" && e.keyCode != 46 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
                    c = c + 1;
                }
                //设置光标位置
                setCursorPosition(this, c)

                var m = input.val().replace(/[^\d-]/g, "").trim();
                if (m != this.value)
                    this.value = m;
                /*var inp=input.val().replace(/[^\d]/g, "").trim(),len=inp.length,arr=[];
                 var c = getPositionForInput(this);
                 arr[0]=inp.substr(0);
                 if(len>=3&&len<7){
                 arr[0]=inp.substr(0,3)+'-';
                 arr[1]=inp.substr(3);
                 }else if(len>=7){
                 arr[0]=inp.substr(0,3)+'-';
                 arr[1]=inp.substr(3,4)+'-';
                 arr[2]=inp.substr(7);
                 }*/
            }).focus(function () {
                var v = input.val().trim();
                if (!!v && v == '请输入手机号码') {
                    input.val('');
                    return;
                }
            }).blur(function () {
                var v = input.val().replace(/[^\d]/g, "").trim();
                if (!v) {
                    input.val('请输入手机号码');
                    return;
                }
                if (v && !Core.isValidMobile(v)) {
                    //这里的错误提示，请跟换为统一风格。);
                    $.dialog({
                        title: "网易电影",
                        width: 496,
                        button: ["*确定"],
                        content: '<div class="mDialog selDialog"><h2><b></b>' + '手机号码格式不对呀~' + '</h2></div>'
                    }, function () {
                        input.addClass("phoneErr");
                        //input.flash(function(){ input[0].select() });
                    });
                }
            }).bind("paste", function () {
                window.setTimeout(function () {
                    var v = input.val().replace(/[^\d]/g, "").trim();
                    if (v.length <= 3) {
                        input.val(v.substr(0, 3));
                        c = v.length;
                    } else if (v.length <= 7) {
                        input.val(v.substr(0, 3) + "-" + v.substr(3, 4));
                        c = v.length + 1;
                    } else {
                        input.val(v.substr(0, 3) + "-" + v.substr(3, 4) + "-" + v.substring(7));
                        c = v.length + 2;
                    }
                }, 100);
            });

        },
        //更改场次
        //changeScreen:function(){
        /*$("#sBar").hover(
         function(){
         $(this).parent().addClass("active");
         },
         function(){
         $(this).parent().removeClass("active");
         }
         )	*/

        //},
        //更改场次表格鼠标滑过
        overTable: function () {
            $("body").delegate(".movieTbodyAct tr", "mouseenter", function () {
                $(this).addClass("active");
            }).delegate(".movieTbodyAct tr", "mouseleave", function () {
                $(this).removeClass("active");
            }).delegate(".movieTbodyAct tr", "click", function () {
                window.location.href = Core.mailApp + "/order/seat.html?ticket_id=" + $(this).attr("ticketId") + "&seatArea=1";
            })
        },

        moreScreenList: '<tr class="trList" ticketId={id}><td class="time {at}" width="17%">{showTime}</td><td width="17%">{dimensional}</td><td width="17%">{language}</td><td width="17%">{hallName}</td><td width="16%">¥<em class="old">{listPrice}</em></td><td width="16%"><em class="fav"><i>¥</i>{price}</em></td></tr>',
        moreScreen: function () {
            var changeScreen = $("#changeScreen");
            if (!$("#moreScreen").children().length) {
                //从后台获取场次信息
                this.getScreenHtml();
            } else {
                if (changeScreen.hasClass("active")) {
                    changeScreen.removeClass("active");
                } else {
                    changeScreen.addClass("active");
                }
            }
        },
        getScreenHtml: function () {
            var moreScreen = $("#moreScreen"), changeScreen = $("#changeScreen"), change_wrap = $("#change_wrap");
            data = {
                movieId: this.movieId,
                cinemaId: this.cinemaId,
                date: this.date
            }, core = this;
            this.post("/order/adjust_schedule_list.html", data, function (err, rs) {
                //var err = 0, rs="{'retcode':200,'ticketList':[{'id':10,'showTime':'2013-11-01 03:10','dimensional':'3D','language':'中文','hallName':'3号厅','listPrice':'100','price':'50'},{'id':10,'showTime':'2013-11-01 03:10','dimensional':'3D','language':'中文','hallName':'3号厅','listPrice':'100','price':'50'},{'id':10,'showTime':'2013-11-01 03:10','dimensional':'3D','language':'中文','hallName':'3号厅','listPrice':'100','price':'50'}]}";
                //var err = 0, rs='{"retcode":200,"ticketList":[{"id":10,"showTime":"2013-11-01 03:10","dimensional":"3D","language":"中文","hallName":"3号厅","listPrice":"100","price":"50"}]}';
                //var err = 0, rs='{"ticketList":[],"retcode":200,"retdesc":""}';
                if (!err && rs) {
                    var html = [], currentId = $("#sBar").attr("tid");
                    rs = this.parseJSON(rs);
                    if (rs.retcode == 200) {
                        if (!!rs.ticketList && rs.ticketList.length > 0) {
                            changeScreen.addClass("active");
                            var list = rs.ticketList, len = list.length, status_len = 0;

                            for (var i = 0; i < len; i++) {
                                var o = list[i], data;
                                if (o.status == 1) {
                                    data = {
                                        id: o.id,
                                        at: o.id == currentId ? "current" : "",
                                        showTime: !o.showTime ? "" : this.formatTime(o.showTime),
                                        dimensional: !o.dimensional ? "" : o.dimensional,
                                        language: !o.language ? "" : o.language,
                                        hallName: !o.hallName ? "" : o.hallName,
                                        listPrice: !o.listPrice ? "" : o.listPrice,
                                        price: !o.price ? "" : o.price
                                    };
                                    html.push($.format(core.moreScreenList, data));
                                    //记录有效场次数
                                    status_len++;
                                }
                            }
                            if (status_len > 8) {
                                $(change_wrap).addClass("change_overflow");
                            }
                            moreScreen.append(html.join(""));
                        } else {
                            //ticketList返回空，无可更改场次
                            $.dialog({
                                title: "网易电影",
                                width: 496,
                                button: ["*确定"],
                                content: '<div class="mDialog selDialog"><h2><b></b>' + '今天所有场次已放映结束！' + '</h2></div>'
                            })
                        }
                    } else if (rs.retcode == 201 || rs.retcode == 500) {
                        $.dialog({
                            title: "网易电影",
                            width: 496,
                            button: ["*确定"],
                            content: '<div class="mDialog selDialog"><h2><b></b>' + '网络不给力啊，换个场次看看怎么样？~' + '</h2></div>'
                        })
                    }
                }
            });
        },
        //格式化后台传来的日期字段
        formatTime: function (ts) {
            if (ts) {
                function func(n) {
                    return n < 10 ? "0" + n : n;
                }

                var m = new Date(ts);
                return func(m.getHours()) + ":" + func(m.getMinutes());
            }
        },
        showDialog: function (content) {
            var ops = {
                title: "网易电影",
                width: 496,
                button: ["*关闭"],
                //content: "<p style='padding:10px 20px;'>" + content + "</p>"
                content: '<div class="mDialog selDialog"><h2><b></b>' + content + '</h2></div>'
            };
            return $.dialog(ops);
        },
        intervalCollection: {},
        //选座飞动效果
        seatFlay: function (obj, name) {
            var core = Core, selSeatList = $("#selSeatList"), selSeatList_len = $("#selSeatList li").length,
                seatShow = $('<div class="seatShow" sname="' + name + '">' + obj.attr("title") + '</div>').appendTo($('body'));
            seatShow.attr("id", "seatShow" + name);

            var leftEnd = selSeatList.offset().left + 15;
            var topEnd = selSeatList.offset().top;

            if (selSeatList_len > 0) {
                var last_seat = $("#selSeatList li").last();
                if (selSeatList_len % 3 == 1) {
                    leftEnd = last_seat.offset().left + 78;
                    topEnd = last_seat.offset().top;
                } else if (selSeatList_len % 3 == 2) {
                    leftEnd = last_seat.offset().left + 78;
                    topEnd = last_seat.offset().top;
                } else if (selSeatList_len % 3 == 0) {
                    leftEnd = selSeatList.offset().left + 15;
                    topEnd = last_seat.offset().top + 36;
                }
            }

            var sname = seatShow.attr("sname"),
                topStart = obj.offset().top - 30,
                leftStart = obj.offset().left - 20,
                timespan = 20, totalTime = 500, t = 0,
                topStep = (topEnd - topStart) / totalTime * timespan,
                leftStep = (leftEnd - leftStart) / totalTime * timespan,
                intervalCollection = core.intervalCollection;


            seatShow.css({"top": topStart + "px", "left": leftStart + "px"});
            intervalCollection[sname] = setInterval(function () {
                var left = parseFloat(seatShow.css('left')), top = parseFloat(seatShow.css('top'));
                t += timespan;
                seatShow.css({'left': (left + leftStep) + 'px', 'top': (top + topStep) + 'px'});
                left = parseFloat(seatShow.css('left'))
                if (t >= totalTime) {
                    clearInterval(intervalCollection[seatShow.attr('sname')]);
                    core.intervalCollection = {};
                    seatShow.remove();
                    if ($("#sel_" + sname.split(":")[1]).length < 1) {
                        selSeatList.append("<li id='sel_" + sname.split(":")[1] + "'><span class='txt'>" + seatShow.text() + "</span></li>");
                    }
                    selSeatList.next().addClass('none');
                }
            }, timespan)
        },
        seatArr: [], //选择的座位
        firstSeatTop: "",//保存选中第一个座位的排数
        rsvNum: 0, //是否选择了专属座位
        selectSeat: function () {
            /*for(var i in Core.intervalCollection){
             if(!!i){
             return;
             }
             }*/
            var name = this.getAttribute("name") || "", sobj = $(this), core = Core, seats = core.seatArr,
                maxSeatNum = Core.maxSeatNum, currentSeatTop = "", p = $("#price").text();
            if (sobj.hasClass("ableSeat")) {
                //如果是专属座位，则设置标记 Core.hasReserve 为true
                if (sobj.attr("rsvAttr") == "1") {
                    if (core.rsvNum != seats.length) {
                        return core.rsvDialogPop();
                    }
                    core.rsvNum += 1;
                } else {
                    if (core.rsvNum) {
                        return core.rsvDialogPop();
                    }
                }
                //合作方是嗨电影时，判断选择的是否是同一排座椅
                if (core.sameRow && core.sameRow == 1) {
                    if (seats.length == 0) {//选中第一个座位时，记录其排数（top值，不取name，避免name值传错）
                        core.firstSeatTop = sobj.css("top");
                    }
                    ;
                    if (seats.length > 0) {//已选过座位
                        currentSeatTop = sobj.css("top");
                        if (core.firstSeatTop != currentSeatTop) {//与第一个座位比较是否是同一排
                            core.showDialog("请选择同一排座椅！");
                            return;
                        }
                    }
                }
                if (+sobj.attr("loveIndex")) {
                    selSeats = seats.length + 1;
                } else {
                    selSeats = seats.length;
                }
                if (selSeats >= maxSeatNum) {
                    if (sobj.attr("rsvAttr") == "1") {
                        core.rsvNum -= 1;
                    }
                    if (core.useRebate && Core.useRebate == 1) {
                        core.showDialog("选择的座位数不能比兑票码的数多~你再数数？");
                    } else {
                        core.showDialog("一个订单最多只能选" + maxSeatNum + "个座位哦~！");
                    }
                    return;
                }
                if (sobj.hasClass("ShakeSeat")) {//如果是振动座椅
                    this.className = "selSeat ShakeSeat ShakeSeat_sel";
                } else {
                    this.className = "selSeat";
                }
                seats.push(name);//最大选座数根据seats.length判断，先把座位保存，以免动画未执行完选了下一个超出范围的座位
                //选中的座位飞动效果
                core.seatFlay(sobj, sobj.attr("name"));
                if (+sobj.attr("loveIndex")) {//如果是情侣座
                    var loveInd = sobj.attr("loveIndex"), flow = sobj.attr("flow").trim();
                    //用户点击情侣座第一个座位并且方向是从左向右排时，或点击情侣座第二个座位方向是从右向左排时，自动选择右面的座位
                    if ((loveInd == 1 && flow == "LR") || (loveInd == 2 && flow == "RL")) {
                        var nextSeat = sobj.next(), nextName = nextSeat.attr("name") || "";
                        nextSeat.removeClass().addClass("selSeat");
                        seats.push(nextName);
                        //专属座位计数修改
                        if (nextSeat.attr("rsvAttr") == "1") {
                            core.rsvNum += 1;
                        }
                        //选中的座位飞动效果
                        core.seatFlay(nextSeat, nextName);
                    }
                    //用户点击情侣座第一个座位并且方向是从右向左排时，或点击情侣座第二个座位方向是从左向右排时，自动选择左面的座位
                    if ((loveInd == 1 && flow == "RL") || (loveInd == 2 && flow == "LR")) {
                        var preSeat = sobj.prev(), preName = preSeat.attr("name") || "";
                        preSeat.removeClass().addClass("selSeat");
                        seats.push(preName);
                        //专属座位计数修改
                        if (preSeat.attr("rsvAttr") == "1") {
                            core.rsvNum += 1;
                        }
                        //选中的座位飞动效果
                        core.seatFlay(preSeat, preName);
                    }
                }
                $("#totalPrice").text(Number(p * seats.length).Round(2));
            } else if (sobj.hasClass("selSeat")) {//删除已选座位
                //座位飞动过程中，取消选座
                clearInterval(Core.intervalCollection[sobj.attr("name")]);
                //专属座位计数修改
                if (sobj.attr("rsvAttr") == "1") {
                    core.rsvNum -= 1;
                }
                if ($(".seatShow").length > 0) {
                    $(".seatShow").remove();
                }

                if (+sobj.attr("loveIndex")) {//如果是情侣座
                    var loveInd = sobj.attr("loveIndex"), flow = sobj.attr("flow").trim();
                    //用户点击情侣座第一个座位并且方向是从左向右排时，或点击情侣座第二个座位方向是从右向左排时，自动删除右面的座位
                    if ((loveInd == 1 && flow == "LR") || (loveInd == 2 && flow == "RL")) {
                        var nextSeat = sobj.next(), nextName = nextSeat.attr("name") || "";

                        //座位飞动过程中，取消选座
                        clearInterval(Core.intervalCollection[nextSeat.attr("name")]);

                        sobj.removeClass().addClass("ableSeat qlSeat");
                        nextSeat.removeClass().addClass("ableSeat qlSeat");
                        //专属座位计数修改
                        if (nextSeat.attr("rsvAttr") == "1") {
                            core.rsvNum -= 1;
                        }

                        var id = "sel_" + name.split(":")[1], idNext = "sel_" + nextName.split(":")[1];
                        $('#selSeatList').find('li[id="' + id + '"]').remove();
                        $('#selSeatList').find('li[id="' + idNext + '"]').remove();
                        for (var i = 0; i < seats.length; i++) {
                            if (seats[i] == name) {
                                seats.splice(i, 1);
                                break;
                            }
                        }
                        for (var i = 0; i < seats.length; i++) {
                            if (seats[i] == nextName) {
                                seats.splice(i, 1);
                                break;
                            }
                        }

                    }
                    //用户点击情侣座第一个座位并且方向是从右向左排时，或点击情侣座第二个座位方向是从左向右排时，自动删除的左面的座位
                    if ((loveInd == 1 && flow == "RL") || (loveInd == 2 && flow == "LR")) {
                        var prevSeat = sobj.prev(), prevName = prevSeat.attr("name") || "",
                            id = "sel_" + name.split(":")[1], idPrev = "sel_" + prevName.split(":")[1];

                        //座位飞动过程中，取消选座
                        clearInterval(Core.intervalCollection[prevSeat.attr("name")]);

                        sobj.removeClass().addClass("ableSeat qlSeat");
                        prevSeat.removeClass().addClass("ableSeat qlSeat");
                        //专属座位计数修改
                        if (prevSeat.attr("rsvAttr") == "1") {
                            core.rsvNum -= 1;
                        }

                        $('#selSeatList').find('li[id="' + id + '"]').remove();
                        $('#selSeatList').find('li[id="' + idPrev + '"]').remove();

                        for (var i = 0; i < seats.length; i++) {
                            if (seats[i] == name) {
                                seats.splice(i, 1);
                                break;
                            }
                        }
                        for (var i = 0; i < seats.length; i++) {
                            if (seats[i] == prevName) {
                                seats.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    if (sobj.hasClass("ShakeSeat")) {//如果是振动座椅
                        this.className = "ableSeat ShakeSeat";
                    } else {
                        this.className = "ableSeat";
                    }
                    var id = "sel_" + name.split(":")[1];
                    $('#selSeatList').find('li[id="' + id + '"]').remove();
                    for (var i = 0; i < seats.length; i++) {
                        if (seats[i] == name) {
                            seats.splice(i, 1);
                            break;
                        }
                    }
                }
                if ($('#selSeatList').find('li').length <= 0) {
                    $('#selSeatList').next().removeClass('none');
                }
                $("#totalPrice").text(Number(p * seats.length).Round(2));
            }
        },
        //速度与激情活动，已经领用过优惠的手机号码不可重复使用
        checkMobile: function (mobileVal) {
            var flag = false, seatSub = $("#seatSub"), core = this;
            //请求返回前不可重复发送请求
            seatSub.attr("disabled", "disabled");
            var data = {
                mobile: mobileVal,
                groupBuyId: $("#groupBuyId").val()
            }
            $.ajax({
                url: '/order/check_mobile.html',
                async: false,
                type: 'POST',
                data: data,
                success: function (rs) {
                    //rs = core.parseJSON(rs);//后台传来json格式
                    switch (+rs.retcode) {
                        case 200: //可以下单
                            flag = true;
                            break;
                        case 440://用户已经领取过一次
                            flag = false;
                            $.dialog({
                                title: "网易电影",
                                width: 500,
                                button: ["*换个号码"],
                                content: '<div class="mDialog selDialog"><h2><b></b>这个手机号码已经领用过这个优惠了，换一个吧！</h2></div>'
                            });
                            break;
                        default://系统异常
                            flag = false;
                            $.dialog({
                                title: "网易电影",
                                width: 500,
                                button: ["*关闭"],
                                content: '<div class="mDialog selDialog"><h2><b></b>网络不给力啊，再试一下？</h2></div>'
                            });
                            break;
                    }
                },
                error: function () {
                    flag = false;
                    $.dialog({
                        title: "枫林晚电影",
                        width: 500,
                        button: ["*关闭"],
                        content: '<div class="mDialog selDialog"><h2><b></b>网络不给力啊，再试一下？</h2></div>'
                    });
                }
            });
            seatSub.attr("disabled", "");
            return flag;
        },
        //提交表单
        submitForm: function () {
            var core = Core, str = [], nstr = [], len = core.seatArr.length,
                mobileVal = $("#mobileText").val().replace(/[^\d]/g, "").trim();
            var isRsvSeat = core.rsvNum && core.rsvNum == len;
            //判断登录
            if (!core.easyNav.isLogin(true)) {
                //无刷新登录
                core.login(function () {
                    return true;
                });
                return false;
            }
            if (len == 0) {
                core.showDialog("请选择心仪座位~");
                return false;
            }
            //判断选择的座位是不是都是专属座位
            if (core.rsvNum && core.rsvNum != len) {
                return core.rsvDialogPop();
            }
            if (core.minSeatNum) {
                if (len < core.minSeatNum) {
                    $.dialog({
                        title: "枫林晚电影",
                        width: 500,
                        button: ["*继续选座"],
                        content: '<div class="mDialog selDialog"><h2><b></b>至少要选择两个座位，才可以享受买一赠一机会喔！~</h2></div>'
                    });
                    return false;
                }
            }
            if (!mobileVal) {
                //统计点击
                try {
                    neteaseTracker(true, "http://piao.163.com/tel.html", "手机号留给我", null);
                } catch (e) {
                }
                core.showDialog("把手机号留给我嘛，给你发取票短信~");
                return false;
            } else if (!core.isValidMobile(mobileVal)) {
                core.showDialog("手机号码格式不对呀~");
                return false;
            } else if (core.isUsedTel) {
                //速度与激情活动，验证手机号是否已领过优惠
                if (!core.checkMobile(mobileVal)) {
                    return false;
                }
            }

            $("#mobile").val(mobileVal);

            if (!isRsvSeat && !core.isValidSeat())
                return false;

            var seatsValue;
            if (core.seatArr.length <= Core.maxSeatNum) {
                for (var i = 0; i < len; i++) {
                    //str[i] = core.seatArr[i].split(":")[1];
                    //后台传来rowId,columnId本身就带有下划线，所以前台不能替换，把后台传来的id不作任何修改,通过冒号拼接提交
                    str[i] = $("[name='" + core.seatArr[i] + "']").attr("rowId") + ":" + $("[name='" + core.seatArr[i] + "']").attr("columnId");
                    nstr[i] = core.seatArr[i];
                }
            }
            //seatsValue = str.join(",").replace(/_/g,":");
            //后台传来rowId,columnId本身就带有下划线，所以前台不能替换，把后台传来的id不作任何修改,通过冒号拼接提交
            seatsValue = str.join(",");
            //seatsName=nstr.join(",");
            //pc里，后退不记上次选过的座位,因为座位已锁定
            seatsName = nstr[0];
            //如果都是专属座位，则先像后台请求是否合法
            if (isRsvSeat) {
                core.post("/order/check_seatInfo.html", {
                    seatInfo: seatsValue,
                    ticketId: $("#ticketId").val().trim()
                }, function (err, rs) {
                    rs = err ? '{"retcode":-99,"retdesc":"啊哦，网络出错了额，请稍后重试"}' : rs;
                    rs = core.parseJSON(rs);
                    if (rs.retcode == 200) { //成功
                        $("#isReserve").val(1);
                        $("#seatSub").attr({"disabled": "disabled", "class": "btn_buy btn_buy_gray"});
                        $("#lockedSeatList").val(seatsValue);
                        //pc里，后退不记上次选过的座位，因为座位已锁定，增加hash，仅用于保持后退时的登录状态
                        location.replace(location.href.substring(0, location.href.indexOf("#") > 0 ? location.href.indexOf("#") : 9999));
                        location.hash = seatsName;
                        $("#seatForm").submit();
                    } else {
                        core.showDialog(rs.retdesc);
                    }
                });
                return false;
            } else {
                $("#seatSub").attr({"disabled": "disabled", "class": "btn_buy btn_buy_gray"});
                $("#lockedSeatList").val(seatsValue);
                $("#isReserve").val("");
                //pc里，后退不记上次选过的座位,因为座位已锁定，增加hash，仅用于保持后退时的登录状态
                location.replace(location.href.substring(0, location.href.indexOf("#") > 0 ? location.href.indexOf("#") : 9999));
                location.hash = seatsName;
                $("#seatForm").submit();
            }
        },
        isValidMobile: function (str) {
            //return /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(str);
            return /^1\d{10}$/.test($.trim(str));
        },
        isValidSeat: function (obj) {
            var core = Core, seats = obj || core.seatArr, len = seats.length, selSeats = [], seatsValue = "", desc = "",
                returnValue = 1;

            if (!len) return false;

            for (var i = 0; i < len; i++) {
                selSeats[i] = $("[name='" + seats[i] + "']").attr("rowId") + ":" + $("[name='" + seats[i] + "']").attr("columnId");
            }
            seatsValue = encodeURIComponent(selSeats.join(","));
            $.ajax({
                type: 'POST',
                url: '/order/check_seat_lone.html',
                data: {seatInfo: seatsValue, ticketId: $("#ticketId").val().trim()},
                async: false,
                timeout: 10000,
                dataType: 'json',
                success: function (data) {
                    returnValue = data.retcode == 200 ? 0 : 1;
                    desc = data.retdesc;
                },
                error: function (error) {
                    desc = "啊哦，网络出错了额，请稍后重试";
                }
            });
            if (returnValue > 0) {
                core.showDialog(desc);
                return false;
            }
            return true;
        },
        //专属座位出错弹出层
        rsvDialogPop: function () {
            this.showDialog("枫林晚专属座位和其余的普通座位，你只能选一种哦！");
            return false;
        }
    });
})(window, jQuery, Core);

    function putValue() {
        var selSeatList = document.getElementById("selSeatList").children;
        // var mobile = document.getElementById("mobileText");
        var schId = document.getElementById("schId");
        var lockedSeatList = document.getElementById("sflwSeat");
        var seatList = "";
        //alert("id: "+schId.value);
       // alert("选择的位子数量："+selSeatList.length)
        for(var i =0; i< selSeatList.length;i++){
            var seat = selSeatList[i].firstElementChild.innerHTML;
            var row = seat.split("排")[0];
            var col = seat.split("排")[1].split("座")[0];
            seatList += row+"-"+col;
            seatList += ":";
        }
        //alert("所选的座位："+seatList);
        //将刚刚选择的全部座位放入到lockedSeatList输入框中
        lockedSeatList.value = seatList;
        //alert("选择的座位："+lockedSeatList.value)

        return true;
    }