<?php
require_once 'db_info.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer l'ID depuis la requête
    $id = intval($_POST['id']);
    
    // Connexion à la base de données
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Vérifier la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Préparer et exécuter la requête de suppression
    $stmt = $conn->prepare("DELETE FROM liste_arrets WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }
    
    $stmt->close();
    $conn->close();
}
?>