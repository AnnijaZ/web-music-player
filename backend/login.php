<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Adjust if necessary
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Origin, Accept, X-CSRF-Token");

include 'connectDB.php';

session_start(); // Ensure session is started correctly

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflighted request
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? mysqli_real_escape_string($conn, $_POST['username']) : '';
    $password = isset($_POST['password']) ? mysqli_real_escape_string($conn, $_POST['password']) : '';

    if (empty($username) || empty($password)) {
        echo json_encode(array("success" => false, "message" => "Both fields are required"));
        exit;
    }

    $query = "SELECT * FROM user_info WHERE user_name = '$username'";
    $result = mysqli_query($conn, $query);
    
    if ($user = mysqli_fetch_assoc($result)) {
        if ($user['user_status']) { // Check if the account is active
            if (password_verify($password, $user['user_password'])) {
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $username;
                echo json_encode(array("success" => true, "message" => "Login successful"));
            } else {
                echo json_encode(array("success" => false, "message" => "Incorrect password"));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "Account is deactivated. Contact support for more info."));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "User not found"));
    }
    
    mysqli_close($conn);
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
