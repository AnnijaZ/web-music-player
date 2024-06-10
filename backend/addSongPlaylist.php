<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'connectDB.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($_SESSION['user_id']) && isset($data['songId']) && isset($data['playlistId'])) {
        $user_id = $_SESSION['user_id'];
        $song_id = $data['songId'];
        $playlist_id = $data['playlistId'];

        // Check if the song is already in the playlist
        $check_query = "SELECT * FROM playlist_songs WHERE user_id = ? AND playlist_id = ? AND song_id = ?";
        $check_stmt = $conn->prepare($check_query);
        $check_stmt->bind_param("iii", $user_id, $playlist_id, $song_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();

        if ($check_result->num_rows > 0) {
            echo json_encode(['message' => 'This song is already in this playlist']);
        } else {
            // Insert the song into the playlist
            $query = "INSERT INTO playlist_songs (user_id, playlist_id, song_id) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("iii", $user_id, $playlist_id, $song_id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Song added to playlist successfully']);
            } else {
                echo json_encode(['message' => 'Failed to add song to playlist']);
            }
        }
    } else {
        echo json_encode(['message' => 'Invalid data provided']);
    }
} else {
    echo json_encode(['message' => 'Invalid request method']);
}

$conn->close();
?>
