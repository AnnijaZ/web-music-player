<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'connectDB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    $query = "UPDATE user_info SET user_status = FALSE WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Account has been deactivated."));
    } else {
        echo json_encode(array("success" => false, "message" => "Failed to deactivate account."));
    }
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "No user logged in or invalid request."));
}
?>
