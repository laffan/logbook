<?php

// remove this line and uncomment until /*Dashboard*/ to turn on PW protection.


/* Set Password */

$password = 'yourPasswordHere';

/* Set Main Photo Page URL */

$main_url = 'http://www.createdtopretend.com/';

/* Check Password */

if (isset($_POST['check_pass'])) {
   if( $_POST['check_pass'] == $password){
			$loggedIn = true;
   } else {
		$loggedIn = false;
   }
}

/*  Dashboard */

 if ($loggedIn) { ?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<title>Logbook - Admin</title>

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,800' rel='stylesheet' type='text/css'>

		<link rel="stylesheet" type="text/css" href="js/vendor/pikaday/css/pikaday.css">
		<link rel="stylesheet" type="text/css" href="css/styles-admin.css">

		<script src="js/vendor/react-0.13.3.min.js"></script>
    <script src="js/vendor/moment.min.js"></script>
    <script src="js/vendor/pikaday/pikaday.js"></script>
    <script src="js/vendor/jquery.min.js"></script>



	</head>
	<body>

		<div id="content"></div>
    <script src="js/logbook-admin.js"></script>

	</body>
</html>

<?php

/* Login Screen */

} else { ?>

<html><head>
	<title>Shoebox - Login</title>
	<style type="text/css">
		html { background:#454545; } form { width:250px; margin: 0 auto; background: #FFF; margin-top: 300px;} input {font-size: 16px; border: none; color: #454545; font-weight: bold; font-family: sans-serif; padding: 20px;} input:focus {outline: none;} input[type="password"] { width: 100px; } input[type="submit"] { width: 80px; background: none;  float: right; margin-right: 10px;} input[type="submit"]:hover {cursor: pointer; color: gray;}
	 </style>
</head>
	<form action="" method="post">
		<input type="password" name="check_pass" maxlength="20" />
		<input type="submit" name="submit" class="submit_btn" value="LOGIN" />
	</form>
</body>
</html>

<?php } ?>
