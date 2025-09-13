class PetSectionImgUI extends PetSectionUI
{
	#img_API_URI;
	#petImg; 
	
	constructor(apiURI, apiKey, img_API_URI, btnNode, inputNode, petImg, petType, textNode) 
	{			
		super(apiURI, apiKey, btnNode, inputNode, petType, textNode);								
		this.#img_API_URI = img_API_URI; 
		this.#petImg = petImg; 
	}
	
	get img_API_URI() { return this.#img_API_URI; } //Incomplete, needs a referenceImgID appeneded to it.
	get petImg() { return this.#petImg; }
	
	static determineArticleForStr(str)
	{
		let firstChar; 
		
		if (typeof str != "string" || str.length == 0)
		{ 
			throw new Error(`Invalid argument passed to determineArticleForStr: str - Expected a string, got ${typeof str}.`);
			return; 
		}
		
		firstChar = str.toUpperCase()[0]; 
			
		if (firstChar == 'A' || firstChar == 'E' || firstChar == 'I' || firstChar == 'O' || firstChar == 'U') { return `An ${str}`; }
		else { return `A ${str}`; }
	}
	
	async fetchDataFromAPI()
	{
		let breedKeysAndValues; 
		let dataItems = [];
		let referenceImgID; 
		
		this.inputNodeContent = this.inputNode.value.trim();
		
		if (!this.inputNodeContent) 
		{ 
			this.src = ""; 
			this.alt = "Please enter a dog breed:";
			this.imgCaptionText = ""; 
			return; 
		}
		 
		dataItems = await this._fetchDataFromAPI(`${this.apiURI}${this.inputNodeContent}`);
		this.prepareUIForFetch(); 
		console.log(dataItems); 
		
		if (!Array.isArray(dataItems) || dataItems.length == 0)
		{ 
			this.textNodeContent = `No breed found for ${(this.inputTextContent)}`; 
			this.petImg.alt = `No breed found for ${(this.inputTextContent)}`;
			this.imgCaptionText = ""; 
			return; 
		} 
		
		breedKeysAndValues = Object.entries(dataItems[0]);
		referenceImgID = this.handleBreedNodes(breedKeysAndValues); 
		await this.fetchImgFromAPI(referenceImgID); 
		this.inputNodeContent = "";
	}
	
	async fetchImgFromAPI(referenceImgID) 
	{	
		let imgDataItems = await this._fetchDataFromAPI(`${this.img_API_URI}${referenceImgID}`);
		
		try { this.parseImgData(imgDataItems); }
		catch (fetchError) { throw new Error(`Failed to fetch data from "${this.img_API_URI}" because of the following error: ${fetchError}`); }
	}
	
	static formatOutput(str) { return str.replace(/_/g, " ").toUpperCase(); }
	
	handleBreedNodes(breedKeysAndValues)
	{
		let nestedEntries; 
		let nestedKey; 
		let nestedValue; 
		let outerKey; 
		let outerValue; 
		let referenceImgID; //An identifier for the image corresponding to the breed information.
		let valuesStr;  
		
		for ([outerKey, outerValue] of breedKeysAndValues)
		{ 
			if (outerKey === "reference_image_id") 
			{ 
				referenceImgID = outerValue;  
				continue;
			} 
			else if (outerKey === "life_span" || outerKey === "temperament") { valuesStr = outerValue }
			else if (outerKey != "image" && typeof outerValue == "object" && outerValue != null) 
			{ 
				nestedEntries = Object.entries(outerValue);
				valuesStr = ""; 
				
				for ([nestedKey, nestedValue] of nestedEntries) //Height and weight are the only nested breed keys other than image
				{ 
					if (outerKey == "height" && nestedKey == "imperial") { valuesStr += `${nestedValue} inches<br>`; }
					else if (outerKey == "weight" && nestedKey == "imperial" ) { valuesStr += `${nestedValue} lbs<br>`; }
					else if (outerKey ==="height" && nestedKey == "metric") { valuesStr += `${nestedValue} cm<br>`; }
					else if (outerKey === "weight" && nestedKey == "metric") { valuesStr += `${nestedValue} kg<br>`; } 
				}
			} 
			else 
			{ 
				continue; 
			}
			
			this.textNode.innerHTML += PetSectionImgUI.formatOutput(`${outerKey}: ${valuesStr}<br>`);
		}
		
		return referenceImgID; 
	}
	
	parseImgData(imgDataItems)
	{
		this.petImg.alt = PetSectionImgUI.determineArticleForStr(this.inputNodeContent);
		this.petImg.captionContent = this.alt;
		this.petImg.src = imgDataItems.url;
	}
}