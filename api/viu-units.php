<?php
header("Access-Control-Allow-Original: *");
header("Content-Type: application/json; charset=UTF-8");
include ("connect.php");
// $data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("SELECT * FROM units");
$stmt->execute();
$result = $stmt->get_result();
$units = [];
while ($row = $result->fetch_assoc()) {
    $units[] = $row;
};
echo json_encode([
    "status" => "success",
    "units" => $units
]);