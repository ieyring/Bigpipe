window.BigPipe = (function(doc)
{
	 var 
	 	  Loader = function () {

     var d = document,
         head = d.getElementsByTagName("head")[0],

		 // Inject JS in document...:

		 loadJs = function (url, cb) {
         
		 var script = d.createElement('script');
    	     script.setAttribute('src', url);
	         script.setAttribute('type', 'text/javascript');

         var loaded = false,
		 	 loadFunction = function () {

             if (loaded) { // If allready loaded, nothing to do...:	 
					
			// Handle memory leak in IE

			script.onload = script.onreadystatechange = null;

			return; 
				 
			}
             console.log("loaded " + url);
             loaded = true;
             cb && cb();
         };
		 
		 
         script.onload = loadFunction;
         script.onreadystatechange = loadFunction;
         head.appendChild(script);
     };

     var cachedBrowser;

     var browser = function () {
         if (!cachedBrowser) {
             var ua = navigator.userAgent.toLowerCase();
             var match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				!/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) ||
				[];
             cachedBrowser = match[1];
         }
         return cachedBrowser;
     };

     var loadCss = function (url, fragment, cb) {
         var ref = d.createElement("link");
			ref.setAttribute('rel', 'stylesheet');
			ref.setAttribute('type', 'text/css');
			ref.setAttribute('href', url);

         if (browser() == "msie")
             ref.onreadystatechange = function () {
				 
				 fragment.style.display = "block";
				 
                 /loaded|complete/.test(link.readyState) && cb();
             }
         else if (browser() == "opera") {

             ref.onload = cb;
			 				 fragment.style.display = "block";
	 }
         else {
         //FF, Safari, Chrome
             (function () {
                 try {
                     ref.sheet.cssRule;
					 				 fragment.style.display = "block";
                 } catch (e) {
                     setTimeout(arguments.callee, 20);
                     return;
                 };
                 cb();
             })();
	}
         head.appendChild(ref);
     };

     return { loadCss: loadCss, loadJs: loadJs };

 } ();
	
	 function PageLet(p, domInserted) {
	 var data = p,
		remainingCss = 0,
		fragment,
		loadedcss = [],
		prepareDom = function() {
			fragment = document.getElementById(p.id);
            console.log("Hide content for pagelet " + p.id);
			fragment.style.display = "none";
			loadCss();
		},

		inArray = function(array, filename) {
    
		    for(var i = array.length;i--;) {
		      if(array[i] == filename) return false;
		    }
	  
	    return true;  
	   }


		 var loadCss = function () {
		   // Attaches a CSS resource to this Pagelet
         if (data.css && data.css.length) {
             console.log("Loading CSS for pagelet " + p.id);
             remainingCss = data.css.length;
             for (var i = remainingCss; i--; )
			 
			 if(inArray(loadedcss, data.css[i])){
                 Loader.loadCss(data.css[i], fragment, function () {
                     ! --remainingCss && insertDom();
                 });
		      loadedcss.push(data.css[i]); // flag css file as 'loaded'
		    }
			 
         }
         else
             insertDom();
		 };
		 
		    var insertDom = function () {
         console.log("Inserting content for pagelet " + p.id);
         doc.getElementById(p.id).innerHTML = p.content;
         domInserted();
     }

		 // Attaches a JS resource to this Pagelet.
		  var loadJs = function () {
			  
			  
			 if (!data.js) return;
         //load js
         console.log("Loading JS for pagelet " + p.id);
         for (var i = 0; i < data.js.length; i++)
             Loader.loadJs(data.js[i]); 
			 
			};
		  

		  return { prepareDom : prepareDom, loadJs: loadJs };
	 }

		var OnPageLoad = function(data) {
			
		    var pagelets = [], 		/* registered pagelets */
				pagelet = new PageLet(data, function () {

				// Load the js files for the pagelets..:

                 for (var i = 0, len = pagelets.length; i < len; i++)
                    pagelets[i].loadJs();
	       });
        
		 pagelets.push(pagelet);
		 pagelet.prepareDom(); // Hide all pagelets until css stylesheet is loaded.
		}
	
    return {       OnPageLoad: OnPageLoad      }

})(document);
