<?php
require_once 'db_info.php';

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

// Requête SQL pour récupérer le contenu de la table (à remplacer par votre propre requête)
$sql = "SELECT * FROM `liste_lignes`";
$result = $conn->query($sql);

// Vérification s'il y a des résultats
if ($result->num_rows > 0) {
    // Création d'un tableau associatif pour stocker les données
    $data = array();

    // Récupération des données de chaque ligne et les stocker dans le tableau
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Conversion du tableau associatif en format JSON et affichage
    echo json_encode($data);
} else {
    echo json_encode("0 résultats");
}

// Fermeture de la connexion
$conn->close();
?>
