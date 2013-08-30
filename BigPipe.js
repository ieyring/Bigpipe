/* Bigpipe - version 3.6
Kenny F. 2013
*/
BigPipe = function (doc) {

    /**
     * Configure the Pagelet.
     *
     * @param {data} contain all paglet data sent from server.
     * @param {fragment} HTML injected div fragment
     */


    function PagLet(data, fragment, c) {
        function inArray(a, b) {
            for (var c = a.length; c--;) {
                if (a[c] === b) {
                    return !0
                }
            }
            return !1
        }
        var b = data.css.length || 0;
        return {
            loadCss: function () {
                var loadedcss = []; // Holds all loaded css files, and prevent double injection
                console.log("Loading CSS for pagelet " + data.id);
                (function h(c) {
                    var st = setTimeout(function () {
                        var k = data.css[c - 1];

                        // If the stylesheet are loaded allready, we do nothing

                        // Only push the stylesheet into the "loaded" array if the stylesheet have been loaded
                        // If it fail, it will automaticly try to re-load the stylesheet because it's not in the array

                        inArray(loadedcss, k) || Loader.loadCss(k, function (a, c) {
                            a ? (loadedcss.push(k), loadedcss.length == b && (fragment.style.display = "block")) : console.log("Warning! An error occured during injection of CSS file: " + k)
                            // After the last stylesheet is loaded, and we have got a positive result feedback, inject paglet data
                            // and make the paglet visible
                        });

                        clearTimeout(st); // clear the counters to prevent memory leak
						k = null;
                        --c && h(c)
                    }, 20)
                })(b);
                console.log("Injected content for pagelet " + data.id);
                fragment.innerHTML = data.content;
				loadedcss = [];
                c();
            },
            loadJs: function () { // Insert Javascript files into the document
                console.log("Loading JS for pagelet " + data.id);
                var b = doc.getElementsByTagName("script");
                (function h(c) {
                    var st = setTimeout(function () {
                        b[c - 1].src != data.js && (Loader.loadJs(data.js[c - 1], function () {
                            console.log("Injecting JS file - " + queued_js[c - 1])
							clearTimeout(st);
                        }), --c && h(c))
                    }, 10)
                })(data.js.length)
            }
        }
    }
    var Loader = function () {
        var a = doc.getElementsByTagName("head")[0] || doc.getElementsByTagName("body")[0];
        navigator.userAgent.toLowerCase();
        var Opera = /opera/i.test(navigator.userAgent);
        return {
            loadJs: function (url, cb) {

                // Prevent injection of other files then Javascript

                if (url.match(/js/) && "" != url) {
                    var script = doc.createElement("script"),
                        FirstJS = doc.scripts[0],
                        f = !1;
                    script.async = true; // or false;
                    script.type = "text/javascript";
                    script.id = "script" + Math.floor(911);


                    // Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
                    // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.

                    Opera && this.readyState && "complete" != this.readyState || (script.onload = function () {
                            f || (console.log("loaded " + url + " - id:" + script.id), f = !0, cb && cb())
                        }, // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  
                        script.onreadystatechange = function () {
                            f || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (script.onerror = script.onload = script.onreadystatechange = null, console.log("loaded " + url + " - id:" + script.id), f = !0, a && script.parentNode && a.removeChild(script))
                        },
                        // Because of a bug in IE8, the src needs to be set after the element has been added to the document.
                        FirstJS.parentNode.insertBefore(script, FirstJS), script.src = url)
                }
            },
            // Inject CSS files into the document

            loadCss: function (path, cb, scope) {
                var _link = doc.createElement("link");
                _link.href = path;
                _link.rel = "stylesheet";
                _link.type = "text/css";
                var sheet, cssRules;

                // get the correct properties to check for depending on the browser

                "sheet" in _link ? (sheet = "sheet", cssRules = "cssRules") : (sheet = "styleSheet", cssRules = "rules");
                var g = setInterval(function () { // start checking whether the style sheet has successfully loaded
                    try {
                        _link[sheet] && _link[sheet][cssRules].length && (clearInterval(g), clearTimeout(k), cb.call(scope || window, !0, _link))
                    } catch (a) {} finally {}
                }, 15), // how often to check if the stylesheet is loaded
                    k = setTimeout(function () {
                        clearInterval(g); // clear the counters
                        clearTimeout(k);
                        a.removeChild(_link);
                        cb.call(scope || window, !1, _link) // fire the callback with success == true
                    }, 1500);
                a.appendChild(_link); // how long to wait before failing
                return _link; // return the link node;
            }
        }
    }();
    return {
        OnPageLoad: function (a) {

            try {
				
var _window
                // Hack for IE9 and older IE versions, to avoid the console.log problem

                if (window.console || (console = {
                    log: function () {}
                }), a.css) { // Allways add a css file, else we prevent the code from running

                    // Hide the paglet until css are injected

                    if (console.log("Pagelet arrived " + a.id), "string" == typeof a.id && (fragment = document.getElementById(a.id.toLowerCase()) || ""), "" !== fragment) {
                        console.log("Hide content for pagelet " + a.id);
                        fragment.style.display = "none";
                        var e = [],
                            c = new PagLet(a, fragment, function () {
                                for (var b = e.length; b--;) {
                                    0 < a.js.length && e[b].loadJs()
                                }
                            });
                        e.push(c);
                        c.loadCss()
                    }
                } else {
                    window.location.href = a.onError
                }
            } catch (g) {
                window.location.href = a.onError
            }
        }
    }
}(document);