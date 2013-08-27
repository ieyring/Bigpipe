/* Bigpipe - version 2.7
   Kenny F. 2013
*/
var BigPipe = function (d) {

    /**
     * Configure the Pagelet.
     *
     * @param {data} contain all paglet data sent from server.
     * @param {fragment} HTML injected div fragment
     */

    function PageLet(data, fragment) {

        // Inject html, and make the paglet visible

        function insertDOM() {
            console.log("Injected content for pagelet " + data.id);
            fragment.innerHTML = "string" == typeof data.content ? data.content : "Something went wrong!";
            fragment.style.display = "block"; // Make the paglet visible
        };

        function inArray(a, b) {
            for (var d = a.length; d--;) {
                if (a[d] === b) return !1;
            }
            return !0;
        }
        var remainingCss = 0, // Count the CSS files that is left to be injected
            loadedcss = []; // Holds all loaded css files, and prevent double injection
        return {
            loadCss: function () {
                if (data.css && 0 !== data.css.length) {
                    console.log("Loading CSS for pagelet " + data.id);
                    var dcl = remainingCss = data.css.length;
                    (function Loop(i) {
                        setTimeout(function () {
                            inArray(loadedcss, data.css[i - 1]) && (Loader.loadCss(data.css[i - 1], fragment, function () {
                                --remainingCss;
                            }), loadedcss.push(data.css[i - 1]))

                            // If many CSS files in one paglet, we only make the paglet visible after the last CSS file is
                            // injected						

                            i == dcl && insertDOM();

                            --i && Loop(i);

                        }, 10);
                    })(dcl);
                } else {
                    insertDOM();
                }
            }
        }
    }
    var injected_js = [], // // Dependencies for the page that is allready injected into the page
        Loader = function () {

            var userAgent = navigator.userAgent.toLowerCase(),
                Opera = /opera/i.test(navigator.userAgent),
                IE = /msie/.test(userAgent) && !/opera/.test(userAgent);

            return {

                // Insert Javascript files into the document

                loadJs: function (url, cb) {

                    // Prevent injection of other files then Javascript

                    if ("string" == typeof url || "css" == url.split(".").pop()) {

                        var script = d.createElement("script"),
                            firstScript = document.scripts[0],
                            loaded = false;
                        script.async = true; // Required for FireFox 3.6 / Opera async loading.
                        script.type = "text/javascript";

                        // Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
                        // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.

                        Opera && this.readyState && "complete" != this.readyState || (script.onload = function () {
                                loaded || (console.log("loaded " + url), loaded = !0, cb && cb())
                            }, // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  
                            script.onreadystatechange = function () {

                                loaded || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (script.onerror = script.onload = script.onreadystatechange = null, console.log("loaded " + url), loaded = !0, f && script.parentNode && f.removeChild(script))
                            },
                            // Because of a bug in IE8, the src needs to be set after the element has been added to the document.
                            firstScript.parentNode.insertBefore(script, firstScript), script.src = url);
                    }
                },

                // Inject CSS files into the document

                loadCss: function (url, fragment, cb) {

                    // Prevent injection of other files then CSS

                    if ("string" == typeof url || "css" == url.split(".").pop()) {

                        var _link = d.createElement("link");
                        _link.rel = "stylesheet";
                        _link.type = "text/css";
                        _link.href = url;

                        IE ? _link.onreadystatechange = function () {
                            /loaded|complete/.test(_link.readyState) && cb();
                        } : Opera ? _link.onload = cb : function () {

                            // NOTE! "opera" will only be detected by older browsers. Newer version of Opera use the same engine as Chrome

                            try {
                                _link.sheet.cssRule
                            } catch (a) {
                                setTimeout(arguments.callee, 20);

                                return;
                            }
                            cb()
                        }();
                        (d.getElementsByTagName("head")[0] || d.getElementsByTagName("body")[0]).appendChild(_link);
                    }
                }
            }
        }();
    return {
        OnPageLoad: function (data) {

            try {

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
                                    for (var e = ijl; e--;) ijl[e] !== data.js[f] && injected_js.push(data.js[f]);
                                } else {
                                    injected_js.push(data.js[f]);
                                }
                            }
                        }

                        (new PageLet(data, fragment)).loadCss();

                        // Inject JS after all pagelets have been visible on the screen
                        // and the last paglet is completed
                        // Async loading. The Javascript files will be injected one by one

                        data.is_last && (function g(b) {
                            setTimeout(function () {
                                console.log("Injecting JS file - " + data.js[b - 1]);
                                Loader.loadJs(data.js[b - 1]);
                                --b && g(b);
                            }, 10)
                        }(injected_js.length))
                    }
                } else {
                    window.location.href = data.onError;
                }
            } catch (e) {
                window.location.href = data.onError;
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
                ("load" == c.type ? d : a)[m](g + c.type, b, !1), !h && (h = !0) && l.call(d, c.type || c)
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
        l.call(d, "lazy")
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