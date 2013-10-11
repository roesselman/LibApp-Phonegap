<?php
	
	//define this is a json document
	header('Content-type: application/json');
	
	// Include database connection
	include 'connect_to_mysql.php';
	
	// Define array for users
	$compositions = array();
	
	//select data from database
	$current_query = mysql_query("SELECT compID, compName FROM tblCompositions", $myConnection) or die (mysql_error($myConnection));
	
	// Define var for array index
	$arrayindex = 0;
	
	// Fetch results
	while($current_row = mysql_fetch_array($current_query))
	{
		$compositions[$arrayindex]['identifier'] = $current_row['compID'];
		$compositions[$arrayindex]['name'] = $current_row['compName'];
		
		$arrayindex++;
	}
	
	// Send compositions to app
	echo $_GET['jsoncallback'] . '(' . json_encode($compositions) . ');';

?>