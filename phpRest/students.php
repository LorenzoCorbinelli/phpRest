<?php
    $_dbHostname = "localhost:3306";
    $_dbName = "FI_ITIS_MEUCCI";
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
            if($pathArray[2])
            {
                //con parametro id
                $id = $pathArray[2];
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
                $sql = "select * from studenti";
                $stmt = $_con->prepere($sql);
                $stmt->execute();
                $data = $stmt->fetch(\PDO::FETCH_ASSOC);
            }
            $js_encode = json_encode(array($data),true);
            //output
            header('Content-Type: application/json');
            echo $js_encode;
        break;
    }
?>