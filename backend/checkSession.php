<?php
session_start(); // Start the session

header("Access-Control-Allow-Origin: http://localhost:3000"); // Adjust if necessary
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Check if the user_id is set in the session
if (isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "isLoggedIn" => true,
        "userId" => $_SESSION['user_id'] // Sending back the user ID stored in session
    ));
} else {
    echo json_encode(array(
        "isLoggedIn" => false
    ));
}
?>
