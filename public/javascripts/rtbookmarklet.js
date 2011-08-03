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
	
	rt.boxheight = 500;
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
			.append('<div id="rt_tweet"></div>');

	//populate roundtable and tweet divs
	$('#rt_post').append('<div class="rt_label">roundtable post</div><textarea class="rt_input" rows="9"></textarea>')
				.append('<div class="rt_submit" id="rt_subpost">create a roundtable</div>');
					
	$('#rt_tweet').append('<div class="rt_label">tweet</div><textarea class="rt_input" rows="3"></textarea>')
				.append('<div class="rt_submit" id="rt_subtweet">send tweet</div>');

	//makes textareas fade out when not activated
	$('#rt_tweet textarea').val("(optional)").click(function() {
		if ($('#rt_tweet textarea').val() === "(optional)") {
			$('#rt_tweet textarea').val("").css("color", "black");
		}
	}).focusout( function() {
		if ($('#rt_tweet textarea').val() === "") {
			$('#rt_tweet textarea').val("(optional)").css("color", "grey");
		}
	}).css("color", "grey");
	
	//TODO - properly format quoted. RESIZE the box.
	
	//activates div frame after creation
	rt.divframe.fadeIn()
			.draggable({ opacity: 0.40 })
			.css('position', 'fixed')
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
	$('#rt_subpost').click(function() {
		//TODO - do stuff with the actual divs
		
		var dataString = 'userID=' + rt.userID + '&postContent=' 
			+ encodeURI($('#rt_post textarea').val());
			
		console.log(dataString);
		
		$("rt_tweet").children().hide();
		$("rt_tweet").append(<'iframe src="'+rt.SERVERURL+'createRoundtable?'+dataString'" width="100%" height="800"></iframe>');
	});
}