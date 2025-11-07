<?php
header("Access-Control-Allow-Original: *");
header("Content-Type: application/json; charset=UTF-8");
include ("connect.php");
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if  (empty($data['newName']) || empty($data['newPhone']) || empty($data['newOrder'])) {
    echo json_encode([
        "status" => "failed",
        "message" => "املأ الخانات المطلوبة "
    ]);
} else {
    $check = $conn->prepare("SELECT id FROM clients WHERE (name, phone, client_order, notes, added_by, team, department, state) = (?,?,?,?,?,?,?,?)");
    $check->bind_param("ssssssss",
        $data['newName'],
        $data['newPhone'],
        $data['newOrder'],
        $data['newNotes'],
        $data['newUser'],
        $data['newTeam'],
        $data['newDepartment'],
        $data['newState']
    );
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode([
        "status" => "failed",
        "message" => "البيان متسجل"
    ]); 
    } else {
        $stmt1 = $conn->prepare("INSERT INTO edited_clients (id, name, phone, client_order, notes, added_by,team, department, state) SELECT id, name, phone, client_order, notes, added_by, team, department, state FROM clients WHERE phone = ?");
        $stmt1->bind_param("s", $data['oldPhone']);
        $stmt1->execute();
        $result1 = $stmt1->get_result();

        $stmt2 = $conn->prepare("UPDATE clients SET name = ?,phone = ?,client_order = ?,notes = ?,added_by = ?, team = ?,department = ?, state = ? WHERE id = ?");
        $stmt2->bind_param("sssssssss",
            $data['newName'],
            $data['newPhone'],
            $data['newOrder'],
            $data['newNotes'],
            $data['newUser'],
            $data['newTeam'],
            $data['newDepartment'],
            $data['newState'],
            $data['oldId']
        );
        $stmt2->execute();
        $result2 = $stmt2->get_result();

        echo json_encode([
            "status" => "success",
            "message" => "تم التعديل , سيظهر التحديث بعد إعادة تحميل الصفحة"
        ]);
    }
}