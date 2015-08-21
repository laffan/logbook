<?php
include_once("../config.php");

// ini_set('display_errors',1);
// error_reporting(E_ALL|E_STRICT);

$id = $_POST['id'];

	$query = "SELECT entries.*
						FROM entries
						WHERE entries.id = $id
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


?>
