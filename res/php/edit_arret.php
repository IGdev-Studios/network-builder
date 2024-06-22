<?php
// Inclure la connexion à la base de données
require_once 'db_info.php';

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $arret_id = $_POST['edit_arret_id'];
    $arret_nom = $_POST['edit_arret_nom'];
    $arret_ville = $_POST['edit_arret_ville'];

    if ($conn) {
        $sql = "UPDATE liste_arrets SET nom = ?, ville = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        
        if ($stmt) {
            $stmt->bind_param('ssi', $arret_nom, $arret_ville, $arret_id);
            $stmt->execute();
            
            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Aucune mise à jour effectuée.']);
            }
            
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur de préparation de la requête.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode de requête non supportée.']);
}

$conn->close();
?>