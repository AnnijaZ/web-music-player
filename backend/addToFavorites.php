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

    if (isset($_SESSION['user_id']) && isset($data['songId'])) {
        $user_id = $_SESSION['user_id'];
        $song_id = $data['songId'];
        $isFavorite = $data['isFavorite'];

        if ($isFavorite) {
            $query = "DELETE FROM favorites WHERE user_id = ? AND song_id = ?";
        } else {
            $query = "INSERT INTO favorites (user_id, song_id) VALUES (?, ?)";
        }

        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $user_id, $song_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => $isFavorite ? 'Removed from favorites' : 'Added to favorites']);
        } else {
            echo json_encode(['message' => 'Failed to update favorites']);
        }
    } else {
        echo json_encode(['message' => 'Invalid data provided']);
    }
} else {
    echo json_encode(['message' => 'Invalid request method']);
}

$conn->close();
?>
