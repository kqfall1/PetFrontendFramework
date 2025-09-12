class PetImg
{
	#alt; 
	#captionNode; 
	#captionNodeContent; 
	#imgNode; 
	#src; 
	
	constructor(captionNode, imgNode)
	{
		this.#captionNode = captionNode; 
		this.#captionNodeContent = this.captionNode.value; 
		this.#imgNode = imgNode; 
	}
	
	get alt() { return this.#alt; }
	set alt(value) 
	{ 
		this.#alt = value; 
		this.imgNode.alt = value; 
	}
	
	get captionNode() { return this.#captionNode; } 
	
	get captionNodeContent() { return this.#captionNodeContent; }
	set captionNodeContent(value) 
	{
		this.#captionNodeContent = value; 
		this.captionNode.value = value; 
	}
	
	get imgNode() { return this.#imgNode; }
	
	get src() { return this.#src; }
	set src(value)
	{ 
		this.#src = value; 
		this.imgNode.src = value; 
	}
}