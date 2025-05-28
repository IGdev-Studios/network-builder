const debug = {
  "basics": true,
  "importToLS": false,
  "exportToLS": false,
  "supprToLS": true,
  "popupSystem": false,
  "buildHoraires": false,
}
// Variables DEBUG, à modifier au besoin
// Basics = toutes les fonctions de base de la page
// ImportToLS = sauvegarde des données dans le localStorage
// ExportToLS = chargement des données depuis le localStorage
// PopupSystem = gestion des popups
// BuildHoraires = construction des horaires et de la planchette

/* Au chargenment de la page */

window.onload = function(){
  debug.basics?console.log("Chargement de la page"):null
  debug.basics?console.log("Debug activé",debug):null
  // console log des élements de debug

  data=document.querySelector("#data")
 
/* Bouton PDF DESACTIVÉ. IMPRESSION EN MEILLEURE QUALITEE VIA CTRL+P*/


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
      changeHorairePopup(e.value)
    }
  })
  document.querySelectorAll('#typeSauvegarde').forEach((e)=>{
    e.onchange = function(){
      if (e.value == 'newSave'){
        document.querySelector('#saveNameDiv').style.display = "block"
      }else{
        document.querySelector('#saveNameDiv').style.display = "none"
      }
    }
  })
}
///////////////////////////////
////// FIN WINDOW.ONLOAD //////
///////////////////////////////

//
// Fonctions de la page
//

/**
* Ouvrir la Popup
* @param {string} popupId - ID de la popup (sans le #)
*/
function showPopup(popupId,action=undefined) {
  debug.popupSystem?console.log("Ouvrir popup "+popupId):null

  document.querySelector("#"+popupId).style.display = "block";

  if (popupId == 'horairePopup' && action == 'edit') {
    document.querySelectorAll('.hNew').forEach((e)=>{e.style.display = "none"})
    document.querySelectorAll('.hEdit').forEach((e)=>{e.style.display = ""})
    // On affiche les éléments de la popup d'édition
    // on préremplit les champs avec les valeurs du JSON
    
  }else if ((popupId == 'horairePopup' && action == 'new')||(popupId == 'horairePopup' && action == undefined)) {
    document.querySelectorAll('.hNew').forEach((e)=>{e.style.display = ""})
    document.querySelectorAll('.hEdit').forEach((e)=>{e.style.display = "none"})
    if (popupId == 'horairePopup') {
      stopsArray = []
      document.querySelector('#typeHoraire').value = ""
      document.querySelector('#horaire').innerHTML = "Veuillez selectionner une catégorie ci-dessus"
      document.querySelectorAll('#typeHoraire>option').forEach((e)=>{
        e.removeAttribute('selected')
      })
      document.querySelector('#typeHoraire>option[value=placeholder]').setAttribute('selected','')
    }
  }

  if (popupId == 'savePopup') {
    // On vérifie si la catégorie de sauvegarde du LS existe
    if (localStorage.getItem('nbt_sauvegardes_planchettes') == undefined) {
      localStorage.setItem('nbt_sauvegardes_planchettes','')
    }
    // On charge les noms de sauvegardes existantes dans le select
    let saveSelect = document.querySelector('#saveGroup');
    saveSelect.innerHTML = "";
    if (localStorage.getItem('nbt_sauvegardes_planchettes') == '') {
      saveSelect.innerHTML = `<option value="newSave" disabled>Aucune sauvegarde enregistrée</option>`
    }else{
      let saves = JSON.parse(localStorage.getItem('nbt_sauvegardes_planchettes'));
      debug.importToLS?console.log("Sauvegardes existantes",saves):null      
      saves.forEach((save)=>{
        let option = document.createElement('option');
        option.value = save.nom;
        option.innerHTML = save.nom;
        saveSelect.appendChild(option);
      })
    }
  }

  if (popupId == 'loadPopup') {
    document.querySelector('#loadTypeDefaut').selected = true
    // On vérifie si la catégorie de sauvegarde du LS existe
    if (localStorage.getItem('nbt_sauvegardes_planchettes') == undefined) {
      localStorage.setItem('nbt_sauvegardes_planchettes','')
    }
    // On charge les noms de sauvegardes existantes dans le select
    let saveSelect = document.querySelector('#loadGroup');
    saveSelect.innerHTML = "";
    if (localStorage.getItem('nbt_sauvegardes_planchettes') == '') {
      saveSelect.innerHTML = `<option value="newSave" disabled>Aucune sauvegarde enregistrée</option>`
    }else{
      let saves = JSON.parse(localStorage.getItem('nbt_sauvegardes_planchettes'));
      debug.exportToLS?console.log("Sauvegardes existantes",saves):null
      saves.forEach((save)=>{
        let option = document.createElement('option');
        option.value = save.nom;
        option.innerHTML = save.nom;
        saveSelect.appendChild(option);
      })
    }
    if (action == 'deleteSave'){
      // On affiche le bouton de suppression de sauvegarde
      document.querySelectorAll('.saveD').forEach((e)=>{e.style.display = "inline"})
      document.querySelectorAll('.saveL').forEach((e)=>{e.style.display = "none"})
      document.querySelector('#loadPopup').querySelector('h2').innerHTML = "Supprimer une sauvegarde"
    }else{
      // On cache le bouton de suppression de sauvegarde
      document.querySelectorAll('.saveD').forEach((e)=>{e.style.display = "none"})
      document.querySelectorAll('.saveL').forEach((e)=>{e.style.display = "inline"})
      document.querySelector('#loadPopup').querySelector('h2').innerHTML = "Charger une sauvegarde"
    }
  }
}
/**
* Fermer la Popup
* @param {string} popupId - ID de la popup (sans le #)
*/
function hidePopup(popupId) {
  debug.popupSystem?console.log("Fermer popup "+popupId):null
  document.querySelector("#"+popupId).style.display = "none";
}
/**
* Changer le type d'élement dans la popup d'ajout d'élément
* @param {element} element Élément en question
* @param {string} valeur Type de l'élément à rajouter
*/
function changeHorairePopup(valeur,mode=undefined,data=undefined) {
  document.querySelector('#horaire').innerHTML = ""
  if (mode == 'edit') {
    document.querySelectorAll('#typeHoraire>option').forEach((e)=>{
      e.removeAttribute('selected')
    })
    document.querySelector('#typeHoraire>option[value='+valeur+']').setAttribute('selected','')  
  }
  
  switch (valeur) {
    case "voiture":
      debug.buildHoraires?console.log("Voiture"):null
      document.querySelector('#horaire').innerHTML = `
      Ligne <input name="voitLigne" type="text"><br>
      N° de voiture <input name="voitNum" type="text">`
      if (mode == 'edit') {
        document.querySelector('input[name="voitLigne"]').setAttribute('value',data.ligne)
        document.querySelector('input[name="voitNum"]').setAttribute('value',data.numero)
      }
    break;
    case "course":
      debug.buildHoraires?console.log("Course"):null
      reloadStops(data)
    break;
    case "coupure":
      debug.buildHoraires?console.log("Coupure"):null
      document.querySelector('#horaire').innerHTML = `
      Heure de début <input name="coupDeb" type="time"><br>
      Heure de fin <input name="coupFin" type="time">`
      if (mode == 'edit') {
        document.querySelector('input[name="coupDeb"]').setAttribute('value',data.heureDebut)
        document.querySelector('input[name="coupFin"]').setAttribute('value',data.heureFin)
      }
    break;
    case "note":
      debug.buildHoraires?console.log("Note"):null
      document.querySelector('#horaire').innerHTML = `
      <textarea name="notes" cols="40" rows="4" placeholder="Entrez vos notes ici..."></textarea>`
      if (mode == 'edit') {
        document.querySelector('textarea[name="notes"]').innerHTML = data.note
      }
    break;
    default:
      window.alert("Erreur dans la mise à jour du popup : Valeur non définie ",valeur);
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
  let dup = document.createElement('button');
  let mdn = document.createElement('button');
  let mup = document.createElement('button');
  let del = document.createElement('button');
  let bar = document.createElement('div');
  edt.innerHTML = '<img src="./res/svg/pencil.svg" height="15"/>' //"Edit" ✏
  dup.innerHTML = '<img src="./res/svg/duplicate.svg" height="15"/>' //"Dupliquer" 📋
  mdn.innerHTML = '<img src="./res/svg/arrow-down-drop-circle.svg" height="15"/>' //"↓"
  mup.innerHTML = '<img src="./res/svg/arrow-up-drop-circle.svg" height="15"/>' //"↑"
  del.innerHTML = '<img src="./res/svg/delete.svg" height="15"/>' //"▬"
  // Fonction BTN Edit
  // Quand le bouton Edit est cliqué
  edt.addEventListener("click", function(){
    editID = i
    console.log(horaire)
    showPopup('horairePopup','edit')
    changeHorairePopup(jsonSave.horaires[i].type,'edit',jsonSave.horaires[i])
  })
  // Fonction BTN Dupliquer
  dup.addEventListener("click", function(){
    editID = i
    duplicateHoraire()
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
    reloadHoraires()
  })
  bar.className = "h_btnBar"
  bar.appendChild(edt)
  bar.appendChild(dup)
  bar.appendChild(mdn)
  bar.appendChild(mup)
  bar.appendChild(del);
  return bar;
}
/**
* Re-génère les arrêts en cours d'ajout
*/
function reloadStops(data=undefined) {
  stopsList = document.querySelector('#horaire')
  stopsList.innerHTML = '';
  if (data != undefined) {
    // console.log("Data arrets",data.arrets)
    stopsArray = data.arrets
    data.gir!= undefined?girCode = data.gir:null;
    data.courseId!= undefined?courseCode = data.courseId:null;
  }
  if (stopsArray.length == 0) {
    stopsArray.push({nom:"",horaire:"--:--"});
    reloadStops()
  } else {
    for(let i = 0; i < stopsArray.length; i++){
      let e = stopsArray[i];

      // Création des élements nécessaires
      let divInput = document.createElement('div');
      let inputArret = document.createElement('input'); inputArret.type = 'text';
      let inputTime = document.createElement('input'); inputTime.type = 'time';
        
      // Input nom arrêt
      debug.buildHoraires?console.log("Nom arret",e.nom):null
      inputArret.value = e.nom;
      inputArret.placeholder = "Nom de l'arrêt";
      inputArret.addEventListener('change', () => {
        let index = stopsArray.indexOf(e);
        stopsArray[index].nom = inputArret.value;
      })
      divInput.appendChild(inputArret);
      
      // Input temps arrêt
      debug.buildHoraires?console.log("Horaire arret",e.horaire):null
      inputTime.value = e.horaire;
      inputTime.addEventListener('change', () => {
        let index = stopsArray.indexOf(e);
        stopsArray[index].horaire = inputTime.value;
      })
      divInput.appendChild(inputTime);   
      
      // Bouton ajout arrêt en dessous
      let pdn = document.createElement('button');pdn.innerHTML = '<img src="./res/svg/table-row-plus-after.svg" height="20"/>';
      pdn.addEventListener('click', () => {
        stopsArray.splice(i+1, 0, {nom:"",horaire:"--:--"});
        reloadStops();
      })
      divInput.appendChild(pdn);
       
      // Bouton ajout arrêt au dessus
      let pup = document.createElement('button');pup.innerHTML = '<img src="./res/svg/table-row-plus-before.svg" height="20"/>';
      pup.addEventListener('click', () => {
        stopsArray.splice(i, 0, {nom:"",horaire:"--:--"});
        reloadStops();
      })
      divInput.appendChild(pup);
       
      // Boutton suppression arrêt
      let del = document.createElement('button');del.innerHTML = '<img src="./res/svg/table-row-remove.svg" height="20"/>';
      del.addEventListener('click', () => {
        stopsArray.splice(i, 1);
        reloadStops();
      })
      divInput.appendChild(del);
        
      stopsList.appendChild(divInput);
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
  
    stopsList.prepend(divCourse,divGir)
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
 *  Dupliquer un horaire
 */
function duplicateHoraire() {
  i = editID
  debug.buildHoraires?console.log("Dupliquer l'horaire n°",i):null
  // On duplique l'horaire
  let horaireToDuplicate = jsonSave.horaires[i];
  // On ajoute l'horaire dupliqué après l'horaire d'origine
  jsonSave.horaires.splice(i+1, 0, JSON.parse(JSON.stringify(horaireToDuplicate)));
  // On recharge les horaires
  reloadHoraires();
}

/**
* Executer l'ajout d'une case d'horaires depuis la popup d'ajout.
* Traite le format depuis la popup et l'insère dans la variable de sauvegarde
* @param {string} action - Action à effectuer : add ou edit
*/
function executeHorairePopup(action) {
  i = editID
  debug.buildHoraires?console.log("Exécution de la popup d'horaire, action:",action,"i:",i):null

  let typeAjout = document.querySelector('#typeHoraire').value;
  let addStopList = stopsArray
  let horaireToExecute = {}
  
  switch (typeAjout) {
    case "voiture":
      horaireToExecute = {
        "type": "voiture",
        "ligne" : document.querySelector('input[name="voitLigne"]').value,
        "numero": document.querySelector('input[name="voitNum"]').value,
      }
      reloadHoraires()
    break;
    case "course":
      horaireToExecute = {
        "type": "course",
        "courseId":`${document.querySelector('input[name="courseNum"]').value}`,
        "gir":document.querySelector('input[name="codeGir"]').value,
        "arrets":addStopList
      }
      stopsArray = [];girCode = "";courseCode = ""
      reloadStops()
      reloadHoraires()
    break;        
    case "coupure":
      horaireToExecute = {
        "type": "coupure",
        "heureDebut": document.querySelector('input[name="coupDeb"]').value,
        "heureFin": document.querySelector('input[name="coupFin"]').value
      }
      reloadHoraires()
    break;
    case "note":
      horaireToExecute = {
        "type": "note",
        "note": document.querySelector('textarea[name="notes"]').value
      }
      reloadHoraires()
    break;
    default:
      window.alert("erreur dans la mise à jour du popup");
    break;
  }
  // Si action == 'add' : on ajoute un horaire
  // Si action == 'edit' : on modifie un horaire
  switch (action) {
    case "edit":
      jsonSave.horaires.splice(i, 1);
      jsonSave.horaires.splice(i, 0, horaireToExecute);
      reloadHoraires()
    break;
    case "add":
      jsonSave.horaires.push(horaireToExecute);
      reloadHoraires()
    break;
    default:
      window.alert("Erreur dans l'exécution de la popup : action non définie")
    break;
  }
  // On cache la popup
  hidePopup('horairePopup')
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
function executeSavePopup() {
  let saves = localStorage.getItem('nbt_sauvegardes_planchettes');

  // On vérifie si la catégorie de sauvegarde du LS existe
  if (saves == undefined || saves == '' || saves == "") {
    saves = [];
  } else {
    saves = JSON.parse(saves);
  }
  if (document.querySelector('#typeSauvegarde').value == 'newSave') {
    // On récupère le nom de la sauvegarde
    let nomSauvegarde = document.querySelector('#saveName').value
    if (nomSauvegarde == "") {
      nomSauvegarde = window.prompt("Veuillez entrer un nom de sauvegarde.")      

    }
    // on sauvegarde la sauvegarde
    saves.push({
      "nom": nomSauvegarde,
      "data": JSON.stringify(jsonSave)
    })
    
    // on sauvegarde dans le localStorage
    debug.importToLS?console.log("Nouvelle sauvegarde",saves[saves.length-1]):null
    localStorage.setItem('nbt_sauvegardes_planchettes',JSON.stringify(saves));
    // window.alert(`Sauvegarde ${nomSauvegarde} effectuée avec succès !`)
  }else{
    let nomSauvegarde = document.querySelector('#typeSauvegarde').value

    // on cherche la sauvegarde dans le tableau
    let saveIndex = saves.findIndex((save) => save.nom == nomSauvegarde);
    if (saveIndex == -1) {
      window.alert("Erreur : la sauvegarde n'existe pas.")
      return;
    }

    // on modifie la sauvegarde
    saves[saveIndex].data = JSON.stringify(jsonSave);
    debug.importToLS?console.log("Sauvegarde modifiée",saves[saveIndex]):null

    // on sauvegarde dans le localStorage
    localStorage.setItem('nbt_sauvegardes_planchettes',JSON.stringify(saves));
    // window.alert(`Sauvegarde ${nomSauvegarde} effectuée avec succès !`)
  }
  debug.importToLS?console.log("Sauvegardes existantes",saves):null
  // on réinitialise le champ de nom de sauvegarde
  document.querySelector('#saveName').value = ""
  hidePopup('savePopup')
}
function executeLoadPopup() {
  let saves = localStorage.getItem('nbt_sauvegardes_planchettes');
  // On vérifie si la catégorie de sauvegarde du LS existe
  if(saves==undefined||saves==''){saves=[];}else{saves=JSON.parse(saves);}
  if (document.querySelector('#typeChargement').value == 'newLoad') {
    // On génère une planchette vide
    jsonSave = {
      "entreprise": "",
      "dateVigeur": "",
      "service": {
        "idService": "",
        "periode": "",
        "typeService": ""
      },
      "horaires": [],
      "recap": []
    }
    // on ajuste les infos de service
    document.querySelector('#ser_id').value = ""
    document.querySelector('#ser_peri').value = ""
    document.querySelectorAll(`input[name="typeService"]`).forEach((e)=>{
      e.checked = false
    })
    // on ajuste la date de vigeur
    document.querySelector('#i2').value = ""
    // on ajuste l'entreprise
    document.querySelector('#i1').value = ""
    debug.exportToLS?console.log("Planchette vide générée",jsonSave):null
    // On recharge la planchette
    reloadPlanchette(jsonSave)
    // On cache la popup
    hidePopup('loadPopup')

  }else{
    let nomSauvegarde = document.querySelector('#typeChargement').value
    console.log("Chargement de la sauvegarde",nomSauvegarde)
    // on cherche la sauvegarde dans le tableau
    let saveIndex = saves.findIndex((save) => save.nom == nomSauvegarde);
    debug.exportToLS?console.log(saveIndex):null
    if (saveIndex == -1) {
      window.alert("Erreur : la sauvegarde n'existe pas.")
      return;
    }
    // on charge la sauvegarde
    jsonSave = JSON.parse(saves[saveIndex].data);
    debug.exportToLS?console.log("Sauvegarde chargée",jsonSave):null
    // on ajuste le récap
    recapArray = jsonSave.recap
    // on ajuste les infos de service
    document.querySelector('#ser_id').value = jsonSave.service.idService
    document.querySelector('#ser_peri').value = jsonSave.service.periode
    document.querySelector(`#ser_${jsonSave.service.typeService}`).checked = true
    // on ajuste la date de vigeur
    date = jsonSave.dateVigeur.split('/')
    document.querySelector('#i2').value = `${date[2]}-${date[1]}-${date[0]}` // YYYY-MM-DD
    // on ajuste l'entreprise
    document.querySelector('#i1').value = jsonSave.entreprise
    // on ajuste la couleur de fond (PAS UTILISÉE)
    // document.querySelector('#i0').value = jsonSave.couleurFond
    // document.querySelector("#render").style = `background-color: ${jsonSave.couleurFond}`
    // on recharge la planchette
    reloadPlanchette(jsonSave)

    hidePopup('loadPopup')
  }
}
function executeDelPopup() {
  let saves = localStorage.getItem('nbt_sauvegardes_planchettes');
  // On vérifie si la catégorie de sauvegarde du LS existe
  if(saves==undefined||saves==''){saves=[];}else{saves=JSON.parse(saves);}
  let nomSauvegarde = document.querySelector('#typeChargement').value
  // on cherche la sauvegarde dans le tableau
  let saveIndex = saves.findIndex((save) => save.nom == nomSauvegarde);
  debug.supprToLS?console.log(saveIndex):null
  if (saveIndex == -1) {
    window.alert("Erreur : la sauvegarde n'existe pas.")
    return;
  }
  // on supprime la sauvegarde
  saves.splice(saveIndex, 1);
  debug.supprToLS?console.log("Sauvegarde supprimée",saves):null
  // on sauvegarde dans le localStorage
  localStorage.setItem('nbt_sauvegardes_planchettes',JSON.stringify(saves));

  hidePopup('loadPopup')
  
}
/** Re-générer la planchette avec le contenu du JSON de la page.
* A appeller lorsque le JSON est modifié
* @param {*}jsonData : Objet JSON des données de la planchette
*/
function reloadPlanchette(jsonData = jsonSave) {
  debug.buildHoraires?console.log("Regénération de la planchette avec les données suivantes",jsonData):null
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
      case 'voiture':
        debug.buildHoraires?console.groupCollapsed("Voiture"):null
        addType.innerHTML = "Voiture"
        poidsItem = 1
        addDiv.className = "h_main h_num_voiture"
        addValue.innerHTML = horaire.ligne+" - "+horaire.numero
        addDiv.appendChild(addType)
        addDiv.appendChild(addValue)
      break;
        
      case 'coupure':
        debug.buildHoraires?console.groupCollapsed("Coupure"):null
        poidsItem = 1
        addDiv.className = "h_main h_coupure"
        addType.innerHTML = "Coupure"
        addValue.innerHTML = horaire.heureDebut+"   "+horaire.heureFin
        addDiv.appendChild(addType)
        addDiv.appendChild(addValue)
      break;
      
      case 'note':
        debug.buildHoraires?console.groupCollapsed("Note"):null
        poidsItem = 1
        addDiv.className = "h_main h_note"
        addText = document.createTextNode(horaire.note)
        addDiv.appendChild(addText)
      break;
      case 'course':
      debug.buildHoraires?console.group("Course"):null
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
        addCourseId.innerHTML += "Course "
        addCourseId.innerHTML += horaire.courseId
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
      debug.buildHoraires?console.log(addGir):null
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
      console.log("Value in switch statement:", horaire.type); 
      console.error("Erreur Switch : type d'horaire indéfini")
      window.alert("Erreur Switch : type d'horaire indéfini")
      break;
    }
    // Après génération, ajouter la barre de boutons
    addDiv.appendChild(addBtnBar)
    debug.buildHoraires?console.log(addDiv):null
    
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
    debug.buildHoraires?console.groupEnd():null
  })
}

// Fonctions de sauvegarde et chargement localStorage
// A court terme, on sauvegarde une planchette dans le localStorage du navigateur
// A moyen terme, on devrait pouvoir sauvegarder plusieurs planchettes dans le localStorage du navigateur
// A long terme, on devrait pouvoir sauvegarder dans un fichier JSON
// A très long terme, on devrait pouvoir sauvegarder dans une base de données distante

//
// Variables page
//

stopsArray = []; // Tableau des arrêts de la course en cours d'édition
girCode = ""; // Code de girouette de la course en cours d'édition
courseCode = ""; // Code de course de la course en cours d'édition
recapArray = []; // Tableau des récapitulatifs de service en cours d'édition
editID = -1; // ID de l'horaire en cours d'édition

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
      "debutService":["06:40"],// Heure(s) début service
      "lieuDebut":["VORD"],   // Lieu(x) début de service
      "heureDebut":["06:55"],  // Heure(s) départ dépot
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
    {"type": "voiture","ligne": "11","numero":"1"},
    {
      "type":"course",
      "arrets":[
        {"nom":"Dépôt Vorrepe","horaire":"05:54"},
        {"nom":"VOIRON Gare R Sud","horaire":"06:08",},
      ]
    },
    {
      "type":"course","courseId":"00-3","gir":'1101',
      "arrets":[
        {"nom":"VOIRON Gare R Sud","horaire":"06:10",},
        {"nom":"Oxford","horaire":"06:30",},
        {"nom":"Chavant","horaire":"06:50",},
        {"nom":"Cloyères","horaire":"06:10",},
        {"nom":"Longs Prés","horaire":"07:29",}
      ]
    },
    {
      "type":"course",
      "arrets":[
        {"nom":"Longs Prés","horaire":"07:29",},
        {"nom":"Longs Prés","horaire":"07:30",}
      ]
    },
    {
      "type":"course","courseId":"07-11","gir":'1112',
      "arrets":[
        {"nom":"Longs Prés","horaire":"07:40",},
        {"nom":"Cloyères","horaire":"08:00",},
        {"nom":"Chavant","horaire":"08:20",},
        {"nom":"Oxford","horaire":"08:40",},
        {"nom":"Centr'Alp 2","horaire":"08:55"},
        {"nom":"VOIRON Gare R Sud","horaire":"09:06",}
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
    {"type":"coupure","heureDebut":"12:38","heureFin":"16:30"},
    {"type": "voiture","ligne": "12","numero":"4"},
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
        {"nom":"GRENOBLE Gare R","horaire":"17:55",},
        {"nom":"Chavant","horaire":"18:10",},
        {"nom":"BRIGNOUD Centre","horaire":"18:25",},
        {"nom":"GONCELIN Gare","horaire":"18:40",}
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
      "debutService": "05:53",
      "lieuDebut": "AURAY",
      "heureDebut": "06:08",
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
      "type": "voiture",
      "ligne": "U",
      "numero":"01"
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "AURAY VOYAGES",
          "horaire": "06:08"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "06:16"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "06:16"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "06:18"
        },
        {
          "nom": "Pasteur",
          "horaire": "06:21"
        },
        {
          "nom": "UJM",
          "horaire": "06:26"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "06:28"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "06:31"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "06:31"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "06:31"
        },
        {
          "nom": "UJM",
          "horaire": "06:34"
        },
        {
          "nom": "Pasteur",
          "horaire": "06:39"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "06:42"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "06:44"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "06:44"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "06:45"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "06:48"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "06:50"
        },
        {
          "nom": "Pasteur",
          "horaire": "06:53"
        },
        {
          "nom": "UJM",
          "horaire": "06:58"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:00"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:03"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:03"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:03"
        },
        {
          "nom": "UJM",
          "horaire": "7:06"
        },
        {
          "nom": "Pasteur",
          "horaire": "07:11"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "07:14"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "07:16"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "07:16"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "07:17"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "07:27"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "07:29"
        },
        {
          "nom": "Pasteur",
          "horaire": "07:32"
        },
        {
          "nom": "UJM",
          "horaire": "07:37"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:42"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:42"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:42"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "07:42"
        },
        {
          "nom": "UJM",
          "horaire": "07:45"
        },
        {
          "nom": "Pasteur",
          "horaire": "07:50"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "07:53"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "07:55"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "07:55"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "07:56"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "08:04"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "08:06"
        },
        {
          "nom": "Pasteur",
          "horaire": "08:09"
        },
        {
          "nom": "UJM",
          "horaire": "08:14"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "08:16"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "08:20"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "08:20"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "08:20"
        },
        {
          "nom": "UJM",
          "horaire": "08:23"
        },
        {
          "nom": "Pasteur",
          "horaire": "08:28"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "08:31"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "08:33"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "08:33"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "08:34"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "08:53"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "08:55"
        },
        {
          "nom": "Pasteur",
          "horaire": "08:58"
        },
        {
          "nom": "UJM",
          "horaire": "09:02"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:05"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:08"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:08"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:08"
        },
        {
          "nom": "UJM",
          "horaire": "09:11"
        },
        {
          "nom": "Pasteur",
          "horaire": "09:16"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "09:19"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "09:21"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "09:21"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "09:22"
        }
      ]
    },
    {
      "type": "course",
      "gir": "261",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "09:26"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "09:28"
        },
        {
          "nom": "Pasteur",
          "horaire": "09:31"
        },
        {
          "nom": "UJM",
          "horaire": "09:36"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:38"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:41"
        },
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:41"
        }
      ]
    },
    {
      "type": "course",
      "gir": "262",
      "arrets": [
        {
          "nom": "Restaurant Universitaire",
          "horaire": "09:41"
        },
        {
          "nom": "UJM",
          "horaire": "09:44"
        },
        {
          "nom": "Pasteur",
          "horaire": "09:49"
        },
        {
          "nom": "Beaulieu Rosa Parks",
          "horaire": "09:52"
        },
        {
          "nom": "Maison Blanche",
          "horaire": "09:54"
        }
      ]
    },
    {
      "type": "course",
      "arrets": [
        {
          "nom": "Maison Blanche",
          "horaire": "09:54"
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
      "type": "voiture",
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
ADD Import JSON
ADD Export JSON
ADD Import GTFS - priorité basse
ADD Export GTFS - priorité basse

MAJ Notes par courses, séparées des notes globales
MAJ Type Horaire : Déplacement
MAJ Remplacer les popup par un panneau latéral ?
  → un panneau qui s'affiche à la place des boutons si un élement
  est selectionné et qui sert à la modification des parties
  → A voir comment gérer avec les différents cadres en haut de la feuille

SUP enlever le bouton PDF, à remplacer par une indication CTRL+P
*/