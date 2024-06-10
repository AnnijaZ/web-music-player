<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'connectDB.php';

session_start();

$data = json_decode(file_get_contents("php://input"), true);

if (isset($_SESSION['user_id']) && isset($data['song_id'])) {
    $user_id = $_SESSION['user_id'];
    $song_id = $data['song_id'];

    // Check if the song is already in the recent_songs table for this user
    $checkQuery = "SELECT * FROM recent_songs WHERE user_id = ? AND song_id = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("ii", $user_id, $song_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // If the song is already in the table, update the played_at timestamp
        $updateQuery = "UPDATE recent_songs SET played_at = NOW() WHERE user_id = ? AND song_id = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ii", $user_id, $song_id);
        $updateStmt->execute();
    } else {
        // If the song is not in the table, insert it
        $insertQuery = "INSERT INTO recent_songs (user_id, song_id, played_at) VALUES (?, ?, NOW())";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("ii", $user_id, $song_id);
        $insertStmt->execute();
    }

    // Limit the number of recent songs to 15
    $limitQuery = "DELETE FROM recent_songs WHERE user_id = ? AND song_id NOT IN (
                   SELECT song_id FROM (
                       SELECT song_id FROM recent_songs WHERE user_id = ? ORDER BY played_at DESC LIMIT 15
                   ) as subquery)";
    $limitStmt = $conn->prepare($limitQuery);
    $limitStmt->bind_param("ii", $user_id, $user_id);
    $limitStmt->execute();

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in or song_id missing']);
}

$conn->close();
?>
