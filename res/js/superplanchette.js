const debugLevel = 0
// Niveau de debug
//  0 = pas de debug
//  1 = fonctions principales (boutons)
//  2 = toutes les fonctions

/* Au chargenment de la page */

window.onload = function(){
  data=document.querySelector("#data")
  if (localStorage.getItem('display_help_img') == 'true'){
    document.querySelector("#reel").style = "display: block";
    document.querySelector("#plre").checked = true;
  }
  // Bouton Mise en PDF
  document.querySelector('.btn.pdf').onclick = function () {
    options = {
      filename:   document.querySelector('#entreprise').innerHTML
      +"_"+document.querySelector('#idService').innerHTML
      +"_"+document.querySelector('#periodeService').innerHTML
      +"_"+document.querySelector('#dateVigeur').innerHTML.slice(12)
      +".pdf",
    }
    html2pdf(document.querySelector('#render'),options)
  }
  // Bouton import JSON
  
  // document.querySelector('#importJSON').onclick = function(){
  
  
  // Auto modifieurs principaux
  
  // Couleur arrière plan
  i0 = document.querySelector("#i0");
  i0.onchange = function(){
    document.querySelector("#render").style = `background-color: ${i0.value}`
    document.querySelectorAll(".h_ter>span, .h_arr>span").forEach(function(e){
      e.style.background = i0.value
    })
  }
  // Entreprise
  i1 = document.querySelector('#i1');
  i1.oninput = function(){
    jsonSave.entreprise = i1.value;
    reloadHeadline()
  }
  // Date en vigueur
  i2 = document.querySelector('#i2');
  i2.oninput = function(){
    date = `${i2.value}`;j=date.slice(8,10);m=date.slice(5,7);a=date.slice(0,4)
    jsonSave.dateVigeur = `${j}/${m}/${a}`;
    reloadHeadline()
  }
  // Planchette repère
  document.querySelector("#plre").onchange = function(){
    if (document.querySelector("#plre").checked == true) {
      document.querySelector("#reel").style = "display: block";
      localStorage.setItem("display_help_img", true);
    }else{
      document.querySelector("#reel").style = "display: none"
      localStorage.setItem("display_help_img", false);
    }
  }
  // Popup Edit infos planchette
  document.querySelector('#service').onclick = function(){    
    showPopup("servicePopup")
  }
  // Popup Edit recap planchette
  document.querySelector('#recap').onclick = function(){    
    showPopup("recapPopup")
    reloadRecapList()
  }
  // Popup Ajout élément
  document.querySelectorAll('#typeHoraire').forEach((e)=>{
    e.onchange = function(){
      changeAddPopup(e,e.value)
    }
  })
  document.querySelector('#editPopup').onchange
  //// Code temporaire note de début
  
  // document.querySelector('#h_0')
  
  // Fonctions de lancement
  
  
}
//
// Fonctions de la page
//

/**
* Ouvrir la Popup
* @param {string} popupId - ID de la popup (sans le #)
*/
function showPopup(popupId) {
  debugLevel>=1?console.log("Ouvrir popup "+popupId):null
  document.querySelector("#"+popupId).style.display = "block";
}
/**
* Fermer la Popup
* @param {string} popupId - ID de la popup (sans le #)
*/
function hidePopup(popupId) {
  debugLevel>=1?console.log("Fermer popup "+popupId):null
  document.querySelector("#"+popupId).style.display = "none";
}
/**
* Changer le type d'élement dans la popup d'ajout d'élément
* @param {element} element Élément en question
* @param {string} valeur Type de l'élément à rajouter
*/
function changeAddPopup(element,valeur) {
  document.querySelector('#newHoraire').innerHTML = ""
  switch (valeur) {
    case "num_voiture":
    document.querySelector('#newHoraire').innerHTML = `
    Ligne <input name="voitLigne" type="text"><br>
    N° de voiture <input name="voitNum" type="text">`
    break;
    case "course":
    reloadNewStops()
    break;
    case "coupure":
    document.querySelector('#newHoraire').innerHTML = `
    Heure de début <input name="coupDeb" type="time"><br>
    Heure de fin <input name="coupFin" type="time">`
    break;
    case "note":
    document.querySelector('#newHoraire').innerHTML = `
    <textarea name="notes" cols="40" rows="4" placeholder="Entrez vos notes ici..."></textarea>`
    break;
    default:
    window.alert("Erreur dans la mise à jour du popup");
    break;
  }
}
/** Générer la barre de bouton d'une case
* 
* @param {*} i - id/numéro de l'horaire dans le tableau
* @param {*} horaire - horaire à déplacer
* @returns Retourne la chaine préparée de la barre de boutons
*/
function generateBtnBar(i,horaire) {
  let edt = document.createElement('button');
  let mdn = document.createElement('button');
  let mup = document.createElement('button');
  let del = document.createElement('button');
  let bar = document.createElement('div');
  edt.innerHTML = "Edit" // ✏
  mdn.innerHTML = "↓"
  mup.innerHTML = "↑"
  del.innerHTML = "▬"
  // Fonction BTN Edit
  edt.addEventListener("click", function(){
    // console.log(i)
    console.log(horaire)
    jsonSave.horaire
    // Utiliser le Horaire, pour re-setup la fenêtre de modif.
  })
  // Fonction BTN Descendre
  mdn.addEventListener("click", function(){
    jsonSave.horaires.splice(i, 1);
    jsonSave.horaires.splice(i+1, 0,horaire);
    reloadHoraires()
  })
  // Fonction BTN Monter
  mup.addEventListener("click", function(){
    jsonSave.horaires.splice(i, 1);
    jsonSave.horaires.splice(i-1, 0,horaire);
    reloadHoraires()
  })
  // Fonction BTN Supprimer
  del.addEventListener("click", function(){
    jsonSave.horaires.splice(i, 1);
    reloadHoraires()})
    bar.className = "h_btnBar"
    bar.appendChild(edt); bar.appendChild(mdn);  bar.appendChild(mup);  bar.appendChild(del);
    return bar;
  }
  /**
  * Re-génère les arrêts en cours d'ajout
  */
  function reloadNewStops() {
    newStopsList = document.querySelector('#newHoraire')
    newStopsList.innerHTML = '';
    if (stopsArray.length == 0) {
      stopsArray.push({nom:"",horaire:"--:--"});
      reloadNewStops()
    } else {
      for(let i = 0; i < stopsArray.length; i++){
        let e = stopsArray[i];
        // Création des élements nécessaires
        let divInput = document.createElement('div');
        let inputArret = document.createElement('input'); inputArret.type = 'text';
        let inputTime = document.createElement('input'); inputTime.type = 'time';
        
        // Input nom arrêt
        inputArret.value = e.nom;
        inputArret.placeholder = "Nom de l'arrêt";
        inputArret.addEventListener('change', () => {
          let index = stopsArray.indexOf(e);
          stopsArray[index].nom = inputArret.value;
        })
        divInput.appendChild(inputArret);
        
        // Input temps arrêt
        inputTime.value = e.horaire;
        inputTime.addEventListener('change', () => {
          let index = stopsArray.indexOf(e);
          stopsArray[index].horaire = inputTime.value;
        })
        divInput.appendChild(inputTime);   
        
        // Bouton ajout arrêt en dessous
        let pdn = document.createElement('button');pdn.innerHTML = '↓';
        pdn.addEventListener('click', () => {
          stopsArray.splice(i+1, 0, {nom:"",horaire:"--:--"});
          reloadNewStops();
        })
        divInput.appendChild(pdn);
        
        // Bouton ajout arrêt au dessus
        let pup = document.createElement('button');pup.innerHTML = '↑';
        pup.addEventListener('click', () => {
          stopsArray.splice(i, 0, {nom:"",horaire:"--:--"});
          reloadNewStops();
        })
        divInput.appendChild(pup);
        
        // Boutton suppression arrêt
        let del = document.createElement('button');del.innerHTML = '▬';
        del.addEventListener('click', () => {
          stopsArray.splice(i, 1);
          reloadNewStops();
        })
        divInput.appendChild(del);
        
        newStopsList.appendChild(divInput);
      };
      // Créer le champ de numéro de course
      inputCourse = document.createElement('input');
      inputCourse.name = "courseNum";inputCourse.placeholder = ""
      inputCourse.value = courseCode
      inputCourse.addEventListener('change',()=>{ courseCode = inputCourse.value })
      divCourse = document.createElement('div')
      divCourse.append(inputCourse,document.createTextNode(" Numéro de Course (facultatif)"))
      // Créer le champ de numéro de girouette
      inputGir = document.createElement('input');
      inputGir.name = "codeGir";inputGir.placeholder = "ex. 2501"
      inputGir.value = girCode
      inputGir.addEventListener('change',()=>{ girCode = inputGir.value })
      divGir = document.createElement('div')
      divGir.append(inputGir,document.createTextNode(" Code girouette (facultatif)"))
      // inputGir.append()
      newStopsList.prepend(divCourse,divGir)
    }
  }
  function reloadRecapList() {
    newRecapList = document.querySelector('#newRecap')
    newRecapList.innerHTML = baseHTMLrecap+"<div>Bouttons</div>"
    if (recapArray.length == 0) {
      recapArray.push({"voiture":"","releveQui":"","debutService":"","lieuDebut":"","heureDebut":"","heureFin":"","lieuFin":"","relevePar":"","finService":""})
      reloadRecapList()
    } else {
      for (let i = 0; i < recapArray.length; i++) {
        let recap = recapArray[i];
        // Création des éléments nessesaire
        let inputVoiture = document.createElement('input');inputVoiture.type = 'text';inputVoiture.name = "voiture"
        let inputReleveQui = document.createElement('input');inputReleveQui.type = 'text';inputReleveQui.name = "releveQui"
        let inputDebutService = document.createElement('input');inputDebutService.type = 'time';inputDebutService.name = "debutService"
        let inputLieuDebut = document.createElement('input');inputLieuDebut.type = 'text';inputLieuDebut.name = "lieuDebut"
        let inputHeureDebut = document.createElement('input');inputHeureDebut.type = 'time';inputHeureDebut.name = "heureDebut"
        let inputHeureFin = document.createElement('input');inputHeureFin.type = 'time';inputHeureFin.name = "heureFin"
        let inputLieuFin = document.createElement('input');inputLieuFin.type = 'text';inputLieuFin.name = "lieuFin"
        let inputRelevePar = document.createElement('input');inputRelevePar.type = 'text';inputRelevePar.name = "relevePar"
        let inputFinService = document.createElement('input');inputFinService.type = 'time';inputFinService.name = "finService"
        
        // Assignation des valeurs
        inputVoiture.value = recap.voiture
        inputReleveQui.value = recap.releveQui
        inputDebutService.value = recap.debutService
        inputLieuDebut.value = recap.lieuDebut
        inputHeureDebut.value = recap.heureDebut
        inputHeureFin.value = recap.heureFin
        inputLieuFin.value = recap.lieuFin
        inputRelevePar.value = recap.relevePar
        inputFinService.value = recap.finService
        
        // Assignation des écouteurs
        inputVoiture.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].voiture = inputVoiture.value;})
        inputReleveQui.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].releveQui = inputReleveQui.value;})
        inputDebutService.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].debutService = inputDebutService.value;})
        inputLieuDebut.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].lieuDebut = inputLieuDebut.value;})
        inputHeureDebut.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].heureDebut = inputHeureDebut.value;})
        inputHeureFin.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].heureFin = inputHeureFin.value;})
        inputLieuFin.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].lieuFin = inputLieuFin.value;})
        inputRelevePar.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].relevePar = inputRelevePar.value;})
        inputFinService.addEventListener('change',()=>{recapArray[recapArray.indexOf(recap)].finService = inputFinService.value;})
        
        // Ajout des balises dans le DOM
        newRecapList.appendChild(inputVoiture)
        newRecapList.appendChild(inputReleveQui)
        newRecapList.appendChild(inputDebutService)
        newRecapList.appendChild(inputLieuDebut)
        newRecapList.appendChild(inputHeureDebut)
        newRecapList.appendChild(inputHeureFin)
        newRecapList.appendChild(inputLieuFin)
        newRecapList.appendChild(inputRelevePar)
        newRecapList.appendChild(inputFinService)
        
        // Boutons 
        let pdn = document.createElement('button');pdn.innerHTML = '<img src="./res/svg/table-row-plus-after.svg" height="20" alt="↓">';
        let pup = document.createElement('button');pup.innerHTML = '<img src="./res/svg/table-row-plus-before.svg" height="20" alt="↑">';
        let del = document.createElement('button');del.innerHTML = '<img src="./res/svg/table-row-remove.svg" height="20" alt="▬">';
        
        pdn.addEventListener('click',()=>{recapArray.splice(i+1, 0, {"voiture":"","releveQui":"","debutService":"","lieuDebut":"","heureDebut":"","heureFin":"","lieuFin":"","relevePar":"","finService":""});reloadRecapList();}) 
        pup.addEventListener('click',()=>{recapArray.splice(i, 0, {"voiture":"","releveQui":"","debutService":"","lieuDebut":"","heureDebut":"","heureFin":"","lieuFin":"","relevePar":"","finService":""});reloadRecapList()});
        del.addEventListener('click',()=>{recapArray.splice(i, 1);reloadRecapList()});
        
        divBtn = document.createElement('div');
        divBtn.appendChild(pdn);
        divBtn.appendChild(pup);
        divBtn.appendChild(del);
        
        newRecapList.appendChild(divBtn)
      }  
    }
  }
  /**
  * Executer l'ajout d'une case d'horaires depuis la popup d'ajout.
  * Traite le format depuis la popup et l'insère dans la variable de sauvegarde
  */
  function executeAddPopup() {
    let typeAjout = document.querySelector('#typeHoraire').value;
    let addStopList = stopsArray
    
    switch (typeAjout) {
      case "num_voiture":
        jsonSave.horaires.push({
          "type": "num_voiture",
          "ligne" : document.querySelector('input[name="voitLigne"]').value,
          "numero": document.querySelector('input[name="voitNum"]').value,
        })
      break;
      // case "num_course":
      // jsonSave.horaires.push({
      //   "type": "num_course", 
      //   "valeur": `${document.querySelector('input[name="courseNum"]').value}`
      // });
      // reloadHoraires()
      // break;
      case "course":
      jsonSave.horaires.push({
        "type": "course",
        "courseId":`${document.querySelector('input[name="courseNum"]').value}`,
        "gir":document.querySelector('input[name="codeGir"]').value,
        "arrets":addStopList
      })
      stopsArray = [];girCode = "";courseCode = ""
      reloadNewStops()
      reloadHoraires()
      break;        
      case "coupure":
      jsonSave.horaires.push({
        "type": "coupure",
        "heureDebut": document.querySelector('input[name="coupDeb"]').value,
        "heureFin": document.querySelector('input[name="coupFin"]').value
      })
      reloadHoraires()
      break;
      case "note":
      jsonSave.horaires.push({
        "type": "note",
        "note": document.querySelector('textarea[name="notes"]').value
      })
      reloadHoraires()
      break;
      default:
      window.alert("erreur dans la mise à jour du popup");
      break;
    }
    hidePopup('addPopup')
  }
  function executeServicePopup() {
    jsonSave.service.idService = document.querySelector('#ser_id').value;
    jsonSave.service.periode = document.querySelector('#ser_peri').value;
    jsonSave.service.typeService = document.querySelector('input[name="typeService"]:checked').value;
    
    reloadResume()
    hidePopup('servicePopup')
  }
  function executeRecapPopup() {
    jsonSave.recap = recapArray;
    reloadResume()
    hidePopup('recapPopup')
    
  }
  /** Re-générer la planchette avec le contenu du JSON de la page.
  * A appeller lorsque le JSON est modifié
  * @param {*}jsonData : Objet JSON des données de la planchette
  */
  function reloadPlanchette(jsonData = jsonSave) {
    debugLevel>=1?console.log("Regénération de la planchette avec les données suivantes",jsonData):null
    jsonSave = jsonData
    reloadHeadline(jsonData)
    reloadResume(jsonData)
    reloadHoraires(jsonData)  
  }
  /** Re-générer la headline de la planchette
  * A appeller lorsque le JSON est modifié 
  * @param {*} jsonData 
  */
  function reloadHeadline(jsonData = jsonSave) {
    // On ré-ecrit la headline
    document.getElementById('entreprise').innerHTML = jsonData.entreprise
    document.getElementById('dateVigeur').innerHTML = `En vigueur: ${jsonData.dateVigeur}`
  }
  /** Re-générer la ligne de résumé de la planchette
  * A appeller lorsque le JSON est modifié
  * @param {*} jsonData 
  */
  function reloadResume(jsonData = jsonSave) {
    // On récupère les outils nessesaire
    serviceId = document.querySelector('#service')
    recapId = document.querySelector("#recap")  
    // On réinitialise le résumé
    serviceId.innerHTML = ""
    recapId.innerHTML = baseHTMLrecap
    // On ré-ecrit le carré d'info planchette
    serviceId.innerHTML += `<div id="idService">${jsonData.service.idService}</div>`
    serviceId.innerHTML += `<div id="periodeService">${jsonData.service.periode}</div>`
    serviceId.innerHTML += `<div>Type<br>jrn.<br>${jsonData.service.typeService}</div>`
    // On ré-ecrit le recap
    jsonData.recap.forEach((r)=>{
      toAdd = ""
      toAdd += `<div>${r.voiture}</div>`
      toAdd += `<div>${r.releveQui}</div>`
      toAdd += `<div>${r.debutService}</div>`
      toAdd += `<div>${r.lieuDebut}</div>`
      toAdd += `<div>${r.heureDebut}</div>`
      toAdd += `<div>${r.heureFin}</div>`
      toAdd += `<div>${r.lieuFin}</div>`
      toAdd += `<div>${r.relevePar}</div>`
      toAdd += `<div>${r.finService}</div>`
      
      recapId.innerHTML += toAdd
    })
  }
  
  /** Re-générer les horaires de la planchette.
  * A appeller lorsque le JSON des horaires est modifié
  * @param {*}jsonData : Objet JSON des données de la planchette
  */
  function reloadHoraires(jsonData = jsonSave) {
    // On récupère les outils nessesaire
    horairesId = document.querySelector("#horaires")
    h_col1 = document.querySelector('#h_col1')
    h_col2 = document.querySelector('#h_col2')
    h_col3 = document.querySelector('#h_col3')
    // On réinitialise les horaires
    h_col1.innerHTML = "";h_col2.innerHTML = "";h_col3.innerHTML = ""
    // On initialise les poids
    poidsMaxTotal = 0
    poidsMaxColone = 0
    poidsMaxReste = 0
    poidsCumulTotal = 0
    poidsCumulColone = 0
    numColone = 1
    // On affecte un poids à chaque horaire pour découper la liste en 3
    jsonData.horaires.forEach((horaire)=>{
      if (horaire.type == 'course') {
        poidsMaxTotal += horaire.arrets.length
      }else{poidsMaxTotal += 1}
    })
    poidsMaxColone = Math.floor(poidsMaxTotal/3)
    poidsMaxReste = poidsMaxTotal%3
    
    // On ré-ecrit les horaires
    jsonData.horaires.forEach((horaire)=>{
      index = jsonData.horaires.indexOf(horaire)
      indexId = "h_"+index
      poidsItem = 0
      addDiv = document.createElement("div")
      addType = document.createElement('span')
      addValue = document.createElement('span')
      addDiv.id = indexId
      addBtnBar = generateBtnBar(index,horaire)
      
      // toAdd = "" // OLD
      switch (horaire.type) {
        case 'num_voiture':
          debugLevel>=2?console.groupCollapsed("Num Voiture"):null

          addType.innerHTML = "Voiture"
          poidsItem = 1
          addDiv.className = "h_main h_num_voiture"
          addValue.innerHTML = horaire.ligne+" - "+horaire.numero
          addDiv.appendChild(addType)
          addDiv.appendChild(addValue)
        break;
          
        case 'coupure':
          debugLevel>=2?console.groupCollapsed("Coupure"):null

          poidsItem = 1
          addDiv.className = "h_main h_coupure"
          addType.innerHTML = "Coupure"
          addValue.innerHTML = horaire.heureDebut+"   "+horaire.heureFin
          addDiv.appendChild(addType)
          addDiv.appendChild(addValue)
        break;
        
        case 'note':
          debugLevel>=2?console.groupCollapsed("Note"):null

          poidsItem = 1
          addDiv.className = "h_main h_note"
          addText = document.createTextNode(horaire.note)
          addDiv.appendChild(addText)
        break;

        case 'course':
        debugLevel>=2?console.group("Course"):null

        addDiv.className = "h_main h_course"
        // Gestion du poids
        poidsItem = horaire.arrets.length
        if ((horaire.courseId==undefined)||(horaire.courseId=="")) {
          // on ne fait rien ici
          null
        }else{
          poidsItem++
          // Créer la ligne du code Course
          addCourseId = document.createElement('div')
          addCourseId.className = "h_num_course"
          addCourseId.innerHTML = horaire.courseId
          addDiv.appendChild(addCourseId)
        }
        // Créer la ligne du code Girouette
        addGir = document.createElement('div')
        addGir.className = "h_gir"
        // Ajout code gir (ou pas)
        if ((horaire.gir == undefined)||(horaire.gir=="")) {
          addGir.innerHTML = "-"
        }else{
          addGir.innerHTML = "gir"+horaire.gir
        }
        debugLevel>=2?console.log(addGir):null

        addDiv.appendChild(addGir)
        // boucle arrêts
        horaire.arrets.forEach((arret)=>{
          addArr = document.createElement('div')
          // Check si terminus haut ou bas
          switch (arret) {
            case horaire.arrets[0]:
            case horaire.arrets[horaire.arrets.length-1]:
            addArr.className = "h_ter"
            break;
            
            default:
            addArr.className = "h_arr"
            break;
          }
          // On ajoute nom et horaire de l'arrêt
          addArrNom = document.createElement('span')
          addArrNom.innerHTML = arret.nom
          addArrHor = document.createElement('span')
          addArrHor.innerHTML = arret.horaire
          addArr.appendChild(addArrNom)
          addArr.appendChild(addArrHor)
          addDiv.appendChild(addArr)
        })      
        break;        
        default:
        console.error("Erreur Switch : type d'horaire indéfini")
        window.alert("Erreur Switch : type d'horaire indéfini")
        break;
      }
      // Après génération, ajouter la barre de boutons
      addDiv.appendChild(addBtnBar)
      debugLevel>=2?console.log(addDiv):null
      
      // Placement des horaires
      switch (numColone){
        case 1:
        if ((poidsCumulColone+poidsItem)<=(poidsMaxColone+poidsMaxReste)) {
          h_col1.appendChild(addDiv)
          poidsCumulColone += poidsItem
          poidsCumulTotal += poidsItem
        } else {
          numColone++
          poidsCumulColone = poidsItem
          h_col2.appendChild(addDiv)
          poidsCumulTotal += poidsItem
        }
        break;
        case 2:
        if ((poidsCumulColone+poidsItem)<=(poidsMaxColone+poidsMaxReste)) {
          h_col2.appendChild(addDiv)
          poidsCumulColone += poidsItem
          poidsCumulTotal += poidsItem
        } else {
          numColone++
          poidsCumulColone = poidsItem
          h_col3.appendChild(addDiv)
          poidsCumulTotal += poidsItem
        }
        break;
        case 3:
        h_col3.appendChild(addDiv)
        poidsCumulColone += poidsItem
        poidsCumulTotal += poidsItem
        break;
        default:
        window.alert("Erreur : Cas non prévu.")
        break;
      }
      debugLevel>=2?console.groupEnd():null
    })
  }
  //
  // Variables page
  //
  
  stopsArray = [];
  girCode = "";
  courseCode = "";
  recapArray = [];
  
  baseHTMLrecap = `<div>Voiture</div>
  <div>Relève<br>qui</div>
  <div>Début<br>service</div>
  <div>Lieu<br>début</div>
  <div>Heure<br>début</div>
  <div>Heure<br>fin</div>
  <div>Lieu<br>fin</div>
  <div>Relevé<br>par</div>
  <div>Fin<br>service</div>
  <!-- Fin tête tableau -->`
  // Format sauvegarde JSON : 
  jsonSave = {
    "entreprise":"",        // Nom entreprise
    "dateVigeur":"",        // Date en vigueur fiche
    "service":{
      "idService":"",     // Identifiant service
      "periode":"",       // Periode d'activité service
      "typeService":"",   // Service matin, aprèm, ou coupé
    },
    "recap":[
      {               // Valable pour tous les sous catégories : ["",""] si service coupé
        "voiture":"",     // Numéro(s) de voiture
        "releveQui":"",   // Service(s) relevé
        "debutService":"",// Heure(s) début service
        "lieuDebut":"",   // Lieu(x) début de service
        "heureDebut":"",  // Heure(s) départ dépot
        "heureFin":"",    // Heure(s) retout dépot
        "lieuFin":"",     // Lieu(x) fin service
        "relevePar":"",   // Service(s) qui relève
        "finService":"",  // Heure(s) fin service
      },
    ],
    "horaires":[
      
    ]
  }
jsonDemo = {
    "entreprise":"SEMITAG",        // Nom entreprise
    "dateVigeur":"02/02/2023",        // Date en vigueur fiche
    "service":{
      "idService":"BUS - 001",     // 14 = Ligne; 002 = Service
      "periode":"HI2122 - LVH",       // HI = HIVER; 2122 = année debut/fin
      "typeService":"dfoi",   // coma =  matin, copm = aprèm, dfoi = coupé
    },
    "recap":[
      {   "voiture":["11 - 1"],     // Numéro(s) de voiture
      "releveQui":[""],   // Service(s) relevé
      "debutService":["6:40"],// Heure(s) début service
      "lieuDebut":["VORD"],   // Lieu(x) début de service
      "heureDebut":["6:55"],  // Heure(s) départ dépot
      "heureFin":["12:38"],    // Heure(s) retout dépot
      "lieuFin":["GOND"],     // Lieu(x) fin service
      "relevePar":[""],   // Service(s) qui relève
      "finService":["13:03"],  // Heure(s) fin service
    },
    {
      "voiture":["12 - 4"],
      "releveQui":[""],"debutService":["16:25"],
      "lieuDebut":["GOND"],"heureDebut":["16:30"],
      "heureFin":["20:25"],"lieuFin":["VORD"],
      "relevePar":[""],"finService":["20:33"],  
    }
    
  ],               // Valable pour tous les sous catégories : ["",""] si service coupé
  "horaires":[
    {
      "type":"voiture",   // Type d'entrée
      "valeur":"11 - 1",        // valeur
    },
    {
      "type":"course",
      "arrets":[
        {"nom":"Dépôt Vorrepe","horaire":"5:54"},
        {"nom":"VOIRON Gare R Sud","horaire":"6:08",},
      ]
    },
    {
      "type":"course","courseId":"00-3","gir":'1101',
      "arrets":[
        {"nom":"VOIRON Gare R Sud","horaire":"6:10",},
        {"nom":"Oxford","horaire":"6:30",},
        {"nom":"Chavant","horaire":"6:50",},
        {"nom":"Cloyères","horaire":"6:10",},
        {"nom":"Longs Prés","horaire":"7:29",}
      ]
    },
    {
      "type":"course",
      "arrets":[
        {"nom":"Longs Prés","horaire":"7:29",},
        {"nom":"Longs Prés","horaire":"7:30",}
      ]
    },
    {
      "type":"course","courseId":"07-11","gir":'1112',
      "arrets":[
        {"nom":"Longs Prés","horaire":"7:40",},
        {"nom":"Cloyères","horaire":"8:00",},
        {"nom":"Chavant","horaire":"8:20",},
        {"nom":"Oxford","horaire":"8:40",},
        {"nom":"Centr'Alp 2","horaire":"8:55"},
        {"nom":"VOIRON Gare R Sud","horaire":"9:06",}
      ]
    },
    {"type":"note","note":"Ce service passe par Centr'Alp 2"},
    {
      "type":"course","courseId":"00-27","gir":'1101',
      "arrets":[
        {"nom":"VOIRON Gare R Sud","horaire":"10:23",},
        {"nom":"Oxford","horaire":"10:40",},
        {"nom":"Chavant","horaire":"11:00",},
        {"nom":"Cloyères","horaire":"11:20",},
        {"nom":"Longs Prés","horaire":"11:42",}
      ]
    },
    {
      "type":"course",
      "arrets":[
        {"nom":"Longs Prés","horaire":"11:44",},
        {"nom":"Dépôt Goncelin","horaire":"12:04"},
      ]
    },
    {"type":"coupure","heureFin":"12:38","heureDebut":"16:30"},
    {"type":"voiture","valeur":"12 - 4"},
    {
      "type":"course",
      "arrets":[
        {"nom":"Dépot Goncelin","horaire":"16:35",},
        {"nom":"GONCELIN Gare","horaire":"16:40",}
      ]
    },
    {
      "type":'course',"courseId":"01-23","gir":'1203',
      "arrets":[
        {"nom":"GONCELIN Gare","horaire":"17:00",},
        {"nom":"BRIGNOUD Centre","horaire":"17:15",},
        {"nom":"Chavant","horaire":"17:30",},
        {"nom":"GRENOBLE Gare R","horaire":"17:45",}
      ]
    },
    {
      "type":'course',"courseId":"00-24","gir":'1202',
      "arrets":[
        {"nom":"GRENOBLE Gare R","horaire":"17:55",}
        {"nom":"Chavant","horaire":"18:10",},
        {"nom":"BRIGNOUD Centre","horaire":"18:25",},
        {"nom":"GONCELIN Gare","horaire":"18:40",},
      ]
    },
    {
      "type":'course',"courseId":"01-25","gir":'1201',
      "arrets":[
        {"nom":"GONCELIN Gare","horaire":"19:00",},
        {"nom":"BRIGNOUD Centre","horaire":"19:15",},
        {"nom":"Chavant","horaire":"19:30",},
        {"nom":"Oxford","horaire":"19:55",},
        {"nom":"Champfeuillet","horaire":"20:15",}
      ]
    },
    {
      "type":"course",
      "arrets":[
        {"nom":"Champfeuillet","horaire":"20:15",},
        {"nom":"Dépot Voreppe","horaire":"20:25",}
      ]
    }
  ]
}

jsonExport = {
  "entreprise":"",
  "dateVigeur":"",
  "service":{
    "idService":"",
    "periode":"",
    "typeService":""
  },
  "recap":[
    {
      "voiture":"",
      "releveQui":"",
      "debutService":"",
      "lieuDebut":"",
      "heureDebut":"",
      "heureFin":"",
      "lieuFin":"",
      "relevePar":"",
      "finService":""
    }
  ],
  "horaires":[
    {
      "type":"voiture",
      "valeur":""
    },
    {
      "type":"course",
      "courseId":"",
      "gir":"",
      "arrets":[
        {
          "nom":"",
          "horaire":""
        },
        {
          "nom":"",
          "horaire":""
        }
      ]
    },
    {
      "type":"coupure",
      "heureFin":"",
      "heureDebut":""
    },
    {
      "type":"note",
      "note":""
    }
  ]
}

json_StServan_U1 = {
  "entreprise": "STAS",
  "dateVigeur": "29/08/2022",
  "service": {
    "idService": "U - 01",
    "periode": "HI2223 - Lun-Ven",
    "typeService": "dfoi"
  },
  "recap": [
    {
      "voiture": "U - 01",
      "releveQui": "",
      "debutService": "5:53",
      "lieuDebut": "AURAY",
      "heureDebut": "6:08",
      "heureFin": "10:00",
      "lieuFin": "AURAY",
      "relevePar": "",
      "finService": "10:13"
    },
    {
      "voiture": "U - 01",
      "releveQui": "",
      "debutService": "15:54",
      "lieuDebut": "AURAY",
      "heureDebut": "16:09",
      "heureFin": "18:13",
      "lieuFin": "AURAY",
      "relevePar": "",
      "finService": "18:25"
    }
  ],
  "horaires": [
    {
      "type": "num_voiture",
      "ligne": "U",
      "numero":"01"
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "AURAY VOYAGES",
          "horaire": "6:08"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "6:16"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "6:16"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "6:18"
        },
        {
          "nom": "Pasteur",
          "horaire": "6:21"
        },
        {
          "nom": "UJM",
          "horaire": "6:26"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "6:28"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "6:31"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "6:31"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "6:31"
        },
        {
          "nom": "UJM",
          "horaire": "6:34"
        },
        {
          "nom": "Pasteur",
          "horaire": "6:39"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "6:42"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "6:44"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "6:44"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "6:45"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "6:48"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "6:50"
        },
        {
          "nom": "Pasteur",
          "horaire": "6:53"
        },
        {
          "nom": "UJM",
          "horaire": "6:58"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:00"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:03"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:03"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:03"
        },
        {
          "nom": "UJM",
          "horaire": "7:06"
        },
        {
          "nom": "Pasteur",
          "horaire": "7:11"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "7:14"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "7:16"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "7:16"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "7:17"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "7:27"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "7:29"
        },
        {
          "nom": "Pasteur",
          "horaire": "7:32"
        },
        {
          "nom": "UJM",
          "horaire": "7:37"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:42"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:42"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:42"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "7:42"
        },
        {
          "nom": "UJM",
          "horaire": "7:45"
        },
        {
          "nom": "Pasteur",
          "horaire": "7:50"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "7:53"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "7:55"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "7:55"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "7:56"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "8:04"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "8:06"
        },
        {
          "nom": "Pasteur",
          "horaire": "8:09"
        },
        {
          "nom": "UJM",
          "horaire": "8:14"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "8:16"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "8:20"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "8:20"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "8:20"
        },
        {
          "nom": "UJM",
          "horaire": "8:23"
        },
        {
          "nom": "Pasteur",
          "horaire": "8:28"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "8:31"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "8:33"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "8:33"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "8:34"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "8:53"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "8:55"
        },
        {
          "nom": "Pasteur",
          "horaire": "8:58"
        },
        {
          "nom": "UJM",
          "horaire": "9:02"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:05"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:08"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:08"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:08"
        },
        {
          "nom": "UJM",
          "horaire": "9:11"
        },
        {
          "nom": "Pasteur",
          "horaire": "9:16"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "9:19"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "9:21"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "9:21"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "9:22"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "9:26"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "9:28"
        },
        {
          "nom": "Pasteur",
          "horaire": "9:31"
        },
        {
          "nom": "UJM",
          "horaire": "9:36"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:38"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:41"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:41"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "9:41"
        },
        {
          "nom": "UJM",
          "horaire": "9:44"
        },
        {
          "nom": "Pasteur",
          "horaire": "9:49"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "9:52"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "9:54"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "9:21"
        },
        {
          "nom": "AURAY VOYAGES",
          "horaire": "10:00"
        }
      ]
    },
    {
      "type": "coupure",
      "heureFin": "10:00",
      "heureDebut": "16:09"
    },
    {
      "type": "num_voiture",
      "ligne": "U",
      "numero":"01"
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "AURAY VOYAGES",
          "horaire": "16:09"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "16:17"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "16:17"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "16:19"
        },
        {
          "nom": "Pasteur",
          "horaire": "16:22"
        },
        {
          "nom": "UJM",
          "horaire": "16:27"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "16:29"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "16:32"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "16:32"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "16:32"
        },
        {
          "nom": "UJM",
          "horaire": "16:35"
        },
        {
          "nom": "Pasteur",
          "horaire": "16:40"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "16:43"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "16:45"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "16:45"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "16:46"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "16:59"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "17:01"
        },
        {
          "nom": "Pasteur",
          "horaire": "17:04"
        },
        {
          "nom": "UJM",
          "horaire": "17:09"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:11"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:15"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:15"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:15"
        },
        {
          "nom": "UJM",
          "horaire": "17:18"
        },
        {
          "nom": "Pasteur",
          "horaire": "17:23"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "17:26"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "17:28"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "17:28"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "17:29"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "17:38"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "17:40"
        },
        {
          "nom": "Pasteur",
          "horaire": "17:43"
        },
        {
          "nom": "UJM",
          "horaire": "17:48"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:50"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:54"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:54"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "17:54"
        },
        {
          "nom": "UJM",
          "horaire": "17:57"
        },
        {
          "nom": "Pasteur",
          "horaire": "18:02"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "18:05"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "18:07"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "18:07"
        },
        {
          "nom": "AURAY VOYAGES",
          "horaire": "18:13"
        }
      ]
    }
  ]
}

json_F6866 = {
  "entreprise":"Keolis Porte des Alpes",
  "dateVigeur":"18/11/2022",
  "service":{
    "idService":"Flexo -03",
    "periode":"HI2223 - Lun-Ven",
    "typeService":"dfoi"
  },
  "recap":[
    {
      "voiture":"68 - 1",
      "releveQui":"",
      "debutService":"6:23",
      "lieuDebut":"VIFD",
      "heureDebut":"6:38",
      "heureFin":"9:04",
      "lieuFin":"VIFD",
      "relevePar":"",
      "finService":"9:31"
    },
    {
      "voiture":"66 - 2",
      "releveQui":"",
      "debutService":"14:35",
      "lieuDebut":"VIFD",
      "heureDebut":"14:40",
      "heureFin":"19:03",
      "lieuFin":"VIFD",
      "relevePar":"",
      "finService":"19:11"
    }
  ],
  "horaires":[
    {
      "type":"voiture",
      "valeur":"68 - 1"
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Vif - Autocars Grindler",
          "horaire":"6:38"
        },
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"6:58"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0014",
      "arrets":[
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"7:00"
        },
        {
          "nom":"Commanderie",
          "horaire":"7:03"
        },
        {
          "nom":"Lagay",
          "horaire":"7:11"
        },
        {
          "nom":"Grange du Chateau",
          "horaire":"7:15"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0015",
      "arrets":[
        {
          "nom":"Grange du Chateau",
          "horaire":"7:24"
        },
        {
          "nom":"Lagay",
          "horaire":"7:28"
        },
        {
          "nom":"Commanderie",
          "horaire":"7:36"
        },
        {
          "nom":"Marie Curie",
          "horaire":"7:42"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Marie Curie",
          "horaire":"7:42"
        },
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"7:45"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0014",
      "arrets":[
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"7:55"
        },
        {
          "nom":"Commanderie",
          "horaire":"7:58"
        },
        {
          "nom":"Lagay",
          "horaire":"8:06"
        },
        {
          "nom":"Grange du Chateau",
          "horaire":"8:10"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0015",
      "arrets":[
        {
          "nom":"Grange du Chateau",
          "horaire":"8:20"
        },
        {
          "nom":"Lagay",
          "horaire":"7:30"
        },
        {
          "nom":"Commanderie",
          "horaire":"7:38"
        },
        {
          "nom":"Marie Curie",
          "horaire":"8:44"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Marie Curie",
          "horaire":"8:44"
        },
        {
          "nom":"Vif - Autocars Grindler",
          "horaire":"9:04"
        }
      ]
    },
    {
      "type":"coupure",
      "heureDebut":"9:31",
      "heureFin":"14:35",
    },
    {
      "type":"voiture",
      "valeur":"66 - 2"
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Vif - Autocars Grindler",
          "horaire":"14:40"
        },
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"15:00"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0016",
      "arrets":[
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"15:02"
        },
        {
          "nom":"Denis Papin",
          "horaire":"15:11"
        },
        {
          "nom":"Les Simianes",
          "horaire":"15:22"
        },
        {
          "nom":"Clos Jouvin",
          "horaire":"15:29"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"15:29"
        },
        {
          "nom":"Regulation - Clos Jouvin",
          "horaire":"15:29"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0017",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"15:36"
        },
        {
          "nom":"Les Simianes",
          "horaire":"15:44"
        },
        {
          "nom":"Denis Papin",
          "horaire":"15:57"
        },
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"16:02"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0016",
      "arrets":[
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"16:02"
        },
        {
          "nom":"Denis Papin",
          "horaire":"16:11"
        },
        {
          "nom":"Les Simianes",
          "horaire":"16:22"
        },
        {
          "nom":"Clos Jouvin",
          "horaire":"16:29"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"16:29"
        },
        {
          "nom":"Regulation - Clos Jouvin",
          "horaire":"16:29"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0017",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"16:40"
        },
        {
          "nom":"Les Simianes",
          "horaire":"16:48"
        },
        {
          "nom":"Denis Papin",
          "horaire":"17:00"
        },
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"17:08"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0016",
      "arrets":[
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"17:08"
        },
        {
          "nom":"Denis Papin",
          "horaire":"17:18"
        },
        {
          "nom":"Les Simianes",
          "horaire":"17:29"
        },
        {
          "nom":"Clos Jouvin",
          "horaire":"17:09"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"17:09"
        },
        {
          "nom":"Regulation - Clos Jouvin",
          "horaire":"17:09"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0017",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"17:47"
        },
        {
          "nom":"Les Simianes",
          "horaire":"17:55"
        },
        {
          "nom":"Denis Papin",
          "horaire":"18:07"
        },
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"18:15"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0016",
      "arrets":[
        {
          "nom":"La Rampe Centre-Ville",
          "horaire":"18:15"
        },
        {
          "nom":"Denis Papin",
          "horaire":"18:25"
        },
        {
          "nom":"Les Simianes",
          "horaire":"18:36"
        },
        {
          "nom":"Clos Jouvin",
          "horaire":"18:43"
        }
      ]
    },
    {
      "type":"course",
      "gir":"0001",
      "arrets":[
        {
          "nom":"Clos Jouvin",
          "horaire":"18:43"
        },
        {
          "nom":"Vif - Autocars Grindler",
          "horaire":"19:03"
        }
      ]
    },
  ]
}

/*
Todo list :
MAJ Rendu quali de la planchette (via CTRL+P)
  → Enlever header et left pannel
MAJ Edition des éléments
MAJ Dupliquer un élément
MAJ Import<>Export
MAJ Choix entre horaire type num de voiture et num de Course
MAJ Horaire type Déplacement
*/