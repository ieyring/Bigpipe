/* Bigpipe - version 4.0 Kenny F. 2013 - 2014 */

var BigPipe = {};

BigPipe = function (doc) {

    /**
     * Configure the Pagelet.
     *
     * @param {data} contain all paglet data sent from server.
     * @param {fragment} HTML injected div fragment
     */

    function PagLet(data, fragment, func) {

        var b = $size(data.css) || 0;
        return {
            loadCss: function () {
                if (data.css) { // If no CSS, inject the HTML stright away
                    var loadedcss = []; // Holds all loaded css files, and prevent double injection
                    (function h(c) {
                        var st = setTimeout(function () {
                            var k = data.css[c - 1];

                            // If the stylesheet are loaded allready, we do nothing

                            // Only push the stylesheet into the "loaded" array if the stylesheet have been loaded
                            // If it fail, it will automaticly try to re-load the stylesheet because it's not in the array

                            $inArray(loadedcss, k) || Loader.loadCss(k, function (a) {
								
                            a ? (loadedcss.push(k), $size(loadedcss) == b && (func(), fragment.style.display = "block")) : alert("Error during injection of CSS file: " + k);
                                // After the last stylesheet is loaded, and we have got a positive result feedback, inject paglet data, and make the paglet visible
                            });

                            clearTimeout(st); // clear the timeout to prevent memory leak
                            k = null;
                            --c && h(c);
                        }, 15);
                    })(b);
                    loadedcss = [];
                } else {
                    fragment.style.display = "block";
                } // If no CSS, we only make the pagelet visible and inject the HTML

                fragment.innerHTML = data.content;

                func(); // Load the Javascript files
            },
            loadJs: function () { // Insert Javascript files into the document
                var b = doc.getElementsByTagName("script");
                (function h(c) {
                    var st = setTimeout(function () {
                        clearTimeout(st); // clear the counters	
                        b[c - 1].src != data.js && ($injectJS(data.js[c - 1]), --c && h(c));
                    }, 15);
                })($size(data.js));
            }
        };
    };
    var Loader = function () {
        return {
          
            // Inject CSS files into the document

            loadCss: function (path, cb, scope) {
				
			//	alert(path);
				
                if (path.match(/css/) && "" !== path) {
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
                            _link[sheet] && _link[sheet][cssRules].length && (clearInterval(g), clearTimeout(k), cb.call(scope || _win, !0, _link));
                        } catch (a) {} finally {}
                    }, 10), // how often to check if the stylesheet is loaded
                        k = setTimeout(function () {
                            clearInterval(g); // stop checking it has loaded
                            clearTimeout(k);  // clear the fail timeout (for efficiency)
                            doc.removeChild(_link);
                            cb.call(scope || _win, !1, _link); // fire the callback with success == true
                        }, 1500);

                    var id = setTimeout(function () { // pop out of current stack to prevent browser lock
                        clearTimeout(id);
                        id = null;
                        (doc.getElementsByTagName("head")[0] || doc.getElementsByTagName("body")[0]).appendChild(_link); // insert the link node into the DOM, this will actually start the browser trying to load the style sheet
                    }, 1);



                }
            }
        };
    }();
    return {
        OnPageLoad: function (data) {

            if (!data) return false;

            if ($isString(data.id)) {

                var fragment = $gel('#' + data.id);

                // Id ID don't exist, we have to create it

                fragment || (fragment = doc.createElement("div"), fragment.id = data.id, doc.body.appendChild(fragment));

                // Hide the paglet until css are injected

                $hide(fragment);

                var e = [],
                    pagelet = new PagLet(data, fragment, function () {
                        if (data.js) {
                            for (var b = $size(e); b--;) {
                                e[b].loadJs();
                            }
                        }
                    });
                e.push(pagelet);
                pagelet.loadCss();

            } else {
                (doc.location || _win.location).href = data.onError;
            }
        }
    }
}(document, window);