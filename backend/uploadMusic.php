<?php
session_start(); // Sesijas uzsākšana
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'vendor/autoload.php'; // getID3 library
include 'connectDB.php'; // Iekļauj datubāzi

// Pārbauda vai ir ielogojies
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "User not logged in"));
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        // Uzsāk getID3
        $getID3 = new getID3;

        // Augšuplādetais fails
        $fileInfo = $getID3->analyze($_FILES['file']['tmp_name']);

        // Izņem metadatus
        $songName = isset($fileInfo['tags']['id3v2']['title'][0]) ? $fileInfo['tags']['id3v2']['title'][0] : 'Unknown Title';
        $artist = isset($fileInfo['tags']['id3v2']['artist'][0]) ? $fileInfo['tags']['id3v2']['artist'][0] : 'Unknown Artist';
        $length = isset($fileInfo['playtime_string']) ? $fileInfo['playtime_string'] : '00:00';

        // Cover image
        if (isset($fileInfo['comments']['picture'][0]['data'])) {
            // Cover image atrasta
            $coverData = $fileInfo['comments']['picture'][0]['data'];
            // Faila tips
            $fileExtension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
            // Saglabā cover image
            $coverFileName = uniqid() . '.' . $fileExtension;
            $coverPath = 'covers/' . $coverFileName;
            file_put_contents($coverPath, $coverData);
        } else {
            // Nav cover image
            $coverPath = '';
        }

        // Ievieto failu uploads/ lokācijā
        $targetDirectory = "uploads/";
        $targetFileName = urlencode(basename($_FILES['file']['name']));
        $targetFile = $targetDirectory . $targetFileName;
        move_uploaded_file($_FILES['file']['tmp_name'], $targetFile);

        // Izmanto pret injekciju vaicājumu, lai pievienotu datubāzei
        $stmt = $conn->prepare("INSERT INTO music_info (info_name, info_artist, info_length, file_path, cover_path, id_user) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssi", $songName, $artist, $length, $targetFile, $coverPath, $user_id);
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Music uploaded successfully"));
        } else {
            echo json_encode(array("error" => "Error: " . $stmt->error));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "No file uploaded"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>
