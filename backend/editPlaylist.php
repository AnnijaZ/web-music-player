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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['playlistName'])) {
        $playlistName = mysqli_real_escape_string($conn, $_POST['playlistName']);

        // Set default cover image path
        $coverPath = 'covers/noImage.jpg';

        // Handle cover image if provided
        if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
            // Handle cover image upload
            $coverData = file_get_contents($_FILES['coverImage']['tmp_name']);
            $fileExtension = pathinfo($_FILES['coverImage']['name'], PATHINFO_EXTENSION);
            $coverFileName = uniqid() . '.' . $fileExtension;
            $coverPath = 'covers/' . $coverFileName;
            file_put_contents($coverPath, $coverData);
        }

        // If editing, ensure playlist ID is provided
        if (isset($_POST['playlistId'])) {
            $playlistId = mysqli_real_escape_string($conn, $_POST['playlistId']);
            $stmt = $conn->prepare("UPDATE playlist_info SET playlist_name = ?, playlist_cover = ? WHERE playlist_id = ? AND id_user = ?");
            $stmt->bind_param("ssii", $playlistName, $coverPath, $playlistId, $user_id);
        } else {
            // Insert playlist data into database
            $stmt = $conn->prepare("INSERT INTO playlist_info (playlist_name, playlist_cover, id_user) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $playlistName, $coverPath, $user_id);
        }

        if ($stmt->execute()) {
            echo json_encode(array("message" => "Playlist updated successfully"));
        } else {
            echo json_encode(array("error" => "Error updating playlist: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Required parameters missing"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>
