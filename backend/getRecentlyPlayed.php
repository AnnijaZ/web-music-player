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

    $query = "SELECT mi.info_id AS song_id, 
                     mi.info_name AS song_title, 
                     mi.info_artist AS artist, 
                     mi.file_path, 
                     mi.cover_path
              FROM recent_songs rs
              JOIN music_info mi ON rs.song_id = mi.info_id
              WHERE rs.user_id = ?
              ORDER BY rs.played_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $recentSongs = [];
    while ($row = $result->fetch_assoc()) {
        $recentSongs[] = $row;
    }

    echo json_encode($recentSongs);
} else {
    echo json_encode([]);
}

$conn->close();
?>
