<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'connectDB.php';
session_start(); // Start the session to access session variables

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['playlistName']) && isset($_SESSION['user_id'])) {
        $playlistName = mysqli_real_escape_string($conn, $_POST['playlistName']);
        $userId = $_SESSION['user_id']; // Get the user id from the session

        // Check if cover image is provided
        if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
            // Handle cover image upload
            $coverData = file_get_contents($_FILES['coverImage']['tmp_name']);
            $fileExtension = pathinfo($_FILES['coverImage']['name'], PATHINFO_EXTENSION);
            $coverFileName = uniqid() . '.' . $fileExtension;
            $coverPath = 'covers/' . $coverFileName;
            file_put_contents($coverPath, $coverData);
        } else {
            // Set default cover image path
            $coverPath = 'covers/noImage.jpg';
        }

        // Insert playlist data into database with user id
        $stmt = $conn->prepare("INSERT INTO playlist_info (playlist_name, playlist_cover, id_user) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $playlistName, $coverPath, $userId);
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Playlist added successfully"));
        } else {
            echo json_encode(array("error" => "Error adding playlist: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Required parameters missing or user not logged in"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>
