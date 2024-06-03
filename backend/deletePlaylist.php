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

    $playlistId = isset($delete_vars['playlistId']) ? $delete_vars['playlistId'] : null;

    if ($playlistId) {
        $stmt = $conn->prepare("DELETE FROM playlist_info WHERE playlist_id = ?");
        $stmt->bind_param("i", $playlistId);
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Playlist deleted successfully"));
        } else {
            echo json_encode(array("error" => "Error deleting playlist: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Playlist ID is required"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>
