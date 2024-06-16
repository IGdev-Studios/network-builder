window.onload = function(){
    getListeArrets();

    // Code pour envoyer le formulaire add_form à la DB et recevoir confirmation
    document.getElementById('add_form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        
        const formData = new FormData(event.target);

        fetch('./res/php/add_arret.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Récupère la réponse en texte
        .then(data => {
            console.log('Réponse du serveur:', data); // Affiche la réponse dans la console
            if (data == "Arrêt ajouté avec succès") {
                valid_add_form()
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });
    
  
}
let liste_arrets

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
            reload_arrets(data)
            liste_arrets = data
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

function reload_arrets(arrets) {
    document.querySelector("#arret_list tbody").innerHTML = ""
    arrets.forEach(a => {
        document.querySelector("#arret_list tbody").innerHTML += `<tr><td>${a.id}</td><td>${a.nom}</td><td>${a.ville}</td></tr>`
    });    
}

function valid_add_form(noReload = false) {
    document.getElementById("add_form_submit").innerHTML = '<span class="notif_ok">Arrêt ajouté avec succès !</span>'
    window.setTimeout(()=>{
        noReload?document.getElementById("add_form_submit").innerHTML = '<input type="submit">':location.reload()
    },3000)
}
function valid_edit_form(noReload = false) {
    document.getElementById("edit_form_submit").innerHTML = '<span class="notif_ok">Arrêt modifié avec succès !</span>'
    window.setTimeout(()=>{noReload?document.getElementById("edit_form_submit").innerHTML = '<input type="submit">':location.reload()},3000)
}


