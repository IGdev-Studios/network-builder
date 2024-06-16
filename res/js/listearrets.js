window.onload = function(){
    getListeArrets();


  
}

// Fonction pour récupérer les données depuis la base de données via une requête HTTP
function getListeArrets() {
    // Création d'une nouvelle requête XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // Spécification de la méthode HTTP, de l'URL et de la manière asynchrone
    xhr.open('GET', './res/php/get_arrets.php', true);

    // Fonction de rappel appelée lorsque la réponse est reçue
    xhr.onload = function() {
        // Vérification du code de statut de la réponse
        if (xhr.status >= 200 && xhr.status < 300) {
            // Conversion de la réponse JSON en objet JavaScript
            var data = JSON.parse(xhr.responseText);
            
            // Utilisation des données récupérées (ex : affichage dans la console)
            console.log(data);
        } else {
            // Gestion des erreurs
            console.error('La requête a échoué. Statut de la réponse : ' + xhr.status);
        }
    };

    // Gestionnaire d'événement pour la gestion des erreurs de réseau
    xhr.onerror = function() {
        console.error('Erreur de réseau lors de la tentative de récupération des données.');
    };

    // Envoi de la requête
    xhr.send();
}



