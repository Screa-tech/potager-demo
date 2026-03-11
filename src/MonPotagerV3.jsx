import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const REGIONS = [
  { id:"nord",     label:"Nord & Nord-Est",      icon:"🌧️", desc:"Climat continental" },
  { id:"ouest",    label:"Ouest & Bretagne",      icon:"🌊", desc:"Doux et humide" },
  { id:"centre",   label:"Centre & Île-de-France",icon:"🌤️", desc:"4 saisons marquées" },
  { id:"sudouest", label:"Sud-Ouest",             icon:"☀️", desc:"Étés chauds" },
  { id:"sudest",   label:"Sud-Est & PACA",        icon:"🔆", desc:"Méditerranéen" },
  { id:"montagne", label:"Montagne & Altitude",   icon:"⛰️", desc:"Saison courte" },
];

const EXPOSITIONS = [
  { id:"plein-soleil", label:"Plein soleil", icon:"☀️", desc:"+6h/jour",  multiplier:1.0 },
  { id:"mi-ombre",     label:"Mi-ombre",     icon:"⛅", desc:"3-6h/jour", multiplier:0.7 },
  { id:"ombre",        label:"À l'ombre",    icon:"🌥️", desc:"-3h/jour",  multiplier:0.4 },
];

const VEGETABLES = [
  { id:"radis",      name:"Radis",             emoji:"🔴", season:["printemps"],          difficulty:"facile",   m2pp:0.5, qty:"1 rang",      kgPerM2:4,  priceKg:3.5, waterDays:1, tip:"Prêt en 3-4 semaines, parfait pour débuter !", warning:null, conservation:"Réfrigérateur 1 semaine",        balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:["laitue","carottes"] },
  { id:"laitue",     name:"Laitue",            emoji:"🥬", season:["printemps","automne"], difficulty:"facile",   m2pp:1,   qty:"4 pieds",     kgPerM2:3,  priceKg:2.5, waterDays:2, tip:"Pousse vite, récolte feuille par feuille.",     warning:null, conservation:"Réfrigérateur 3-5 jours",        balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:["radis","carottes"] },
  { id:"petitspois", name:"Petits pois",       emoji:"🫛", season:["printemps"],          difficulty:"facile",   m2pp:2,   qty:"1 rang 2m",   kgPerM2:1.5,priceKg:5,   waterDays:3, tip:"Grimpe sur un filet, décoratif et délicieux.", warning:"Récolte courte — prévois d'autres légumes en parallèle.", conservation:"Congélation facile", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:["carottes","tomates"] },
  { id:"epinards",   name:"Épinards",          emoji:"🌿", season:["printemps","automne"], difficulty:"facile",   m2pp:1,   qty:"2 rangs",     kgPerM2:2,  priceKg:4,   waterDays:3, tip:"Supporte le froid, idéal en inter-saison.",    warning:null, conservation:"Blanchi et congelé 12 mois",      balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:[] },
  { id:"carottes",   name:"Carottes",          emoji:"🥕", season:["printemps","été"],     difficulty:"moyen",    m2pp:1.5, qty:"2 rangs",     kgPerM2:4,  priceKg:2,   waterDays:3, tip:"Sol meuble et profond requis.",                warning:"Difficile en sol argileux ou caillouteux.", conservation:"Cave sableuse 6 mois",          balconOk:false, sunNeeded:"plein-soleil",permaBenefits:["tomates","laitue"] },
  { id:"tomates",    name:"Tomates",           emoji:"🍅", season:["été"],                 difficulty:"moyen",    m2pp:2,   qty:"3-4 pieds",   kgPerM2:8,  priceKg:3.5, waterDays:2, tip:"La reine du potager ! Attache-les à des tuteurs.", warning:"Sensibles au mildiou par temps humide.", conservation:"Coulis, conserves, séchées", balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["basilic","petitspois"] },
  { id:"courgettes", name:"Courgettes",        emoji:"🥒", season:["été"],                 difficulty:"facile",   m2pp:2,   qty:"2 pieds",     kgPerM2:10, priceKg:2,   waterDays:2, tip:"Très productif — souvent plus que prévu !",    warning:"2 pieds suffisent, sinon vous serez envahis !", conservation:"Congélation, bocaux", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:[] },
  { id:"haricots",   name:"Haricots verts",    emoji:"🫘", season:["été"],                 difficulty:"facile",   m2pp:2,   qty:"1 rang 2m",   kgPerM2:3,  priceKg:4,   waterDays:3, tip:"Très prolifique et facile à récolter.",        warning:null, conservation:"Blanchi et congelé 12 mois",      balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["carottes"] },
  { id:"concombre",  name:"Concombre",         emoji:"🥒", season:["été"],                 difficulty:"moyen",    m2pp:1.5, qty:"2-3 pieds",   kgPerM2:5,  priceKg:2,   waterDays:1, tip:"Adore la chaleur, arrose régulièrement.",      warning:"Peu productif si manque d'eau ou de chaleur.", conservation:"Lacto-fermentation, cornichons", balconOk:true, sunNeeded:"plein-soleil",permaBenefits:["basilic"] },
  { id:"poivron",    name:"Poivron",           emoji:"🫑", season:["été"],                 difficulty:"difficile",m2pp:1.5, qty:"3 pieds",     kgPerM2:4,  priceKg:4,   waterDays:2, tip:"Plante du soleil, idéal en Sud.",              warning:"Peu productif dans les régions fraîches.", conservation:"Congelé, bocaux marinés", balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["basilic"] },
  { id:"basilic",    name:"Basilic",           emoji:"🌱", season:["été"],                 difficulty:"moyen",    m2pp:0.3, qty:"2-3 pieds",   kgPerM2:2,  priceKg:15,  waterDays:1, tip:"Associe-le aux tomates, ils s'aiment !",       warning:"Très sensible au froid et aux courants d'air.", conservation:"Pesto congelé, huile aromatisée", balconOk:true, sunNeeded:"plein-soleil",permaBenefits:["tomates","concombre"] },
  { id:"courge",     name:"Courge / Potimarron",emoji:"🎃",season:["été","automne"],       difficulty:"facile",   m2pp:4,   qty:"1-2 pieds",   kgPerM2:6,  priceKg:2.5, waterDays:3, tip:"Prend de la place mais se conserve tout l'hiver !", warning:"Nécessite beaucoup d'espace.", conservation:"Lieu frais et sec 6 mois", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:[] },
  { id:"poireaux",   name:"Poireaux",          emoji:"🥦", season:["automne"],             difficulty:"facile",   m2pp:1,   qty:"1 rang",      kgPerM2:5,  priceKg:3,   waterDays:5, tip:"Reste en terre tout l'hiver, récolte au besoin.", warning:null, conservation:"En terre jusqu'en février",    balconOk:false, sunNeeded:"mi-ombre",    permaBenefits:["carottes"] },
  { id:"betterave",  name:"Betterave",         emoji:"🫀", season:["automne"],             difficulty:"facile",   m2pp:1,   qty:"1 rang",      kgPerM2:4,  priceKg:2,   waterDays:4, tip:"Mange aussi les fanes comme des épinards !",   warning:null, conservation:"Cave sableuse 4 mois",           balconOk:false, sunNeeded:"plein-soleil",permaBenefits:[] },
  { id:"mache",      name:"Mâche & Roquette",  emoji:"🌿", season:["hiver","printemps"],   difficulty:"facile",   m2pp:0.5, qty:"2 rangs",     kgPerM2:1.5,priceKg:8,   waterDays:5, tip:"Résiste au gel, se sème en août.",             warning:null, conservation:"Réfrigérateur 3-4 jours",        balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:[] },
  { id:"ail",        name:"Ail",               emoji:"🧄", season:["hiver"],               difficulty:"facile",   m2pp:0.5, qty:"1 rang",      kgPerM2:2,  priceKg:8,   waterDays:7, tip:"Plante en automne, récolte en juin.",          warning:null, conservation:"Tresses suspendues 12 mois",      balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["tomates","carottes"] },
  { id:"oignon",     name:"Oignon",            emoji:"🧅", season:["printemps","été"],     difficulty:"facile",   m2pp:1,   qty:"1 rang",      kgPerM2:4,  priceKg:1.5, waterDays:5, tip:"La base de toute cuisine, indispensable !",    warning:null, conservation:"Tresses, lieu sec, 8 mois",       balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["carottes","betterave"] },
  { id:"fraises",    name:"Fraises",           emoji:"🍓", season:["printemps","été"],     difficulty:"facile",   m2pp:1,   qty:"6 pieds",     kgPerM2:3,  priceKg:6,   waterDays:2, tip:"Parfait en pot ou colonne sur balcon !",       warning:null, conservation:"Congélation, confiture",          balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["ail","oignon"] },
  // Nouveaux légumes
  { id:"brocoli",    name:"Brocoli",           emoji:"🥦", season:["automne"],             difficulty:"moyen",    m2pp:1.5, qty:"3 pieds",     kgPerM2:3,  priceKg:3.5, waterDays:3, tip:"Récolte la tête centrale, puis les pousses latérales repoussent !", warning:null, conservation:"Blanchi et congelé 12 mois", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:["salade","oignon"] },
  { id:"celeri",     name:"Céleri-rave",       emoji:"🟤", season:["automne"],             difficulty:"difficile",m2pp:1.5, qty:"4 pieds",     kgPerM2:3,  priceKg:3,   waterDays:2, tip:"Plante qui mérite la patience — saveur incomparable.", warning:"Croissance très lente (6 mois). Semis en février obligatoire.", conservation:"Cave fraîche 3 mois", balconOk:false, sunNeeded:"mi-ombre",    permaBenefits:["poireaux"] },
  { id:"fenouil",    name:"Fenouil",           emoji:"🌿", season:["été","automne"],       difficulty:"moyen",    m2pp:1,   qty:"4 pieds",     kgPerM2:3,  priceKg:4,   waterDays:3, tip:"Utilise le bulbe, les fanes et les graines — zéro déchet !", warning:"Inhibe la croissance des tomates — ne pas planter côte à côte.", conservation:"Réfrigérateur 5 jours", balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:[] },
  { id:"pomdeterre", name:"Pomme de terre",    emoji:"🥔", season:["printemps","été"],     difficulty:"facile",   m2pp:2,   qty:"1 rang",      kgPerM2:5,  priceKg:1.5, waterDays:4, tip:"Plante les yeux vers le haut, butte au fur et à mesure.", warning:null, conservation:"Cave sombre et sèche 6 mois", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:["haricots"] },
  { id:"persil",     name:"Persil",            emoji:"🌱", season:["printemps","été","automne"],difficulty:"facile",m2pp:0.2,qty:"2-3 pieds",  kgPerM2:2,  priceKg:12,  waterDays:3, tip:"Coupe régulièrement pour stimuler la repousse.",       warning:null, conservation:"Congelé haché, huile aromatisée", balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:["tomates","carottes","asperge"] },
  { id:"ciboulette", name:"Ciboulette",        emoji:"🌿", season:["printemps","été","automne"],difficulty:"facile",m2pp:0.2,qty:"1 touffe",   kgPerM2:2,  priceKg:10,  waterDays:3, tip:"Vivace ! Elle revient chaque année sans effort.",       warning:null, conservation:"Congelée hachée",                balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:["carottes","tomates"] },
  { id:"navet",      name:"Navet",             emoji:"🟣", season:["automne","hiver"],     difficulty:"facile",   m2pp:1,   qty:"2 rangs",     kgPerM2:4,  priceKg:2,   waterDays:4, tip:"Oublie le navet amer de ta cantine — frais du jardin c'est autre chose !", warning:null, conservation:"Cave fraîche 2 mois", balconOk:false, sunNeeded:"mi-ombre",    permaBenefits:["poireaux"] },
  { id:"potiron",    name:"Potiron",           emoji:"🧡", season:["été","automne"],       difficulty:"facile",   m2pp:4,   qty:"1 pied",      kgPerM2:8,  priceKg:2,   waterDays:3, tip:"Un seul pied peut produire plusieurs courges de 5-10kg !", warning:"Plante très envahissante, laisse-lui de l'espace.", conservation:"Lieu frais et sec jusqu'à 6 mois", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:[] },
  { id:"blette",     name:"Blette",            emoji:"🌈", season:["été","automne"],       difficulty:"facile",   m2pp:1,   qty:"4 pieds",     kgPerM2:4,  priceKg:3,   waterDays:3, tip:"Récolte les feuilles au fur et à mesure, colorées et savoureuses.", warning:null, conservation:"Blanchi et congelé", balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:[] },
  { id:"endive",     name:"Endive / Chicorée", emoji:"🥬", season:["automne","hiver"],     difficulty:"difficile",m2pp:1,   qty:"1 rang",      kgPerM2:3,  priceKg:4,   waterDays:5, tip:"Le forçage en cave est une expérience unique et satisfaisante.", warning:"Processus en 2 étapes (plein air + forçage en cave). Technique mais très gratifiant.", conservation:"Réfrigérateur 2 semaines", balconOk:false, sunNeeded:"plein-soleil",permaBenefits:[] },
  { id:"tomates-cerises", name:"Tomates cerises", emoji:"🍒", season:["été"],             difficulty:"facile",   m2pp:1,   qty:"2-3 pieds",   kgPerM2:5,  priceKg:6,   waterDays:2, tip:"Idéales sur balcon ! Moins de maladies que les grosses tomates.", warning:null, conservation:"À température ambiante, consommer rapidement", balconOk:true,  sunNeeded:"plein-soleil",permaBenefits:["basilic"] },
  { id:"menthe",     name:"Menthe",            emoji:"🌿", season:["printemps","été","automne"],difficulty:"facile",m2pp:0.3,qty:"1-2 pieds",  kgPerM2:3,  priceKg:12,  waterDays:2, tip:"Très facile et parfumée. Attention : elle envahit tout !", warning:"Plante en pot isolé pour éviter qu'elle colonise tout le potager.", conservation:"Séchée, sirop, congelée", balconOk:true,  sunNeeded:"mi-ombre",    permaBenefits:[] },
];

const PLANTING_CALENDAR = {
  radis:      {semisInt:[2,3,4,8],   repiquage:[],      recolte:[4,5,6,9,10]},
  laitue:     {semisInt:[2,3,4,8,9], repiquage:[4,5,9], recolte:[5,6,7,10,11]},
  petitspois: {semisInt:[2,3,4],     repiquage:[],      recolte:[5,6,7]},
  epinards:   {semisInt:[2,3,8,9],   repiquage:[],      recolte:[4,5,10,11]},
  carottes:   {semisInt:[3,4,5,6],   repiquage:[],      recolte:[7,8,9,10]},
  tomates:    {semisInt:[2,3],       repiquage:[4,5],   recolte:[7,8,9]},
  courgettes: {semisInt:[4,5],       repiquage:[5,6],   recolte:[7,8,9]},
  haricots:   {semisInt:[5,6,7],     repiquage:[],      recolte:[7,8,9]},
  concombre:  {semisInt:[4,5],       repiquage:[5,6],   recolte:[7,8,9]},
  poivron:    {semisInt:[2,3],       repiquage:[5,6],   recolte:[8,9]},
  basilic:    {semisInt:[3,4,5],     repiquage:[5,6],   recolte:[6,7,8,9]},
  courge:     {semisInt:[4,5],       repiquage:[5,6],   recolte:[9,10]},
  poireaux:   {semisInt:[2,3,4],     repiquage:[6,7],   recolte:[10,11,12,1,2]},
  betterave:  {semisInt:[4,5,6],     repiquage:[],      recolte:[8,9,10]},
  mache:      {semisInt:[7,8,9],     repiquage:[],      recolte:[10,11,12,1,2,3]},
  ail:        {semisInt:[],          repiquage:[10,11],  recolte:[6,7]},
  oignon:     {semisInt:[2,3],       repiquage:[4,5],   recolte:[7,8]},
  fraises:    {semisInt:[2,3],       repiquage:[4,9],   recolte:[5,6,7,8]},
  // Nouveaux légumes
  brocoli:    {semisInt:[4,5,6],     repiquage:[6,7],   recolte:[9,10,11]},
  celeri:     {semisInt:[2,3],       repiquage:[5,6],   recolte:[9,10,11]},
  fenouil:    {semisInt:[4,5,6],     repiquage:[6,7],   recolte:[8,9,10]},
  pomdeterre: {semisInt:[],          repiquage:[3,4,5], recolte:[7,8,9]},
  persil:     {semisInt:[3,4,5],     repiquage:[5,6],   recolte:[5,6,7,8,9,10]},
  ciboulette: {semisInt:[3,4],       repiquage:[5],     recolte:[4,5,6,7,8,9,10]},
  navet:      {semisInt:[7,8,9],     repiquage:[],      recolte:[10,11,12,1]},
  potiron:    {semisInt:[4,5],       repiquage:[5,6],   recolte:[9,10]},
  blette:     {semisInt:[4,5,6],     repiquage:[6,7],   recolte:[7,8,9,10,11]},
  endive:     {semisInt:[5,6],       repiquage:[],      recolte:[11,12,1,2]},
  "tomates-cerises":{semisInt:[2,3], repiquage:[4,5],   recolte:[6,7,8,9,10]},
  menthe:     {semisInt:[3,4],       repiquage:[4,5],   recolte:[5,6,7,8,9,10]},
};

const SEASONS = [
  {id:"printemps",label:"Printemps",icon:"🌸",months:"Mars — Mai",  color:"#7fb069"},
  {id:"été",      label:"Été",      icon:"☀️",months:"Juin — Août", color:"#e8a838"},
  {id:"automne",  label:"Automne",  icon:"🍂",months:"Sept — Nov",  color:"#c45e2a"},
  {id:"hiver",    label:"Hiver",    icon:"❄️",months:"Déc — Fév",   color:"#5b8fa8"},
];
const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const WATERING_TIPS = {1:"Quotidien",2:"Tous les 2j",3:"2-3x/semaine",4:"2x/semaine",5:"1x/semaine",7:"Peu gourmand"};

// ─── SHOP DATA ───────────────────────────────────────────────────────────────

const SHOP_CATEGORIES = ["Kits", "Graines BIO", "Outils & Protection"];

const BASE_PRODUCTS = [
  // KITS
  {id:"kit-debutant",  cat:"Kits", name:"Kit Débutant Complet",      emoji:"🌱", price:49.90, oldPrice:69, desc:"Tout pour démarrer : 5 sachets de graines BIO, tuteurs, étiquettes, guide illustré.", badge:"⭐ Bestseller", commission:0.20, forVeg:[], always:true},
  {id:"kit-balcon",    cat:"Kits", name:"Kit Balcon & Terrasse",      emoji:"🪴", price:39.90, oldPrice:55, desc:"Jardinières empilables, terreau spécial pot, 4 variétés de graines BIO adaptées aux pots.", badge:"🏙️ Balcon", commission:0.20, forVeg:[], balconOnly:true, always:false},
  {id:"kit-potager",   cat:"Kits", name:"Kit Potager Pleine Terre",   emoji:"🏡", price:44.90, oldPrice:60, desc:"Ficelle de tuteurage, 6 piquets bambou, étiquettes ardoise, guide plantation BIO.", badge:"🌿 Pleine terre", commission:0.20, forVeg:[], jardinOnly:true, always:false},
  // GRAINES
  {id:"graines-tomates",  cat:"Graines BIO", name:"Graines Tomates BIO",    emoji:"🍅", price:4.50,  desc:"Variété ancienne Marmande, certifié AB, 0.5g.", commission:0.25, forVeg:["tomates"]},
  {id:"graines-laitue",   cat:"Graines BIO", name:"Graines Laitue BIO",     emoji:"🥬", price:3.90,  desc:"Mélange 4 variétés, certifié AB, 2g.", commission:0.25, forVeg:["laitue"]},
  {id:"graines-courgette",cat:"Graines BIO", name:"Graines Courgette BIO",  emoji:"🥒", price:3.90,  desc:"Variété Ronde de Nice, certifié AB, 3g.", commission:0.25, forVeg:["courgettes"]},
  {id:"graines-radis",    cat:"Graines BIO", name:"Graines Radis BIO",      emoji:"🔴", price:2.90,  desc:"Radis 18 jours, certifié AB, 5g.", commission:0.25, forVeg:["radis"]},
  {id:"graines-carotte",  cat:"Graines BIO", name:"Graines Carotte BIO",    emoji:"🥕", price:3.50,  desc:"Variété Nantaise améliorée, certifié AB, 3g.", commission:0.25, forVeg:["carottes"]},
  {id:"graines-basilic",  cat:"Graines BIO", name:"Graines Basilic BIO",    emoji:"🌱", price:2.90,  desc:"Grand vert, certifié AB, 1g.", commission:0.25, forVeg:["basilic"]},
  {id:"graines-haricots", cat:"Graines BIO", name:"Graines Haricots BIO",   emoji:"🫘", price:4.20,  desc:"Haricot nain Contender, certifié AB, 20g.", commission:0.25, forVeg:["haricots"]},
  {id:"graines-epinards", cat:"Graines BIO", name:"Graines Épinards BIO",   emoji:"🌿", price:3.20,  desc:"Variété Monstrueux de Viroflay, certifié AB, 5g.", commission:0.25, forVeg:["epinards"]},
  {id:"graines-poivron",  cat:"Graines BIO", name:"Graines Poivron BIO",    emoji:"🫑", price:4.90,  desc:"Rouge Lamuyo, certifié AB, 0.5g.", commission:0.25, forVeg:["poivron"]},
  {id:"graines-pois",     cat:"Graines BIO", name:"Graines Petits Pois BIO",emoji:"🫛", price:4.50,  desc:"Téléphone nain, certifié AB, 30g.", commission:0.25, forVeg:["petitspois"]},
  {id:"graines-courge",   cat:"Graines BIO", name:"Graines Potimarron BIO", emoji:"🎃", price:3.90,  desc:"Rouge vif d'Étampes, certifié AB, 2g.", commission:0.25, forVeg:["courge"]},
  {id:"graines-fraises",  cat:"Graines BIO", name:"Plants Fraises remontantes",emoji:"🍓", price:8.90,desc:"Barquette de 6 plants, variété Mara des Bois.", commission:0.20, forVeg:["fraises"]},
  // OUTILS
  {id:"gants-jardinage", cat:"Outils & Protection", name:"Gants Jardinage Débutant", emoji:"🧤", price:12.90, desc:"Latex antidérapant, taille réglable, lavables.", badge:"✓ Indispensable", commission:0.22, forVeg:[], always:true},
  {id:"truelle-set",     cat:"Outils & Protection", name:"Set 3 Outils Manche Bois", emoji:"🪻", price:18.90, oldPrice:25, desc:"Truelle, transplantoir, griffe — manche bois naturel certifié.", commission:0.22, forVeg:[], always:true},
  {id:"arrosoir",        cat:"Outils & Protection", name:"Arrosoir 5L Bec Fin",      emoji:"🚿", price:16.90, desc:"Idéal pour jeunes plants et semis, bec amovible.", commission:0.22, forVeg:[], always:true},
  {id:"tuteurs",         cat:"Outils & Protection", name:"Tuteurs Bambou x20",       emoji:"🪵", price:9.90,  desc:"40cm, naturels et biodégradables.", commission:0.22, forVeg:["tomates","courgettes","concombre","petitspois"]},
  {id:"filet-protection",cat:"Outils & Protection", name:"Filet Anti-Insectes 2×5m", emoji:"🕸️", price:14.90, desc:"Protège vos cultures sans produits chimiques.", commission:0.22, forVeg:[], always:true},
];

function estimateProduction(selectedVeg, profile, settings) {
  const sunMult = EXPOSITIONS.find(e => e.id === settings.exposition)?.multiplier ?? 1;
  let totalKg = 0, totalValue = 0;
  selectedVeg.forEach(id => {
    const v = VEGETABLES.find(x => x.id === id);
    if (!v) return;
    const kg = v.m2pp * profile.persons * v.kgPerM2 * sunMult;
    totalKg += kg;
    totalValue += kg * v.priceKg;
  });
  return {
    totalKg: Math.round(totalKg),
    totalValue: Math.round(totalValue),
    meals: Math.round(totalKg * 3),
    autonomyPct: Math.min(95, Math.round((totalKg / (profile.persons * 120)) * 100)),
  };
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --soil:#5c3d2e;--soil-light:#8b5e3c;--leaf:#3d6b3f;--leaf-light:#6a9e5c;
  --leaf-pale:#c8dfc2;--sun:#e8a838;--sun-light:#f5d98a;--cream:#faf6ef;
  --parchment:#f0e8d8;--text:#2c1f0f;--muted:#7a6552;
  --autumn:#c45e2a;--winter:#5b8fa8;
  --sh:0 4px 24px rgba(92,61,46,.10);--sh-sm:0 2px 8px rgba(92,61,46,.08);
}
body{background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--text);}
.app{min-height:100vh;background:var(--cream);
  background-image:radial-gradient(ellipse at 20% 0%,rgba(125,176,105,.12) 0%,transparent 60%),
  radial-gradient(ellipse at 80% 100%,rgba(232,168,56,.10) 0%,transparent 60%);}

/* HEADER */
.hdr{background:var(--soil);padding:12px 18px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 2px 16px rgba(0,0,0,.2);}
.hdr-left{display:flex;align-items:center;gap:9px;}
.hdr-logo{font-size:22px;}
.hdr-title{font-family:'Playfair Display',serif;color:var(--sun-light);font-size:17px;font-weight:600;}
.hdr-sub{color:rgba(245,217,138,.5);font-size:9px;letter-spacing:.06em;}
.hdr-actions{display:flex;gap:6px;align-items:center;}
.icon-btn{background:rgba(255,255,255,.12);border:none;border-radius:9px;
  padding:7px 9px;color:var(--sun-light);font-size:15px;cursor:pointer;transition:.15s;position:relative;}
.icon-btn:hover{background:rgba(255,255,255,.22);}
.cart-badge{position:absolute;top:-4px;right:-4px;background:var(--sun);color:var(--soil);
  border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;
  display:flex;align-items:center;justify-content:center;}

/* BOTTOM TAB BAR */
.tab-bar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:600px;background:white;border-top:1px solid var(--leaf-pale);
  display:flex;z-index:150;padding-bottom:env(safe-area-inset-bottom);}
.tab-item{flex:1;padding:10px 4px 8px;display:flex;flex-direction:column;align-items:center;
  gap:2px;cursor:pointer;border:none;background:none;transition:.15s;border-top:2px solid transparent;}
.tab-item.active{border-top-color:var(--leaf);}
.tab-item-icon{font-size:20px;}
.tab-item-label{font-size:9px;font-weight:500;color:var(--muted);}
.tab-item.active .tab-item-label{color:var(--leaf);}

/* STEP NAV (inside potager flow) */
.steps-nav{display:flex;background:var(--parchment);border-bottom:1px solid rgba(92,61,46,.1);overflow-x:auto;scrollbar-width:none;}
.steps-nav::-webkit-scrollbar{display:none;}
.step-tab{flex:1;min-width:68px;padding:9px 5px;text-align:center;font-size:9px;font-weight:500;
  color:var(--muted);border-bottom:2px solid transparent;transition:.2s;white-space:nowrap;}
.step-tab.active{color:var(--leaf);border-bottom-color:var(--leaf);background:rgba(106,158,92,.07);}
.step-tab.done{color:var(--leaf-light);}
.step-tab-icon{font-size:14px;display:block;margin-bottom:2px;}

/* CONTENT */
.content{padding:18px 16px 120px;max-width:600px;margin:0 auto;}

/* CARDS */
.card{background:white;border-radius:16px;padding:18px;box-shadow:var(--sh-sm);
  border:1px solid rgba(92,61,46,.06);margin-bottom:13px;}
.card-title{font-family:'Playfair Display',serif;font-size:19px;color:var(--soil);margin-bottom:5px;}
.card-sub{color:var(--muted);font-size:12px;line-height:1.5;margin-bottom:16px;}

/* HERO */
.hero{text-align:center;padding:24px 14px 18px;}
.hero-emoji{font-size:56px;display:block;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.15));}
.hero-title{font-family:'Playfair Display',serif;font-size:24px;color:var(--soil);line-height:1.2;margin-bottom:7px;}
.hero-title em{color:var(--leaf);font-style:italic;}
.hero-tag{display:inline-block;background:var(--leaf);color:white;border-radius:20px;
  padding:4px 13px;font-size:10px;font-weight:500;margin-bottom:9px;letter-spacing:.04em;}
.hero-desc{color:var(--muted);font-size:12px;line-height:1.6;margin-bottom:18px;}

/* INPUTS */
.lbl{font-size:12px;font-weight:500;color:var(--muted);margin-bottom:6px;display:block;}
.ifield{width:100%;padding:12px 14px;border:1.5px solid var(--leaf-pale);border-radius:12px;
  font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);background:var(--cream);
  outline:none;transition:.2s;margin-bottom:13px;appearance:none;}
.ifield:focus{border-color:var(--leaf);}

/* STEPPER */
.stepper{display:flex;align-items:center;gap:11px;margin-bottom:13px;}
.step-btn{width:42px;height:42px;border-radius:50%;border:2px solid var(--leaf-pale);
  background:white;font-size:19px;color:var(--leaf);cursor:pointer;display:flex;
  align-items:center;justify-content:center;transition:.15s;font-weight:700;flex-shrink:0;}
.step-btn:hover{background:var(--leaf);color:white;border-color:var(--leaf);}
.step-val{flex:1;text-align:center;font-family:'Playfair Display',serif;font-size:30px;color:var(--soil);}
.step-unit{font-size:11px;color:var(--muted);display:block;margin-top:-4px;}

/* CHOICE GRID */
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:13px;}
.cgrid-3{grid-template-columns:repeat(3,1fr);}
.ccrd{padding:12px 9px;border-radius:12px;border:2px solid var(--leaf-pale);
  background:white;cursor:pointer;transition:.15s;text-align:center;}
.ccrd:hover{border-color:var(--leaf-light);background:rgba(106,158,92,.05);}
.ccrd.sel{border-color:var(--leaf);background:rgba(61,107,63,.08);}
.ccrd-icon{font-size:20px;display:block;margin-bottom:3px;}
.ccrd-name{font-size:11px;font-weight:500;color:var(--text);}
.ccrd-desc{font-size:9px;color:var(--muted);margin-top:1px;}

/* SURFACE */
.surf-vis{background:linear-gradient(135deg,#8b6e4a,#6b5236);border-radius:12px;
  padding:16px;text-align:center;margin-bottom:8px;position:relative;overflow:hidden;}
.surf-vis::before{content:'';position:absolute;inset:0;
  background-image:repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,.03) 18px,rgba(255,255,255,.03) 19px),
  repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(255,255,255,.03) 18px,rgba(255,255,255,.03) 19px);}
.surf-m2{font-family:'Playfair Display',serif;font-size:32px;color:var(--sun-light);position:relative;}
.surf-lbl{font-size:10px;color:rgba(245,217,138,.65);position:relative;}

/* TOGGLE */
.toggle-row{display:flex;align-items:center;justify-content:space-between;
  padding:13px;background:rgba(61,107,63,.07);border-radius:12px;margin-bottom:13px;}
.toggle-info{flex:1;}
.toggle-ttl{font-size:13px;font-weight:500;color:var(--leaf);}
.toggle-desc{font-size:10px;color:var(--muted);margin-top:1px;}
.tswitch{position:relative;width:42px;height:24px;flex-shrink:0;cursor:pointer;}
.tswitch input{opacity:0;width:0;height:0;}
.tslider{position:absolute;inset:0;background:var(--leaf-pale);border-radius:12px;transition:.3s;}
.tslider::before{content:'';position:absolute;height:18px;width:18px;left:3px;bottom:3px;
  background:white;border-radius:50%;transition:.3s;box-shadow:0 1px 4px rgba(0,0,0,.2);}
input:checked+.tslider{background:var(--leaf);}
input:checked+.tslider::before{transform:translateX(18px);}

/* SEASON TABS */
.stabs{display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;padding-bottom:3px;scrollbar-width:none;}
.stabs::-webkit-scrollbar{display:none;}
.stab{flex-shrink:0;padding:7px 13px;border-radius:20px;border:2px solid transparent;
  background:var(--parchment);font-size:11px;font-weight:500;cursor:pointer;transition:.15s;
  display:flex;align-items:center;gap:5px;}
.stab:hover{background:var(--leaf-pale);}
.stab.active{background:var(--leaf);color:white;}

/* VEG GRID */
.vgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.vcrd{padding:12px 10px;border-radius:12px;border:2px solid var(--leaf-pale);
  background:white;cursor:pointer;transition:.15s;position:relative;}
.vcrd:hover{border-color:var(--leaf-light);transform:translateY(-1px);box-shadow:var(--sh-sm);}
.vcrd.sel{border-color:var(--leaf);background:rgba(61,107,63,.06);}
.vcrd.wcrd{border-color:rgba(200,80,0,.22);}
.vcrd.wcrd.sel{border-color:var(--autumn);background:rgba(196,94,42,.05);}
.vemoji{font-size:24px;display:block;margin-bottom:4px;}
.vname{font-size:12px;font-weight:500;color:var(--text);margin-bottom:2px;}
.vdiff{font-size:9px;}
.vdiff.facile{color:var(--leaf);}
.vdiff.moyen{color:#e8a838;}
.vdiff.difficile{color:var(--autumn);}
.vcheck{position:absolute;top:6px;right:6px;width:17px;height:17px;border-radius:50%;
  background:var(--leaf);color:white;font-size:9px;display:flex;align-items:center;justify-content:center;}
.vwarn{position:absolute;top:6px;right:6px;font-size:10px;}
.pbadge{position:absolute;bottom:6px;right:6px;font-size:8px;background:rgba(61,107,63,.12);
  color:var(--leaf);border-radius:4px;padding:2px 4px;}

/* DETAIL PANEL */
.dpanel{background:var(--parchment);border-radius:11px;padding:13px;margin-top:7px;
  grid-column:1/-1;animation:fadeIn .2s ease;}
.tip-box{background:rgba(61,107,63,.07);border-left:3px solid var(--leaf);
  border-radius:0 9px 9px 0;padding:8px 12px;font-size:11px;color:var(--leaf);line-height:1.4;margin-bottom:6px;}
.warn-box{background:rgba(196,94,42,.08);border:1px solid rgba(196,94,42,.22);
  border-radius:9px;padding:8px 11px;font-size:11px;color:var(--autumn);margin-bottom:6px;line-height:1.4;}
.rm-btn{font-size:10px;color:var(--muted);background:none;border:none;cursor:pointer;text-decoration:underline;padding:0;}

/* GAUGE */
.gauge{background:var(--parchment);border-radius:11px;padding:13px;margin-bottom:11px;}
.gauge-row{display:flex;justify-content:space-between;margin-bottom:5px;}
.gauge-lbl{font-size:11px;color:var(--muted);}
.gauge-val{font-size:12px;font-weight:500;}
.gauge-bar{height:6px;background:var(--leaf-pale);border-radius:3px;overflow:hidden;}
.gauge-fill{height:100%;border-radius:3px;transition:width .4s ease;}
.gok{background:var(--leaf);}
.gwarn{background:#e8a838;}
.gover{background:var(--autumn);}

/* CHIPS */
.chips{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:13px;}
.chip{background:white;border:1.5px solid var(--leaf-pale);border-radius:18px;
  padding:4px 10px;font-size:11px;color:var(--text);display:flex;align-items:center;gap:3px;}
.chipx{color:var(--muted);cursor:pointer;font-size:13px;margin-left:2px;}

/* BUTTONS */
.btn{width:100%;padding:14px;background:var(--leaf);color:white;border:none;
  border-radius:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;
  cursor:pointer;transition:.15s;display:flex;align-items:center;justify-content:center;gap:7px;}
.btn:hover{background:var(--soil);transform:translateY(-1px);box-shadow:var(--sh);}
.btn:disabled{background:var(--leaf-pale);color:var(--muted);cursor:not-allowed;transform:none;}
.btn-outline{padding:11px 16px;background:transparent;color:var(--leaf);
  border:2px solid var(--leaf);border-radius:11px;font-family:'DM Sans',sans-serif;
  font-size:13px;cursor:pointer;transition:.15s;}
.btn-outline:hover{background:var(--leaf);color:white;}
.btn-sun{background:var(--sun);color:var(--soil);}
.btn-sun:hover{background:var(--sun-light);}

/* VIRAL CARD */
.viral{background:linear-gradient(145deg,var(--leaf),#2a5e2c);border-radius:18px;
  padding:22px 18px;color:white;margin-bottom:13px;position:relative;overflow:hidden;}
.viral::before{content:'🌿';position:absolute;right:-10px;bottom:-18px;font-size:90px;opacity:.12;transform:rotate(-15deg);}
.viral-ttl{font-family:'Playfair Display',serif;font-size:14px;color:rgba(255,255,255,.7);margin-bottom:3px;}
.viral-name{font-family:'Playfair Display',serif;font-size:20px;color:var(--sun-light);margin-bottom:14px;}
.vstats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px;}
.vstat{background:rgba(255,255,255,.12);border-radius:11px;padding:11px;}
.vstat-n{font-family:'Playfair Display',serif;font-size:26px;color:white;line-height:1;}
.vstat-l{font-size:9px;color:rgba(255,255,255,.6);margin-top:2px;}
.vautonomy{background:rgba(255,255,255,.1);border-radius:11px;padding:11px 13px;margin-bottom:13px;}
.vbar-bg{height:5px;background:rgba(255,255,255,.2);border-radius:3px;margin-top:5px;}
.vbar{height:100%;background:var(--sun-light);border-radius:3px;transition:width .8s ease;}
.vbar-txt{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.65);margin-top:3px;}

/* CALENDAR */
.cal-wrap{overflow-x:auto;margin:0 -3px;padding-bottom:5px;}
.cal-tbl{width:100%;min-width:490px;border-collapse:separate;border-spacing:2px;}
.cal-tbl th{font-size:8px;font-weight:500;color:var(--muted);text-align:center;
  padding:4px 1px;background:var(--parchment);border-radius:3px;}
.cal-vname{font-size:10px;font-weight:500;padding:5px 6px;white-space:nowrap;display:flex;align-items:center;gap:3px;}
.ccell{width:26px;height:22px;border-radius:3px;background:var(--parchment);}
.csemis{background:var(--leaf-pale);}
.crepi{background:var(--sun-light);}
.crec{background:var(--leaf);}
.cleg{display:flex;gap:9px;flex-wrap:wrap;margin-top:7px;}
.cleg-item{display:flex;align-items:center;gap:4px;font-size:9px;color:var(--muted);}
.cleg-dot{width:10px;height:10px;border-radius:2px;}

/* WATERING */
.w-row{display:flex;align-items:center;justify-content:space-between;
  padding:9px 11px;background:rgba(91,143,168,.07);border-radius:9px;border-left:3px solid var(--winter);margin-bottom:7px;}
.w-veg{display:flex;align-items:center;gap:7px;font-size:12px;}
.w-freq{font-size:10px;color:var(--winter);font-weight:500;}
.w-dots{display:flex;gap:2px;margin-top:2px;}
.w-dot{width:5px;height:5px;border-radius:50%;background:var(--leaf-pale);}
.w-dot.on{background:var(--winter);}

/* PERMA */
.perma-pair{background:rgba(61,107,63,.07);border-radius:9px;padding:9px 11px;
  display:flex;align-items:center;gap:9px;font-size:12px;color:var(--leaf);margin-bottom:7px;}

/* REC CARD */
.rec-card{background:linear-gradient(135deg,var(--soil),var(--soil-light));
  border-radius:15px;padding:16px;color:white;margin-bottom:11px;}
.rec-ttl{font-family:'Playfair Display',serif;font-size:16px;color:var(--sun-light);margin-bottom:7px;}
.rec-row{display:flex;justify-content:space-between;padding:4px 0;
  border-bottom:1px solid rgba(255,255,255,.1);font-size:11px;}
.rec-row:last-child{border-bottom:none;}

/* ── BOUTIQUE ── */
.shop-header{background:linear-gradient(135deg,var(--soil),#3a2518);
  border-radius:16px;padding:20px 18px;color:white;margin-bottom:13px;position:relative;overflow:hidden;}
.shop-header::after{content:'🛒';position:absolute;right:12px;bottom:-8px;font-size:60px;opacity:.15;}
.shop-ttl{font-family:'Playfair Display',serif;font-size:22px;color:var(--sun-light);margin-bottom:4px;}
.shop-sub{font-size:12px;color:rgba(255,255,255,.6);margin-bottom:12px;}
.shop-alert{background:rgba(232,168,56,.15);border:1px solid rgba(232,168,56,.4);
  border-radius:9px;padding:10px 12px;font-size:11px;color:var(--sun-light);}

/* SHOP CATEGORY TABS */
.cat-tabs{display:flex;gap:6px;margin-bottom:14px;overflow-x:auto;scrollbar-width:none;}
.cat-tabs::-webkit-scrollbar{display:none;}
.cat-tab{flex-shrink:0;padding:7px 14px;border-radius:18px;border:1.5px solid var(--leaf-pale);
  background:white;font-size:11px;font-weight:500;cursor:pointer;color:var(--muted);transition:.15s;}
.cat-tab:hover{border-color:var(--leaf-light);}
.cat-tab.active{background:var(--leaf);color:white;border-color:var(--leaf);}

/* PRODUCT CARD */
.product-grid{display:flex;flex-direction:column;gap:10px;}
.pcrd{background:white;border-radius:14px;padding:14px;box-shadow:var(--sh-sm);
  border:2px solid rgba(92,61,46,.06);display:flex;gap:12px;position:relative;transition:.15s;}
.pcrd:hover{border-color:var(--leaf-pale);transform:translateY(-1px);}
.pcrd.in-cart{border-color:var(--leaf);background:rgba(61,107,63,.04);}
.pcrd-emoji{font-size:36px;flex-shrink:0;width:50px;text-align:center;padding-top:2px;}
.pcrd-body{flex:1;min-width:0;}
.pcrd-badge{display:inline-block;background:rgba(232,168,56,.15);color:#b07a00;
  border-radius:5px;padding:2px 7px;font-size:9px;font-weight:600;margin-bottom:4px;}
.pcrd-badge.rec{background:rgba(61,107,63,.12);color:var(--leaf);}
.pcrd-name{font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px;}
.pcrd-desc{font-size:11px;color:var(--muted);line-height:1.4;margin-bottom:8px;}
.pcrd-footer{display:flex;align-items:center;justify-content:space-between;}
.pcrd-price{font-family:'Playfair Display',serif;font-size:18px;color:var(--soil);}
.pcrd-old{font-size:11px;color:var(--muted);text-decoration:line-through;margin-left:5px;}
.add-btn{padding:8px 14px;background:var(--leaf);color:white;border:none;border-radius:9px;
  font-size:12px;font-weight:500;cursor:pointer;transition:.15s;flex-shrink:0;}
.add-btn:hover{background:var(--soil);}
.add-btn.added{background:rgba(61,107,63,.15);color:var(--leaf);cursor:default;}
.pcrd-rec-badge{position:absolute;top:10px;right:10px;font-size:9px;
  background:var(--leaf);color:white;border-radius:5px;padding:2px 7px;font-weight:600;}

/* CART */
.cart-footer{background:linear-gradient(to top,white 80%,transparent);padding:14px 16px 16px;}
.cart-summary{background:var(--soil);border-radius:14px;padding:14px 16px;color:white;
  display:flex;align-items:center;justify-content:space-between;cursor:pointer;}
.cart-total{font-family:'Playfair Display',serif;font-size:18px;color:var(--sun-light);}
.cart-count{font-size:11px;color:rgba(255,255,255,.65);}

/* DRAWER */
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;
  display:flex;align-items:flex-end;justify-content:center;}
.drawer{background:white;border-radius:22px 22px 0 0;padding:22px 18px 40px;
  width:100%;max-width:600px;max-height:88vh;overflow-y:auto;animation:slideUp .25s ease;}
.drawer-handle{width:34px;height:3px;background:var(--leaf-pale);border-radius:2px;margin:0 auto 18px;}
.drawer-ttl{font-family:'Playfair Display',serif;font-size:19px;color:var(--soil);margin-bottom:16px;}

/* CART ITEM */
.cart-item{display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid var(--leaf-pale);}
.cart-item:last-child{border-bottom:none;}
.ci-emoji{font-size:28px;}
.ci-body{flex:1;}
.ci-name{font-size:13px;font-weight:500;}
.ci-price{font-size:12px;color:var(--muted);}
.ci-remove{background:none;border:none;color:var(--muted);font-size:18px;cursor:pointer;padding:4px;}

/* SAVE BANNER */
.save-banner{background:rgba(61,107,63,.1);border:1px solid rgba(61,107,63,.2);
  border-radius:11px;padding:10px 13px;display:flex;align-items:center;gap:9px;
  font-size:12px;color:var(--leaf);margin-bottom:11px;}

/* MISC */
.info-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(61,107,63,.10);
  color:var(--leaf);border-radius:7px;padding:5px 9px;font-size:10px;font-weight:500;margin-bottom:9px;}
.sec-ttl{font-family:'Playfair Display',serif;font-size:17px;color:var(--soil);margin-bottom:3px;}
.sec-sub{font-size:11px;color:var(--muted);margin-bottom:13px;}
.teaser{background:var(--parchment);border:1px dashed var(--leaf-pale);border-radius:14px;padding:16px;}
.teaser-ttl{font-size:12px;font-weight:500;color:var(--muted);margin-bottom:8px;}
.teaser-item{font-size:11px;color:var(--muted);padding:4px 0;border-bottom:1px solid rgba(92,61,46,.07);}

@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
.anim{animation:fadeIn .3s ease forwards;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:var(--leaf-pale);border-radius:2px;}
`;

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "monpotager_v3";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export default function MonPotager() {
  const saved = loadState();

  const [tab, setTab]     = useState("potager");   // potager | boutique
  const [step, setStep]   = useState(saved?.step ?? 0);
  const [profile, setProfile] = useState(saved?.profile ?? { persons:2, surface:10, region:"", name:"" });
  const [settings, setSettings] = useState(saved?.settings ?? { type:"jardin", exposition:"plein-soleil", permaculture:true });
  const [selectedVeg, setSelectedVeg] = useState(saved?.selectedVeg ?? []);
  const [activeSeason, setActiveSeason] = useState("printemps");
  const [expandedVeg, setExpandedVeg]   = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart]         = useState(false);
  // Ensure cart is always a {id: qty} object (guards against old array format in localStorage)
  const rawCart = saved?.cart;
  const initCart = rawCart && !Array.isArray(rawCart) && typeof rawCart === "object" ? rawCart : {};
  const [cart, setCart] = useState(initCart);
  const [shopCat, setShopCat] = useState("Tous");
  const [shareMsg, setShareMsg] = useState(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const STEPS = [
    {label:"Bienvenue",icon:"🌱"},
    {label:"Mon jardin",icon:"🏡"},
    {label:"Mes légumes",icon:"🥕"},
    {label:"Mon plan",icon:"📅"},
  ];

  // Persist
  useEffect(() => {
    saveState({ step, profile, settings, selectedVeg, cart });
  }, [step, profile, settings, selectedVeg, cart]);

  const isBalcon = settings.type === "balcon";
  const recSurface = profile.persons * 8;
  const usedSurface = selectedVeg.reduce((a, id) => {
    const v = VEGETABLES.find(x => x.id === id);
    return a + (v ? v.m2pp * profile.persons : 0);
  }, 0);
  const surfaceRatio = usedSurface / (profile.surface || 1);
  const prod = estimateProduction(selectedVeg, profile, settings);

  const permaPairs = [];
  if (settings.permaculture) {
    selectedVeg.forEach(id => {
      const v = VEGETABLES.find(x => x.id === id);
      v?.permaBenefits?.forEach(pid => {
        if (selectedVeg.includes(pid)) {
          const pv = VEGETABLES.find(x => x.id === pid);
          if (!permaPairs.find(p => p.a === pid && p.b === id))
            permaPairs.push({ a:id, b:pid, av:v, bv:pv });
        }
      });
    });
  }

  // Shop products filtered
  const shopProducts = BASE_PRODUCTS.filter(p => {
    if (p.cat !== shopCat) return false;
    if (p.balconOnly && !isBalcon) return false;
    if (p.jardinOnly && isBalcon) return false;
    return true;
  });

  const isRecommended = (p) => p.forVeg?.some(id => selectedVeg.includes(id)) || p.always;
  const cartTotal = Object.entries(cart).reduce((a, [id, qty]) => {
    const p = BASE_PRODUCTS.find(x => x.id === id);
    return a + (p ? p.price * qty : 0);
  }, 0);
  const cartCount = Object.values(cart).reduce((a, q) => a + q, 0);
  const cartQty = (id) => cart[id] ?? 0;

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(c => {
    const next = { ...c };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });
  const deleteFromCart = (id) => setCart(c => { const next = { ...c }; delete next[id]; return next; });
  const toggleCart = (id) => cart[id] ? deleteFromCart(id) : addToCart(id);
  const toggleVeg = (id) => {
    setSelectedVeg(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    setExpandedVeg(ev => ev === id ? null : id);
  };
  const [showOverflowAlert, setShowOverflowAlert] = useState(false);

  const canProceed = () => {
    if (step === 1) return profile.region !== "";
    if (step === 2) return selectedVeg.length >= 3;
    return true;
  };

  const handleNext = () => {
    if (step === 2 && surfaceRatio > 1) {
      setShowOverflowAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowOverflowAlert(false), 4000);
      return;
    }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    saveState({ step, profile, settings, selectedVeg, cart });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleShare = () => {
    const name = profile.name ? `Le potager de ${profile.name}` : "Mon potager";
    const vegEmojis = selectedVeg.slice(0,6).map(id=>VEGETABLES.find(v=>v.id===id)?.emoji||"").join(" ");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#3d6b3f; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'DM Sans',sans-serif; }
.card { background:linear-gradient(145deg,#3d6b3f,#2a5e2c); border-radius:24px; padding:36px 32px; width:380px; color:white; box-shadow:0 20px 60px rgba(0,0,0,.4); }
.logo { font-size:13px; opacity:.7; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px; }
.title { font-family:'Playfair Display',serif; font-size:22px; margin-bottom:4px; }
.sub { font-size:13px; opacity:.7; margin-bottom:24px; }
.vegs { font-size:28px; margin-bottom:24px; letter-spacing:4px; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
.stat { background:rgba(255,255,255,.12); border-radius:14px; padding:14px 16px; }
.stat-n { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:#f5c842; }
.stat-u { font-size:11px; opacity:.5; }
.stat-l { font-size:11px; opacity:.75; margin-top:2px; }
.bar-wrap { margin-bottom:20px; }
.bar-label { display:flex; justify-content:space-between; font-size:12px; opacity:.7; margin-bottom:6px; }
.bar-bg { background:rgba(255,255,255,.15); border-radius:99px; height:8px; }
.bar-fill { background:#f5c842; border-radius:99px; height:8px; }
.footer { text-align:center; font-size:11px; opacity:.5; }
.tag { display:inline-block; background:rgba(255,255,255,.15); border-radius:99px; padding:4px 12px; font-size:11px; margin-bottom:16px; }
</style></head><body>
<div class="card">
  <div class="logo">🌿 MonPotager</div>
  <div class="title">${name}</div>
  <div class="sub">${profile.surface} m² · ${isBalcon?'Balcon':'Jardin'} · ${REGIONS.find(r=>r.id===profile.region)?.label||''}</div>
  <div class="vegs">${vegEmojis}</div>
  <div class="grid">
    <div class="stat"><div class="stat-n">${prod.totalKg}<span class="stat-u">kg</span></div><div class="stat-l">légumes / an</div></div>
    <div class="stat"><div class="stat-n">${prod.totalValue}<span class="stat-u">€</span></div><div class="stat-l">économisés / an</div></div>
    <div class="stat"><div class="stat-n">${prod.meals}</div><div class="stat-l">repas produits</div></div>
    <div class="stat"><div class="stat-n">${selectedVeg.length}</div><div class="stat-l">variétés cultivées</div></div>
  </div>
  <div class="bar-wrap">
    <div class="bar-label"><span>Autonomie alimentaire</span><span>${prod.autonomyPct}%</span></div>
    <div class="bar-bg"><div class="bar-fill" style="width:${prod.autonomyPct}%"></div></div>
  </div>
  <div class="footer">monpotager.app · Calcule le tien en 2 minutes →</div>
</div>
</body></html>`;
    const blob = new Blob([html], {type:"text/html"});
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank", "width=460,height=600");
    if (!w) {
      navigator.clipboard?.writeText(`🌿 Mon ${settings.type} de ${profile.surface}m² produit ${prod.totalKg}kg de légumes/an (~${prod.totalValue}€ économisés) ! Autonomie : ${prod.autonomyPct}% 🥕 #MonPotager`);
      setShareMsg("✓ Texte copié !");
      setTimeout(()=>setShareMsg(null), 2500);
    }
  };

  // Saisonnalité dynamique
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const nowReadyToSow = VEGETABLES.filter(v =>
    selectedVeg.includes(v.id) && PLANTING_CALENDAR[v.id]?.semisInt?.includes(currentMonth)
  );
  const nowReadyToPlant = VEGETABLES.filter(v =>
    selectedVeg.includes(v.id) && PLANTING_CALENDAR[v.id]?.repiquage?.includes(currentMonth)
  );
  const nowReadyToHarvest = VEGETABLES.filter(v =>
    selectedVeg.includes(v.id) && PLANTING_CALENDAR[v.id]?.recolte?.includes(currentMonth)
  );

  const filteredVeg = VEGETABLES.filter(v => {
    if (!v.season.includes(activeSeason)) return false;
    if (isBalcon && !v.balconOk) return false;
    return true;
  });

  // Suggested products for "commander mon potager"
  const suggestedCart = BASE_PRODUCTS.filter(p =>
    isRecommended(p) && (p.cat !== "Graines BIO" || selectedVeg.includes(p.forVeg?.[0]))
  ).slice(0, 8);

  return (
    <>
      <style>{S}</style>
      <div className="app">

        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-left">
            <span className="hdr-logo">🌿</span>
            <div>
              <div className="hdr-title">MonPotager</div>
              <div className="hdr-sub">Autonomie alimentaire</div>
            </div>
          </div>
          <div className="hdr-actions">
            {tab === "potager" && step > 0 && (
              <button className="icon-btn" onClick={() => setShowSettings(true)}>⚙️</button>
            )}
            <button className="icon-btn" onClick={() => { setTab("boutique"); setShowCart(true); }}>
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* STEP NAV (potager only) */}
        {tab === "potager" && step > 0 && (
          <div className="steps-nav">
            {STEPS.map((s, i) => (
              <div key={i} className={`step-tab ${i===step?"active":""} ${i<step?"done":""}`}>
                <span className="step-tab-icon">{i<step?"✓":s.icon}</span>{s.label}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════ POTAGER TAB ═══════════════ */}
        {tab === "potager" && (
          <div className="content">

            {/* RESUME BANNER */}
            {saved && saved.step > 0 && step === 0 && (
              <div className="save-banner" style={{ cursor:"pointer" }}
                onClick={() => setStep(saved.step)}>
                🌿 Reprendre là où tu t'es arrêtée · <strong>{saved.profile?.name || "Mon potager"}</strong>
              </div>
            )}

            {/* ── STEP 0 WELCOME ── */}
            {step === 0 && (
              <div className="anim">
                <div className="hero">
                  <span className="hero-emoji">🌻</span>
                  <div className="hero-tag">🥕 Découvre ce que ton espace peut vraiment produire</div>
                  <h1 className="hero-title">Cultive ton <em>autonomie</em> alimentaire</h1>
                  <p className="hero-desc">Balcon, terrasse ou jardin — MonPotager calcule ta production, t'aide à choisir tes légumes et génère ton plan personnalisé.</p>
                </div>
                <div className="card">
                  <p className="card-title">Comment ça marche ?</p>
                  {[
                    {icon:"🏡",txt:"Tu décris ton espace, ta région et ton ensoleillement"},
                    {icon:"🥕",txt:"Tu choisis les légumes que tu aimes saison par saison"},
                    {icon:"📊",txt:"On calcule ta production, les économies et ton autonomie alimentaire"},
                    {icon:"🛒",txt:"On te propose les graines et le matériel pour démarrer immédiatement"},
                  ].map((it,i) => (
                    <div key={i} style={{display:"flex",gap:"10px",marginBottom:"10px",alignItems:"flex-start"}}>
                      <span style={{fontSize:"18px",flexShrink:0}}>{it.icon}</span>
                      <p style={{fontSize:"12px",color:"var(--muted)",lineHeight:"1.5"}}>{it.txt}</p>
                    </div>
                  ))}
                  <div style={{marginTop:"8px"}}>
                    <label className="lbl">Comment tu t'appelles ? (optionnel)</label>
                    <input className="ifield" placeholder="Ton prénom..."
                      value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))} />
                  </div>
                  <button className="btn" onClick={()=>setStep(1)}>Calculer mon autonomie 🌱</button>
                </div>
              </div>
            )}

            {/* ── STEP 1 JARDIN ── */}
            {step === 1 && (
              <div className="anim">
                <div className="card">
                  <p className="card-title">Quel espace ?</p>
                  <div className="cgrid">
                    {[{id:"jardin",label:"Jardin",icon:"🏡",desc:"Pleine terre"},{id:"balcon",label:"Balcon / Terrasse",icon:"🪴",desc:"Pots & jardinières"}].map(t=>(
                      <div key={t.id} className={`ccrd ${settings.type===t.id?"sel":""}`}
                        onClick={()=>setSettings(s=>({...s,type:t.id}))}>
                        <span className="ccrd-icon">{t.icon}</span>
                        <div className="ccrd-name">{t.label}</div>
                        <div className="ccrd-desc">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                  {isBalcon && <div className="tip-box">💡 En mode balcon, seuls les légumes adaptés aux pots s'affichent.</div>}
                </div>

                <div className="card">
                  <p className="card-title">Ensoleillement</p>
                  <p className="card-sub">Impacte ta production jusqu'à −60% !</p>
                  <div className="cgrid cgrid-3">
                    {EXPOSITIONS.map(e=>(
                      <div key={e.id} className={`ccrd ${settings.exposition===e.id?"sel":""}`}
                        onClick={()=>setSettings(s=>({...s,exposition:e.id}))}>
                        <span className="ccrd-icon">{e.icon}</span>
                        <div className="ccrd-name" style={{fontSize:"10px"}}>{e.label}</div>
                        <div className="ccrd-desc">{e.desc}</div>
                      </div>
                    ))}
                  </div>
                  {settings.exposition==="ombre" && <div className="warn-box">⚠️ À l'ombre, seuls les légumes feuilles donnent de bons résultats.</div>}
                </div>

                <div className="card">
                  <p className="card-title">Personnes & Surface</p>
                  <label className="lbl">🧑‍🤝‍🧑 Personnes à nourrir</label>
                  <div className="stepper">
                    <button className="step-btn" onClick={()=>setProfile(p=>({...p,persons:Math.max(1,p.persons-1)}))}>−</button>
                    <div className="step-val">{profile.persons}<span className="step-unit">{profile.persons>1?"personnes":"personne"}</span></div>
                    <button className="step-btn" onClick={()=>setProfile(p=>({...p,persons:Math.min(10,p.persons+1)}))}>+</button>
                  </div>
                  <label className="lbl">📐 Surface disponible (m²)</label>
                  <div className="surf-vis" style={{marginBottom:"8px"}}>
                    <div className="surf-m2">{profile.surface} m²</div>
                    <div className="surf-lbl">{profile.surface<recSurface?`Recommandé : ${recSurface}m² pour ${profile.persons} pers.`:"✓ Parfait !"}</div>
                  </div>
                  <input type="range" min="1" max="100" step="1" value={profile.surface}
                    onChange={e=>setProfile(p=>({...p,surface:Number(e.target.value)}))}
                    style={{width:"100%",accentColor:"var(--leaf)",marginBottom:"13px"}} />
                  {profile.surface<recSurface && <div className="tip-box">💡 Petit espace = choix optimisés. On fera du bon travail !</div>}
                </div>

                <div className="card">
                  <p className="card-title">Ta région</p>
                  <p className="card-sub">Le calendrier s'adapte à ton climat.</p>
                  <div className="cgrid">
                    {REGIONS.map(r=>(
                      <div key={r.id} className={`ccrd ${profile.region===r.id?"sel":""}`}
                        onClick={()=>setProfile(p=>({...p,region:r.id}))}>
                        <span className="ccrd-icon">{r.icon}</span>
                        <div className="ccrd-name">{r.label}</div>
                        <div className="ccrd-desc">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <p className="card-title">Mode permaculture</p>
                  <p className="card-sub" style={{marginBottom:"10px"}}>Associations naturelles entre plantes : moins de maladies, plus de rendement.</p>
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <div className="toggle-ttl">🌀 Permaculture activée</div>
                      <div className="toggle-desc">Certaines plantes se protègent mutuellement des insectes, enrichissent le sol et boostent les rendements quand on les plante ensemble. L'app t'indiquera les meilleures associations.</div>
                    </div>
                    <label className="tswitch">
                      <input type="checkbox" checked={settings.permaculture}
                        onChange={e=>setSettings(s=>({...s,permaculture:e.target.checked}))} />
                      <span className="tslider" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 VEG ── */}
            {step === 2 && (
              <div className="anim">

                {/* OVERFLOW ALERT BANNER */}
                {showOverflowAlert && (
                  <div style={{background:"var(--autumn)",borderRadius:"12px",padding:"13px 16px",
                    marginBottom:"12px",color:"white",animation:"fadeIn .3s ease"}}>
                    <div style={{fontWeight:"600",fontSize:"13px",marginBottom:"3px"}}>
                      🚨 Surface dépassée de {(usedSurface - profile.surface).toFixed(1)} m² !
                    </div>
                    <div style={{fontSize:"12px",opacity:.9}}>
                      Retire des légumes dans la liste ci-dessous, ou retourne à l'étape précédente pour agrandir ta surface.
                    </div>
                  </div>
                )}
                <div className="card">
                  <p className="card-title">Tes légumes</p>
                  <p className="card-sub">Choisis au moins 3 légumes. {isBalcon?"🪴 Mode balcon activé.":""}</p>
                  <div className="info-badge">✅ {selectedVeg.length} légume{selectedVeg.length>1?"s":""} sélectionné{selectedVeg.length>1?"s":""}</div>

                  {/* Surface gauge - improved */}
                  <div className="gauge">
                    <div className="gauge-row">
                      <span className="gauge-lbl">📐 Surface occupée</span>
                      <span className="gauge-val" style={{color: surfaceRatio>1?"var(--autumn)":surfaceRatio>0.8?"#b07a00":"var(--leaf)"}}>
                        {usedSurface.toFixed(1)} / {profile.surface} m²
                      </span>
                    </div>
                    <div className="gauge-bar">
                      <div className={`gauge-fill ${surfaceRatio>1?"gover":surfaceRatio>0.8?"gwarn":"gok"}`}
                        style={{width:`${Math.min(100,surfaceRatio*100)}%`}} />
                    </div>
                    {surfaceRatio <= 0.5 && selectedVeg.length > 0 && (
                      <p style={{fontSize:"10px",color:"var(--leaf)",marginTop:"4px"}}>
                        🌱 Tu as encore de la place — ajoute d'autres légumes !
                      </p>
                    )}
                    {surfaceRatio > 0.5 && surfaceRatio <= 0.8 && (
                      <p style={{fontSize:"10px",color:"var(--leaf)",marginTop:"4px"}}>
                        ✓ Bon équilibre — tu peux encore ajouter un peu.
                      </p>
                    )}
                    {surfaceRatio > 0.8 && surfaceRatio <= 1 && (
                      <p style={{fontSize:"10px",color:"#b07a00",marginTop:"4px"}}>
                        ⚡ Presque plein — il te reste {(profile.surface - usedSurface).toFixed(1)} m² libres.
                      </p>
                    )}
                    {surfaceRatio > 1 && (
                      <div style={{background:"rgba(196,94,42,.1)",borderRadius:"8px",padding:"8px 10px",marginTop:"6px"}}>
                        <p style={{fontSize:"11px",color:"var(--autumn)",fontWeight:"500",marginBottom:"3px"}}>
                          🚨 Tu dépasses ta surface de {(usedSurface - profile.surface).toFixed(1)} m² !
                        </p>
                        <p style={{fontSize:"10px",color:"var(--autumn)"}}>
                          Retire des légumes ci-dessous, ou retourne à l'étape précédente pour agrandir ta surface.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="stabs">
                    {SEASONS.map(s=>(
                      <div key={s.id} className={`stab ${activeSeason===s.id?"active":""}`}
                        style={activeSeason===s.id?{background:s.color,borderColor:s.color}:{}}
                        onClick={()=>setActiveSeason(s.id)}>
                        {s.icon} {s.label}
                      </div>
                    ))}
                  </div>

                  <div className="vgrid">
                    {filteredVeg.map(v => {
                      const isSel = selectedVeg.includes(v.id);
                      const isExp = expandedVeg === v.id;
                      const remainingM2 = profile.surface - usedSurface;
                      const wouldFit = v.m2pp * profile.persons <= remainingM2 + 0.01;
                      const isDisabled = !isSel && !wouldFit;
                      const pp = settings.permaculture
                        ? selectedVeg.filter(id=>v.permaBenefits?.includes(id)).map(id=>VEGETABLES.find(x=>x.id===id)?.emoji).join("")
                        : "";
                      return (
                        <div key={v.id} style={{display:"contents"}}>
                          <div
                            className={`vcrd ${isSel?"sel":""} ${v.warning&&!isDisabled?"wcrd":""}`}
                            onClick={()=>{ if(!isDisabled) toggleVeg(v.id); }}
                            style={isDisabled ? {opacity:.45, cursor:"not-allowed", filter:"grayscale(60%)"} : {}}
                          >
                            {isSel && <div className="vcheck">✓</div>}
                            {v.warning && !isSel && !isDisabled && <div className="vwarn">⚠️</div>}
                            {isDisabled && (
                              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
                                alignItems:"center",justifyContent:"center",background:"rgba(240,232,216,.7)",
                                borderRadius:"10px",gap:"2px"}}>
                                <span style={{fontSize:"14px"}}>📐</span>
                                <span style={{fontSize:"9px",color:"var(--muted)",textAlign:"center",lineHeight:"1.3",padding:"0 4px"}}>
                                  Plus assez de place<br/>({(v.m2pp*profile.persons).toFixed(1)}m² requis)
                                </span>
                              </div>
                            )}
                            <span className="vemoji">{v.emoji}</span>
                            <div className="vname">{v.name}</div>
                            <div className={`vdiff ${v.difficulty}`}>{v.difficulty==="facile"?"✓ Facile":v.difficulty==="moyen"?"~ Moyen":"! Difficile"}</div>
                            {pp && !isDisabled && <div className="pbadge">🌀{pp}</div>}
                          </div>
                          {isExp && (
                            <div className="dpanel">
                              <div className="tip-box">💡 {v.tip}</div>
                              {v.warning && <div className="warn-box">⚠️ {v.warning}</div>}
                              <div style={{fontSize:"10px",color:"var(--muted)",marginBottom:"5px"}}>
                                💧 {WATERING_TIPS[v.waterDays]} · 📦 {v.qty} · 📐 ~{(v.m2pp*profile.persons).toFixed(1)}m²
                              </div>
                              {v.conservation && <div style={{fontSize:"10px",color:"var(--leaf)"}}>🫙 {v.conservation}</div>}
                              {isSel && <button className="rm-btn" style={{marginTop:"7px"}}
                                onClick={e=>{e.stopPropagation();setSelectedVeg(p=>p.filter(x=>x!==v.id));setExpandedVeg(null);}}>
                                Retirer ce légume
                              </button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedVeg.length > 0 && (
                  <div className="card">
                    <p style={{fontSize:"12px",fontWeight:"500",marginBottom:"8px",color:"var(--muted)"}}>Ton panier :</p>
                    <div className="chips">
                      {selectedVeg.map(id=>{
                        const v=VEGETABLES.find(x=>x.id===id);
                        return v ? (
                          <div key={id} className="chip">{v.emoji} {v.name}
                            <span className="chipx" onClick={()=>setSelectedVeg(p=>p.filter(x=>x!==id))}>×</span>
                          </div>
                        ):null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3 PLAN ── */}
            {step === 3 && (
              <div className="anim">

                {/* VIRAL CARD */}
                <div className="viral">
                  <div className="viral-ttl">{profile.name?`Le potager de ${profile.name}`:"Ton potager"} · {profile.surface}m²</div>
                  <div className="viral-name">Peut produire 🌿</div>
                  <div className="vstats">
                    <div className="vstat"><div className="vstat-n">{prod.totalKg}<span style={{fontSize:"14px"}}>kg</span></div><div className="vstat-l">de légumes / an</div></div>
                    <div className="vstat"><div className="vstat-n">{prod.totalValue}<span style={{fontSize:"14px"}}>€</span></div><div className="vstat-l">économisés / an</div></div>
                    <div className="vstat"><div className="vstat-n">{prod.meals}</div><div className="vstat-l">repas produits</div></div>
                    <div className="vstat"><div className="vstat-n">{selectedVeg.length}</div><div className="vstat-l">variétés</div></div>
                  </div>
                  <div className="vautonomy">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:"11px",color:"rgba(255,255,255,.8)",fontWeight:"500"}}>Autonomie alimentaire</span>
                      <span style={{fontSize:"17px",fontWeight:"700",color:"var(--sun-light)"}}>{prod.autonomyPct}%</span>
                    </div>
                    <div className="vbar-bg"><div className="vbar" style={{width:`${prod.autonomyPct}%`}} /></div>
                    <div className="vbar-txt"><span>0%</span><span>Objectif 100%</span></div>
                  </div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button className="btn btn-sun" onClick={handleShare} style={{flex:1}}>📤 Partager</button>
                    <button className="btn btn-sun" onClick={()=>{
                      suggestedCart.forEach(p=>{ if(!cartQty(p.id)) addToCart(p.id); });
                      setTab("boutique"); setShowCart(true);
                    }} style={{flex:1}}>
                      🛒 Commander · ~{suggestedCart.reduce((a,p)=>a+p.price,0).toFixed(0)}€
                    </button>
                  </div>
                  {shareMsg && <p style={{textAlign:"center",fontSize:"11px",color:"rgba(255,255,255,.75)",marginTop:"7px"}}>{shareMsg}</p>}
                </div>

                {/* RECAP */}
                <div className="rec-card">
                  <div className="rec-ttl">Récapitulatif 🌿</div>
                  {[
                    ["Espace",`${isBalcon?"🪴 Balcon":"🏡 Jardin"} · ${profile.surface}m²`],
                    ["Région", REGIONS.find(r=>r.id===profile.region)?.label||""],
                    ["Ensoleillement", EXPOSITIONS.find(e=>e.id===settings.exposition)?.label||""],
                    ["Permaculture", settings.permaculture?"✓ Activée":"Désactivée"],
                    ["Légumes",`${selectedVeg.length} variétés`],
                  ].map(([l,v],i)=>(
                    <div key={i} className="rec-row">
                      <span style={{color:"rgba(255,255,255,.55)"}}>{l}</span>
                      <span style={{fontWeight:"500"}}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* SAISONNALITÉ DYNAMIQUE */}
                {(nowReadyToSow.length > 0 || nowReadyToPlant.length > 0 || nowReadyToHarvest.length > 0) && (
                  <div className="card" style={{background:"linear-gradient(135deg,#f5f0e8,#eee5d0)",border:"1px solid var(--sun-light)"}}>
                    <p className="sec-ttl">📅 Ce mois-ci dans ton potager</p>
                    <p className="sec-sub">{["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"][currentMonth-1]} — voici ce que tu peux faire maintenant</p>
                    {nowReadyToSow.length > 0 && (
                      <div style={{marginBottom:"10px"}}>
                        <div style={{fontSize:"11px",fontWeight:"600",color:"var(--soil)",marginBottom:"5px"}}>🏠 À semer chez toi (rebord de fenêtre)</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                          {nowReadyToSow.map(v=>(
                            <span key={v.id} style={{background:"white",border:"1px solid var(--leaf-pale)",borderRadius:"99px",padding:"4px 10px",fontSize:"11px"}}>
                              {v.emoji} {v.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {nowReadyToPlant.length > 0 && (
                      <div style={{marginBottom:"10px"}}>
                        <div style={{fontSize:"11px",fontWeight:"600",color:"var(--soil)",marginBottom:"5px"}}>🌱 À planter dehors maintenant</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                          {nowReadyToPlant.map(v=>(
                            <span key={v.id} style={{background:"white",border:"1px solid var(--leaf-pale)",borderRadius:"99px",padding:"4px 10px",fontSize:"11px"}}>
                              {v.emoji} {v.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {nowReadyToHarvest.length > 0 && (
                      <div>
                        <div style={{fontSize:"11px",fontWeight:"600",color:"var(--soil)",marginBottom:"5px"}}>🍅 À récolter ce mois-ci</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                          {nowReadyToHarvest.map(v=>(
                            <span key={v.id} style={{background:"white",border:"1px solid var(--leaf-pale)",borderRadius:"99px",padding:"4px 10px",fontSize:"11px"}}>
                              {v.emoji} {v.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* AUTONOMY GUIDE */}
                {(() => {
                  const fullAutonomySurface = profile.persons * 20;
                  const fullKgNeeded = profile.persons * 120;
                  const missingM2 = Math.max(0, fullAutonomySurface - profile.surface);
                  return (
                    <div className="card" style={{border:"1px solid var(--leaf-pale)"}}>
                      <p className="sec-ttl">🎯 Pour une autonomie totale</p>
                      <p className="sec-sub">Ce qu'il faudrait pour couvrir 100% de tes légumes sur l'année</p>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"12px"}}>
                        {[
                          {label:"Surface idéale",value:`${fullAutonomySurface} m²`,icon:"📐",note:`Tu as ${profile.surface} m²`},
                          {label:"Production à atteindre",value:`${fullKgNeeded} kg/an`,icon:"🥬",note:`≈ ${Math.round(fullKgNeeded/12)} kg/mois`},
                        ].map((s,i)=>(
                          <div key={i} style={{background:"var(--parchment)",borderRadius:"10px",padding:"10px 12px"}}>
                            <div style={{fontSize:"16px",marginBottom:"2px"}}>{s.icon}</div>
                            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"18px",color:"var(--soil)"}}>{s.value}</div>
                            <div style={{fontSize:"10px",color:"var(--muted)"}}>{s.label}</div>
                            <div style={{fontSize:"9px",color:"var(--leaf)",marginTop:"2px"}}>{s.note}</div>
                          </div>
                        ))}
                      </div>
                      {missingM2 > 0 ? (
                        <div className="tip-box">
                          💡 Il te manque ~{missingM2} m² pour une autonomie totale. En attendant, tu peux compléter chez un maraîcher local ou une AMAP pour les légumes que tu ne produiras pas toi-même.
                        </div>
                      ) : (
                        <div style={{background:"rgba(61,107,63,.1)",borderRadius:"9px",padding:"10px 12px",fontSize:"12px",color:"var(--leaf)",fontWeight:"500"}}>
                          🎉 Tu as assez de surface pour viser une autonomie complète — c'est remarquable !
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* PERMA */}
                {settings.permaculture && permaPairs.length > 0 && (
                  <div className="card">
                    <p className="sec-ttl">🌀 Associations permaculture</p>
                    <p className="sec-sub">Plante-les côte à côte pour de meilleurs résultats !</p>
                    {permaPairs.map((p,i)=>(
                      <div key={i} className="perma-pair">
                        <span style={{fontSize:"18px"}}>{p.av.emoji}</span>+<span style={{fontSize:"18px"}}>{p.bv.emoji}</span>
                        <span><strong>{p.av.name}</strong> & <strong>{p.bv.name}</strong> sont de bonnes voisines 💚</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CALENDAR */}
                <div className="card">
                  <p className="sec-ttl">📅 Calendrier de plantation</p>
                  <div className="cal-wrap">
                    <table className="cal-tbl">
                      <thead><tr>
                        <th style={{textAlign:"left",paddingLeft:"6px"}}>Légume</th>
                        {MONTHS.map((m,i)=><th key={i}>{m}</th>)}
                      </tr></thead>
                      <tbody>
                        {selectedVeg.map(id=>{
                          const v=VEGETABLES.find(x=>x.id===id);
                          const cal=PLANTING_CALENDAR[id];
                          if(!v||!cal) return null;
                          return (
                            <tr key={id}>
                              <td><div className="cal-vname"><span>{v.emoji}</span><span>{v.name}</span></div></td>
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m=>{
                                const s=cal.semisInt?.includes(m),r=cal.repiquage?.includes(m),rc=cal.recolte?.includes(m);
                                return <td key={m}><div className={`ccell ${rc?"crec":r?"crepi":s?"csemis":""}`}/></td>;
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="cleg">
                    {[
                      ["var(--leaf-pale)","À semer chez toi (rebord de fenêtre)"],
                      ["var(--sun-light)","À planter dehors"],
                      ["var(--leaf)","Récolte"],
                    ].map(([c,l],i)=>(
                      <div key={i} className="cleg-item"><div className="cleg-dot" style={{background:c}}/>{l}</div>
                    ))}
                  </div>
                  <div style={{background:"rgba(61,107,63,.06)",borderRadius:"8px",padding:"9px 12px",marginTop:"10px",fontSize:"11px",color:"var(--muted)",lineHeight:"1.5"}}>
                    💡 <strong>Comment lire ce calendrier ?</strong> Commence par semer tes graines dans un petit pot sur ton rebord de fenêtre. Une fois les plants assez grands (4-6 semaines), tu les plantes dehors. Puis tu récoltes !
                  </div>
                </div>

                {/* WATERING */}
                <div className="card">
                  <p className="sec-ttl">💧 Rappels d'arrosage</p>
                  <p className="sec-sub">Fréquences en période de croissance</p>
                  {selectedVeg.map(id=>{
                    const v=VEGETABLES.find(x=>x.id===id);
                    if(!v) return null;
                    return (
                      <div key={id} className="w-row">
                        <div className="w-veg">
                          <span style={{fontSize:"17px"}}>{v.emoji}</span>
                          <div>
                            <div style={{fontSize:"12px",fontWeight:"500"}}>{v.name}</div>
                            <div className="w-dots">
                              {[...Array(7)].map((_,i)=>(
                                <div key={i} className={`w-dot ${i<Math.ceil(7/v.waterDays)?"on":""}`}/>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="w-freq">{WATERING_TIPS[v.waterDays]}</div>
                      </div>
                    );
                  })}
                </div>

                {/* VEG DETAILS */}
                <div className="card">
                  <p className="sec-ttl">🌿 Tes légumes en détail</p>
                  <p className="sec-sub">Quantités & conservation</p>
                  {selectedVeg.map((id,idx)=>{
                    const v=VEGETABLES.find(x=>x.id===id);
                    if(!v) return null;
                    const sm=EXPOSITIONS.find(e=>e.id===settings.exposition)?.multiplier??1;
                    const estKg=(v.m2pp*profile.persons*v.kgPerM2*sm).toFixed(1);
                    return (
                      <div key={id} style={{borderBottom:idx<selectedVeg.length-1?"1px solid var(--leaf-pale)":"none",paddingBottom:"11px",marginBottom:"11px"}}>
                        <div style={{display:"flex",gap:"9px",alignItems:"flex-start"}}>
                          <span style={{fontSize:"20px"}}>{v.emoji}</span>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                              <span style={{fontWeight:"500",fontSize:"13px"}}>{v.name}</span>
                              <span className={`vdiff ${v.difficulty}`} style={{fontSize:"9px"}}>
                                {v.difficulty==="facile"?"✓ Facile":v.difficulty==="moyen"?"~ Moyen":"! Difficile"}
                              </span>
                            </div>
                            <div style={{fontSize:"10px",color:"var(--muted)"}}>📦 {v.qty} · 📐 ~{(v.m2pp*profile.persons).toFixed(1)}m² · 🥬 ~{estKg}kg/an</div>
                            {v.conservation && <div style={{fontSize:"10px",color:"var(--leaf)",marginTop:"3px"}}>🫙 {v.conservation}</div>}
                            {v.warning && <div className="warn-box" style={{marginTop:"5px"}}>⚠️ {v.warning}</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOUTIQUE CTA */}
                <div className="card" style={{background:"linear-gradient(135deg,#faf6ef,#f0e8d8)",border:"1px solid var(--leaf-pale)"}}>
                  <p className="sec-ttl">🛒 Commander mon potager complet</p>
                  <p className="sec-sub">On a sélectionné les graines et le matériel pour tes {selectedVeg.length} légumes — tu peux tout ajuster avant de commander.</p>
                  <button className="btn" onClick={()=>{
                    suggestedCart.forEach(p=>{ if(!cartQty(p.id)) addToCart(p.id); });
                    setTab("boutique"); setShowCart(true);
                  }}>🛒 Ajouter mon potager complet au panier · ~{suggestedCart.reduce((a,p)=>a+p.price,0).toFixed(0)}€</button>
                </div>

                {/* FEEDBACK */}
                <div className="card" style={{border:"1px solid var(--leaf-pale)"}}>
                  <p className="sec-ttl">💬 Ton avis nous aide</p>
                  <p className="sec-sub">Qu'est-ce qui manque ? Qu'est-ce qu'on pourrait améliorer ?</p>
                  {feedbackSent ? (
                    <div style={{textAlign:"center",padding:"10px 0",color:"var(--leaf)",fontWeight:"500",fontSize:"13px"}}>
                      🙏 Merci pour ton retour !
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={feedbackText}
                        onChange={e=>setFeedbackText(e.target.value)}
                        placeholder="Ex : j'aimerais pouvoir imprimer mon plan, ou voir les prix des légumes au kilo en ce moment…"
                        style={{width:"100%",minHeight:"80px",border:"1px solid var(--leaf-pale)",borderRadius:"10px",padding:"10px",fontSize:"12px",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",outline:"none",color:"var(--soil)"}}
                      />
                      <button className="btn" style={{marginTop:"8px",width:"100%"}}
                        disabled={!feedbackText.trim()}
                        onClick={()=>{ setFeedbackSent(true); setFeedbackText(""); }}>
                        Envoyer mon avis
                      </button>
                    </>
                  )}
                </div>

              </div>
            )}

            {/* BOTTOM NAV (dans l'onglet potager) */}
            <div style={{position:"fixed",bottom:"56px",left:"50%",transform:"translateX(-50%)",
              width:"100%",maxWidth:"600px",background:"white",borderTop:"1px solid var(--leaf-pale)",
              padding:"10px 16px 12px",display:"flex",gap:"8px",zIndex:100}}>
              {step > 0 && <button className="btn-outline" onClick={handleBack}>← Retour</button>}
              {step < 3 && (
                <button className="btn" style={{flex:1}} disabled={!canProceed()} onClick={handleNext}>
                  {step===0?"C'est parti 🌱":step===2?`Voir mon plan (${selectedVeg.length} légumes)`:"Continuer →"}
                </button>
              )}
              {step === 3 && (
                <button className="btn btn-sun" style={{flex:1}} onClick={handleShare}>📤 Partager</button>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ BOUTIQUE TAB ═══════════════ */}
        {tab === "boutique" && (
          <div className="content">
            <div className="shop-header">
              <div className="shop-ttl">🌿 La Boutique</div>
              <div className="shop-sub">Graines BIO & matériel sélectionnés pour ton potager</div>
              {selectedVeg.length > 0 && (
                <div className="shop-alert">
                  ✨ {selectedVeg.length} légumes sélectionnés — les produits recommandés sont mis en avant
                </div>
              )}
            </div>

            {/* Kit Commander */}
            {selectedVeg.length > 0 && (
              <div className="card" style={{background:"linear-gradient(135deg,var(--leaf),#2a5e2c)",border:"none"}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:"17px",color:"var(--sun-light)",marginBottom:"5px"}}>
                  🛒 Commander mon potager complet
                </p>
                <p style={{fontSize:"11px",color:"rgba(255,255,255,.7)",marginBottom:"12px"}}>
                  Graines BIO + outils pour tes {selectedVeg.length} légumes · Livraison sous 3-5j
                </p>
                <button className="btn btn-sun" onClick={()=>{
                  suggestedCart.forEach(p=>{ if(!cartQty(p.id)) addToCart(p.id); });
                  setShowCart(true);
                }}>
                  🛒 Ajouter mon potager complet · ~{suggestedCart.reduce((a,p)=>a+p.price,0).toFixed(0)}€
                </button>
              </div>
            )}

            {/* Category tabs */}
            <div className="cat-tabs">
              {["Tous",...SHOP_CATEGORIES].map(c=>(
                <div key={c} className={`cat-tab ${shopCat===c?"active":""}`} onClick={()=>setShopCat(c)}>{c}</div>
              ))}
            </div>

            {/* Products */}
            <div className="product-grid">
              {(shopCat==="Tous"
                ? BASE_PRODUCTS.filter(p=>!(p.balconOnly&&!isBalcon)&&!(p.jardinOnly&&isBalcon))
                : shopProducts
              ).map(p=>{
                const inCart = cartQty(p.id) > 0;
                const rec = isRecommended(p);
                return (
                  <div key={p.id} className={`pcrd ${inCart?"in-cart":""}`}>
                    {rec && selectedVeg.length>0 && <div className="pcrd-rec-badge">✓ Recommandé</div>}
                    <div className="pcrd-emoji">{p.emoji}</div>
                    <div className="pcrd-body">
                      {p.badge && <div className={`pcrd-badge ${rec?"rec":""}`}>{p.badge}</div>}
                      <div className="pcrd-name">{p.name}</div>
                      <div className="pcrd-desc">{p.desc}</div>
                      <div className="pcrd-footer">
                        <div>
                          <span className="pcrd-price">{p.price.toFixed(2)}€</span>
                          {p.oldPrice && <span className="pcrd-old">{p.oldPrice}€</span>}
                        </div>
                        {cartQty(p.id) > 0 ? (
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            <button onClick={()=>removeFromCart(p.id)}
                              style={{width:"26px",height:"26px",borderRadius:"50%",border:"1px solid var(--leaf)",background:"white",color:"var(--leaf)",fontWeight:"700",fontSize:"16px",cursor:"pointer",lineHeight:"1"}}>−</button>
                            <span style={{minWidth:"16px",textAlign:"center",fontWeight:"600",fontSize:"13px"}}>{cartQty(p.id)}</span>
                            <button onClick={()=>addToCart(p.id)}
                              style={{width:"26px",height:"26px",borderRadius:"50%",border:"none",background:"var(--leaf)",color:"white",fontWeight:"700",fontSize:"16px",cursor:"pointer",lineHeight:"1"}}>+</button>
                          </div>
                        ) : (
                          <button className="add-btn" onClick={()=>addToCart(p.id)}>
                            Ajouter au panier
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{height:"80px"}} />
            {cartCount > 0 && (
              <div style={{position:"sticky",bottom:"66px",padding:"0 16px 12px",background:"transparent"}}>
                <button className="btn" style={{width:"100%",background:"var(--soil)",borderColor:"var(--soil)"}}
                  onClick={()=>setShowCart(true)}>
                  🛒 Voir mon panier · {cartCount} article{cartCount>1?"s":""} · {cartTotal.toFixed(2)}€
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM TAB BAR */}
        <div className="tab-bar">
          {[
            {id:"potager",icon:"🌱",label:"Mon Potager"},
            {id:"boutique",icon:"🛒",label:"Boutique"},
          ].map(t=>(
            <button key={t.id} className={`tab-item ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              <span className="tab-item-icon">{t.icon}</span>
              <span className="tab-item-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* CART DRAWER */}
        {showCart && (
          <div className="drawer-overlay" onClick={()=>setShowCart(false)}>
            <div className="drawer" onClick={e=>e.stopPropagation()}>
              <div className="drawer-handle"/>
              <p className="drawer-ttl">🛒 Mon Panier</p>
              {cartCount === 0 ? (
                <p style={{color:"var(--muted)",fontSize:"13px",textAlign:"center",padding:"20px 0"}}>
                  Ton panier est vide. Explore la boutique !
                </p>
              ) : (
                <>
                  {Object.entries(cart).map(([id, qty])=>{
                    const p=BASE_PRODUCTS.find(x=>x.id===id);
                    if(!p) return null;
                    return (
                      <div key={id} className="cart-item">
                        <span className="ci-emoji">{p.emoji}</span>
                        <div className="ci-body">
                          <div className="ci-name">{p.name}</div>
                          <div className="ci-price">{(p.price*qty).toFixed(2)}€</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                          <button onClick={()=>removeFromCart(id)}
                            style={{width:"24px",height:"24px",borderRadius:"50%",border:"1px solid var(--leaf-pale)",background:"white",color:"var(--muted)",fontWeight:"700",cursor:"pointer",fontSize:"14px",lineHeight:"1"}}>−</button>
                          <span style={{minWidth:"14px",textAlign:"center",fontSize:"13px",fontWeight:"600"}}>{qty}</span>
                          <button onClick={()=>addToCart(id)}
                            style={{width:"24px",height:"24px",borderRadius:"50%",border:"none",background:"var(--leaf)",color:"white",fontWeight:"700",cursor:"pointer",fontSize:"14px",lineHeight:"1"}}>+</button>
                          <button className="ci-remove" onClick={()=>deleteFromCart(id)} style={{marginLeft:"3px"}}>×</button>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{borderTop:"2px solid var(--leaf-pale)",paddingTop:"14px",marginTop:"6px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                      <span style={{fontSize:"13px",fontWeight:"500"}}>Total commande</span>
                      <span style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",color:"var(--soil)"}}>{cartTotal.toFixed(2)}€</span>
                    </div>
                    <div style={{fontSize:"10px",color:"var(--leaf)",marginBottom:"14px"}}>
                      🌿 Graines certifiées AB · Livraison sous 3-5 jours
                    </div>
                    <button className="btn" style={{marginBottom:"8px"}}>✅ Commander · {cartTotal.toFixed(2)}€</button>
                    <button className="btn-outline" style={{width:"100%"}} onClick={()=>setShowCart(false)}>Continuer mes achats</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS DRAWER */}
        {showSettings && (
          <div className="drawer-overlay" onClick={()=>setShowSettings(false)}>
            <div className="drawer" onClick={e=>e.stopPropagation()}>
              <div className="drawer-handle"/>
              <p className="drawer-ttl">⚙️ Réglages</p>

              <p style={{fontSize:"12px",fontWeight:"500",color:"var(--muted)",marginBottom:"8px"}}>Mode permaculture</p>
              <div className="toggle-row" style={{marginBottom:"18px"}}>
                <div className="toggle-info">
                  <div className="toggle-ttl">🌀 Associations de plantes</div>
                  <div className="toggle-desc">Planter certains légumes ensemble les protège des insectes et booste les rendements.</div>
                </div>
                <label className="tswitch">
                  <input type="checkbox" checked={settings.permaculture}
                    onChange={e=>setSettings(s=>({...s,permaculture:e.target.checked}))} />
                  <span className="tslider"/>
                </label>
              </div>

              <p style={{fontSize:"12px",fontWeight:"500",color:"var(--muted)",marginBottom:"8px"}}>Type d'espace</p>
              <div className="cgrid" style={{marginBottom:"18px"}}>
                {[{id:"jardin",label:"Jardin",icon:"🏡"},{id:"balcon",label:"Balcon",icon:"🪴"}].map(t=>(
                  <div key={t.id} className={`ccrd ${settings.type===t.id?"sel":""}`}
                    onClick={()=>setSettings(s=>({...s,type:t.id}))}>
                    <span className="ccrd-icon">{t.icon}</span><div className="ccrd-name">{t.label}</div>
                  </div>
                ))}
              </div>

              <p style={{fontSize:"12px",fontWeight:"500",color:"var(--muted)",marginBottom:"8px"}}>Ensoleillement</p>
              <div className="cgrid cgrid-3" style={{marginBottom:"22px"}}>
                {EXPOSITIONS.map(e=>(
                  <div key={e.id} className={`ccrd ${settings.exposition===e.id?"sel":""}`}
                    onClick={()=>setSettings(s=>({...s,exposition:e.id}))}>
                    <span className="ccrd-icon">{e.icon}</span>
                    <div className="ccrd-name" style={{fontSize:"9px"}}>{e.label}</div>
                  </div>
                ))}
              </div>

              <button className="btn" onClick={()=>setShowSettings(false)}>Fermer</button>

              <div style={{borderTop:"1px solid var(--leaf-pale)",marginTop:"20px",paddingTop:"16px"}}>
                <p style={{fontSize:"11px",color:"var(--muted)",marginBottom:"10px",textAlign:"center"}}>
                  Zone dangereuse
                </p>
                <button
                  onClick={()=>{
                    if(window.confirm("Réinitialiser ton potager ? Toutes tes données seront effacées.")) {
                      try { localStorage.removeItem("monpotager_v3"); } catch {}
                      window.location.reload();
                    }
                  }}
                  style={{width:"100%",padding:"11px",borderRadius:"10px",border:"1px solid var(--autumn)",
                    background:"rgba(196,94,42,.07)",color:"var(--autumn)",fontWeight:"500",fontSize:"13px",cursor:"pointer"}}>
                  🗑️ Réinitialiser mon potager
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
