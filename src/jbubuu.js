//      jbubuu.js
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
window.JBubuu = function() {
	jBubuu.config.init();
}

jBubuu = {
	version: "0.0.3",
	
	config: {
		titlecms: "", modules: "",
				
		init: function () {			
			var config = jBubuu.corefunc.ajax("data/config.xml");
			
			this.modules  = config.getElementsByTagName("modules")[0].firstChild.nodeValue;
			this.titlecms = config.getElementsByTagName("title")[0].firstChild.nodeValue;
			var filecss   = config.getElementsByTagName("theme")[0].firstChild.nodeValue;

			var confile = {	1 : 'this.setTheme(filecss);',
							2 : 'this.setMenu("data/menu.xml");',
							3 : 'jBubuu.corefunc.ckCr();' };
							
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
			
			var slmenu = config.getElementsByTagName("menu")[0].getAttribute("select"); 		
			var pages  = config.getElementsByTagName("mainmenu")[0].firstChild.nodeValue; 
			var onlyme = config.getElementsByTagName("singlemenu")[0].firstChild.nodeValue;

			document.getElementById('navigation').innerHTML = onlyme+jBubuu.corefunc.repl(slmenu, ["#menu", " Menu"])+pages;
		}
			
	},
	
	corefunc: {
		oldH: "",
		
		ajax: function (path) {
			if (window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
			}
			else {
				var xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}
			xhr.open('GET', path, false);
			xhr.send(null);

			if (xhr.readyState == 4) {
				if (xhr.status != 200) {
					alert('Error '+xhr.status+' status');
				} else {
					var type = xhr.getResponseHeader('Content-type');
					if (type == 'application/xml') {
						return xhr.responseXML;
					} else if (type == 'text/html' || type == 'application/javascript') {
						return xhr.responseText;
					} else {
						alert('Unknown Content-type');
					}
				}
			}
		},
		
		modules: function (name) {
			var lol = this.ajax("src/modules/"+name+"/modmain.js");
			eval(lol);
		},
		
		repl: function (str, arr) {
			var lengarr = arr.length;
			
			if (lengarr == 1) {
				return str.replace("@{"+arr[0]+"}", arr[0]);
			}

			for (var i = 0; i < lengarr; i++) {
				str = str.replace(/([^.])(@\{(.*?)\})/, "\$1"+arr[i]);
			}
			
			return str;
		},
		
		goChg: function (url) {
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

		ckCr: function () {
			this.ckPag("home");
				var ckCro = function () {
					var newH = location.hash.substring(1);

					if (/[#?].+/.exec(window.location.hash) && this.oldH != newH) {
						this.oldH = newH;
 						window.location.hash = newH;
						jBubuu.corefunc.ckPag(newH);
						
						return;
					}
				}
				setInterval(ckCro, 500);
		},

		ckPag: function (query) {
			var chindex = this.goChg(query);

			if (chindex.page) {
				var pages  = this.ajax("data/pages.xml");
				var pagobj = pages.getElementsByTagName("page");
				var npag   = pagobj.length;

				for (var i = 0; i < npag; i++) {
					if (pagobj[i].getAttribute("name") == chindex.page) {
						document.getElementById("container").innerHTML = pages.getElementsByTagName("page")[i].firstChild.nodeValue;

						return;
					} 
				}
				document.getElementById("container").innerHTML = "404 Page not found";
			} else if (chindex.module) {
				jBubuu.corefunc.modules(chindex.module);
			} else {
				document.getElementById("container").innerHTML = "BohBoh";
			}
			
			return;
		}
	}
}
})();
