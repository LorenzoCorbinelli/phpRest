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
	var table='<table id="tabellaStudents" class="table table-hover">';
	var th='<tr><th>ID</th><th>NAME</th><th>SURNAME</th><th>SIDICODE</th><th>TAXCODE</th></tr>';
	table+=th;
	json.studentInfo.forEach(function riga(item){
		var idOpzione='student'+item.id;
		var tr='<tr onmouseover="mostra_opzioni('+idOpzione+')" onmouseout="nascondi_opzioni('+idOpzione+')">';
		tr+='<td>'+item.id+'</td>';
		tr+='<td>'+item.name+'</td>';
		tr+='<td>'+item.surname+'</td>';
		tr+='<td>'+item.sidiCode+'</td>';
		tr+='<td>'+item.taxCode+'</td>';
		tr+='<td id='+idOpzione+' hidden=true><img name="'+item.id+'"src="./resources/delete.svg" onclick="Delete_students(this)"> <img src="./resources/edit.svg"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table; 
}

function crea_tabella_getClasses(xhr)
{
	var json=JSON.parse(xhr.response);
	var table='<table id="tabellaClasses" class="table table-hover">';
	var th='<tr><th>ID</th><th>YEAR</th><th>SECTION</th></tr>';
	table+=th;
	json.classInfo.forEach(function riga(item){
		var idOpzione='class'+item.id;
		var tr='<tr onmouseover="mostra_opzioni('+idOpzione+')" onmouseout="nascondi_opzioni('+idOpzione+')">';
		tr+='<td>'+item.id+'</td>';
		tr+='<td>'+item.year+'</td>';
		tr+='<td>'+item.section+'</td>';
		tr+='<td id='+idOpzione+' hidden=true><img name="'+item.id+'" src="./resources/delete.svg" onclick="Delete_classes(this)">  <img src="./resources/edit.svg"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table; 
}

function crea_tabella_getStudentClass(xhr)
{
	var json=JSON.parse(xhr.response);
	var table='<table id="tabellaStudentsClasses" class="table table-hover">';
	var th='<tr><th>ID</th><th>ID_STUDENT</th><th>ID_CLASS</th></tr>';
	table+=th;
	json.student_classInfo.forEach(function riga(item){
		var idOpzione='studentClass'+item.id;
		var tr='<tr onmouseover="mostra_opzioni('+idOpzione+')" onmouseout="nascondi_opzioni('+idOpzione+')">';
		tr+='<td>'+item.id+'</td>';
		tr+='<td>'+item.idStudent+'</td>';
		tr+='<td>'+item.idClass+'</td>';
		tr+='<td id='+idOpzione+' hidden=true><img name="'+item.id+'" src="./resources/delete.svg" onclick="Delete_studentClass(this)">  <img src="./resources/edit.svg"></td></tr>';
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

function mostra_opzioni(Opzione)
{
	document.getElementById(Opzione.id).hidden=false;
}

function nascondi_opzioni(Opzione)
{
	document.getElementById(Opzione.id).hidden=true;
}

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

function mostra_post()
{
	document.getElementById('aggiungi').hidden=true;
	document.getElementById('form_post').hidden=false;
	switch(document.getElementById('scelta_tabella').value)
	{
		case 'students':
			document.getElementById('form_post').innerHTML='<form><div class="form-inline">'+
			'<input type="text" placeholder="Name" id="name" class="form-control w-25">'+
			'<input type="text" placeholder="Surname" id="surname" class="form-control w-25"></div><br>'+
			'<div class="form-inline"><input type="text" placeholder="SidiCode" id="sidiCode" class="form-control w-25">'+
			'<input type="text" placeholder="TaxCode" id="taxCode" class="form-control w-25"></div><br>'+
			'<input type="button" value="Aggiungi" onclick="post()" class="btn btn-success"></form>';
		break;
		case 'classes':
			document.getElementById('form_post').innerHTML='<form>'+
			'<div class="form-inline"><input type="text" placeholder="Year" id="year" class="form-control w-25">'+
			'<input type="text" placeholder="Section" id="section" class="form-control w-25"></div><br>'+
			'<input type="button" value="Aggiungi" onclick="post()" class="btn btn-success"></form>';
		break;
		case 'student_class':
			document.getElementById('form_post').innerHTML='<form>'+
			'<div class="form-inline"><input type="text" placeholder="ID_student" id="idStudent" class="form-control w-25">'+
			'<input type="text" placeholder="ID_class" id="idClass" class="form-control w-25"></div><br>'+
			'<input type="button" value="Aggiungi" onclick="post()" class="btn btn-success"></form>';
		break;
	}
}

function post()
{
	document.getElementById('form_post').hidden=true;
	document.getElementById('aggiungi').hidden=false;
	var xhr = new XMLHttpRequest();
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	
	switch(document.getElementById('scelta_tabella').value)
	{
		case 'students':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_students();
			};
			xhr.open("POST", 'students.php', true);
			var json = '{"name":"' + document.getElementById('name').value + '", "surname":"' + document.getElementById('surname').value + '", "sidiCode":"' + document.getElementById('sidiCode').value + '", "taxCode":"' + document.getElementById('taxCode').value +'"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json);
		break;
		case 'classes':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_classes();
			};
			xhr.open("POST", 'classes.php', true);
			var json = '{"year":"' + document.getElementById('year').value + '", "section":"' + document.getElementById('section').value + '"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json)
		break;
		case 'student_class':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_studentClass();
			};
			xhr.open("POST", 'student_class.php', true);
			var json = '{"idStudent":"' + document.getElementById('idStudent').value + '", "idClass":"' + document.getElementById('idClass').value + '"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json)
		break;
	}
}