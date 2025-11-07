<?php
header("Access-Control-Allow-Original: *");
header("Content-Type: application/json; charset=UTF-8");
include ("connect.php");
$data = json_decode(file_get_contents("php://input"), true);

$check = $conn->prepare("SELECT id FROM units WHERE (district, block, unit) = (?,?,?)");
$check->bind_param("sss", $data['district'],$data['block'],$data['unit']);
$check->execute();
$result1 = $check->get_result();

if ($result1->num_rows > 0) {
    echo json_encode([
        "status" => "fail",
        "message" => "البيان موجود"
    ]);
} else {
    $stmt = $conn->prepare("INSERT INTO units (district, block, unit, space, price, notes, added_by, role, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $data['district'], $data['block'], $data['unit'], $data['space'], $data['price'], $data['notes'], $data['addedBy'],$data['role'], $data['department']);
    $stmt->execute();
    $result = $stmt->get_result();
        echo json_encode([
        "status" => "fail",
        "message" => "تم الإضافة إلى المعروض"
    ]);
}