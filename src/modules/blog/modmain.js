//      modmain.js
//      
//      Copyright 2010 Giuseppe D'Inverno <giudinvx[at]gmail[dot]com>
//      
//      This program is free software; you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation; either version 2 of the License, or
//      (at your option) any later version.
//      
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//      
//      You should have received a copy of the GNU General Public License
//      along with this program; if not, write to the Free Software
//      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
//      MA 02110-1301, USA.
(function() {

	var divblog = document.getElementById("container").appendChild(document.createElement("div")); 
	divblog.setAttribute("id", "blog");
	
	var carticles = jBubuu.corefunc.ajax("src/modules/blog/article.xml");
	
	var articles = carticles.getElementsByTagName("articles");
	var posts    = articles[0].getElementsByTagName("post");
	var lposts   = posts.length;
 
	for(var j = 0; j < lposts; j++) {
		var divarticles = document.getElementById("blog").appendChild(document.createElement("div")); 
		divarticles.setAttribute("class", "post");
		
		divarticles.innerHTML = posts[j].firstChild.nodeValue;
	}
 
})();
