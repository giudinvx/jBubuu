(function() {

	var divblog = document.getElementById("container").appendChild(document.createElement("div")); 
	divblog.setAttribute("id", "blog");
	
	var carticles = jBubuu.corefunc.ajax("src/modules/blog/article.xml");
	
	var articles = carticles.getElementsByTagName("articles");
	var posts    = articles[0].getElementsByTagName("post");
	var lposts   = posts.length;
	//divblog.innerHTML = pos[0].firstChild.nodeValue;
 
	for(var j = 0; j < lposts; j++) {
		var divarticles = document.getElementById("blog").appendChild(document.createElement("div")); 
		divarticles.setAttribute("class", "post");
		
		divarticles.innerHTML = posts[j].firstChild.nodeValue;
	}
 
})();
