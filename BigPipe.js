/* Bigpipe - version 2.55
   Kenny F. 2013
*/
var BigPipe = function (d) {

    /* Pagelet definition */

    function PageLet(data, fragment) {

        // Inject html

        function insertDOM() {
            console.log("Injected content for pagelet " + data.id);
            fragment.innerHTML = data.content;
        }

        function inArray(a, b) {
            a = a || [];
            for (var d = a.length; d--;) {
                if (a[d] === b) {
                    return !1;
                }
            }
            return !0;
        }
        var remainingCss = 0, // Count the CSS files that is left to be injected
            loadedcss = []; // Holds all loaded css files, and prevent double injection
        return {
            loadCss: function () {
                if (data.css && 0 !== data.css.length) {
                    console.log("Loading CSS for pagelet " + data.id);
                    for (var c = remainingCss = data.css.length; c--;) {
                        inArray(loadedcss, data.css[c]) && (Loader.loadCss(data.css[c], fragment, function () {
                            !--remainingCss && insertDOM()
                        }), loadedcss.push(data.css[c]))
                    }
                } else {
                    insertDOM();
                }
            }
        }
    }
    var injected_js = [], // Keep track of javascript files that are allready injected into the document
        Loader = function () {
            function Browser() {
                if (!e) {
                    var a = navigator.userAgent.toLowerCase();
                    e = (/(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || 0 > a.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [])[1];
                }
                return e;
            }

            var f = d.getElementsByTagName("head")[0] || d.getElementsByTagName("body")[0],
                e; // Just to be sure when it comes to old browsers

            return {

                // Insert Javascript files into the document

                loadJs: function (url, cb) {

                    // Prevent injection of other files then Javascript

                    if ("string" == typeof url || "css" == url.split(".").pop()) url = url || "";
                    if (url !== '') {

                        var script = d.createElement("script"),
                            loaded = !1;
                        script.async = !1; // Required for FireFox 3.6 / Opera async loading.
                        script.type = "text/javascript";

                        // Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
                        // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.

                        "opera" == Browser() && this.readyState && "complete" != this.readyState || (script.onload = function () {
                                loaded || (console.log("loaded " + url), loaded = !0, cb && cb())
                            }, // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  
                            script.onreadystatechange = function () {
                                loaded || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (script.onerror = script.onload = script.onreadystatechange = null, console.log("loaded " + url), loaded = !0, f && script.parentNode && f.removeChild(script))
                            },
                            // Because of a bug in IE8, the src needs to be set after the element has been added to the document.
                            f.appendChild(script), script.src = url);
                    }
                },

                // Inject CSS files into the document

                loadCss: function (url, fragment, cb) {

                    // Prevent injection of other files then CSS

                    if ("string" == typeof url || "css" == url.split(".").pop()) url = url || "";
                    if (url !== '') {

                        var _link = d.createElement("link");
                        _link.rel = "stylesheet";
                        _link.type = "text/css";
                        _link.href = url;
                        "msie" == Browser() ? _link.onreadystatechange = function () {
                            /loaded|complete/.test(_link.readyState) && cb();
                        } : "opera" == Browser() ? _link.onload = cb : function () {

                            // NOTE! "opera" will only be detected by older browsers. Newer version of Opera use the same engine as Chrome

                            try {
                                _link.sheet.cssRule
                            } catch (a) {
                                setTimeout(arguments.callee, 20);
                                return;
                            }
                            cb()
                        }();
                        f.appendChild(_link);

                        // Make the paglet visible after CSS is injected

                        fragment.style.display = "block"
                    }
                }
            }
        }();
    return {
        OnPageLoad: function (data) {

            // Hack for IE9 and older IE versions, to avoid the console.log problem

            window.console || (console = {
                log: function () {}
            });

            // Allways add a css file, else we prevent the code from running

            if (data.css) {

                if ("string" == typeof data.id && (fragment = d.getElementById(data.id.toLowerCase()) || ""), "" !== fragment) {

                    // Hide the paglet until css are injected

                    console.log("Hide content for pagelet " + data.id);
                    fragment.style.display = "none";

                    // Collect the required javascript files

                    if (0 < data.js.length) {

                        for (var f = data.js.length; f--;) {

                            // Prevent double injection of Javascript files. If paglet #1 uses page.js and also
                            // paglet #2 and paglet #3 uses the same javascript file, there will be only one injected
                            // into the document.

                            var ijl = injected_js.length;

                            if (0 < ijl) {
                                for (var e = ijl; e--;) {
                                    ijl[e] !== data.js[f] && injected_js.push(data.js[f]);
                                }
                            } else {
                                injected_js.push(data.js[f]);
                            }
                        }
                    }

                    (new PageLet(data, fragment)).loadCss();

                    // Inject JS after all pagelets have been visible on the screen
                    // and the last paglet is completed


                    data.is_last && (d.getElementsByTagName("script"), function g(b) {
                        setTimeout(function () {
                            console.log("Injecting JS file - " + data.js[b - 1]);
                            Loader.loadJs(data.js[b - 1]);
                            --b && g(b);
                        }, 100)
                    }(injected_js.length))
                }
            } else {
                console.log("WARNING!! No CSS defined.");
            }
        }
    }
}(document);
DomReady(window, BigPipe);

function DomReady(d, l) {
    var h = !1,
        k = !0,
        a = d.document,
        f = a.documentElement,
        e = a.addEventListener ? "addEventListener" : "attachEvent",
        m = a.addEventListener ? "removeEventListener" : "detachEvent",
        g = a.addEventListener ? "" : "on",
        b = function (c) {
            if ("readystatechange" != c.type || "complete" == a.readyState) {
                ("load" == c.type ? d : a)[m](g + c.type, b, !1), !h && (h = !0) && l.calPageLet(d, c.type || c)
            }
        }, c = function () {
            try {
                f.doScrolPageLet("left")
            } catch (a) {
                setTimeout(c, 50);
                return
            }
            b("poll")
        };
    if ("complete" == a.readyState) {
        l.calPageLet(d, "lazy")
    } else {
        if (a.createEventObject && f.doScroll) {
            try {
                k = !d.frameElement
            } catch (n) {}
            k && c()
        }
        a[e](g + "DOMContentLoaded", b, !1);
        a[e](g + "readystatechange", b, !1);
        d[e](g + "load", b, !1)
    }
};