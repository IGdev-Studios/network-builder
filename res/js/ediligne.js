window.onload = function(){
    getListeLignes()


}



let ListeLignes
function getListeLignes() {
    // Création d'une nouvelle requête XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // Spécification de la méthode HTTP, de l'URL et de la manière asynchrone
    xhr.open('GET', './res/php/get_lignes.php', true);

    // Fonction de rappel appelée lorsque la réponse est reçue
    xhr.onload = function() {
        // Vérification du code de statut de la réponse
        if (xhr.status >= 200 && xhr.status < 300) {
            // Conversion de la réponse JSON en objet JavaScript
            var data = JSON.parse(xhr.responseText);
            
            // Utilisation des données récupérées (ex : affichage dans la console)
            console.log(data);
            ListeLignes = data
            localStorage.setItem("NBT-ListeLignes",JSON.stringify(data))
            reload_lignes(data)
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

function reload_lignes(lignes) {
    lignes.forEach(ligne => {
        parcoursLigne = JSON.parse(ligne.parcours)
        let conteneur = document.createElement("div") // Créer conteneur
        conteneur.classList.add("Ligne")
        conteneur.id = ligne.id

        let idLigne = document.createElement("div") // Créer case Id
        idLigne.classList.add("LigneListId")
        idLigne.innerHTML = ligne.id

        let couleurLigne = document.createElement("div") // Créer case Code ligne
        couleurLigne.classList.add("LigneListCode")
        couleurLigne.style.backgroundColor = ligne.couleur // Mettre le BG à la couleur de la ligne
        ligne.couleurNB ? couleurLigne.style.color = ligne.couleurNB : couleurLigne.style.color = LineFgTest(ligne.couleur) // Si couleur ligne spécifiée la mettre, sinon, auto
        couleurLigne.innerHTML = ligne.code

        let destLigne = document.createElement("div") // Créer ligne Destinations
        destLigne.classList.add("LigneListDest")
        find_all_terminus(parcoursLigne).forEach((terminus)=>{
            let dest = document.createElement("div")
            dest.innerHTML = terminus
            destLigne.append(dest)
        })

        let btnsLigne = document.createElement("div")
        btnsLigne.classList.add("LigneListBtns")
        btnsLigne.innerHTML = `<button onclick=maxi(${ligne.id})>Editer</button>`
        
        conteneur.append(idLigne)
        conteneur.append(couleurLigne)
        conteneur.append(destLigne)
        conteneur.append(btnsLigne)

        document.querySelector("#LigneList").append(conteneur)
    });
}

// Fonction pour sortir les terminus d'un parcours principal + supprimer les doublons
function find_all_terminus(parcours) {
    let listeTerminus = []
    parcours.forEach((p)=>{
        let max = p.arrets.length - 1
        listeTerminus.push(p.arrets[0])
        listeTerminus.push(p.arrets[max])
    })
    listeTerminus.sort()
    return listeTerminus    
}












function LineFgTest(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    // console.log("HSV : ",h,"/",s,"/",l)
  if (l>50) {
    return("black")
  } else {
    return("white")
  }
  }