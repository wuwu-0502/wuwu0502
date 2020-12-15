/*
 * js自动完成组件
 *
 * [Change Log]
 * 2012-02-02 马超 重新设计代码架构，仍然支持三个接口： $.fn.autoMatch /$.fn.autoFill /$.fn.autoSearch
 * 2012-12-03 马超 增加对窗口resize处理
 * 2012-12-25 马超 完善对focus的处理
 * 2013-01-06 马超 增加自动定位第一个元素（emptyHolder）配置、是否修改输入框内容（pushValue）配置
 * 2013-02-04 马超 增加checkValid控制参数，用于动态设置功能开关，若函数返回false则不显示
 * 2013-04-16 梁枫 增加canShowNormal控制参数，用于判断是否正常的未处理的字符，可以是正则表达式或是函数
 * 2013-07-11 田刚 jsonp的回调函数名称由原来的’_$$_‘改为"cb"+stamp，原因是后台做了特殊字符过滤的处理
 * 2013-07-12 马超 增加原因为 inputConfirm 时的关闭参数，将链接传递给回调函数使用
 * 2014-07-07 马超
 *
 * [Depend On]
 * jquery 1.4.2+
 */
(function(window, $, undefined) {
    var document = window.document,
        /*
         * 服务对象、缓存
         */
        Target = null,
        Guid = 0,
        Cache = [],

        /*
         * 样式id和class
         */
        cssMap = {
            listID: "autoCompleteList",
            itemCss: "autoListItem",
            itemHover: "autoListItemHover"
        },

        /*
         * 关闭自动完成列表原因
         */
        hideListReason = {
            noResult: "noResult",
            loseFocus: "loseFocus",
            noInitFocus: "noResultWhenFocus",
            oneSame: "oneSame",
            inputCfm: "inputConfirm",
            force: "scriptForce"
        },

        /*
         * 初始化自动完成列表
         */
        prepareList = function() {
            return $(document.getElementById(cssMap.listID) || $("<div id='" + cssMap.listID + "'/>")
                .appendTo(document.body)
                .delegate("a", "mouseenter", Events.autoListHover)
                .delegate("a", "mousedown", Events.autoListClick)[0]
            );
        },

        /*
         * 字符串模版格式化工具，仅支持对象
         */
        format = function(str, data) {
            return String(str).replace(/\{([\w]+)\}/g, function(match, index) {
                var fnPath = index.split("."),
                    val = data;
                for (var i = 0; i < fnPath.length; i++)
                    val = val[fnPath[i]];
                return val === undefined ? match : val;
            });
        },

        /**
         * 安全html字符串过滤
         */
        safeHTML = function(str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        },

        /*
         * 公共处理事件
         */
        Events = {
            /*
             * 自动完成列表的hover事件
             */
            autoListHover: function(e, pushValue) {
                $("#" + cssMap.listID).find("." + cssMap.itemHover).removeClass(cssMap.itemHover);
                var hit = $(this).addClass(cssMap.itemHover),
                    input = Target,
                    orgValue;
                if (pushValue === true && input && e.type == "keydown") {
                    if (this === null || this === window) {
                        input.val(input[0].orgValue);
                        input[0].orgValue = null;
                    } else {
                        //保存原有内容
                        input[0].orgValue = input[0].orgValue || input.val();
                        input.val(this.title);
                    }
                }
            },
            /*
             * 自动完成列表的click事件（mousedown）
             */
            autoListClick: function(e) {
                //键盘操作时，设置标志位，防止keyup事件打开列表
                if (!e)
                    Target[0].ignoreOnceKeyup = true;
                //获得输入内容: title存储要显示的内容，val存储实际要用的值
                //如果hash没有内容，则取整个url，不直接取this.href防止各个浏览器解析不一致
                var txt = this.title,
                    value = this.hash.substr(1) || $(this).attr("href");
                Target.val(txt).attr("val", value);
                //关闭
                Events.hideList(hideListReason.inputCfm, txt, value, this);
                //阻止默认行为和事件冒泡
                e && e.preventDefault();
            },
            /*
             * 键盘事件监听
             */
            docKeyDown: function(e) {
                var list = prepareList(),
                    keyCode = e.keyCode,
                    next, selected, loop, cache, emptyHolder;
                if (!list.is(":visible") || Target === null)
                    return;
                selected = list.find("." + cssMap.itemHover);
                cache = Cache[Target[0].autoCompleteId];
                emptyHolder = cache.emptyHolder;
                switch (keyCode) {
                    case 38: //上
                    case 40: //下
                        loop = list.find("." + cssMap.itemCss + ":" + (keyCode == 38 ? "last" : "first"));
                        next = selected[0] ? selected[keyCode == 38 ? "prev" : "next"]("." + cssMap.itemCss) : loop;
                        //如果没有找到下一个，则循环
                        next = next[0] ? next : emptyHolder ? [null] : loop;
                        //更改样式
                        Events.autoListHover.call(next[0], e, cache.pushValue);
                        e.preventDefault();
                        break;
                    case 13: //enter
                        selected[0] && Events.autoListClick.call(selected[0]);
                        //防止表单被提交
                        return false;
                }
            },
            docMouseDown: function() {
                if (Target !== null)
                    Events.hideList(hideListReason.loseFocus, Target.val(), Target.attr("val"));
            },
            /*
             * 窗口变化，重新移动tip
             */
            recalTip: function() {
                var input = Target,
                    pos, cache, list = prepareList();
                if (input) {
                    cache = Cache[input[0].autoCompleteId];
                    pos = input.offset();
                    pos.height = input.outerHeight();
                    //如果是自动宽度，则设置
                    cache.sameWidth && list.width(input.outerWidth() - list.outerWidth() + list.innerWidth());
                    list.css({
                        left: pos.left,
                        top: pos.top + pos.height
                    }).show();
                }
            },
            /*
             * 为某个元素显示自动完成列表
             */
            showListFor: function(jqObj, isNoResult) {
                var cache, input = jqObj,
                    list = prepareList(),
                    pos, forNewOne = !Target;
                //先关闭已经打开的对象，防止某些时候blur事件未激发或其他未知情况导致的Target未复原的bug
                if (Target !== null && Target[0] !== input[0]) {
                    forNewOne = true;
                    this.hideList(hideListReason.loseFocus, Target.val(), Target.attr("val"));
                }
                //强制关闭系统的自动完成提示
                input.attr("autocomplete", "off");
                //保存Dom对象引用，绑定上下快捷键
                if (forNewOne) {
                    //获取缓存
                    cache = Cache[input[0].autoCompleteId];
                    Target = input;
                    $(document).keydown(this.docKeyDown).mousedown(this.docMouseDown);
                    //添加自定义样式
                    cache.listCss && list.addClass(cache.listCss);
                    //定位显示
                    this.recalTip();
                    //监听窗口尺寸变化
                    $(window).resize(this.recalTip).scroll(this.recalTip);
                    //调用显示回调
                    cache.onShow.call(input[0], !! isNoResult);
                }
            },
            /*
             * 隐藏自动完成列表
             */
            hideList: function(reasonText, text, value, link) {
                var input = Target,
                    cache;
                if (input === null)
                    return;
                //释放引用
                input[0].orgValue = null;
                Target = null;

                //卸载事件/重置Dom
                $(document).unbind("keydown", this.docKeyDown).unbind("mousedown", this.docMouseDown);
                prepareList().removeAttr("style").removeClass();
                $(window).unbind("resize", this.recalTip).unbind("scroll", this.recalTip);

                //通知回调
                cache = Cache[input[0].autoCompleteId];
                cache.onHide.call(input[0], reasonText, text, value, link);
            }
        },
        /*
         * 抽象控制模块
         * 为三个子模块提供统一的控制和交互框架
         */
        autoComplete = function(jqDoms, options, coreFn) {
            var listDiv = prepareList();
            //检查options必要属性
            options.onShow = options.onShow || $.noop;
            options.onHide = options.onHide || $.noop;
            options.sameWidth = !! options.sameWidth;
            options.emptyHolder = !! options.emptyHolder;
            options.pushValue = !! options.pushValue;
            options.checkValid = options.checkValid || $.noop;
            //遍历进行初始化
            return jqDoms.each(function() {
                if (this.autoCompleteId !== undefined)
                    return;
                //一点点准备工作
                var guid = Guid++,
                    input = $(this),
                    lastVal = "",
                    cache = options || {};
                this.autoCompleteId = guid;
                Cache[guid] = cache;

                //keyup监听事件
                var keyupFn = function(e) {
                    var isValid = cache.isValid == undefined ? true : cache.isValid;
                    if (cache.checkValid() === false) {
                        if (isValid) { //如果之前是开启的，则回调
                            Events.hideList(hideListReason.force);
                        }
                        cache.isValid = false;
                        return;
                    }
                    //如果是用户键盘选择后输入，则强制关闭匹配过程
                    if (this.ignoreOnceKeyup) {
                        this.ignoreOnceKeyup = 0;
                        return;
                    }
                    var value = $.trim(this.value),
                        isPushValue = e.keyCode >= 37 && e.keyCode <= 40;
                    if (value === lastVal || (this.orgValue == lastVal && isPushValue))
                        return;
                    e.value = lastVal = value;
                    this.orgValue = null;

                    //核心处理函数，需要调用回调函数以继续后续处理
                    coreFn.call(this, e, cache, function(htmlResult, noResultReason) {
                        //有结果需要显示
                        if (htmlResult) {
                            listDiv.html(htmlResult);
                            //默认选中第一个item
                            if (!cache.emptyHolder)
                                listDiv.find("." + cssMap.itemCss + ":first").addClass(cssMap.itemHover);
                            Events.showListFor(input);
                            //没有结果，但有无结果提示的
                        } else if (htmlResult !== 0 && value && cache.noResult && e.type == "keyup") {
                            listDiv.html(cache.noResult.replace(/{key}/g, safeHTML(value)));
                            Events.showListFor(input, true);
                            //没有结果，也没有无结果提示
                        } else
                            Events.hideList({
                                keyup: noResultReason || (htmlResult === 0 ? hideListReason.oneSame : hideListReason.noResult),
                                focus: hideListReason.noInitFocus
                            }[e.type], value, input.attr("val"));
                    });
                };

                //绑定事件
                input.bind({
                    keyup: keyupFn,
                    blur: function(e) {
                        lastVal = "";
                        Events.hideList(hideListReason.loseFocus, this.value, $(this).attr("val"));
                    },
                    focus: function(e) {
                        //直接调用keyup处理函数（不更改事件type），以便keyupFn进行区别对待
                        //2012-12-25 马超延时处理，给其他focus事件留下修改value的时间
                        var me = this;
                        this.orgValue = me.value;
                        window.setTimeout(function() {
                            keyupFn.call(me, e);
                        }, 16);
                    }
                });
            });
        };
    //将底层功能组件扩展到jQuery上，以便在必要时编写自定义suggest组件
    $._autoComplete = autoComplete;
    $.safeRegStr = function(str) {
        return String(str).replace(/([\\\(\)\{\}\[\]\^\$\+\-\*\?\|])/g, "\\$1");
    };
    //2013-04-19 马超 增加关闭功能接口，原因设置为强制关闭
    $.hideAutoComplete = function() {
        Events.hideList("force");
    };

    /********************************************************************************************************
     * 自动补足核心函数
     */
    var autoFillCore = function(e, cache, callback) {
        var value = e.value,
            list = cache.dataList,
            sp = cache.split || list[0].substr(0, 1),
            //拆分value，分析补足信息
            info = value.split(sp),
            base = info[0],
            ext = info.length > 1 ? sp + info[1] : "",
            html = [],
            data,
            myList = !ext ? list : (function() {
                var arr = [],
                    n = list.length,
                    i = 0;
                for (; i < n; i++)
                    list[i].toLowerCase().indexOf(ext) >= 0 && arr.push(list[i]);
                return arr;
            })(),
            canShowNormal = false;

        if (cache.canShowNormal) {
            // 如果是函数
            if ($.isFunction(cache.canShowNormal)) {
                canShowNormal = cache.canShowNormal(value);
            } else {
                // 如果是正则表达式
                if (Object.prototype.toString.apply(cache.canShowNormal) === '[object RegExp]') {
                    canShowNormal = cache.canShowNormal.test(value);
                }
            }
        }

        if (canShowNormal) {
            myList = [''].concat(myList);
        }

        //准备构建html
        //没有数据，隐藏
        if (myList.length == 0 || !base) {
            callback(null);
            return;
        }
        //仅有一条完全匹配的结果，也隐藏
        if (myList.length == 1 && ext == myList[0]) {
            callback(0);
            return;
        }
        //有数据，则显示
        data = {
            itemCss: cssMap.itemCss,
            base: safeHTML(base)
        };
        for (var i = 0, n = myList.length; i < n; i++) {
            data.ext =  myList[i];
            data.text = safeHTML(base) + myList[i];
            html[i] = format(cache.itemTmpl, data);
        }
        callback(cache.headTmpl + html.join("") + cache.footTmpl);
    },
        /*
         * 自动补足默认选项
         */
        autoFillDefault = {
            //	split : "@",
            headTmpl: '<div>请选择或继续输入...</div>',
            itemTmpl: "<a class='{itemCss}' href='#{text}' title='{text}'>{base}<i>{ext}</i></a>",
            footTmpl: '',
            listCss: 'autoFill',
            // 2013-4-16 梁枫 添加是否显示正常的未处理的字符，可以是正则表达式或是函数
            // 如果是正则表达式，则拿当前已输入的字符串和正则表达式匹配，如果匹配成功，就显示未处理的字符
            // 如果是函数，就执行函数，并传入已输入的字符串，如果函数返回true，就显示未处理的字符
            canShowNormal: null
        };
    /*
     * 映射到jQuery原型上
     */
    $.fn.autoFill = function(list, options) {
        var data = $.extend({}, autoFillDefault, options || {});
        data.dataList = list;
        return autoComplete(this, data, autoFillCore);
    };

    /*********************************************************************************************************
     * 自动匹配核心函数
     */
    var autoMatchCore = function(e, cache, callback) {
        //获得匹配列表
        var value = e.value,
            keyArr = _autoMatch(cache.dataList, value, cache.maxResultNum),
            n = keyArr.length,
            i = 0,
            result = n == 0 ? n : n == 1 && keyArr[0].x == value ? -1 : n,
            html = [];
        //通知匹配回调
        cache.onMatch.call(this, result, keyArr);
        //没有数据，隐藏
        if (n == 0) {
            callback(null);
            return;
        }
        //仅有一条完全匹配的结果，也隐藏
        if (result < 0) {
            callback(0);
            return;
        }
        //有数据，则显示
        for (; i < n; i++) {
            keyArr[i].itemCss = cssMap.itemCss;
            html[i] = format(cache.itemTmpl, keyArr[i]);
        }
        callback(cache.headTmpl + html.join("") + cache.footTmpl);
    },
        //匹配算法函数
        //返回运算好的对象数组
        _autoMatch = function(list, value, maxResultNum) {
            if (!value)
                return [];
            //继续
            var matchArr = [],
                //x匹配结果			y顺序匹配结果		y跳跃匹配结果
                mainMatchArr = [],
                subMatchArr = [],
                spareMatchArr = [],
                n = list.length,
                i = 0,
                item, m,
                //安全正则字符串
                safeRegStr = $.safeRegStr,
                //合并输出对象
                getOutItem = function(item, matchXReg, matchYReg) {
                    return $.extend({
                        xShow: matchXReg ? item.x.replace(matchXReg, "<b>$1</b>") : item.x,
                        yShow: matchYReg && item.y ? item.y.replace(matchYReg, "<b>$1</b>") : item.y
                    }, item);
                },
                //准备正则
                mainReg = new RegExp("(" + safeRegStr(value) + ")", "i"), //不区分大小写，不全局搜索
                subReg = new RegExp("^(" + safeRegStr(value) + ")", "i"), //不区分大小写，不全局搜索，从头开始搜索
                spareReg = new RegExp("^" + value.replace(/./gi, function(m) {
                    return "(" + safeRegStr(m) + ")\.\*";
                }), "i"); //跳跃匹配，不区分大小写，从头开始匹配，字符间可有其他任何多字符
            //遍历一边list即可完成所有匹配
            for (; i < n; i++) {
                item = list[i];
                //数据错误则不处理
                if (!item || !item.x || item.v === undefined)
                    continue;
                //优先顺序匹配x，不考虑匹配起始点，如果完全匹配，则放在最前面，否则追加到后面
                if (mainReg.test(item.x)) {
                    mainMatchArr[item.x === value ? "unshift" : "push"](getOutItem(item, mainReg));
                    continue;
                }
                //如果有别名并且别名匹配，则
                else if (item.z && mainReg.test(item.z)) {
                    mainMatchArr.push(getOutItem(item));
                    continue;
                }
                //如果x没有匹配，则检查y
                else if (item.y && subReg.test(item.y)) {
                    subMatchArr.push(getOutItem(item, 0, subReg));
                    continue;
                }
                //如果y没有顺序匹配，则跳跃匹配
                else if (item.y && spareReg.test(item.y)) {
                    spareMatchArr.push(getOutItem(item));
                }
            }
            //如果y有匹配结果，则忽略y模糊匹配结果
            if (subMatchArr.length)
                spareMatchArr.length = 0;
            //将三组匹配结果按照顺序拼接，取前maxResult个结果
            matchArr = mainMatchArr.concat(subMatchArr, spareMatchArr);
            if (matchArr.length)
                matchArr = matchArr.slice(0, Math.min(maxResultNum || 10, matchArr.length));
            //到此，已经匹配完成
            return matchArr;
        },
        /*
         * 自动匹配默认选项
         */
        autoMatchDefault = {
            headTmpl: '',
            itemTmpl: '<a class="{itemCss}" href="#{v}" title="{x}"><span>{xShow}</span><i>({yShow})</i></a>',
            footTmpl: '',
            listCss: 'autoMatch',
            noResult: "No Match \"<b>{key}</b>\"!",
            maxResultNum: 10
        };
    /*
     * 映射到jQuery原型上
     */
    $.fn.autoMatch = function(list, options) {
        var data = $.extend({}, autoMatchDefault, options || {});
        data.dataList = list;
        data.onMatch = data.onMatch || $.noop;
        return autoComplete(this, data, autoMatchCore);
    };

    /*********************************************************************************************************
     * 自动搜索核心函数
     */
    var autoSearchCore = function(e, cache, callback) {
        if (!e.value) {
            callback(null);
            return;
        }
        //这里进行缓存，以减少服务器压力
        if (cache.cache && cache._t[e.value] !== undefined) {
            callback(cache._t[e.value]);
            return;
        }
        //准备数据
        var value = e.value,
            html = [],
            stamp = +new Date(),
            randCbName = "cb" + stamp,
            head = document.getElementsByTagName("head")[0] || document.documentElement,
            js = document.createElement("script"),
            me = this;
        js.type = "text/javascript";
        js.src = format(cache.suggest, {
            cache: stamp,
            key: encodeURIComponent(value),
            callback: "window." + randCbName
        });
        //创建临时回调函数
        window[randCbName] = function() {
            //删除script节点
            head.removeChild(js);
            var arg = arguments,
                n, i = 0,
                html = [],
                map = cssMap,
                ft = format,
                dataArr = cache.trans.apply(me, arg),
                result = null;
            //处理函数必须要返回一个对象数组
            if ($.isArray(dataArr)) {
                n = dataArr.length;
                //没有数据，隐藏
                if (n == 0) {
                    callback(null);
                    return;
                }
                //有数据，则显示
                for (; i < n; i++) {
                    dataArr[i].itemCss = map.itemCss;
                    html[i] = ft(cache.itemTmpl, dataArr[i]);
                }
                result = cache.headTmpl + html.join("") + cache.footTmpl;
            }
            //回调
            callback(result);
            //缓存
            if (cache.cache)
                cache._t[e.value] = result;
            //删除临时回调函数
            window[randCbName] = null;
        };
        //插入script节点
        head.appendChild(js, head.lastChild);
    },
        /*
         * 自动搜索默认选项
         */
        autoSearchDefault = {
            headTmpl: '',
            itemTmpl: '<a class="{itemCss}" href="#{value}" title="{text}">{textShow}</a>',
            footTmpl: '',
            listCss: 'autoSearch',
            cache: true,
            emptyHolder: true,
            pushValue: true
        };
    /*
     * 映射到jQuery原型上
     */
    $.fn.autoSearch = function(suggestUrlTmpl, dataTransFn, options) {
        var data = $.extend({}, autoSearchDefault, options || {});
        data.suggest = suggestUrlTmpl;
        data.trans = dataTransFn;
        //结果缓存，重复的key不增加ajax请求次数
        data._t = {};
        return autoComplete(this, data, autoSearchCore);
    };
})(window, jQuery);
