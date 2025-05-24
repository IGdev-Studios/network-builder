window.onload = function(){
    console.log("Contenu du local storage",localStorage)

    // Boutons debugage
    
    document.querySelector("#bd0").addEventListener('click',()=>{location.reload()})
    document.querySelector("#bd1").addEventListener('click',()=>{NBTtoLS(tmNBT)})
    document.querySelector("#bd2").addEventListener('click',()=>{NBTtoLS(bernyNBT)})
    document.querySelector("#bd3").addEventListener('click',()=>{emptyNBTLS()})

    // On set le localstorage en variable locale
    let localLignes = JSON.parse(localStorage.getItem("NBT"))

    // Ajout des lignes existantes dans le tableau des lignes
    localLignes.Lignes.forEach(ligne => {
        // console.log(ligne)
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
        let terminus = []
        ligne.arrets.forEach(arret => {
          if (arret.terminus){terminus.push(arret.nom)}
        })
        terminus.forEach(terminus => {
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
///////////////////////////////////////////////////////////////////////////////////////////
// FIN WINDOW.ONLOAD //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
function NBTtoLS(NBT) {
  localStorage.setItem("NBT",JSON.stringify(NBT))
  console.info('NBTtoLS() → OK')
  location.reload()
}
function emptyNBTLS() {
  localStorage.removeItem("NBT")
  location.reload()
  console.info('emptyNBTLS() → OK')
}

// Pour mettre l'objet dans le localstorage : 
//  localstorage.setItem(<stockage>,JSON.stringify(<objet>))
// Pour le resortir :
//  JSON.parse(localstorage.getItem(<stockage>))
let tmNBT = {
    "Lignes" : [
        {"nom":"Ligne 1","id":"1","couleur":"#dc241f","arrets":[{"nom":"Gare Centrale","terminus":true},{"nom":"Campus Alan Turing","terminus":true}]},
        {"nom":"Ligne 2","id":"2","couleur":"#9364cc","arrets":[{"nom":"Gare Centrale","terminus":true},{"nom":"Aéroport","terminus":true}]},
        {"nom":"Ligne 3","id":"3","couleur":"#f1ab00","arrets":[{"nom":"Gare Centrale","terminus":true},{"nom":"Campus Marthe Gautier","terminus":true}]},
        {"nom":"Ligne 4","id":"4","couleur":"#00afad","arrets":[{"nom":"Gare Centrale","terminus":true},{"nom":"Gare de l'Est","terminus":true}]},
        // {"Nom":"Ligne 5","id":"5","couleur":"#e86a10","terminus":["Musée d'Art Moderne","Pôle Luca Pacioli"]},
        // {"Nom":"Ligne 6","id":"6","couleur":"#894e24","terminus":["Grand Palais","Campus Maryse Esterle"]},
        // {"Nom":"Ligne 7","id":"7","couleur":"#007229","terminus":["Grand Palais","Port fluvial"]},
    ]
}
/* 
  Structure Ligne
    Nom - VarChar
    Code - Alphanumérique
    id - num
    couleur - #hex
    parcours
      → nom
      → rang Principal (0), secondaire(1)
      → sens Aller-Retour(0), Aller(1) ou Retour(2)
      → Liste des arrets (ID dans l'ordre)
*/
let bernyNBT = {
  "Lignes" : [
    {
      "nom": "Ligne 701",
      "code": "701",
      "id": "1",
      "couleur": "#E30613",
      "arrets": [
        {"nom": "Stalingrad"        , "terminus": true},
        {"nom": "Gare SNCF"                           },
        {"nom": "Capuche"                             },
        {"nom": "Place des Trèfles"                   },
        {"nom": "Mairie"                              },
        {"nom": "GS Bombardier"                       },
        {"nom": "Gare Routière"                       },
        {"nom": "Opalie"                              },
        {"nom": "Medilux"                             },
        {"nom": "Studio Enigma"                       },
        {"nom": "Madeleine"         , "terminus": true},
        {"nom": "Orfèvre"                             },
        {"nom": "Ferme des Collines"                  },
        {"nom": "Chateau d'eau"                       },
        {"nom": "Ancien Fort"       , "terminus": true}
      ]
    },
    {
      "nom": "Ligne 702",
      "code": "702",
      "id": "2",
      "couleur": "#FFCE00",
      "parcours": [
        {"id": "2-0",
          "nom" : "",
          "rang":"", // Principal (0), secondaire(1)
          "sens" : "", // Aller-Retour(0), Aller(1) ou Retour(2)
          "arrets" : [ // liste des ID dans l'ordre
            1,2,3,4

          ]
        },
      ]
    },
    {
      "nom": "Ligne 703",
      "code": "703",
      "id": "3",
      "couleur": "#82DC73",
      "couleurNB":"#FFFFFF",
      "arrets": [
        {"nom": "République", "terminus": true},
        {"nom": "Madeleine" , "terminus": true}
      ]
    },
    {
      "nom": "Ligne 704",
      "code": "704",
      "id": "4",
      "couleur": "#0055C8",
      "arrets": [
        {"nom": "République"     , "terminus": true                },
        {"nom": "Palme d'or"                                       },
        {"nom": "ukn 10"                                           },
        {"nom": "ukn 11"                                           },
        {"nom": "ukn 12"                                           },
        {"nom": "ukn 13"                                           },
        {"nom": "ukn 14"                                           },
        {"nom": "Route du Lac"                                     },
        {"nom": "ukn 19"                                           },
        {"nom": "ukn 18"         ,                   "branche": "A"},
        {"nom": "Pré de l'eau"   , "terminus": true, "branche": "A"},
        {"nom": "ukn 20"         ,                   "branche": "B"},
        {"nom": "Beaux Quartiers", "terminus": true, "branche": "B"}
      ]
    },
    {
      "nom": "Ligne 705",
      "code": "705",
      "id": "5",
      "couleur": "#A0006E",
      "arrets": [
        {"nom": "Place des Trèfles", "terminus": true},
        {"nom": "Les Lilas"        , "terminus": true}
      ]
    }
  ]
  
}

/**
 * Maximise la ligne et affiche ses détails dans la case d'à coté
 */
function maxi(ligneId) {
  let localLignes = JSON.parse(localStorage.getItem("NBT"))
  let ligne = localLignes.Lignes.find((e)=>e.id == ligneId)
  document.querySelector('#LigneDetails').innerHTML = ""
  let nextHTML = '<table>'
  nextHTML += `<tr><td>Nom :</td><td><input id="editNom" type="text" value="${ligne.nom}"></td></tr>`
  nextHTML += `<tr><td>Code ligne :</td><td><input id="editCode" type="text" value="${ligne.code}"></td></tr>`
  nextHTML += `<tr><td>ID unique:</td><td><input id="editId" type="text" value="${ligne.id}" disabled></td></tr>`
  nextHTML += `<tr><td>Code couleur : </td><td><input id="editCouleur" type="color" value="${ligne.couleur}"></td></tr>`
  nextHTML += `<tr><td>Arrêts : </td><td>Terminus</td></tr>`
  ligne.arrets.forEach(arret => {
    let check
    if (arret.terminus){check="checked"}
    nextHTML += `<tr><td><input type="text" value="${arret.nom}"></td><td><input type="checkbox" ${check}></td></tr>`
  })
  nextHTML += '</table>'
  nextHTML += '<button id="editValid"><img src="./res/svg/check-bold.svg" alt="" height="20">Valider</button>'
  nextHTML += '<button id="editAnnul"><img src="./res/svg/close-thick.svg" alt="" height="20">Annuler</button>'
  document.querySelector('#LigneDetails').innerHTML = nextHTML
  document.querySelector("#editValid").addEventListener('click',()=>{valid(ligne.id)})
  document.querySelector("#editAnnul").addEventListener('click',()=>{location.reload()})
}

/**
 * Valide la modification de la ligne et ses détails
 */
function valid(ligneId) {
  let localLignes = JSON.parse(localStorage.getItem("NBT"))
  let ligne = localLignes.Lignes.find((e)=>e.id == ligneId)
  console.group("EDIT")

  let newLigneInfo = {"nom":"","code":"","id":"","couleur":"","arrets":[]}
  newLigneInfo.id = ligne.id
  newLigneInfo.nom = document.querySelector("#editNom").value
  newLigneInfo.code = document.querySelector("#editCode").value
  newLigneInfo.couleur = document.querySelector("#editCouleur").value

  console.log("NEW",newLigneInfo)
  console.log("OLD",localLignes.Lignes.find((e)=>e.id == ligneId))
  console.groupEnd()
  localLignes.Lignes.find((e)=>e.id == ligneId) = newLigneInfo
  // console.log(localLignes)
  // NBTtoLS(localLignes)

}
function test(param) {

  return toReturn
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
    // console.log("HSV : ",h,"/",s,"/",l)
  if (l>50) {
    return("black")
  } else {
    return("white")
  }
  }