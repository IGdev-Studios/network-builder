<?php
require_once 'db_info.php';

header('Content-Type: application/json');

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Erreur de connexion à la BDD: " . $conn->connect_error);
}

// Vérifier que toutes les données sont envoyées
if (isset($_POST['add_arret_nom']) && isset($_POST['add_arret_ville'])) {
    $nom = $_POST['add_arret_nom'];
    $ville = $_POST['add_arret_ville'];
// INSERT INTO `liste_arrets` (`id`, `nom`, `ville`, `lignes`) VALUES (NULL, 'Madeleine', 'Berny', NULL);
    // Préparer et exécuter la requête SQL
    $stmt = $conn->prepare("INSERT INTO liste_arrets (id, nom, ville) VALUES (NULL, ?, ?)");
    $stmt->bind_param("ss", $nom, $ville);

    if ($stmt->execute()) {
        echo "Arrêt ajouté avec succès";
    } else {
        echo "Erreur lors de l'ajout de la ligne: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Données manquantes";
}

$conn->close();
?>