<?php
header("Access-Control-Allow-Original: *");
header("Content-Type: application/json; charset=UTF-8");
include ("connect.php");
$data = json_decode(file_get_contents("php://input"), true);

$check = $conn->prepare("SELECT * FROM clients WHERE phone = ?");
$check->bind_param("s", $data['clientPhone']);
$check->execute();
$result1 = $check->get_result();

if ($result1->num_rows > 0) {
    echo json_encode([
        "status" => "fail",
        "message" => "العميل متسجل"
    ]);
} else {
    if (empty($data['clientName']) || empty($data['clientPhone']) || empty($data['clientOrder'])) {
        echo json_encode([
        "status" => "fail",
        "message" => "wrong"
    ]);
    } else {
        $stmt = $conn->prepare("INSERT INTO clients (name, phone, client_order, notes, added_by, department, team) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $data['clientName'], $data['clientPhone'], $data['clientOrder'], $data['clientNotes'], $data['user'], $data['department'], $data['team']);
        $stmt->execute();
        $result = $stmt->get_result();
            echo json_encode([
            "status" => "fail",
            "message" => "تم إضافة العميل"
        ]);
    }
}