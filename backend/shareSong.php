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

    if (isset($_SESSION['user_id']) && isset($data['song_id']) && isset($data['receiver_id'])) {
        $user_id = $_SESSION['user_id'];
        $song_id = $data['song_id'];
        $receiver_id = $data['receiver_id'];

        // Insert into shared_songs table
        $query = "INSERT INTO shared_songs (song_id, sender_id, receiver_id, shared_at) VALUES (?, ?, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $song_id, $user_id, $receiver_id);
        $stmt->execute();

        // Insert into notifications table
        $notification_query = "INSERT INTO notifications (user_id, song_id, message, created_at) VALUES (?, ?, ?, NOW())";
        $message = "User $user_id shared a song with you.";
        $notification_stmt = $conn->prepare($notification_query);
        $notification_stmt->bind_param("iis", $receiver_id, $song_id, $message);
        $notification_stmt->execute();

        if ($stmt->affected_rows > 0 && $notification_stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Song shared successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to share song']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid data provided']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
