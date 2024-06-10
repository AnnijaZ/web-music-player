<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'connectDB.php';

session_start();

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $query = "SELECT s.info_id AS song_id, s.info_name AS song_title, s.info_artist AS artist, s.file_path, s.cover_path
              FROM shared_songs ss
              JOIN music_info s ON ss.song_id = s.info_id
              WHERE ss.receiver_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $sharedSongs = [];
    while ($row = $result->fetch_assoc()) {
        $sharedSongs[] = $row;
    }

    echo json_encode($sharedSongs);
} else {
    echo json_encode([]);
}

$conn->close();
?>
