<?php


/* monthName($monthNum)
/*
/* Returns english name of numerical month;
*/

function monthName($monthNum){
	$months = array(" ", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", );

	return $months[$monthNum];
 }


/* excerpt($words)
/*
/* Returns a shortened exceprt of any text string
*/

function excerpt($words, $excerpt_size)
{

	$excerpt = explode(' ', $words, $excerpt_size);

	if (count($excerpt) >= $excerpt_size) {
		array_pop($excerpt);
		$excerpt = implode(" ",$excerpt) . ' ...';
	} else {
		$excerpt = implode(" ",$excerpt);
	}

	$excerpt = preg_replace('`\[[^\]]*\]`','',$excerpt);
	return $excerpt;
}

?>
