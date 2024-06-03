<?php
session_start(); // Start the session to access session variables

// Set CORS policies (adjust as necessary for security)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'connectDB.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id'])) {
        // Get user ID from session
        $userId = $_SESSION['user_id'];

        // Query to select all data for the logged in user
        $sql = "SELECT user_name, user_created FROM user_info WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows > 0) {
            // Fetch associative array
            $data = $result->fetch_assoc();
            // Return the data as JSON
            echo json_encode($data);
        } else {
            // If query fails or no user found, return an error message
            echo json_encode(array("error" => "Failed to retrieve user data or no user exists."));
        }
    } else {
        // If no user ID in session, return an error message
        echo json_encode(array("error" => "No user logged in."));
    }
} else {
    // If request method is not GET, return an error message
    echo json_encode(array("error" => "Invalid request method"));
}

$conn->close();
?>
