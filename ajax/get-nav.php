<?php
include_once("../config.php");

ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);

$entryArray = array();

// QUERY YEARS ++++++++++++++++++ //

function returnYears() {

	$returnArray = array();

	$query = "SELECT entries.year
						FROM entries
						GROUP BY year
						ORDER BY year";

	$result = mysql_query($query);

	if (false == $result)
	{
		echo mysql_error();
	}

	while( $data = mysql_fetch_array($result) )
	{
		$returnArray[] = intval($data['year']);
	}

	return $returnArray;
}

// QUERY MONTHS ++++++++++++++++++ //

function returnMonths($year) {

	$returnArray = array();
	$monthNames = array('d', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

	$query = "SELECT entries.month
						FROM entries
						WHERE entries.year = $year
						GROUP BY month
						ORDER BY month";

	$result = mysql_query($query);

	if (false == $result)
	{
		echo mysql_error();
	}

	while( $data = mysql_fetch_array($result) )
	{
		$month = intval($data['month']);

		$returnArray[] = array(
			'month' => $month,
			'month_name' => $monthNames[$month],
			'locations' => returnLocations($month, $year)
		);
	}
	return $returnArray;
}


// QUERY LOCATIONS ++++++++++++++++++ //

function returnLocations($month, $year) {

	$returnArray = array();

	$query = "SELECT entries.city, entries.country, entries.day
						FROM entries
						WHERE entries.month = $month AND entries.year = $year
						GROUP BY city
						ORDER BY day";

	$result = mysql_query($query);

	if (false == $result)
	{
		echo mysql_error();
	}

	while( $data = mysql_fetch_array($result) )
	{
		$returnArray[] = array(
			'city'	=> $data['city'],
			'location' => $data['city'] . ', ' . $data['country'],
			'days' => returnDays($month, $year, $data['city'])
		);
	}
	return $returnArray;
}

// QUERY DAYS ++++++++++++++++++ //

function returnDays($month, $year, $city) {

	$returnArray = array();

	$query = "SELECT entries.day, entries.id
						FROM entries
						WHERE entries.month = $month AND entries.year = $year AND entries.city = '$city'
						ORDER BY day";

	$result = mysql_query($query);

	if (false == $result)
	{
		echo mysql_error();
	}

	while( $data = mysql_fetch_array($result) )
	{
		$returnArray[] = array(
			'id'	=> intval($data['id']),
			'day'	=> intval($data['day'])
		);
	}
	return $returnArray;
}


/* ++++++++++ RETURN THE FINAL OBJECT ++++++++++++ */

$years = returnYears();

foreach ($years as $year) {
	$entryArray[] = array(
		'year' => $year,
		'months' => returnMonths($year)
	);
};






// print_r(json_encode($entries));
print_r(json_encode($entryArray));

?>
