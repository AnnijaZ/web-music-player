<?php
session_start(); // Sessijas uzsākšana, lai piekļūtu sesijas mainīgajiem

header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'connectDB.php'; // Datubāzes savienojums

// Pārbauda vai ir ielogojies lietotājs
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "User not logged in"));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_SESSION['user_id'];

    $sql = "SELECT info_id AS song_id, 
    info_name AS song_title, 
    info_artist AS artist, 
    info_length AS duration, 
    file_path AS file_path, 
    cover_path AS cover_path,
    is_favorite
    FROM music_info
    WHERE id_user = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $data = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($data);
    } else {
        echo json_encode(array("error" => "Failed to retrieve data from the database"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>
