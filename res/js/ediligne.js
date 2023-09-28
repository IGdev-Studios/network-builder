window.onload = function(){
    console.log("Contenu du local storage",localStorage)

    // On set le localstorage en variable locale
    let localLignes = JSON.parse(localStorage.getItem("NBT"))

    // Ajout des lignes existantes dans le tableau des lignes
    localLignes.Lignes.forEach(ligne => {
        console.log(ligne)
        let conteneur = document.createElement("div")
        conteneur.classList.add("Ligne")
        let couleurLigne = document.createElement("div")
        couleurLigne.classList.add("LigneListId")
        couleurLigne.style.backgroundColor = ligne.couleur
        couleurLigne.style.color = LineFgTest(ligne.couleur)
        couleurLigne.innerHTML = ligne.id
        let destLigne = document.createElement("div")
        destLigne.classList.add("LigneListDest")
        ligne.terminus.forEach(terminus => {
            let dest = document.createElement("div")
            dest.innerHTML = terminus
            destLigne.append(dest)
        })
        
        conteneur.append(couleurLigne)
        conteneur.append(destLigne)

        document.querySelector("#LigneList").append(conteneur)
    });
}


// Pour mettre l'objet dans le localstorage : 
//  localstorage.setItem(<stockage>,JSON.stringify(<objet>))
// Pour le resortir :
//  JSON.parse(localstorage.getItem(<stockage>))
let NBT = {
    "Lignes" : [
        {"nom":"Ligne 1","id":"1","couleur":"#dc241f","terminus":["Gare Centrale","Campus Alan Turing"]},
        {"nom":"Ligne 2","id":"2","couleur":"#9364cc","terminus":["Gare Centrale","Aéroport "]},
        {"nom":"Ligne 3","id":"3","couleur":"#f1ab00","terminus":["Gare Centrale","Campus Marthe Gautier"]},
        {"nom":"Ligne 4","id":"4","couleur":"#00afad","terminus":["Gare Centrale","Gare de l'Est"]},
        // {"Nom":"Ligne 5","id":"5","couleur":"#e86a10"},
        // {"Nom":"Ligne 6","id":"6","couleur":"#894e24"},
        // {"Nom":"Ligne 7","id":"7","couleur":"#007229"},
    ]
}


/**
 * Test si la couleur est trop foncée pour le contraste
 */
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
    console.log("HSV : ",h,"/",s,"/",l)
  if (l>50) {
    return("black")
  } else {
    return("white")
  }
  }