<%@ page contentType="text/html;charset=UTF-8" import="java.util.*" language="java" %>
<html class="x-admin-sm">
    
    <head>
        <meta charset="UTF-8">
        <title>阿八影院</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>My JSP 'test.jsp' starting page</title>
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="expires" content="0">
        <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
        <link rel="stylesheet" href="layui/css/layui.css"  media="all">

        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />

        <script type="text/javascript" src="./js/xadmin.js"></script>
        <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://cdn.bootcss.com/jquery.form/4.2.2/jquery.form.js"></script>

        <script type="text/javascript" src="./lib/jquery.validation/1.14.0/jquery.validate.js"></script>
        <script type="text/javascript" src="./lib/jquery.validation/1.14.0/messages_zh.js"></script>
        <script type="text/javascript" src="./lib/jquery.validation/1.14.0/validate-methods.js"></script>
        <!-- 让IE8/9支持媒体查询，从而兼容栅格 -->
        <!--[if lt IE 9]>
            <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
            <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
        <![endif]--></head>
    <style>
        .file {
            position: relative;
            display: inline-block;
            border: 1px solid rgba(154, 154, 154, 1);
            border-radius: 4px;
            width: 60px;
            height: 28px;
            color: #303133;
            line-height: 28px;
            text-align: center;
            text-decoration: none;
            text-indent: 0;
            font-size: 14px;
        }

        .file input {
            position: absolute;
            width: 60px;
            top: 0;
            left: 0;
            bottom: 0;
            opacity: 0;
            cursor: pointer;
        }

        .file:hover {
            background: linear-gradient(to right, #009688 0, #009688 50%);
            background: -webkit-linear-gradient(to right, #009688 0,#009688  50%);
            border-color: #009688;
            color: #fff !important;
            text-decoration: none;
        }
    </style>

    <body>
    <div class="layui-fluid">
        <div class="layui-row">
            <form class="layui-form" method="post" action="" id="addc">
                <div class="layui-form-item layui-form-text">
                    <label for="desc" class="layui-form-label"><span class="x-red">*</span>打分</label>
                    <div class="layui-input-block">
                        <div id="stars"></div>
                        <input  id="score" name="c_score" value="" type="text" style="display: none;"/>
                        <input  id="u_id" name="u_id" value="${user.u_id}" type="text" style="display: none;"/>
                        <input  id="m_id" name="m_id" value="${detailMovie.m_id}" type="text" style="display: none;"/>
                        <input  id="c_date" name="c_date" value=""  type="text"style="display: none;"/>
                    </div>
                </div>

                <div class="layui-form-item layui-form-text">
                    <label for="desc" class="layui-form-label"><span class="x-red">*</span>简介:</label>
                    <div class="layui-input-block">
                        <textarea placeholder="请输入内容" id="desc" name="c_word" class="layui-textarea"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"></label>
                    <input class="layui-btn" lay-submit lay-filter="add" id="add" value="发表"/>
                </div>

            </form>
        </div>
    </div>
    <script src="layui/layui.all.js" charset="utf-8"></script>
    <script>
        layui.use(['rate'], function(){
            var rate = layui.rate;
            rate.render({
                elem: '#stars'
                ,value: 3.5
                ,half: true
                ,text: true
                ,setText: function(value){ //自定义文本的回调
                    var arrs = {
                        '0.5': '极差','1': '极差','1.5': '差','2': '差','2.5': '差'
                        ,'3': '中等','3.5': '中等'
                        ,'4': '好' ,'4.5': '好'
                        ,'5': '极好'
                    };
                    this.span.text(arrs[value]);
                    $("#score").val(value);
                }
            })
        });
    </script>
    <script type="text/javascript">
        $(function () {
            setInterval(function(){
                var date=new Date();
                var year=date.getFullYear(); //获取当前年份
                var mon=date.getMonth()+1; //获取当前月份
                var da=date.getDate(); //获取当前日
                var day=date.getDay(); //获取当前星期几
                var h=date.getHours(); //获取小时
                var m=date.getMinutes(); //获取分钟
                var s=date.getSeconds(); //获取秒
                $("#c_date").val(year+'-'+mon+'-'+da+' '+h+':'+m+':'+s);
            },1000)
        })
    </script>
    <script>
        layui.use(['form', 'layer'], function() {
            $ = layui.jquery;
            var form = layui.form,
                layer = layui.layer;
            //监听提交
            form.on('submit(add)', function(data) {

                // console.log(data);
                //发异步，把数据提交
                $("#addc").ajaxSubmit({
                    url:"cc/addco",
                    type:"post",
                    success:function (data) {
                        layer.msg("我我哦哦我")
                        layer.alert("发表成功", {icon: 6}, function() {
                            // 获得frame索引
                            var index = parent.layer.getFrameIndex(window.name);
                            //关闭当前frame
                            parent.layer.close(index);
                        });
                        return false;
                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown){

                    }
                });
            });
        });
    </script>



    <%--<script type="text/javascript">--%>

            <%--layui.use(['form', 'layer'],--%>
            <%--function() {--%>
                <%--$ = layui.jquery;--%>
                <%--var form = layui.form;--%>
                <%--layer = layui.layer;--%>
            <%--});--%>

            <%--function closethis() {--%>
                <%--layer.confirm('添加成功',function(index){--%>
                    <%--layer.msg('添加成功!',{icon:1,time:1000});--%>
                    <%--// var index = parent.layer.getFrameIndex(window.name);--%>
                    <%--// //关闭当前frame--%>
                    <%--// parent.layer.close(index);--%>
                <%--});--%>
                <%--// window.parent.location.reload();--%>
            <%--}--%>
            <%--// $(function(){--%>
            <%--//     $("#layui-form-add").validate({--%>
            <%--//         onkeyup:false,--%>
            <%--//         focusCleanup:true,--%>
            <%--//         success:"valid",--%>
            <%--//         submitHandler:function(form){--%>
            <%--//             $(form).ajaxSubmit({--%>
            <%--//                 type: 'get',--%>
            <%--//                 url: 'mov/addMov',--%>
            <%--//                 dataType:'json',--%>
            <%--//                 success: function(data){--%>
            <%--//                     layer.msg(data,{icon:1,time:1000});--%>
            <%--//                     var index = parent.layer.getFrameIndex(window.name);--%>
            <%--//                     parent.$('.layui-btn layui-btn-small').click();--%>
            <%--//                     parent.layer.close(index);--%>
            <%--//                 },--%>
            <%--//                 error: function(XmlHttpRequest, textStatus, errorThrown){--%>
            <%--//                     // alert(sex+"-----")--%>
            <%--//                     // layer.msg('error!',{icon:1,time:1000});--%>
            <%--//                 }--%>
            <%--//             });--%>
            <%--//--%>
            <%--//         }--%>
            <%--//     });--%>
            <%--// });--%>
        <%--</script>--%>


    </body>

</html>