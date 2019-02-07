var express = require('express');
var router = express.Router();

/* variables */
var numquestion; // indice du numero de question en cours (de 1 à 20)
var idquestions=[];// Ids des question 1 a 10
var choixj1=[];// choix des question 1 à 10
var choixj2=[];// choix des question 11 à 20


/* GET page jeu */
router.get('/jeu', function(req, res) {
    numquestion+=1;
    var db = req.db;
    var collection = db.get('usercollection');
    var number=0; 
    
    if(numquestion <=10) //10 premieres questions (proposition aléatoire)
    {
      number = Math.floor(Math.random() * 95) + 1 ; //Numero aléatoire pour choisir la proposition 
      collection.find({'Id': number.toString()},{},function(e,docs){
          res.render('jeu', {"jeu" : docs,
          numero : numquestion});
      });//recupération des proposition dans la base
    }
   
    if(numquestion >10)//10 dernieres questions (meme proposition ue les 10 precedentes)
    {
      number= idquestions[numquestion-10];
      
      collection.find({'Id': number},{},function(e,docs){
        res.render('jeu', {"jeu" : docs,
        numero : numquestion});
      });
    } 
  });
  
/* POST to retour Service */
//recuperation des données de la page jeu via methode post
router.post('/retour', function(req, res) {

  // variables de retour de la page jeu
  var num = req.body.num;
  var id = req.body.id;
  var choix = req.body.choix;

  if(numquestion<10)//apelle d'une nouvelle page de jeu
  {
    idquestions[num]=id;
    choixj1[num-1]=choix;
    res.redirect("jeu"); 
  }else{
    if(numquestion==10)//lancement de la page de changement de joueur
    {
      idquestions[num]=id;
      choixj1[num-1]=choix;
      res.redirect("AccueilPartie2");
    }
    if(numquestion>10 && numquestion<20)//apelle d'une nouvelle page de jeu
    {
      choixj2[num-11]=choix;
      res.redirect("jeu");
    }
    if(numquestion==20)//lancement de la page de resultat
    {
      choixj2[num-11]=choix;
      res.redirect("Resultat");
    }    
  }
});

//page de crédits
router.get('/Credits',function(req,res) {
  res.sendfile('./views/Credits.html');
})

//Page de résultats
router.get('/Resultat',function(req,res) {
  var db = req.db;
  var gage = db.get('gage');
  var poucentage=0

  //calcul du score
  for(i=0;i<10;i++){
    if(choixj1[i]==choixj2[i])
    {
      poucentage+=10;
    }
  }
  //recuperation d'un gage aléatoire et lancement de la page de résultat
  number = Math.floor(Math.random() * 38) + 1 ;
  gage.find({'id': number.toString()},{},function(e,docs){
    res.render('Resultat', { 'Resultat' : docs, j1Choix : choixj1, j2Choix : choixj2, pourcen : poucentage });
});

})

//page de passage au joueur numéro 2
router.get('/AccueilPartie2',function(req,res) {
 
  res.sendfile('./views/AccueilPartie2.html');
})

//page d'acceuil
router.get('/',function(req,res) {
  //initialisation des variable en début de partie
  numquestion =0;
  idquestions=[];
  choixj1=[];
  choixj2=[];
  res.sendfile('./views/Accueil.html');
})


module.exports = router;