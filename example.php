
<h1> BigPipe example</h1>

<!-- Include the javascript file -->

<script src="bigpipe.js"></script>

<?php

	// Define your pagelet like this
	
	$data['content'] = 'Just a simple example HTML test';			// HTML to be visible on the screen
	$data['id'] = 'ID';												// ID where HTML to be injected
	$data['css'] = array();											// Your CSS files forthis pagelet
	$data['js'] = array();											// Your JS files for this pagelet

	// Output the data to the screen....:
	
	echo '<script id="ID">BigPipe.OnPageLoad(' . json_encode($data) . ');</script>';

?>