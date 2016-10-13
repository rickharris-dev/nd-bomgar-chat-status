function status(accessType) {
    // ------------------------ Set Variables ------------------------ 

    var students = 'false'; // true =  student workers || false = no student workers
    var adhoc = 'close'; // open = temp open || close = temp close || normal = normal business hours

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



    // ------------------------ Test Variables ------------------------ 

    var minsLeft = 59 - mins;
    var secsLeft = 59 - secs;
    var c = (minsLeft * 60) + secsLeft;

    //Determine Help Desk Status
    var status  = openClose(students, adhoc, day, hour, mins);
    
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

function openClose(students, adhoc, day, hour, mins){
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
