<?php
header("Access-Control-Allow-Origin: http://localhost:3000");  // Adjust if your front-end origin is different
header("Access-Control-Allow-Methods: POST, OPTIONS");  // Ensure POST is allowed
header("Access-Control-Allow-Credentials: true");  // Essential for cookies, authorization headers with HTTPS 
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Origin, Accept, X-CSRF-Token");

session_start();
if (isset($_SESSION['user_id'])) {
    // Clear session variables
    session_unset();
    // Destroy the session
    session_destroy();
    echo json_encode(array("success" => true, "message" => "Logged out successfully"));
} else {
    echo json_encode(array("success" => false, "message" => "No active session"));
}
