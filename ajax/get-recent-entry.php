<?php
header('Access-Control-Allow-Origin: *');

include_once("../config.php");
include_once("../functions.php");

$entries = array();

$query = "SELECT entries.*
					FROM entries
					ORDER BY year DESC, month DESC, day DESC
					LIMIT 1
					";

$result = mysql_query($query);

if (false == $result) {
	echo mysql_error();
}

$data = mysql_fetch_array($result);
$entries[] = $data;
$entries = $entries[0];
$entries['excerpt'] = excerpt($data['description'], 50);
$entries['monthName'] = monthName($data['month']);

print_r(json_encode($entries));

?>
