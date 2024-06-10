<?php
session_start(); // Uzsāk sesiju
header("Access-Control-Allow-Origin: http://localhost:3000"); // Atļauj piekļuvi no norādītās izcelsmes
header("Access-Control-Allow-Credentials: true"); // Atļauj sūtīt sīkdatnes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Atļauj norādītās metodes
header("Access-Control-Allow-Headers: Content-Type"); // Atļauj norādītās galvenes

require_once 'vendor/autoload.php'; // Iekļauj getID3 bibliotēku
include 'connectDB.php'; // Iekļauj datubāzes savienojuma failu

// Pārbauda, vai lietotājs ir ielogojies
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("error" => "User not logged in")); // Atgriež kļūdas ziņojumu, ja lietotājs nav ielogojies
    exit;
}

$user_id = $_SESSION['user_id']; // Iegūst lietotāja ID no sesijas

if ($_SERVER['REQUEST_METHOD'] === 'POST') { // Pārbauda, vai pieprasījums ir POST
    if (isset($_FILES['file'])) { // Pārbauda, vai fails ir augšupielādēts
        $file = $_FILES['file'];
        $fileSize = $file['size']; // Iegūst faila izmēru
        $fileType = mime_content_type($file['tmp_name']); // Iegūst faila tipu
        
        // Definē maksimālo faila izmēru (piemēram, 10 MB)
        $maxFileSize = 10 * 1024 * 1024;
        $allowedTypes = ['audio/mpeg', 'audio/mp3']; // Atļautie failu tipi

        if (!in_array($fileType, $allowedTypes)) { // Pārbauda, vai faila tips ir atļauts
            echo json_encode(array("error" => "Invalid file type. Only MP3 files are allowed.")); // Atgriež kļūdas ziņojumu, ja fails nav atļauts
            exit;
        }

        if ($fileSize > $maxFileSize) { // Pārbauda, vai fails nepārsniedz maksimālo izmēru
            echo json_encode(array("error" => "File size exceeds the limit of 10 MB.")); // Atgriež kļūdas ziņojumu, ja fails ir pārāk liels
            exit;
        }

        // Inicializē getID3
        $getID3 = new getID3;

        // Analizē augšupielādēto failu
        $fileInfo = $getID3->analyze($file['tmp_name']);

        // Iegūst metadatus
        $songName = isset($fileInfo['tags']['id3v2']['title'][0]) ? $fileInfo['tags']['id3v2']['title'][0] : 'Unknown Title';
        $artist = isset($fileInfo['tags']['id3v2']['artist'][0]) ? $fileInfo['tags']['id3v2']['artist'][0] : 'Unknown Artist';
        $length = isset($fileInfo['playtime_string']) ? $fileInfo['playtime_string'] : '00:00';

        // Apstrādā vāka attēlu
        if (isset($fileInfo['comments']['picture'][0]['data'])) { // Pārbauda, vai ir vāka attēls
            // Vāka attēls atrasts
            $coverData = $fileInfo['comments']['picture'][0]['data'];
            // Iegūst faila paplašinājumu
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            // Saglabā vāka attēlu
            $coverFileName = uniqid() . '.' . $fileExtension;
            $coverPath = 'covers/' . $coverFileName;
            file_put_contents($coverPath, $coverData);
        } else {
            // Nav vāka attēla
            $coverPath = '';
        }

        // Pārvieto augšupielādēto failu uz uploads/ direktoriju
        $targetDirectory = "uploads/";
        $targetFileName = urlencode(basename($file['name']));
        $targetFile = $targetDirectory . $targetFileName;
        move_uploaded_file($file['tmp_name'], $targetFile);

        // Izmanto sagatavotu paziņojumu, lai ievietotu datubāzē
        $stmt = $conn->prepare("INSERT INTO music_info (info_name, info_artist, info_length, file_path, cover_path, id_user) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssi", $songName, $artist, $length, $targetFile, $coverPath, $user_id);
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Music uploaded successfully")); // Atgriež veiksmes ziņojumu
        } else {
            echo json_encode(array("error" => "Error: " . $stmt->error)); // Atgriež kļūdas ziņojumu
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "No file uploaded")); // Atgriež kļūdas ziņojumu, ja fails nav augšupielādēts
    }
} else {
    echo json_encode(array("error" => "Invalid request method")); // Atgriež kļūdas ziņojumu, ja pieprasījuma metode nav POST
}
?>

