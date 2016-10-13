function getStatus() {
	var date = $.now();
	var students = document.getElementById("students");
	var status = document.getElementById("status");
	var currentSta = document.getElementById("currentStatus");
	var currentStu = document.getElementById("currentStudents");
	$.get("hours.json?v=" + date,function(data,dataStatus){
		data = JSON.parse(data);
		cStu = data['students'];
		cSta = data['status']
		if(cSta == 'normal') {
			status.selectedIndex = '0';
			currentSta.innerHTML = 'Current Setting: Normal Business Hours';
		} else if(cSta == 'open') {
			status.selectedIndex = '1';
			currentSta.innerHTML = 'Current Setting: Adhoc Open';
		} else if(cSta == 'close') {
			status.selectedIndex = '2';
			currentSta.innerHTML = 'Current Setting: Adhoc Close';
		} else {
			currentSta.innerHTML = 'Error: Help Desk Status Data Error';
		}
		if(cStu == 'false') {
			students.selectedIndex = '0';
			currentStu.innerHTML = 'Current Setting: Full-time Staff Coverage';
		} else if(cStu == 'true') {
			students.selectedIndex = '1';
			currentStu.innerHTML = 'Current Setting: Extended Student Coverage';
		} else {
			currentStu.innerHTML = 'Error: Coverage Status Data Error';
		}
	});
}


function updateStatus() {
	var date = $.now();
	var nStu = document.getElementById("students").value;
	var nSta = document.getElementById("status").value;
	var form = document.getElementById("form");
	var result = document.getElementById("result");
	var response = document.getElementById("response");
	var students;
	var status;
		if(nSta == '0') {
			status = 'normal';
		} else if(nSta == '1') {
			status = 'open';
		} else if(nSta == '2') {
			status = 'close';
		} else {
			alert("Error: Help Desk Status Data Error");
		}
		if(nStu == '0') {
			students = 'false';
		} else if(nStu == '1') {
			students = 'true';
		} else {
			alert("Error: Coverage Status Data Error");
		}	
	var str = "x=" + encodeURIComponent(status) + "&y=" + encodeURIComponent(students) + "&d=" + encodeURIComponent(date);
	$.get("update.php?"+str,function(data,dataStatus){
		form.style.display = "none";
		result.style.display = "block";
		response.innerHTML = data;
	});
}

function refreshStatus() {
	var form = document.getElementById("form");
	var result = document.getElementById("result");
	form.style.display = 'block';
	result.style.display = 'none';
	getStatus();
}