<?php
include_once("../config.php");

// ini_set('display_errors', 1);
// error_reporting(E_ALL | E_STRICT);

$entryArray = array();

// QUERY YEARS ++++++++++++++++++ //

function returnYears($connection)
{

  $returnArray = array();

  $query = "SELECT entries.year
						FROM entries
						GROUP BY year
						ORDER BY year";

  $result = mysqli_query($connection, $query);

  if (false == $result) {
    echo mysqli_error($connection);
  }

  while ($data = mysqli_fetch_array($result)) {
    $returnArray[] = intval($data['year']);
  }

  return $returnArray;
}

// QUERY MONTHS ++++++++++++++++++ //

function returnMonths($year, $connection)
{

  $returnArray = array();
  $monthNames = array('d', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

  $query = "SELECT entries.month
						FROM entries
						WHERE entries.year = $year
						GROUP BY month
						ORDER BY month";

  $result = mysqli_query($connection, $query);

  if (false == $result) {
    echo mysqli_error($connection);
  }

  while ($data = mysqli_fetch_array($result)) {
    $month = intval($data['month']);

    $returnArray[] = array(
      'month' => $month,
      'month_name' => $monthNames[$month],
      'locations' => returnLocations($month, $year, $connection)
    );
  }
  return $returnArray;
}


// QUERY LOCATIONS ++++++++++++++++++ //

function returnLocations($month, $year, $connection)
{

  $returnArray = array();

  $query = "SELECT entries.city, entries.country, entries.day
						FROM entries
						WHERE entries.month = $month AND entries.year = $year
						GROUP BY city
						ORDER BY day";

  $result = mysqli_query($connection, $query);

  if (false == $result) {
    echo mysqli_error($connection);
  }

  if ($result) {

    while ($data = mysqli_fetch_array($result)) {
      $returnArray[] = array(
        'city'  => $data['city'],
        'location' => $data['city'] . ', ' . $data['country'],
        'days' => returnDays($month, $year, $data['city'], $connection)
      );
    }
  }
  return $returnArray;
}

// QUERY DAYS ++++++++++++++++++ //

function returnDays($month, $year, $city, $connection)
{

  $returnArray = array();

  $query = "SELECT entries.day, entries.id
						FROM entries
						WHERE entries.month = $month AND entries.year = $year AND entries.city = '$city'
						ORDER BY day";

  $result = mysqli_query($connection, $query);

  if (false == $result) {
    echo mysqli_error($connection);
  }
  if ($result) {

    while ($data = mysqli_fetch_array($result)) {
      $returnArray[] = array(
        'id'  => intval($data['id']),
        'day'  => intval($data['day'])
      );
    }
  }
  return $returnArray;
}


/* ++++++++++ RETURN THE FINAL OBJECT ++++++++++++ */

$years = returnYears($connection);

foreach ($years as $year) {
  $entryArray[] = array(
    'year' => $year,
    'months' => returnMonths($year, $connection)
  );
};






// print_r(json_encode($entries));
print_r(json_encode($entryArray));
