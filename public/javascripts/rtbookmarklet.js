rt.SERVERURL = "http://ec2-67-202-30-240.compute-1.amazonaws.com/";

//Load JQuery, then call runthis();
(function() {
	if (typeof jQuery == 'undefined') {
		var jQ = document.createElement('script');
		jQ.type = 'text/javascript';
		jQ.onload=runthis;
		jQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
		document.body.appendChild(jQ);
	} else {
		runthis();
	}
})();

function runthis() {
	
	/**
	* jQuery BASE64 functions
	* 
	* Encodes and Decodes the given data in base64.
	* This encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean, such as mail bodies.
	* Base64-encoded data takes about 33% more space than the original data. 
	* This javascript code is used to encode / decode data using base64 (this encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean). Script is fully compatible with UTF-8 encoding. You can use base64 encoded data as simple encryption mechanism.
	* If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag). 
	* This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
	* 
	* @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
	* @link http://www.semnanweb.com/jquery-plugin/base64.html
	* @see http://www.webtoolkit.info/
	* @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
	*/
	(function($){
		var keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		var uTF8Encode = function(string) {
			string = string.replace(/\x0d\x0a/g, "\x0a");
			var output = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					output += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					output += String.fromCharCode((c >> 6) | 192);
					output += String.fromCharCode((c & 63) | 128);
				} else {
					output += String.fromCharCode((c >> 12) | 224);
					output += String.fromCharCode(((c >> 6) & 63) | 128);
					output += String.fromCharCode((c & 63) | 128);
				}
			}
			return output;
		};

		var uTF8Decode = function(input) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while ( i < input.length ) {
				c = input.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = input.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = input.charCodeAt(i+1);
					c3 = input.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}

		$.extend({
			base64Encode: function(input) {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
				input = uTF8Encode(input);
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
				}
				return output;
			},
			base64Decode: function(input) {
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				while (i < input.length) {
					enc1 = keyString.indexOf(input.charAt(i++));
					enc2 = keyString.indexOf(input.charAt(i++));
					enc3 = keyString.indexOf(input.charAt(i++));
					enc4 = keyString.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
				}
				output = uTF8Decode(output);
				return output;
			}
		});
	})(jQuery);
	

	/*	Bookmarklet creation code
	 */
	
	//get selected text
	function getSelectedText(){ 
		if (window.getSelection) { 
			return window.getSelection().toString(); 
		} else if (document.getSelection) { 
			return document.getSelection(); 
		} else if (document.selection) { 
			return document.selection.createRange().text; 
		} 
	}
	
	
	rt.t = getSelectedText();	
	rt.iframe_url = rt.SERVERURL + "roundtable.html?d="+ rt.userID +"&c=" + $.base64Encode(rt.t);

	console.log("rt.iframe_url = "+rt.iframe_url);
	
	rt.iframe = $('#roundtable_iframe');
	if (rt.iframe) { //if frame exists
		$('#roundtable_iframe').show(2);
			// if has text selected, copy into iframe
		if (rt.t != "") {
			rt.iframe.src = rt.iframe_url;
		} else {
			// want to set focus back to that item! but can't - access denied
		}
		return;
	}
	
	rt.boxheight = 400;
	rt.boxwidth = 700;
	
	$("head").append('<link rel="stylesheet" href="'+ rt.SERVERURL + '/stylesheets/iframe.css" '+
		'type="text/css" media="screen" title="no title" charset="utf-8">');

	$("body").append('<div id="roundtable_iframe"></div>');
	console.log(9);
	
	rt.str = "";
	rt.str += "<iframe frameborder='0' scrolling='no' name='roundtable_iframe' id='roundtable_iframe' src='" + rt.iframe_url;
	rt.str += "' width='"+rt.boxwidth+"' height='"+rt.boxheight+"' style='text-align: center; background-color: white;'></iframe>";
	
	rt.iframe = $("#roundtable_iframe");
	
	rt.iframe.append(str);
	rt.iframe.keypress( function(e) {
		if (e.which == 27 ) {
			rt.iframe.hide(2);
		}
	});

}
