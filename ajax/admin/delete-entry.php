<?php
include_once("../config.php");

// ini_set('display_errors',1);
// error_reporting(E_ALL|E_STRICT);


$id = $_POST['id'];

if ($id)
{
	$query = "DELETE FROM entries
				 		WHERE id = $id
				 		LIMIT 1";

		$delete = mysql_query($query);

		if (false == $delete)
		{
			echo mysql_error();
		}

		if (false != $delete)
		{
			include('get-entries.php');
		}
}
?>
