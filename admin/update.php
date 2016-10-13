<?	
//Access Controls
	header('Access-Control-Allow-Origin: https://www3.nd.edu');

//Get Status Updates	
	$status = urldecode($_GET["x"]);
	$students = urldecode($_GET["y"]);
	$date = urldecode($_GET["d"]);
	
//Get Current Status Settings	
	$jsonString = file_get_contents('hours.json');
	$data = json_decode($jsonString,true);
	$data["students"] = $students;
	$data["status"] = $status;
	$data["date"] = $date;
	
	$newJsonString = json_encode($data);
	if ($jsonString != $newJsonString){
		file_put_contents('hours.json','                                                       ',LOCK_EX);
		file_put_contents('hours.json', $newJsonString,LOCK_EX);
	}
	echo "The OIT Help Desk status information has been updated.";

?>