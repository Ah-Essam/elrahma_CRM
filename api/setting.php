<?php
header("Access-Control-Allow-Original: *");
header("Content-Type: application/json; charset=UTF-8");
include ("connect.php");
$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("ss",$data['newPass'] ,$data['userId']);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode([
    "status" => "success",
    "message" => "تم تغيير كلمة السر"
]);