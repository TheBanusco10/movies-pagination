<?php

header('Content-type: application/json');

include_once("db.php");

$sqlQuery = "DELETE FROM movies WHERE id = :id";

$run = $db_con->prepare($sqlQuery);
$run->bindParam(':id', $_GET['id'], PDO::PARAM_INT);
$run->execute(); 

$resp['msg']    = "Película eliminada correctamente";
$resp['status'] = true;	
echo json_encode($resp);