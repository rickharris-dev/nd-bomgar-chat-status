function status(accessType) {
//Determine Help Desk Status
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			//Interface Function
			var data = JSON.parse(xmlhttp.responseText);
			var status = data["status"];
			var students = data["students"]
			var hour = data["hour"];
			var mins = data["mins"];
			var secs = data["secs"];
			var day = data["day"];
			//alert(mins);
			var minsLeft = 59 - mins;
			var secsLeft = 59 - secs;
			var c = (minsLeft * 60) + secsLeft;
			//alert(minsLeft);
			if (accessType == 'mobile' && (status == "open" || status == "aopen")) {
				return true;
			} else if (accessType == 'mobile' && (status == "close" || status == "aclose")) {
				return false;
			} else if (accessType == 'web' && (status == "open" || status == "aopen")) {
				chgLabel()
				document.getElementById('issueSubmissionBox').style.display = 'block';
				document.getElementById('issueSubmissionBox-alt').style.display = 'none';
				if (status == "open" && students=="true" && minsLeft < 6 && (((day==0 || day==1 || day==2 || day==4) && hour==19) || (day==5 && hour==16) || (day == 3 && (hour==19 || hour==11)))) {
					closing(minsLeft, c);
				} else if (status == "open" && students=="false" && minsLeft < 6 && (((day==1 || day==2 || day==4 || day==5) && hour==16) || (day == 3 && (hour==16 || hour==11)))) {
					closing(minsLeft, c);
				}
			} else if (accessType == 'web' && (status == "aclose" || status == "close")) {
				document.getElementById('issueSubmissionBox').style.display = 'none';
				document.getElementById('issueSubmissionBox-alt').style.display = 'block';
			} else {
				alert("ERROR: Access type is missing in function call");
			}
		}
	}
	xmlhttp.open("GET", "https://www3.nd.edu/~oithelp/bomgar/hours.php", true);
	xmlhttp.send();
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
