class PetSectionUI extends PetComponentUIBase
{	
	#inputNode; 
	#inputNodeContent; 
	#textNode; 
	#textNodeContent; 
	
	constructor(apiURI, apiKey, btnNode, inputNode, petType, textNode)
	{
		super(apiURI, apiKey, btnNode, petType);
		this.#inputNode = inputNode; 
		this.#textNode = textNode; 
		this.textNode.addEventListener("input", () => { this.textNodeContent = this.textNode.value.trim() });
	}
	
	get inputNode() { return this.#inputNode; }
	
	get inputNodeContent() { return this.#inputNodeContent; } 
	set inputNodeContent(value) 
	{ 
		this.#inputNodeContent = value; 
		this.#inputNode.value = value; 
	}
	
	get textNode() { return this.#textNode; }
	
	get textNodeContent() { return this.#textNodeContent; }
	set textNodeContent(value) 
	{
		if (typeof value != "string") { throw new Error("An invalid string was passed into PetSectionUI.textNodeContent_set"); }
		
		this.#textNodeContent = value; 
		this.textNode.textContent = value; 
	}
	
	async fetchDataFromAPI()
	{
		let count; 
		let dataItems = [];
		let numFacts;
		
		this.inputNodeContent = this.inputNode.value.trim();  
		
		if (!this.inputNodeContent || isNaN(Number(this.inputNodeContent))) { console.log(this.inputNodeContent); throw new Error("Please input a valid number."); }
		
		console.log(this.inputNodeContent);
		numFacts = Number(this.inputNodeContent);  
		this.prepareUIForFetch();
		
		for (count = 0; count < numFacts; count++) { dataItems.push(await this._fetchDataFromAPI(this.apiURI)); } 
		
		try { this.parseData(dataItems); } 
		catch (parseError) { this.textNodeContent = `Failed to parse data from "${this.apiURI}" because of the following error: ${parseError}`; }
	}
	
	parseData(dataItems)
	{	
		let factsStr = "";
		let item; 
		
		switch(this.petType)
		{
			//This means Meow Facts for now. I am not building a large application, I only intend to learn OOP in JS. However, this app will be very scalable!
			case PetComponentUIBase.CAT: 
				console.log(dataItems); 
				for (item of dataItems) { factsStr += `${this.textNode.innerHTML}${item.data}<br><br>`; } 
				this.textNode.innerHTML = factsStr; 
				break; 
			case PetComponentUIBase.DOG:
				//I don't have time to implement this.
				break;
		}
	}
	
	prepareUIForFetch()
	{
		this.textNodeContent = PetComponentUIBase.LOADING_LABEL; 
		this.textNode.innerHTML = ""; 
	}
}