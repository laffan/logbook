<?php


function getAlbum($year, $month, $day) {

  if ( $year && $month && $day ){

  $year = intVal($year);
  $month = intVal($month);
  $day = intVal($day);
  $permalink = '';
  $album = '';

  if ($year == 2015 && $month <= 8 ) { // change to
    include_once("config-secondhand.php");
    $permalink = 'http://photos.natelaffan.com/secondhand/index.php?s=';
  } else {
    include_once("config-theclick.php");
    $permalink = 'http://photos.natelaffan.com/theclick/index.php?s=';

  }

// Find ID
    $query = "SELECT entries.*
  			 		 FROM entries
             WHERE entries.year = $year AND entries.month = $month AND entries.day = $day
  					 LIMIT 1
  						 ";

		$result = mysql_query($query);

		if (false === $result) { }
    else
    {

// Return the ID of the correct album
      $data = mysql_fetch_array($result);

      if ( $data['id'] ) {
        return $permalink . $data['id'];
      }
    }
  }
}

?>
