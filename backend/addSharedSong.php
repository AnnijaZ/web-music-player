<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'connectDB.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_SESSION['user_id'])) {
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = $_SESSION['user_id'];
        $song_id = $data['songId'];

        // Insert the shared song record into user's songs (if necessary, you can adjust this to fit your logic)
        $query = "INSERT INTO shared_songs (receiver_id, song_id, sender_id, shared_at) VALUES (?, ?, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $user_id, $song_id, $user_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add song']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
