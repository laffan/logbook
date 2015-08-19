<?php
include_once("../config.php");


$direction = $_POST['direction'];
$entry = $_POST['entry'];

$year = intval($entry['year']);
$month =  intval($entry['month']);
$day =  intval($entry['day']);

// $direction = 'prev';
// $entry = $_POST['entry'];
//
// $year = 2015;
// $month =  9;
// $day =  3;

$currentID = null;
$returnID = null;
$entries = array();

// GET current entry.
// --------------------------------------------------

$currentEntry = getEntry($year, $month, $day, null);
$currentID = $currentEntry['id'];

// GET all entries.
// --------------------------------------------------

$entries = getAllEntryIDs();

// USE $currentID and $entries to find next/prev
// --------------------------------------------------

$returnID = returnCurrent($currentID, $entries, $direction);

// Return Entry Data with ID
// --------------------------------------------------

if ( $returnID ) {
  $returnEntry = getEntry(null, null, null, $returnID);
  echo json_encode($returnEntry);
}



// Shared Functions
// --------------------------------------------------

/* getEntry
/* Get Entry based on Year/Month/Day OR Id.
*/

function getEntry($year, $month, $day, $id) {

  $search = '';

  if ($year && $month && $day)
  {
    $search = "WHERE entries.year = $year AND entries.month = $month AND  entries.day = $day";
  }
  if ($id)
  {
    $search = "WHERE entries.id = $id";
  }

	$query = "SELECT entries.*
						FROM entries
            $search
            LIMIT 1 ";
	$result = mysql_query($query);

	if (false == $result) { echo mysql_error(); }

  return mysql_fetch_array($result);

}

/* returnCurrent
/* Spits out either the next or previous entry's ID number
*/
function returnCurrent($currentID, $entries, $direction)
{

  $currentID = intval($currentID);

  $keyFound = array_search($currentID, $entries);
  $returnID = '';

    if ($direction == 'prev') {
      return $entries[$keyFound + 1];
    }
    if ($direction == 'next') {
      return $entries[$keyFound - 1];
    }
}

/* getAllEntryIDs
/* Spits out an array of All entry IDs
*/

function getAllEntryIDs(){

  $entries = array();

  $query = 	 "SELECT entries.id
  						FROM entries
  						ORDER BY entries.year DESC, entries.month DESC, entries.day DESC
              ";
  $result = mysql_query($query);

  if (false == $result) {
  	echo mysql_error();
  }

  while($data = mysql_fetch_array($result))
  {
    $entries[] = intval($data['id']);
  }

  return $entries;
}

?>
