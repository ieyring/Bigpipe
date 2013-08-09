window.BigPipe = (function(doc)
{
	// Main loader function	
	 var Loader = function () {
     var d = document,
         head = d.getElementsByTagName("head")[0];

     var loadJs = function (url, cb) {
         var script = d.createElement('script');
         script.setAttribute('src', url);
         script.setAttribute('type', 'text/javascript');

         var loaded = false;
         var loadFunction = function () {
             if (loaded) return;
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

      var loadCss = function (url, cb) {
         var ref = d.createElement("link");
			ref.setAttribute('rel', 'stylesheet');
			ref.setAttribute('type', 'text/css');
			ref.setAttribute('href', url);

         if (browser() == "msie")
             ref.onreadystatechange = function () {
                 /loaded|complete/.test(link.readyState) && cb();
             }
         else if (browser() == "opera")
             ref.onload = cb;
         else
         //FF, Safari, Chrome
             (function () {
                 try {
                     ref.sheet.cssRule;
                 } catch (e) {
                     setTimeout(arguments.callee, 20);
                     return;
                 };
                 cb();
             })();

         head.appendChild(ref);
     };

     return { loadCss: loadCss, loadJs: loadJs };

 } ();
	
	 function PageLet(p, domInserted) {
	 var data = p,
		remainingCss = 0;

	  // Attaches a CSS resource to this Pagelet
		 var loadCss = function () {
		   //load css
         if (data.css && data.css.length) {
             console.log("Loading CSS for pagelet " + p.id);
             remainingCss = data.css.length;
             for (var i = remainingCss; i--; )
                 Loader.loadCss(data.css[i], function () {
                     ! --remainingCss && insertDom();
                 });
         }
         else
             insertDom();
		 };
		 
		    var insertDom = function () {
         console.log("Inserting content for pagelet " + p.id);
         document.getElementById(p.id).innerHTML = p.content;
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
		  

		  return { loadCss: loadCss, loadJs: loadJs };
	 }


		var OnPageLoad = function(data) {
			
		    var d = document,
	        pagelets = []; 		/* registered pagelets */

			if (data.is_last != undefined && data.is_last) {
				console.log("This pagelet was last:", data.id);
			}

		 var pagelet = new PageLet(data, function () {

				// Load the js files for the pagelets..:

                 for (var i = 0, len = pagelets.length; i < len; i++)
                    pagelets[i].loadJs();

	       });
         pagelets.push(pagelet);
         pagelet.loadCss();
		}
	
    return {       OnPageLoad: OnPageLoad      }

})(document);
