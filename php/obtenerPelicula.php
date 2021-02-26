<?php

header('Content-type: application/json');

include_once("db.php");

$fetch_student_info = $db_con->prepare("select * from movies where id = :id");
$fetch_student_info->execute(array(':id' => $_GET['id']));
$movie = $fetch_student_info->fetch(PDO::FETCH_ASSOC);

echo json_encode($movie);