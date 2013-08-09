Bigpipe
=======

Javascript implementation of Facebooks bigpipe. Works right out of the box, but still a lot of work to do.
Server side code as example PHP you have to finish yourself, but to get this to work, all you have to do is:

1. Include Bigpipe.js
2. Make a array like this:

  	$data['content'] = ""
		$data['id'] = ""
		$data['css'] = ""
		$data['js'] = ""
    
3. Make it to a json array and sent it to the javascript function
 
 
 That's it!
 
 It is loading the content in this 3 steps:
 
 1. First loaing all css resources
 2. The html files
 3. JS 


TODO:

1. Fix it so scripts that are needed by the page but do not need to be loaded before executing pagelets can be delayed and be requested when the pagelets’ scripts are.
2. Manage dependencies between scripts
3.  Avoid double insertion. If two pagelets require the same script, it is only necessary to request once.
4. Manage pagelets reources in a unique place. 

 

		

