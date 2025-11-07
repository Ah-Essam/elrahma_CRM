<?php
header("Access-Control-Allow-Original: *");
header("Content-Type: application/json; charset=UTF-8");
include ("connect.php");
$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $data['userName']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if ($data['userPass'] === $user['password']) {
        echo json_encode([
            "status" => "success",
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "status" => "fail",
            "message" => "كلمة السر غير صحيحة"
        ]);
    }
} else {
    echo json_encode([
        "status" => "fail",
        "message" => "اسم المستخدم غير صحيح"
    ]);
}