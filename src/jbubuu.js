//      jbubuu.js
//      
//      Copyright 2011 Giuseppe D'Inverno <giudinvx[at]gmail[dot]com>
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

window.JBubuu = function() {
	jBubuu.config.init();
}

jBubuu = {
	version: "0.0.4",
	
	config: {
		titlecms: "", modules: "",
				
		init: function () {
			var config = jBubuu.corefunc.ajax("data/config.xml");
			
			this.modules  = config.getElementsByTagName("modules")[0].firstChild.nodeValue;
			this.titlecms = config.getElementsByTagName("title")[0].firstChild.nodeValue;
			var filecss   = config.getElementsByTagName("theme")[0].firstChild.nodeValue;

			var confile = {	1 : 'this.setTheme(filecss);',
							2 : 'this.setMenu("data/menu.xml");',
							3 : 'jBubuu.corefunc.checkhash();' };
							
			for (var pos in confile) {
				eval(confile[pos]);
			}  
		},
		
		setTheme: function (namefile) {
			this.setCss(namefile);
 
 			document.title = this.titlecms;

			document.body.innerHTML = jBubuu.corefunc.ajax(namefile+"main.html");
		},
		
		setCss: function (namecss) {
			var linkcss  = document.createElement("link");
			linkcss.href = namecss+"main.css";
			linkcss.rel  = "stylesheet";
			linkcss.type = "text/css"; 
			
			document.getElementsByTagName("head")[0].appendChild(linkcss);
		},
		
		setMenu: function (namefile) {
			var config = jBubuu.corefunc.ajax(namefile);
			
			var slmenu = this.getXmlElement( config, "menu", "select" );
			var pages  = this.getXmlElement( config, "mainmenu" );
			var onlyme = this.getXmlElement( config, "singlemenu" );

			document.getElementById('navigation').innerHTML = onlyme+jBubuu.corefunc.repl(slmenu, ["#menu", " Menu"])+pages;
		},
		
		getXmlElement: function( file, elem, getAttr ) 
		{
			if( typeof getAttr == "undefined" ) {
				return file.getElementsByTagName( elem )[0].firstChild.nodeValue;
			} else {
				return file.getElementsByTagName( elem )[0].getAttribute( getAttr );
			}
		}
			
	},
	
	corefunc: {
		oldH: "",
		
		ajax: function ( file ) {
			if (window.XMLHttpRequest)
				var xhr = new XMLHttpRequest();
			else
				var xhr = new ActiveXObject('Microsoft.XMLHTTP');
				
			xhr.open('GET', file, false);
			xhr.send(null);

			if (xhr.readyState == 4) {
				if (xhr.status != 200) {
					throw new Error( "Error "+xhr.status+" status" );
				} else {
					var type = xhr.getResponseHeader('Content-type');
					if (type == 'application/xml') {
						return xhr.responseXML;
					} else if (type == 'text/html' || type == 'application/javascript') {
						return xhr.responseText;
					} else {
						throw new Error( "Unknown Content-type" );
					}
				}
			}
		},
		
		modules: function (name) {
			try {
				var exmod = this.ajax("src/modules/"+name+"/modmain.js");
				eval(exmod);
			} catch (e) {
				console.log( e.message );
			}
		},
		
		repl: function (str, arr) {
			var lengarr = arr.length;
			
			if (lengarr == 1)
				return str.replace("@{"+arr[0]+"}", arr[0]);

			for (var i = 0; i < lengarr; i++)
				str = str.replace(/([^.])(@\{(.*?)\})/, "\$1"+arr[i]);
			
			return str;
		},
		
		query: function (url) {
			var result = {};
			
			var page = url.match(/(^[a-z0-9]*)$/);
			
			if (page || page == "") {
				result["page"] = page[1];
				
				return result;
			}
			
			url.replace (
				new RegExp("([^?=&]+)(=([^&]*))?", "g"),
				function($0, $1, $2, $3) { result[$1] = $3; }
			);
			
			return result;
		},

		checkhash: function () {
			this.changepag("home");

			setInterval( function () {
				var newH = location.hash.substring(1);

				if (/[#?].+/.exec(window.location.hash) && this.oldH != newH) {
					this.oldH = newH;
					window.location.hash = newH;
					jBubuu.corefunc.changepag(newH);
						
					return;
				}
			}, 500);
		},

		changepag: function (pagename) {
			var changepage = this.query(pagename);

			if( changepage.page ) {
				var pages  = this.ajax("data/pages.xml");
				var pagobj = pages.getElementsByTagName("page");

				for (var i = 0, npag = pagobj.length; i < npag; i++) {
					if (pagobj[i].getAttribute("name") == changepage.page) {
						document.getElementById("container").innerHTML = pages.getElementsByTagName("page")[i].firstChild.nodeValue;
						return;
					}
				}
				document.getElementById("container").innerHTML = "404 Page not found";
			} else if (changepage.module) {
				jBubuu.corefunc.modules(changepage.module);
			} else {
				document.getElementById("container").innerHTML = "404 Page not found";
			}
			return;
		}
	}
}
})();
