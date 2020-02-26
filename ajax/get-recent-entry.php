<?php
ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);

header('Access-Control-Allow-Origin: *');


include_once("../config.php");
include_once("../functions.php");

$entries = array();

$query = "SELECT entries.*
					FROM entries
					ORDER BY year DESC, month DESC, day DESC
					LIMIT 1
					";

$result = mysqli_query($connection,$query);

if (false == $result) {
	echo mysqli_error($connection);
}

$data = mysqli_fetch_array($result);
$entries[] = $data;
$entries = $entries[0];
$entries['excerpt'] = excerpt($data['description'], 50);
$entries['monthName'] = monthName($data['month']);

print_r(json_encode($entries));

?>
