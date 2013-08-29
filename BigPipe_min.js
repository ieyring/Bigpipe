/* Bigpipe - version 3.1
   Kenny F. 2013
*/
var BigPipe=function(g){function n(a,e,c){function l(a,b){for(var c=a.length;c--;)if(a[c]===b)return!0;return!1}var b=a.css.length;return{loadCss:function(){var d=[];console.log("Loading CSS for pagelet "+a.id);(function h(c){setTimeout(function(){var k=a.css[c-1];l(d,k)||m.loadCss(k,function(a,c){a?(d.push(k),d.length==b&&(e.style.display="block")):console.log("Warning! An error occured during injection of CSS file: "+k)});--c&&h(c)},20)})(b);console.log("Injected content for pagelet "+a.id);e.innerHTML=
a.content;c()},loadJs:function(){console.log("Loading JS for pagelet "+a.id);var b=g.getElementsByTagName("script");(function h(c){setTimeout(function(){b[c-1].src!=a.js&&(m.loadJs(a.js[c-1],function(){console.log("Injecting JS file - "+queued_js[c-1])}),--c&&h(c))},10)})(a.js.length)}}}var m=function(){var a=g.getElementsByTagName("head")[0]||g.getElementsByTagName("body")[0];navigator.userAgent.toLowerCase();var e=/opera/i.test(navigator.userAgent);return{loadJs:function(c,l){if(c.match(/js/)&&
""!=c){var b=document.createElement("script"),d=document.scripts[0],f=!1;b.async=!0;b.type="text/javascript";b.id="script"+Math.floor(911*Math.random());e&&this.readyState&&"complete"!=this.readyState||(b.onload=function(){f||(console.log("loaded "+c+" - id:"+b.id),f=!0,l&&l())},b.onreadystatechange=function(){f||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(b.onerror=b.onload=b.onreadystatechange=null,console.log("loaded "+c+" - id:"+b.id),f=!0,a&&b.parentNode&&a.removeChild(b))},
d.parentNode.insertBefore(b,d),b.src=c)}},loadCss:function(c,e,b){var d=document.createElement("link");d.href=c;d.rel="stylesheet";d.type="text/css";var f,h;"sheet"in d?(f="sheet",h="cssRules"):(f="styleSheet",h="rules");var g=setInterval(function(){try{d[f]&&d[f][h].length&&(clearInterval(g),clearTimeout(k),e.call(b||window,!0,d))}catch(a){}finally{}},15),k=setTimeout(function(){clearInterval(g);clearTimeout(k);a.removeChild(d);e.call(b||window,!1,d)},1500);a.appendChild(d);return d}}}();return{OnPageLoad:function(a){try{if(window.console||
(console={log:function(){}}),a.css){if(console.log("Pagelet arrived "+a.id),"string"==typeof a.id&&(fragment=document.getElementById(a.id.toLowerCase())||""),""!==fragment){console.log("Hide content for pagelet "+a.id);fragment.style.display="none";var e=[],c=new n(a,fragment,function(){for(var b=e.length;b--;)0<a.js.length&&e[b].loadJs()});e.push(c);c.loadCss()}}else window.location.href=a.onError}catch(g){window.location.href=a.onError}}}}(document);