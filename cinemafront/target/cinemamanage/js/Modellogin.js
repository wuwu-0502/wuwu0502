function a() {
    //1.创建XMLHttpRequest对象
    /*var xmlHttp = new XMLHttpRequest();*/

    //2.注册一个回调函数
    /*xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {

                //获取后台返回的信号量.
                var str = xmlHttp.responseText;*/


                var username = $('#name').val();
                var pwd = $('#pwd').val();
                /* 判断用户名是否为空 */
                if (username == "") {
                    /* 使用jquery的animate实现窗口抖动 */
                    for (var i = 0; i < 3; i++) {
                        $('#user').animate({left: "2px"}, 80);
                        $('#user').animate({left: ""}, 80);
                    }
                    $("#div1").addClass("has-error");
                    $('#n').html("用户名不能为空");
                    $('#denglu').attr("disabled", "disabled");
                }
                else {
                    /* 使用jquery的addClass来动态添加标签的class属性 */
                    $("#div1").removeClass("has-error");
                    $("#div1").addClass("has-success");
                    $('#n').html(" ");
                    /*   判断密码是否为空 */
                    if (pwd == "") {
                        for (var i = 0; i < 3; i++) {
                            $('#pd').animate({left: "2px"}, 100);
                            $('#pd').animate({left: ""}, 100);
                        }
                        $("#div2").addClass("has-error");
                        $('#p').html("密码不能为空");
                        $('#denglu').attr("disabled", "disabled");
                    }
                    else {
                        $("#div2").removeClass("has-error");
                        $("#div2").addClass("has-success");
                        $('#p').html(" ");
                        $('#denglu').attr("disabled", false);
                    }
                }
                /*xmlHttp.open("post", "${path}/", true);

                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                //4.发送请求
                xmlHttp.send("username=" + value);
            }
        }
    }*/
}