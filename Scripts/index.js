//Quinn Keenan, 301504914, 26/07/2025

let catImg;  
const catImgBtnNode = document.getElementById("catImgBtn");
const catImgCaptionNode = document.getElementById("catImgCaption");
const catImgNode = document.getElementById("catImg"); 
let catPetFigureUI;

let dogImg; 
const dogImgBtnNode = document.getElementById("dogImgBtn");
const dogImgCaptionNode = document.getElementById("dogImgCaption");
const dogImgNode = document.getElementById("dogImg");
let dogPetFigureUI;  

let catMeowFactsPetSectionUI; 
const meowFactsBtnNode = document.getElementById("meowFactsBtn");
const meowFactsInputNode = document.getElementById("meowFactsInput");
const meowFactsPNode = document.getElementById("meowFactsP");

let dogBreedImg; 
let dogBreedFetchPetSectionUI; 
const breedBtnNode = document.getElementById("breedFetchBtn");
const breedImgNode = document.getElementById("breedImg");
const breedImgCaptionNode = document.getElementById("breedImgCaption");
const breedInfoPNode = document.getElementById("breedInfoP");
const breedInputNode = document.getElementById("breedInput");

document.addEventListener("DOMContentLoaded", loadPage);

function loadPage()
{
	catImg = new PetImg(catImgCaptionNode, catImgNode);
	catPetFigureUI = new PetFigureUI("https://api.thecatapi.com/v1/images/search", null, catImgBtnNode, catImg, PetComponentUIBase.CAT);
	
	dogImg = new PetImg(dogImgCaptionNode, dogImgNode);
	dogPetFigureUI = new PetFigureUI("https://dog.ceo/api/breeds/image/random", null, dogImgBtnNode, dogImg, PetComponentUIBase.DOG);
	
	catMeowFactsPetSectionUI = new PetSectionUI("https://meowfacts.herokuapp.com/", null, meowFactsBtn, meowFactsInputNode, PetComponentUIBase.CAT, meowFactsPNode);	
	
	dogBreedImg = new PetImg(breedImgCaptionNode, breedImgNode);
	dogBreedFetchPetSectionUI = new PetSectionImgUI("https://api.thedogapi.com/v1/breeds/search?q=", "live_v6V5emXWLnYFAKztYDUzYWnlJVSTubuNVXIc6qt022WA5bP95aL2cjsPyHak6qVo",
							 "https://api.thedogapi.com/v1/images/", breedBtnNode, breedInputNode, dogBreedImg, PetComponentUIBase.DOG, 
							 breedInfoPNode);
	
	catPetFigureUI.fetchDataFromAPI(); 
	dogPetFigureUI.fetchDataFromAPI(); 
}