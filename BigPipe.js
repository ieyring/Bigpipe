/* Bigpipe - version 2.0
   A KFlash production
*/

BigPipe = function(doc) {

	/* Pagelet definition */	

	function PageLet(data, domInserted) {
	
			 // Inject html
	    function insertDom() {
            console.log("Injected content for pagelet " + data.id);
            fragment.innerHTML = data.content;
			// Inject JS
            domInserted()
        }
		 function loadCss () {  // Attaches a CSS resource to this Pagelet
            if (data.css && 0 !== data.css.length) {
                console.log("Loading CSS for pagelet " + data.id);
for (var i = remainingCss = data.css.length; i--;) inArray(loadedcss, data.css[i]) && (Loader.loadCss(data.css[i], fragment, function () {
                    !--remainingCss && insertDom()
                }), loadedcss.push(data.css[i]))
            } else  insertDom()
        }
		function inArray (array, filename) {
            for (var i = array.length; i--;) 
                if (array[i] == filename) return -1;
			return !0;
        }
        var remainingCss = 0,
            fragment, loadedcss = [];

		return {

		  // Attaches a JS resource to this Pagelet.
  			prepareDom: function () {
            fragment = doc.getElementById(data.id);
            console.log("Hide content for pagelet " + data.id);
			fragment.className = "fragment_hidden"; // hack
            loadCss()
        },
	     loadJs: function () {
            if (!data.js) return;
             //load js
            console.log("Loading JS for pagelet " + data.id);
			var scripts = doc.getElementsByTagName("script");
            for (var i = data.js.length, JSValidate = /js$/i; i--;) {
				// If someone accidently add two of the same JS files to one paglet, we only load one...:
				if(scripts[i].src == data.js) return;	
                Loader.loadJs(data.js[i])
            }
        }
    }
  }
	var Loader = function () {

	function browser() {

            if (!cachedBrowser) {
                var ua = navigator.userAgent.toLowerCase(), match = /(chrome)[ \/]([\w.]+)/.exec( ua ) || /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||/(msie) ([\w.]+)/.exec( ua ) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||	[];
               cachedBrowser = match[1]
            }
		
            return cachedBrowser
        }
       var head = doc.getElementsByTagName("head")[0] || doc.getElementsByTagName('body')[0], // Just to be sure when it comes to old browsers
		   cachedBrowser;
	return {		   
            loadJs: function (url, cb) {   // Inject JS in document...:
                var script = doc.createElement("script");
				script.async = !0; // Required for FireFox 3.6 / Opera async loading.
                script.type = "text/javascript";
                var loaded = !1;

    		   
	// Hack for older Opera browsers. Some of them fires load event multiple times, even when the DOM is not ready yet.
      // This have no impact on the newest Opera browsers, because they share the same engine as Chrome.
      
      if("opera" == browser() && this.readyState && this.readyState != 'complete') { // Affected: Opera Opera 9.26, 10.00
        return;
      }			   
          // Real browsers		   
			    script.onload = function () {
					 loaded || (console.log("loaded " + url), loaded = !0, cb && cb())
                };
	
		      // Fall-back for older IE versions ( IE 6 & 7), they do not support the onload event on the script tag  
	
	           script.onreadystatechange = function() {
				
			 loaded || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState 
					|| (script.onerror = script.onload = script.onreadystatechange = null, console.log("loaded " + url), loaded = !0, head && script.parentNode && head.removeChild(script))
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
			fragment.style.display = "block"
		} : "opera" == browser() ? (_link.onload = cb, fragment.style.display = "block") : function () {
			// NOTE! "opera" will only be detected by older browsers. Newer version of Opera use the same engine as Chrome
			try {
				_link.sheet.cssRule, fragment.style.display = "block";
			} catch (e) {
				setTimeout(arguments.callee, 20);
				return
			}
			cb();
		}();
		head.appendChild(_link)
	}
 }
 }();
 return {
 	
	OnPageLoad: function (data) {
		
	// Hack to fix the console problem. Note! It works on IE9 and older versions, but still problems with IE9

	if(!window.console) {
		console={};
		console.log = function(){};
	}

	// Allways add a css file, else the code will not run
    if(! data.css) { console.log("Injection canceled. No CSS defined."); return -1; }		
		
		if (window.removeEventListener) {window.removeEventListener("DOMContentLoaded", BigPipe.OnPageLoad, !1), window.removeEventListener("load", BigPipe.OnPageLoad, !1);
		  } else {
                if ("complete" !=
                    doc.readyState) return;
                doc.detachEvent("onreadystatechange", BigPipe.OnPageLoad);
                window.detachEvent("onload", BigPipe.OnPageLoad)
            }

            KFlash.run(data);

	},

	run: function(data) {

		    var 

		/*	Registered pagelets */

			pagelets = [],

            pagelet = new PageLet(data, function () { // Load the js files for the pagelets..:
               for (var i = pagelets.length; i--;) {
                    pagelets[i].loadJs()
                  }
             });

		console.log("Pagelet arrived " + data.id);			
		
        pagelets.push(pagelet); 
        pagelet.prepareDom(); // Hide all pagelets until css stylesheet is loaded.
         
    }
 }
}(document);

window.addEventListener ? (window.addEventListener("DOMContentLoaded", BigPipe.OnPageLoad, !1), window.addEventListener("load", BigPipe.OnPageLoad, !1)) : (document.attachEvent("onreadystatechange", BigPipe.OnPageLoad), window.attachEvent("onload", BigPipe.OnPageLoad));
