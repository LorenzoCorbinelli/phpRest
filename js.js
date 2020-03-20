function scelta_tabella()
{
	switch(document.getElementById('scelta_tabella').value)
	{
		case 'students':
			document.getElementById('aggiungi').hidden=false;
			get_students();
		break;
		case 'classes':
			document.getElementById('aggiungi').hidden=false;
			get_classes();
		break;
		case 'student_class':
			document.getElementById('aggiungi').hidden=false;
			get_studentClass();
		break;
		case 'default':
			document.getElementById('div_tabella').innerHTML='';
			document.getElementById('aggiungi').hidden=true;
		break;
	}
}

function crea_tabella_getStudents(xhr)
{
	var json=JSON.parse(xhr.response);
	var table='<table id="tabella" class="table table-hover">';
	var th='<tr><th>ID</th><th>NAME</th><th>SURNAME</th><th>SIDICODE</th><th>TAXCODE</th><th></th></tr>';
	table+=th;
	json.studentInfo.forEach(function riga(item){
		var tr='<tr>';
		tr+='<td>'+item.id+'</td>';
		tr+='<td>'+item.name+'</td>';
		tr+='<td>'+item.surname+'</td>';
		tr+='<td>'+item.sidiCode+'</td>';
		tr+='<td>'+item.taxCode+'</td>';
		tr+='<td class="opzioni" ><img name="'+item.id+'"src="./resources/delete.svg" onclick="Delete_students(this)"> <img src="./resources/edit.svg"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table; 
}

function crea_tabella_getClasses(xhr)
{
	var json=JSON.parse(xhr.response);
	var table='<table class="table table-hover">';
	var th='<tr><th>ID</th><th>YEAR</th><th>SECTION</th><th></th></tr>';
	table+=th;
	json.classInfo.forEach(function riga(item){
		var tr='<tr>';
		tr+='<tr><td>'+item.id+'</td>';
		tr+='<td>'+item.year+'</td>';
		tr+='<td>'+item.section+'</td>';
		tr+='<td class="opzioni" ><img name="'+item.id+'" src="./resources/delete.svg" onclick="Delete_classes(this)">  <img src="./resources/edit.svg"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table; 
}

function crea_tabella_getStudentClass(xhr)
{
	var json=JSON.parse(xhr.response);
	var table='<table class="table table-hover">';
	var th='<tr><th>ID</th><th>ID_STUDENT</th><th>ID_CLASS</th><th></th></tr>';
	table+=th;
	json.student_classInfo.forEach(function riga(item){
		var tr='<tr>';
		tr+='<tr><td>'+item.id+'</td>';
		tr+='<td>'+item.idStudent+'</td>';
		tr+='<td>'+item.idClass+'</td>';
		tr+='<td class="opzioni" ><img name="'+item.id+'" src="./resources/delete.svg" onclick="Delete_studentClass(this)">  <img src="./resources/edit.svg"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table;
}

function Delete_classes(obj)
{
	var xhr = new XMLHttpRequest();
	//configuro la callback per la risposta
	xhr.onload = function() {
		get_classes();
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	xhr.open("DELETE", 'classes.php/'+obj.name, true);
	xhr.send();
}

function Delete_students(obj)
{
	var xhr = new XMLHttpRequest();
	//configuro la callback per la risposta
	xhr.onload = function() {
		get_students();
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	xhr.open("DELETE", 'students.php/'+obj.name, true);
	xhr.send();
}

function Delete_studentClass(obj)
{
	var xhr = new XMLHttpRequest();
	//configuro la callback per la risposta
	xhr.onload = function() {
		get_studentClass();
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	xhr.open("DELETE", 'student_class.php/'+obj.name, true);
	xhr.send();
}

/*function mostra_opzioni()
{
	for(var i=0;i<document.getElementsByClassName('opzioni').length;i++)
		document.getElementsByClassName('opzioni')[i].hidden=false;
}

function nascondi_opzioni()
{
	for(var i=0;i<document.getElementsByClassName('opzioni').length;i++)
		document.getElementsByClassName('opzioni')[i].hidden=true;
}*/

function get_students()
{
	var xhr = new XMLHttpRequest();
	//configuro la callback per la risposta
	xhr.onload = function() {
		crea_tabella_getStudents(xhr);
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	xhr.open("GET", 'students.php', true);
	xhr.send();
}

function get_classes()
{
	var xhr = new XMLHttpRequest();
	//configuro la callback per la risposta
	xhr.onload = function() {
		crea_tabella_getClasses(xhr);
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	xhr.open("GET", 'classes.php', true);
	xhr.send();
}

function get_studentClass()
{
	var xhr = new XMLHttpRequest();
	//configuro la callback per la risposta
	xhr.onload = function() {
		crea_tabella_getStudentClass(xhr);
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	xhr.open("GET", 'student_class.php', true);
	xhr.send();
}