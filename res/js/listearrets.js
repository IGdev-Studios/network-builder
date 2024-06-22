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

    document.getElementById('edit_form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
    
        const arretId = document.getElementById('edit_arret_id').value;
        const arretNom = document.getElementById('edit_arret_nom').value;
        const arretVille = document.getElementById('edit_arret_ville').value;
    
        const formData = new FormData();
        formData.append('edit_arret_id', arretId);
        formData.append('edit_arret_nom', arretNom);
        formData.append('edit_arret_ville', arretVille);
    
        fetch('res/php/edit_arret.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the row in the HTML table
                const row = document.querySelector(`tr[data-arret-id="${arretId}"]`);
                row.querySelector('.arret-nom').textContent = arretNom;
                row.querySelector('.arret-ville').textContent = arretVille;
                valid_edit_form(true)
            } else {
                alert('Erreur lors de la mise à jour de l\'arrêt.');
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
    
  
}
// let liste_arrets
let timoutTime = 2000

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
        document.querySelector("#arret_list tbody").innerHTML += `<tr data-arret-id="${a.id}"><td class="arret-id">${a.id}</td> <td class="arret-nom">${a.nom}</td><td class="arret-ville">${a.ville}</td><td class="arret-boutons"><button onclick="fill_edit_form(this)"><img src="./res/svg/pencil.svg" alt="Editer" height="20"></button><button onclick="delete_arret(this)"><img src="./res/svg/delete.svg" alt="Supprimer" height="20"></button></td></tr>`
    });    
}

function fill_edit_form(button) {
    // Trouver la ligne du tableau
    let row = button.closest('tr');
    // Extraire les données
    let id = row.cells[0].innerText;
    let nom = row.cells[1].innerText;
    let ville = row.cells[2].innerText;
    
    // Remplir le formulaire
    document.getElementById('edit_arret_id').value = id;
    document.getElementById('edit_arret_nom').value = nom;
    document.getElementById('edit_arret_ville').value = ville;

    // Afficher le formulaire (optionnel si vous utilisez du CSS pour afficher/masquer)
    // document.getElementById('edit_form').style.display = 'block';
}

function valid_add_form(noReload = false) {
    document.getElementById("add_form_submit").innerHTML = '<span class="notif_ok">Arrêt ajouté avec succès !</span>'
    window.setTimeout(()=>{
        noReload?document.getElementById("add_form_submit").innerHTML = '<input type="submit">':location.reload()
    },timoutTime)
}
function valid_edit_form(noReload = false) {
    document.getElementById("edit_form_submit").innerHTML = '<span class="notif_ok">Arrêt modifié avec succès !</span>'
    document.getElementById("edit_form").reset()
    window.setTimeout(()=>{
        noReload?document.getElementById("edit_form_submit").innerHTML = '<input type="submit">':location.reload()
    },timoutTime)
}

function delete_arret(button) {
    if (confirm("Voulez-vous vraiment supprimer cet arrêt?")) {
        // Trouver la ligne du tableau
        let row = button.closest('tr');
        // Extraire l'ID
        let id = row.cells[0].innerText;

        // Requête AJAX pour supprimer de la base de données
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "./res/php/delete_arret.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText === 'success') {
                    // Supprimer la ligne du tableau
                    row.innerHTML = '<td></td><td><span class="notif_ok">Arrêt supprimé avec succès !</span></td>'
                    window.setTimeout(()=>{
                        row.parentNode.removeChild(row);
                    }, timoutTime)
                } else {
                    alert("Erreur lors de la suppression de l'arrêt.");
                }
            }
        };
        xhr.send("id=" + id);
    }
}