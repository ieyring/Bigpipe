var BigPipe=function(f){function l(a,g){function e(){console.log("Injected content for pagelet "+a.id);g.innerHTML=a.content}function d(a,d){a=a||[];for(var c=a.length;c--;)if(a[c]===d)return!1;return!0}var f=0,c=[];return{loadCss:function(){if(a.css&&0!==a.css.length){console.log("Loading CSS for pagelet "+a.id);for(var b=f=a.css.length;b--;)d(c,a.css[b])&&(k.loadCss(a.css[b],g,function(){!--f&&e()}),c.push(a.css[b]))}else e()}}}var h=[],k=function(){function a(){if(!e){var a=navigator.userAgent.toLowerCase();
e=(/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||0>a.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[])[1]}return e}var g=f.getElementsByTagName("head")[0]||f.getElementsByTagName("body")[0],e;return{loadJs:function(d,e){if("string"==typeof d||"css"==d.split(".").pop())d=d||"";if(""!==d){var c=f.createElement("script"),b=!1;c.async=!1;c.type="text/javascript";"opera"==a()&&this.readyState&&
"complete"!=this.readyState||(c.onload=function(){b||(console.log("loaded "+d),b=!0,e&&e())},c.onreadystatechange=function(){b||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(c.onerror=c.onload=c.onreadystatechange=null,console.log("loaded "+d),b=!0,g&&c.parentNode&&g.removeChild(c))},g.appendChild(c),c.src=d)}},loadCss:function(d,e,c){if("string"==typeof d||"css"==d.split(".").pop())d=d||"";if(""!==d){var b=f.createElement("link");b.rel="stylesheet";b.type="text/css";
b.href=d;"msie"==a()?b.onreadystatechange=function(){/loaded|complete/.test(b.readyState)&&c()}:"opera"==a()?b.onload=c:function(){try{b.sheet.cssRule}catch(a){setTimeout(arguments.callee,20);return}c()}();g.appendChild(b);e.style.display="block"}}}}();return{OnPageLoad:function(a){window.console||(console={log:function(){}});if(a.css){if("string"==typeof a.id&&(fragment=f.getElementById(a.id.toLowerCase())||""),""!==fragment){console.log("Hide content for pagelet "+a.id);fragment.style.display="none";
if(0<a.js.length)for(var g=a.js.length;g--;){var e=h.length;if(0<e)for(var d=e;d--;)e[d]!==a.js[g]&&h.push(a.js[g]);else h.push(a.js[g])}(new l(a,fragment)).loadCss();a.is_last&&(f.getElementsByTagName("script"),function c(b){setTimeout(function(){console.log("Injecting JS file - "+a.js[b-1]);k.loadJs(a.js[b-1]);--b&&c(b)},100)}(h.length))}}else console.log("WARNING!! No CSS defined.")}}}(document);DomReady(window,BigPipe);
function DomReady(f,l){var h=!1,k=!0,a=f.document,g=a.documentElement,e=a.addEventListener?"addEventListener":"attachEvent",d=a.addEventListener?"removeEventListener":"detachEvent",m=a.addEventListener?"":"on",c=function(b){if("readystatechange"!=b.type||"complete"==a.readyState)("load"==b.type?f:a)[d](m+b.type,c,!1),!h&&(h=!0)&&l.calPageLet(f,b.type||b)},b=function(){try{g.doScrolPageLet("left")}catch(a){setTimeout(b,50);return}c("poll")};if("complete"==a.readyState)l.calPageLet(f,"lazy");else{if(a.createEventObject&&
g.doScroll){try{k=!f.frameElement}catch(n){}k&&b()}a[e](m+"DOMContentLoaded",c,!1);a[e](m+"readystatechange",c,!1);f[e](m+"load",c,!1)}};