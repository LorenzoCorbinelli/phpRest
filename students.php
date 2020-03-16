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
            $pathArray = explode('/',$_SERVER['REQUEST_URI']);
            if(isset($pathArray[3]))
            {
                //con parametro id
                $id = $pathArray[3];
                $sql = "select * from student where id=:id";
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
                $sql = "select * from student";
                $stmt = $_con->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }
            $js_encode = json_encode(array($data),true);
            //output
            header('Content-Type: application/json');
            echo $js_encode;
        break;
		case 'POST':
			//prendo il json della richiesta
			$json = file_get_contents('php://input');
			//trasformo il json ricevuto in un oggetto
			$data = json_decode($json,true);
			$sql = "insert into student values(default, :name, :surname, :sidiCode, :taxCode);";
			$stmt = $_con->prepare($sql);
			$params = [
				'name'=>$data["name"],
				'surname'=>$data["surname"],
				'sidiCode'=>$data["sidiCode"],
				'taxCode'=>$data["taxCode"]
			];
			$stmt->execute($params);
			$sql = "select * from student where sidiCode=:sidiCode";
			$stmt = $_con->prepare($sql);
			$params = [
				'sidiCode'=>$data["sidiCode"]
			];
			$stmt->execute($params);
			//ritorno il json dello studente inserito
			$data = $stmt->fetch(\PDO::FETCH_ASSOC);
			$js_encode = json_encode(array($data),true);
            //output
            header('Content-Type: application/json');
            echo $js_encode;
		break;
		case 'DELETE':
			$pathArray = explode('/',$_SERVER['REQUEST_URI']);
			$id=$pathArray[3];
			$sql = 'delete from student where id=:id';
			$stmt = $_con->prepare($sql);
			$params = [
                    'id'=>$id
                ];
			$stmt->execute($params);
			echo 'Cancellazione effettuata.';
		break;
		case 'PUT':
			$pathArray = explode('/',$_SERVER['REQUEST_URI']);
			$id=$pathArray[3];
			$json = file_get_contents('php://input');
			//trasformo il json ricevuto
			$data = json_decode($json,true);
			$sql = 'update student set name=:name, surname=:surname, sidiCode=:sidiCode, taxCode=:taxCode where id=:id';
			$stmt = $_con->prepare($sql);
			
			if($data['name']=="")	//campo obbligatorio
			{
				echo 'Il campo name non può essere vuoto';
				break;
			}
			if($data['surname']=="")	//campo obbligatorio
			{
				echo 'Il campo surname non può essere vuoto';
				break;
			}
			if($data['sidiCode']=="")	//campo obbligatorio
			{
				echo 'Il campo sidiCode non può essere vuoto';
				break;
			}
			if($data['taxCode']=="")
				$data['taxCode']=null;
			
			$params = [
				'name'=>$data['name'],
				'surname'=>$data['surname'],
				'sidiCode'=>$data['sidiCode'],
				'taxCode'=>$data['taxCode'],
				'id'=>$id
                ];
			$stmt->execute($params);
			$sql = 'select * from student where id=:id';
			$stmt = $_con->prepare($sql);
			$params = [
				'id'=>$id
			];
			$stmt->execute($params);
			$data = $stmt->fetch(\PDO::FETCH_ASSOC);
			$js_encode = json_encode(array($data),true);
            //output dei dati dello studente aggiornato
            header('Content-Type: application/json');
            echo $js_encode;
		break;
		case 'PATCH':
			$pathArray = explode('/',$_SERVER['REQUEST_URI']);
			$id=$pathArray[3];
			$json = file_get_contents('php://input');
			//trasformo il json ricevuto
			$data = json_decode($json,true);
			$sql = 'update student set ';
			
			if($data['name']!="")
				$sql = $sql . 'name="' . $data['name'] . '",';
			if($data['surname']!="")
				$sql = $sql . 'surname="' . $data['surname'] . '",';
			if($data['sidiCode']!="")
				$sql = $sql . 'sidiCode="' . $data['sidiCode'] . '",';
			if($data['taxCode']!="")
				$sql = $sql . 'taxCode="' . $data['taxCode'] . '",';
			
			$sql = substr($sql, 0, strlen($sql)-1);	//tolgo l'ultima virgola
			$sql = $sql . ' where id=' . $id;
			$stmt = $_con->prepare($sql);
			$stmt->execute();
			$sql = 'select * from student where id=:id';
			$stmt = $_con->prepare($sql);
			$params = [
				'id'=>$id
			];
			$stmt->execute($params);
			$data = $stmt->fetch(\PDO::FETCH_ASSOC);
			$js_encode = json_encode(array($data),true);
            //output dei dati dello studente aggiornato
            header('Content-Type: application/json');
            echo $js_encode;
		break;
    }
?>