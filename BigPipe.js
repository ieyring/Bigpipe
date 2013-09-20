/* Bigpipe - version 3.8
Kenny F. 2013
*/
var BigPipe = function (doc) {

    /**
     * Configure the Pagelet.
     *
     * @param {data} contain all paglet data sent from server.
     * @param {fragment} HTML injected div fragment
     */

    function PagLet(data, fragment, func) {
		
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
			if(data.css) { // If no CSS, inject the HTML stright away
                var loadedcss = []; // Holds all loaded css files, and prevent double injection
                (function h(c) {
                    var st = setTimeout(function () {
                        var k = data.css[c - 1];

                        // If the stylesheet are loaded allready, we do nothing

                        // Only push the stylesheet into the "loaded" array if the stylesheet have been loaded
                        // If it fail, it will automaticly try to re-load the stylesheet because it's not in the array

                        inArray(loadedcss, k) || Loader.loadCss(k, function (a, c) {
                            a ? (loadedcss.push(k), loadedcss.length == b && (fragment.style.display = "block")) : alert("Error during injection of CSS file: " + k)
                            // After the last stylesheet is loaded, and we have got a positive result feedback, inject paglet data, and make the paglet visible
                        });

                        clearTimeout(st); // clear the timeout to prevent memory leak
                        k = null;
                        --c && h(c)
                    }, 15)
                })(b);
				loadedcss = [];
				} else { fragment.style.display = "block"; } // If no CSS, we only make the pagelet visible and inject the HTML

                fragment.innerHTML = data.content;
                
                func(); // Load the Javascript files
            },
            loadJs: function () { // Insert Javascript files into the document
                var b = doc.getElementsByTagName("script");
                (function h(c) {
                    var st = setTimeout(function () {
                        clearTimeout(st); // clear the counters	
                        b[c - 1].src != data.js && (Loader.loadJs(data.js[c - 1]), --c && h(c))
                    }, 15)
                })(data.js.length);
            }
        };
    };
    var Loader = function () {
        return {
            loadJs: function (url, cb) {

                // Prevent injection of other files then Javascript

                if (url.match(/js/) && "" != url) {
                    var script = doc.createElement("script"),
                        FirstJS = doc.scripts[0],
                        loaded = !1,
						_this = this,
						trs  = _this.readyState;
                    script.async = true; // or false;
                    script.type = "text/javascript";
                    script.id = "script" + ~~911;


                    // Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
                    // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.

                    /opera/i.test(navigator.userAgent) && trs && "complete" != trs || (script.onload = function () {
                            loaded || (loaded = !0, cb && cb());
                        }, // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  
                        script.onreadystatechange = function () {
                            loaded || trs && "loaded" !== trs && "complete" !== trs || (script.onerror = script.onload = script.onreadystatechange = null, loaded = !0, a && script.parentNode && a.removeChild(script))
                        },
                        // Because of a bug in IE8, the src needs to be set after the element has been added to the document.
                        FirstJS.parentNode.insertBefore(script, FirstJS), script.src = url)
                }
            },
            // Inject CSS files into the document

            loadCss: function (path, cb, scope) {
                if (path.match(/css/) && "" != path) {
                    var _link = doc.createElement("link"),
	                    sheet, cssRules,
    	                _win = window;
                    _link.href = path;
                    _link.rel = "stylesheet";
                    _link.type = "text/css";


                    // get the correct properties to check for depending on the browser

                    "sheet" in _link ? (sheet = "sheet", cssRules = "cssRules") : (sheet = "styleSheet", cssRules = "rules");
                    var g = setInterval(function () { // start checking whether the style sheet has successfully loaded
                        try {
                            _link[sheet] && _link[sheet][cssRules].length && (clearInterval(g), clearTimeout(k), cb.call(scope || _win, !0, _link))
                        } catch (a) {} finally {}
                    }, 10), // how often to check if the stylesheet is loaded
                        k = setTimeout(function () {
                            clearInterval(g); // clear the counters
                            clearTimeout(k);
                            a.removeChild(_link);
                            cb.call(scope || _win, !1, _link) // fire the callback with success == true
                        }, 1500);
                    (doc.getElementsByTagName("head")[0] || doc.getElementsByTagName("body")[0]).appendChild(_link); // how long to wait before failing

                }
            }
        }
    }();
    return {
        OnPageLoad: function (data) {

	if (!data) return; 
	 
	if ("string" == typeof data.id ) {

		 var fragment = doc.getElementById(data.id);
		
	   // Id ID don't exist, we have to create it
          
	   fragment || (fragment = doc.createElement("div"), fragment.id = data.id, doc.body.appendChild(fragment));

      // Hide the paglet until css are injected

            fragment.style.display = "none";
                var e = [],
                    pagelet = new PagLet(data, fragment, function () {
                        if (data.js) {
                            for (var b = e.length; b--;) {
                                e[b].loadJs();
                            }
                        }
                    });
                e.push(pagelet);
                pagelet.loadCss();

            } else {
                (doc.location || window.location).href = data.onError;
            }
        }
    }
}(document);