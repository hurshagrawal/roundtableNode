rt.SERVERURL = "http://ec2-67-202-30-240.compute-1.amazonaws.com/";

//Load JQuery, then call runthis();
(function() {
		
//	if (typeof jQuery == 'undefined') {
		var jQ = document.createElement('script');
		jQ.type = 'text/javascript';
		jQ.onload=checkForJQ_UI;
		jQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
		document.body.appendChild(jQ);
	// } else {
	// 	checkForJQ_UI();
	// }
})();

function checkForJQ_UI() {
//	if (!jQuery.ui) {
		var jQ_UI = document.createElement('script');
		jQ_UI.type = 'text/javascript';
		jQ_UI.onload=runthis;
		jQ_UI.src = ' https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js';
		document.body.appendChild(jQ_UI);
	// } else {
	// 	runthis();
	// }
}

function runthis() {
	/**
	 * jQuery BASE64 functions
	 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
	 * @link http://www.semnanweb.com/jquery-plugin/base64.html
	 * @see http://www.webtoolkit.info/
	 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
	 * @param {jQuery} {base64Encode:function(input))
	 * @param {jQuery} {base64Decode:function(input))
	 * @return string
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
	// new function($) {
	//   $.fn.setCursorPosition = function(pos) {
	//     if ($(this).get(0).setSelectionRange) {
	//       $(this).get(0).setSelectionRange(pos, pos);
	//     } else if ($(this).get(0).createTextRange) {
	//       var range = $(this).get(0).createTextRange();
	//       range.collapse(true);
	//       range.moveEnd('character', pos);
	//       range.moveStart('character', pos);
	//       range.select();
	//     }
	//   }
	// }(jQuery);
		
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
	
	//encode selected text and put in URL
	rt.t = getSelectedText().replace(/\s+/gi, " ");
	rt.t = $.trim(rt.t);	

	//rt.userID

	//show divframe if already exists
	rt.divframe = $('#rt_div');
	if (rt.divframe.length) { //if frame exists
		$('#rt_div').fadeIn();
			// if has text selected, copy into divframe
		if (rt.t != "") {
			if (rt.t !== "") { //adds quotes around the quote if a string exists
				rt.t = '"'+rt.t+'"  ';
			}

			$('#rt_post textarea').val(rt.t+"@").focus();
		} else {
			// want to set focus back to that item but can't - access denied
		}
		return;
	}
	
	rt.boxheight = 330;
	rt.boxwidth = 700;
	
	rt.stylesheet = '<link rel="stylesheet" href="'+ rt.SERVERURL + 
		'stylesheets/bookmarklet.css" type="text/css" media="screen" title="no title" charset="utf-8">';
	
	//append div and div stylesheet to body
	$("head").append(rt.stylesheet)
			.append("<link href='http://fonts.googleapis.com/css?family=Paytone+One' rel='stylesheet' type='text/css'>")
			.append("<link href='http://fonts.googleapis.com/css?family=Rosario' rel='stylesheet' type='text/css'>");
	$("body").append('<div id="rt_div"></div>');
	
	
	//create main divs for overlay - logo, close window, and 2 forms
	rt.divframe = $("#rt_div");
	rt.divframe.hide();
	rt.divframe.append(rt.str)
			.append('<img id="rt_close" src="'+rt.SERVERURL+'images/X.png" alt="Close" />')
			.append('<div id="rt_logo">roundtable</div>')
			.append('<div id="rt_post"></div>')

	//populate roundtable div
	$('#rt_post').append('<div id="rt_label">roundtable topic</div><textarea rows="12"></textarea>')
				.append('<div id="rt_submit">create a roundtable</div>');

	
	//TODO - properly format quoted. RESIZE the box.
	
	//activates div frame after creation
	rt.divframe.fadeIn()
			.css('position', 'fixed')
			.draggable({ opacity: 0.40 })
			.bind('dragstop', function(event, ui) {
				$("#rt_div").css('position', 'fixed');
			})
		    .css("left", (($(window).width() - rt.boxwidth) / 2) + $(window).scrollLeft() + "px");
	
	//close button binding	
	$("#rt_close").click(function() {
		$("#rt_div").fadeOut();
	});
	
	//put selected string into roundtable text area
	if (rt.t !== "") { //adds quotes around the quote if a string exists
		rt.t = '"'+rt.t+'"  ';
	}
	
	//focuses on text area
	$('#rt_post textarea').val(rt.t+"@").focus();
	
	//AJAX FUNCTIONS
	
	//roundtable submit button
	$('#rt_submit').click(function() {
		//TODO - do stuff with the actual divs
		
		var dataString = 'userID=' + rt.userID + '&postContent=' 
			+ $.base64Encode($('#rt_post textarea').val());
			
		console.log(rt.SERVERURL+'createRoundtable?'+dataString);
		
		$("#rt_post").fadeOut("fast");
		$("#rt_post").append('<iframe src="'+rt.SERVERURL+'createRoundtable?'+dataString+'" width="100%" height="800"></iframe>').fadeIn("fast");
	});
}