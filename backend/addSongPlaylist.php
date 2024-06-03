<?php
// Allow requests from http://localhost:3000
header("Access-Control-Allow-Origin: http://localhost:3000");
// Allow credentials
header("Access-Control-Allow-Credentials: true");
// Allow the POST method
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Allow the Content-Type header
header("Access-Control-Allow-Headers: Content-Type");
// Set the content type to JSON
header('Content-Type: application/json');

include 'connectDB.php'; // Include your database connection file

session_start(); // Start the session

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("success" => false, "message" => "User not logged in"));
    exit; // Exit if not logged in
}

$user_id = $_SESSION['user_id']; // Get user ID from session

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug: Log the received POST data
    $postData = json_decode(file_get_contents('php://input'), true);

    // Check if required parameters are provided
    if (isset($postData["playlistId"]) && isset($postData["songId"])) {
        // Sanitize input to prevent SQL injection
        $song_id = mysqli_real_escape_string($conn, $postData["songId"]);
        $playlist_id = mysqli_real_escape_string($conn, $postData["playlistId"]);

        // Update the playlist_id for the given song_id in the playlist_info table
        $sql = "UPDATE music_info SET id_playlist = '$playlist_id' WHERE info_id = '$song_id' AND id_user = '$user_id'";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            // If update is successful, return success message
            echo json_encode(array("success" => true, "message" => "Song added to playlist successfully"));
        } else {
            // If update fails, return error message
            echo json_encode(array("success" => false, "message" => "Failed to add song to playlist"));
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
