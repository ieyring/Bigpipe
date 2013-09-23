<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	<head>
	<title>BigPipe</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="robots" content="index,follow" />				
    <meta http-equiv="cache-control" content="no-store, no-cache, must-revalidate" />
	<script src="bigpipe.js"></script>
	</head>
	<body>

	<h1> BigPipe example</h1>
    
	<head>

<!-- Include the javascript file -->

	<div id="test"></div>  <!-- Content will show up here -->

<?php

	// Autoload classes
	
	function __autoload($class_name) {
		if (file_exists( $_SERVER['DOCUMENT_ROOT'] . '/' . $class_name . '.php')) :
			require_once  $_SERVER['DOCUMENT_ROOT'] . '/' . $class_name . '.php';
		endif;
	}


   $Pagelet  = "";

   // Define your pagelet like this  
   
   $Pagelet = new Pagelet("test", "", 0);					// HTML to be visible on the screen
   $Pagelet->add_content('Just a simple example HTML test');
   $Pagelet->add_css("test.css");									// Your CSS files for this pagelet
   $Pagelet->add_javascript("test.js");								// Your JS files for this pagelet

	echo View::render();  // This has to be called in the end after all pagelets have been defined. You can define multiple pagelets like I did above. 
						  // But DO NOT call this before all pagelets are defined else only the first pagelet you define will be visible on the screen.

?>
</body></html><!--html end tag from bigpipe renderer-->