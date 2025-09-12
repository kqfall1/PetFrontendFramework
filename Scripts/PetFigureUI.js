class PetFigureUI extends PetComponentUIBase
{		
	#imgLoadedAlt; //PetFigureUI objects have static alts that display only when an image from an API is displaying.
	#petImg; 
	
	constructor(apiURI, apiKey, btnNode, petImg, petType) 
	{			
		super(apiURI, apiKey, btnNode, petType); //They also have no text nodes. Their associated image's captionText property suffices.
		this.#imgLoadedAlt = `Cute ${petType.toLowerCase()}`; 
		this.#petImg = petImg; 
	}
	
	get imgLoadedAlt() { return this.#imgLoadedAlt; }
	get petImg() { return this.#petImg; }
	
	async fetchDataFromAPI()
	{
		let data; 
		
		this.prepareUIForFetch(); 
		data = (await this._fetchDataFromAPI(this.apiURI)); 

		try { this.parseData(data); } 
		catch (parseError) { this.petImg.alt = `Failed to parse data from "${this.apiURI}" because of the following error: ${parseError}`;  }
	}
	
	parseData(dataItems)
	{
		switch (this.petType)
		{
			case PetComponentUIBase.CAT: 
				this.petImg.src = dataItems[0].url;
				break;
			case PetComponentUIBase.DOG: 
				this.petImg.src = dataItems.message; 
				break; 
		}
		
		this.petImg.alt = this.imgLoadedAlt; 
	}
	
	prepareUIForFetch()
	{
		this.petImg.src = ""; 
		this.petImg.alt = PetComponentUIBase.LOADING_LABEL; 
	}
}