<?php
    $_dbHostname = "localhost:3306";
    $_dbName = "fi_itis_meucci";
    $_dbUsername = "root";
    $_dbPassword = "password";
    $_con = new PDO("mysql:host=$_dbHostname;dbname=$_dbName", $_dbUsername, $_dbPassword);
    $_con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $_con->exec('SET NAMES utf8');
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    switch($requestMethod)
    {
		case 'GET':
			if($_GET["class"]) // http://localhost/student_class.php?class=105
			{
				$sql = 'select S.* from student S inner join student_class SC on S.id = SC.idStudent where SC.idClass=:idClass;';
				$stmt = $_con->prepare($sql);
                $params = [
                    'idClass'=>$_GET["class"]
                ];
				$stmt->execute($params);
				$data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
				$js_encode = json_encode(array('status'=>true, 'student_classInfo'=>$data),true);
				//output
				header('Content-Type: application/json');
				echo $js_encode;
			}
			else
			{
				$pathArray = explode('/',$_SERVER['REQUEST_URI']);
				if(isset($pathArray[3]))
				{
					//con parametro id
					$id = $pathArray[3];
					$sql = "select * from student_class where id=:id";
					$stmt = $_con->prepare($sql);
					$params = [
						'id'=>$id
					];
					$stmt->execute($params);
					$data = $stmt->fetch(\PDO::FETCH_ASSOC);
				}
				else
				{
					//senza il parametro id torna tutta la tabella
					$sql = "select * from student_class";
					$stmt = $_con->prepare($sql);
					$stmt->execute();
					$data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
				}
				$js_encode = json_encode(array('status'=>true, 'student_classInfo'=>$data),true);
				//output
				header('Content-Type: application/json');
				echo $js_encode;
			}
        break;
		case 'POST':
			//prendo il json della richiesta
			$json = file_get_contents('php://input');
			//trasformo il json ricevuto
			$data = json_decode($json,true);
			$sql = "insert into student_class values(default, :idStudent, :idClass);";
			$stmt = $_con->prepare($sql);
			$params = [
				'idStudent'=>$data["idStudent"],
				'idClass'=>$data["idClass"]
			];
			$stmt->execute($params);
			$sql = "select * from student_class where idStudent=:idStudent and idClass=:idClass";
			$stmt = $_con->prepare($sql);
			$params = [
				'idStudent'=>$data["idStudent"],
				'idClass'=>$data["idClass"]
			];
			$stmt->execute($params);
			//ritorno il json dell'inserimento
			$data = $stmt->fetch(\PDO::FETCH_ASSOC);
			$js_encode = json_encode(array('status'=>true, 'student_classInfo'=>$data),true);
            //output
            header('Content-Type: application/json');
            echo $js_encode;	
		break;
		case 'DELETE':
			if($_GET['idStudent'])
			{
				$sql = 'delete from student_class where idStudent=:idStudent';
				$stmt = $_con->prepare($sql);
				$params = [
						'idStudent'=>$_GET['idStudent']
					];
				$stmt->execute($params);
			}
			else
			{
				$pathArray = explode('/',$_SERVER['REQUEST_URI']);
				$id=$pathArray[3];
				$sql = 'delete from student_class where id=:id';
				$stmt = $_con->prepare($sql);
				$params = [
						'id'=>$id
					];
				$stmt->execute($params);
			}
			echo 'Cancellazione effettuata.';
		break;
		case 'PUT':
			$pathArray = explode('/',$_SERVER['REQUEST_URI']);
			$id=$pathArray[3];
			$json = file_get_contents('php://input');
			//trasformo il json ricevuto
			$data = json_decode($json,true);
			$sql = "update student_class set idStudent=:idStudent, idClass=:idClass where id=:id";
			$stmt = $_con->prepare($sql);

			if(!isset($data['idStudent']) || !isset($data['idClass']))	//campo obbligatorio
			{
				echo 'I campi non possono essere vuoti.';
				break;
			}
			$params = [
				'idStudent'=>$data['idStudent'],
				'idClass'=>$data['idClass'],
				'id'=>$id
                ];
			$stmt->execute($params);
			$sql = 'select * from student_class where id=:id';
			$stmt = $_con->prepare($sql);
			$params = [
				'id'=>$id
			];
			$stmt->execute($params);
			$data = $stmt->fetch(\PDO::FETCH_ASSOC);
			$js_encode = json_encode(array('status'=>true, 'student_classInfo'=>$data),true);
            //output dei dati aggiornati
            header('Content-Type: application/json');
            echo $js_encode;
		break;
		case 'PATCH':
			$pathArray = explode('/',$_SERVER['REQUEST_URI']);
			$id=$pathArray[3];
			$json = file_get_contents('php://input');
			//trasformo il json ricevuto
			$data = json_decode($json,true);
			$sql = 'update student_class set ';
			
			if($data['idStudent']!="")
				$sql = $sql . 'idStudent="' . $data['idStudent'] . '",';
			if($data['idClass']!="")
				$sql = $sql . 'idClass="' . $data['idClass'] . '",';
			
			$sql = substr($sql, 0, strlen($sql)-1);	//tolgo l'ultima virgola
			$sql = $sql . ' where id=' . $id;
			$stmt = $_con->prepare($sql);
			$stmt->execute();
			$sql = 'select * from student_class where id=:id';
			$stmt = $_con->prepare($sql);
			$params = [
				'id'=>$id
			];
			$stmt->execute($params);
			$data = $stmt->fetch(\PDO::FETCH_ASSOC);
			$js_encode = json_encode(array('status'=>true, 'student_classInfo'=>$data),true);
            //output dei dati aggiornati
            header('Content-Type: application/json');
            echo $js_encode;
		break;
    }
?>