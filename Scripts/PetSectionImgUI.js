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
	
	async fetchDataFromAPI()
	{
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
		
		referenceImgID = this.handleBreedNodes(Object.entries(dataItems)); 
		await this.fetchImgFromAPI(referenceImgID); 
	}
	
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
	
	async fetchImgFromAPI(referenceImgID) 
	{	
		let data; 
		
		data = await this._fetchDataFromAPI(`${this.img_API_URI}${referenceImgID}`);
		
		try { this.parseImgData(dataItems);  }
		catch (fetchError) { throw new Error(`Failed to fetch data from "${this.img_API_URI}" because of the following error: ${fetchError}`); }
	}
	
	static formatOutput(str) { return str.replace(/_/g, " ").toUpperCase(); }
	
	handleBreedNodes(dataItems)
	{
		let innerKey; 
		let key; 
		let nestedEntries; 
		let nestedKey; 
		let nestedValue;
		let nestedValuesStr;  
		let referenceImgID; 
		let value; 
		
		this.textNodeContent = ""; 
		
		for ([key, value] of dataItems)
		{ 
			nestedValuesStr = "";
			
			if (key == "image") { continue; }  
			else if (key === "reference_image_id") //An identifier for the image corresponding to the breed information.
			{ 
				referenceImgID = value;  
				continue;
			} 
			else if (typeof value == "object" && value != null) //If the value of the key is an object, there is nested data.
			{ 
				nestedEntries = Object.entries(value);
					
				for ([nestedKey, nestedValue] of nestedEntries) 
				{ 
					if (key == "height" && nestedKey == "imperial") { nestedValuesStr += `${nestedValue} inches<br>`; }
					else if (key == "weight" && nestedKey == "imperial" ) { nestedValuesStr += `${nestedValue}lbs<br>`; }
					else if (key ==="height" && nestedKey == "metric") { nestedValuesStr += `${nestedValue}cm<br>`; }
					else if (key == "weight" && nestedKey == "metric") { nestedValuesStr += `${nestedValue}kg<br>`; }
				}
				
				value = nestedValuesStr;
			} 
			
			console.log(`${key}: ${value}`);
			this.textNode.innerHTML += PetSectionImgUI.formatOutput(`${key}: ${value}<br>`);
		}
		
		console.log(referenceImgID);
		return referenceImgID; 
	}
	
	parseImgData(dataItems)
	{
		this.petImg.alt = PetSectionImgUI.determineArticleForStr(this.inputTextContent);
		this.petImg.captionContent = this.alt;
		this.petImg.src = dataItems.url;
	}
}