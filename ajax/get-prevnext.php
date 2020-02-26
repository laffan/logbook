<?php
include_once("../config.php");

$direction = $_POST['direction'];
$currentID = intVal($_POST['id']);
$returnID = null;
$entries = array();

// GET all entries.
$entries = getAllEntryIDs();

// USE $currentID and $entries to find next/prev
$returnID = returnCurrent($currentID, $entries, $direction);

// Return Entry Data with ID
if ( $returnID ) {
  $returnEntry = getEntry($returnID);
  echo json_encode($returnEntry);
}



// Shared Functions
// --------------------------------------------------

/* getEntry
/* Get Entry based on Year/Month/Day OR Id.
*/

function getEntry($id) {
	$query = "SELECT entries.*
						FROM entries
            WHERE entries.id = $id
            LIMIT 1
            ";
	$result = mysqli_query($connection,$query);

	if (false == $result) { echo mysqli_error($connection); }

  return mysqli_fetch_array($result);

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
  $result = mysqli_query($connection,$query);

  if (false == $result) {
  	echo mysqli_error($connection);
  }

  while($data = mysqli_fetch_array($result))
  {
    $entries[] = intval($data['id']);
  }

  return $entries;
}

?>
