
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">


<h1> BigPipe example</h1>

<!-- Include the javascript file -->

<script src="bigpipe.js"></script>

<div id="test"></div>  <!-- Content will show up here -->

<?php

	// Define your pagelet like this
	
	$data['content'] = 'Just a simple example HTML test';			// HTML to be visible on the screen
	$data['id'] = 'test';											// ID where HTML to be injected
	$data['css'] = array();											// Your CSS files forthis pagelet
	$data['js'] = array();											// Your JS files for this pagelet
	$data['onError'] = "https://www.google.com";						// Error handler. The script will navigate to the website or page you define here
																	// if something goes wrong
	$data['is_last'] = false;										// Set automaticly to TRUE if this is the last paglet 
	// Output the data to the screen....:
	
	echo '<script id="test">BigPipe.OnPageLoad(' . json_encode($data) . ');</script>';

?>
