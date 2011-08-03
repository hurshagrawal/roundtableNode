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
	$("head").append(rt.stylesheet);
	$("body").append('<div id="rt_div"></div>');
	
	
	rt.divframe = $("#rt_div");
	rt.divframe.hide();
	rt.divframe.append(rt.str);
	
	rt.divframe.fadeTo(400, 0.75)
			.draggable({ opacity: 0.40 })
			.css('position', 'fixed')
			.bind('dragstop', function(event, ui) {
				rt.divframe.css('position', 'fixed');
			})
		    .css("left", (($(window).width() - rt.boxwidth) / 2) + $(window).scrollLeft() + "px");
		
	rt.divframe.append('<img id="rt_close" src="'+rt.SERVERURL+'images/X.png" alt="Close" />');
	$("#rt_close").fadeTo(400, 1).click(function() {
		rt.divframe.hide(400);
	});

}
