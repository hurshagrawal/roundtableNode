rt.SERVERURL = "http://ec2-67-202-30-240.compute-1.amazonaws.com/";

//Load JQuery, then call runthis();
(function() {
		
	if (typeof jQuery == 'undefined') {
		var jQ = document.createElement('script');
		jQ.type = 'text/javascript';
		jQ.onload=checkForJQ_UI;
		jQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
		document.body.appendChild(jQ);
	} else {
		checkForJQ_UI();
	}
})();

function checkForJQ_UI() {
	if (!jQuery.ui) {
		var jQ_UI = document.createElement('script');
		jQ_UI.type = 'text/javascript';
		jQ_UI.onload=runthis;
		jQ_UI.src = ' https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js';
		document.body.appendChild(jQ_UI);
	} else {
		runthis();
	}
}

function runthis() {
		
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
	rt.t = getSelectedText();	

	//rt.userID

	//show divframe if already exists
	rt.divframe = $('#rt_div');
	if (rt.divframe.length) { //if frame exists
		$('#rt_div').fadeIn();
			// if has text selected, copy into divframe
		if (rt.t != "") {
			/*  -------------TODO - change selected text input ----
			 */
		} else {
			// want to set focus back to that item but can't - access denied
		}
		return;
	}
	
	rt.boxheight = 400;
	rt.boxwidth = 700;
	
	rt.stylesheet = '<link rel="stylesheet" href="'+ rt.SERVERURL + 
		'stylesheets/bookmarklet.css" type="text/css" media="screen" title="no title" charset="utf-8">';
	
	//append div and div stylesheet to body
	
	$("head").append(rt.stylesheet)
			.append("<link href='http://fonts.googleapis.com/css?family=Paytone+One' rel='stylesheet' type='text/css'>")
			.append("<link href='http://fonts.googleapis.com/css?family=Rosario' rel='stylesheet' type='text/css'>");
	$("body").append('<div id="rt_div"></div>');
	
	
	rt.divframe = $("#rt_div");
	rt.divframe.hide();
	rt.divframe.append(rt.str)
			.append('<img id="rt_close" src="'+rt.SERVERURL+'images/X.png" alt="Close" />')
			.append('<div id="rt_logo">roundtable</div>')
			.append('<div id="rt_tweet"></div>')
			.append('<div id="rt_post"></div>');

	$('#rt_tweet').append('<div class="rt_label">Tweet:</div><textarea class="rt_input" rows="3">');
	$('#rt_post').append('<div class="rt_label">Roundtable post:</div><textarea class="rt_input" rows="8">');
	
	//TODO - properly format quoted. RESIZE the box.
	
	rt.divframe.fadeIn()
			.draggable({ opacity: 0.40 })
			.css('position', 'fixed')
			.bind('dragstop', function(event, ui) {
				rt.divframe.css('position', 'fixed');
			})
		    .css("left", (($(window).width() - rt.boxwidth) / 2) + $(window).scrollLeft() + "px");
		
	$("#rt_close").click(function() {
		rt.divframe.fadeOut();
	});

}
