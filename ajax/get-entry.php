<?php
include_once("../config.php");

$id = $_POST['id'];

$query = "SELECT entries.*
					FROM entries
					WHERE entries.id = $id
					";

	$result = mysqli_query($connection,$query);

	if (false == $result) {
		echo mysqli_error($connection);
	}

	$entries = array();

	while( $data = mysqli_fetch_array($result) ) {
		$entries[] = $data;
	}

	// $entries[0]['album'] = getAlbum( $entries[0]['year'], $entries[0]['month'], $entries[0]['day'] );

	print_r(json_encode($entries));


?>
