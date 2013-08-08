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
    
3. Make it to a json array and sent it to the javascript function like this:

 echo '<script id="">Bigpipe.OnPageLoad(' . json_encode($data) . ')</script>';
 
 
 That's it!
 
 It is loading the content in this 3 steps:
 
 1. First loaing all css resources
 2. The html files
 3. JS 
		

