<?
//Access Controls
header('Access-Control-Allow-Origin: https://help.nd.edu');

//Variable Declaration
$jsonString = file_get_contents('admin/hours.json');
$data = json_decode($jsonString,true);
$students = $data["students"];
$adhoc = $data["status"];
$currenttime = date('w:n:j:Y:G:i:s');
$status;
list($day,$month,$date,$year,$hrs,$mins,$secs) = split(':',$currenttime);

//Easter Calculation
$c = intval($year/100);
$g = ($year%19);
$h = (($c - intval($c / 4)-intval((8 * $c + 13)/25)+(19*$g)+15)%30);
$i = ($h - intval($h/28)*(1-intval(29/($h+1))*intval((21-$g)/11)));
$j = (($year + intval($year/4)+$i+2-$c+intval($c/4))%7);
$l = $i - $j;
$eastermonth = (3+intval(($l + 40)/44));
$easterday = ($l + 28 - 31 *intval($eastermonth/4));

//Good Friday Calculation
$gfday = $easterday - 2;
if ($easterday - 2 < 0){
	$gfmonth = $eastermonth - 1;
	$gfday = 32-$gfday;
} else {
	$gfmonth = $eastermonth;
}

//Determine Help Desk Status
if ($adhoc == 'open') {
	$status = "aopen";
} else if ($adhoc == 'close'){
	$status = "aclose";
} else if ($month == 1 && ($date == 1 || ($date == 2 && ($day == 1 || $day == 5)))) {
	$status = "close";
} else if ($month == $gfmonth && $date == $gfday){
	$status = "close";
} else if ($month == 5 && $day == 1 && $date >= 25 && $date <= 31) {
	$status = "close";
} else if ($month == 7 && (($date == 3 && $day == 5)||($date == 5 && $day == 1)||($date == 4))) {
	$status = "close";
} else if ($month == 11 && (($day == 4 && $date >= 22 &&  $date <= 28)||($day == 5 && $date >= 23 && $date <=29))) {
	$status = "close";
} else if ($month == 12 && (($date == 22 && $day == 5)||($date == 23 && ($day == 5 || $day == 1))||($date >= 24))) {
	$status = "close";
} else if ($students == 'true' && ((($day == 1 || $day == 2 || $day == 4) && ($hrs > 7 && $hrs < 20)) || ($day == 3 && ($hrs > 7 && $hrs < 20) && $hrs != 12 && (($hrs == 13 && $mins > 29) || ($hrs != 13))) || ($day == 5 && ($hrs > 7 && $hrs < 17)) || ($day == 0 && ($hrs > 14 && $hrs < 20)))){
	$status = "open";		
} else if ($students == 'false' && ((($day == 1 || $day == 2 || $day == 4 || $day == 5) && ($hrs > 7 && $hrs < 17)) || ($day == 3 && (($hrs > 7 && $hrs < 17) && $hrs != 12 && (($hrs == 13 && $mins > 29) || $hrs != 13))))){
	$status = "open";		
} else {
	$status = "close";
}

//Return Results
echo "{\"status\":\"" . $status . "\",\"students\":\"" . $students . "\",\"hour\":\"" . $hrs . "\",\"mins\":\"" . $mins . "\",\"secs\":\"" . $secs . "\",\"day\":\"" . $day . "\"}";
?>