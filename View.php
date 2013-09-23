<?php

/*~ View.php
.---------------------------------------------------------------------------.
|   File: View.php class file                                        		|
|   Version: 1.3                                                            |
|   Site: Uknown                                                			|
| ------------------------------------------------------------------------- |
|   Author : Kenny Flashlight (KFlash)					                    |
|   Copyright (c) 2013, Kenny Flashlight. All Rights Reserved.         		|
'---------------------------------------------------------------------------'
*/
class View  {

	private static $pagelets = array(),
				   $pagelet_count = 0,
				   $enabled = null;

	/**
	 * Add pagelets
	 * @param string $id is the div / span tag content will be placed inside
	 * @param string $pagelet is the pagelet user will see. Here: object of the Paglets class
	 */

	public static function add_pagelet($id, Pagelet $pagelet) {
		self::$pagelets[$pagelet->priority][$id] = $pagelet;
		self::$pagelet_count++;
	}

	/**
	 * renders the content and make the data items ready for output
	 */
	
	public static function render() {

	// General flush

	flush();
	
	// This is used to mark lap time when all high priority pagelets have been rendered
	
	$timer_stopped = false;

	// These two are used to count when we are rendering the last pagelet
	
	$i = 0;	
	
	if (!self::$pagelet_count) return;

	// Sort all pagelets according to their priority (highest priority => rendered first)	
	
	ksort(self::$pagelets);

	self::$pagelets = array_reverse(self::$pagelets);

		foreach (self::$pagelets as $priority => $container) :

			foreach ($container as $id => $pagelet) :

				$data = $pagelet->render_data();

				if (++$i >= self::$pagelet_count) $data['is_last'] = true;
				
				// Output the pagelet on screen...:
				
				self::BigPipe($data, $pagelet);

				// Use global Measure item to mark a "lap" when we have rendered all high-priority items
				if ($pagelet->priority < 10 && !$timer_stopped) :
					global $global_meas;
					if ($global_meas) :
						$global_meas->lap('~');
						$timer_stopped = true;
					endif;
				endif;
			endforeach;
		endforeach;

		self::$enabled = false;
		
		
		flush();
	}

	/**
	 * Prints a single pagelet out and flushes it.
	 * @param string $data contains the data that will be rendered on screen
	 * @param string $pagelet is the div / span tag the content will be put inside
	 */
	
	private static function BigPipe($data, $pagelet) {
			static $uniq_counter = 0;
		$uniq_counter++;
        echo '<script id="'.$data['id'].'">BigPipe.OnPageLoad(' . Json::encode($data) . ');</script>';
	flush();
	}

	/**
	 * Get JavaScript source as HTML
	 */

	public static function source($source) {
		return "<script type=\"text/javascript\">\n//<![CDATA[\n" . $source . "\n//]]>\n</script>";
	}
} // EOF ?>