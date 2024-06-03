<?php
// Specify the exact origin instead of '*'
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header('Content-Type: application/json');

include 'connectDB.php'; // Ensure you have a connectDB.php that properly connects to your database.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();

    // Ensure the user is logged in
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['currentPassword']) && isset($data['newPassword'])) {
        $currentPassword = $data['currentPassword'];
        $newPassword = $data['newPassword'];

        // Validate new password length and presence of an uppercase letter
        if (strlen($newPassword) < 8 || !preg_match('/[A-Z]/', $newPassword)) {
            echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters long and include at least one uppercase letter.']);
            exit;
        }

        // Fetch the user's current hashed password from the database
        $stmt = $conn->prepare("SELECT user_password FROM user_info WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->bind_result($stored_password);
        $stmt->fetch();
        $stmt->close();

        // Verify the current password
        if (!password_verify($currentPassword, $stored_password)) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
            exit;
        }

        // Hash the new password before storing it in the database
        $hashed_new_password = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update the user's password in the database
        $updateStmt = $conn->prepare("UPDATE user_info SET user_password = ? WHERE user_id = ?");
        $updateStmt->bind_param("si", $hashed_new_password, $user_id);
        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Password changed successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Password change failed. ' . $updateStmt->error]);
        }
        $updateStmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Required data not provided.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>
