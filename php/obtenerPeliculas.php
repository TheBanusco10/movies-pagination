<?php

header('Content-type: application/json');

require_once ('db.php');

$query = "SELECT * FROM movies LIMIT 10";

$stmt = $pdo->prepare($query);
$stmt->execute();
$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($movies);

