<%--
  Created by IntelliJ IDEA.
  User: 闫清海
  Date: 2019.8.24
  Time: 9:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" isELIgnored="false" %>
<html>
<head>
    <title>付款</title>
    <script src="js/jquery.js"></script>
    <style>
        button {
            display: block;
            margin: 0 auto;
            border-radius: 6px;
            text-shadow: 0px -1px 0px #5b6178;
            -webkit-box-shadow: 0px 1px 0px 0px #f0f7fa;
            -moz-box-shadow: 0px 1px 0px 0px #f0f7fa;
            box-shadow: 0px 1px 0px 0px #f0f7fa;
            font-family: Arial;
            color: #ffffff;
            font-size: 16px;
            background: #ff9411;
            padding: 12px 30px 12px 30px;
            border: solid #ff9411 1px;
            text-decoration: none;
        }

        button:hover {
            color: #ffffff;
            background: #ff6e12;
            text-decoration: none;
        }
    </style>
    <script src="js/jquery.js"></script>
    <script src="layui/layui.all.js"></script>
    <script src="layer-v3.1.1/layer/layer.js"></script>
</head>
<body>
<img src="images/pay.png">
<button onclick="payOk()">付款成功</button>
<script>
    function payOk() {
        $.ajax({
            url: "user/pay",
            data: 'o_no=${check.o_no}',
            dataType: 'text',
            success: function (data) {
                var index = parent.layer.getFrameIndex(window.name);
                layer.close(index)

                window.parent.location.href='payok.jsp'
                // window.location.href = 'payok.jsp'
            },
            error: function () {
            }
        });
    }
</script>
</body>
</html>
