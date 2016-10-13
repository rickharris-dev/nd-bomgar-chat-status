function status(accessType) {
// ------------------------ Set Variables ------------------------

	var students = 'false'; // true =  student workers || false = no student workers
	var adhoc = 'normal'; // open = temp open || close = temp close || normal = normal business hours

// ------------------------ Set Variables ------------------------

//Set Today In UTC
	var today = new Date();
	var month = today.getUTCMonth();
	var day = today.getUTCDay();
	var date = today.getUTCDate();
	var year = today.getUTCFullYear();
	var hour = today.getUTCHours();
	var mins = today.getUTCMinutes();
	var sec = today.getUTCSeconds();
	today = new Date(year,month,date,hour,mins,sec);

//Time Difference Variables
	var timeDiff
	var dstBeg = new Date();
	var dstEnd = new Date();
	dstBeg.setFullYear(year,2,1);
	dstEnd.setFullYear(year,10,1);
	dstBDay = dstBeg.getDay();
	dstEDay = dstEnd.getDay();

//Determine Time Difference
	getTimeDiff(year, today, hour);

//Status Variables
	var noShow = 'none';
	var show = 'block';
	var timeCheck = new Date();
    var day = timeCheck.getUTCDay();
	var utcHour = timeCheck.getUTCHours();
	var mins = timeCheck.getUTCMinutes();
	var hour = utcHour - window.timeDiff;
	var secs = timeCheck.getUTCSeconds();

// ------------------------ Test Variables ------------------------
	//testToday = new Date(year,month,date,hour,mins,sec);
	//day = testToday.getDay();

// ------------------------ Test Variables ------------------------
	var minsLeft = 59 - mins;
	var secsLeft = 59 - secs;
	var c = (minsLeft * 60) + secsLeft;

//Determine Help Desk Status
	var status  = openClose(students, adhoc, day, month, date, year, hour, mins);

//Interface Function
	if (accessType == 'mobile' && (status == "open" || status == "aopen")) {
		return true;
	} else if (accessType == 'mobile' && (status == "close" || status == "aclose")) {
		return false;
	} else if (accessType == 'web' && (status == "open" || status == "aopen")) {
		chgLabel()
		document.getElementById('issueSubmissionBox').style.display = show;
		document.getElementById('issueSubmissionBox-alt').style.display = noShow;
		if (status == "open" && students=="true" && minsLeft < 6 && (((day==0 || day==1 || day==2 || day==4) && hour==19) || (day==5 && hour==16) || (day == 3 && (hour==19 || hour==11)))) {
			closing(minsLeft, c);
		} else if (status == "open" && students=="false" && minsLeft < 6 && (((day==1 || day==2 || day==4 || day==5) && hour==16) || (day == 3 && (hour==16 || hour==11)))) {
			closing(minsLeft, c);
		}
	} else if (accessType == 'web' && (status == "aclose" || status == "close")) {
		document.getElementById('issueSubmissionBox').style.display = noShow;
		document.getElementById('issueSubmissionBox-alt').style.display = show;
	} else {
		alert("ERROR: Access type is missing in function call");
	}
}

//Determine Time Difference Between UTC and EST
function getTimeDiff(year, today, hour) {
	switch (dstBDay) {
		case 0:
			dstStart = "8";
			break;
		case 1:
			dstStart = "14";
			break;
		case 2:
			dstStart = "13";
			break;
		case 3:
			dstStart = "12";
			break;
		case 4:
			dstStart = "11";
			break;
		case 5:
			dstStart = "10";
			break;
		case 6:
			dstStart = "9";
			break;
	}
	switch (dstEDay) {
		case 0:
			dstStop = "1";
			break;
		case 1:
			dstStop = "7";
			break;
		case 2:
			dstStop = "6";
			break;
		case 3:
			dstStop = "5";
			break;
		case 4:
			dstStop = "4";
			break;
		case 5:
			dstStop = "3";
			break;
		case 6:
			dstStop = "2";
			break;
	}
	dstBeg = new Date(year,2,dstStart,12,00,01);
	dstEnd = new Date(year,10,dstStop,11,59,59);
	if (today >= dstBeg && today < dstEnd){
		window.timeDiff = 4;
	} else {
		window.timeDiff = 5;
	}
	hour = hour - window.timeDiff;

}

function hoursCheck(students, adhoc, day, month, date, year, hour, mins){
	if (students == 'true') {
		if (adhoc == 'open') {
			//open
			return "aopen";
		} else if (adhoc == 'close') {
			//closed
			return "aclose";
		} else if(((day == 1 || day == 2 || day == 4) && (hour > 7 && hour < 20)) || (day == 3 && (hour > 7 && hour < 20) && hour != 12 && ((hour == 13 && mins > 29) || (hour != 13))) || (day == 5 && (hour > 7 && hour < 17)) || (day == 0 && (hour > 14 && hour < 20))){
			//open
			return "open";
		} else {
			//closed
			return "close";
		}
	} else if (students == 'false') {
		if (adhoc == 'open') {
			//open
			return "aopen";
		} else if (adhoc == 'close') {
			//closed
			return "aclose";
		} else if(((day == 1 || day == 2 || day == 4 || day == 5) && (hour > 7 && hour < 17)) || (day == 3 && ((hour > 7 && hour < 17) && hour != 12 && ((hour == 13 && mins > 29) || hour != 13)))){
			//open
			return "open";
		} else {
			//closed
			return "close";
		}
	}
}

function closeNote(holiday,fallDay){
	var text = document.getElementById("closureNote");
	var rText;
	if(holiday == "hol") {
		switch(fallDay){
			case 0:
				rText = "Tuesday, January 3rd";
				break;
			case 1:
				rText = "Tuesday, January 2nd";
				break;
			case 2:
				rText = "Wednesday, January 2rd";
				break;
			case 3:
				rText = "Thursday, January 2nd";
				break;
			case 4:
				rText = "Monday, January 5th";
				break;
			case 5:
				rText = "Monday, January 4th";
				break;
			case 6:
				rText = "Monday, January 3rd";
				break;
			default:
		}
		text.innerHTML = "<b>The OIT Help Desk is currently closed for the holidays.</b> We will be back in office on " + rText + ". <br/><br/><b>Have a merry Christmas and a safe and happy New Year!</b> <br/><br/> <div align=\"center\"><img src=\"http://www.nd.edu/assets/features/2012/features/christmas-2014/mobile@2x.jpg\" align=\"center\" height=\"339px\" width=\"320px\"/></div>";
	} else { }
}

function openClose(students, adhoc, day, month, date, year, hour, mins){
	if (month == 0) {
		if (date == 1) {
			closeNote("hol",day);
			return "close";
		} else if (date == 2) {
			yesterday = new Date(year,0,1,hour,mins,0);
			newYear = yesterday.getDay();
			switch (newYear) {
				case 0:
					closeNote("hol",0);
					return "close";
					break;
				case 4:
					closeNote("hol",4);
					return "close";
					break;
				case 5:
					closeNote("hol",5);
					return "close";
					break;
				case 6:
					closeNote("hol",6);
					return "close";
					break;
				default:
					var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
					return hoursStatus;
			}
		} else {
			var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
			return hoursStatus;
		}
	} else if (month == 2 || month == 3) {
		var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
		return hoursStatus;
	} else if (month == 4) {
		if (day == 1) {
			if (date >= 25 && date <= 31) {
				return "close";
			} else {
				var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
				return hoursStatus;
			}
		} else {
			var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
			return hoursStatus;
		}
	} else if (month == 6) {
		julyFour = new Date(year,6,4,hour,mins,0);
		fourDay = julyFour.getDay();
		switch(fourDay){
			case 6:

				if (date == 3){
					return "close";
				} else {
					var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
					return hoursStatus;
				}
				break;
			case 0:
				if (date == 5) {
					return "close";
				} else {
					var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
					return hoursStatus;
				}
				break;
			default:
				if (date == 4) {
					return "close";
				} else {
					var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
					return hoursStatus;
				}
		}
	} else if (month == 10) {
		if (day == 4) {
			return "close";
			if ( date >= 22 &&  date <= 28) {
				return "close";
			} else {
				var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
				return hoursStatus;
			}
		} else if (day == 5) {
			if (date >= 23 && date <=29) {
				return "close";
			} else {
				var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
				return hoursStatus;
			}
		} else {
			var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
			return hoursStatus;
		}
	} else if (month == 11) {
		var christmas = new Date(year,11,25,hour,mins,0);
		var christmasDay = christmas.getDay();
		if (date >= 24) {
			closeNote("hol",christmasDay);
			return "close";
		} else if (date == 22 || date == 23) {
			christmas = new Date(year,11,25,hour,mins,0);
			christmasDay = christmas.getDay();
			switch (christmasDay) {
				case 0:
					if (date == 23){
						closeNote("hol",christmasDay);
						return "close";
					} else {
						var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
						return hoursStatus;
					}
					break;
				case 1:
					if (date == 22 || date == 23) {
						closeNote("hol",christmasDay);
						return "close";
					} else {
						var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
						return hoursStatus;
					}
					break;
				case 3:
					if (date == 23) {
						closeNote("hol",christmasDay);
						return "close";
					} else {
						var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
						return hoursStatus;
					}
					break;
				default:
					var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
					return hoursStatus;
			}
		} else {
			var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
			return hoursStatus;
		}
	} else {
		var hoursStatus = hoursCheck(students, adhoc, day, month, date, year, hour, mins);
		return hoursStatus;
	}
}

function closing(minsLeft, c){
	setTimeout(function(){location.reload(true);},c*1000);
    if(minsLeft <=5 && minsLeft >1){
		alert("The Help Desk closes in " + minsLeft + " minutes.");
    }else if (minsLeft == 1){
		alert("The Help Desk closes in 1 minute.");
	}else if(minsLeft == 0){
		alert("The Help Desk closes in less than a minute.");
    }
}

function chgLabel() {
	var e = document.getElementsByTagName('label');
	for (i = 0; i < e.length; i++) {
		if (e[i].innerHTML == 'Company Name') {
			e[i].innerHTML = 'NetID';
		}
	}
}
