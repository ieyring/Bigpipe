<?php

/*~ Pagelet.php
.---------------------------------------------------------------------------.
|   File: Pagelet.php class file                                        		|
|   Version: 1.0                                                            |
| ------------------------------------------------------------------------- |
|   Author : Kenny Flashlight (KFlash)					                    |
|   Copyright (c) 2013, Kenny Flashlight. All Rights Reserved.         		|
'---------------------------------------------------------------------------'
*/

class Pagelet {

		private $id;

		private $callback = null;

		public $priority;

		private $arguments = null;

		private $content = '';
	
		private $js_file_size = array();

		/**
		 * List of css files which this pagelet needs
		 * @var array
		 */
		private $css_files = array();
	
		/**
		 * List of javascript files which this pagelet needs
		 * @var array
		 */
		private $javascript_files = array();
	
		/**
		 * Javacsript code (wihtout <script></script> tags) which this pagelet executes
		 * @var string
		 */
		private $javascript_code = '';
	
		/**
		 * Tells if the placeholder is done with a <div /> or a <span /> tag. True if span
		 * @var boolean
		 */
		public $use_span = false;

	
	public function __construct($id, $callback = null, $priority = 10) {

			$this->id = $id;
			$this->callback = $callback;
        	$this->priority = $priority;

			View::add_pagelet($this->id, $this);
	}

	/*
		Add CSS files to the pagelet
	
	*/

	public function add_css($file) {

		$this->css_files[] = $file;
	}

	/*
		Add content to the pagelet
	
	*/
	
	public function add_content($str) {
		$this->content .= $str;
	}

	/*
		Add Javascript files to the pagelet
	
	*/

	public function add_javascript($file) {
			$this->javascript_files[] = $file;
	}
	
	/*
		Render the paglet data and prepare it for output
	
	*/
	
	public function render_data() {

		$data['content'] = $this->content; 
		$data['id'] =  $this->id;
		$data['css'] = $this->css_files;
		$data['js'] = $this->javascript_files;
		$data['onError'] = "https://www.google.com"; // Should be sent to your own error handler page
		return $data;	
	}

    public function __toString()
    {
		if ($this->use_span) {
			return '<span id="' . $this->id . '"></span>';
		} else {			
			return '<div id="' . $this->id . '"></div>';
		}
    }

} //EOF ?>