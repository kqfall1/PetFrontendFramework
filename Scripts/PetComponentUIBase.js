class PetComponentUIBase //"Abstract" class
{ 
	static CAT = "CAT";
	static DOG = "DOG";
	static LOADING_LABEL = "Loading...";

	#apiURI;
	#apiKey; 
	#btnNode; 
	#petType;
	
	constructor (apiURI, apiKey, btnNode, petType)
	{
		//refers to the constructor function (i.e. class) that created the instance of the object: 
		if (this.constructor === PetComponentUIBase) { throw new Error("Cannot instantiate abstract base class PetComponentUIBase."); }
		
		let normalizedPetType; 
		
		if (typeof petType === "string") { normalizedPetType = petType.trim().toUpperCase(); }
		else { throw new Error(`Invalid argument for ${petType}: expected a string, got ${typeof petType}`); }
		
		if (!PetType[normalizedPetType]) { throw new Error(`Invalid argument: ${petType} is not a valid PetType.`); } 
		
		this.#apiURI = apiURI;
		this.#apiKey = apiKey; 
		this.#btnNode = btnNode; 
		this.#btnNode.addEventListener("click", this.fetchDataFromAPI.bind(this));
		this.#petType = normalizedPetType; 
	}
	
	get apiKey() { return this.#apiKey; }
	get apiURI() { return this.#apiURI; }
	get btnNode() { return this.#btnNode; }
	get petType() { return this.#petType; }

	async fetchDataFromAPI() { throw new Error("fetchDataFromAPI() must be implemented in subclasses."); } 
	async _fetchDataFromAPI(apiURI) 
	{
		let response;
		
		try 
		{ 
			if (this.apiKey == null) { response = await fetch(apiURI); }
			else { response = await fetch(apiURI, { headers: { "x-api-key": this.apiKey } }); }
			
			return await response.json();
		}
		catch (fetchError) { throw new Error(`Failed to fetch data from "${this.apiURI}" because of the following error: ${fetchError}`); }
	}
	
	parseData(dataItems) { throw new Error("parseData() must be implemented in subclasses."); } //"Abstract" method
	
	prepareUIForFetch() { throw new Error("prepareUIForFetch() must be implemented in subclasses."); } //"Abstract" method
}