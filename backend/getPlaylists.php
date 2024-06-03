<?php
// Set CORS policies
header("Access-Control-Allow-Origin: http://localhost:3000"); // Match this exactly to your frontend's URL
header("Access-Control-Allow-Credentials: true"); // Important for sessions to work
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Accept, Origin, Authorization");

include 'connectDB.php'; // Include your database connection file
session_start(); // Start the session to access session variables

// Check if it's a GET request and a user is logged in
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id']; // Get the user id from the session

        // Prepare SQL to select data from the playlist_info table filtered by user_id
        $stmt = $conn->prepare("SELECT playlist_id, playlist_name, playlist_cover FROM playlist_info WHERE id_user = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $playlists = [];
        while ($row = $result->fetch_assoc()) {
            $playlists[] = $row;
        }

        echo json_encode($playlists);
        $stmt->close();
    } else {
        echo json_encode(["error" => "No user logged in"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>
