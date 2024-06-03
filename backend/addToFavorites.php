<?php
// Specify the exact origin
header("Access-Control-Allow-Origin: http://localhost:3000");
// Allow credentials
header("Access-Control-Allow-Credentials: true");
// Allow the POST method
header("Access-Control-Allow-Methods: POST, OPTIONS");
// Allow the Content-Type header
header("Access-Control-Allow-Headers: Content-Type");
// Set the content type to JSON
header('Content-Type: application/json');

include 'connectDB.php'; // Include your database connection file
session_start(); // Start the session

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "User not logged in"));
    exit; // Exit if not logged in
}

$user_id = $_SESSION['user_id']; // Get user ID from session

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve JSON data from the request body
    $postData = json_decode(file_get_contents('php://input'), true);

    // Check if required parameters are provided
    if (isset($postData["songId"]) && isset($postData["isFavorite"])) {
        // Sanitize input to prevent SQL injection
        $songId = mysqli_real_escape_string($conn, $postData["songId"]);
        // Negate the value of isFavorite to set is_favorite to the opposite value
        $isFavorite = $postData["isFavorite"] ? 0 : 1; // Convert boolean to integer (0 for true, 1 for false)

        // Update the is_favorite column for the given songId in the music_info table
        $sql = "UPDATE music_info SET is_favorite = '$isFavorite' WHERE info_id = '$songId' AND id_user = '$user_id'";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            // If update is successful, return success message
            echo json_encode(array("success" => true, "message" => "Favorite status updated successfully"));
        } else {
            // If update fails, return error message
            echo json_encode(array("success" => false, "message" => "Failed to update favorite status"));
        }
    } else {
        // If required parameters are not provided, return error message
        echo json_encode(array("success" => false, "message" => "Required parameters missing"));
    }
} else {
    // If request method is not POST, return an error message
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
