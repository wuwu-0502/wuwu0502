(function () {
    var b = (function () {
        var e = {};
        var f = [];
        e.inc = function (h, g) {
            return true
        };
        e.register = function (i, g) {
            var l = i.split(".");
            var j = e;
            var h = null;
            while (h = l.shift()) {
                if (l.length) {
                    if (j[h] === undefined) {
                        j[h] = {}
                    }
                    j = j[h]
                } else {
                    if (j[h] === undefined) {
                        try {
                            j[h] = g(e)
                        } catch (m) {
                            f.push(m)
                        }
                    }
                }
            }
        };
        e.regShort = function (g, h) {
            if (e[g] !== undefined) {
                throw"[" + g + "] : short : has been register"
            }
            e[g] = h
        };
        e.IE = /msie/i.test(navigator.userAgent);
        e.E = function (g) {
            if (typeof g === "string") {
                return document.getElementById(g)
            } else {
                return g
            }
        };
        e.C = function (g) {
            var h;
            g = g.toUpperCase();
            if (g == "TEXT") {
                h = document.createTextNode("")
            } else {
                if (g == "BUFFER") {
                    h = document.createDocumentFragment()
                } else {
                    h = document.createElement(g)
                }
            }
            return h
        };
        e.log = function (g) {
            f.push("[" + ((new Date()).getTime() % 100000) + "]: " + g)
        };
        e.getErrorLogInformationList = function (g) {
            return f.splice(0, g || f.length)
        };
        return e
    })();
    $Import = b.inc;
    b.register("core.obj.parseParam", function (e) {
        return function (h, g, f) {
            var i, j = {};
            g = g || {};
            for (i in h) {
                j[i] = h[i];
                if (g[i] != null) {
                    if (f) {
                        if (h.hasOwnProperty[i]) {
                            j[i] = g[i]
                        }
                    } else {
                        j[i] = g[i]
                    }
                }
            }
            return j
        }
    });
    b.register("core.dom.isNode", function (e) {
        return function (f) {
            return (f != undefined) && Boolean(f.nodeName) && Boolean(f.nodeType)
        }
    });
    b.register("common.iframe", function (e) {
        return function (f) {
            var g = {};
            var i;
            var h = function (k) {
                var j = e.core.obj.parseParam({
                    id: "",
                    url: "",
                    name: "iframe_widget",
                    root: null,
                    width: "100%",
                    height: "100%"
                }, k);
                i = document.createElement("iframe");
                if (j.id) {
                    i.id = j.id
                }
                i.src = j.url;
                i.width = j.width;
                i.height = j.height;
                i.frameBorder = 0;
                i.scrolling = "no";
                i.marginHeight = "0";
                i.marginwidth = "0";
                i.allowTransparency = "true";
                if (e.core.dom.isNode(j.root)) {
                    j.root.innerHTML = "";
                    j.root.appendChild(i)
                } else {
                    throw"conf.root is not an avaliable dom element."
                }
            };
            g.insertIFrame = h;
            return g
        }
    });
    b.register("core.str.trim", function (e) {
        return function (i) {
            if (typeof i !== "string") {
                throw"trim need a string as parameter"
            }
            var f = i.length;
            var h = 0;
            var g = /(\u3000|\s|\t|\u00A0)/;
            while (h < f) {
                if (!g.test(i.charAt(h))) {
                    break
                }
                h += 1
            }
            while (f > h) {
                if (!g.test(i.charAt(f - 1))) {
                    break
                }
                f -= 1
            }
            return i.slice(h, f)
        }
    });
    b.register("core.json.jsonToQuery", function (e) {
        var f = function (h, g) {
            h = h == null ? "" : h;
            h = e.core.str.trim(h.toString());
            if (g) {
                return encodeURIComponent(h)
            } else {
                return h
            }
        };
        return function (m, j) {
            var n = [];
            if (typeof m == "object") {
                for (var h in m) {
                    if (h === "$nullName") {
                        n = n.concat(m[h]);
                        continue
                    }
                    if (m[h] instanceof Array) {
                        for (var l = 0, g = m[h].length; l < g; l++) {
                            n.push(h + "=" + f(m[h][l], j))
                        }
                    } else {
                        if (typeof m[h] != "function") {
                            n.push(h + "=" + f(m[h], j))
                        }
                    }
                }
            }
            if (n.length) {
                return n.join("&")
            } else {
                return ""
            }
        }
    });
    b.register("kit.extra.isNull", function (e) {
        return function (f) {
            f = f + "";
            return (f == null || f == "" || f == "undefined") ? true : false
        }
    });
    b.register("core.str.parseURL", function (e) {
        return function (h) {
            var g = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var m = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
            var k = g.exec(h);
            var l = {};
            for (var j = 0, f = m.length; j < f; j += 1) {
                l[m[j]] = k[j] || ""
            }
            return l
        }
    });
    b.register("core.arr.isArray", function (e) {
        return function (f) {
            return Object.prototype.toString.call(f) === "[object Array]"
        }
    });
    b.register("core.json.queryToJson", function (e) {
        return function (h, m) {
            var o = e.core.str.trim(h).split("&");
            var n = {};
            var g = function (i) {
                if (m) {
                    return decodeURIComponent(i)
                } else {
                    return i
                }
            };
            for (var k = 0, l = o.length; k < l; k++) {
                if (o[k]) {
                    var j = o[k].split("=");
                    var f = j[0];
                    var p = j[1];
                    if (j.length < 2) {
                        p = f;
                        f = "$nullName"
                    }
                    if (!n[f]) {
                        n[f] = g(p)
                    } else {
                        if (e.core.arr.isArray(n[f]) != true) {
                            n[f] = [n[f]]
                        }
                        n[f].push(g(p))
                    }
                }
            }
            return n
        }
    });
    b.register("core.util.URL", function (e) {
        return function (j, g) {
            var i = e.core.obj.parseParam({isEncodeQuery: false, isEncodeHash: false}, g || {});
            var h = {};
            var l = e.core.str.parseURL(j);
            var f = e.core.json.queryToJson(l.query);
            var k = e.core.json.queryToJson(l.hash);
            h.setParam = function (m, n) {
                f[m] = n;
                return this
            };
            h.getParam = function (m) {
                return f[m]
            };
            h.setParams = function (n) {
                for (var m in n) {
                    h.setParam(m, n[m])
                }
                return this
            };
            h.setHash = function (m, n) {
                k[m] = n;
                return this
            };
            h.getHash = function (m) {
                return k[m]
            };
            h.valueOf = h.toString = function () {
                var m = [];
                var n = e.core.json.jsonToQuery(f, i.isEncodeQuery);
                var o = e.core.json.jsonToQuery(k, i.isEncodeQuery);
                if (l.scheme != "") {
                    m.push(l.scheme + ":");
                    m.push(l.slash)
                }
                if (l.host != "") {
                    m.push(l.host);
                    if (l.port != "") {
                        m.push(":");
                        m.push(l.port)
                    }
                }
                m.push("/");
                m.push(l.path);
                if (n != "") {
                    m.push("?" + n)
                }
                if (o != "") {
                    m.push("#" + o)
                }
                return m.join("")
            };
            return h
        }
    });
    b.register("kit.extra.jsonToUrl", function (f) {
        var e = function (g) {
            if (typeof g != "string") {
                return g
            }
            if (g.toLowerCase() == "y") {
                return "1"
            } else {
                if (g.toLowerCase() == "n") {
                    return "0"
                } else {
                    return g
                }
            }
        };
        return function (m, j, l) {
            var h = l || e;
            var i = f.core.util.URL(j);
            for (var g in m) {
                if (!f.kit.extra.isNull(m[g])) {
                    if (h && typeof h == "function") {
                        i.setParam(g, h(m[g]))
                    } else {
                        i.setParam(g, m[g])
                    }
                }
            }
            return i
        }
    });
    b.register("core.dom.removeNode", function (e) {
        return function (f) {
            f = e.E(f) || f;
            try {
                f.parentNode.removeChild(f)
            } catch (g) {
            }
        }
    });
    b.register("core.util.getUniqueKey", function (g) {
        var e = (new Date()).getTime().toString(), f = 1;
        return function () {
            return e + (f++)
        }
    });
    b.register("core.func.empty", function () {
        return function () {
        }
    });
    b.register("core.io.scriptLoader", function (f) {
        var g = {};
        var e = {
            url: "",
            charset: "UTF-8",
            timeout: 30 * 1000,
            args: {},
            onComplete: f.core.func.empty,
            onTimeout: null,
            isEncode: false,
            uniqueID: null
        };
        return function (l) {
            var j, h;
            var i = f.core.obj.parseParam(e, l);
            if (i.url == "") {
                throw"scriptLoader: url is null"
            }
            var k = i.uniqueID || f.core.util.getUniqueKey();
            j = g[k];
            if (j != null && f.IE != true) {
                f.core.dom.removeNode(j);
                j = null
            }
            if (j == null) {
                j = g[k] = f.C("script")
            }
            j.charset = i.charset;
            j.id = "scriptRequest_script_" + k;
            j.type = "text/javascript";
            if (i.onComplete != null) {
                if (f.IE) {
                    j.onreadystatechange = function () {
                        if (j.readyState.toLowerCase() == "loaded" || j.readyState.toLowerCase() == "complete") {
                            try {
                                clearTimeout(h);
                                document.getElementsByTagName("head")[0].removeChild(j);
                                j.onreadystatechange = null
                            } catch (m) {
                            }
                            i.onComplete()
                        }
                    }
                } else {
                    j.onload = function () {
                        try {
                            clearTimeout(h);
                            f.core.dom.removeNode(j)
                        } catch (m) {
                        }
                        i.onComplete()
                    }
                }
            }
            j.src = b.core.util.URL(i.url, {isEncodeQuery: i.isEncode}).setParams(i.args);
            document.getElementsByTagName("head")[0].appendChild(j);
            if (i.timeout > 0 && i.onTimeout != null) {
                h = setTimeout(function () {
                    try {
                        document.getElementsByTagName("head")[0].removeChild(j)
                    } catch (m) {
                    }
                    i.onTimeout()
                }, i.timeout)
            }
            return j
        }
    });
    b.register("core.io.jsonp", function (e) {
        return function (j) {
            var h = e.core.obj.parseParam({
                url: "",
                charset: "UTF-8",
                timeout: 30 * 1000,
                args: {},
                onComplete: null,
                onTimeout: null,
                responseName: null,
                isEncode: false,
                varkey: "callback"
            }, j);
            var k = -1;
            var i = h.responseName || ("STK_" + e.core.util.getUniqueKey());
            h.args[h.varkey] = i;
            var f = h.onComplete;
            var g = h.onTimeout;
            window[i] = function (l) {
                if (k != 2 && f != null) {
                    k = 1;
                    f(l)
                }
            };
            h.onComplete = null;
            h.onTimeout = function () {
                if (k != 1 && g != null) {
                    k = 2;
                    g()
                }
            };
            return e.core.io.scriptLoader(h)
        }
    });
    b.register("core.dom.sizzle", function (o) {
        var u = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            n = 0, i = Object.prototype.toString, t = false, m = true;
        [0, 0].sort(function () {
            m = false;
            return 0
        });
        var g = function (A, e, D, E) {
            D = D || [];
            e = e || document;
            var G = e;
            if (e.nodeType !== 1 && e.nodeType !== 9) {
                return []
            }
            if (!A || typeof A !== "string") {
                return D
            }
            var B = [], x, I, L, w, z = true, y = g.isXML(e), F = A, H, K, J, C;
            do {
                u.exec("");
                x = u.exec(F);
                if (x) {
                    F = x[3];
                    B.push(x[1]);
                    if (x[2]) {
                        w = x[3];
                        break
                    }
                }
            } while (x);
            if (B.length > 1 && p.exec(A)) {
                if (B.length === 2 && j.relative[B[0]]) {
                    I = l(B[0] + B[1], e)
                } else {
                    I = j.relative[B[0]] ? [e] : g(B.shift(), e);
                    while (B.length) {
                        A = B.shift();
                        if (j.relative[A]) {
                            A += B.shift()
                        }
                        I = l(A, I)
                    }
                }
            } else {
                if (!E && B.length > 1 && e.nodeType === 9 && !y && j.match.ID.test(B[0]) && !j.match.ID.test(B[B.length - 1])) {
                    H = g.find(B.shift(), e, y);
                    e = H.expr ? g.filter(H.expr, H.set)[0] : H.set[0]
                }
                if (e) {
                    H = E ? {
                        expr: B.pop(),
                        set: f(E)
                    } : g.find(B.pop(), B.length === 1 && (B[0] === "~" || B[0] === "+") && e.parentNode ? e.parentNode : e, y);
                    I = H.expr ? g.filter(H.expr, H.set) : H.set;
                    if (B.length > 0) {
                        L = f(I)
                    } else {
                        z = false
                    }
                    while (B.length) {
                        K = B.pop();
                        J = K;
                        if (!j.relative[K]) {
                            K = ""
                        } else {
                            J = B.pop()
                        }
                        if (J == null) {
                            J = e
                        }
                        j.relative[K](L, J, y)
                    }
                } else {
                    L = B = []
                }
            }
            if (!L) {
                L = I
            }
            if (!L) {
                g.error(K || A)
            }
            if (i.call(L) === "[object Array]") {
                if (!z) {
                    D.push.apply(D, L)
                } else {
                    if (e && e.nodeType === 1) {
                        for (C = 0; L[C] != null; C++) {
                            if (L[C] && (L[C] === true || L[C].nodeType === 1 && g.contains(e, L[C]))) {
                                D.push(I[C])
                            }
                        }
                    } else {
                        for (C = 0; L[C] != null; C++) {
                            if (L[C] && L[C].nodeType === 1) {
                                D.push(I[C])
                            }
                        }
                    }
                }
            } else {
                f(L, D)
            }
            if (w) {
                g(w, G, D, E);
                g.uniqueSort(D)
            }
            return D
        };
        g.uniqueSort = function (w) {
            if (h) {
                t = m;
                w.sort(h);
                if (t) {
                    for (var e = 1; e < w.length; e++) {
                        if (w[e] === w[e - 1]) {
                            w.splice(e--, 1)
                        }
                    }
                }
            }
            return w
        };
        g.matches = function (e, w) {
            return g(e, null, null, w)
        };
        g.find = function (C, e, D) {
            var B;
            if (!C) {
                return []
            }
            for (var y = 0, x = j.order.length; y < x; y++) {
                var A = j.order[y], z;
                if ((z = j.leftMatch[A].exec(C))) {
                    var w = z[1];
                    z.splice(1, 1);
                    if (w.substr(w.length - 1) !== "\\") {
                        z[1] = (z[1] || "").replace(/\\/g, "");
                        B = j.find[A](z, e, D);
                        if (B != null) {
                            C = C.replace(j.match[A], "");
                            break
                        }
                    }
                }
            }
            if (!B) {
                B = e.getElementsByTagName("*")
            }
            return {set: B, expr: C}
        };
        g.filter = function (G, F, J, z) {
            var x = G, L = [], D = F, B, e, C = F && F[0] && g.isXML(F[0]);
            while (G && F.length) {
                for (var E in j.filter) {
                    if ((B = j.leftMatch[E].exec(G)) != null && B[2]) {
                        var w = j.filter[E], K, I, y = B[1];
                        e = false;
                        B.splice(1, 1);
                        if (y.substr(y.length - 1) === "\\") {
                            continue
                        }
                        if (D === L) {
                            L = []
                        }
                        if (j.preFilter[E]) {
                            B = j.preFilter[E](B, D, J, L, z, C);
                            if (!B) {
                                e = K = true
                            } else {
                                if (B === true) {
                                    continue
                                }
                            }
                        }
                        if (B) {
                            for (var A = 0; (I = D[A]) != null; A++) {
                                if (I) {
                                    K = w(I, B, A, D);
                                    var H = z ^ !!K;
                                    if (J && K != null) {
                                        if (H) {
                                            e = true
                                        } else {
                                            D[A] = false
                                        }
                                    } else {
                                        if (H) {
                                            L.push(I);
                                            e = true
                                        }
                                    }
                                }
                            }
                        }
                        if (K !== undefined) {
                            if (!J) {
                                D = L
                            }
                            G = G.replace(j.match[E], "");
                            if (!e) {
                                return []
                            }
                            break
                        }
                    }
                }
                if (G === x) {
                    if (e == null) {
                        g.error(G)
                    } else {
                        break
                    }
                }
                x = G
            }
            return D
        };
        g.error = function (e) {
            throw"Syntax error, unrecognized expression: " + e
        };
        var j = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {"class": "className", "for": "htmlFor"},
            attrHandle: {
                href: function (e) {
                    return e.getAttribute("href")
                }
            },
            relative: {
                "+": function (B, w) {
                    var y = typeof w === "string", A = y && !/\W/.test(w), C = y && !A;
                    if (A) {
                        w = w.toLowerCase()
                    }
                    for (var x = 0, e = B.length, z; x < e; x++) {
                        if ((z = B[x])) {
                            while ((z = z.previousSibling) && z.nodeType !== 1) {
                            }
                            B[x] = C || z && z.nodeName.toLowerCase() === w ? z || false : z === w
                        }
                    }
                    if (C) {
                        g.filter(w, B, true)
                    }
                }, ">": function (B, w) {
                    var z = typeof w === "string", A, x = 0, e = B.length;
                    if (z && !/\W/.test(w)) {
                        w = w.toLowerCase();
                        for (; x < e; x++) {
                            A = B[x];
                            if (A) {
                                var y = A.parentNode;
                                B[x] = y.nodeName.toLowerCase() === w ? y : false
                            }
                        }
                    } else {
                        for (; x < e; x++) {
                            A = B[x];
                            if (A) {
                                B[x] = z ? A.parentNode : A.parentNode === w
                            }
                        }
                        if (z) {
                            g.filter(w, B, true)
                        }
                    }
                }, "": function (y, w, A) {
                    var x = n++, e = v, z;
                    if (typeof w === "string" && !/\W/.test(w)) {
                        w = w.toLowerCase();
                        z = w;
                        e = s
                    }
                    e("parentNode", w, x, y, z, A)
                }, "~": function (y, w, A) {
                    var x = n++, e = v, z;
                    if (typeof w === "string" && !/\W/.test(w)) {
                        w = w.toLowerCase();
                        z = w;
                        e = s
                    }
                    e("previousSibling", w, x, y, z, A)
                }
            },
            find: {
                ID: function (w, x, y) {
                    if (typeof x.getElementById !== "undefined" && !y) {
                        var e = x.getElementById(w[1]);
                        return e ? [e] : []
                    }
                }, NAME: function (x, A) {
                    if (typeof A.getElementsByName !== "undefined") {
                        var w = [], z = A.getElementsByName(x[1]);
                        for (var y = 0, e = z.length; y < e; y++) {
                            if (z[y].getAttribute("name") === x[1]) {
                                w.push(z[y])
                            }
                        }
                        return w.length === 0 ? null : w
                    }
                }, TAG: function (e, w) {
                    return w.getElementsByTagName(e[1])
                }
            },
            preFilter: {
                CLASS: function (y, w, x, e, B, C) {
                    y = " " + y[1].replace(/\\/g, "") + " ";
                    if (C) {
                        return y
                    }
                    for (var z = 0, A; (A = w[z]) != null; z++) {
                        if (A) {
                            if (B ^ (A.className && (" " + A.className + " ").replace(/[\t\n]/g, " ").indexOf(y) >= 0)) {
                                if (!x) {
                                    e.push(A)
                                }
                            } else {
                                if (x) {
                                    w[z] = false
                                }
                            }
                        }
                    }
                    return false
                }, ID: function (e) {
                    return e[1].replace(/\\/g, "")
                }, TAG: function (w, e) {
                    return w[1].toLowerCase()
                }, CHILD: function (e) {
                    if (e[1] === "nth") {
                        var w = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(e[2] === "even" && "2n" || e[2] === "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
                        e[2] = (w[1] + (w[2] || 1)) - 0;
                        e[3] = w[3] - 0
                    }
                    e[0] = n++;
                    return e
                }, ATTR: function (z, w, x, e, A, B) {
                    var y = z[1].replace(/\\/g, "");
                    if (!B && j.attrMap[y]) {
                        z[1] = j.attrMap[y]
                    }
                    if (z[2] === "~=") {
                        z[4] = " " + z[4] + " "
                    }
                    return z
                }, PSEUDO: function (z, w, x, e, A) {
                    if (z[1] === "not") {
                        if ((u.exec(z[3]) || "").length > 1 || /^\w/.test(z[3])) {
                            z[3] = g(z[3], null, null, w)
                        } else {
                            var y = g.filter(z[3], w, x, true ^ A);
                            if (!x) {
                                e.push.apply(e, y)
                            }
                            return false
                        }
                    } else {
                        if (j.match.POS.test(z[0]) || j.match.CHILD.test(z[0])) {
                            return true
                        }
                    }
                    return z
                }, POS: function (e) {
                    e.unshift(true);
                    return e
                }
            },
            filters: {
                enabled: function (e) {
                    return e.disabled === false && e.type !== "hidden"
                }, disabled: function (e) {
                    return e.disabled === true
                }, checked: function (e) {
                    return e.checked === true
                }, selected: function (e) {
                    e.parentNode.selectedIndex;
                    return e.selected === true
                }, parent: function (e) {
                    return !!e.firstChild
                }, empty: function (e) {
                    return !e.firstChild
                }, has: function (x, w, e) {
                    return !!g(e[3], x).length
                }, header: function (e) {
                    return (/h\d/i).test(e.nodeName)
                }, text: function (e) {
                    return "text" === e.type
                }, radio: function (e) {
                    return "radio" === e.type
                }, checkbox: function (e) {
                    return "checkbox" === e.type
                }, file: function (e) {
                    return "file" === e.type
                }, password: function (e) {
                    return "password" === e.type
                }, submit: function (e) {
                    return "submit" === e.type
                }, image: function (e) {
                    return "image" === e.type
                }, reset: function (e) {
                    return "reset" === e.type
                }, button: function (e) {
                    return "button" === e.type || e.nodeName.toLowerCase() === "button"
                }, input: function (e) {
                    return (/input|select|textarea|button/i).test(e.nodeName)
                }
            },
            setFilters: {
                first: function (w, e) {
                    return e === 0
                }, last: function (x, w, e, y) {
                    return w === y.length - 1
                }, even: function (w, e) {
                    return e % 2 === 0
                }, odd: function (w, e) {
                    return e % 2 === 1
                }, lt: function (x, w, e) {
                    return w < e[3] - 0
                }, gt: function (x, w, e) {
                    return w > e[3] - 0
                }, nth: function (x, w, e) {
                    return e[3] - 0 === w
                }, eq: function (x, w, e) {
                    return e[3] - 0 === w
                }
            },
            filter: {
                PSEUDO: function (x, C, B, D) {
                    var e = C[1], w = j.filters[e];
                    if (w) {
                        return w(x, B, C, D)
                    } else {
                        if (e === "contains") {
                            return (x.textContent || x.innerText || g.getText([x]) || "").indexOf(C[3]) >= 0
                        } else {
                            if (e === "not") {
                                var y = C[3];
                                for (var A = 0, z = y.length; A < z; A++) {
                                    if (y[A] === x) {
                                        return false
                                    }
                                }
                                return true
                            } else {
                                g.error("Syntax error, unrecognized expression: " + e)
                            }
                        }
                    }
                }, CHILD: function (e, y) {
                    var B = y[1], w = e;
                    switch (B) {
                        case"only":
                        case"first":
                            while ((w = w.previousSibling)) {
                                if (w.nodeType === 1) {
                                    return false
                                }
                            }
                            if (B === "first") {
                                return true
                            }
                            w = e;
                        case"last":
                            while ((w = w.nextSibling)) {
                                if (w.nodeType === 1) {
                                    return false
                                }
                            }
                            return true;
                        case"nth":
                            var x = y[2], E = y[3];
                            if (x === 1 && E === 0) {
                                return true
                            }
                            var A = y[0], D = e.parentNode;
                            if (D && (D.sizcache !== A || !e.nodeIndex)) {
                                var z = 0;
                                for (w = D.firstChild; w; w = w.nextSibling) {
                                    if (w.nodeType === 1) {
                                        w.nodeIndex = ++z
                                    }
                                }
                                D.sizcache = A
                            }
                            var C = e.nodeIndex - E;
                            if (x === 0) {
                                return C === 0
                            } else {
                                return (C % x === 0 && C / x >= 0)
                            }
                    }
                }, ID: function (w, e) {
                    return w.nodeType === 1 && w.getAttribute("id") === e
                }, TAG: function (w, e) {
                    return (e === "*" && w.nodeType === 1) || w.nodeName.toLowerCase() === e
                }, CLASS: function (w, e) {
                    return (" " + (w.className || w.getAttribute("class")) + " ").indexOf(e) > -1
                }, ATTR: function (A, y) {
                    var x = y[1], e = j.attrHandle[x] ? j.attrHandle[x](A) : A[x] != null ? A[x] : A.getAttribute(x),
                        B = e + "", z = y[2], w = y[4];
                    return e == null ? z === "!=" : z === "=" ? B === w : z === "*=" ? B.indexOf(w) >= 0 : z === "~=" ? (" " + B + " ").indexOf(w) >= 0 : !w ? B && e !== false : z === "!=" ? B !== w : z === "^=" ? B.indexOf(w) === 0 : z === "$=" ? B.substr(B.length - w.length) === w : z === "|=" ? B === w || B.substr(0, w.length + 1) === w + "-" : false
                }, POS: function (z, w, x, A) {
                    var e = w[2], y = j.setFilters[e];
                    if (y) {
                        return y(z, x, w, A)
                    }
                }
            }
        };
        g.selectors = j;
        var p = j.match.POS, k = function (w, e) {
            return "\\" + (e - 0 + 1)
        };
        for (var r in j.match) {
            j.match[r] = new RegExp(j.match[r].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
            j.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + j.match[r].source.replace(/\\(\d+)/g, k))
        }
        var f = function (w, e) {
            w = Array.prototype.slice.call(w, 0);
            if (e) {
                e.push.apply(e, w);
                return e
            }
            return w
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType
        } catch (q) {
            f = function (z, y) {
                var w = y || [], x = 0;
                if (i.call(z) === "[object Array]") {
                    Array.prototype.push.apply(w, z)
                } else {
                    if (typeof z.length === "number") {
                        for (var e = z.length; x < e; x++) {
                            w.push(z[x])
                        }
                    } else {
                        for (; z[x]; x++) {
                            w.push(z[x])
                        }
                    }
                }
                return w
            }
        }
        var h;
        if (document.documentElement.compareDocumentPosition) {
            h = function (w, e) {
                if (!w.compareDocumentPosition || !e.compareDocumentPosition) {
                    if (w == e) {
                        t = true
                    }
                    return w.compareDocumentPosition ? -1 : 1
                }
                var x = w.compareDocumentPosition(e) & 4 ? -1 : w === e ? 0 : 1;
                if (x === 0) {
                    t = true
                }
                return x
            }
        } else {
            if ("sourceIndex" in document.documentElement) {
                h = function (w, e) {
                    if (!w.sourceIndex || !e.sourceIndex) {
                        if (w == e) {
                            t = true
                        }
                        return w.sourceIndex ? -1 : 1
                    }
                    var x = w.sourceIndex - e.sourceIndex;
                    if (x === 0) {
                        t = true
                    }
                    return x
                }
            } else {
                if (document.createRange) {
                    h = function (y, w) {
                        if (!y.ownerDocument || !w.ownerDocument) {
                            if (y == w) {
                                t = true
                            }
                            return y.ownerDocument ? -1 : 1
                        }
                        var x = y.ownerDocument.createRange(), e = w.ownerDocument.createRange();
                        x.setStart(y, 0);
                        x.setEnd(y, 0);
                        e.setStart(w, 0);
                        e.setEnd(w, 0);
                        var z = x.compareBoundaryPoints(Range.START_TO_END, e);
                        if (z === 0) {
                            t = true
                        }
                        return z
                    }
                }
            }
        }
        g.getText = function (e) {
            var w = "", y;
            for (var x = 0; e[x]; x++) {
                y = e[x];
                if (y.nodeType === 3 || y.nodeType === 4) {
                    w += y.nodeValue
                } else {
                    if (y.nodeType !== 8) {
                        w += g.getText(y.childNodes)
                    }
                }
            }
            return w
        };
        (function () {
            var w = document.createElement("div"), x = "script" + (new Date()).getTime();
            w.innerHTML = "<a name='" + x + "'/>";
            var e = document.documentElement;
            e.insertBefore(w, e.firstChild);
            if (document.getElementById(x)) {
                j.find.ID = function (z, A, B) {
                    if (typeof A.getElementById !== "undefined" && !B) {
                        var y = A.getElementById(z[1]);
                        return y ? y.id === z[1] || typeof y.getAttributeNode !== "undefined" && y.getAttributeNode("id").nodeValue === z[1] ? [y] : undefined : []
                    }
                };
                j.filter.ID = function (A, y) {
                    var z = typeof A.getAttributeNode !== "undefined" && A.getAttributeNode("id");
                    return A.nodeType === 1 && z && z.nodeValue === y
                }
            }
            e.removeChild(w);
            e = w = null
        })();
        (function () {
            var e = document.createElement("div");
            e.appendChild(document.createComment(""));
            if (e.getElementsByTagName("*").length > 0) {
                j.find.TAG = function (w, A) {
                    var z = A.getElementsByTagName(w[1]);
                    if (w[1] === "*") {
                        var y = [];
                        for (var x = 0; z[x]; x++) {
                            if (z[x].nodeType === 1) {
                                y.push(z[x])
                            }
                        }
                        z = y
                    }
                    return z
                }
            }
            e.innerHTML = "<a href='#'></a>";
            if (e.firstChild && typeof e.firstChild.getAttribute !== "undefined" && e.firstChild.getAttribute("href") !== "#") {
                j.attrHandle.href = function (w) {
                    return w.getAttribute("href", 2)
                }
            }
            e = null
        })();
        if (document.querySelectorAll) {
            (function () {
                var e = g, x = document.createElement("div");
                x.innerHTML = "<p class='TEST'></p>";
                if (x.querySelectorAll && x.querySelectorAll(".TEST").length === 0) {
                    return
                }
                g = function (B, A, y, z) {
                    A = A || document;
                    if (!z && A.nodeType === 9 && !g.isXML(A)) {
                        try {
                            return f(A.querySelectorAll(B), y)
                        } catch (C) {
                        }
                    }
                    return e(B, A, y, z)
                };
                for (var w in e) {
                    g[w] = e[w]
                }
                x = null
            })()
        }
        (function () {
            var e = document.createElement("div");
            e.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!e.getElementsByClassName || e.getElementsByClassName("e").length === 0) {
                return
            }
            e.lastChild.className = "e";
            if (e.getElementsByClassName("e").length === 1) {
                return
            }
            j.order.splice(1, 0, "CLASS");
            j.find.CLASS = function (w, x, y) {
                if (typeof x.getElementsByClassName !== "undefined" && !y) {
                    return x.getElementsByClassName(w[1])
                }
            };
            e = null
        })();
        function s(w, B, A, E, C, D) {
            for (var y = 0, x = E.length; y < x; y++) {
                var e = E[y];
                if (e) {
                    e = e[w];
                    var z = false;
                    while (e) {
                        if (e.sizcache === A) {
                            z = E[e.sizset];
                            break
                        }
                        if (e.nodeType === 1 && !D) {
                            e.sizcache = A;
                            e.sizset = y
                        }
                        if (e.nodeName.toLowerCase() === B) {
                            z = e;
                            break
                        }
                        e = e[w]
                    }
                    E[y] = z
                }
            }
        }

        function v(w, B, A, E, C, D) {
            for (var y = 0, x = E.length; y < x; y++) {
                var e = E[y];
                if (e) {
                    e = e[w];
                    var z = false;
                    while (e) {
                        if (e.sizcache === A) {
                            z = E[e.sizset];
                            break
                        }
                        if (e.nodeType === 1) {
                            if (!D) {
                                e.sizcache = A;
                                e.sizset = y
                            }
                            if (typeof B !== "string") {
                                if (e === B) {
                                    z = true;
                                    break
                                }
                            } else {
                                if (g.filter(B, [e]).length > 0) {
                                    z = e;
                                    break
                                }
                            }
                        }
                        e = e[w]
                    }
                    E[y] = z
                }
            }
        }

        g.contains = document.compareDocumentPosition ? function (w, e) {
            return !!(w.compareDocumentPosition(e) & 16)
        } : function (w, e) {
            return w !== e && (w.contains ? w.contains(e) : true)
        };
        g.isXML = function (e) {
            var w = (e ? e.ownerDocument || e : 0).documentElement;
            return w ? w.nodeName !== "HTML" : false
        };
        var l = function (e, C) {
            var y = [], z = "", A, x = C.nodeType ? [C] : C;
            while ((A = j.match.PSEUDO.exec(e))) {
                z += A[0];
                e = e.replace(j.match.PSEUDO, "")
            }
            e = j.relative[e] ? e + "*" : e;
            for (var B = 0, w = x.length; B < w; B++) {
                g(e, x[B], y)
            }
            return g.filter(z, y)
        };
        return g
    });
    b.register("core.dom.contains", function (e) {
        return function (f, g) {
            if (f === g) {
                return false
            } else {
                if (f.compareDocumentPosition) {
                    return ((f.compareDocumentPosition(g) & 16) === 16)
                } else {
                    if (f.contains && g.nodeType === 1) {
                        return f.contains(g)
                    } else {
                        while (g = g.parentNode) {
                            if (f === g) {
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    });
    b.register("core.evt.addEvent", function (e) {
        return function (f, i, h) {
            var g = e.E(f);
            if (g == null) {
                return false
            }
            i = i || "click";
            if ((typeof h).toLowerCase() != "function") {
                return
            }
            if (g.addEventListener) {
                g.addEventListener(i, h, false)
            } else {
                if (g.attachEvent) {
                    g.attachEvent("on" + i, h)
                } else {
                    g["on" + i] = h
                }
            }
            return true
        }
    });
    b.register("core.evt.removeEvent", function (e) {
        return function (g, i, h, f) {
            var j = e.E(g);
            if (j == null) {
                return false
            }
            if (typeof h != "function") {
                return false
            }
            if (j.removeEventListener) {
                j.removeEventListener(i, h, f)
            } else {
                if (j.detachEvent) {
                    j.detachEvent("on" + i, h)
                } else {
                    j["on" + i] = null
                }
            }
            return true
        }
    });
    b.register("core.util.browser", function (l) {
        var f = navigator.userAgent.toLowerCase();
        var p = window.external || "";
        var h, i, j, q, k;
        var g = function (e) {
            var m = 0;
            return parseFloat(e.replace(/\./g, function () {
                return (m++ == 1) ? "" : "."
            }))
        };
        try {
            if ((/windows|win32/i).test(f)) {
                k = "windows"
            } else {
                if ((/macintosh/i).test(f)) {
                    k = "macintosh"
                } else {
                    if ((/rhino/i).test(f)) {
                        k = "rhino"
                    }
                }
            }
            if ((i = f.match(/applewebkit\/([^\s]*)/)) && i[1]) {
                h = "webkit";
                q = g(i[1])
            } else {
                if ((i = f.match(/presto\/([\d.]*)/)) && i[1]) {
                    h = "presto";
                    q = g(i[1])
                } else {
                    if (i = f.match(/msie\s([^;]*)/)) {
                        h = "trident";
                        q = 1;
                        if ((i = f.match(/trident\/([\d.]*)/)) && i[1]) {
                            q = g(i[1])
                        }
                    } else {
                        if (/gecko/.test(f)) {
                            h = "gecko";
                            q = 1;
                            if ((i = f.match(/rv:([\d.]*)/)) && i[1]) {
                                q = g(i[1])
                            }
                        }
                    }
                }
            }
            if (/world/.test(f)) {
                j = "world"
            } else {
                if (/360se/.test(f)) {
                    j = "360"
                } else {
                    if ((/maxthon/.test(f)) || typeof p.max_version == "number") {
                        j = "maxthon"
                    } else {
                        if (/tencenttraveler\s([\d.]*)/.test(f)) {
                            j = "tt"
                        } else {
                            if (/se\s([\d.]*)/.test(f)) {
                                j = "sogou"
                            }
                        }
                    }
                }
            }
        } catch (o) {
        }
        var n = {
            OS: k,
            CORE: h,
            Version: q,
            EXTRA: (j ? j : false),
            IE: /msie/.test(f),
            OPERA: /opera/.test(f),
            MOZ: /gecko/.test(f) && !/(compatible|webkit)/.test(f),
            IE5: /msie 5 /.test(f),
            IE55: /msie 5.5/.test(f),
            IE6: /msie 6/.test(f),
            IE7: /msie 7/.test(f),
            IE8: /msie 8/.test(f),
            IE9: /msie 9/.test(f),
            SAFARI: !/chrome\/([\d.]*)/.test(f) && /\/([\d.]*) safari/.test(f),
            CHROME: /chrome\/([\d.]*)/.test(f),
            IPAD: /\(ipad/i.test(f),
            IPHONE: /\(iphone/i.test(f),
            ITOUCH: /\(itouch/i.test(f),
            MOBILE: /mobile/i.test(f)
        };
        return n
    });
    b.register("core.evt.getEvent", function (e) {
        return function () {
            if (e.IE) {
                return window.event
            } else {
                if (window.event) {
                    return window.event
                }
                var g = arguments.callee.caller;
                var f;
                var h = 0;
                while (g != null && h < 40) {
                    f = g.arguments[0];
                    if (f && (f.constructor == Event || f.constructor == MouseEvent || f.constructor == KeyboardEvent)) {
                        return f
                    }
                    h++;
                    g = g.caller
                }
                return f
            }
        }
    });
    b.register("core.evt.fixEvent", function (e) {
        return function (f) {
            f = f || e.core.evt.getEvent();
            if (!f.target) {
                f.target = f.srcElement;
                f.pageX = f.x;
                f.pageY = f.y
            }
            if (typeof f.layerX == "undefined") {
                f.layerX = f.offsetX
            }
            if (typeof f.layerY == "undefined") {
                f.layerY = f.offsetY
            }
            return f
        }
    });
    b.register("core.obj.isEmpty", function (e) {
        return function (i, h) {
            var g = true;
            for (var f in i) {
                if (h) {
                    g = false;
                    break
                } else {
                    if (i.hasOwnProperty(f)) {
                        g = false;
                        break
                    }
                }
            }
            return g
        }
    });
    b.register("core.evt.delegatedEvent", function (f) {
        var e = function (k, j) {
            for (var h = 0, g = k.length; h < g; h += 1) {
                if (f.core.dom.contains(k[h], j)) {
                    return true
                }
            }
            return false
        };
        return function (i, l) {
            if (!f.core.dom.isNode(i)) {
                throw"core.evt.delegatedEvent need an Element as first Parameter"
            }
            if (!l) {
                l = []
            }
            if (!f.core.arr.isArray(l)) {
                l = [l]
            }
            var g = {};
            var k = function (p) {
                var m = f.core.evt.fixEvent(p);
                var o = m.target;
                var n = p.type;
                h(o, n, m)
            };
            var h = function (q, p, n) {
                var o = null;
                var r = function () {
                    var u, s, t;
                    u = q.getAttribute("action-target");
                    if (u) {
                        s = f.core.dom.sizzle(u, i);
                        if (s.length) {
                            t = n.target = s[0]
                        }
                    }
                    r = f.core.func.empty;
                    return t
                };
                var m = function () {
                    var s = r() || q;
                    if (g[p] && g[p][o]) {
                        return g[p][o]({
                            evt: n,
                            el: s,
                            box: i,
                            data: f.core.json.queryToJson(s.getAttribute("action-data") || "")
                        })
                    } else {
                        return true
                    }
                };
                if (e(l, q)) {
                    return false
                } else {
                    if (!f.core.dom.contains(i, q)) {
                        return false
                    } else {
                        while (q && q !== i) {
                            if (q.nodeType === 1) {
                                o = q.getAttribute("action-type");
                                if (o && m() === false) {
                                    break
                                }
                            }
                            q = q.parentNode
                        }
                    }
                }
            };
            var j = {};
            j.add = function (o, p, n) {
                if (!g[p]) {
                    g[p] = {};
                    f.core.evt.addEvent(i, p, k)
                }
                var m = g[p];
                m[o] = n
            };
            j.remove = function (m, n) {
                if (g[n]) {
                    delete g[n][m];
                    if (f.core.obj.isEmpty(g[n])) {
                        delete g[n];
                        f.core.evt.removeEvent(i, n, k)
                    }
                }
            };
            j.pushExcept = function (m) {
                l.push(m)
            };
            j.removeExcept = function (o) {
                if (!o) {
                    l = []
                } else {
                    for (var n = 0, m = l.length; n < m; n += 1) {
                        if (l[n] === o) {
                            l.splice(n, 1)
                        }
                    }
                }
            };
            j.clearExcept = function (m) {
                l = []
            };
            j.fireAction = function (n, q, m, p) {
                var o = "";
                if (p && p.actionData) {
                    o = p.actionData
                }
                if (g[q] && g[q][n]) {
                    g[q][n]({evt: m, el: null, box: i, data: f.core.json.queryToJson(o), fireFrom: "fireAction"})
                }
            };
            j.fireInject = function (p, q, m) {
                var n = p.getAttribute("action-type");
                var o = p.getAttribute("action-data");
                if (n && g[q] && g[q][n]) {
                    g[q][n]({evt: m, el: p, box: i, data: f.core.json.queryToJson(o || ""), fireFrom: "fireInject"})
                }
            };
            j.fireDom = function (n, o, m) {
                h(n, o, m || {})
            };
            j.destroy = function () {
                for (var n in g) {
                    for (var m in g[n]) {
                        delete g[n][m]
                    }
                    delete g[n];
                    f.core.evt.removeEvent(i, n, k)
                }
            };
            return j
        }
    });
    b.register("core.util.easyTemplate", function (f) {
        var e = function (h, j) {
            if (!h) {
                return ""
            }
            if (h !== e.template) {
                e.template = h;
                e.aStatement = e.parsing(e.separate(h))
            }
            var g = e.aStatement;
            var i = function (k) {
                if (k) {
                    j = k
                }
                return arguments.callee
            };
            i.toString = function () {
                return (new Function(g[0], g[1]))(j)
            };
            return i
        };
        e.separate = function (g) {
            var i = /\\'/g;
            var h = g.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g, function (k, j, q, p, o, n, m, l) {
                if (j) {
                    return "{|}" + (q ? "-" : "+") + p + "{|}"
                }
                if (o) {
                    return "\\'"
                }
                if (n) {
                    return ""
                }
                if (m) {
                    return "'+(" + l.replace(i, "'") + ")+'"
                }
            });
            return h
        };
        e.parsing = function (p) {
            var o, i, l, h, k, j, m, n = ["var aRet = [];"];
            m = p.split(/\{\|\}/);
            var g = /\s/;
            while (m.length) {
                l = m.shift();
                if (!l) {
                    continue
                }
                k = l.charAt(0);
                if (k !== "+" && k !== "-") {
                    l = "'" + l + "'";
                    n.push("aRet.push(" + l + ");");
                    continue
                }
                h = l.split(g);
                switch (h[0]) {
                    case"+et":
                        o = h[1];
                        i = h[2];
                        n.push('aRet.push("<!--' + o + ' start-->");');
                        break;
                    case"-et":
                        n.push('aRet.push("<!--' + o + ' end-->");');
                        break;
                    case"+if":
                        h.splice(0, 1);
                        n.push("if" + h.join(" ") + "{");
                        break;
                    case"+elseif":
                        h.splice(0, 1);
                        n.push("}else if" + h.join(" ") + "{");
                        break;
                    case"-if":
                        n.push("}");
                        break;
                    case"+else":
                        n.push("}else{");
                        break;
                    case"+list":
                        n.push("if(" + h[1] + ".constructor === Array){with({i:0,l:" + h[1] + ".length," + h[3] + "_index:0," + h[3] + ":null}){for(i=l;i--;){" + h[3] + "_index=(l-i-1);" + h[3] + "=" + h[1] + "[" + h[3] + "_index];");
                        break;
                    case"-list":
                        n.push("}}}");
                        break;
                    default:
                        break
                }
            }
            n.push('return aRet.join("");');
            return [i, n.join("")]
        };
        return e
    });
    b.register("core.arr.indexOf", function (e) {
        return function (h, j) {
            if (j.indexOf) {
                return j.indexOf(h)
            }
            for (var g = 0, f = j.length; g < f; g++) {
                if (j[g] === h) {
                    return g
                }
            }
            return -1
        }
    });
    b.register("core.arr.inArray", function (e) {
        return function (f, g) {
            return e.core.arr.indexOf(f, g) > -1
        }
    });
    b.register("core.func.getType", function (e) {
        return function (f) {
            var g;
            return ((g = typeof(f)) == "object" ? f == null && "null" || Object.prototype.toString.call(f).slice(8, -1) : g).toLowerCase()
        }
    });
    b.register("core.dom.builder", function (e) {
        function f(n, j) {
            if (j) {
                return j
            }
            var i, l = /\<(\w+)[^>]*\s+node-type\s*=\s*([\'\"])?(\w+)\2.*?>/g;
            var k = {};
            var m, h, g;
            while ((i = l.exec(n))) {
                h = i[1];
                m = i[3];
                g = h + "[node-type=" + m + "]";
                k[m] = k[m] == null ? [] : k[m];
                if (!e.core.arr.inArray(g, k[m])) {
                    k[m].push(h + "[node-type=" + m + "]")
                }
            }
            return k
        }

        return function (k, j) {
            var g = e.core.func.getType(k) == "string";
            var n = f(g ? k : k.innerHTML, j);
            var h = k;
            if (g) {
                h = e.C("div");
                h.innerHTML = k
            }
            var o, m, l;
            l = e.core.dom.sizzle("[node-type]", h);
            m = {};
            for (o in n) {
                m[o] = e.core.dom.sizzle.matches(n[o].toString(), l)
            }
            var i = k;
            if (g) {
                i = e.C("buffer");
                while (h.children[0]) {
                    i.appendChild(h.children[0])
                }
            }
            return {box: i, list: m}
        }
    });
    b.register("core.util.scrollPos", function (e) {
        return function (h) {
            h = h || document;
            var f = h.documentElement;
            var g = h.body;
            return {
                top: Math.max(window.pageYOffset || 0, f.scrollTop, g.scrollTop),
                left: Math.max(window.pageXOffset || 0, f.scrollLeft, g.scrollLeft)
            }
        }
    });
    b.register("core.dom.position", function (g) {
        var e = function (k) {
            var l, j, i, h, n, m;
            l = k.getBoundingClientRect();
            j = g.core.util.scrollPos();
            i = k.ownerDocument.body;
            h = k.ownerDocument.documentElement;
            n = h.clientTop || i.clientTop || 0;
            m = h.clientLeft || i.clientLeft || 0;
            return {l: parseInt(l.left + j.left - m, 10) || 0, t: parseInt(l.top + j.top - n, 10) || 0}
        };
        var f = function (j, h) {
            var k, i;
            k = [j.offsetLeft, j.offsetTop];
            i = j.offsetParent;
            if (i !== j && i !== h) {
                while (i) {
                    k[0] += i.offsetLeft;
                    k[1] += i.offsetTop;
                    i = i.offsetParent
                }
            }
            if (g.core.util.browser.OPERA != -1 || (g.core.util.browser.SAFARI != -1 && j.style.position == "absolute")) {
                k[0] -= document.body.offsetLeft;
                k[1] -= document.body.offsetTop
            }
            if (j.parentNode) {
                i = j.parentNode
            } else {
                i = null
            }
            while (i && !/^body|html$/i.test(i.tagName) && i !== h) {
                if (i.style.display.search(/^inline|table-row.*$/i)) {
                    k[0] -= i.scrollLeft;
                    k[1] -= i.scrollTop
                }
                i = i.parentNode
            }
            return {l: parseInt(k[0], 10), t: parseInt(k[1], 10)}
        };
        return function (j, h) {
            if (j == document.body) {
                return false
            }
            if (j.parentNode == null) {
                return false
            }
            if (j.style.display == "none") {
                return false
            }
            var i = g.core.obj.parseParam({parent: null}, h);
            if (j.getBoundingClientRect) {
                if (i.parent) {
                    var l = e(j);
                    var k = e(i.parent);
                    return {l: l.l - k.l, t: l.t - k.t}
                } else {
                    return e(j)
                }
            } else {
                return f(j, i.parent || document.body)
            }
        }
    });
    b.register("core.util.hideContainer", function (g) {
        var h;
        var e = function () {
            if (h) {
                return
            }
            h = g.C("div");
            h.style.cssText = "position:absolute;top:-9999px;left:-9999px;";
            document.getElementsByTagName("head")[0].appendChild(h)
        };
        var f = {
            appendChild: function (i) {
                if (g.core.dom.isNode(i)) {
                    e();
                    h.appendChild(i)
                }
            }, removeChild: function (i) {
                if (g.core.dom.isNode(i)) {
                    h && h.removeChild(i)
                }
            }
        };
        return f
    });
    b.register("core.dom.getSize", function (f) {
        var e = function (h) {
            if (!f.core.dom.isNode(h)) {
                throw"core.dom.getSize need Element as first parameter"
            }
            return {width: h.offsetWidth, height: h.offsetHeight}
        };
        var g = function (i) {
            var h = null;
            if (i.style.display === "none") {
                i.style.visibility = "hidden";
                i.style.display = "";
                h = e(i);
                i.style.display = "none";
                i.style.visibility = "visible"
            } else {
                h = e(i)
            }
            return h
        };
        return function (i) {
            var h = {};
            if (!i.parentNode) {
                f.core.util.hideContainer.appendChild(i);
                h = g(i);
                f.core.util.hideContainer.removeChild(i)
            } else {
                h = g(i)
            }
            return h
        }
    });
    b.register("kit.dom.parseDOM", function (e) {
        return function (g) {
            for (var f in g) {
                if (g[f] && (g[f].length == 1)) {
                    g[f] = g[f][0]
                }
            }
            return g
        }
    });
    b.register("template.social.template", function (k) {
        var j = {};
        var g = '<#et temp config><#if (config.showbutton == "y") ><a action-type="share" href="javascript:;" class="shareButton_btn"><img alt="share" src="http://img.t.sinajs.cn/t4/appstyle/widget/images/shareButton/shareButton_21.png"></a><#else><a action-type="share" href="javascript:;" class="shareButton_btn"><span title="微博" class="WB_logo16a">微博</span></a></#if></#et>';
        var i = '<#et temp config><div class="WB_widgets social_followBtn social_followBtn_layer social_active" node-type="outer"><div class="soca_wrap"><div class="soac_follow"><div class="WB_FB_show clearfix ${config.showbutton == "y" ? "" : "FB_show_07"} " node-type="inner" style="display:none;"><div node-type="button" class="shareButton ${config.showbutton == "n" ? "shareButton_type06" : "shareButton_type07"} clearfix" style="float:left"></div></div><div class="soca_loading" node-type="loading" ><span class="WB_loadingB"></span></div></div></div></div></#et>';
        var f = '<#et temp data><#if (data.social.indexOf("text") != -1) ><span class="WB_FB_info" node-type="userInfo"><#list data.user as list><#if (list_index < 2) ><a href="http://weibo.com/${list.profile_url}" target="_blank" action-type="hover" action-data="uid=${list.id}&screen_name=${list.screen_name}">${list.short_name}</a><#if (list.vip_type == 1) ><span class="WB_approve"></span></#if><#if (list.vip_type == 2) ><span class="WB_approve_co"></span></#if><#if (list_index == 0 && list_index + 1 != data.user.length) >,&nbsp;</#if></#if></#list><#if (parseInt(data.total, 10) <= 0) ><#if (data.follow == true) >${(data.att_type == 0) ? "赶快关注吧！" : ""}<#else>快成为第一个<a action-type="share" href="javascript:;" >分享</a>的人吧！</#if><#else><i class="FB_info_more"><#if (data.user.length != 0) >等<#else>共</#if>${data.total}人${(data.follow == true) ? "已关注" : "分享过"}</i></#if></span></#if><#if (data.social.indexOf("face") != -1) ><ul class="WB_uList clearfix" ><#list data.user as list><li action-type="hover" action-data="uid=${list.id}&screen_name=${list.screen_name}"><a href="http://weibo.com/${list.profile_url}" target="_blank"><img src="${list.profile_image_url}"></a> </li></#list></ul></#if></#et>';
        var h = '<div class="WB_widgets WB_tips_black" node-type="outer" ><div node-type="inner"></div><span class="tm_arr" node-type="arrow"></span></div>';
        var e = '<#et temp data><div class="WB_widgets social_active social_active_layer soac_active" style="position:absolute;z-index:9999;" node-type="outer"><div style="width:320px;" class="soac_active" ><p node-type="arrow" class="WBwidget_arrow_t WBwidget_arrow_tl W_bgcolor_arrow"><em class="W_arrline">◆</em><span>◆</span></p><div class="soac_box" node-type="inner"></div></div></div></#et>';
        j.shareBtnTemplate = g;
        j.layoutTemplate = i;
        j.listTemplate = f;
        j.tipTempalte = h;
        j.layerTemplate = e;
        return j
    });
    b.register("comp.social.io", function (h) {
        var f = {};
        var g = "http://widget.weibo.com/";
        var e = {
            list: "social/recommend.php",
            info: "social/conduct.php",
            top_domain: "social/top_by_domain.php",
            top_user: "social/top_by_user.php",
            share: "social/celebrity.php"
        };
        var i = function (l, k, j) {
            h.core.io.jsonp({
                url: g + e[l], args: k, onComplete: function (m) {
                    j && j(m)
                }, onTimeout: function (m) {
                    j && j(m)
                }
            })
        };
        f.jsonp = i;
        return f
    });
    b.register("core.dom.uniqueID", function (e) {
        return function (f) {
            return f && (f.uniqueID || (f.uniqueID = e.core.util.getUniqueKey()))
        }
    });
    b.register("core.evt.custEvent", function (g) {
        var e = "__custEventKey__", h = 1, i = {}, f = function (l, k) {
            var j = (typeof l == "number") ? l : l[e];
            return (j && i[j]) && {obj: (typeof k == "string" ? i[j][k] : i[j]), key: j}
        };
        return {
            define: function (n, l) {
                if (n && l) {
                    var k = (typeof n == "number") ? n : n[e] || (n[e] = h++), m = i[k] || (i[k] = {});
                    l = [].concat(l);
                    for (var j = 0; j < l.length; j++) {
                        m[l[j]] || (m[l[j]] = [])
                    }
                    return k
                }
            }, undefine: function (m, l) {
                if (m) {
                    var k = (typeof m == "number") ? m : m[e];
                    if (k && i[k]) {
                        if (l) {
                            l = [].concat(l);
                            for (var j = 0; j < l.length; j++) {
                                if (l[j] in i[k]) {
                                    delete i[k][l[j]]
                                }
                            }
                        } else {
                            delete i[k]
                        }
                    }
                }
            }, add: function (n, k, j, l) {
                if (n && typeof k == "string" && j) {
                    var m = f(n, k);
                    if (!m || !m.obj) {
                        throw"custEvent (" + k + ") is undefined !"
                    }
                    m.obj.push({fn: j, data: l});
                    return m.key
                }
            }, once: function (n, k, j, l) {
                if (n && typeof k == "string" && j) {
                    var m = f(n, k);
                    if (!m || !m.obj) {
                        throw"custEvent (" + k + ") is undefined !"
                    }
                    m.obj.push({fn: j, data: l, once: true});
                    return m.key
                }
            }, remove: function (o, m, l) {
                if (o) {
                    var n = f(o, m), p, j;
                    if (n && (p = n.obj)) {
                        if (g.core.arr.isArray(p)) {
                            if (l) {
                                var k = 0;
                                while (p[k]) {
                                    if (p[k].fn === l) {
                                        break
                                    }
                                    k++
                                }
                                p.splice(k, 1)
                            } else {
                                p.splice(0, p.length)
                            }
                        } else {
                            for (var k in p) {
                                p[k] = []
                            }
                        }
                        return n.key
                    }
                }
            }, fire: function (k, q, o) {
                if (k && typeof q == "string") {
                    var j = f(k, q), n;
                    if (j && (n = j.obj)) {
                        if (!g.core.arr.isArray(o)) {
                            o = o != undefined ? [o] : []
                        }
                        for (var l = n.length - 1; l > -1 && n[l]; l--) {
                            var r = n[l].fn;
                            var p = n[l].once;
                            if (r && r.apply) {
                                try {
                                    r.apply(k, [{type: q, data: n[l].data}].concat(o));
                                    if (p) {
                                        n.splice(l, 1)
                                    }
                                } catch (m) {
                                    g.log("[error][custEvent]" + m.message)
                                }
                            }
                        }
                        return j.key
                    }
                }
            }, destroy: function () {
                i = {};
                h = 1
            }
        }
    });
    b.register("core.str.encodeHTML", function (e) {
        return function (f) {
            if (typeof f !== "string") {
                throw"encodeHTML need a string as parameter"
            }
            return f.replace(/\&/g, "&amp;").replace(/"/g, "&quot;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\'/g, "&#39;").replace(/\u00A0/g, "&nbsp;").replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g, "&#32;")
        }
    });
    b.register("core.str.decodeHTML", function (e) {
        return function (f) {
            if (typeof f !== "string") {
                throw"decodeHTML need a string as parameter"
            }
            return f.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39/g, "'").replace(/&nbsp;/g, "\u00A0").replace(/&#32/g, "\u0020").replace(/&amp;/g, "&")
        }
    });
    b.register("core.obj.beget", function (f) {
        var e = function () {
        };
        return function (g) {
            e.prototype = g;
            return new e()
        }
    });
    b.register("core.dom.setStyle", function (e) {
        return function (f, g, h) {
            if (e.IE) {
                switch (g) {
                    case"opacity":
                        f.style.filter = "alpha(opacity=" + (h * 100) + ")";
                        if (!f.currentStyle || !f.currentStyle.hasLayout) {
                            f.style.zoom = 1
                        }
                        break;
                    case"float":
                        g = "styleFloat";
                    default:
                        f.style[g] = h
                }
            } else {
                if (g == "float") {
                    g = "cssFloat"
                }
                f.style[g] = h
            }
        }
    });
    b.register("core.dom.insertAfter", function (e) {
        return function (g, h) {
            var f = h.parentNode;
            if (f.lastChild == h) {
                f.appendChild(g)
            } else {
                f.insertBefore(g, h.nextSibling)
            }
        }
    });
    b.register("core.dom.insertBefore", function (e) {
        return function (g, h) {
            var f = h.parentNode;
            f.insertBefore(g, h)
        }
    });
    b.register("core.dom.hasClassName", function (e) {
        return function (g, f) {
            return (new RegExp("\\b" + f + "\\b").test(g.className))
        }
    });
    b.register("core.dom.addClassName", function (e) {
        return function (g, f) {
            if (g.nodeType === 1) {
                if (!e.core.dom.hasClassName(g, f)) {
                    g.className += (" " + f)
                }
            }
        }
    });
    b.register("core.dom.removeClassName", function (e) {
        return function (g, f) {
            if (g.nodeType === 1) {
                if (e.core.dom.hasClassName(g, f)) {
                    g.className = g.className.replace(new RegExp("\\b" + f + "\\b"), " ")
                }
            }
        }
    });
    b.register("core.dom.trimNode", function (e) {
        return function (g) {
            var h = g.childNodes;
            for (var f = 0; f < h.length; f++) {
                if (h[f].nodeType == 3 || h[f].nodeType == 8) {
                    g.removeChild(h[f])
                }
            }
        }
    });
    b.register("core.evt.fireEvent", function (e) {
        return function (g, h) {
            var i = e.E(g);
            if (e.IE) {
                i.fireEvent("on" + h)
            } else {
                var f = document.createEvent("HTMLEvents");
                f.initEvent(h, true, true);
                i.dispatchEvent(f)
            }
        }
    });
    b.register("core.dom.getStyle", function (e) {
        return function (g, i) {
            if (e.IE) {
                switch (i) {
                    case"opacity":
                        var k = 100;
                        try {
                            k = g.filters["DXImageTransform.Microsoft.Alpha"].opacity
                        } catch (j) {
                            try {
                                k = g.filters("alpha").opacity
                            } catch (j) {
                            }
                        }
                        return k / 100;
                    case"float":
                        i = "styleFloat";
                    default:
                        var h = g.currentStyle ? g.currentStyle[i] : null;
                        return (g.style[i] || h)
                }
            } else {
                if (i == "float") {
                    i = "cssFloat"
                }
                try {
                    var f = document.defaultView.getComputedStyle(g, "")
                } catch (j) {
                }
                return g.style[i] || f ? f[i] : null
            }
        }
    });
    b.register("core.dom.setXY", function (e) {
        return function (f, j) {
            var g = e.core.dom.getStyle(f, "position");
            if (g == "static") {
                e.core.dom.setStyle(f, "position", "relative");
                g = "relative"
            }
            var i = e.core.dom.position(f);
            if (i == false) {
                return
            }
            var h = {l: parseInt(e.core.dom.getStyle(f, "left"), 10), t: parseInt(e.core.dom.getStyle(f, "top"), 10)};
            if (isNaN(h.l)) {
                h.l = (g == "relative") ? 0 : f.offsetLeft
            }
            if (isNaN(h.t)) {
                h.t = (g == "relative") ? 0 : f.offsetTop
            }
            if (j.l != null) {
                f.style.left = j.l - i.l + h.l + "px"
            }
            if (j.t != null) {
                f.style.top = j.t - i.t + h.t + "px"
            }
        }
    });
    b.register("core.dom.cascadeNode", function (e) {
        return function (h) {
            var g = {};
            var i = h.style.display || "";
            i = (i === "none" ? "" : i);
            var f = [];
            g.setStyle = function (k, j) {
                e.core.dom.setStyle(h, k, j);
                if (k === "display") {
                    i = (j === "none" ? "" : j)
                }
                return g
            };
            g.insertAfter = function (j) {
                e.core.dom.insertAfter(j, h);
                return g
            };
            g.insertBefore = function (j) {
                e.core.dom.insertBefore(j, h);
                return g
            };
            g.addClassName = function (j) {
                e.core.dom.addClassName(h, j);
                return g
            };
            g.removeClassName = function (j) {
                e.core.dom.removeClassName(h, j);
                return g
            };
            g.trimNode = function () {
                e.core.dom.trimNode(h);
                return g
            };
            g.removeNode = function () {
                e.core.dom.removeNode(h);
                return g
            };
            g.on = function (l, m) {
                for (var k = 0, j = f.length; k < j; k += 1) {
                    if (f[k]["fn"] === m && f[k]["type"] === l) {
                        return g
                    }
                }
                f.push({fn: m, type: l});
                e.core.evt.addEvent(h, l, m);
                return g
            };
            g.unon = function (l, m) {
                for (var k = 0, j = f.length; k < j; k += 1) {
                    if (f[k]["fn"] === m && f[k]["type"] === l) {
                        e.core.evt.removeEvent(h, m, l);
                        f.splice(k, 1);
                        break
                    }
                }
                return g
            };
            g.fire = function (j) {
                e.core.evt.fireEvent(j, h);
                return g
            };
            g.appendChild = function (j) {
                h.appendChild(j);
                return g
            };
            g.removeChild = function (j) {
                h.removeChild(j);
                return g
            };
            g.toggle = function () {
                if (h.style.display === "none") {
                    h.style.display = i
                } else {
                    h.style.display = "none"
                }
                return g
            };
            g.show = function () {
                if (h.style.display === "none") {
                    if (i === "none") {
                        h.style.display = ""
                    } else {
                        h.style.display = i
                    }
                }
                return g
            };
            g.hidd = function () {
                if (h.style.display !== "none") {
                    h.style.display = "none"
                }
                return g
            };
            g.hide = g.hidd;
            g.scrollTo = function (j, k) {
                if (j === "left") {
                    h.scrollLeft = k
                }
                if (j === "top") {
                    h.scrollTop = k
                }
                return g
            };
            g.replaceChild = function (j, k) {
                h.replaceChild(j, k);
                return g
            };
            g.position = function (j) {
                if (j !== undefined) {
                    e.core.dom.setXY(h, j)
                }
                return e.core.dom.position(h)
            };
            g.setPosition = function (j) {
                if (j !== undefined) {
                    e.core.dom.setXY(h, j)
                }
                return g
            };
            g.getPosition = function (j) {
                return e.core.dom.position(h)
            };
            g.html = function (j) {
                if (j !== undefined) {
                    h.innerHTML = j
                }
                return h.innerHTML
            };
            g.setHTML = function (j) {
                if (j !== undefined) {
                    h.innerHTML = j
                }
                return g
            };
            g.getHTML = function () {
                return h.innerHTML
            };
            g.text = function (j) {
                if (j !== undefined) {
                    h.innerHTML = e.core.str.encodeHTML(j)
                }
                return e.core.str.decodeHTML(h.innerHTML)
            };
            g.ttext = g.text;
            g.setText = function (j) {
                if (j !== undefined) {
                    h.innerHTML = e.core.str.encodeHTML(j)
                }
                return g
            };
            g.getText = function () {
                return e.core.str.decodeHTML(h.innerHTML)
            };
            g.get = function (j) {
                if (j === "node") {
                    return h
                }
                return e.core.dom.getStyle(h, j)
            };
            g.getStyle = function (j) {
                return e.core.dom.getStyle(h, j)
            };
            g.getOriginNode = function () {
                return h
            };
            g.destroy = function () {
                for (var k = 0, j = f; k < j; k += 1) {
                    e.core.evt.removeEvent(h, f[k]["fn"], f[k]["type"])
                }
                i = null;
                f = null;
                h = null
            };
            return g
        }
    });
    b.register("module.layer", function (f) {
        var g = function (i) {
            var h = {};
            if (i.style.display == "none") {
                i.style.visibility = "hidden";
                i.style.display = "";
                h.w = i.offsetWidth;
                h.h = i.offsetHeight;
                i.style.display = "none";
                i.style.visibility = "visible"
            } else {
                h.w = i.offsetWidth;
                h.h = i.offsetHeight
            }
            return h
        };
        var e = function (k, j) {
            j = j || "topleft";
            var i = null;
            if (k.style.display == "none") {
                k.style.visibility = "hidden";
                k.style.display = "";
                i = f.core.dom.position(k);
                k.style.display = "none";
                k.style.visibility = "visible"
            } else {
                i = f.core.dom.position(k)
            }
            if (j !== "topleft") {
                var h = g(k);
                if (j === "topright") {
                    i.l = i.l + h.w
                } else {
                    if (j === "bottomleft") {
                        i.t = i.t + h.h
                    } else {
                        if (j === "bottomright") {
                            i.l = i.l + h.w;
                            i.t = i.t + h.h
                        }
                    }
                }
            }
            return i
        };
        return function (l) {
            var o = f.core.dom.builder(l);
            var k = o.list.outer[0], i = o.list.inner[0];
            var n = f.core.dom.uniqueID(k);
            var m = {};
            var h = f.core.evt.custEvent.define(m, "show");
            f.core.evt.custEvent.define(h, "hide");
            var j = null;
            m.show = function () {
                k.style.display = "";
                f.core.evt.custEvent.fire(h, "show");
                return m
            };
            m.hide = function () {
                k.style.display = "none";
                window.setTimeout(function () {
                    f.core.evt.custEvent.fire(h, "hide")
                }, 0);
                return m
            };
            m.getPosition = function (p) {
                return e(k, p)
            };
            m.getSize = function (p) {
                if (p || !j) {
                    j = g.apply(m, [k])
                }
                return j
            };
            m.html = function (p) {
                if (p !== undefined) {
                    i.innerHTML = p
                }
                return i.innerHTML
            };
            m.text = function (p) {
                if (text !== undefined) {
                    i.innerHTML = f.core.str.encodeHTML(p)
                }
                return f.core.str.decodeHTML(i.innerHTML)
            };
            m.appendChild = function (p) {
                i.appendChild(p);
                return m
            };
            m.getUniqueID = function () {
                return n
            };
            m.getOuter = function () {
                return k
            };
            m.getInner = function () {
                return i
            };
            m.getParentNode = function () {
                return k.parentNode
            };
            m.getDomList = function () {
                return o.list
            };
            m.getDomListByKey = function (p) {
                return o.list[p]
            };
            m.getDom = function (q, p) {
                if (!o.list[q]) {
                    return false
                }
                return o.list[q][p || 0]
            };
            m.getCascadeDom = function (q, p) {
                if (!o.list[q]) {
                    return false
                }
                return f.core.dom.cascadeNode(o.list[q][p || 0])
            };
            return m
        }
    });
    b.register("core.util.winSize", function (e) {
        return function (g) {
            var f, i;
            var j;
            if (g) {
                j = g.document
            } else {
                j = document
            }
            if (j.compatMode === "CSS1Compat") {
                f = j.documentElement.clientWidth;
                i = j.documentElement.clientHeight
            } else {
                if (self.innerHeight) {
                    if (g) {
                        j = g.self
                    } else {
                        j = self
                    }
                    f = j.innerWidth;
                    i = j.innerHeight
                } else {
                    if (j.documentElement && j.documentElement.clientHeight) {
                        f = j.documentElement.clientWidth;
                        i = j.documentElement.clientHeight
                    } else {
                        if (j.body) {
                            f = j.body.clientWidth;
                            i = j.body.clientHeight
                        }
                    }
                }
            }
            return {width: f, height: i}
        }
    });
    b.register("ui.tip", function (f) {
        var e = '<div style="position:absolute; width:200px; display:none;" class="tips WB_tips_yls" node-type="outer" ><span class="WB_tipS_err"></span><span class="WB_sp_txt" node-type="inner"></span><span class="arr" node-type="arrow"></span><a class="close" node-type="close" href="javascript:void(0)">×</a></div>';
        return function (h, s) {
            var o = f.core.obj.parseParam({template: e}, s);
            var l, k, n, m, r, u, g;
            var q = function (v) {
                k.style.top = v.t + "px";
                k.style.left = v.l + "px";
                return m
            };
            var p = function () {
                var v = f.core.util.winSize();
                var w = l.getSize(true);
                k.style.top = f.core.util.scrollPos()["top"] + (v.height - w.h) / 2 + "px";
                k.style.left = (v.width - w.w) / 2 + "px";
                return m
            };
            var i = function (v) {
                if (typeof v === "string") {
                    n.innerHTML = v
                } else {
                    n.appendChild(v)
                }
                return m
            };
            var j = function (v, w) {
                r.className = v
            };
            var t = function () {
                l = f.module.layer(o.template);
                k = l.getOuter();
                n = l.getDom("inner");
                r = l.getDom("arrow");
                u = l.getDom("close");
                u && f.core.evt.addEvent(u, "click", l.hide);
                l.hide();
                m = l;
                h && i(h);
                document.body.appendChild(k)
            };
            t();
            m.setPosition = q;
            m.setMiddle = p;
            m.setContent = i;
            m.setArrow = j;
            return m
        }
    });
    b.register("common.extra.pos", function (e) {
        var f = function (j, k) {
            var h = e.core.util.scrollPos(), o = e.core.util.winSize(), m = e.core.dom.position(j),
                n = e.core.dom.getSize(j), g = e.core.dom.getSize(k), l = g.width, s = g.height;
            var p = m, r = "tl";
            var i = m.l + l - h.left < o.width;
            var q = m.t + s - h.top < o.height;
            if (q) {
                p.t += n.height
            }
            if (!i) {
                p.l -= l - n.width
            }
            if (!q) {
                p.t -= s
            }
            if (!i && q) {
                r = "tr"
            } else {
                if (!i && !q) {
                    r = "br"
                } else {
                    if (i && !q) {
                        r = "bl"
                    }
                }
            }
            return {pos: p, arrow: r}
        };
        return function (h, g) {
            var i = f(h, g);
            return i
        }
    });
    b.register("kit.extra.merge", function (e) {
        return function (g, f) {
            var i = {};
            for (var h in g) {
                i[h] = g[h]
            }
            for (var h in f) {
                i[h] = f[h]
            }
            return i
        }
    });
    b.register("common.social.statistical", function (f) {
        var e = "http://rs.sinajs.cn/tmp.gif?";
        return function (i) {
            var h = {};
            var g = f.kit.extra.merge({id: "hotlist", refer: document.location.hostname}, i);
            h.request = function (l) {
                l = f.kit.extra.merge(l, g);
                var m = "";
                for (var j in l) {
                    m += (j + "=" + encodeURIComponent(l[j]) + "&")
                }
                m += "r=" + (new Date()).valueOf();
                var n = new Image();
                n.src = e + m
            };
            return h
        }
    });
    b.register("widget.social.bubble", function (h) {
        var g = h.core.util.easyTemplate, f = h.template.social.template;
        var e = {};
        return function (i, r) {
            var q = {};
            var i, v, j, o, k, n;
            var m = h.common.social.statistical({band: r.band});
            var w = function () {
                t();
                l();
                p()
            };
            var t = function () {
            };
            var l = function () {
                var x = (r.popup == "tip") ? f.tipTempalte : f.layerTemplate;
                v = h.ui.tip("", {template: x})
            };
            var p = function () {
                j = h.core.evt.delegatedEvent(i.outer);
                j.add("hover", "mouseover", s.delay);
                j.add("hover", "mouseout", s.hide);
                j.add("hover", "click", function (y) {
                    s.suda(y, "userclk")
                });
                if (r.popup == "layer") {
                    var x = v.getOuter();
                    h.core.evt.addEvent(x, "mouseover", function () {
                        clearTimeout(k)
                    });
                    h.core.evt.addEvent(x, "mouseout", function () {
                        k = setTimeout(function () {
                            v.hide()
                        }, 100)
                    });
                    o = h.core.evt.delegatedEvent(x);
                    o.add("linkclk", "click", function (y) {
                        s.suda(y, "linkclk")
                    })
                }
            };
            var s = {
                delay: function (x) {
                    clearTimeout(k);
                    k = setTimeout(function () {
                        s.show(x)
                    }, 100)
                }, show: function (C) {
                    if (C.data.social == "true" && r.popup == "layer") {
                        return
                    }
                    var A = C.el, z = C.data.uid, E = h.core.dom.position(A), x = "";
                    if (r.popup == "tip") {
                        E.t -= 25;
                        x = C.data.screen_name;
                        v.setContent(x).setPosition(E).show()
                    } else {
                        x = '<div class="soca_statebox"><span class="WB_loadingB"></span></div>';
                        var B = (r.widget == "share" || r.widget == "hotlist") ? "share" : "followbutton";
                        var y = {project: B, uid: z}, D = function (G) {
                            if (G && G.code == "100000") {
                                html = G.data;
                                e[z] = G
                            } else {
                                html = "加载失败";
                                delete e[z]
                            }
                            v.setContent(html);
                            var F = h.common.extra.pos(A, v.getOuter());
                            var H = "WBwidget_arrow_t WBwidget_arrow_" + F.arrow + " W_bgcolor_arrow";
                            H = (F.arrow.indexOf("b") != -1) ? H.replace("WBwidget_arrow_t", "WBwidget_arrow_b") : H;
                            v.setPosition(F.pos);
                            v.setArrow(H);
                            v.show()
                        };
                        if (e[z]) {
                            D(e[z])
                        } else {
                            h.comp.social.io.jsonp("info", y, D)
                        }
                        if (r.widget == "hotlist") {
                            return
                        }
                        h.common.social.suda("hover", window.social.uid)
                    }
                }, hide: function (x) {
                    clearTimeout(k);
                    k = setTimeout(function () {
                        v.hide()
                    }, 300)
                }, suda: function (y, x) {
                    if (r.widget == "hotlist") {
                        m.request({action: "linkclk"});
                        return
                    }
                    h.common.social.suda(x, window.social.uid)
                }
            };
            var u = function () {
            };
            w();
            q.destroy = u;
            return q
        }
    });
    b.register("kit.io.cssLoader", function (h) {
        var f = "";
        var e = "http://img.t.sinajs.cn/t4/";
        var i = "http://timg.sjs.sinajs.cn/t4/";
        if (typeof $CONFIG != "undefined") {
            e = $CONFIG.cssPath || e;
            f = $CONFIG.version || ""
        }
        var g = {};
        return function (l, j) {
            if (!l) {
                return
            }
            var r = h.core.obj.parseParam({
                load_ID: "social_css_load_status", complete: function () {
                }, timeout: function () {
                }, version: new Date().valueOf(), notCdn: false
            }, j);
            var q = r.load_ID, o = r.version, n = r.complete, u = r.timeout, w = r.notCdn;
            var v = function (A, y) {
                var z = g[A] || (g[A] = {loaded: false, list: []});
                if (z.loaded) {
                    y(A);
                    return false
                }
                z.list.push(y);
                if (z.list.length > 1) {
                    return false
                }
                return true
            };
            var p = function (z) {
                var y = g[z].list;
                for (var A = 0; A < y.length; A++) {
                    y[A](z)
                }
                g[z].loaded = true;
                delete g[z].list
            };
            if (!v(l, n)) {
                return
            }
            var t;
            if (w) {
                t = i + l
            } else {
                t = e + l + "?version=" + o
            }
            var s = h.C("link");
            s.setAttribute("rel", "Stylesheet");
            s.setAttribute("type", "text/css");
            s.setAttribute("charset", "utf-8");
            s.setAttribute("href", t);
            document.getElementsByTagName("head")[0].appendChild(s);
            var k = h.C("div");
            k.id = q;
            h.core.util.hideContainer.appendChild(k);
            var x = 3000;
            var m = function () {
                if (parseInt(h.core.dom.getStyle(k, "height")) == 42) {
                    h.core.util.hideContainer.removeChild(k);
                    p(l);
                    return
                }
                if (--x > 0) {
                    setTimeout(m, 10)
                } else {
                    h.core.util.hideContainer.removeChild(k);
                    delete g[l];
                    u()
                }
            };
            setTimeout(m, 50)
        }
    });
    b.register("widget.social.follow", function (h) {
        var g = h.core.util.easyTemplate, f = h.template.social.template, i = h.core.io.jsonp;
        var e = "appstyle/widget/css/socialRelations/social_active.css";
        return function (o, p) {
            var n = {};
            var k, j, u;
            p.widget = "follow";
            p.popup = "tip";
            p.noshare = "0";
            p.showbutton = "n";
            var t = function () {
                q();
                l();
                m()
            };
            var s = function () {
                var w = g(f.layoutTemplate, p).toString();
                var x = h.core.dom.builder(w);
                j = h.kit.dom.parseDOM(x.list);
                u = j.outer;
                if (/^(\d+)$/.test(p.width)) {
                    u.style.width = parseInt(p.width, 10) + "px"
                }
                if (/^(\d+)$/.test(p.height)) {
                    u.style.height = parseInt(p.height, 10) + "px"
                }
                o.innerHTML = "";
                o.appendChild(x.box);
                var v = {project: "followbutton", uid: p.uid}, y = function (B) {
                    if (B && B.code == "100000") {
                        B.data.social = p.social;
                        B.data.follow = true;
                        var A = g(f.listTemplate, B.data).toString();
                        var C = h.core.dom.builder(A);
                        j.inner.appendChild(C.box);
                        var z = function () {
                            j.inner.style.display = "";
                            j.loading.style.display = "none"
                        };
                        h.kit.io.cssLoader(e, {complete: z, timeout: z, notCdn: true})
                    }
                };
                h.comp.social.io.jsonp("list", v, y)
            };
            var q = function () {
            };
            var l = function () {
                s();
                h.widget.social.bubble(j, p)
            };
            var m = function () {
            };
            var r = function () {
            };
            t();
            n.destroy = r;
            n.btnBox = j.button;
            return n
        }
    });
    b.register("core.util.pageSize", function (e) {
        return function (h) {
            var l;
            if (h) {
                l = h.document
            } else {
                l = document
            }
            var m = (l.compatMode == "CSS1Compat" ? l.documentElement : l.body);
            var k, g;
            var j, i;
            if (window.innerHeight && window.scrollMaxY) {
                k = m.scrollWidth;
                g = window.innerHeight + window.scrollMaxY
            } else {
                if (m.scrollHeight > m.offsetHeight) {
                    k = m.scrollWidth;
                    g = m.scrollHeight
                } else {
                    k = m.offsetWidth;
                    g = m.offsetHeight
                }
            }
            var f = e.core.util.winSize(h);
            if (g < f.height) {
                j = f.height
            } else {
                j = g
            }
            if (k < f.width) {
                i = f.width
            } else {
                i = k
            }
            return {page: {width: i, height: j}, win: {width: f.width, height: f.height}}
        }
    });
    b.register("template.button.followButton", function (i) {
        var h = {};
        var g = '<#et temp config><div class="WB_widgets WB_followButton"><div class="clearfix"><#if (config["show_head"] == true) ><div class="WB_UserAvatar"><img node-type="profilePic" alt="" src="${config.user.profile_image_url}"></div></#if><div class="WB_UserInfo" ${(config["show_head"] == true) ? \'\' : \'style="margin-left:0;"\'} ><#if (config["show_name"] == true) ><p class="WB_UserName" node-type="nameBox"><a href="http://www.weibo.com/${(config.user.domain != "") ? (config.user.domain) : (config.user.id)}" target="_blank" >${config.user.name}</a><#if (config.user.verified == true) > <span class="WB_approve"></span></#if></p></#if><p class="WB_UserStat" node-type="btnbox" ></p></div></div></div></#et>';
        var j = '<#et temp data><span class="${data.btncss}" node-type="followBtn"><span> <em class="${data.imgcss}" node-type="followImg" ></em><em>${data.btntxt}</em><#if ((data.cancel == "true" || data.cancel == true) && (data.alias == "each" || data.alias == "has")) ><em class="WB_btnL">|</em><em><a href="javascript:void(0);" node-type="followCancel" class="W_linkb">取消</a></em></#if></span></span></#et>';
        var e = '<#et temp config><div class="follow_btn_line" node-type="inner"><a class="follow_btn status_followed" node-type="followBtn" target="_blank" title="#L{已关注}" href="http://weibo.com/u/${config.uid}"><cite class="follow_btn_inner"><u class="WB_ico_logo"></u><cite class="follow_text">#L{新动态}</cite></cite></a></div></#et>';
        var f = '<#et temp data><#if (data.style == 1) ><#elseif (data.style == 2) ><cite class="follow_data"><a title="${data.total} #L{粉丝}" target="_blank" href="http://weibo.com/${data.currentUser.profile_url}" class="data_link">${data.total}</a><cite class="data_arrow"></cite></cite><#elseif (data.style == 3) ><cite class="follow_intro"><a title="${data.currentUser.screen_name}" target="_blank" href="http://weibo.com/${data.currentUser.profile_url}" class="follow_name name_bold">${data.currentUser.screen_name}</a><#if (data.currentUser.vip_type == 1) ><u class="WB_ico_approve"></u><#elseif (data.currentUser.vip_type == 2) ><u class="WB_ico_approve_co"></u></#if><cite class="intro_data">(#L{粉丝}${data.total})</cite></cite><#elseif (data.style == 4) ><cite class="follow_intro"><#list data.user as user><#if (user_index == 0) ><a target="_blank" title="${user.screen_name}" href="http://weibo.com/${user.profile_url}" class="follower_name">${user.short_name}</a></#if></#list><cite class="follow_display">#L{等}${data.total}人#L{已关注}</cite></cite><div class="follow_list_container"><ul class="follower_list"><#list data.user as user><li class="follower_item"><a target="_blank" href="http://weibo.com/${user.profile_url}" class="follower_item_a"><img width="30" height="30" title="${user.screen_name}" alt="${user.screen_name}" src="${user.profile_image_url}" class="follower_item_a_img"></a></li></#list></ul></div></#if></#et>';
        h.layoutTemplate = g;
        h.buttonTemplate = j;
        h.buttonWithCardTemplete = e;
        h.fansTemplate = f;
        return h
    });
    b.register("core.util.cookie", function (f) {
        var e = {
            set: function (j, m, l) {
                var g = [];
                var k, i;
                var h = f.core.obj.parseParam({expire: null, path: "/", domain: null, secure: null, encode: true}, l);
                if (h.encode == true) {
                    m = escape(m)
                }
                g.push(j + "=" + m);
                if (h.path != null) {
                    g.push("path=" + h.path)
                }
                if (h.domain != null) {
                    g.push("domain=" + h.domain)
                }
                if (h.secure != null) {
                    g.push(h.secure)
                }
                if (h.expire != null) {
                    k = new Date();
                    i = k.getTime() + h.expire * 3600000;
                    k.setTime(i);
                    g.push("expires=" + k.toGMTString())
                }
                document.cookie = g.join(";")
            }, get: function (i) {
                i = i.replace(/([\.\[\]\$])/g, "\\$1");
                var h = new RegExp(i + "=([^;]*)?;", "i");
                var j = document.cookie + ";";
                var g = j.match(h);
                if (g) {
                    return g[1] || ""
                } else {
                    return ""
                }
            }, remove: function (g, h) {
                h = h || {};
                h.expire = -10;
                e.set(g, "", h)
            }
        };
        return e
    });
    var d = {
        "加载中...": "載入中...",
        "已关注": "已關注",
        "加关注": "加關注",
        "新动态": "新動態",
        "粉丝": "粉絲",
        "关闭": "關閉",
        "这里可以直接查看微博动态": "這裡可以直接查看微博動態"
    };
    b.register("core.util.language", function (e) {
        return function (f, g) {
            return f.replace(/#L\{((.*?)(?:[^\\]))\}/ig, function () {
                var i = arguments[1];
                var h;
                if (g && g[i] !== undefined) {
                    h = g[i]
                } else {
                    h = i
                }
                return h
            })
        }
    });
    b.register("core.util.templet", function (e) {
        return function (f, g) {
            return f.replace(/#\{(.+?)\}/ig, function () {
                var l = arguments[1].replace(/\s/ig, "");
                var j = arguments[0];
                var m = l.split("||");
                for (var k = 0, h = m.length; k < h; k += 1) {
                    if (/^default:.*$/.test(m[k])) {
                        j = m[k].replace(/^default:/, "");
                        break
                    } else {
                        if (g[m[k]] !== undefined) {
                            j = g[m[k]];
                            break
                        }
                    }
                }
                return j
            })
        }
    });
    b.register("ex.kit.language", function (e) {
        window.$LANG || (window.$LANG = {});
        return function (g) {
            var f = {};
            g = g || "zh_cn";
            return function (h, i) {
                var j = j = e.core.util.language(h);
                if (g === "zh_tw") {
                    j = e.core.util.language(h, d)
                }
                j = j.replace(/\\}/ig, "}");
                i && (j = e.core.util.templet(j, i));
                return j
            }
        }
    });
    b.register("widget.social.followv2", function (i) {
        var o = i.template.button.followButton, j = o.buttonWithCardTemplete, k = o.fansTemplate;
        var r = '<div class="usercard_layer" style="visibility:hidden;" node-type="cardContainer"><div class="usercard_layer_outside"><div class="usercard_layer_inside" node-type="cardInner"></div><div class="layer_arrow_inside" node-type="inside_arrow"></div><div class="layer_arrow_outside" node-type="outside_arrow"></div></div></div>';
        var p = '<div class="follow_tips" node-type="follow_tips" style="visibility:hidden;"><div class="follow_tips_outside"><div class="follow_tips_inside"><div class="follow_tips_content"><u class="status_icon status_beginner"></u><cite class="follow_tips_content_text">#L{这里可以直接查看微博动态}</cite></div><a class="close_button" node-type="close_button" title="#L{关闭}" href="javascript:;"></a><div class="tips_arrow" node-type="tips_arrow" style="left:10px;" node-type="tips_arrow"></div></div></div></div>';
        var t = '<div class="card_loading_container"><u class="WB_ico_loading"></u></div>';
        var n = "http://widget.weibo.com";
        var s = {card: n + "/public/aj_namecard.php", fans: n + "/social/rec_by_fans.php"};
        var m = "appstyle/widget/css/followWithCard/followWithCard.css";
        var h = i.core.evt.addEvent;
        var f = i.core.util.cookie;
        var g = i.core.dom.contains;
        var q = i.core.io.jsonp;
        var e = i.core.util.easyTemplate;
        var l = i.core.dom.builder;
        return function (u, G, F) {
            var D = {}, Q, N, U, z, R, w, x, H;
            var Y = G.language || "zh_cn", O = i.ex.kit.language(Y);
            var M = {};
            var P = function () {
                if (null == u) {
                    throw"Node is not defined"
                }
                var aa = i.core.dom.sizzle(".WB_floatContainer");
                for (var Z = 0; Z < aa.length; Z++) {
                    document.body.removeChild(aa[Z])
                }
            };
            var X = {
                tip: null, isOk: false, arrow: null, closeButton: null, destroy: function () {
                    if (X.tip != null) {
                        z.removeChild(X.tip);
                        X.tip = null
                    }
                }, init: function () {
                    var ab = i.core.dom.position(N);
                    if (ab.l == 0 && ab.t == 0) {
                        return
                    }
                    var Z = i.kit.dom.parseDOM(l(O(p)).list);
                    X.tip = Z.follow_tips;
                    X.closeButton = Z.close_button;
                    X.arrow = Z.tips_arrow;
                    h(X.closeButton, "click", X.hide);
                    X.setOk();
                    if (X.isOk) {
                        z.appendChild(X.tip);
                        var aa = i.core.dom.getSize(X.tip);
                        X.tip.style.top = ab.t - aa.height - 5 + "px";
                        X.tip.style.left = ab.l - 10 + "px";
                        setTimeout(X.show, 300)
                    }
                }, show: function () {
                    X.tip.style.display = "block";
                    X.tip.style.visibility = "visible"
                }, setOk: function () {
                    H = f.get("followButtonTipCount");
                    if (0 == H.length) {
                        f.set("followButtonTipCount", 0, null)
                    } else {
                        H = parseInt(H, 10);
                        H++;
                        if (H < 2) {
                            X.isOk = true;
                            f.set("followButtonTipCount", H, null)
                        } else {
                            X.isOk = false
                        }
                    }
                }, hide: function () {
                    if (null != R) {
                        clearTimeout(R)
                    }
                    X.tip.style.display = "none";
                    i.core.evt.removeEvent(X.closeButton, "click", X.hide)
                }
            };
            var B = {
                card: null, init: function () {
                    if (null == B.card) {
                        var Z = i.kit.dom.parseDOM(l(r).list);
                        B.card = Z.cardContainer;
                        B.card.style.zIndex = "9999";
                        B.cardOutArrow = Z.outside_arrow;
                        h(B.card, "mouseover", L);
                        h(B.card, "mouseout", I);
                        h(B.card, "click", J)
                    }
                }, show: function (Z) {
                    var aa = t;
                    z.appendChild(B.card);
                    if (null != M[G.uid]) {
                        aa = M[G.uid];
                        T(aa)
                    } else {
                        q({
                            url: s.card, args: {fuid: G.uid, language: Y}, onComplete: function (ab) {
                                if ("100000" == ab.code) {
                                    M[G.uid] = ab.data;
                                    aa = ab.data;
                                    T(aa)
                                }
                            }
                        })
                    }
                }, getCardPosition: function (ab, aa) {
                    var ag = i.core.dom.position(ab);
                    var ae = i.core.util.pageSize();
                    var Z = i.core.util.scrollPos();
                    var ak = i.core.dom.getSize(aa);
                    var ah = ak.width;
                    var ad = ak.height;
                    var af = ag.t;
                    var ai = ag.l;
                    var aj = ai + ah - Z.left < ae.win.width;
                    var ac = af + ad - Z.top < ae.win.height;
                    if (ac) {
                        af += ab.offsetHeight + 3
                    }
                    if (!aj) {
                        ai -= ah - ab.offsetWidth + 7;
                        B.cardOutArrow.className = " layer_arrow_outside_b";
                        B.cardInnerArrow.className = " layer_arrow_inside_b"
                    }
                    if (!ac) {
                        af -= ad + 5;
                        B.cardOutArrow.className = "layer_arrow_outside_c";
                        B.cardInnerArrow.className = "layer_arrow_inside_c"
                    }
                    if (!aj && !ac) {
                        B.cardOutArrow.className = "layer_arrow_outside_d";
                        B.cardInnerArrow.className = "layer_arrow_inside_d"
                    }
                    return {t: (af), l: (ai - 15)}
                }, hide: function () {
                    B.card.style.visibility = "hidden"
                }
            };
            var T = function (aa) {
                x = x || i.kit.dom.parseDOM(l(B.card).list).cardInner;
                x.innerHTML = aa;
                B.cardInnerArrow = i.kit.dom.parseDOM(l(B.card).list).inside_arrow;
                B.cardOutArrow.className = "layer_arrow_outside_a";
                B.cardInnerArrow.className = "layer_arrow_inside_a";
                var Z = B.getCardPosition(N, B.card);
                B.card.style.top = Z.t + "px";
                B.card.style.left = Z.l + "px";
                B.card.style.visibility = "visible";
                C({ac: "hover"})
            };
            var A = function (Z) {
                clearTimeout(R);
                B.init();
                if (B.card.style.visibility == "hidden") {
                    B.show()
                }
            };
            var W = function (Z) {
                R = window.setTimeout(B.hide, 20)
            };
            var L = function (Z) {
                clearTimeout(R);
                R = null
            };
            var I = function (Z) {
                R = window.setTimeout(B.hide, 20)
            };
            var J = function (Z) {
                Z = i.core.evt.fixEvent(Z);
                if (Z.target.tagName.toLowerCase() === "a") {
                    C({ac: "clicklink"})
                }
            };
            var E = function (Z) {
                q({
                    url: s.fans, args: {uid: G.uid, language: Y}, onComplete: function (aa) {
                        if (aa.code === "100000") {
                            var ad = aa.data;
                            ad.style = G.style;
                            var ab = e(O(k), ad).toString();
                            var ac = l(ab);
                            Q.inner.appendChild(ac.box)
                        }
                    }
                })
            };
            var v = function () {
                var Z = e(O(j), G).toString();
                U = l(Z);
                Q = i.kit.dom.parseDOM(U.list);
                N = Q.followBtn
            };
            var y = function () {
                h(N, "mouseover", A);
                h(N, "mouseout", W);
                h(N, "click", function () {
                    C({ac: "clickButton"})
                })
            };
            var C = function (ac) {
                var ab = "http://rs.sinajs.cn/tmp.gif?", ae = {
                    id: "followbutton",
                    oid: G.uid,
                    uid: F || ac.uid,
                    action: ac.ac,
                    refer: document.referrer,
                    r: +(new Date())
                };
                var aa = [];
                for (var ad in ae) {
                    aa.push(ad + "=" + encodeURIComponent(ae[ad] || ""))
                }
                ab += aa.join("&");
                var Z = new Image();
                Z.src = ab
            };
            var V = function () {
                K();
                C({ac: "view"})
            };
            var K = function () {
                var Z = function () {
                    w = document.createElement("div");
                    if (/^(\d+)$/.test(G.width)) {
                        w.style.width = parseInt(G.width, 10) + "px"
                    }
                    if (/^(\d+)$/.test(G.height)) {
                        w.style.height = parseInt(G.height, 10) + "px"
                    }
                    w.className = "WB_widget WB_follow_ex";
                    w.style.overflow = "hidden";
                    w.appendChild(U.box);
                    u.innerHTML = "";
                    u.appendChild(w);
                    z = document.createElement("div");
                    z.className = "WB_widget WB_follow_ex WB_floatContainer";
                    document.body.appendChild(z);
                    E()
                };
                i.kit.io.cssLoader(m, {load_ID: "followbutton_css_load_status", complete: Z, timeout: Z})
            };
            var S = function () {
                P();
                v();
                V();
                y()
            };
            S();
            D.destroy = function () {
                X.destroy()
            };
            D.id = new Date().toString();
            return D
        }
    });
    b.register("widget.iframe.follow", function (f) {
        var i = "http://widget.weibo.com/relationship/followbutton.php";
        var g = "http://widget.weibo.com/public/aj_relationship.php";
        var e = [{W: 67, H: 24}, {W: 136, H: 24}, {W: 245, H: 24}, {W: 240, H: 64}];
        var h = function (j) {
            j = parseInt(j, 10);
            j = (j > e.length || j < 1) ? 1 : j;
            return e[j - 1]
        };
        return function (r) {
            var m = {};
            var s = f.common.iframe(), o = false;
            var n = f.core.obj.parseParam({
                dom: null,
                uid: "",
                type: "red_1",
                social: null,
                width: null,
                height: 60,
                language: "zh_cn"
            }, r);
            var l = n.dom;
            if (!l) {
                throw"no avaliable dom element found."
            }
            if (f.kit.extra.isNull(n.uid)) {
                throw"no avaliable uid found."
            }
            var p = n.type.split("_"), k = p[0].replace("gray", "light"), j = p[1];
            var q = function (v) {
                v = v || l;
                var u = h(j), y = o ? u.W : (n.width || u.W), t = (n.height == 60) ? u.H : n.height;
                var x = {btn: k, style: j, uid: n.uid, width: y, height: t, language: n.language};
                if (n.social != null) {
                    x.social = n.social.replace(",", "_");
                    x.domain = document.domain
                }
                var w = f.kit.extra.jsonToUrl(x, i);
                s.insertIFrame({url: w, root: v, width: y, height: t})
            };
            o = (n.social != null && p[1] == 4);
            if (o) {
                j = 1;
                l = f.widget.social.follow(l, n).btnBox;
                q(l)
            } else {
                f.core.io.jsonp({
                    url: g, args: {fuid: n.uid}, onComplete: function (t) {
                        if (t.data.login && (t.data.relation == 3 || t.data.relation == 1)) {
                            n.style = j;
                            f.widget.social.followv2(l, n, t.data.uid)
                        } else {
                            q()
                        }
                    }, onTimeout: null
                })
            }
            return m
        }
    });
    b.register("common.social.util", function (f) {
        var e = {};
        e.filter = function (g) {
            if (typeof g != "string") {
                return g
            }
            if (g.toLowerCase() == "y") {
                return "1"
            } else {
                if (g.toLowerCase() == "n") {
                    return "0"
                } else {
                    return g
                }
            }
        };
        e.getWidgetType = function (h) {
            var g = (h.showbutton == "y") ? "btn" : "icon";
            return g + "_" + h.social.replace(",", "_")
        };
        return e
    });
    b.register("common.social.analytics", function (i) {
        var e = document.location.protocol.indexOf("https") > -1 ? "https://" : "http://", h = "beacon.sina.com.cn";
        var g = e + h + "/e.gif";
        var f = "http://rs.sinajs.cn/social.gif";
        return function (n) {
            var m = {};
            var k = i.core.obj.parseParam({
                gid: "",
                sid: "",
                uid: "",
                sup: "",
                acode: "weibo_socialshare_widget",
                aext: "",
                referer: "",
                href: document.location.href,
                requrl: ""
            }, n);
            var p = "?UATrack||" + k.gid + "||" + k.sid + "||::" + k.uid + "::||" + k.acode + "||" + k.aext + "||" + k.referer + "||" + k.href + "||" + k.requrl + "||&gUid_" + (new Date().valueOf());
            var j = g + p;
            var o = f + p;
            var l = new Image();
            l.src = j;
            var l = new Image();
            l.src = o;
            return m
        }
    });
    b.register("common.social.suda", function (e) {
        return function (i, f, g) {
            var h = {};
            g = typeof g == "undefined" ? "" : ":" + g;
            e.common.social.analytics({uid: f, aext: i + ":" + f + ":" + document.domain + g});
            return h
        }
    });
    b.register("widget.social.share", function (k) {
        var j = k.core.util.easyTemplate, i = k.core.evt.addEvent, l = k.core.evt.removeEvent, f = k.core.dom.builder,
            h = k.template.social.template;
        var g = "appstyle/widget/css/socialRelations/social_active.css";

        function e(m) {
            var n = new RegExp("(^|&)" + m + "=([^&]*)(&|$)");
            var o = window.location.search.substr(1).match(n);
            return o != null ? o[2] : ""
        }

        return function (r, s) {
            var q = {};
            var n, m, z, v;
            s.widget = "share";
            s.popup = "layer";
            var w = function () {
                var D = j(h.layoutTemplate, s).toString();
                var G = f(D);
                m = k.kit.dom.parseDOM(G.list);
                z = m.outer;
                var A = j(h.shareBtnTemplate, s).toString();
                var C = f(A);
                m.button.appendChild(C.box);
                if (/^(\d+)$/.test(s.width)) {
                    m.outer.style.width = parseInt(s.width, 10) + "px"
                }
                if (/^(\d+)$/.test(s.height)) {
                    m.outer.style.height = parseInt(s.height, 10) + "px"
                }
                r.innerHTML = "";
                r.removeAttribute("title");
                r.appendChild(G.box);
                var F = s.url;
                var E = k.core.dom.sizzle('meta[property="og:url"]');
                if (E && E[0]) {
                    F = E[0].getAttribute("content");
                    F += "&is_og=1"
                }
                var B = {project: "share", longlink: F}, H = function (K) {
                    if (K && K.code == "100000") {
                        K.data.social = s.social;
                        var J = j(h.listTemplate, K.data).toString();
                        var M = k.core.dom.builder(J);
                        m.inner.appendChild(M.box);
                        var I = function () {
                            m.inner.style.display = "";
                            m.loading.style.display = "none"
                        };
                        k.kit.io.cssLoader(g, {complete: I, timeout: I, notCdn: true});
                        window.social = window.social || {};
                        window.social.uid = K.data.uid;
                        var L = k.common.social.util.getWidgetType({showbutton: s.showbutton, social: s.social});
                        k.common.social.suda("pv", K.data.uid, L)
                    }
                };
                k.comp.social.io.jsonp("list", B, H)
            };
            var x = function () {
                var A = k.core.json.jsonToQuery(s);
                window.open("http://service.weibo.com/share/share.php?" + A, "_blank", "width=615,height=505");
                k.common.social.suda("shareclk", social.uid)
            };
            var t = function () {
            };
            var o = function () {
                w();
                k.widget.social.bubble(m, s)
            };
            var p = function () {
                v = k.core.evt.delegatedEvent(z);
                v.add("share", "click", x)
            };
            var u = function () {
            };
            var y = function () {
                t();
                o();
                p()
            };
            y();
            q.destroy = u;
            q.btnBox = m.button;
            return q
        }
    });
    b.register("widget.iframe.share", function (g) {
        var i = "http://service.weibo.com/staticjs/weiboshare.html";
        var f = {
            button_big: {W: 142, H: 66, type: 4},
            button_middle: {W: 106, H: 58, type: 5},
            button_small: {W: 86, H: 50, type: 6},
            icon_big: {W: 55, H: 66, type: 1},
            icon_middle: {W: 90, H: 24, type: 2},
            icon_small: {W: 72, H: 16, type: 3}
        };
        var e = {full: {W: 312, H: 62}, text: {W: 312, H: 25}, simple: {W: 65, H: 25}, number: {W: 128, H: 25}};
        var h = function (j) {
            return f[j] || f.icon_small
        };
        return function (t) {
            var o = {};
            var v = g.common.iframe();
            var p = g.core.obj.parseParam({
                dom: null,
                url: null,
                type: "icon",
                size: "small",
                count: "y",
                ralateuid: "",
                title: "",
                default_text: "",
                picture_search: true,
                pic: "",
                addition: null,
                social: null,
                width: null,
                height: 60,
                showbutton: "y",
                language: "zh_cn",
                appkey: ""
            }, t);
            var l = p.dom;
            if (!l) {
                throw"no avaliable dom element found."
            }
            var s = h(p.type + "_" + p.size), k = s.W, u = s.H, r = s.type, n = p.count == "y" ? 1 : 0;
            var q = {
                url: encodeURIComponent(p.url || window.location.href),
                type: r,
                count: n,
                ralateUid: p.ralateuid,
                language: p.language,
                appkey: p.appkey,
                title: p.default_text || p.title,
                pic: p.pic,
                showbutton: p.showbutton
            };
            if (p.social) {
                q.social = p.social;
                q.width = p.width;
                q.height = p.height;
                g.widget.social.share(l, q);
                return
            }
            var m = p.addition;
            if (m) {
                q.type = p.type;
                q.searchPic = p.picture_search;
                q.style = m;
                delete q.count;
                delete q.showbutton;
                k = e[m]["W"];
                k = p.type == "icon" ? k - 47 : k;
                u = e[m]["H"];
                if (m == "simple" || m == "number") {
                    i = "http://service.weibo.com/staticjs/weibosharev2.html"
                } else {
                    i = "http://service.weibo.com/share/share_social.php"
                }
            }
            var j = g.kit.extra.jsonToUrl(q, i);
            v.insertIFrame({url: j, root: l, width: k, height: u});
            return o
        }
    });
    b.register("kit.extra.clone", function (e) {
        function f(m, g) {
            g = g || false;
            var j;
            if (m instanceof Array) {
                j = [];
                var l = m.length;
                while (l--) {
                    if (g) {
                        j[l] = f(m[l])
                    } else {
                        j[l] = m[l]
                    }
                }
                return j
            } else {
                if (m instanceof Object) {
                    j = {};
                    for (var h in m) {
                        if (g) {
                            j[h] = f(m[h])
                        } else {
                            j[h] = m[h]
                        }
                    }
                    return j
                } else {
                    return m
                }
            }
        }

        return f
    });
    b.register("widget.iframe.live", function (e) {
        var h = "http://widget.weibo.com/livestream/listlive.php";
        var g = ["silver", "blue", "pink", "green", "yellow", "orange", "purple", "skyblue", "gray", "black"];
        var f = function (i) {
            return e.core.arr.indexOf(i, g) + 1
        };
        return function (q) {
            var o = {};
            var r = e.common.iframe();
            var p = e.core.obj.parseParam({
                dom: null,
                topic: "",
                publish: "y",
                talk: "y",
                refer: "y",
                titlebar: "y",
                border: "y",
                uid: "",
                listid: "",
                member: "y",
                width: "280",
                height: "500",
                skin: "silver",
                color: "",
                colordiy: "0",
                ptype: "1",
                language: "zh_cn",
                appkey: ""
            }, q);
            var l = p.dom;
            if (!l) {
                throw"no avaliable dom element found."
            }
            var m = e.kit.extra.clone(p);
            if (m.color != "") {
                m.colordiy = "1"
            }
            var n = m.topic;
            if (n != "") {
                if (n.indexOf("|") != -1) {
                    var k = n.split("|");
                    m.ptopic = k[0];
                    m.atopic = k[1]
                } else {
                    m.atopic = m.ptopic = n
                }
            }
            var j = m.width;
            if (j == "auto") {
                m.width = "0";
                j = "100%"
            }
            m.at = m.member;
            m.skin = f(m.skin);
            delete m.dom;
            delete m.topic;
            var i = e.kit.extra.jsonToUrl(m, h);
            r.insertIFrame({url: i, root: l, width: j, height: m.height});
            return o
        }
    });
    b.register("widget.iframe.bulkfollow", function (e) {
        var f = "http://widget.weibo.com/relationship/bulkfollow.php";
        return function (g) {
            var k = {};
            var m = e.common.iframe();
            var j = e.core.obj.parseParam({
                dom: null,
                uids: "",
                sense: "n",
                titlebar: "y",
                info: "y",
                verified: "y",
                count: "5",
                width: "575",
                height: "489",
                type: "1",
                color: "C2D9F2,FFFFFF,0082CB,666666",
                nick: 0,
                language: "zh_cn"
            }, g);
            var l = j.dom;
            if (!l) {
                throw"no avaliable dom element found."
            }
            var i = e.kit.extra.clone(j);
            i.showtitle = i.titlebar;
            i.showinfo = i.info;
            i.wide = i.type;
            i.refer = encodeURIComponent(document.location.href);
            delete i.dom;
            delete i.titlebar;
            delete i.info;
            delete i.type;
            var h = e.kit.extra.jsonToUrl(i, f);
            m.insertIFrame({url: h, root: l, width: i.width, height: i.height});
            return k
        }
    });
    b.register("widget.iframe.list", function (e) {
        var h = "http://widget.weibo.com/list/list.php";
        var g = ["silver", "blue", "pink", "green", "yellow", "orange", "purple", "skyblue", "gray", "black"];
        var f = function (i) {
            return e.core.arr.indexOf(i, g)
        };
        return function (i) {
            var m = {};
            var o = e.common.iframe();
            var l = e.core.obj.parseParam({
                dom: null,
                uid: "",
                border: "y",
                creater: "y",
                infobar: "y",
                titlebar: "y",
                footbar: "n",
                info: "y",
                sidebar: "y",
                listid: "",
                width: "300",
                height: "500",
                color: "",
                skin: "",
                language: "zh_cn",
                appkey: ""
            }, i);
            var n = l.dom;
            if (!n) {
                throw"no avaliable dom element found."
            }
            var k = e.kit.extra.clone(l);
            k.isborder = k.border;
            k.showcreate = k.creater;
            k.skin = f(k.skin);
            delete k.dom;
            delete k.border;
            delete k.creater;
            var j = e.kit.extra.jsonToUrl(k, h);
            o.insertIFrame({url: j, root: n, width: k.width, height: k.height});
            return m
        }
    });
    b.register("widget.iframe.comments", function (e) {
        var h = "http://widget.weibo.com/distribution/comments.php";
        var g = ["silver", "blue", "pink", "green", "yellow", "orange", "purple", "skyblue", "gray", "black"];
        var f = function (i) {
            return e.core.arr.indexOf(i, g) + 1
        };
        return function (p) {
            var m = {};
            var q = e.common.iframe();
            var n = e.core.obj.parseParam({
                dom: null,
                url: "",
                border: "y",
                width: "280",
                skin: "silver",
                ralateuid: "",
                brandline: "n",
                fontsize: "14",
                color: "",
                language: "zh_cn",
                appkey: ""
            }, p);
            var k = n.dom;
            if (!k) {
                throw"no avaliable dom element found."
            }
            var l = e.kit.extra.clone(n);
            var i = l.url;
            if (i == "" || i == "auto") {
                i = document.location.href
            }
            l.url = encodeURIComponent(i);
            var j = l.width;
            if (j == "auto") {
                l.width = "0";
                j = "100%"
            }
            if (l.color != "") {
                l.colordiy = "1"
            }
            if (l.border == "y") {
                l.border = "1"
            }
            l.skin = f(l.skin);
            delete l.dom;
            var o = e.kit.extra.jsonToUrl(l, h, function (r) {
                return r
            });
            q.insertIFrame({id: "WBCommentFrame", url: o, root: k, width: j, height: l.height});
            e.core.io.scriptLoader({
                url: "http://js.t.sinajs.cn/open/widget/js/widget/comment.js?ver=20120605.js",
                onComplete: function () {
                    window.WBComment.init({id: "WBCommentFrame"})
                }
            });
            return m
        }
    });
    b.register("widget.iframe.show", function (e) {
        var h = "http://widget.weibo.com/weiboshow/index.php";
        var g = ["default", "gray", "green", "pink", "white", "purple", "yellow", "orange", "coffee", "blue", "black"];
        var f = function (i) {
            return e.core.arr.indexOf(i, g) + 1
        };
        return function (i) {
            var n = {};
            var p = e.common.iframe();
            var l = e.core.obj.parseParam({
                dom: null,
                uid: "",
                titlebar: "y",
                border: "y",
                fans: "y",
                feed: "y",
                fansrow: "2",
                verifier: "",
                width: "350",
                height: "550",
                ptype: "1",
                skin: "default",
                speed: "0",
                color: "",
                language: "zh_cn",
                appkey: ""
            }, i);
            var o = l.dom;
            if (!o) {
                throw"no avaliable dom element found."
            }
            if (e.kit.extra.isNull(l.uid)) {
                throw"no avaliable uid found."
            }
            var k = e.kit.extra.clone(l);
            k.isTitle = k.titlebar;
            k.noborder = k.border;
            k.isFans = k.fans;
            k.isWeibo = k.feed;
            k.fansRow = k.fansrow;
            k.skin = f(k.skin);
            var m = k.width;
            if (m == "auto") {
                k.width = "0";
                m = "100%"
            }
            delete k.dom;
            delete k.titlebar;
            delete k.border;
            delete k.fans;
            delete k.feed;
            delete k.fansrow;
            var j = e.kit.extra.jsonToUrl(k, h);
            p.insertIFrame({url: j, root: o, width: m, height: k.height});
            return n
        }
    });
    b.register("core.dom.setStyles", function (e) {
        return function (g, j, k) {
            if (!e.core.arr.isArray(g)) {
                var g = [g]
            }
            for (var h = 0, f = g.length; h < f; h++) {
                e.core.dom.setStyle(g[h], j, k)
            }
            return g
        }
    });
    b.register("core.dom.next", function (e) {
        return function (g) {
            var f = g.nextSibling;
            if (!f) {
                return null
            } else {
                if (f.nodeType !== 1) {
                    f = arguments.callee(f)
                }
            }
            return f
        }
    });
    b.register("kit.dom.firstChild", function (f) {
        var e = f.core.dom.next;
        return function (g) {
            var h = g.firstChild;
            if (h && h.nodeType != 1) {
                h = e(h)
            }
            return h
        }
    });
    b.register("template.social.hotlist", function (i) {
        var h = {};
        var g = '<#et temp config><div node-type="outer" class="WB_widgets WB_txta WB_linka  social_recommend social_recommend_rank"><div class="sore_title"><div class="soreTit_logo"><span title="微博" class="WB_logo16a">微博</span>微博分享TOP${config.count}<#if (config.friendlist == "y")><span class="soca_icon soca_icon_friend"></span><#else><#if (config.cycle == "hour")><span class="soca_icon soca_icon_time"></span></#if><#if (config.cycle == "day")><span class="soca_icon soca_icon_day"></span></#if><#if (config.cycle == "week")><span class="soca_icon soca_icon_week"></span></#if></#if></div><#if (config.type == "simple")><div class="soreTit_page" node-type="nav" style="display:none;"><span class="WB_widget_page"><a href="javascript:void(0)" class="WB_ctl_prv_dis" node-type="prev" onclick="return false;">上一张</a><a href="javascript:void(0)" class="WB_ctl_nxt_dis" node-type="next" onclick="return false;">下一张</a></span><span node-type="page" class="page_count"></span></div></#if></div><div class="sore_list" node-type="inner"></div></div></#et>';
        var j = '<div class="state_box"><div class="soaclist_state"><span class="WB_loadingB"></span></div></div>';
        var f = '<div class="state_box"><div class="soaclist_state"><span class="WB_tipS_err"></span>加载失败，请<a href="javascript:void(0);" onclick="return false;" action-type="retry">重试</a></div></div>';
        var e = '<div class="state_box"><div class="log_box"><p class="log_txt">登录以查看好友热门分享</p><div class="WB_widgets WB_loginButton"><a href="javascript:;" action-type="login"><img alt="" src="http://img.t.sinajs.cn/t4/appstyle/widget/images/loginButton/loginButton_24.png"></a></div></div></div>';
        h.layoutTemplate = g;
        h.loadingTemplate = j;
        h.errorTemplate = f;
        h.loginTemplate = e;
        return h
    });
    b.register("core.arr.foreach", function (g) {
        var e = function (n, k) {
            var m = [];
            for (var l = 0, j = n.length; l < j; l += 1) {
                var h = k(n[l], l);
                if (h === false) {
                    break
                } else {
                    if (h !== null) {
                        m[l] = h
                    }
                }
            }
            return m
        };
        var f = function (m, i) {
            var l = {};
            for (var j in m) {
                var h = i(m[j], j);
                if (h === false) {
                    break
                } else {
                    if (h !== null) {
                        l[j] = h
                    }
                }
            }
            return l
        };
        return function (i, h) {
            if (g.core.arr.isArray(i) || (i.length && i[0] !== undefined)) {
                return e(i, h)
            } else {
                if (typeof i === "object") {
                    return f(i, h)
                }
            }
            return null
        }
    });
    b.register("core.ani.algorithm", function (f) {
        var e = {
            linear: function (h, g, k, j, i) {
                return k * h / j + g
            }, easeincubic: function (h, g, k, j, i) {
                return k * (h /= j) * h * h + g
            }, easeoutcubic: function (h, g, k, j, i) {
                if ((h /= j / 2) < 1) {
                    return k / 2 * h * h * h + g
                }
                return k / 2 * ((h -= 2) * h * h + 2) + g
            }, easeinoutcubic: function (h, g, k, j, i) {
                if (i == undefined) {
                    i = 1.70158
                }
                return k * (h /= j) * h * ((i + 1) * h - i) + g
            }, easeinback: function (h, g, k, j, i) {
                if (i == undefined) {
                    i = 1.70158
                }
                return k * (h /= j) * h * ((i + 1) * h - i) + g
            }, easeoutback: function (h, g, k, j, i) {
                if (i == undefined) {
                    i = 1.70158
                }
                return k * ((h = h / j - 1) * h * ((i + 1) * h + i) + 1) + g
            }, easeinoutback: function (h, g, k, j, i) {
                if (i == undefined) {
                    i = 1.70158
                }
                if ((h /= j / 2) < 1) {
                    return k / 2 * (h * h * (((i *= (1.525)) + 1) * h - i)) + g
                }
                return k / 2 * ((h -= 2) * h * (((i *= (1.525)) + 1) * h + i) + 2) + g
            }
        };
        return {
            addAlgorithm: function (g, h) {
                if (e[g]) {
                    throw"[core.ani.tweenValue] this algorithm :" + g + "already exist"
                }
                e[g] = h
            }, compute: function (l, i, h, j, k, g, m) {
                if (typeof e[l] !== "function") {
                    throw"[core.ani.tweenValue] this algorithm :" + l + "do not exist"
                }
                return e[l](j, i, h, k, g, m)
            }
        }
    });
    b.register("core.ani.tweenArche", function (e) {
        return function (o, p) {
            var l, k, j, g, h, f, m, i;
            k = {};
            l = e.core.obj.parseParam({
                animationType: "linear",
                distance: 1,
                duration: 500,
                callback: e.core.func.empty,
                algorithmParams: {},
                extra: 5,
                delay: 25
            }, p);
            var n = function () {
                j = (+new Date() - g);
                if (j < l.duration) {
                    h = e.core.ani.algorithm.compute(l.animationType, 0, l.distance, j, l.duration, l.extra, l.algorithmParams);
                    o(h);
                    f = setTimeout(n, l.delay)
                } else {
                    i = "stop";
                    l.callback()
                }
            };
            i = "stop";
            k.getStatus = function () {
                return i
            };
            k.play = function () {
                g = +new Date();
                h = null;
                n();
                i = "play";
                return k
            };
            k.stop = function () {
                clearTimeout(f);
                i = "stop";
                return k
            };
            k.resume = function () {
                if (m) {
                    g += (+new Date() - m);
                    n()
                }
                return k
            };
            k.pause = function () {
                clearTimeout(f);
                m = +new Date();
                i = "pause";
                return k
            };
            k.destroy = function () {
                clearTimeout(f);
                m = 0;
                i = "stop"
            };
            return k
        }
    });
    b.register("core.dom.cssText", function (e) {
        return function (j) {
            j = (j || "").replace(/(^[^\:]*?;)|(;[^\:]*?$)/g, "").split(";");
            var l = {}, g;
            for (var f = 0; f < j.length; f++) {
                g = j[f].split(":");
                l[g[0].toLowerCase()] = g[1]
            }
            var k = [], h = {
                push: function (m, i) {
                    l[m.toLowerCase()] = i;
                    return h
                }, remove: function (i) {
                    i = i.toLowerCase();
                    l[i] && delete l[i];
                    return h
                }, getCss: function () {
                    var n = [];
                    for (var m in l) {
                        n.push(m + ":" + l[m])
                    }
                    return n.join(";")
                }
            };
            return h
        }
    });
    b.register("core.json.merge", function (f) {
        var e = function (h) {
            if (h === undefined) {
                return true
            }
            if (h === null) {
                return true
            }
            if (f.core.arr.inArray(["number", "string", "function"], (typeof h))) {
                return true
            }
            if (f.core.arr.isArray(h)) {
                return true
            }
            if (f.core.dom.isNode(h)) {
                return true
            }
            return false
        };
        var g = function (m, o, j) {
            var n = {};
            for (var i in m) {
                if (o[i] === undefined) {
                    n[i] = m[i]
                } else {
                    if (!e(m[i]) && !e(o[i]) && j) {
                        n[i] = arguments.callee(m[i], o[i])
                    } else {
                        n[i] = o[i]
                    }
                }
            }
            for (var h in o) {
                if (n[h] === undefined) {
                    n[h] = o[h]
                }
            }
            return n
        };
        return function (h, k, j) {
            var i = f.core.obj.parseParam({isDeep: false}, j);
            return g(h, k, i.isDeep)
        }
    });
    b.register("core.util.color", function (j) {
        var g = /^#([a-fA-F0-9]{3,8})$/;
        var i = /^rgb[a]?\s*\((\s*([0-9]{1,3})\s*,){2,3}(\s*([0-9]{1,3})\s*)\)$/;
        var h = /([0-9]{1,3})/ig;
        var e = /([a-fA-F0-9]{2})/ig;
        var f = j.core.arr.foreach;
        var k = function (n) {
            var l = [];
            var m = [];
            if (g.test(n)) {
                m = n.match(g);
                if (m[1].length <= 4) {
                    l = f(m[1].split(""), function (p, o) {
                        return parseInt(p + p, 16)
                    })
                } else {
                    if (m[1].length <= 8) {
                        l = f(m[1].match(e), function (p, o) {
                            return parseInt(p, 16)
                        })
                    }
                }
                return l
            }
            if (i.test(n)) {
                m = n.match(h);
                l = f(m, function (p, o) {
                    return parseInt(p, 10)
                });
                return l
            }
            return false
        };
        return function (n, l) {
            var m = k(n);
            if (!m) {
                return false
            }
            var o = {};
            o.getR = function () {
                return m[0]
            };
            o.getG = function () {
                return m[1]
            };
            o.getB = function () {
                return m[2]
            };
            o.getA = function () {
                return m[3]
            };
            return o
        }
    });
    b.register("core.ani.tween", function (h) {
        var e = h.core.ani.tweenArche;
        var f = h.core.arr.foreach;
        var k = h.core.dom.getStyle;
        var l = h.core.func.getType;
        var o = h.core.obj.parseParam;
        var n = h.core.json.merge;
        var g = h.core.util.color;
        var j = function (s) {
            var r = /(-?\d\.?\d*)([a-z%]*)/i.exec(s);
            var q = [0, "px"];
            if (r) {
                if (r[1]) {
                    q[0] = r[1] - 0
                }
                if (r[2]) {
                    q[1] = r[2]
                }
            }
            return q
        };
        var p = function (u) {
            for (var t = 0, q = u.length; t < q; t += 1) {
                var r = u.charCodeAt(t);
                if (r > 64 && r < 90) {
                    var v = u.substr(0, t);
                    var x = u.substr(t, 1);
                    var w = u.slice(t + 1);
                    return v + "-" + x.toLowerCase() + w
                }
            }
            return u
        };
        var m = function (v, x, s) {
            var w = k(v, s);
            if (l(w) === "undefined" || w === "auto") {
                if (s === "height") {
                    w = v.offsetHeight
                }
                if (s === "width") {
                    w = v.offsetWidth
                }
            }
            var r = {start: w, end: x, unit: "", key: s, defaultColor: false};
            if (l(x) === "number") {
                var t = [0, "px"];
                if (l(w) === "number") {
                    t[0] = w
                } else {
                    t = j(w)
                }
                r.start = t[0];
                r.unit = t[1]
            }
            if (l(x) === "string") {
                var q, u;
                q = g(x);
                if (q) {
                    u = g(w);
                    if (!u) {
                        u = g("#fff")
                    }
                    r.start = u;
                    r.end = q;
                    r.defaultColor = true
                }
            }
            v = null;
            return r
        };
        var i = {
            opacity: function (r, u, q, s) {
                var t = (r * (q - u) + u);
                return {filter: "alpha(opacity=" + t * 100 + ")", opacity: Math.max(Math.min(1, t), 0), zoom: "1"}
            }, defaultColor: function (w, s, t, y, z) {
                var q = Math.max(0, Math.min(255, Math.ceil((w * (t.getR() - s.getR()) + s.getR()))));
                var u = Math.max(0, Math.min(255, Math.ceil((w * (t.getG() - s.getG()) + s.getG()))));
                var x = Math.max(0, Math.min(255, Math.ceil((w * (t.getB() - s.getB()) + s.getB()))));
                var v = {};
                v[p(z)] = "#" + (q < 16 ? "0" : "") + q.toString(16) + (u < 16 ? "0" : "") + u.toString(16) + (x < 16 ? "0" : "") + x.toString(16);
                return v
            }, "default": function (t, w, q, u, s) {
                var v = (t * (q - w) + w);
                var r = {};
                r[p(s)] = v + u;
                return r
            }
        };
        return function (s, B) {
            var v, w, q, C, D, A, E, t, u, y;
            B = B || {};
            w = o({animationType: "linear", duration: 500, algorithmParams: {}, extra: 5, delay: 25}, B);
            w.distance = 1;
            w.callback = (function () {
                var F = B.end || h.core.func.empty;
                return function () {
                    C(1);
                    E();
                    F(s)
                }
            })();
            q = n(i, B.propertys || {});
            A = null;
            D = {};
            u = [];
            C = function (F) {
                var H = [];
                var G = f(D, function (M, K) {
                    var L;
                    if (q[K]) {
                        L = q[K]
                    } else {
                        if (M.defaultColor) {
                            L = q.defaultColor
                        } else {
                            L = q["default"]
                        }
                    }
                    var J = L(F, M.start, M.end, M.unit, M.key);
                    for (var I in J) {
                        A.push(I, J[I])
                    }
                });
                s.style.cssText = A.getCss()
            };
            E = function () {
                var F;
                while (F = u.shift()) {
                    try {
                        F.fn();
                        if (F.type === "play") {
                            break
                        }
                        if (F.type === "destroy") {
                            break
                        }
                    } catch (G) {
                    }
                }
            };
            y = e(C, w);
            var x = function (F) {
                if (y.getStatus() !== "play") {
                    s = F
                } else {
                    u.push({fn: x, type: "setNode"})
                }
            };
            var r = function (F) {
                if (y.getStatus() !== "play") {
                    D = f(F, function (H, G) {
                        return m(s, H, G)
                    });
                    A = h.core.dom.cssText(s.style.cssText + (B.staticStyle || ""));
                    y.play()
                } else {
                    u.push({
                        fn: function () {
                            r(F)
                        }, type: "play"
                    })
                }
            };
            var z = function () {
                if (y.getStatus() !== "play") {
                    y.destroy();
                    s = null;
                    v = null;
                    w = null;
                    q = null;
                    C = null;
                    D = null;
                    A = null;
                    E = null;
                    t = null;
                    u = null
                } else {
                    u.push({fn: z, type: "destroy"})
                }
            };
            v = {};
            v.play = function (F) {
                r(F);
                return v
            };
            v.stop = function () {
                y.stop();
                return v
            };
            v.pause = function () {
                y.pause();
                return v
            };
            v.resume = function () {
                y.resume();
                return v
            };
            v.finish = function (F) {
                r(F);
                z();
                return v
            };
            v.setNode = function (F) {
                x(F);
                return v
            };
            v.destroy = function () {
                z();
                return v
            };
            return v
        }
    });
    b.register("common.plugins.slider", function (i) {
        var f = i.core.evt.addEvent, e = i.core.dom.getStyle, h = i.core.dom.setStyle, g = i.core.dom.setStyles,
            j = i.core.dom.sizzle;
        return function (C, y) {
            if (!C) {
                throw"it need node for slider"
            }
            var q = {};
            var t = {
                step: 1,
                speed: 1000,
                show: 1,
                auto: false,
                pause: 2000,
                duration: 500,
                animationType: "linear",
                itemWidth: null,
                itemSelector: "",
                prevCss: "WB_ctl_prv,WB_ctl_prv_dis",
                nextCss: "WB_ctl_nxt,WB_ctl_nxt_dis",
                vertical: false,
                continuous: false,
                controlsFade: true,
                slideCbk: null
            };
            var m = i.core.obj.parseParam(t, y);
            var D = {};
            D.prevBtn = C.prev;
            D.nextBtn = C.next;
            D.slider = C.slider;
            D.dir = "next";
            if (!D.slider) {
                throw"no slider box found"
            }
            var x = i.kit.dom.firstChild(D.slider),
                w = (m.itemSelector == "") ? j("li", x) : j("li[" + m.itemSelector + "]", x), F = w.length,
                B = m.itemWidth || w[0].offsetWidth + parseInt(e(w[0], "marginLeft")) + parseInt(e(w[0], "marginRight")),
                z = w[0].offsetHeight + parseInt(e(w[0], "marginTop")) + parseInt(e(w[0], "marginBottom")),
                K = Math.floor((F - m.show) / m.step), o = 0, n = true, p = F;
            var r = m.prevCss.split(","), I = m.nextCss.split(","), s = r[0], J = r[1], G = I[0], v = I[1];
            h(D.slider, "overflow", "hidden");
            h(x, "width", p * B + "px");
            if (!m.vertical) {
                for (var E = 0; E < F; E++) {
                    h(w[E], "float", "left")
                }
            }
            if (m.itemWidth) {
                for (var E = 0; E < F; E++) {
                    h(w[E], "width", m.itemWidth + "px")
                }
            }
            var l = function () {
            };
            var H = i.core.ani.tween(x, {
                animationType: m.animationType, duration: m.duration, end: function () {
                    m.slideCbk && m.slideCbk({
                        slider: x,
                        dir: D.dir,
                        itemWidth: B,
                        index: o,
                        items: w,
                        item: w[o],
                        length: F
                    })
                }
            });
            var A = function (L, N, M) {
                if (i.core.arr.isArray(L)) {
                    i.core.arr.foreach(L, function (O, P) {
                        f(O, N, M)
                    })
                } else {
                    f(L, N, M)
                }
            };
            A(D.prevBtn, "click", function () {
                k("prev", true)
            });
            A(D.nextBtn, "click", function () {
                k("next", true)
            });
            function k(M, N) {
                var O = o;
                switch (M) {
                    case"next":
                        o = (o >= K) ? (m.continuous ? 0 : K) : o + 1;
                        break;
                    case"prev":
                        o = (o <= 0) ? (m.continuous ? K : 0) : o - 1;
                        break;
                    default:
                        break
                }
                D.dir = M;
                var L;
                if (!m.vertical) {
                    L = (o * B * m.step * -1);
                    H.play({marginLeft: L})
                } else {
                    L = (o * z * m.step * -1);
                    H.play({marginTop: L})
                }
                if (m.controlsFade) {
                    if (o == 0) {
                        n = false;
                        if (K == 0) {
                            D.prevBtn.className = J;
                            D.nextBtn.className = v
                        } else {
                            D.prevBtn.className = J;
                            D.nextBtn.className = G
                        }
                    } else {
                        if (o == K) {
                            n = false;
                            D.prevBtn.className = s;
                            D.nextBtn.className = v
                        } else {
                            n = true;
                            D.prevBtn.className = s;
                            D.nextBtn.className = G
                        }
                    }
                }
                if (N || !n) {
                    clearTimeout(u)
                }
                if (m.auto && (n || m.continuous)) {
                    u = setTimeout(function () {
                        k(M, false)
                    }, m.speed + m.pause)
                }
            }

            var u;
            if (m.auto) {
                u = setTimeout(function () {
                    k("next", false)
                }, m.pause)
            }
            if (m.controlsFade) {
                if (K == 0) {
                    D.prevBtn.className = J;
                    D.nextBtn.className = v
                } else {
                    D.prevBtn.className = J;
                    D.nextBtn.className = G
                }
            }
        };
        return that
    });
    b.register("widget.social.hotlist", function (g) {
        var e = g.core.util.easyTemplate, f = g.core.evt.addEvent, l = g.core.evt.removeEvent, o = g.core.dom.sizzle,
            j = g.core.dom.builder, k = g.core.util.browser.IE6, h = g.common.social.util,
            n = g.template.social.hotlist;
        var i = "appstyle/widget/css/socialRelations/social_recommend.css";
        var m = {all: -1, hour: 0, day: 1, week: 2, friend: 3};
        var p = function (r) {
            var q = "";
            if (r == "text,face" || r == "face,text") {
                q = 0
            } else {
                if (r == "text") {
                    q = 1
                } else {
                    if (r == "face") {
                        q = 2
                    }
                }
            }
            return q
        };
        return function (x) {
            var y = {};
            var q, G, s, B;
            var z = g.core.obj.parseParam({
                dom: null,
                count: 10,
                type: "normal",
                cycle: "week",
                domain: null,
                friendlist: "n",
                social: "",
                popup: null,
                width: 245,
                height: "auto"
            }, x);
            q = z.dom;
            var E = z.friendlist == "n" ? m[z.cycle] : m[z.friend];
            z.band = E;
            var w = g.common.social.statistical({band: E});
            var H = function () {
                F();
                I();
                r()
            };
            var A = function () {
            };
            var F = function () {
            };
            var I = function () {
                A();
                if (z.social.indexOf("face") != -1) {
                    z.popup = "layer"
                }
                if (z.popup == "layer") {
                    z.widget = "hotlist";
                    g.widget.social.bubble(G, z)
                }
                v.pv()
            };
            var A = function () {
                g.kit.io.cssLoader(i, {load_ID: "social2_css_load_status"});
                var L = e(n.layoutTemplate, z).toString();
                var N = j(L);
                G = g.kit.dom.parseDOM(N.list);
                var M = z.width, K = z.height;
                if (/^(\d+)$/.test(M)) {
                    if (k) {
                        M = M < 245 ? 245 : M;
                        G.inner.style.width = parseInt(M, 10) - 10 + "px"
                    }
                    G.outer.style.width = parseInt(M, 10) + "px"
                }
                if (/^(\d+)$/.test(K)) {
                    G.outer.style.height = parseInt(K, 10) + "px"
                }
                q.innerHTML = "";
                q.appendChild(N.box);
                C()
            };
            var C = function () {
                G.inner.innerHTML = n.loadingTemplate;
                var L = z.friendlist == "n" ? "top_domain" : "top_user";
                var M = z.friendlist == "y" ? "week" : z.cycle;
                var K = {
                    domain: z.domain,
                    num: z.count,
                    width: z.width,
                    social: p(z.social),
                    category: m[M],
                    suggest_user: (z.social != "" ? 1 : 0)
                }, N = function (P) {
                    if (P && P.code == "100000") {
                        var O = P.data;
                        if (O == "") {
                            O = z.friendlist == "n" ? "暂无分享记录" : "暂无好友分享记录";
                            O = '<div class="state_box"><div class="soaclist_state">' + O + "</div></div>"
                        }
                        G.inner.innerHTML = O;
                        (z.type == "simple") && t()
                    } else {
                        if (P.code == "100002") {
                            var O = n.loginTemplate;
                            if (z.type == "normal") {
                                O += '<p class="list_tit">热门分享</p>' + P.data
                            }
                            G.inner.innerHTML = O
                        } else {
                            G.inner.innerHTML = n.errorTemplate
                        }
                    }
                };
                g.comp.social.io.jsonp(L, K, N)
            };
            var t = function () {
                var K = o("li[action-type=lihover]", G.inner);
                for (var L = 0; L < K.length; L++) {
                    K[L].className = "li_hover"
                }
                G.page.innerHTML = 1 + "/" + K.length;
                if (K.length > 0) {
                    G.nav.style.display = "";
                    g.common.plugins.slider({
                        slider: G.inner,
                        prev: G.prev,
                        next: G.next
                    }, {
                        itemWidth: g.core.dom.getSize(G.inner).width,
                        itemSelector: "action-type=lihover",
                        slideCbk: function (M) {
                            G.page.innerHTML = parseInt(M.index + 1) + "/" + M.length
                        }
                    })
                }
            };
            var u = function (K) {
                clearTimeout(B);
                B = setTimeout(function () {
                    s = s || o(".li_hover", G.inner)[0];
                    if (s === K.el) {
                        return
                    }
                    s && (s.className = "");
                    K.el.className = "li_hover";
                    s = K.el
                }, 200)
            };
            var D = function () {
                if (!WB2.checkLogin()) {
                    WB2.login(function () {
                        C();
                        s = null
                    })
                }
            };
            var v = {
                pv: function () {
                    w.request({action: "pv"})
                }, linkclk: function () {
                    w.request({action: "linkclk"})
                }, userclk: function () {
                    w.request({action: "userclk"})
                }
            };
            var r = function () {
                delegateEvt = g.core.evt.delegatedEvent(G.outer);
                delegateEvt.add("retry", "click", C);
                delegateEvt.add("login", "click", D);
                delegateEvt.add("linkclk", "click", v.linkclk);
                delegateEvt.add("userclk", "click", v.userclk);
                if (z.type == "normal") {
                    delegateEvt.add("lihover", "mouseover", u)
                }
            };
            var J = function () {
                delegateEvt.remove("retry", "click");
                delegateEvt.remove("login", "click");
                delegateEvt.remove("linkclk", "click");
                delegateEvt.remove("userclk", "click")
            };
            H();
            y.destroy = J;
            return y
        }
    });
    b.register("widget.iframe.hotlist", function (e) {
        return function (f) {
            e.widget.social.hotlist(f)
        }
    });
    b.register("widget.iframe.topic", function (e) {
        var h = "http://widget.weibo.com/topics";
        var g = h + "/topic_vote_base.php";
        var f = {topmid: "top_mblog", column: "isshowright", tags: "tag", red_text: "a_view", blue_text: "b_view"};
        return function (r) {
            var n = {};
            var t = e.common.iframe();
            var k = {
                dom: null,
                uid: "",
                url: "",
                topmid: "",
                column: "y",
                border: "y",
                footbar: "y",
                title: "",
                width: "821",
                height: "1580",
                tags: "",
                red_text: "",
                blue_text: "",
                tab: "",
                color: "",
                refer: "y",
                filter: "n",
                language: "zh_cn",
                version: "pk",
                appkey: ""
            };
            if (r.version == "base") {
                k.height = 1190
            }
            var o = e.core.obj.parseParam(k, r);
            var l = o.dom;
            if (!l) {
                throw"no avaliable dom element found."
            }
            if (o.version == "base") {
                if (o.height == 1580) {
                    o.height == 1190
                }
            }
            var q = 1200;
            var m = e.kit.extra.clone(o);
            if (m.filter == "n") {
                m.dup = 0;
                m.antispam = 0;
                m.isOutTopicSearch = 0
            } else {
                m.dup = 1;
                m.antispam = 1;
                m.isOutTopicSearch = 2
            }
            if (m.column == "y") {
                m.width = (m.width > 821 ? m.width : 821)
            } else {
                m.width = (m.width > 560 ? m.width : 560)
            }
            m.width = (m.width > q ? q : m.width);
            if (o.version == "base") {
                m.height = (m.height < 925 ? 1190 : m.height) - 591
            } else {
                m.height = (m.height < 1250 ? 1580 : m.height) - 980
            }
            for (var j in f) {
                m[f[j]] = m[j];
                if (j == "tags" || j == "red_text" || j == "blue_text") {
                    m[f[j]] = encodeURI(m[j])
                }
                delete m[j]
            }
            if (o.url != "") {
                m.og = encodeURIComponent(o.url);
                delete m.url
            } else {
                var s = e.core.dom.sizzle('meta[property="og:url"]');
                if (s && s[0]) {
                    m.og = encodeURIComponent(s[0].getAttribute("content"))
                } else {
                    m.og = encodeURIComponent(document.location.href)
                }
            }
            m.app_src = o.appkey;
            delete m.appkey;
            m.r = (new Date()).valueOf();
            delete m.dom;
            if (o.version == "pk") {
                g = h + "/topic_vote.php"
            }
            var i = e.kit.extra.jsonToUrl(m, g);
            t.insertIFrame({url: i, root: l, width: m.width, height: o.height});
            return n
        }
    });
    var a = {
        "follow-button": "follow",
        "share-button": "share",
        livestream: "live",
        bulkfollow: "bulkfollow",
        comments: "comments",
        list: "list",
        show: "show",
        hotlist: "hotlist",
        topic: "topic"
    };
    var c = function (f) {
        var e = f.tagName;
        e != "" && a[e] != "" && typeof b.widget.iframe[a[e]] == "function" && b.widget.iframe[a[e]](f)
    };
    WB2.widget.iframeWidget = c
})();