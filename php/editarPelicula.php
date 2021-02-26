<?php

header('Content-type: application/json');

include_once("db.php");

$sqlQuery = "UPDATE movies SET titulo = :titulo, 
            sinopsis = :sinopsis,
            image = :image
            WHERE id = :id";

$run = $db_con->prepare($sqlQuery);
$run->bindParam(':titulo', $_POST['titulo'], PDO::PARAM_STR);  
$run->bindParam(':sinopsis', $_POST['sinopsis'], PDO::PARAM_STR); 
$run->bindParam(':image', $_POST['image'], PDO::PARAM_STR);
$run->bindParam(':id', $_POST['id'], PDO::PARAM_INT);
$run->execute(); 

$resp['msg']    = "Película editada correctamente";
$resp['status'] = true;	
echo json_encode($resp);