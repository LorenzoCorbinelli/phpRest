function scelta_tabella()
{
	switch(document.getElementById('scelta_tabella').value)	//tabella selezionata
	{
		case 'students':
			document.getElementById('aggiungi').hidden=false;
			document.getElementById('form').hidden=true;
			get_students();
		break;
		case 'classes':
			document.getElementById('aggiungi').hidden=false;
			document.getElementById('form').hidden=true;
			get_classes();
		break;
		case 'student_class':
			document.getElementById('div_tabella').innerHTML='';
			var xhr = new XMLHttpRequest();
			//configuro la callback di errore
			xhr.onerror = function() { 
				alert('Errore');
			};
			//configuro la callback per la risposta
			xhr.onload = function() {
				var json=JSON.parse(xhr.response);
				//creo una select con l'elenco delle classi ricevute
				var select = 'Classe: <br><select id="Elencoclassi" class="custom-select w-25" onchange="get_studentClass()"><option>Seleziona la classe</option>';
				json.classInfo.forEach(function riga(item){
					select+='<option id="'+item.id+'">'+item.section+'</option>';
				});
				select+='</select>';
				document.getElementById('form').innerHTML=select;
				document.getElementById('form').hidden=false;
				document.getElementById('aggiungi').hidden=true;
			};
			//richiesta elenco classi
			xhr.open("GET", 'classes.php', true);
			xhr.send();
		break;
		case 'default':
			document.getElementById('div_tabella').innerHTML='';
			document.getElementById('aggiungi').hidden=true;
			document.getElementById('form').hidden=true;
		break;
	}
}

function crea_tabella_getStudents(xhr)
{
	var json=JSON.parse(xhr.response);
	//creo una tabella con l'elenco ricevuto degli studenti
	var table='<table id="tabellaStudents" class="table table-hover">';
	var th='<tr><th>NAME</th><th>SURNAME</th><th>SIDICODE</th><th>TAXCODE</th></tr>';
	table+=th;
	json.studentInfo.forEach(function riga(item){
		var idOpzione='student'+item.id;	//per identificare ogni record della tabella
		var tr='<tr onmouseover="mostra_opzioni('+idOpzione+')" onmouseout="nascondi_opzioni('+idOpzione+')">';
		tr+='<td>'+item.name+'</td>';
		tr+='<td>'+item.surname+'</td>';
		tr+='<td>'+item.sidiCode+'</td>';
		tr+='<td>'+item.taxCode+'</td>';
		tr+='<td id='+idOpzione+' hidden=true><img name="'+item.id+'"src="./resources/delete.svg" data-toggle="modal" data-target="#deleteModal" onclick=document.getElementById("modalConferma").name="'+item.id+'"> <img src="./resources/edit.svg" id="'+item.id+'" onclick="edit(this)"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table; 
}

function crea_tabella_getClasses(xhr)
{
	var json=JSON.parse(xhr.response);
	//creo una tabella con l'elenco ricevuto delle classi
	var table='<table id="tabellaClasses" class="table table-hover">';
	var th='<tr><th>YEAR</th><th>SECTION</th></tr>';
	table+=th;
	json.classInfo.forEach(function riga(item){
		var idOpzione='class'+item.id;	//per identificare ogni record della tabella
		var tr='<tr onmouseover="mostra_opzioni('+idOpzione+')" onmouseout="nascondi_opzioni('+idOpzione+')">';
		tr+='<td>'+item.year+'</td>';
		tr+='<td>'+item.section+'</td>';
		tr+='<td id='+idOpzione+' hidden=true><img name="'+item.id+'" src="./resources/delete.svg" data-toggle="modal" data-target="#deleteModal" onclick=document.getElementById("modalConferma").name="'+item.id+'">  <img src="./resources/edit.svg" id="'+item.id+'" onclick="edit(this)"></td></tr>';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table; 
}

function crea_tabella_getStudentClass(xhr)
{
	var json=JSON.parse(xhr.response);
	//creo una tabella con l'elenco ricevuto degli studenti per quella classe
	var table='<table id="tabellaStudentsClasses" class="table table-hover">';
	var th='<tr><th>NAME</th><th>SURNAME</th><th>SIDICODE</th><th>TAXCODE</th></tr>';
	table+=th;
	json.student_classInfo.forEach(function riga(item){
		var idOpzione='studentClass'+item.id;	//per identificare ogni record della tabella
		var tr='<tr onmouseover="mostra_opzioni('+idOpzione+')" onmouseout="nascondi_opzioni('+idOpzione+')">';
		tr+='<td>'+item.name+'</td>';
		tr+='<td>'+item.surname+'</td>';
		tr+='<td>'+item.sidiCode+'</td>';
		tr+='<td>'+item.taxCode+'</td>';
		tr+='<td id='+idOpzione+' hidden=true><img name="'+item.id+'" src="./resources/delete.svg" data-toggle="modal" data-target="#deleteModal" onclick=document.getElementById("modalConferma").name="'+item.id+'">';
		table+=tr;
	});
	table+='</table>'; 
	document.getElementById('div_tabella').innerHTML=table;
}

function Delete(obj)
{
	var xhr = new XMLHttpRequest();
	
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	switch(document.getElementById('scelta_tabella').value)	//quale tabella è stata selezionata
	{
		case 'students':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_students();		//faccio una richiesta get per vedere la tabella aggiornata dopo la cancellazione
			};
			xhr.open("DELETE", 'students.php/'+obj.name, true);
		break;
		case 'classes':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_classes();	//faccio una richiesta get per vedere la tabella aggiornata dopo la cancellazione
			};
			xhr.open("DELETE", 'classes.php/'+obj.name, true);
		break;
		case 'student_class':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_studentClass();	//faccio una richiesta get per vedere la tabella aggiornata dopo la cancellazione
			};
			xhr.open("DELETE", 'student_class.php?idStudent='+obj.name, true);
		break;
	}
	xhr.send();
}

function edit(obj)
{
	mostra_form_put(obj);
	var xhr = new XMLHttpRequest();
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	switch(document.getElementById('scelta_tabella').value)	//quale tabella è stata selezionata
	{
		case 'students':
			//configuro la callback per la risposta
			xhr.onload = function() {
				var json=JSON.parse(xhr.response);
				//mostro i dati attuali dello studente
				document.getElementById('name').value=json.studentInfo.name;
				document.getElementById('surname').value=json.studentInfo.surname;
				document.getElementById('sidiCode').value=json.studentInfo.sidiCode;
				document.getElementById('taxCode').value=json.studentInfo.taxCode;
			};
			xhr.open("GET", 'students.php/'+obj.id, true);	//richiesta get con l'id dello studente da modificare
		break;
		case 'classes':
			//configuro la callback per la risposta
			xhr.onload = function() {
				var json=JSON.parse(xhr.response);
				//mostro i dati attuali della classe
				document.getElementById('year').value=json.classInfo.year;
				document.getElementById('section').value=json.classInfo.section;
			};
			xhr.open("GET", 'classes.php/'+obj.id, true);	//richiesta get con l'id della classe da modificare
		break;
	}
	xhr.send();
}

function mostra_form_put(obj)
{
	document.getElementById('aggiungi').hidden=true;
	document.getElementById('form').hidden=false;
	switch(document.getElementById('scelta_tabella').value)	//tabella selezionata
	{
		case 'students':
			document.getElementById('form').innerHTML='<form><div class="form-inline">'+
			'<input type="text" placeholder="Name" id="name" class="form-control w-25">'+
			'<input type="text" placeholder="Surname" id="surname" class="form-control w-25"></div><br>'+
			'<div class="form-inline"><input type="text" placeholder="SidiCode" id="sidiCode" class="form-control w-25">'+
			'<input type="text" placeholder="TaxCode" id="taxCode" class="form-control w-25"></div></form><br>'+
			'<button onclick="put('+obj.id+')" class="btn btn-success"><img src="./resources/edit-3.svg">  Modifica'+
			'<button id="annulla" class="btn btn-danger" onclick="annulla()"><img src="./resources/x.svg">  Annulla</button>';
		break;
		case 'classes':
			document.getElementById('form').innerHTML='<form>'+
			'<div class="form-inline"><input type="text" placeholder="Year" id="year" class="form-control w-25">'+
			'<input type="text" placeholder="Section" id="section" class="form-control w-25"></div><br></form>'+
			'<button onclick="put('+obj.id+')" class="btn btn-success"><img src="./resources/edit-3.svg">  Modifica'+
			'<button id="annulla" class="btn btn-danger" onclick="annulla()"><img src="./resources/x.svg">  Annulla</button>';
		break;
	}
}

function put(id)
{
	document.getElementById('form').hidden=true;
	document.getElementById('aggiungi').hidden=false
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
				get_students();	//faccio una richiesta get per vedere la tabella aggiornata dopo la modifica
			};
			xhr.open("PUT", 'students.php/'+id, true);
			var json = '{"name":"' + document.getElementById('name').value + '", "surname":"' + document.getElementById('surname').value + '", "sidiCode":"' + document.getElementById('sidiCode').value + '", "taxCode":"' + document.getElementById('taxCode').value +'"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json);
		break;
		case 'classes':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_classes();	//faccio una richiesta get per vedere la tabella aggiornata dopo la modifica
			};
			xhr.open("PUT", 'classes.php/'+id, true);
			var json = '{"year":"' + document.getElementById('year').value + '", "section":"' + document.getElementById('section').value + '"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json)
		break;
	}
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
	var xhr = new XMLHttpRequest()
	//configuro la callback per la risposta
	xhr.onload = function() {
		crea_tabella_getStudentClass(xhr);
	};
	//configuro la callback di errore
	xhr.onerror = function() { 
		alert('Errore');
	};
	var idClass = document.getElementById("Elencoclassi").item(document.getElementById("Elencoclassi").selectedIndex).id;	//prendo l'id della classe selezionata
	xhr.open("GET", 'student_class.php?class='+idClass, true);
	xhr.send();
}

function mostra_form()
{
	document.getElementById('aggiungi').hidden=true;
	document.getElementById('form').hidden=false;
	switch(document.getElementById('scelta_tabella').value)	//tabella selezionata
	{
		case 'students':
			var xhr = new XMLHttpRequest();
			//configuro la callback per la risposta
			xhr.onload = function() {
				var json=JSON.parse(xhr.response);
				//elenco delle classi
				var select = 'Classe: <br><select id="classi" class="custom-select w-25">';
				json.classInfo.forEach(function riga(item){
					select+='<option id="'+item.id+'">'+item.section+'</option>';
				});
				select+='</select>';
				document.getElementById('form').innerHTML='<form><div class="form-inline">'+
				'<input type="text" placeholder="Name" id="name" class="form-control w-25">'+
				'<input type="text" placeholder="Surname" id="surname" class="form-control w-25"></div><br>'+
				'<div class="form-inline"><input type="text" placeholder="SidiCode" id="sidiCode" class="form-control w-25">'+
				'<input type="text" placeholder="TaxCode" id="taxCode" class="form-control w-25"></div></form><br>'+
				select +
				'<br><br><button onclick="post()" class="btn btn-success"><img src="./resources/add.svg">  Aggiungi'+
				'<button id="annulla" class="btn btn-danger" onclick="annulla()"><img src="./resources/x.svg">  Annulla</button>';
			};
			//configuro la callback di errore
			xhr.onerror = function() { 
				alert('Errore');
			};
			xhr.open("GET", 'classes.php', true);	//per elenco classi
			xhr.send();
		break;
		case 'classes':
			document.getElementById('form').innerHTML='<form>'+
			'<div class="form-inline"><input type="text" placeholder="Year" id="year" class="form-control w-25">'+
			'<input type="text" placeholder="Section" id="section" class="form-control w-25"></div><br></form>'+
			'<button onclick="post()" class="btn btn-success"><img src="./resources/add.svg">  Aggiungi'+
			'<button id="annulla" class="btn btn-danger" onclick="annulla()"><img src="./resources/x.svg">  Annulla</button>';
		break;
		case 'student_class':
			document.getElementById('form').innerHTML='<form>'+
			'<div class="form-inline"><input type="text" placeholder="ID_student" id="idStudent" class="form-control w-25">'+
			'<input type="text" placeholder="ID_class" id="idClass" class="form-control w-25"></div><br></form>'+
			'<button onclick="post()" class="btn btn-success"><img src="./resources/add.svg">  Aggiungi'+
			'<button id="annulla" class="btn btn-danger" onclick="annulla()"><img src="./resources/x.svg">  Annulla</button>';
		break;
	}
}

function annulla()
{
	document.getElementById('form').hidden=true;
	document.getElementById('aggiungi').hidden=false;
}

function post()
{
	document.getElementById('form').hidden=true;
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
				json=JSON.parse(xhr.response);
				var idStudent = json.studentInfo.id;
				var idClass = document.getElementById("classi").item(document.getElementById("classi").selectedIndex).id;	//prendo l'id della classe
				//aggiungo lo studente alla classe selezionata
				xhr.open("POST","student_class.php",true);
				json = '{"idStudent":"' + idStudent + '", "idClass":"' + idClass + '"}';
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.onload = function(){};	//resetto la callback per la risposta
				xhr.send(json);
				get_students();	//faccio una richiesta get per vedere la tabella aggiornata dopo l'inserimento
			};
			//aggiungo lo studente
			xhr.open("POST", 'students.php', true);
			var json = '{"name":"' + document.getElementById('name').value + '", "surname":"' + document.getElementById('surname').value + '", "sidiCode":"' + document.getElementById('sidiCode').value + '", "taxCode":"' + document.getElementById('taxCode').value +'"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json);
		break;
		case 'classes':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_classes();	//faccio una richiesta get per vedere la tabella aggiornata dopo l'inserimento
			};
			xhr.open("POST", 'classes.php', true);
			var json = '{"year":"' + document.getElementById('year').value + '", "section":"' + document.getElementById('section').value + '"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json)
		break;
		case 'student_class':
			//configuro la callback per la risposta
			xhr.onload = function() {
				get_studentClass();	//faccio una richiesta get per vedere la tabella aggiornata dopo l'inserimento
			};
			xhr.open("POST", 'student_class.php', true);
			var json = '{"idStudent":"' + document.getElementById('idStudent').value + '", "idClass":"' + document.getElementById('idClass').value + '"}';
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(json)
		break;
	}
}