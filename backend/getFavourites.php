<?php
session_start(); // Start the session to access session variables

// Set CORS policies (adjust as necessary for security)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Accept, Origin, Authorization");
header('Content-Type: application/json');

include 'connectDB.php'; // Include your database connection file

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT info_id AS song_id, 
            info_name AS song_title, 
            info_artist AS artist, 
            info_length AS duration, 
            file_path AS file_path, 
            cover_path AS cover_path,
            is_favorite
            FROM music_info
            WHERE is_favorite = 1 AND id_user = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $favorites = [];
    while ($row = $result->fetch_assoc()) {
        $favorites[] = $row;
    }

    echo json_encode($favorites);
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
