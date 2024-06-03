<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'connectDB.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($_GET['songId'])) {
        $songId = mysqli_real_escape_string($conn, $_GET['songId']);
        
        // Update id_playlist of the corresponding music_info record to 0
        $stmt = $conn->prepare("UPDATE music_info SET id_playlist = NULL WHERE info_id = ?");
        $stmt->bind_param("i", $songId);
            
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
?>
