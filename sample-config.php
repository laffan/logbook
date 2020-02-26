<?php
$host    = 'localhost';
$name    = 'logbook';
$dbname    = 'logbook';
$user    = 'logbook';
$password = 'password';

// Make a MySQL Connection
$connection = mysqli_connect($host, $user, $password, $dbname ) or die(mysqli_error($connection));

$db = @mysqli_select_db($connection,$name) or die(mysqli_error($connection));



?>
