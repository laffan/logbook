<?php

include_once("../config.php");

$year = mysql_real_escape_string($_POST['year']);
$month = mysql_real_escape_string($_POST['month']);
$day = mysql_real_escape_string($_POST['day']);
$country  = mysql_real_escape_string($_POST['country']);
$city = mysql_real_escape_string($_POST['city']);
$description = mysql_real_escape_string($_POST['description']);

$query = "INSERT INTO entries (`year`, `month`, `day`, `country`, `city`, `description`)
          VALUES ('$year', '$month', '$day', '$country', '$city', '$description' )";

$add = mysql_query($query);

if (false === $add)
{

  echo mysql_error();

}
else
{
  include('get-entries.php');
}

?>
