/* Bigpipe - version 2.5
   Kenny F. 2013
*/
var BigPipe = function (doc) {

    // Javascript files to be injected

    var js = [];

    /* Pagelet definition */

    function PageLet(data, fragment) {

        // Inject html
        function insertDom() {

            console.log("Injected content for pagelet " + data.id);
            fragment.innerHTML = data.content;
        }

        function inArray(array, filename) {
            for (var i = array.length; i--;)
                if (array[i] == filename) return -1;
            return !0;
        }
        var remainingCss = 0,
            loadedcss = [];

        return {
            loadCss: function () {

                if (data.css && 0 !== data.css.length) {
                    console.log("Loading CSS for pagelet " + data.id);
                    for (var i = remainingCss = data.css.length; i--;) inArray(loadedcss, data.css[i]) && (Loader.loadCss(data.css[i], fragment, function () {
                        !--remainingCss && insertDom()
                    }), loadedcss.push(data.css[i]))
                } else insertDom()

            }
        }
    }
    var Loader = function () {

        function browser() {

            if (!cachedBrowser) {
                var ua = navigator.userAgent.toLowerCase(),
                    match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
                cachedBrowser = match[1]
            }

            return cachedBrowser
        }
        var head = doc.getElementsByTagName("head")[0] || doc.getElementsByTagName('body')[0], // Just to be sure when it comes to old browsers
            cachedBrowser;
        return {
            loadJs: function (url, cb) { // Inject JS in document...:
                var script = doc.createElement("script");
                script.async = !true // Required for FireFox 3.6 / Opera async loading.
                script.type = "text/javascript";
                var loaded = false;


                // Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
                // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.

                if ("opera" == browser() && this.readyState && this.readyState != 'complete') { // Affected: Opera Opera 9.26, 10.00
                    return;
                }
                // Real browsers		   
                script.onload = function () {
                    loaded || (console.log("loaded " + url), loaded = !0, cb && cb())
                };

                // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  

                script.onreadystatechange = function () {

                    loaded || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (script.onerror = script.onload = script.onreadystatechange = null, console.log("loaded " + url), loaded = !0, head && script.parentNode && head.removeChild(script))
                };

                // Because of a bug in IE8, the src needs to be set after the element has been added to the document.

                head.appendChild(script)
                script.src = url;
            },
            loadCss: function (url, fragment, cb) {
                var _link = doc.createElement("link");
                _link.rel = "stylesheet";
                _link.type = "text/css";
                _link.href = url;
                "msie" == browser() ? _link.onreadystatechange = function () {
                    /loaded|complete/.test(_link.readyState) && cb();
                } : "opera" == browser() ? (_link.onload = cb) : function () {
                    // NOTE! "opera" will only be detected by older browsers. Newer version of Opera use the same engine as Chrome
                    try {
                        _link.sheet.cssRule;
                    } catch (e) {
                        setTimeout(arguments.callee, 20);
                        return
                    }
                    cb();
                }();
                head.appendChild(_link)

                // Make the paglet visible after CSS is injected

                fragment.style.display = "block"
            }
        }
    }();
    return {

        OnPageLoad: function (data) {

            // Hack for IE9 and older IE versions, to avoid the console.log problem

            window.console || (console = {
                log: function () {}
            });

            // Allways add a css file, else the code will not run

            if (!data.css) {
                console.log("WARNING!! No CSS defined.");
                return;
            }

            fragment = doc.getElementById(data.id);

            console.log("Hide content for pagelet " + data.id);

            // Hide all pagelets until css stylesheet is loaded.

            fragment.style.display = "none";

            // Async...:

            if (data.js.length > 0) {


                (function Loop(i) {

                    setTimeout(function () {

                        js.push(data.js[i - 1]);

                        --i && Loop(i);

                    }, 100);
                })(data.js.length);

            }

            /*	Registered pagelets */

            var pagelet = new PageLet(data, fragment);
            pagelet.loadCss();

            // Inject JS after all pagelets have been visible on the screen
            // and the last paglet is completed

            if (data.is_last) {

                console.log("Injecting JS files");
                var scripts = doc.getElementsByTagName("script");

                // Async loading to handle large amount of contacts

                (function Loop(i) {

                    setTimeout(function () {

                        // If someone accidently add two of the same JS files to one paglet, we only load one...:

                        if (scripts[i - 1].src == data.js) return;
                        Loader.loadJs(data.js[i - 1])

                        --i && Loop(i);

                    }, 100);
                })(js.length);


            }

        }
    }
}(document);

DomReady(window, BigPipe);

function DomReady(h, n) {

    var k = !1,
        l = !0,
        c = h.document,
        r = c.documentElement,
        f = c.addEventListener ? "addEventListener" : "attachEvent",
        g = c.addEventListener ? "removeEventListener" : "detachEvent",
        p = c.addEventListener ? "" : "on",
        m = function (b) {
            if ("readystatechange" != b.type || "complete" == c.readyState) {
                ("load" == b.type ? h : c)[g](p + b.type, m, !1), !k && (k = !0) && n.call(h, b.type || b)
            }
        }, q = function () {
            try {
                r.doScroll("left")
            } catch (b) {
                setTimeout(q, 50);
                return
            }
            m("poll")
        };
    if ("complete" == c.readyState) {
        n.call(h, "lazy")
    } else {
        if (c.createEventObject && r.doScroll) {
            try {
                l = !h.frameElement
            } catch (e) {}
            l && q()
        }
        c[f](p + "DOMContentLoaded", m, !1);
        c[f](p + "readystatechange", m, !1);
        h[f](p + "load", m, !1)
    }
};