<?php
$host    = 'localhost';
$name    = 'logbook';
$user    = 'logbook';
$password = 'password';

// Make a MySQL Connection
$connection = @mysql_connect($host, $user, $password) or die(mysql_error());
$db = @mysql_select_db($name,$connection) or die(mysql_error());


?>
