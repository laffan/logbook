<?php
include_once("../config.php");

// functions to get album IDs from
// SecondHand or The Click
include_once("get-album.php");

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

	// $entries[0]['album'] = getAlbum( $entries[0]['year'], $entries[0]['month'], $entries[0]['day'] );

	print_r(json_encode($entries));


?>
