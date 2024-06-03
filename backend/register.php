<?php
// Specify the exact origin instead of '*'
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header('Content-Type: application/json');

include 'connectDB.php'; // Ensure you have a connectDB.php that properly connects to your database.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username']) && isset($data['password'])) {
        $username = mysqli_real_escape_string($conn, $data['username']);
        $password = $data['password'];

        // Check if username already exists
        $checkUserStmt = $conn->prepare("SELECT * FROM user_info WHERE user_name = ?");
        $checkUserStmt->bind_param("s", $username);
        $checkUserStmt->execute();
        $result = $checkUserStmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Username already exists.']);
            exit;
        }

        // Check password length and presence of an uppercase letter
        if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password)) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long and include at least one uppercase letter.']);
            exit;
        }

        // Hash the password before storing it in the database
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Prepare SQL statement to insert the new user
        $stmt = $conn->prepare("INSERT INTO user_info (user_name, user_password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $hashed_password);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registration successful.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed. ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Username or password not provided.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>
