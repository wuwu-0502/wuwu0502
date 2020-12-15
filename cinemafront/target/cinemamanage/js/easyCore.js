(function (window, $, undefined) {
//base.fix.js
    (function () {
        try {
            window.document.execCommand("BackgroundImageCache", false, true)
        } catch (e) {
        }
        $.extend(Number.prototype, {
            Round: function (b, c) {
                var a = Math.pow(10, b || 0);
                return c == 0 ? Math.ceil(this * a) / a : Math.round(this * a + (5 - (c || 5)) / 10) / a
            }, Cint: function (a) {
                return this.Round(0, a)
            }, Round465: function (a) {
                var b, a = a || 0, num = '' + this, flag = false, tmp;
                b = new RegExp('^(\\d*)(\\d)(\\.)(\\d{' + a + '})5(\\d*)$');
                if (b.test(num)) {
                    if (a == 0) {
                        num = num.replace(b, "$1$2");
                        tmp = RegExp.$2
                    } else {
                        num = num.replace(b, "$1$2$3$4");
                        tmp = RegExp.$4
                    }
                    if (+RegExp.$5 > 0) {
                        flag = true
                    } else {
                        if (tmp % 2 != 0) {
                            flag = true
                        }
                    }
                    if (flag) {
                        num = (+num) + 1 / Math.pow(10, a)
                    }
                }
                num = (+num).Round(a);
                return num
            }
        });
        var f = /./, regCompile = f.compile && f.compile(f.source, "g");
        RegExp.regCompile = regCompile;
        var compileReg = [/[\u4e00-\u9fa5\u3400-\u4db5\ue000-\uf8ff]/g, /^(?:\s|\xa0|\u3000)+|(?:\s|\xa0|\u3000)+$/g, /([^\x00-\xff])/g];
        regCompile && $.each(compileReg, function (i, reg) {
            compileReg[i] = reg.compile(reg.source, "g");
        });
        var isMobReg = /^(130|131|132|133|134|135|136|137|138|139|147|150|151|152|153|155|156|157|158|159|180|182|183|185|186|187|188|189)[\d]{8}$/;
        $.extend(String.prototype, {
            trim: function () {
                return this.replace(/^(?:\s|\xa0|\u3000)+|(?:\s|\xa0|\u3000)+$/g, "")
            }, byteLen: function () {
                return this.replace(/([^\x00-\xff])/g, "ma").length
            }, cutString: function (a, b) {
                var c = /([^\x00-\xff])/g, reg2 = /([^\x00-\xff]) /g;
                if (b) {
                    var d = String(b), hdLen = d.length, str = this.replace(c, "$1 ");
                    a = a >= hdLen ? a - hdLen : 0;
                    b = str.length > a ? d : "";
                    return str.substr(0, a).replace(reg2, '$1') + b
                }
                return this.substr(0, a).replace(c, '$1 ').substr(0, a).replace(reg2, '$1')
            }, cutString: function (len, holder) {
                var str = this.replace(compileReg[2], '$1 '), holder = holder || '';
                if (str.length <= len) {
                    return this.toString();
                }
                return str.substr(0, len).replace(/([^\x00-\xff]) /g, '$1') + holder;
            }, cutString2: function (len, holder) {
                if (holder) {
                    var hd = String(holder), hdLen = hd.length, str = this.replace(compileReg[2], "$1 ");
                    len = len >= hdLen ? len - hdLen : 0;
                    holder = str.length > len ? hd : "";
                    return str.substr(0, len).replace(/([^\x00-\xff]) /g, '$1') + holder;
                }
                return this.substr(0, len).replace(compileReg[2], '$1 ').substr(0, len).replace(/([^\x00-\xff]) /g, '$1');
            }
        });
        $.fn.fixPosition = function () {
            var d = this, t, b, l, r, css = function (o, a) {
                var c = (o[0].currentStyle[a]);
                return c.indexOf("%") + 1 ? false : (o.css(a).replace(/\D/g, "") || null)
            }, win = $(window), top, left, fn, p, hasBug;
            if (d.css("position") == "absolute") {
                t = css(d, "top");
                b = css(d, "bottom");
                l = css(d, "left");
                r = css(d, "right");
                p = d.offsetParent()[0];
                hasBug = p ? /^html|body$/i.test(p.tagName) : false;
                top = hasBug ? +win.scrollTop() : 0;
                left = hasBug ? +win.scrollLeft() : 0;
                fn = function (e) {
                    var a = e.type == "resize", isHide;
                    if (a) {
                        isHide = d.is(":hidden");
                        if (!isHide) d.hide()
                    }
                    var c = +win.scrollTop(), _left = +win.scrollLeft();
                    if (hasBug) {
                        b && d.css("bottom", +b + 1).css("bottom", b + "px")
                    } else {
                        b && d.css("bottom", ($(document).height() - win.height() - c + +b) + "px")
                    }
                    t && d.css("top", (+t + c - top) + "px");
                    if (hasBug) {
                        r && d.css("right", +r + 1).css("right", r + "px")
                    } else {
                        r && d.css("right", ($(document).width() - win.width() - _left + +r) + "px")
                    }
                    l && d.css("left", (+l + _left - left) + "px");
                    if (a && !isHide) d.show()
                };
                win.scroll(fn).resize(fn)
            }
            return d
        }
    })();
//base.678.js
    (function () {
        $.isIE678 = eval('"\\v"=="v"');
        if ($.isIE678) {
            $.isIE8 = !!'1'[0];
            $.isIE6 = !$.isIE8 && (!document.documentMode || document.compatMode == "BackCompat");
            $.isIE7 = !$.isIE8 && !$.isIE6;
            $.fn.extend({
                _bind_: $.fn.bind, bind: function (a, b, c) {
                    /^click$/gi.test(a) && d(this);
                    return this._bind_(a, b, c)
                }
            });
            var d = function (b) {
                var n = b.length, i = 0, dom;
                for (; i < n; i++) {
                    dom = b[i];
                    if (!dom.fixClick) {
                        dom.fixClick = true;
                        $(dom).bind("dblclick", function (e) {
                            var a = e.target, n = 0;
                            while (a && a.nodeType !== 9 && (a.nodeType !== 1 || a !== this)) {
                                if (a.nodeType === 1) {
                                    if (a.fixClick)return
                                }
                                a = a.parentNode
                            }
                            e.type = "click";
                            e.source = "dblclick";
                            $(e.target).trigger(e)
                        })
                    }
                }
            };
            var f = "abbr,article,aside,audio,canvas,datalist,details,dialog,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video".split(','),
                i = f.length;
            while (i--)document.createElement(f[i])
        }
    })();
//base.tools.js
    $.extend({
        getUrlPara: function (a) {
            var b = window.location.search.replace(/^\?/g, "");
            return $.getParaFromString(b, a)
        }, getHashPara: function (a) {
            var b = window.location.href.match(/#(.*)$/);
            return $.getParaFromString(b ? b[1] : '', a)
        }, getPara: function (a) {
            return $.getUrlPara(a) || $.getHashPara(a)
        }, getParaFromString: function (str, paraName) {
            if ($.trim(str).length <= 0) return null;
            var ars = str.split('&'), obj = {};
            $.each(ars, function () {
                var ar = this.split('=');
                obj[ar[0]] = decodeURIComponent(ar[1]);
            });
            if (paraName === undefined) {
                return obj;
            } else {
                return obj[paraName] || '';
            }
        }, getParaFromString2: function (b, c) {
            var e = {};
            $.each(("" + b).match(/([^=&#\?]+)=[^&#]+/g) || [], function (i, a) {
                var d = a.split("="), val = decodeURIComponent(d[1]);
                if (e[d[0]] !== undefined) {
                    e[d[0]] += "," + val
                } else {
                    e[d[0]] = val
                }
            });
            return c ? e[c] || "" : e
        }, safeHTML: function (a) {
            return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        }, safeRegStr: function (a) {
            return String(a).replace(/([\\\(\)\{\}\[\]\^\$\+\-\*\?\|])/g, "\\$1")
        }, falseFn: function () {
            return false
        }, stopProp: function (e) {
            e.stopPropagation()
        }, preventDft: function (e) {
            e.preventDefault()
        }, isLeftClick: function (e) {
            return e.button == (eval('"\\v"=="v"') ? 1 : 0)
        }, addUrlPara: function (b, c, d) {
            var e = (b + "").split('#'), sp;
            if (d) {
                e[0] = $.removeUrlPara(e[0], $.map(c.match(/([^=&#\?]+)=[^&#]+/g), function (a) {
                    return a.replace(/=.+$/, "")
                }))
            }
            sp = e[0].indexOf("?") + 1 ? "&" : "?";
            return (e[0] + sp + c + (e.length > 1 ? "#" + e[1] : "")).replace(/\?\&/, "?")
        }, removeUrlPara: function (b, c) {
            var d = b.split("#"), arr2 = d[0].split("?"), base = arr2[0], para = arr2.length > 1 ? arr2[1] : "",
                hash = d.length > 1 ? "#" + d[1] : "", paraReg = typeof c === "string" && c ? [c] : c.join ? c : [];
            if (!paraReg.length || !para) {
                return base.replace(/\?.+$/, "") + hash
            }
            $.map(paraReg, function (a) {
                return a.replace(/([\\\(\)\{\}\[\]\^\$\+\-\*\?\|])/g, "\\$1")
            });
            return (base + "?" + para.replace(new RegExp("(\?:^\|&)(?:" + paraReg.join("|") + ")=[^&$]+", "g"), "").replace(/^&/, "")).replace(/\?$/, "") + hash
        }, fillUrl: function (a) {
            if (typeof a !== "string" || a == "") return a;
            if (!/^http/i.test(a)) {
                var b = window.location.port || "80", fromRoot = /^\//.test(a);
                if (!fromRoot) a = document.URL.replace(/\/[^\/]*$/g, "\/") + a; else a = window.location.protocol + "//" + window.location.host + (b == "80" ? "" : (":" + b)) + a
            }
            return a
        }, addFav: (window.sidebar && window.sidebar.addPanel) ? function (a, b) {
            window.sidebar.addPanel(b, a, "")
        } : function (a, b) {
            try {
                window.external.addFavorite(a, b)
            } catch (e) {
                window.alert("请尝试点击 Ctrl + D 来添加！")
            }
        }, formatTime: function (b, c) {
            var e = /^\d+$/i.test(b + "") ? +b : Date.parse(b);
            if (isNaN(e)) return b;
            var D = new Date(e), zz = function (a) {
                    return ("0" + a).slice(-2)
                }, yyyy = D.getFullYear(), M = D.getMonth() + 1, MM = zz(M), d = D.getDate(), dd = zz(d), h = D.getHours(),
                hh = zz(h), m = D.getMinutes(), mm = zz(m), s = D.getSeconds(), ss = zz(s);
            return (c || "yyyy-MM-dd hh:mm:ss").replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/M/g, M).replace(/dd/g, dd).replace(/d/g, d).replace(/hh/g, hh).replace(/h/g, h).replace(/mm/g, mm).replace(/m/g, m).replace(/ss/g, ss).replace(/s/g, s)
        }
    });
    (function ($) {
        var g = {}, fnCache = {}, guid = 0, toString = Object.prototype.toString, compile = function (a, b) {
            var f = b || "%",
                fn = new Function("var p=[],my=this,data=my,print=function(){p.push.apply(p,arguments);};p.push('" + a.replace(/[\r\t\n]/g, " ").split("<" + f).join("\t").replace(new RegExp("((^|" + f + ">)[^\\t]*)'", "g"), "$1\r").replace(new RegExp("\\t=(.*?)" + f + ">", "g"), "',$1,'").split("\t").join("');").split(f + ">").join("p.push('").split("\r").join("\\'") + "');return p.join('');");
            return fn
        };
        $.template = function (b, c, d) {
            d = d || "%";
            var e = toString.call(b) === "[object Function]" ? b : !/\W/.test(b) ? fnCache[b + d] = fnCache[b + d] || compile(document.getElementById(b).innerHTML, d) : (function () {
                for (var a in g) if (g[a] === b) return fnCache[a];
                return (g[++guid] = b, fnCache[guid] = compile(b, d))
            })();
            return c ? e.call(c) : e
        }
    })(window.jQuery || window);
    $.fn.extend({
        disabled: function (b) {
            return this.each(function () {
                var a = this.bindDownCssFix || "", dis = !b ? "disabled" + a : b;
                $(this).attr("disabled", "disabled").addClass(dis)[0].disabled = true
            })
        }, enabled: function (b) {
            return this.each(function () {
                var a = this.bindDownCssFix || "", dis = !b ? "disabled" + a : b;
                $(this).removeClass(dis).removeAttr("disabled")[0].disabled = false
            })
        }, disableDrag: function () {
            return this.bind('dragstart', $.falseFn)
        }, disableDarg: function () {
            return this.bind('dragstart', $.falseFn)
        }, enableDrag: function () {
            return this.unbind('dragstart', $.falseFn)
        }
    });
    (function () {
        var g = RegExp.regCompile ? /./.compile("\\{([\\w\\.]+)\\}", "g") : /\{([\w\.]+)\}/g;
        $.format = function (d, e) {
            var f = true, N, numReg,
                data = e === undefined ? null : $.isPlainObject(e) ? (f = false, e) : $.isArray(e) ? e : Array.prototype.slice.call(arguments, 1);
            if (data === null) return d;
            N = f ? data.length : 0;
            numReg = RegExp.regCompile ? /./.compile("^\\d+$") : /^\d+$/;
            return String(d).replace(g, function (a, b) {
                var c = numReg.test(b), n, fnPath, val;
                if (c && f) {
                    n = parseInt(b, 10);
                    return n < N ? data[n] : a
                } else {
                    fnPath = b.split(".");
                    val = data;
                    for (var i = 0; i < fnPath.length; i++) val = val[fnPath[i]];
                    return val === undefined ? a : val
                }
            })
        }
    })();
    $.fn.flash = function (a, b, c) {
        if ($.isFunction(a)) {
            c = a;
            a = 0
        }
        if ($.isFunction(b)) {
            c = b;
            b = 0
        }
        var N = 2 * (a || 3), i = 0, isShow = this.is(":visible"), timer = this.flashTimer, obj = this;
        timer && window.clearInterval(timer);
        timer = window.setInterval(function () {
            obj.css("visibility", i % 2 ? "visible" : "hidden");
            i++;
            if (i >= N) {
                window.clearInterval(timer);
                obj.flashTimer = 0;
                $.isFunction(c) && c.call(obj)
            }
        }, b || 200);
        this.flashTimer = timer;
        return this
    };
    $.fn.bindTab = function (f, g, h, i, j) {
        if (!$.isFunction(f)) {
            j = i;
            i = h;
            h = g;
            g = f;
            f = $.noop
        }
        return this.each(function () {
            var c = $(this), timer, css = (i || "active").split("::"), tag = h || "li", hook = j || "rel",
                fireMethod = g || "mouseenter", delay = fireMethod == "mouseenter", toggTab = function (a) {
                    var b = $(c.find("." + css[0]).removeClass(css[0]).attr(hook)), pnl = $(a.addClass(css[0]).attr(hook));
                    if (css[1]) {
                        b.addClass(css[1]);
                        pnl.removeClass(css[1])
                    } else {
                        b.hide();
                        pnl.show()
                    }
                    f.call(a[0], pnl[0])
                };
            c.delegate(tag, fireMethod, function () {
                var a = $(this);
                if (a.hasClass(css[0]) || this.disabled) return;
                if (delay) {
                    timer && window.clearTimeout(timer);
                    timer = window.setTimeout(function () {
                        toggTab(a)
                    }, 200)
                } else toggTab(a)
            });
            delay && c.delegate(tag, "mouseleave", function () {
                timer && window.clearTimeout(timer);
                timer = 0
            });
            tag == "a" && c.delegate(tag, "click", function (e) {
                e.preventDefault()
            });
            var d = c.find("." + css[0]);
            if (!d[0]) {
                c.find(tag).eq(0).addClass(css[0])
            }
            c.find(tag).each(function () {
                var a = $($(this).attr(hook)), active = $(this).hasClass(css[0]);
                if (css[1]) {
                    a[active ? "removeClass" : "addClass"](css[1])
                } else {
                    a[active ? "show" : "hide"]()
                }
            })
        })
    };
    (function (d) {
        if (isNaN(new Date("2013-12-09T08:39:15"))) {
            Date.prototype.toJSON = function () {
                var b = function (a) {
                    return ("0" + a).slice(-2)
                };
                return this.getFullYear() + '/' + b(this.getMonth() + 1) + "/" + b(this.getDate()) + " " + b(this.getHours()) + ":" + b(this.getMinutes()) + ":" + b(this.getSeconds())
            }
        }
        if (d.JSON) return;
        var e = {"\b": '\\b', "\t": '\\t', "\n": '\\n', "\f": '\\f', "\r": '\\r', '"': '\\"', "\\": '\\\\'},
            encodeString = function (b) {
                if (/["\\\x00-\x1f]/.test(b)) {
                    b = b.replace(/["\\\x00-\x1f]/g, function (a) {
                        var c = e[a];
                        if (c) {
                            return c
                        }
                        c = a.charCodeAt();
                        return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
                    })
                }
                return '"' + b + '"'
            }, encodeArray = function (a) {
                var b = ["["], l = a.length, preComma, i, item;
                for (i = 0; i < l; i++) {
                    item = a[i];
                    switch (typeof item) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (preComma) {
                                b.push(',')
                            }
                            b.push(encode(item));
                            preComma = 1
                    }
                }
                b.push("]");
                return b.join("")
            }, pad = function (a) {
                return a < 10 ? '0' + a : a
            }, encodeDate = function (a) {
                if (a.toJSON) return '"' + a.toJSON() + '"';
                return '"' + a.getUTCFullYear() + "-" + pad(a.getUTCMonth() + 1) + "-" + pad(a.getUTCDate()) + "T" + pad(a.getUTCHours()) + ":" + pad(a.getUTCMinutes()) + ":" + pad(a.getUTCSeconds()) + '"'
            }, hasOwn = Object.prototype.hasOwnProperty, encodeObj = function (a) {
                var b = ['{'], preComma, item;
                for (var c in a) {
                    if (hasOwn.call(a, c)) {
                        item = a[c];
                        switch (typeof item) {
                            case 'undefined':
                            case 'unknown':
                            case 'function':
                                break;
                            default:
                                preComma && b.push(',');
                                preComma = 1;
                                b.push(encode(c) + ':' + encode(item))
                        }
                    }
                }
                b.push('}');
                return b.join('')
            }, encode = function (a) {
                switch (typeof a) {
                    case 'unknown':
                    case 'function':
                    case 'undefined':
                        return;
                    case 'number':
                        return isFinite(a) ? String(a) : "null";
                    case 'string':
                        return encodeString(a);
                    case 'boolean':
                        return String(a);
                    default:
                        return a === null ? 'null' : a instanceof Array ? encodeArray(a) : a instanceof Date ? encodeDate(a) : encodeObj(a)
                }
            };
        d.JSON = {
            parse: function (a) {
                a = a.replace(/("|')\\?\/Date\((-?[0-9+]+)\)\\?\/\1/g, "new Date($2)");
                return (new Function("return " + a))()
            }, stringify: function (v) {
                return encode(v)
            }
        }
    })(window);
    (function (g) {
        var h, noop = function () {
        }, document = g.document, notSupport = {set: noop, get: noop, remove: noop, clear: noop, each: noop, obj: noop};
        (function () {
            if ("localStorage" in g) {
                try {
                    h = g.localStorage;
                    return
                } catch (e) {
                }
            }
            var o = document.getElementsByTagName("head")[0], hostKey = g.location.hostname || "localStorage",
                d = new Date(), doc, agent;
            if (!o.addBehavior) {
                try {
                    h = g.localStorage
                } catch (e) {
                    h = null
                }
                return
            }
            try {
                agent = new ActiveXObject('htmlfile');
                agent.open();
                agent.write('<s' + 'cript>document.w=window;</s' + 'cript><iframe src="/favicon.ico"></frame>');
                agent.close();
                doc = agent.w.frames[0].document;
                o = doc.createElement('head');
                doc.appendChild(o)
            } catch (e) {
                o = document.getElementsByTagName("head")[0]
            }
            try {
                d.setDate(d.getDate() + 36500);
                o.addBehavior("#default#userData");
                o.expires = d.toUTCString();
                o.load(hostKey);
                o.save(hostKey)
            } catch (e) {
                return
            }
            var c, attrs;
            try {
                c = o.XMLDocument.documentElement;
                attrs = c.attributes
            } catch (e) {
                return
            }
            var f = "p__hack_", spfix = "m-_-c", reg1 = new RegExp("^" + f), reg2 = new RegExp(spfix, "g"),
                encode = function (a) {
                    return encodeURIComponent(f + a).replace(/%/g, spfix)
                }, decode = function (a) {
                    return decodeURIComponent(a.replace(reg2, "%")).replace(reg1, "")
                };
            h = {
                length: attrs.length, isVirtualObject: true, getItem: function (a) {
                    return (attrs.getNamedItem(encode(a)) || {nodeValue: null}).nodeValue || c.getAttribute(encode(a))
                }, setItem: function (a, b) {
                    try {
                        c.setAttribute(encode(a), b);
                        o.save(hostKey);
                        this.length = attrs.length
                    } catch (e) {
                    }
                }, removeItem: function (a) {
                    try {
                        c.removeAttribute(encode(a));
                        o.save(hostKey);
                        this.length = attrs.length
                    } catch (e) {
                    }
                }, clear: function () {
                    while (attrs.length) {
                        this.removeItem(attrs[0].nodeName)
                    }
                    this.length = 0
                }, key: function (i) {
                    return attrs[i] ? decode(attrs[i].nodeName) : undefined
                }
            };
            if (!("localStorage" in g)) g.localStorage = h
        })();
        g.LS = !h ? notSupport : {
            set: function (a, b) {
                if (this.get(a) !== undefined) this.remove(a);
                h.setItem(a, b)
            }, get: function (a) {
                var v = h.getItem(a);
                return v === null ? undefined : v
            }, remove: function (a) {
                h.removeItem(a)
            }, clear: function () {
                h.clear()
            }, each: function (a) {
                var b = this.obj(), fn = a || function () {
                    }, key;
                for (key in b) if (fn.call(this, key, this.get(key)) === false) break
            }, obj: function () {
                var a = {}, i = 0, n, key;
                if (h.isVirtualObject) {
                    a = h.key(-1)
                } else {
                    n = h.length;
                    for (; i < n; i++) {
                        key = h.key(i);
                        a[key] = this.get(key)
                    }
                }
                return a
            }
        };
        if (g.jQuery) g.jQuery.LS = g.LS
    })(window);
    $.hash = function (a, b) {
        if (typeof a === "string" && b === undefined) return $.getHashPara(a);
        var c = window.location.hash.replace(/^#*/, "").split("&"), keys = {}, n = c.length, i = 0, t, HASH = {},
            map = {}, k, para;
        for (; i < n; i++) {
            t = c[i].split("=");
            if (t.length == 2 && t[0].length) {
                para = decodeURIComponent(t[0]);
                k = para.toLowerCase();
                if (!map[k]) {
                    HASH[para] = decodeURIComponent(t[1]);
                    map[k] = para
                }
            }
        }
        if (a === undefined) return HASH;
        if ($.isPlainObject(a)) keys = a; else keys[a] = b;
        for (para in keys) {
            b = keys[para];
            k = para.toLowerCase();
            map[k] && HASH[map[k]] !== undefined && delete HASH[map[k]];
            if (b !== null) {
                map[k] = para;
                HASH[para] = String(b)
            }
        }
        c.length = 0;
        for (para in HASH) c.push(encodeURIComponent(para) + "=" + encodeURIComponent(HASH[para]));
        window.location.hash = "#" + c.join("&")
    };
    $.cookie = function (a, b, c) {
        if (arguments.length > 1 && (b === null || typeof b !== "object")) {
            c = $.extend({}, c);
            if (b === null) {
                c.expires = -1
            }
            if (typeof c.expires === 'number') {
                var d = c.expires, t = c.expires = new Date();
                t.setDate(t.getDate() + d)
            }
            return (document.cookie = [encodeURIComponent(a), '=', c.raw ? String(b) : encodeURIComponent(String(b)), c.expires ? '; expires=' + c.expires.toUTCString() : '', c.path ? '; path=' + c.path : '', c.domain ? '; domain=' + c.domain : '', c.secure ? '; secure' : ''].join(''))
        }
        c = b || {};
        var e, decode = c.raw ? function (s) {
            return s
        } : decodeURIComponent;
        return (e = new RegExp('(?:^|; )' + encodeURIComponent(a) + '=([^;]*)').exec(document.cookie)) ? decode(e[1]) : null
    };
//base.ajax.js
    (function () {
        var m = "163.com", baseReg = /\.163\.com$/i, altDomain = function (a) {
            var d = (a + "").toLowerCase(), i = d.indexOf("http");
            return i < 0 ? baseReg.test(d) ? d : "" : i ? "" : d.replace(/^https?:\/\//, "").replace(/\/.+$/, "")
        }, agentCache = {}, callbackCache = {}, createAgent = function (d, f) {
            var g = altDomain(d), currentHost = window.location.host + "", agent = agentCache[g],
                url = d.replace(/\/$/g, "") + "/agent/ajaxAgentV2.htm", fireCallback = function (b) {
                    var c = callbackCache[g] || [];
                    $.each(c, function (i, a) {
                        a(b)
                    });
                    callbackCache[g] = null
                };
            if (url.indexOf("http") < 0) {
                url = "http://" + url
            }
            if (!g || g == currentHost) {
                fireCallback($);
                f($);
                return
            }
            if (agent) {
                try {
                    agent.__test = +new Date()
                } catch (e) {
                    agentCache[g] = agent = null
                }
            }
            if (agent) {
                fireCallback(agent);
                f(agent);
                return
            }
            if (callbackCache[g]) {
                callbackCache[g].push(f);
                return
            }
            if (!document.body) {
                window.setTimeout(function () {
                    createAgent(d, f)
                }, 1);
                return
            }
            callbackCache[g] = callbackCache[g] || [];
            callbackCache[g].push(f);
            var h = document.createElement("iframe");
            h.src = "about:blank";
            h.width = 0;
            h.height = 0;
            h.setAttribute("frameborder", 0);
            h.scrolling = "no";
            document.body.appendChild(h);
            function tryOnce(b, c) {
                $(h).unbind().bind("load", function () {
                    try {
                        var a = h.contentWindow.jQuery;
                        a.__test = +new Date();
                        fireCallback(a)
                    } catch (e) {
                        c && c()
                    }
                });
                h.src = url + "?domain=" + b + "&v=" + +new Date()
            }

            if (g.indexOf(document.domain) > 0) {
                tryOnce(document.domain = document.domain)
            } else {
                tryOnce(document.domain, function () {
                    if (g.indexOf(document.domain) > 0) {
                        tryOnce(document.domain)
                    } else {
                        tryOnce("")
                    }
                })
            }
        }, parseJSON = function (a) {
            a = a.replace(/("|')\\?\/Date\((-?[0-9+]+)\)\\?\/\1/g, "new Date($2)");
            return (new Function("return " + a))()
        }, httpCache = {}, ajax = function (b, c, d, e, f) {
            var g = window.location.host + "", domain = altDomain(c) || g, protocol = "http:", port = "80", fn;
            if (/^(https?:)/i.test(c)) {
                protocol = RegExp.$1.toLowerCase();
                if (/:(\d+)/i.test(c)) port = RegExp.$1 || "80"
            } else {
                protocol = window.location.protocol;
                port = window.location.port || "80"
            }
            if (window.location.protocol != protocol || (window.location.port || "80") != port) {
                fn = $.isFunction(e) ? e : $.isFunction(d) ? d : $.noop;
                fn.call(window.Core || window, 2, "", "protocols or ports not match");
                return
            }
            if (baseReg.test(domain) && baseReg.test(g) && domain.indexOf(document.domain) >= 0 && protocol == "http:") {
                createAgent(domain, function (a) {
                    ajaxCore(a, b, c, d, e, f)
                })
            } else {
                ajaxCore(jQuery, b, c.replace(/https?:\/\/[^\/]+/, ""), d, e, f)
            }
        }, callbackCache = {}, ajaxCore = function (d, f, g, h, i, k) {
            var l = $.isFunction(i) ? i : $.noop, URL = g, xhr, state, lib = window.Core || window, noCache = false,
                cachePara = (URL.indexOf("?") + 1 ? "&" : "?") + "cache=" + (+new Date()), typeInfo, retType;
            if ($.isFunction(h)) {
                l = h;
                h = null;
                k = i
            }
            if (k && k.indexOf("*") == 0) {
                noCache = true;
                k = k.substr(1)
            }
            if (k) {
                if (k.indexOf("!") === 0) {
                    k = k.substr(1);
                    if (callbackCache[k]) {
                        callbackCache[k].push(l);
                        return
                    }
                    callbackCache[k] = [];
                    i = l;
                    l = function () {
                        var b = arguments, owner = this;
                        i.apply(owner, b);
                        $.each(callbackCache[k], function (j, a) {
                            a.apply(owner, b)
                        });
                        delete callbackCache[k]
                    }
                }
                xhr = httpCache[k];
                if (xhr) {
                    if (k.indexOf("@") !== 0) {
                        return
                    }
                    state = xhr.readyState;
                    if (state > 0 && state < 5) {
                        try {
                            xhr.aborted = true
                        } catch (e) {
                        }
                        xhr.abort()
                    }
                }
            }
            typeInfo = f.split(".");
            retType = typeInfo.length > 1 ? typeInfo[1] : "";
            xhr = d.ajax({
                url: URL + (noCache ? "" : cachePara),
                type: typeInfo[0],
                data: h,
                success: function (a, b, c) {
                    delete httpCache[k];
                    if (c.aborted)return;
                    a = c.responseText;
                    if (a == undefined || a == null || a == "" || a.indexOf("<!DOCTYPE") >= 0) {
                        l.call(lib, 1, a, b);
                        return
                    }
                    if (retType == "JSON") {
                        try {
                            a = parseJSON(a)
                        } catch (e) {
                            l.call(lib, 3, c.responseText, b);
                            return
                        }
                    }
                    l.call(lib, 0, a, b)
                },
                error: function (a, b) {
                    delete httpCache[k];
                    if (!b || b == "error") {
                        l.call(lib, 1, "", b);
                        return
                    }
                    if (a.aborted)return;
                    l.call(lib, 1, a.responseText, b)
                }
            });
            k && (httpCache[k] = xhr)
        };
        $.extend({
            get2: function (a, b, c, d) {
                ajax("GET", a, b, c, d);
                return this
            }, post2: function (a, b, c, d) {
                ajax("POST", a, b, c, d);
                return this
            }, getJSON2: function (a, b, c, d) {
                ajax("GET.JSON", a, b, c, d);
                return this
            }, postJSON2: function (a, b, c, d) {
                ajax("POST.JSON", a, b, c, d);
                return this
            }
        })
    })();
//base.core.js
    $.bindModule = function (h, j, k) {
        if (typeof j != "object") {
            k = j;
            j = h;
            h = 0
        }
        var l = h || this;
        $.each(j || {}, function (f, g) {
            g && g.js && $.each(f.split(" "), function (i, c) {
                if (l[c])return;
                var d = [], paras = [];
                var e = l[c] = function () {
                    var a = arguments;
                    d.push(this);
                    paras.push(a);
                    if (e.autoLoaded == 1)return;
                    e.autoLoaded = 1;
                    var b = window.setTimeout(function () {
                        e.autoLoaded = 0
                    }, 1000);
                    g.css && $.loadCss(g.css, k);
                    $.loadJS(g.js, function () {
                        b && window.clearTimeout(b);
                        if (l[c] === e) {
                            window.console && window.console.log("方法" + c + "在" + g.js + "中未被定义！自动加载模块处理失败！");
                            l[c] = $.noop;
                            return
                        }
                        for (var n = paras.length, i = 0; i < n; i++)l[c].apply(d[i], paras[i]);
                        paras.length = 0
                    }, k)
                }
            })
        });
        return this
    };
    (function () {
        var j = {}, load = function (b, c, d, e, f) {
            var g = c.toLowerCase().replace(/#.*$/, "").replace("/\?.*$/", ""), tag, head, isFunc = $.isFunction,
                cache = j[g] || [], userChk = !!(d || $.noop)(c), GC = window.CollectGarbage || $.noop;
            if (userChk) {
                isFunc(e) && e();
                return
            }
            j[g] = cache;
            if (!cache || !cache.loaded || (d && !userChk)) {
                isFunc(e) && cache.push(e);
                cache.loaded = 1;
                tag = document.createElement(b), head = document.getElementsByTagName("head")[0] || document.documentElement;
                c = c + (c.indexOf("?") >= 0 ? "&" : "?") + (window.Core ? Core.version : +new Date());
                if (b == "link") {
                    tag.rel = "stylesheet";
                    tag.type = "text/css";
                    tag.media = "screen";
                    tag.charset = f || "UTF-8";
                    tag.href = c
                } else {
                    tag.type = "text/javascript";
                    tag.charset = f || "UTF-8";
                    var h = false;
                    tag.onload = tag.onreadystatechange = function () {
                        if (!h && (!this.readyState || {loaded: 1, complete: 1}[this.readyState])) {
                            h = true;
                            tag.onload = tag.onreadystatechange = null;
                            this.parentNode.removeChild(this);
                            var a = j[g], n = a.length, i = 0;
                            a.loaded = 2;
                            for (; i < n; i++)isFunc(a[i]) && a[i]();
                            a.length = 0;
                            a = head = tag = null;
                            GC()
                        }
                    };
                    tag.src = c
                }
                head.appendChild(tag, head.lastChild)
            } else if (cache.loaded == 2) {
                isFunc(e) && e();
                cache = null;
                GC()
            } else {
                isFunc(e) && cache.push(e);
                cache = null;
                GC()
            }
        }, fixURL = function (a, b) {
            if (!b)return a;
            return /^http/i.test(a) ? a : (b.replace(/\/*$/, "") + (a.indexOf("/") == 0 ? "" : "/") + a)
        };
        $.extend({
            loadJS: function (b, c, d, e, f) {
                if (!$.isFunction(d)) {
                    f = e;
                    e = d;
                    d = c;
                    c = null
                }
                if (!$.isFunction(d)) {
                    f = e;
                    e = d;
                    d = null
                }
                if (/^http/i.test(e)) {
                    f = e;
                    e = ""
                }
                if ($.isArray(b)) {
                    var N = b.length, loadNo = function (a) {
                        if (a < N) {
                            load("script", fixURL(b[a], f), c, function () {
                                loadNo(a + 1)
                            }, e)
                        } else {
                            $.isFunction(d) && d()
                        }
                    };
                    loadNo(0)
                } else load("script", fixURL(b, f), c, d, e);
                return this
            }, loadCss: function (a, b) {
                if ($.isArray(a)) {
                    var N = a.length, i = 0;
                    for (; i < N; i++)load("link", fixURL(a[i], b))
                } else load("link", fixURL(a, b));
                return this
            }
        })
    })();
//base.class.js
    function Class() {
    }

    (function (g) {
        if (g.Class !== Class) {
            g.Class = Class
        }
        function noop() {
        }

        Class.prototype.log = Class.prototype.warn = noop;
        if (g.console) {
            Class.prototype.log = function () {
                console.log && console.log.apply(console, arguments)
            };
            Class.prototype.warn = function () {
                console.warn && console.warn.apply(console, arguments)
            }
        }
        var h = Class.prototype.warn;
        Class.prototype.callSuper = function () {
            h("父类没有同名方法，不能调用callSuper！")
        };
        Class.extend = function extend(a, b) {
            var c, checkResult, superPrototype = this.prototype;
            if (!b) {
                b = a;
                a = ""
            }
            if (typeof b !== "object" || !b.hasOwnProperty) {
                h("继承类的原型数据错误！");
                return
            }
            var d = checkNameSpace(a);
            if (!d)return;
            c = new this();
            for (var e in b) {
                if (b.hasOwnProperty(e)) {
                    if (typeof b[e] == "function" && typeof superPrototype[e] == "function") {
                        var f = superPrototype[e];
                        if (!f.__isAgent) {
                            f = getAgentFn(getWarnFn(e + "方法被子类覆盖，但是父类没有同名函数，不能调用callSuper!"), superPrototype[e])
                        }
                        c[e] = getAgentFn(f, b[e])
                    } else {
                        c[e] = b[e]
                    }
                }
            }
            function subClass() {
            }

            subClass.prototype = c;
            subClass.prototype.constructor = subClass;
            subClass.extend = extend;
            subClass.create = create;
            d(subClass);
            return subClass
        };
        function create() {
            var a = new this();
            if (a.init) {
                a.init.apply(a, arguments)
            }
            return a
        }

        function checkNameSpace(b) {
            if (!b) {
                return noop
            }
            if (!/^(?:Base|Tools|Widgets|Game|Page)\./.test(b)) {
                return h("Class命名空间错误，一级命名空间只能是:Base、Tools、Widgets、Game、Page")
            }
            var c = b.split("."), n = c.length, i = 0, path = Class, name;
            for (; i < n - 1; i++) {
                name = c[i];
                path = path[name] = path[name] || {}
            }
            name = c[n - 1];
            if (path[name]) {
                return h("已经有同名Class存在，请更换名称或路径！")
            }
            return function (a) {
                path[name] = a
            }
        }

        function getAgentFn(b, c) {
            var d = function () {
                var a = this.hasOwnProperty("callSuper"), tmp = this.callSuper, ret;
                this.callSuper = b;
                ret = c.apply(this, arguments);
                if (!a) {
                    delete this.callSuper
                } else {
                    this.callSuper = tmp
                }
                return ret
            };
            d.__isAgent = true;
            return d
        }

        function getWarnFn(a) {
            return function () {
                h(a)
            }
        }
    })(window);
    (function (f) {
        var g = Array.prototype.slice, toString = Object.prototype.toString, noop = function () {
        }, MUID = 1, isFunction = function (a) {
            return toString.call(a) == "[object Function]"
        };
        var h = f.extend({
            init: function () {
                this.eventCache = this.eventCache || {}
            }, createEvent: function (c, d) {
                if (typeof c !== "string") {
                    return
                }
                var e = this, cache = e.eventCache;
                $.each(c.split(" "), function (i, b) {
                    cache[b] = cache[b] || [];
                    d && (e[b] = function (a) {
                        if (isFunction(a)) {
                            e.bind(b, a);
                            return this
                        } else {
                            return e.trigger.apply(e, [b].concat(g.call(arguments, 0)))
                        }
                    })
                })
            }, trigger: function (b, c) {
                var d, falseNum = 0, com = this, para = g.call(arguments, 1);
                if (!isNaN(b) && b && +b > 0) {
                    if (typeof c !== "string")return 1;
                    d = this.eventCache[c || ""];
                    if (!d)return 2;
                    if (!d.length)return 0;
                    d.paras = para;
                    if (!d.t) {
                        d.t = window.setTimeout(function () {
                            delete d.t;
                            com.trigger.apply(com, d.paras)
                        }, parseInt(b, 10) || 200)
                    }
                    return 0
                }
                if (typeof b === "number" && (isNaN(b) || b < 0)) {
                    if (typeof(c) !== "string")return 1;
                    d = this.eventCache[c || ""];
                    if (d) {
                        this.warn("事件" + c + "设置的缓冲保护时间不是合法数字")
                    }
                } else {
                    if (typeof(b || c) !== "string")return 1;
                    d = this.eventCache[b || c || ""]
                }
                if (!d)return 2;
                $.each(d.slice(0), function (i, a) {
                    try {
                        if (a.apply(com, para) === false) {
                            falseNum++
                        }
                    } catch (e) {
                        com.log(e);
                        return
                    }
                });
                return falseNum ? false : 0
            }, bind: function (a, b) {
                if (typeof a !== "string")return 1;
                var c = this.eventCache[a];
                if (!c)return 2;
                if (!isFunction(b))return 3;
                b.muid = b.muid || MUID++;
                c.push(b);
                return 0
            }, unbind: function (a, b) {
                if (arguments.length === 0) {
                    this.eventCache = {};
                    return 0
                }
                if (typeof a !== "string")return 1;
                var c = this.eventCache[a || ""];
                if (!c)return 2;
                if (b === undefined) {
                    c.length = 0;
                    return this
                }
                if (!isFunction(b))return 3;
                for (var i = 0; i < c.length; i++) {
                    if (c[i] === b || (b.muid && c[i].muid === b.muid)) {
                        c.splice(i, 1);
                        i--
                    }
                }
                return 0
            }, bindOnce: function (b, c) {
                if (typeof b !== "string")return 1;
                var d = this.eventCache[b], com = this;
                if (!d)return 2;
                if (!isFunction(c))return 3;
                var e = function () {
                    var a = c.apply(this, arguments);
                    com.unbind(b, e);
                    return a
                };
                e.muid = c.muid = (c.muid || MUID++);
                return com.bind(b, e)
            }
        });
        f.extend("Base.Message", {
            init: function () {
                this.__agent = this.__agent || h.create()
            }, bindMsg: function (a, b, c, d) {
                if (!a || !isFunction(b)) {
                    return this
                }
                this.__agent.createEvent(a);
                var e = c ? function () {
                    return b.apply(c, arguments)
                } : function () {
                    return b.apply(window, arguments)
                };
                e.muid = b.muid;
                this.__agent[d ? "bindOnce" : "bind"](a, e);
                b.muid = e.muid;
                return this
            }, bindMsgOnce: function (a, b, c) {
                return this.bindMsg(a, b, c, 1)
            }, unbindMsg: function (a) {
                if (!a) {
                    return this
                }
                this.__agent.unbind.apply(this.__agent, arguments);
                return this
            }, sendMsg: function (a) {
                this.__agent.trigger.apply(this.__agent, arguments);
                return this
            }
        });
        (function ($, b) {
            var c = f.Base.Message.create();
            $.each(["bindMsg", "bindMsgOnce", "unbindMsg", "sendMsg"], function (i, a) {
                b[a] = $[a] = function () {
                    c[a].apply(c, arguments);
                    return this
                }
            })
        })(window.jQuery || window.Zepto, window.Zepto || window);
        h.extend("Base.Event", {
            init: function (a) {
                this.callSuper();
                this.createEvent(a, true);
                this.createEvent = noop
            }, trigger: function (a) {
                var b = this.callSuper.apply(this, arguments);
                if (b && !isNaN(b)) {
                    this.warn(["trigger事件名称必须是字符串", "未注册的事件(" + a + ")不能trigger"][b - 1])
                }
                if (b === false) {
                    return false
                }
            }, bind: function (a) {
                var b = this.callSuper.apply(this, arguments);
                if (b) {
                    this.warn(["bind事件名称必须是字符串", "未注册的事件(" + a + ")不能bind", "bind(" + a + ")注册事件必须是函数"][b - 1])
                }
                return this
            }, unbind: function (a) {
                if (!a) {
                    this.warn("暂不支持全部事件一次性卸载");
                    return this
                }
                this.callSuper.apply(this, arguments);
                return this
            }, bindOnce: function (a) {
                var b = this.callSuper.apply(this, arguments);
                if (b) {
                    this.warn(["bindOnce事件名称必须是字符串", "未注册的事件(" + a + ")不能bindOnce", "bindOnce(" + a + ")注册事件必须是函数"][b - 1])
                }
                return this
            }
        })
    })(window.Class);
})(window, jQuery);

//login: https://git.ms.netease.com/pj/login#v2.1.5
!function ($) {
    if (!$)return void(window.console && console.log("need jquery."));
    var startAct = function () {
        var URS = window.URS, globalMsg = $;
        $.sendMsg = $.sendMsg || $.noop;
        var cookie = $.cookie, login = function () {
            "use strict";
            function e(e) {
                var n = new RegExp("(?:^|; )" + encodeURIComponent(e) + "=([^;]*)"), t = n.exec(document.cookie);
                return t ? decodeURIComponent(t[1]) : ""
            }

            var n = {
                    product: "urs",
                    promark: "zCqdWsL",
                    host: "dl.reg.163.com",
                    isHttps: location.protocol.indexOf("https:") + 1,
                    skin: 1,
                    page: "login",
                    placeholder: {account: "邮箱帐号或手机号", pwd: "密码"},
                    needUnLogin: 1,
                    defaultUnLogin: 1,
                    needQrLogin: 0,
                    needPrepare: 0,
                    needanimation: 1,
                    single: 0,
                    notFastReg: 0,
                    oauthLogin: ["qq", "weixin"],
                    frameSize: {width: 420, height: 480},
                    errMsg: ""
                }, t = {
                    fillUrl: function (e) {
                        if ("string" != typeof e || !e || /^(?:http|javascript)/i.test(e))return e;
                        if (/^#/.test(e))return document.URL.replace(/#.*$/, "") + e;
                        if (/^\//.test(e)) {
                            var n = ":" + (window.location.port || "80");
                            return window.location.protocol + "//" + window.location.host + (":80" === n ? "" : n) + e
                        }
                        return document.URL.replace(/\/[^\/]*$/g, "/") + e
                    },
                    checkOptions: function (e, o, i) {
                        var a = $.extend(!0, {}, n);
                        "string" == typeof e && $.extend(a, o || {}, {successUrl: e}), $.isFunction(e) && $.extend(a, $.isFunction(o) ? {cancel: o} : o || {}, {callback: e}), "object" != typeof e || $.isArray(e) || $.extend(a, e || {}), a.successUrl = t.fillUrl(a.successUrl);
                        var c = a.successUrl || document.URL;
                        return i === !0 ? a : (a.oauthLoginConfig = function (e) {
                            var n = ["qq", "weixin", "yixin", "weibo"], t = {wuba: 10, qihu: 5, alipay: 101};
                            return delete a.oauthLogin, $.map(e, function (e) {
                                var o;
                                return $.inArray(e, n) >= 0 ? {name: e} : (o = t[e]) ? {
                                    name: e,
                                    url: "http://reg.163.com/outerLogin/oauth2/connect.do?target=" + o + "&product=" + a.product
                                } : void 0
                            })
                        }(a.oauthLogin), a.cssFiles = function (e, n) {
                            return a.cssDomain ? e ? n ? e + "," + n : e : n : ""
                        }(a.baseCssFiles, a.cssFiles), a.callback = function (e, n) {
                            return function (t, o) {
                                if ("giveup" === o) $.isFunction(n) && n(); else {
                                    if ($.isFunction(e))return void e(t, o);
                                    globalMsg.sendMsg("login.jump", t), document.URL.replace(/#.+$/g, "") === c.replace(/#.+$/g, "") ? window.location.reload(!0) : window.location.href = c
                                }
                            }
                        }(a.callback, a.cancel), delete a.successUrl, delete a.cancel, a)
                    },
                    uninIdReg: {
                        qq: /@tencent\.163\.com$/,
                        weixin: /@wx\.163\.com$/,
                        yixin: /@yixin\.163\.com$/,
                        weibo: /@sina\.163\.com$/,
                        alipay: /@alipay\.163\.com$/,
                        qihu: /@qh\.163\.com$/,
                        wuba: /@58\.163\.com$/
                    },
                    getSite: function (e) {
                        var n = e + "";
                        for (var o in t.uninIdReg)if (t.uninIdReg[o].test(n))return o
                    },
                    cookie: {
                        getSInfo: function () {
                            var n = "P_INFO" === this.getPInfo(!0) ? "S_INFO" : "S_OINFO", t = e(n);
                            return t.split("|").length > 1 ? t : ""
                        }, getPInfo: function (n) {
                            var o = e("S_OINFO") ? "P_OINFO" : "P_INFO";
                            if (n)return o;
                            var i = e(o).replace(/\"|\'/g, ""), a = i.split("|");
                            if (a.length > 1 && /^.+@.+$/.test(a[0])) {
                                var c = a[a.length - 1];
                                return {
                                    site: t.getSite(a[0]) || "163",
                                    base: a[0],
                                    alias: /^1\d{10}@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(c) ? c : a[0]
                                }
                            }
                            return {}
                        }
                    }
                }, o = {getNickName: null, getURSId: null, isLogin: null, onLogin: null, ursInit: null}, i = {},
                a = function (e, n, a) {
                    return function () {
                        if (!i[a]) {
                            i[a] = !0, window.setTimeout(function () {
                                i[a] = null
                            }, 100);
                            var c = this, r = Array.prototype.slice.call(arguments, 0), s = function () {
                                n.apply(c, r)
                            };
                            e && o[e] ? o[e](t.cookie.getPInfo(), s) : s()
                        }
                    }
                }, c = function (e, n) {
                    var i = t.checkOptions(e, n), r = function (e, n) {
                        e.showIframe(n), $(document).unbind("keydown", c.close), $(document).keydown(c.close);
                        var t = $("#x-panel").css("z-index", 20020), i = $("#x-discover").css("z-index", 20001);
                        o.ursInit && o.ursInit(t, i)
                    };
                    if (t.urs)return t._callback = i.callback, void r(t.urs, i);
                    var s = new URS(i);
                    t._callback = i.callback, t.urs = s, s.logincb = a("onLogin", function (e) {
                        t.ursId = e, t._callback(e, "login"), globalMsg.sendMsg("login.success", e), globalMsg.sendMsg("login.change")
                    }, "logincb"), s.regcb = a("onLogin", function (e) {
                        t.ursId = e, t._callback(e, "reg"), globalMsg.sendMsg("reg.success", e), globalMsg.sendMsg("login.success", e), globalMsg.sendMsg("login.change")
                    }, "regcb"), s.closecb = a(null, function () {
                        setTimeout(function () {
                            globalMsg.sendMsg("login.giveup"), globalMsg.sendMsg("reg.giveup"), t._callback("", "giveup")
                        }, 100)
                    }, "closecb"), r(s)
                };
            return t.ursId = t.cookie.getSInfo() ? t.cookie.getPInfo().base || "" : "", $.extend(c, {
                setDefaultConf: function (e) {
                    $.extend(n, e || {})
                }, hook: function (e, n) {
                    var t = {};
                    "string" != typeof e || !$.isFunction(n) && null !== n || (t[e] = n), "object" != typeof e || $.isArray(e) || $.extend(t, e || {});
                    for (var i in o)$.isFunction(t[i]) && (o[i] = t[i])
                }, setURSId: function (e) {
                    t.ursId !== e && (e ? a("onLogin", function () {
                        t.ursId = e, globalMsg.sendMsg("login.success", e), globalMsg.sendMsg("login.change")
                    }, "setId")() : (t.ursId = e, globalMsg.sendMsg("login.off"), globalMsg.sendMsg("login.change")))
                }, getNickName: function () {
                    var e = t.cookie.getPInfo(), n = this.getURSId();
                    e.base !== n && (e.base = e.alias = n, e.site = t.getSite(n) || "163");
                    var i = o.getNickName ? o.getNickName(e) : e.alias;
                    return i || ""
                }, getURSId: function () {
                    var e = t.ursId;
                    return o.getURSId ? o.getURSId(e, t.cookie.getSInfo(), t.cookie.getPInfo()) : e
                }, getSite: function (e) {
                    return t.getSite(e || this.getURSId()) || "163"
                }, isLogin: function () {
                    var e = t.ursId;
                    return !!(o.isLogin ? o.isLogin(e, t.cookie.getSInfo(), t.cookie.getPInfo()) : e)
                }, close: function (e) {
                    e && void 0 !== e.keyCode && 27 !== e.keyCode || t.urs && $("#x-panel")[0] && t.urs.closeIframe()
                }, reg: function (e, n) {
                    var o = t.checkOptions(e, n, !0);
                    o.page = "register", c(o)
                }
            }), c.getAccount = c.getNickName, c
        }();
        login.drag = function () {
            var options = {top: 25, width: "90%", height: 70, miniShow: 80},
                isIE6789 = navigator.userAgent.indexOf("MSIE 9") > 0 || eval('"\\v"=="v"'), hookFn = function (e, n) {
                    if ($ && $.fn && $.fn.bindDrag && e && e[0]) {
                        var t = $("<div>").css({
                            position: "absolute",
                            top: isIE6789 ? 0 : options.top,
                            left: 0,
                            width: options.width,
                            height: options.height,
                            opacity: 0,
                            filter: "alpha(opacity=0)",
                            backgroud: "#000",
                            zIndex: 102
                        }), o = $("<div>").css({
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            filter: "alpha(opacity=0)",
                            zIndex: 101
                        }).hide();
                        e.prepend(o), e.prepend(t);
                        var i, a, c, r = "fixed" == e.css("position").toLowerCase(), s = r ? function (e) {
                            return {left: e[0].offsetLeft, top: e[0].offsetTop}
                        } : function (e) {
                            return e.offset()
                        };
                        t.css("cursor", "move").bindDrag({
                            dragStart: function (n) {
                                i = s(e), a = [n.pageX, n.pageY], c = {
                                    marginLeft: e.css("marginLeft"),
                                    marginTop: e.css("marginTop")
                                }, e.css({
                                    marginLeft: "",
                                    marginTop: "",
                                    left: i.left,
                                    top: i.top,
                                    right: "",
                                    bottom: ""
                                }), o.show()
                            }, onDrag: function (n) {
                                e.css({left: i.left + n.pageX - a[0], top: i.top + n.pageY - a[1]})
                            }, dragEnd: function () {
                                var n = s(e), t = $(window), i = [t.width(), t.height()], a = [e.width(), e.height()],
                                    l = r ? [0, 0] : [t.scrollTop(), t.scrollLeft()], g = {}, u = function () {
                                        g.left -= +(c.marginLeft.replace(/[^\d\-\.]/g, "") || 0), g.top -= +(c.marginTop.replace(/[^\d\-\.]/g, "") || 0), e.css(c).css(g)
                                    };
                                g.top = Math.max(l[0] - options.top + 5, Math.min(n.top, i[1] - (options.miniShow + options.top) + l[0])), g.left = Math.min(i[0] - options.miniShow + l[1], Math.max(n.left, options.miniShow - a[0] + l[1])), g.top != n.top || g.left != n.left ? e.animate(g, 200, u) : u(), o.hide()
                            }
                        })
                    }
                };
            return {
                hookFn: hookFn, init: function (e, n) {
                    var t = e || {};
                    $.each(["top", "height", "miniShow"], function (e) {
                        var n = t[e];
                        isNaN(n) ? void 0 !== n && delete t[e] : t[e] = parseInt(n, 10)
                    }), $.extend(options, t), n || login.hook("ursInit", hookFn)
                }
            }
        }(), $.login = login
    };
    if ($(document).ready(function () {
            !function (name, conf) {
                var isLowerIE = eval('"\\v"=="v"');
                if (!isLowerIE) {
                    var make = function (e, n) {
                            var t, o = [];
                            for (var i in conf)t = (conf[i] + "").split(","), o.push([i, "%{", t.length > 1 ? "opacity:" + t[1] + ";" : "", n + ":scale(", t[0], ");", "}"].join(""));
                            return "@" + e + " " + name + "{" + o.join("") + "}"
                        }, aniStyle = make("-webkit-keyframes", "-webkit-transform") + make("keyframes", "transform"),
                        style = document.createElement("style"),
                        head = document.head || document.getElementsByTagName("head")[0],
                        textNode = document.createTextNode(aniStyle);
                    head.appendChild(style), style.type = "text/css", style.appendChild(textNode)
                }
            }("loginPopAni", {0: "0,0", 15: .667, 25: .867, 40: 1, 55: 1.05, 70: 1.08, 85: "1.05,1", 100: "1,1"})
        }), window.URS)return $.loginReady = function (e) {
        e && e()
    }, startAct();
    var URSJS = "//webzj.reg.163.com/webapp/javascript/message.js?" + function (e) {
            return [e.getFullYear(), e.getMonth() + 1, e.getDate(), parseInt(e.getHours() / 6)].join("_")
        }(new Date), getHolderFn = function () {
        var e = {}, n = function (n) {
            return e[n] = e[n] || [], function () {
                e[n].push(Array.prototype.slice.call(arguments, 0))
            }
        };
        return n.clearKey = function (n, t, o) {
            $.each(e[n], function (e, n) {
                t.apply(o, n)
            }), delete e[n]
        }, n
    }();
    $.login = getHolderFn("a"), $.login.reg = getHolderFn("b"), $.login.hook = getHolderFn("c"), $.login.setDefaultConf = getHolderFn("d");
    var readyCache = [];
    $.loginReady = function (e) {
        e && readyCache ? readyCache.push(e) : e && e()
    }, function (e, n) {
        var t = document.getElementsByTagName("head")[0] || document.documentElement || document.body,
            o = document.createElement("script");
        o.type = "text/javascript", o.charset = "UTF-8";
        var i = !1;
        o.onload = o.onreadystatechange = function () {
            i || this.readyState && !{
                loaded: 1,
                complete: 1
            }[this.readyState] || (i = !0, o.onload = o.onreadystatechange = null, this.parentNode.removeChild(this), n && n(), t = o = null)
        }, o.src = e, t.appendChild(o, t.lastChild)
    }(URSJS, function () {
        startAct(), getHolderFn.clearKey("d", $.login.setDefaultConf, $.login), getHolderFn.clearKey("c", $.login.hook, $.login), getHolderFn.clearKey("b", $.login.reg, $.login), getHolderFn.clearKey("a", $.login, $), $.each(readyCache || [], function (e, n) {
            n()
        }), readyCache = null
    })
}(window.jQuery);
(function (factory) {
    var $ = window.jQuery;
    //登录默认值修改
    $.login.setDefaultConf({
        //【必须】使用的产品ID，如urs
        product: 'movie',
        //【必须】【申请】申请的组件ID，被分派ID
        promark: 'YdMMgFT',
        //【必须】所在的域名
        host: 'piao.163.com',
        productkey: '0ee927fea8dd5b56f0a87e9a0084aec1',
        oauthLogin: [],
        needUnLogin: 0,
        cssDomain: "http://pimg1.126.net/movie/css/",
        cssFiles: "ursLogin.css",
        frameSize: {
            'width': 480,
            'height': 510
        }
    });
    $.loginReady(function () {
        factory(window, $, $.login);
        //设置拖动
        $.login.drag.init({
            height: 80,
            miniShow: 100
        });
    });
})(function (window, $, login, undefined) {
    //映射全局变量
    var document = window.document,
        uri = encodeURIComponent,
        currentUrl = document.URL,
        log = window.console ? function (t) {
            console.log(t);
        } : function () {
        };

    if (!$ || !login || !$.format || !$.safeHTML) {
        log("easyNav依赖的模块尚未加载!");
        return;
    }
    //默认配置
    var defaultConf = {
            //产品名称、标识、首页地址，会共享给登录组件
            appName: "",
            appId: "",
            home: window.location.protocol + "//" + window.location.host,

            //注册地址，会共享给登录组件
            //regUrl: "http://reg.163.com/reg/mobileAliasReg.do?product={appId}&url=" + uri(currentUrl) + "&loginurl=" + uri(currentUrl),

            //登录、退出登录地址
            loginUrl: "javascript:easyNav.login()",
            logoutUrl: "http://reg.163.com/Logout.jsp?username={username}&url=" + uri(currentUrl),

            //各种文案提示，支持占位符
            welcomeUser: "{time}好，{nameHolder}<span id='mailInfoHolder'></span>，欢迎来到{appName}！{logoutLink}",
            welcomeGuest: "欢迎来到{appName}！{loginLink} {regLink}",
            logoutTxt: "安全退出",
            loginTxt: "请登录",
            regUrl: "javascript:easyNav.reg()",
            regTxt: "立即注册&gt;&gt;",

            //产品入口配置
            //如果设置为 null或false，则不显示产品入口，即nameHolder的位置
            //如果设置为 true 则强制显示产品入口
            //如果设置为空，则自动根据当前登录的站点类型显示（获取登录组件的nickName，并仅仅在网易通行证登录的时候显示产品入口）
            //支持函数配置，接受 siteName 参数
            funcEntry: true,

            //邮箱信息提示配置
            mailInfoConf: {
                infoTmpl: "( {0})",
                holderId: "mailInfoHolder"
            }
        },
        //网易产品入口配置
        Netease = {
            mails: {
                "163.com": "http://entry.mail.163.com/coremail/fcg/ntesdoor2?verifycookie=1&lightweight=1",
                "126.com": "http://entry.mail.126.com/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1",
                "yeah.net": "http://entry.yeah.net/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1",
                "188.com": "http://reg.mail.188.com/servlet/enter",
                "vip.163.com": "http://reg.vip.163.com/enterMail.m?enterVip=true",
                "vip.126.com": "http://reg.vip.126.com/enterMail.m"
            },
            entrys: [{
                text: "进入我的邮箱帐号",
                url: "http://reg.163.com/Main.jsp?username={ursId}"
            },
                function (data) {
                    if (!data || !data.username || data.username.indexOf("@") < 0) {
                        return;
                    }
                    var mailType = data.username.split("@")[1],
                        url = Netease.mails[mailType];
                    if (!mailType) {
                        return;
                    }
                    return {
                        text: "进入我的邮箱",
                        url: url
                    };
                }, {
                    text: "进入我的网易宝",
                    url: "http://epay.163.com/index.jsp#from=jsdh"
                }, {
                    text: "进入我的贵金属",
                    url: "http://fa.163.com/#from=jsdh"
                }, {
                    text: "进入我的彩票",
                    url: "http://piao.163.com/#from=jsdh"
                }, {
                    text: "进入我的车险",
                    url: "http://baoxian.163.com/car/#from=jsdh"
                }, {
                    text: "进入我的博客",
                    url: "http://blog.163.com/passportIn.do?entry={from}"
                }, {
                    text: "进入我的海购",
                    url: "http://dwz.cn/2c8tit"
                }
            ]
        },

        //对外的接口
        easyNav = {
            //初始化easyNav工具条
            init: function (config, wrap) {
                //必须初始化提供appName/appId两个个基础配置
                if (!config || !config.appName || !config.appId) {
                    log("easyNav配置错误：初始化缺少appName和appId.");
                    return;
                }
                //再设置nav组件
                _Nav.setWrap(wrap);
                this.setConf(config);
            },

            //修改配置，调用后会立即更新dom节点
            setConf: function (config) {
                _Nav.checkOptions(config);
                this.repaint();
            },

            //重绘nav条
            repaint: function () {
                if (!_Nav.wrap) {
                    return;
                }
                _Nav.wrap.empty().html(_Nav.getHTML());
                //绑定事件
                var entryList = $("#user163Box")[0];
                if (entryList) {
                    easyNav.bindDropMenu(entryList, $("#user163List")[0], "mouseover", "user163BoxActive", $.noop, 200);
                }
                //加载邮件信息
                var mailInfoBox = $("#" + _Nav.options.mailInfoConf.holderId);
                if (mailInfoBox[0]) {
                    window.mailInfoConf = _Nav.options.mailInfoConf;
                    $.getScript("http://pimg1.126.net/movie/js2/popularize/mail.js?2014");
                }
            },

            //登录接口代理
            login: login,
            login2: function (callback, options) {
                return login(callback || $.noop, options);
            },

            //注册
            reg: function () {
                login.reg();
            },

            //判断是否登录，前端判断不太靠谱，请在非关键流程中使用
            isLogin: function () {
                return login.isLogin();
            },

            //无刷新登录事件绑定，如果不传递参数，则重新检查登录
            //业务逻辑保持跟旧版类似
            onLogin: function (fn) {
                if ($.isFunction(fn)) {
                    $.bindMsg("login.success", fn);
                }
                if (login.isLogin()) { //如果已登录，则触发 fn
                    fn(login.getURSId());
                }
                //更新状态栏
                easyNav.repaint();
            },

            //工具方法：绑定下拉菜单
            bindDropMenu: function (holder, list, method, activeCss, clickFn, delay, activeCallback, disableCallback) {
                var fn = clickFn || $.noop,
                    timer,
                    holderEvt = {
                        mouseout: function (e) {
                            var rel = e.relatedTarget || e.toElement;
                            if (rel !== this && !$.contains(this, rel) && rel !== list && !$.contains(list, rel)) {
                                if (!listIsSub) list.style.display = "none";
                                $(holder).removeClass(activeCss);
                                disableCallback && disableCallback();
                            }
                            timer && window.clearTimeout(timer);
                        }
                    },
                    //如果list在holder内，则通过样式控制其显示和隐藏
                    listIsSub = $.contains(holder, list);
                //添加holder事件监听
                holderEvt[method || "click"] = function (e) {
                    if (delay && (method || "").indexOf("mouse") >= 0) {
                        var me = this;
                        timer && window.clearTimeout(timer);
                        timer = window.setTimeout(function () {
                            timer = 0;
                            if (!listIsSub) list.style.display = "block";
                            $(me).addClass(activeCss);
                            activeCallback && activeCallback(e);
                        }, delay);
                    } else {
                        if (!listIsSub) list.style.display = "block";
                        $(this).addClass(activeCss);
                        activeCallback && activeCallback(e);
                    }
                    //如果是list中的click，则不阻止默认行为
                    $.contains(list, e.target) || e.preventDefault();
                };
                //bind event
                $(holder).bind(holderEvt);
                $(list).bind({
                    mouseout: function (e) {
                        var rel = e.relatedTarget;
                        if (rel !== this && !$.contains(this, rel) && rel !== holder && !$.contains(holder, rel)) {
                            if (!listIsSub) this.style.display = "none";
                            $(holder).removeClass(activeCss);
                            disableCallback && disableCallback(e);
                        }
                        timer && window.clearTimeout(timer);
                    },
                    click: function (e) {
                        var a = e.target.tagName.toLowerCase() == "a" ? e.target : e.target.parentNode.tagName.toLowerCase() == "a" ? e.target.parentNode : null;
                        //是否关闭菜单
                        if (!a || fn.call(a, e) !== false) {
                            if (!listIsSub) list.style.display = "none";
                            $(holder).removeClass(activeCss);
                            disableCallback && disableCallback(e);
                        }
                    }
                });
            }
        },
        //工具条私有数据
        _Nav = {
            //获取输出容器
            setWrap: function (wrap) {
                this.wrap = this.wrap || $(wrap || "#topNavLeft");
            },

            //检查配置
            checkOptions: function (options) {
                var ops = this.options || $.extend({}, defaultConf),
                    setOps = options || {};
                //复制options
                $.each(defaultConf, function (key, conf) {
                    ops[key] = setOps[key] !== undefined ? setOps[key] : ops[key];
                });
                //检查参数
                ops.loginUrl = ops.loginUrl || "javascript:easyNav.login()";
                //填充参数中的占位信息
                $.each(ops, function (key, value) {
                    if (typeof value === "string") {
                        ops[key] = $.format(value, ops);
                    }
                });
                //保存原始配置
                this.options = ops;
            },

            //获取动态的显示数据
            checkData: function () {
                var ops = this.options;
                //计算其他页面输出的占位符
                this.data = {
                    //登录链接
                    loginLink: _Nav.getUrl(ops.loginUrl, ops.loginTxt),

                    //退出链接
                    logoutLink: _Nav.getUrl(ops.logoutUrl, ops.logoutTxt),

                    //注册链接
                    regLink: _Nav.getUrl(ops.regUrl, ops.regTxt),

                    //问候语
                    time: _Nav.getTimeDesc(),

                    //昵称
                    nickName: $.safeHTML(login.getAccount()),

                    //产品入口，网易通行证显示产品入口，其他默认不显示
                    //从登录组件要account进行显示
                    nameHolder: (function () {
                        var site = login.getSite(),
                            info = $.isFunction(ops.funcEntry) ? ops.funcEntry(site) : ops.funcEntry;
                        //如果强制不显示产品入口
                        if (info === null || info === false) {
                            return login.getAccount();
                        }
                        //如果强制显示产品入口
                        if (info === true) {
                            return _Nav.get163Entry(login.getAccount());
                        }
                        //如果设置了文案，则按照设置的文案显示
                        if (info) {
                            return $.safeHTML(info + "");
                        }
                        //否则，自动设置显示的文案
                        if (login.getSite() === "163") {
                            return _Nav.get163Entry();
                        }
                        //第三方登录，默认查询登录用户名
                        return $.safeHTML(login.getAccount());
                    })()
                };
            },

            //配置检查：注册链接/登录链接/退出链接
            getUrl: function (url, txt) {
                var u = /^javascript:/i.test(url) ? 'javascript:void(0);" onclick="' + url.substring(11) : url;
                //填充username
                u = $.format(u, {
                    username: uri(login.getURSId())
                });
                return '<a href="' + u + '">' + txt + '</a>';
            },

            //生成html代码
            getHTML: function () {
                this.checkData();
                return $.format(this.options[login.isLogin() ? "welcomeUser" : "welcomeGuest"], this.data);
            },

            //获得问候语
            getTimeDesc: function () {
                var hours = new Date().getHours();
                return hours > 5 && hours <= 11 ? "上午" : hours > 11 && hours <= 13 ? "中午" : hours > 13 && hours <= 17 ? "下午" : hours > 17 || hours <= 2 ? "晚上" : "凌晨";
            },

            //获得网易产品入口
            get163Entry: function (username) {
                var listHtml = ['<span id="user163Box">',
                        '<a href="{link}" target="_blank" hideFocus="true" id="user163Name" title="{username}"><em>{username}</em></a>',
                        '<i id="userBoxArrow"></i><div id="user163List">{list}</div></span>'
                    ].join(""),
                    listTmpl = '<a target="_blank" href="{url}">{text}</a>',
                    list = [];
                //遍历产品入口
                var data = {
                        ursId: $.safeHTML(login.getURSId()),
                        username: $.safeHTML(username || login.getURSId()),
                        from: _Nav.options.appId
                    },
                    currentDom = _Nav.tools.getUrlDomain();
                $.each(Netease.entrys, function (i, conf) {
                    var info = $.extend({}, $.isFunction(conf) ? conf(data) : conf);
                    if (info && info.text && info.url) {
                        //检查域名
                        var domain = info.domain || _Nav.tools.getUrlDomain(info.url);
                        if (!_Nav.tools.checkUrlDomain(currentDom, domain)) {
                            info.url = $.format(info.url, data);
                            list.push($.format(listTmpl, info));
                            //默认是显示第一个子链接的地址
                            if (list.length === 1) {
                                data.link = info.url;
                            }
                        }
                    }
                });
                data.link = data.link || "#";
                data.list = list.join("");
                return $.format(listHtml, data);
            },

            //小工具函数，仅限内部使用
            tools: {
                getUrlDomain: function (strUrl) {
                    var url = (strUrl || document.URL).replace(/\?.*$/g, "").replace(/#.*$/g, "");
                    if (/^[^:]+:\/\/([^\/\?\#]+).*$/gi.test(url))
                        return RegExp.$1;
                    return url;
                },
                checkUrlDomain: function (urlDomain, domain) {
                    return (new RegExp(domain + "$", "i")).test(urlDomain);
                }
            }
        };

    //挂接window
    window.easyNav = easyNav;
    //注册登录组件事件 action: 1登录成功  2登录注销  0登录放弃
    $.bindMsg("login.complete", function (siteName, action) {
        action && easyNav.repaint();
    });
});
var Core = (function (window, $, undefined) {
    //"use strict";
//时间相关
    var Time = {
        connectTime: window.performance && window.performance.timing ? window.performance.timing.connectStart || 0 : 0,
        serverInitTime: +new Date(),
        localInitTime: +new Date(),
        getServerTime: function () {
            //如果connectTime存在并且比serverTime早，则修正serverTime
            var pageLoadTime = this.localInitTime - this.connectTime,
                serverTime = this.serverInitTime + (+new Date()) - this.localInitTime;
            return new Date(this.connectTime > 0 && pageLoadTime > 0 ? serverTime + pageLoadTime : serverTime);
        }
    };
    var Core = {
        /*
         * UI版本
         */
        version: "2.0",

        /*
         * 当前时间
         * 初始化为本地时间，如果后台给出服务器时间后，则替换
         */
        serverTime: function () {
            return Time.getServerTime()
        },

        /*
         * 时间戳
         */
        now: function () {
            return (new Date).getTime();
        },

        /*
         * 内存强制回收函数引用
         */
        GC: window.CollectGarbage || $.noop,

        /*
         * 日志输出接口
         */
        log: $.getPara("debugger") && window.console ? function () {
            return window.console.log.applay(window.console, arguments)
        } : $.noop,

        /*
         * 业务配置信息对象/缓存对象，由页面自定设置
         */
        infoCdnUrl: "http://pimg1.126.net/piao_info",
        cdnUrl: "http://pimg1.126.net/movie", //常规下的默认值，以保证cdnUrl随时可用
        navConfig: {
            appName: "网易电影",
            appId: "movie"
        },
        //justInit为私有参数
        navInit: function (cdn, userId, versionId, serverTime, justInit) {
            $.loginReady(function () {
                //初始化基本配置
                Core.configInit && Core.configInit(cdn, userId, versionId, serverTime);

                //增加邮件推广占位容器
                //Core.navConfig.welcomeUser = '{time}好，{funcEntry}<span id="mailInfoHolder"></span>，欢迎来到{appName}！{logoutLink}';

                //如果是用户私有页面，则修改退出登录的返回url地址到首页
                //要求私有js必须放在head内，否则config配置将在页面输出时无效
                if (Core.userPage || Core.privatePage) {
                    Core.navConfig.logoutUrl = "http://reg.163.com/Logout.jsp?username={username}&url=" + encodeURIComponent('http://piao.163.com/reg/logoutredirect.html?gotoUrl=' + encodeURIComponent("http://piao.163.com"));
                }
                //初始化
                Core.easyNav.init(Core.navConfig, justInit);
            });
            //删除初始化方法
            delete this.navInit;
        },
        //基本配置初始化
        configInit: function (cdn, userId, versionId, serverTime) {
            //2013-10-11 马超修改为初始化读取cookie，然后通过网易宝ajax进行校正用户名
            //这样就可以解决页面静态化遇到的页面缓存问题
            userId = ($.cookie("S_INFO") || $.cookie('S_OINFO')) ? easyNav.account : "";

            //引用easyNav
            this.easyNav = window.easyNav;

            //其他配置
            this.cdnUrl = cdn;
            this.version = versionId || this.version;
            //保存变量
            this.navConfig.loginUrl = this.navConfig.loginUrl || "javascript:easyNav.login()";
            this.navConfig.loginJsPath = cdn + "/js2";
            this.navConfig.sessionId = userId || "";

            //注册事件挂接
            //this.navConfig.regUrl = 'javascript:Core.register();';
            if (serverTime) Time.serverInitTime = +serverTime;

            //获得cdn地址后，立即绑定自动加载模块
            //注册自加载组件或模块
            $.bindModule({
                "dialog": {js: "js2/dialog.js"},
                "scrollWhenNeed": {js: "js2/easyTools/scroll.js"},
                "easyEvents": {js: "js2/easyTools/event.js"},
                "HashMap": {js: "js2/easyTools/HashMap.js"}
            }, this.cdnUrl);
            //jquery.fn
            $.bindModule($.fn, {
                "disableSelection enableSelection disableRightClick enableRightClick disableIME enableIME setControlEffect": {js: "js2/easyTools/tools.js"},
                "bindDrag": {js: "js2/easyTools/drag.js"},
                "scrollGrid xScrollGrid": {js: "js2/easyTools/scroll.js"},
                "easyEvents": {js: "js2/easyTools/event.js"},
                "placeholder": {js: "js2/placeholder.js"},
                "carousel": {js: "js2/carousel.js"}
            }, this.cdnUrl);

            //绑定自动加载模块
            this.bindModule({
                // mobileCom 组件3个对外接口 add ytzheng 20141025
                "insertMobDownFix insertMobDownHover initMobileLoad": {
                    js: "js2/phoneclient/mobileCom.js",
                    css: "css2/phoneclient/mobileCom.css"
                },
                //运算共享/ajax共享组件
                "shareAction shareGet sharePost": {js: "js2/shareAction.js"}
            });

            //删除初始化方法
            delete this.configInit;
        },

        /*
         * 自动加载模块注册
         */
        bindModule: function (ops) {
            $.bindModule(this, ops, this.cdnUrl);
            return this;
        },

        /*
         * 快速初始化入口，在页面底部即被执行
         * 2012-09-25 马超 删除quickInit修改为由fastInit方法调用
         */
        fastInit: function (quickInit) {
            //绑定事件
            if (this.eventWrap && this.events && $.fn.easyEvents) $(this.eventWrap).easyEvents(this.events, this);

            //初始化工具条，防止navInit未被调用
            //2012-07-17 马超 修改默认处理的默认版本号为当前时间戳以获取最新前端资源
            this.navInit && this.navInit(this.cdnUrl, "", +new Date(), "", true);
            // 初始化红包信息
            try {
                this.initCityList()
                    .initTopCityList()
                    .initTopCitySearch()
                    .initSearch()
                    .intFastBuy()
                    .initRanklist()
                    .initSide()
                    .initCltList();
            } catch (e) {
            }

            //删除逻辑上移，防止quickInit报错无法删除
            delete this.fastInit;

            //调用其他快速初始化
            quickInit && this.quickInit && this.quickInit();
        },
        /*
         * 无刷新重绘nav
         */
        repaint: function () {
            // Core.loadCdnJS("js2/popularize/mail.js", $.falseFn, $.noop);
            //Core.getEpayInfo();

            //铺码自动化
            // if( $.cookie("COOKIEYIMAFROM") !== null && $.cookie("COOKIEYIMACPC") !== null ){
            // 	Core.loadCdnJS("js2/popularize/entry.js");
            // }
        },

        /*
         * 初始化入口
         */
        init: function () {
            $.loginReady(function () {
                //如果未初始化，则补救
                Core.fastInit && Core.fastInit(1);

                //全局监听a[href=javasscript:] 类型的链接click
                $(document).delegate("a[href*=javascript:;],a[href*=javascript:void(]", "click", $.preventDft);

                //无刷新登录顶部NAV事件响应
                easyNav.onLogin(Core.repaint);

                //继续初始化
                //2013-08-23 马超 增加容错处理，防止私有初始化代码错误后，导致整个页面的初始化收到影响
                // try{
                Core.myInit();
                // }catch(e){}

                //顶部导航和主导航初始化
                Core.initNav();
                Core.load_monitor();//加载第三方合作铺码代码

                //全站引入jtip组件
                Core.loadCdnJS("js2/jtip.js", function () {
                    return !!$.jtip;
                }, function () {
                    $.jtip(".jtip");
                });

                //2013-08-08 马超 增加全站消息组件加载(40x和50x页面、iframe页面以及特殊指定的页面除外)
                //Core.is4050x || Core.hideSysMessage || (window.top == window.self && /^piao\.163\.com$/i.test(window.location.host) && Core.loadCdnJS("js2/userCenter/userMessage.js"));

                //删除过期成员
                delete Core.init;
                delete Core.myInit;
                delete Core.initCityList;
                delete Core.initTopCityList;
                delete Core.initTopCitySearch;
                delete Core.initSearch;
                delete Core.initCltList;
                delete Core.intFastBuy;
                delete Core.initRanklist;
                delete Core.initSide;
                Core.quickInit && delete Core.quickInit;
                //内存垃圾回收
                Core.GC();
            });
        },

        /*
         * 发送一个请求到后台，不处理返回结果
         */
        emptySendHttp: function (url) {
            var n = "imgLoad_" + (+new Date()) + parseInt(Math.random() * 100), _img, sp;
            _img = window[n] = new Image();
            _img.onload = function () {
                window[n] = null;
                _ntes_void();
            };
            _img.onerror = function () {
                window[n] = null;
            };
            url = url.replace(/#\S*$/, '');
            sp = (url + "").indexOf("?") + 1 ? "&" : "?";
            _img.src = url + sp + 'd=' + (+new Date());
            _img = null;
        },

        /*
         * 绑定复制文本功能
         * txt 可以为静态文本，也可以是函数（需要return一个字符串）
         */
        zclip: window.clipboardData ? function (button, txt, callback) {
            $(button).click(function () {
                var ok = true, t = $.isFunction(txt) ? txt() : String(txt);
                try {
                    window.clipboardData.clearData();
                    window.clipboardData.setData("Text", t);
                } catch (e) {
                    ok = false;
                }
                callback && callback(ok);
            });
        } : function (button, txt, callback) {
            var btn = $(button), swfPath = this.cdnUrl + "/swf/ZeroClipboard20130715.swf";
            //否则调用flash完成复制功能
            this.loadCdnJS("js2/zClip.js", function () {
                return !!$.fn.zclip;
            }, function () {
                btn.zclip({
                    path: swfPath,
                    copy: txt,
                    afterCopy: callback
                });
            });
        },

        /*
         * 插入一个flash，参数如下:
         * dom		flash的容器
         * option	flash控制参数对象，其属性包括:
         *		swf		: flash相对路径（相对于swf目录，默认从CDN取文件）
         *		path	: flash完整路径，如果提供此设置，则swf设置无效
         *		id		: flash的ID
         *		width	: flash的宽度
         *		height	: flash的高度
         *		vars	: flash初始化传递的参数[可选]
         *		bgcolor : flash默认的背景色[可选，默认白色]
         *		fullScreen	: 是否允许全屏[可选，默认否]
         *		loop	: flahs是否循环播放[可选，默认否]
         *		lowVersion : flash最低版本要求，仅对IE有效[可选，默认9.0]
         * callback	flash插入前状态检查[可选]，接收两个参数。如果返回false则不插入Flash代码
         *		support : 是否支持Flash插件
         *		version : flash插件的版本号[数字]，比如 11.2，如果没有安装插件则为 0
         */
        insertFlash: function (dom, option, callback) {
            //修正参数以供组件使用
            option.path = option.path || this.cdnUrl + "/swf/" + option.swf;
            this.loadCdnJS("js/flash.js", function () {
                return !!$.easyFlash;
            }, function () {
                var d = $.isFunction(callback) ? callback($.easyFlash.support, $.easyFlash.version) : null;
                if (d !== false)
                    $.easyFlash.insert(dom, option);
            });
        },

        /*
         * 根据毫秒数计算剩余时间
         */
        getTimeDescription: function (num) {
            var time = +num > 0 ? +num : 0,
                //刻度
                onemin = 60000, onehour = 60 * onemin, oneday = 24 * onehour,
                //转化为两位数字
                fillZ = function (n) {
                    return ("0" + Math.floor(n)).slice(-2);
                };
            //返回
            return [fillZ(time / oneday), fillZ(time % oneday / onehour), fillZ(time % oneday % onehour / onemin), fillZ(time % oneday % onehour % onemin / 1000)];
        },


        /*
         * 滚动定位组件
         * dom : [必选]要定位参考的dom元素，必须是可视的。可以是dom、selector、jqObj
         * force : [可选]是否强制滚动定位，默认flase，如果设置为true，则会强制滚动到指定元素的顶部
         */
        scrollWhenNeed: function (dom, force) {
            $.scrollWhenNeed(dom, force)
        },

        /*
         * 转化日期数字为指定格式
         */
        formatTime: function (timeNum, tmpl) {
            return $.formatTime(timeNum, tmpl);
        },

        /*
         * 顶部工具条、主导航初始化
         */
        initNav: function () {
            var menuClick = function () {
                var me = $(this);
                if (!!me.attr("user") && !easyNav.isLogin()) { //需要登录验证
                    Core.easyNav.login(this.href);
                    e.preventDefault();
                    return;
                }
            };

            //下拉菜单
            $(".mcDropMenuBox").each(function () {
                Core.easyNav.bindDropMenu(this, $(".mcDropMenu", this)[0], "mouseover", "dropMenuBoxActive", menuClick, 200);
                $(".topNavHolder", this).click(menuClick);
            });
            //检查是否需要打开登陆窗
            if ($.getUrlPara("isShowLogin") && !easyNav.isLogin(true)) {
                easyNav.login();
            }

            //下拉菜单
            $(".wordsNum2,.wordsNum4", "#funcTab").each(function () {
                //绑定列表
                Core.easyNav.bindDropMenu(this, $(".mcDropMenu", this)[0], "mouseover", "hover", $.noop, 200);
            });

            //删除title,防止挡住下拉菜单
            $("#funcTab a").not('#lotteryListEntry a').removeAttr("title");

            // 手机下载tab，初始化下载浮层（异步模块）
            var $mobTab = $('#funcTab li[pid=mobile]'), $mobLink = $('a', $mobTab);
            $mobLink.attr('href', $mobLink.attr('href') + '?from=nav1');
            $mobLink.prepend('<span class="icon_mob"></span>');
            if (!$mobTab.hasClass('active')) {
                $mobTab.hover(function () {
                    Core.__mobDownHover = 1;
                    Core.insertMobDownHover($mobTab, true, {from: 'nav1'});
                }, function () {
                    Core.__mobDownHover = 0;
                });
            }

            //删除
            delete this.initNav;
            //返回
            return this;
        },
        //加载各种铺码代码，统一方法,clear:true主动加载
        load_monitor: function (clear) {
            if ($.cookie('SEM_KEY_COOKIE') && $.cookie('SEM_PARTNERTYPE_COOKIE')) {
                this.loadCdnJS("js/popularize/entry.js");
            }
        },
        statistics_adsage: function (loadCA) {
            //SEM_KEY_COOKIE 关键码,SEM_PARTNERTYPE_COOKIE 合作方,SEM_USERTYPE_COOKIE:sem 用户类型；1：未登录 2：新用户，3：老用户
            if ($.cookie('SEM_KEY_COOKIE') && $.cookie('SEM_PARTNERTYPE_COOKIE')) {
                var t = $.cookie('SEM_USERTYPE_COOKIE');

                //20141226新增博雅立方
                var heads = document.getElementsByTagName("head")[0] || document.documentElement;
                var tags = document.createElement("script");
                tags.type = "text/javascript";
                tags.src = "http://ca.cubead.com/cubead_ca.js?v=" + Core.cdnFileVersion;

                tags.onload = tags.onreadystatechange = function () {
                    //页面追踪,获取网页的流量（pv,visits,time on site,new visits等）
                    _traker._init("piao.163.com", "133911");
                    if (!loadCA && (t == '2' || t == '3')) {
                        //事件追踪,用来记录用户在页面上的交互行为（点击事件）
                        //支付页面当时写的比较乱，不同情况的提交用了不同的id
                        //兑换券，126兑换券，团购,充送活动，以上类型支付确认页面
                        if ($('input[id="subPay"]').length) {
                            _traker._monitorEvent("INPUT", "id", "subPay", "C", "piaoOrder");
                        }
                        //选座，126选座，以上支付确认页面
                        if ($('input[id="subPay1"]').length) {
                            _traker._monitorEvent("INPUT", "id", "subPay1", "C", "piaoOrder");
                        }
                        if ($('input[id="subPay2"]').length) {
                            _traker._monitorEvent("INPUT", "id", "subPay2", "C", "piaoOrder");
                        }
                        //选座，兑换券,126兑换券，团购，以上类型支付确认页面
                        if ($('input[id="exchangePay"]').length) {
                            _traker._monitorEvent("INPUT", "id", "exchangePay", "C", "piaoOrder");
                        }
                    }
                }
                heads.appendChild(tags);

                if ((t == '2' || t == '3') && !loadCA) {
                    //看log应该是最早的艾德思奇统计
                    Core.post('/sem/addSemUser.html', function (err, rs) {
                    });
                    if (t == '2') {
                        //品众保留
                        Core.loadCdnJS("js/popularize/pinzhong.js", function () {
                            return !!window.pinzhong;
                        }, function () {
                            var pinzhong = window.pinzhong;
                            pinzhong.sendOrder(order.id, order.amount);
                        });
                    }
                }
            }
        },
        //头部获取未支付订单数
        getUnPayedOrderCount: function () {
            /*var core=this;
             core.post("/order/query_unpayed_order.html", {}, function(err, rs){
             //var rs='{"retcode":"200","unpayedOrderCount": 3,"retdesc":""}';
             rs = core.parseJSON(rs);
             if(!!rs && rs.retcode=='200' && rs.unpayedOrderCount > 0){
             $('#topNavRight').find('li:first > a').html('我的订单（<i>'+rs.unpayedOrderCount+'</i>）');
             }

             });*/
            var stamp = +new Date(), randCbName = "cb" + stamp,
                head = document.getElementsByTagName("head")[0] || document.documentElement,
                js = document.createElement("script");
            js.type = "text/javascript";
            js.src = $.format("http://order.mall.163.com/order/movie/unpaid_order_acc.html?cache={cache}&callback={callback}", {
                //cb2012232({"retcode":"200","unpayedOrderCount": 3,"retdesc":""});
                cache: stamp,
                callback: randCbName
            });
            //创建临时回调函数
            window[randCbName] = function (data) {
                //删除script节点
                head.removeChild(js);
                if (data.unpayedOrderCount > 0) {
                    $('#topNavRight').find('li:first > a').html('我的订单（<i>' + data.unpayedOrderCount + '</i>）');
                }
                //删除临时回调函数
                window[randCbName] = null;
            };
            //插入script节点
            head.appendChild(js, head.lastChild);
        },
        /*
         * 初始化城市下拉列表--原位置在主导航下面修改到logo旁边
         */
        initTopCityList: function () {
            var switchCity = $("#switchTopCity"), list = switchCity.find('.cityList'),
                list_li = list.find('.titleChar > li'),
                cityListBox = switchCity.find('.cityListBox'), dls = cityListBox.find('.cityListGroup'),
                cityTopSearch = list.find('.cityTopSearch');
            //添加蒙层 for ie6
            addLayout = function (wrap) {
                wrap.prepend('<iframe class="iFrameGround" frameborder="0"></iframe>');
                wrap.find(".iFrameGround:first").width(wrap.outerWidth()).height(wrap.outerHeight());
            };
            $(document).click(function (e) {
                var target = e.target || e,
                    div = $(target).closest('.cityList'),
                    span = $(target).closest('.myCityBar');
                if (div.length <= 0 && span.length <= 0) {//点击图层区域外的地方，隐藏之
                    hideList();
                }

            });
            //隐藏城市图层
            function hideList() {
                switchCity.removeClass("active");
                switchCity.find(".myCityBar").next().removeClass('triangleToUp');
                list.slideUp();

                //展开始终显示热映
                list_li.removeClass("on");
                dls.addClass('none');
                list_li.first().addClass('on');
                dls.eq(0).removeClass('none');
            }

            //导航列表展开
            if (switchCity[0]) {
                switchCity.find(".myCityBar").click(function () {
                    if (switchCity.hasClass("active")) {
                        if ($(".searchTopCss")[0]) {
                            $(".searchTopCss").css("z-index", "9300");
                        }

                        hideList();
                    } else {
                        if ($(".searchTopCss")[0]) {
                            $(".searchTopCss").css("z-index", "9000");
                        }
                        switchCity.addClass("active");
                        switchCity.find(".myCityBar").next().addClass('triangleToUp');

                        list.slideDown();

                        //设置列表高度一样-------------------
                        // var maxH=cityListBox.height();
                        // for(var i=0,j=dls.length;i<j;i++){
                        //   	if($(dls[i]).height()>maxH){
                        // 	 	maxH=$(dls[i]).height();
                        // 	}
                        // }
                        // cityListBox.height(maxH);
                        // list.find(".iFrameGround:first").height(list.height());
                        //----------------------------------------
                    }
                });
                list.find('.close').click(function () {
                    hideList();
                });
                list_li.hover(
                    function () {
                        list_li.removeClass("on");
                        dls.addClass('none');

                        $(this).addClass("on");
                        dls.eq($(this).index()).removeClass('none');

                        //隐藏搜索列表
                        $(".searchTopCss").css("z-index", "9300").removeAttr("style").removeClass();
                        cityTopSearch.blur();
                    },
                    function () {

                    }
                );
                if ($.isIE6) addLayout(list);
            }
            return this;
        },
        /*
         * iframe页面初始化城市下拉列表(promoter目录下)
         */
        initCityList: function () {
            var switchCity = $("#switchCity"), list = $("#cityList"),
                //添加蒙层 for ie6
                addLayout = function (wrap) {
                    wrap.prepend('<iframe class="iFrameGround" frameborder="0"></iframe>');
                    wrap.find(".iFrameGround:first").width(wrap.outerWidth()).height(wrap.outerHeight());
                },
                docClick = function (e) {
                    var obj = e.target;
                    if ($(obj).closest("#cityList")[0] && !$(obj).hasClass("close") && obj.tagName.toLowerCase() != "a")
                        return false;
                    switchCity.removeClass("active");
                    $(document).unbind("click", docClick);
                };
            //导航列表展开
            if (switchCity[0]) {
                switchCity.find(".myCityBar").click(function () {
                    if (switchCity.hasClass("active")) {
                        switchCity.removeClass("active");
                        return;
                    }
                    switchCity.addClass("active");
                    window.setTimeout(function () {
                        $(document).bind("click", docClick);
                    }, 100);
                });
                //初始化
                //this.easyNav.bindDropMenu(switchCity[0], list[0], "click", "active", $.noop );
                if ($.isIE678) addLayout(list);
            }
            return this;
        },
        /*
         * 客户端下拉列表
         * 首页改版，电影栏目下拉复用
         */
        initCltList: function () {
            var movieLink = $("#movieLink"), triangle = movieLink.find(".triangle2"), movieMenu = $("#movieMenu"),
                frame = null;
            //导航列表展开
            if (movieLink[0]) {
                var hoverTimer;
                movieLink.hover(
                    function () {
                        hoverTimer = setTimeout(function () {
                            movieLink.addClass("active");
                            triangle.addClass("triangleToUp");
                            movieMenu.slideDown();
                        }, 200)

                        //cltLink_btn.addClass("active");
                        //cltList.animate({height: '50px'}, 300);
                        //frame && frame.animate({height: '50px'}, 300);
                    },
                    function () {
                        clearTimeout(hoverTimer);
                        movieLink.removeClass("active");
                        triangle.removeClass("triangleToUp");
                        movieMenu.slideUp();
                        //if(Core.clt_pageType !="client"){
                        //cltLink_btn.removeClass("active");
                        //}
                        //cltList.animate({height: '0'}, 300);
                        //frame && frame.animate({height: '0'}, 300);
                    }
                )
                //初始化
                //this.easyNav.bindDropMenu(switchCity[0], list[0], "click", "active", $.noop );
                /*if( $.isIE678 ){
                 cltList.prepend('<iframe class="iFrameGround" frameborder="0"></iframe>');
                 cltList.find(".iFrameGround:first").width( cltList.outerWidth() ).height( cltList.outerHeight() );
                 frame= cltList.find(".iFrameGround:first");
                 }*/
            }
            return this;
        },
        //头部公共搜素（右上角）
        initSearch: function () {
            var mvTopSearch = $("#mvTopSearch"), topSearchBtn = $("#topSearchBtn");
            if (mvTopSearch.length) {
                var top_sform = $("#top_sform");
                this.focusBlurTip(mvTopSearch, "请输入影片或影院");
                //高亮显示搜索按钮
                mvTopSearch.focus(function () {
                    topSearchBtn.addClass('searchBtnActive')
                })
                mvTopSearch.blur(function () {
                    topSearchBtn.removeClass('searchBtnActive')
                })
                top_sform.submit(topToSearch);
                mvTopSearch.keyup(function (e) {
                    if (e.keyCode == 13) {
                        window.setTimeout(function () {
                            top_sform.submit();
                        }, 200);
                    }
                }).autoSearch("/search_tip.html?city=" + Core.curCity.spell + "&keywords={key}&callback={callback}", function (data) {
                    var key = data.p, list = data.list, arr = [], v = this.value.trim(), n = list.length, i = 0, reg,
                        url;

                    if (key === v) {
                        //reg = new RegExp("^(.*)"+ $.safeRegStr(key) +"(.+)$");
                        reg = new RegExp("^(.*)(" + $.safeRegStr(key) + ")(.*)$", "i");
                        for (; i < n; i++) {
                            url = list[i].type == "m" ? "/" + Core.curCity.spell + "/movie/" + list[i].url + ".html#from=search.menu"
                                : "/com.cinema/" + list[i].url + ".html#from=search.menu";
                            arr[i] = {
                                text: list[i].key,
                                value: url,
                                textShow: list[i].key.replace(reg, "$1<b>$2</b>$3")
                            };
                        }
                    }
                    return arr;
                }, {
                    sameWidth: true,
                    listCss: "searchTopCss",
                    itemTmpl: '<a class="{itemCss}" href="{value}" title="{text}">{textShow}</a>',
                    onHide: function (reason, text, value, link) {
                        if (reason == "inputConfirm") {
                            window.location = $(link).attr('href');
                        }
                    }
                });
            }
            //搜索操作
            function topToSearch() {
                var keys = $("#mvTopSearch").val().trim();
                if (keys && keys != "请输入影片或影院关键字") {
                    window.location = "/search.html?city=" + Core.curCity.spell + "&keywords=" + encodeURIComponent(keys) + "#from=search";
                }
                return false;
            }

            return this;
        },

        //头部城市切换的搜索(logo旁边)todo:
        initTopCitySearch: function () {
            var switchTopCity = $("#switchTopCity"),
                cityTopSearch = switchTopCity.find(".cityTopSearch"),//输入框
                cityTopSearchBtn = switchTopCity.find(".cityTopSearchBtn"),//搜索按钮
                curCity = switchTopCity.find(".curCity"), type = curCity.attr('type'),//type用来标记"微博积分兑换"页面;
                cityName = curCity.find(".cityName"),
                cityUrl = curCity.find('.cityUrl');
            if (cityTopSearch.length) {
                this.focusBlurTip(cityTopSearch, "请输入城市或城市拼音");
                //高亮显示搜索按钮
                cityTopSearch.focus(function () {
                    cityTopSearchBtn.addClass('searchBtnActive')
                })
                cityTopSearch.blur(function () {
                    cityTopSearchBtn.removeClass('searchBtnActive')
                })
                cityTopSearch.keyup(function (e) {
                    if (e.keyCode == 37 || e.keyCode == 39) {
                        return false;
                    }
                    if (e.keyCode == 13) {
                        toSearch();
                    } else {
                        //城市切换的输入框，只能输入字母和汉字
                        var v = this.value.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '').trim();
                        this.value = v;
                    }
                }).autoSearch("/city_tip.html?keywords={key}&callback={callback}", function (data) {//data为jsonp返回的数据
                    //data={list:[{'id':'1','name':'beijing'}]};
                    var list = data.list, arr = [], key = this.value.trim(), n = list.length, i = 0, reg, city;
                    reg = new RegExp("^(.*)(" + $.safeRegStr(key) + ")(.*)$", "i");
                    for (; i < n; i++) {
                        city = list[i];
                        arr[i] = {
                            id: city.id,
                            name: city.name,
                            url: cityUrl.val().trim().replace(cityName.attr('pspell').trim(), city.spell),
                            textShow: '<span class="left">' + city.name.replace(reg, "$1<b>$2</b>$3") + '</span><span class="right">' + city.realSpell + '</span>',
                            hoverCss: ""
                        };
                    }
                    if (arr.length > 0) {
                        arr[0].hover = "autoListItemHover";//默认列表第一个选中
                    }
                    return arr;
                }, {
                    sameWidth: true,
                    listCss: "searchTopCss cityTopSearch",
                    //itemTmpl : '<a class="{itemCss} {hoverCss}" href="{url}" title="{name}">{textShow}</a>',
                    itemTmpl: type == "weibo" ? '<a class="{itemCss} {hoverCss}" href="javascript:;" title="{name}"  cityId="{id}">{textShow}</a>' : '<a class="{itemCss} {hoverCss}" href="{url}" title="{name}">{textShow}</a>',
                    onHide: function (reason, text, value, link) {
                        if (reason == "inputConfirm") {
                            if (type == "weibo") {
                                //微博积分活动页里嵌入“正在热映”，切换城市页面不跳转，只请求影片列表
                                var cityId = $(link).attr("cityId").trim();
                                Core.getHotList(cityId);
                            } else {
                                //除微博外其他页面，切换城市页面跳转
                                window.location = $(link).attr('href');
                            }
                        }
                    }
                });

                //搜索按钮
                cityTopSearchBtn.click(function () {
                    toSearch();
                });
            }
            //搜索操作
            function toSearch() {
                window.setTimeout(function () {
                    var autoCompleteList = $('#autoCompleteList');
                    if (autoCompleteList.find('a').length) {//若直接回车，取列表第一个值
                        autoCompleteList.find('a').first().get(0).click();
                    }
                }, 200);
            }

            return this;
        },
        /*
         * 初始化小精灵入口
         * 2012-08-02 增加，忽略活动页面
         */
        initSprite: function () {
            var box = $("#zxService"), ignore = !box[0] && /activity\//gi.test(document.URL), lock = 0, ref = null;
            if (!ignore && !this.ignoreSprite) {
                if (!box[0]) {
                    $(document.body).append('<div id="zxService"><span>在线客服</span></div>');
                    box = $("#zxService");
                }
                box.fixPosition().click(function () {
                    if (lock)return;
                    if (ref && !ref.closed) {
                        ref.focus();
                    } else {
                        lock = 1;
                        ref = window.open("http://sprite.163.com/spriteAjax/welcome.html?productId=1", "newwindow", "height=585,width=730,top=150,left=500,toolbar=no,menubar=no,scrollbars=no,dialog=yes,resizable=no,location=no,status=no,z-look=yes");
                        window.setTimeout(function () {
                            lock = 0
                        }, 1000);
                    }
                });
            }
            return this;
        },
        //导航条的快速购票入口
        intFastBuy: function () {
            $('#fastBuyNav').click(function (e) {
                Core.fastBuyDialog();
            });
            return this;
        },
        /*
         *快速购票弹窗
         *groupBuyId:团购id，一个标志，（有兑换码是才有值）
         *initFunc：弹窗初始化时执行的方法
         *isReload:是否刷新页面
         *使用：Core.fastBuyDialog();
         */
        fastBuyDialog: function (groupBuyId, isReload, initFunc) {
            var url = Core.curCity.spell + '/fast/schedule.html';
            if (groupBuyId) {
                url = Core.curCity.spell + '/fast/dispatch.html?groupBuyId=' + groupBuyId;
            }
            //url='../fast/schedule.ftl';//////////////////////

            //快速选做页面弹窗
            $.dialog();
            $.dialog({
                type: "shell",
                title: "",
                content: '<div class="iDialogContent"><a id="fastBuyClose" href="javascript:;" class="fastBuyClose"></a><iframe scrolling="no" frameborder="0" style="width:100%;height:500px;overflow:hidden;" src="/' + url + '"></iframe></div>',
                width: 960,
                button: [],
                init: function () {
                    //关闭按钮
                    $('#fastBuyClose', '.iDialogContent').click(function () {
                        if (isReload) {
                            window.top.location.reload();//关闭快速购票页面时，刷新父级页面
                        } else {
                            $.dialog();
                        }
                    });
                    !!initFunc && initFunc();
                }
            });
        },
        //初始化排行榜列表
        initRanklist: function () {
            var ranUl = $('#rankList > ul');
            if (ranUl.length > 0) {
                ranUl.mouseover(function (e) {
                    e = window.event || e;
                    var target = e.target || e.srcElement;
                    var li = $(target).closest('li');
                    if (li.length > 0) {
                        ranUl.find('.detail').addClass('none');
                        li.find('.detail').removeClass('none');
                    }
                });
            }
            return this;
        },
        //回到顶部
        initSide: function () {
            //首页，详情页面增加回到顶部，订单及支付页面不加
            if ($("#sideBar")[0]) {
                Core.setPos();
                $(window).bind('scroll', function () {
                    Core.setPos();
                });
                $(window).bind('resize', function () {
                    setTimeout(function () {
                        Core.setPos();
                    }, 10);
                });
                //自动滚动回顶部
                $('#sideBar #toTop').click(function () {
                    var h = $(document).scrollTop(), n = 0, t = 0, timer;
                    // function func(){
                    // 	n++;
                    // 	t=h-n*35;//step:35
                    // 	t = t >= 0 ? t : 0;
                    // 	$(document).scrollTop(t);
                    // 	if(t==0){
                    // 		clearInterval(timer);
                    // 		return false;
                    // 	}
                    // 	timer=setTimeout(func,10);//timespan:10
                    // }
                    //func();
                    $(document).scrollTop(0);
                    $("#sideBar").addClass('none');
                });
            }
            return this;
        },
        //设置左边栏的位置
        setPos: function (type) {
            var st = $(document).scrollTop();
            if (st <= 0) {
                $('#sideBar').addClass('none');
            } else {
                if ($('#sideBar').hasClass('none')) {
                    $('#sideBar').removeClass('none');
                }
            }
        },
        /*
         * 输入框提示语函数，txt默认显示在输入框里面的值，focus时文字消失，如果没有改变任何内容失去焦点的时候文字显示
         * className 显示提示文字时候的样式
         */
        focusBlurTip: function (obj, txt, className) {
            var domObj = obj[0], input = $(domObj);
            className = className || "textGray";
            input.blur(function () {
                if (this.value.trim() == "") {
                    domObj.value = txt;
                    input.addClass(className);
                }
            }).focus(function () {
                if (this.value.trim() == txt) {
                    domObj.value = "";
                }
                input.removeClass(className);
            });
            //初始化检查
            var v = domObj.value.trim() || txt;
            input[v == txt ? "addClass" : "removeClass"](className);
            domObj.value = v;
        },
        /*
         *自定义弹框
         *参数: o={
         *title:头信息
         *content：弹框内容
         *width：宽度
         *button : [],//默认按钮，为空则没有
         *initFunc：弹框初始化时执行的方法
         *}
         */
        showDialogFunc: function (o) {
            var settings = typeof o == "object" ? o : {content: o};
            $.dialog();
            var dialogId = $.dialog($.extend({
                title: '',
                content: '',
                width: 500,
                button: [],
                init: function () {
                    $('.iDialogClose').remove();//移除弹框右上角的默认关闭按钮
                }
            }, settings));
            return dialogId;
        },
        /*
         *影院详情地图弹窗，获取影院信息，展示地图
         *cinemaId:影院id
         *使用：Core.cinemaMapDialog(cinemaId);
         */
        cinemaMapDialog: function (cinemaId) {
            var core = Core;
            core.post('/com.cinema/map_detail.html', {cinemaId: cinemaId}, function (err, rs) {
                //err = 0,rs='{"coord":"116.41740,39.97231","isSeatSupport":1,"address":"北京市东城区北三环东路36号环球贸易中心E座B1/F1/F3","tel":"010-58257733，010-58257733，010-58257733","name":"北京UME国际影城安贞店","isCouponSupport":0,"grade":5.6,"isGroupBuySupport":1}';  //116.41740,39.97231
                if (err) {
                    var content = '<div class="pop"><i class="face_no"></i><span class="msg">不好意思亲，电影院可能搬到火星去啦，<br/>目前还没找到，我们会努力寻找。</span><a class="btn" href="javascript:;">确定</a></div>';
                    core.showDialogFunc({
                        content: content, init: function () {
                            //弹框按钮点击事件
                            $('.iDialogMain').find('.btn').click(function () {
                                $.dialog();
                            });
                        }
                    });
                } else {
                    rs = core.parseJSON(rs);
                    //如果坐标信息不存在或者格式不对，显示错误提示框
                    if (rs.coord == null || rs.coord.indexOf(',') <= 0 || rs.coord.indexOf(',') >= (rs.coord.length - 1)) {
                        var content = '<div class="pop"><i class="face_no"></i><span class="msg">不好意思亲，电影院可能搬到火星去啦，<br/>目前还没找到，我们会努力寻找。</span><a class="btn" href="javascript:;">确定</a></div>';

                        core.showDialogFunc({
                            content: content, init: function () {
                                //弹框按钮点击事件
                                $('.iDialogMain').find('.btn').click(function () {
                                    $.dialog();
                                });
                            }
                        });

                        return;
                    } else {
                        var coord = rs.coord.split(','),//影院坐标
                            longitude = parseFloat(coord[0]),//经度
                            latitude = parseFloat(coord[1]);//纬度

                        //超过中国的经纬度范围
                        if (!latitude || !latitude || longitude < 70 || longitude > 140 || latitude < 2 || latitude > 55) {
                            var content = '<div class="pop"><i class="face_no"></i><span class="msg">不好意思亲，电影院可能搬到火星去啦，<br/>目前还没找到，我们会努力寻找。</span><a class="btn" href="javascript:;">确定</a></div>';
                            core.showDialogFunc({
                                content: content, init: function () {
                                    //弹框按钮点击事件
                                    $('.iDialogMain').find('.btn').click(function () {
                                        $.dialog();
                                    });
                                }
                            });
                            return;
                        }
                    }
                    //坐标信息正确时，显示地图窗
                    $.dialog({
                        type: "shell",
                        title: "",
                        content: '<div class="cinemaMapDialog"><a href="javascript:;" class="close"></a><div class="title"><h2>' + rs.name + '</h2></div><div id="cinemaMap" class="cinemaMap"></div></div>',
                        width: 915,
                        button: [],
                        init: function () {
                            var title = $('.cinemaMapDialog').find('.title');
                            //支持在线选座
                            if (rs.isSeatSupport == '1') {
                                title.append('<i class="icon_z"></i>');
                            }
                            //支持兑换券
                            if (rs.isCouponSupport == '1') {
                                title.append('<i class="icon_q"></i>');
                            }
                            //支持团购
                            if (rs.isGroupBuySupport == '1') {
                                title.append('<i class="icon_t"></i>');
                            }
                            //关闭按钮
                            $('.cinemaMapDialog').find('.close').click(function () {
                                $.dialog();
                            });

                            //评分
                            if (rs.grade != null && rs.grade > 0) {
                                var grade = parseFloat(rs.grade);
                                title.append('<div class="star_bg"><div style="width:' + Math.floor(grade * 10) + '%" class="star"></div></div><div class="score_big">' + Math.floor(grade) + '.<em class="s">' + Math.floor(grade * 10 % 10) + '</em></div>');
                            }
                            var coord = rs.coord.split(','),//影院坐标
                                //创建地图
                                map = new BMap.Map("cinemaMap", {
                                    defaultCursor: 'default'//鼠标状态
                                }),
                                point = new BMap.Point(parseFloat(coord[0]), parseFloat(coord[1]));//创建坐标点
                            map.centerAndZoom(point, 15);//设置地图中心点,(15级==>500m)
                            map.setMinZoom(11);//设置地图允许的最小级别
                            map.addControl(new BMap.NavigationControl());// 添加平移缩放控件
                            map.addControl(new BMap.ScaleControl()); //比例尺
                            //map.disableDoubleClickZoom();//禁止鼠标双击放大地图
                            map.enableScrollWheelZoom();//允许鼠标滚动放大缩小

                            //创建标注
                            var marker = new BMap.Marker(point);
                            //标注点击事件监听
                            marker.addEventListener("click", function () {
                                this.openInfoWindow(infoWindow);//打开信息窗口
                            });
                            map.addOverlay(marker); //将标注添加到地图中

                            //信息框的内容,地址电话有就显示，没有不
                            var address = rs.address || '', tel = rs.tel || '',
                                content = $('<div class="cinemaMapPop"><p class="name">' + rs.name + '</p>');
                            if (address.length) {
                                content.append('<span>地址：</span><p>' + address + '</p>');
                            }
                            if (tel.length) {
                                tel = tel.cutString2(42, '...'); //3个021-61392918
                                content.append('<span>电话：</span><p>' + tel + '</p>');
                            }

                            //创建信息框
                            var infoWindow = new BMap.InfoWindow(content.get(0), {
                                enableCloseOnClick: false//点击地图信息框是否消失
                            });

                            //信息框打开事件监听
                            infoWindow.addEventListener("open", function () {
                                //替换关闭按钮icon（没找到设置的方法，只能出此下策）
                                $(this.getContent()).parent().parent().next().attr('src', Core.cdnUrl + '/images/closeIcon2.gif');
                            });

                            //点图窗口打开时，在标注处显示信息框
                            marker.openInfoWindow(infoWindow);

                        }
                    });

                }
            });
        },
        /*
         *loading面板 by tiangang 20130717
         *参数：【可选】
         *renderTo:父级容器
         *width：loading层宽度
         *height：loading层高度
         *
         *使用：Core.loadingPanel(settings);
         */
        loadingPanel: function (settings) {
            var ps = $.extend({
                renderTo: $(document.body),//内容承载区
                pStyle: null,//容器样式
                style: null//loading层样式
            }, settings);
            ps.renderTo = (typeof ps.renderTo == 'string' ? $(ps.renderTo) : ps.renderTo);

            //loading层
            var panel = $('<div class="loading"><div class="mask"></div><img src="' + Core.cdnUrl + '/images/loading3.gif?v=20130716" alt=""/></div>');

            var cacheRenderToStyleText = ps.renderTo.attr('style') || '';//记录父层style值

            //先让父级容器根据内容撑开，然下面获取其宽高  {'position':'relative','overflow':'hidden'}
            ps.renderTo.css({'position': 'relative', 'overflow': 'hidden', 'zoom': 1});
            !!ps.pStyle && ps.renderTo.css(ps.pStyle);

            //loading层的宽高 ，ie6下用100%没撑开,所以取父级宽高
            var w = ps.width,
                h = ps.height;
            if (!w) {
                w = $.isIE6 ? ps.renderTo.outerWidth() : '100%';
            }
            if (!h) {
                h = $.isIE6 ? ps.renderTo.outerHeight() : '100%';
            }
            panel.css({'width': w, 'height': h});
            !!ps.style && panel.css(ps.style);

            panel.appendTo(ps.renderTo);

            //loading层显示
            panel.show = function () {
                this.removeClass('none');
            };
            //loading层隐藏
            panel.hide = function () {
                this.addClass('none');
            };
            //loading层移除
            panel.clear = function () {
                //this.parent().attr('style',cacheRenderToStyleText);//还原父层style值 (ie下快速购票页有问题，先注释掉)
                this.remove();
            };
            return panel;

        },
        isSupport: {
            //判断浏览器是否支持transform属性
            transform: function () {
                //判断浏览器是否支持transform属性
                var modElem = document.createElement('modernizr');
                if (modElem.style['transform'] === undefined && modElem.style['-webkit-transform'] === undefined && modElem.style['-moz-transform'] === undefined && modElem.style['-ms-transform'] === undefined && modElem.style['-os-transform'] === undefined) {
                    $('html').addClass('notransform');
                    return false;
                }
                return true;
            }
        },
        //各个页面独立的初始化任务，需要在页面中覆盖
        myInit: $.noop,

        /*
         * 字符串转化为json对象，适用小数据量转化
         * 此处不对字符串进行安全检查，也不处理前后空格
         * 将\/Date(...)\/格式的外层斜线去掉以供js使用
         * $.parseJSON 也可进行json格式化，但是对输入检验比较严格，可以根据实际情况选择使用
         */
        parseJSON: function (data) {
            data = data.replace(/("|')\\?\/Date\((-?[0-9+]+)\)\\?\/\1/g, "new Date($2)");
            return (new Function("return " + data))();
        },

        /*
         * 发送ajax请求
         * get/post参数：
         * url		[必选]发送的请求url
         * data		[可选]发送的数据
         * callback	[可选]ajax回调，接受两个参数： errCode / data
         * key		[可选]并发控制锁，如果key是一个以 @开头的字符串，则表示去掉上一个同类型的ajax，否则就取消本次ajax除非上一个ajax完成
         *
         * getJSON/postJSON参数同上，只是callback增加一个错误码 3（json数据格式化失败），如果格式化成功，则data是格式化好的json数据
         */
        get: $.get2,
        post: $.post2,
        getJSON: $.getJSON2,
        postJSON: $.postJSON2,
        /*
         * 加载javascript/css
         * loadJS 参数：
         * url		[必选]要加载的资源，可以字符串或数组
         * chkFn	[可选]资源加载判断函数
         * callback	[可选]资源加载完毕的回调
         * charset	[可选]资源加载类型
         * cdnURL	[可选]资源目录
         *
         * loadCss 参数：
         * url		[必选]要加载的资源，可以字符串或数组
         * cdnURL	[可选]资源目录
         */
        loadJS: $.loadJS,
        loadCss: $.loadCss,
        loadCdnJS: function () {
            var arg = arguments;
            Array.prototype.push.call(arguments, this.cdnUrl);
            return this.loadJS.apply(this, arg);
        },
        loadCdnCss: function (url) {
            return this.loadCss(url, this.cdnUrl);
        },

        /*
         * ajax判断是否登录
         * 2012-11-01 马超 增加
         * 2013-05-04 马超 修改ajax的内容处理
         */
        isLogin: function (callback) {
            this.get("http://piao.163.com/movie/loginStatus.html", function (hasErr, txt) {
                //如果通讯失败，则检查cookie
                //txt 0未登录 登录会返回用户名
                var user = hasErr ? easyNav.isLogin() ? easyNav.account : "" : txt == "0" ? "" : txt;
                callback && callback.call(this, user);
            });
        },
        //包装登录接口，电影票登录全部改为无刷新登录，登录后默认刷新当前页面
        login: function (backUrl) {
            //this.easyNav.isLogin():根据urs的cookie判断登录状态；加参数true:根据后台传的userid和cookie判断

            var cb = function () {
                window.location.reload()
            };//默认刷新当前页面
            if ($.isFunction(backUrl)) {//参数为回调函数
                cb = backUrl;
            } else if (typeof backUrl == 'string') {//参数为目标调整地址
                cb = function () {
                    window.location.href = backUrl
                };
            }
            easyNav.login(cb);//调用登录接口
        },
        register: function (backUrl) {
            $.login.reg();
        },

        /**
         * CSS3检测
         */
        css3: {
            test: function (prop, prefixed) {
                var styleObj = document.createElement('div').style,
                    cssPrefixes = ['Webkit', 'Moz', 'O', 'ms'],
                    ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
                    props = (prop + ' ' + cssPrefixes.join(ucProp + ' ') + ucProp).split(' ');

                for (var i in props) {
                    if (styleObj[props[i]] !== undefined) {
                        return prefixed ? props[i] : true;
                    }
                }
                return prefixed ? '' : false;
            },
            getName: function (cssName) {
                var ret = '',
                    animEndEvtNames = {
                        'WebkitAnimation': 'webkitAnimationEnd',
                        'OAnimation': 'oAnimationEnd',
                        'msAnimation': 'MSAnimationEnd',
                        'animation': 'animationend'
                    };
                switch (cssName.toLowerCase()) {
                    case "animationend":
                        ret = animEndEvtNames[this.test("animation", true)];
                        break;
                    default:
                        ret = this.test(cssName, true);
                        break;
                }
                return ret;
            }
        }
    };

//引用到window
    return Core;
})(window, jQuery);

/*
 * 卸载事件
 */
jQuery(window).unload(function () {
    document.oncontextmenu = null;
    window.Core = null;
    window.onload = null;
    window.onresize = null;
    window.onunload = null;
    window.onerror = null;
    window.onbeforeunload = null;
    (window.CollectGarbage || function () {
    })();
});

//绑定页面完成监听
jQuery(document).ready(function () {
    Core.init && Core.init();
});
