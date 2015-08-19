<?php
include_once("../config.php");

// ini_set('display_errors',1);
// error_reporting(E_ALL|E_STRICT);


if (!isset($_GET['year'])) {
	$year = $_POST['year'];
	$month = $_POST['month'];
	$day = $_POST['day'];
}

if ($year && $month && $day) {

	$query = "SELECT entries.*
						FROM entries
						WHERE entries.year = $year AND entries.month = $month AND  entries.day = $day
						";

	$result = mysql_query($query);

	if (false == $result) {
		echo mysql_error();
	}

	$entries = array();

	while( $data = mysql_fetch_array($result) ) {
		$entries[] = $data;
	}

	print_r(json_encode($entries));

} else {
	echo 'Something broke xxx.';
}
?>
