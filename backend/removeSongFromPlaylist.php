<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Adjust to your frontend URL
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'connectDB.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Read and decode the raw input
    $rawInput = file_get_contents("php://input");
    $delete_vars = json_decode($rawInput, true);
    error_log("Raw input: " . $rawInput);
    error_log("Parsed input: " . json_encode($delete_vars));

    $songId = isset($delete_vars['songId']) ? $delete_vars['songId'] : null;
    $playlistId = isset($delete_vars['playlistId']) ? $delete_vars['playlistId'] : null;
    $userId = isset($delete_vars['userId']) ? $delete_vars['userId'] : null;

    if ($songId && $playlistId && $userId) {
        $stmt = $conn->prepare("DELETE FROM playlist_songs WHERE song_id = ? AND playlist_id = ? AND user_id = ?");
        $stmt->bind_param("iii", $songId, $playlistId, $userId);

        if ($stmt->execute()) {
            echo json_encode(array("message" => "Song removed from playlist successfully"));
        } else {
            echo json_encode(array("error" => "Error removing song from playlist: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Required parameters missing"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}

$conn->close();
?>
