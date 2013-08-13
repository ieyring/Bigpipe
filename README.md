Bigpipe v.1.5
==============

Working on a better version with a improved performance.

I tried to keep it as simple and small as possible, and I attached a example.php so you better
can understand how to use it.

Be aware that not all browsers have a console such as Firebug, so you may have to uncomment this lines.

Bigpipe v. 2.0 is under development - see the other branch. Cross-browswer DOM functionality added there


TODO:

1. Fix it so scripts that are needed by the page but do not need to be loaded before executing pagelets can be delayed and be requested when the pagelets’ scripts are.
2. Manage dependencies between scripts
3.  Avoid double insertion. If two pagelets require the same script, it is only necessary to request once.
4. Manage pagelets reources in a unique place. 

 
