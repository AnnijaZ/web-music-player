<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Specify the exact origin
header("Access-Control-Allow-Credentials: true"); // Allow credentials
header("Access-Control-Allow-Methods: GET"); // Allow only GET method
header("Access-Control-Allow-Headers: Content-Type"); // Allow only Content-Type header
header('Content-Type: application/json'); // Set the content type to JSON

include 'connectDB.php'; // Include your database connection file
session_start(); // Start the session

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "User not logged in"));
    exit; // Exit if not logged in
}

$user_id = $_SESSION['user_id']; // Get user ID from session

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['playlistId'])) {
        $playlistId = mysqli_real_escape_string($conn, $_GET['playlistId']);

        // SQL query to select songs from the specified playlist and belonging to the logged-in user
        $sql = "SELECT music_info.info_id AS song_id, 
                        music_info.info_name AS song_title, 
                        music_info.info_artist AS artist, 
                        music_info.info_length AS duration, 
                        music_info.file_path AS file_path, 
                        music_info.cover_path AS cover_path 
                FROM music_info
                WHERE music_info.id_playlist = ? AND music_info.id_user = ?";
                
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
            echo json_encode(array("error" => "Database error"));
            exit;
        }

        $stmt->bind_param("ii", $playlistId, $user_id); // Bind playlistId and user_id to the query
        if (!$stmt->execute()) {
            error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
            echo json_encode(array("error" => "Database error"));
            exit;
        }

        $result = $stmt->get_result();
        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($data);
        } else {
            error_log("Get result failed: (" . $stmt->errno . ") " . $stmt->error);
            echo json_encode(array("error" => "Failed to retrieve data from the database"));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Missing playlistId parameter"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

?>
