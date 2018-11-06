<?php

include_once("../config.php");

$entries = [];
$query = 	 "SELECT entries.*
							FROM entries
							ORDER BY entries.year DESC, entries.month DESC, entries.day DESC
			 				";

$result = mysql_query($query);

if (false == $result) {
	echo mysql_error();
}

while($data = mysql_fetch_array($result)) {

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
