<?php
include_once("../config.php");

ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);


$update = $_POST['update'];

$field = $update['field'];
$id = intval($update['id']);

if ($field == 'date')
{

  $value = $update['value'];

  $year = $value['year'];
  $month = $value['month'];
  $day = $value['day'];

  $query = "UPDATE entries
           SET 	year = '$year', month = '$month', day = '$day'
           WHERE id = $id
           LIMIT 1";
}
else
{

  $value = mysql_real_escape_string($update['value']);

  if ($field == 'description') {
    $value =  str_replace('<br><br>', "\n", $value );
  }

  // strip html tags
  $value = strip_tags($value);

  $query = "UPDATE entries
         SET 	$field = '$value'
         WHERE id = $id
         LIMIT 1";

}


$update = mysql_query($query);

if (false == $update)
{
  echo mysql_error();
  return false;
}

if (false != $update)
{
  include('get-entries.php');
}




?>
