<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Atļauj piekļuvi no konkrētas izcelsmes
header("Access-Control-Allow-Credentials: true"); // Atļauj izmantot sīkdatnes
header("Access-Control-Allow-Methods: GET"); // Atļauj GET metodi
header("Access-Control-Allow-Headers: Content-Type"); // Atļauj Content-Type galveni
header('Content-Type: application/json'); // Norāda, ka atbildes veids ir JSON

include 'connectDB.php'; // Iekļauj datubāzes savienojuma failu
session_start(); // Uzsāk sesiju

// Pārbauda, vai lietotājs ir ielogojies
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "User not logged in")); // Atgriež kļūdas ziņojumu, ja lietotājs nav ielogojies
    exit; // Pārtrauc skripta izpildi
}

$user_id = $_SESSION['user_id']; // Iegūst lietotāja ID no sesijas

// Pārbauda, vai pieprasījums ir GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['playlistId'])) { // Pārbauda, vai ir norādīts playlistId
        $playlistId = mysqli_real_escape_string($conn, $_GET['playlistId']); // Attīra playlistId

        // SQL vaicājums, lai iegūtu dziesmas no konkrētā atskaņošanas saraksta
        $sql = "SELECT mi.info_id AS song_id, mi.info_name AS song_title, mi.info_artist AS artist, mi.info_length AS duration, mi.file_path AS file_path, mi.cover_path AS cover_path
                FROM playlist_songs ps
                JOIN music_info mi ON ps.song_id = mi.info_id
                WHERE ps.playlist_id = ? AND ps.user_id = ?";
        $stmt = $conn->prepare($sql); // Sagatavo SQL vaicājumu
        $stmt->bind_param("ii", $playlistId, $user_id); // Piesaista parametrus
        $stmt->execute(); // Izpilda vaicājumu
        $result = $stmt->get_result(); // Iegūst rezultātu

        $data = []; // Inicializē datu masīvu
        while ($row = $result->fetch_assoc()) { // Iterē cauri rezultātu rindām
            $data[] = $row; // Pievieno rindu datu masīvam
        }

        echo json_encode($data); // Atgriež datus JSON formātā
        $stmt->close(); // Aizver sagatavoto vaicājumu
    } else {
        echo json_encode(array("error" => "Missing playlistId parameter")); // Atgriež kļūdas ziņojumu, ja trūkst playlistId
    }
} else {
    echo json_encode(array("error" => "Invalid request method")); // Atgriež kļūdas ziņojumu, ja pieprasījuma metode nav GET
}

$conn->close(); // Aizver datubāzes savienojumu
?>

