/* Bigpipe - version 3.1
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

        var inArray = function (a, c) {
            for (var b = a.length; b--;)
                if (a[b] === c) return !0;
            return !1
        },
            dcl = data.css.length;

        return {
            loadCss: function () {

                var loadedcss = []; // Holds all loaded css files, and prevent double injection

                console.log("Loading CSS for pagelet " + data.id);
                (function Loop(i) {
                    setTimeout(function () {

                        var styleSheet = data.css[i - 1];

                        // If the stylesheet are loaded allready, we do nothing

                        if (!inArray(loadedcss, styleSheet)) {

                            Loader.loadCss(styleSheet, function (success, link) {

                                if (success) {

                                    // Only push the stylesheet into the "loaded" array if the stylesheet have been loaded
                                    // If it fail, it will automaticly try to re-load the stylesheet because it's not in the array

                                    loadedcss.push(styleSheet);

                                    // After the last stylesheet is loaded, and we have got a positive result feedback, inject paglet data
                                    // and make the paglet visible

                                    loadedcss.length == dcl && (console.log("Injected content for pagelet " + data.id), fragment.innerHTML = data.content, fragment.style.display = "block");

                                } else { // Stylesheet couldn't be loaded, so something went terrible wrong...:
                                    console.log("Warning! An error occured during injection of CSS file: " + styleSheet);
                                }
                            });
                        }
                        --i && Loop(i);

                    }, 20);
                })(dcl);

            }
        }
    }
    var queued_js = [], // Holds the queued javascript files until last pagelet is drawn on the screen before injection into the document
        Loader = function () {

            var userAgent = navigator.userAgent.toLowerCase(),
                Opera = /opera/i.test(navigator.userAgent);

            return {

                // Insert Javascript files into the document

                loadJs: function (url, cb) {

                    // Prevent injection of other files then Javascript

                    if (url.match(/js/) && url != "") {

                        var head = d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0],
                            script = d.createElement("script"),
                            firstScript = d.scripts[0],
                            loaded = false;
                        script.async = true; // or false;
                        script.type = "text/javascript";
                        script.id = "script" + Math.floor(Math.random() * 911); // Unique ID for each javascript file on each pagelet

                        // Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
                        // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.

                        Opera && this.readyState && "complete" != this.readyState || (script.onload = function () {
                                loaded || (console.log("loaded " + url + ' - id:' + script.id), loaded = !0, cb && cb())
                            }, // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  
                            script.onreadystatechange = function () {

                                loaded || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (script.onerror = script.onload = script.onreadystatechange = null, console.log("loaded " + url + ' - id:' + script.id), loaded = !0, head && script.parentNode && head.removeChild(script))
                            },
                            // Because of a bug in IE8, the src needs to be set after the element has been added to the document.
                            firstScript.parentNode.insertBefore(script, firstScript), script.src = url);
                    }
                },

                // Inject CSS files into the document

                loadCss: function (path, fn, scope) {
                    var head = d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0], // Just to be sure when it comes to old browsers
                        _link = d.createElement('link'); // create the link node
                    _link.href = path;
                    _link.rel = 'stylesheet';
                    _link.type = 'text/css';

                    var sheet, cssRules;
                    // get the correct properties to check for depending on the browser
                    if ('sheet' in _link) {
                        sheet = 'sheet';
                        cssRules = 'cssRules';
                    } else {
                        sheet = 'styleSheet';
                        cssRules = 'rules';
                    }

                    var interval_id = setInterval(function () { // start checking whether the style sheet has successfully loaded
                        try {
                            if (_link[sheet] && _link[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                                clearInterval(interval_id); // clear the counters
                                clearTimeout(timeout_id);
                                fn.call(scope || window, true, _link); // fire the callback with success == true
                            }
                        } catch (e) {} finally {}
                    }, 15), // how often to check if the stylesheet is loaded
                        timeout_id = setTimeout(function () { // start counting down till fail
                            clearInterval(interval_id); // clear the counters
                            clearTimeout(timeout_id);
                            head.removeChild(_link); // since the style sheet didn't load, remove the link node from the DOM
                            fn.call(scope || window, false, _link); // fire the callback with success == false
                        }, 1500); // how long to wait before failing

                    head.appendChild(_link); // insert the link node into the DOM and start loading the style sheet

                    return _link; // return the link node;
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

                                var ijl = queued_js.length;

                                if (0 < ijl) { // If multiple javascript injection, this value will be set to 1 or higher, if only one single Javascript
                                    // file injected, this value will contain 0, and we will not need to check for double injection
                                    for (var e = ijl; e--;) ijl[e] !== data.js[f] && queued_js.push(data.js[f]);
                                } else {
                                    queued_js.push(data.js[f]);
                                }
                            }
                        }

                        (new PageLet(data, fragment)).loadCss();

                        // Inject JS into the document after all pagelets have been visible on the screen
                        // and the last paglet is completed
                        // Async loading. The Javascript files will be injected one by one

                        data.is_last && (function g(b) {
                            setTimeout(function () {
                                Loader.loadJs(queued_js[b - 1], function () {
                                    console.log("Injecting JS file - " + queued_js[b - 1]);
                                });
                                --b && g(b);
                            }, 10)
                        }(queued_js.length))
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