window.BigPipe = (function(doc) {
 	var PageLet = function(p, domInserted) {
        var data = p,
            remainingCss = 0,
            fragment, loadedcss = [],
			prepareDom = function () {
            fragment = doc.getElementById(p.id);
            console.log("Hide content for pagelet " + p.id);
            fragment.style.display = "none";
            loadCss()
        },
		inArray = function (array, filename) {
            for (var i = array.length; i--;) {
                if (array[i] == filename) {
                    return false
                }
            }
            return true
        },
		 loadCss = function () {  // Attaches a CSS resource to this Pagelet
            if (data.css && data.css.length) {
                console.log("Loading CSS for pagelet " + p.id);
                remainingCss = data.css.length;
                for (var i = remainingCss; i--;) {
                    if (inArray(loadedcss, data.css[i])) {
                        Loader.loadCss(data.css[i], fragment, function () {
                            !--remainingCss && insertDom()
                        });
                        loadedcss.push(data.css[i]) // flag css file as 'loaded'
                    }
                }
            } else {
                insertDom()
            }
        },
         insertDom = function () {
            console.log("Inserting content for pagelet " + p.id);
            fragment.innerHTML = p.content;
            domInserted()
        },  // Attaches a JS resource to this Pagelet.
         loadJs = function () {
            if (!data.js) {
                return
            } //load js
            console.log("Loading JS for pagelet " + p.id);
			var scripts = doc.getElementsByTagName("script");
            for (var i = 0; i < data.js.length; i++) {
				// If someone accidently add two of the same JS files to one paglet, we only load one...:
				if(scripts[i].src == data.js) return;	
                Loader.loadJs(data.js[i])
            }
        };
        return {
            prepareDom: prepareDom,
            loadJs: loadJs
        }
    },
	 Loader = function () {
        var head = doc.getElementsByTagName("head")[0],
			removeJavascriptFromDom = function(url) {  // Remove inserted JS script from DOM	
				 if (head && script.parentNode)  head.parentNode.removeChild(url); 
			},
            loadJs = function (url, cb) {   // Inject JS in document...:
                var script = doc.createElement("script");
				script.async = true; // Required for FireFox 3.6 / Opera async loading.
                script.type = "text/javascript";
                var loaded = false,

            	    loadFunction = function () {
                        if (loaded) return; // If allready loaded, nothing to do...:	 
					if (!loaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
							script.onerror = script.onload = script.onreadystatechange = null;
					    console.log("loaded " + url);
                       	loaded = true;
                        cb && cb()
					 }
                   };

                script.onload = loadFunction;
	
		      // Fall-back for older IE versions, they do not support the onload event on the script tag 
	
	            script.onreadystatechange = loadFunction;

			// Because of a bug in IE8, the src needs to be set after the element has been added to the document.

                head.appendChild(script)
                script.src = url;
            },
			cachedBrowser,
        	browser = function () {
            if (!cachedBrowser) {
                var ua = navigator.userAgent.toLowerCase(),
				match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
                cachedBrowser = match[1]
            }
            return cachedBrowser
        };
 var loadCss = function (url, fragment, cb) {
		var _link = doc.createElement("link");
		_link.rel = "stylesheet";
		_link.type = "text/css";
		_link.href = url;
		"msie" == browser() ? _link.onreadystatechange = function () {
			/loaded|complete/.test(_link.readyState) && cb();
			fragment.style.display = "block"
		} : "opera" == browser() ? (_link.onload = cb, fragment.style.display = "block") : function () {
			try {
				_link.sheet.cssRule, fragment.style.display = "block";
			} catch (e) {
				setTimeout(arguments.callee, 20);
				return
			}
			cb();
		}();
		head.appendChild(_link)
	};
        return {
            loadCss: loadCss,
            loadJs: loadJs
        }
    }(), OnPageLoad = function (data) {
        var pagelets = [],
            pagelet = new PageLet(data, function () { // Load the js files for the pagelets..:
                for (var i = 0, len = pagelets.length; i < len; i++) {
                    pagelets[i].loadJs()
                }
            });
        pagelets.push(pagelet); 
        pagelet.prepareDom(); // Hide all pagelets until css stylesheet is loaded.
    };
    return {
        OnPageLoad: OnPageLoad
    }
})(document);
