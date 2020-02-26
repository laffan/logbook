<?php

include_once("../config.php");

ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);


$entries = [];
$query = 	 "SELECT entries.*
							FROM entries
							ORDER BY entries.year DESC, entries.month DESC, entries.day DESC
			 				";

$result = mysqli_query($connection,$query);

if (false == $result) {
	echo mysqli_error($connection);
}

while($data = mysqli_fetch_array($result)) {

  $entries[] = array(
    'id'  =>  $data['id'],
    'year'  =>  $data['year'],
    'month'  =>  $data['month'],
    'day'  =>  $data['day'],
    'city'  =>  $data['city'],
    'country'  =>  $data['country'],
    'description'  =>  str_replace("\r\n", "<br><br>", $data['description'] )
  );

}

print_r(json_encode($entries));

?>
