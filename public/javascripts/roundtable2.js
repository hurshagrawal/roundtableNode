var SERVERURL = "http://ec2-67-202-30-240.compute-1.amazonaws.com/";


function addCSS(url){
  var headID = document.getElementsByTagName("head")[0];
  var cssNode = document.createElement('link');
  cssNode.type = 'text/css';
  cssNode.rel = 'stylesheet';
  cssNode.href = url;
  cssNode.media = 'screen';
  headID.appendChild(cssNode);
}

var END_OF_INPUT = -1;
var base64Chars = new Array(
    'A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X',
    'Y','Z','a','b','c','d','e','f',
    'g','h','i','j','k','l','m','n',
    'o','p','q','r','s','t','u','v',
    'w','x','y','z','0','1','2','3',
    '4','5','6','7','8','9','+','/'
);

var reverseBase64Chars = new Array();
for (var i=0; i < base64Chars.length; i++){
    reverseBase64Chars[base64Chars[i]] = i;
}

var base64Str;
var base64Count;
function setBase64Str(str){
    base64Str = str;
    base64Count = 0;
}
function readBase64(){    
    if (!base64Str) return END_OF_INPUT;
    if (base64Count >= base64Str.length) return END_OF_INPUT;
    var c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count++;
    return c;
}
function encodeBase64(str){
    setBase64Str(str);
    var result = '';
    var inBuffer = new Array(3);
    var lineCount = 0;
    var done = false;
    while (!done && (inBuffer[0] = readBase64()) != END_OF_INPUT){
        inBuffer[1] = readBase64();
        inBuffer[2] = readBase64();
        result += (base64Chars[ inBuffer[0] >> 2 ]);
        if (inBuffer[1] != END_OF_INPUT){
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
            if (inBuffer[2] != END_OF_INPUT){
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
                result += (base64Chars [inBuffer[2] & 0x3F]);
            } else {
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
                result += ('=');
                done = true;
            }
        } else {
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
            result += ('=');
            result += ('=');
            done = true;
        }
        lineCount += 4;
        if (lineCount >= 76){
            result += ('\n');
            lineCount = 0;
        }
    }
    return result;
}

/* make string URL safe; remove padding =, replace "+" and "/" with "*" and "-" */
function encodeBase64ForURL(str){
   var str = encodeBase64(str).replace(/=/g, "").replace(/\+/g, "*").replace(/\//g, "-");
   str = str.replace(/\s/g, "");   /* Watch out! encodeBase64 breaks lines at 76 chars -- we don't want any whitespace */
   return str;
}

function keyPressHandler(e) {
      var kC  = (window.event) ?    // MSIE or Firefox?
                 event.keyCode : e.keyCode;
      var Esc = (window.event) ?   
                27 : e.DOM_VK_ESCAPE // MSIE : Firefox
      if(kC==Esc){
         // alert("Esc pressed");
         $("#roundtableFrame").hide(2);
      }
}

function showItem(id){
  try{
    var item = document.getElementById(id);
    if(item){
        item.style.display = "";
    }
  }
  catch(e){
  
  }
}

(function(){

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
		// get the currently selected text
		var t;
		try {
			t=((window.getSelection && window.getSelection())||(document.getSelection && document.getSelection())||(document.selection && document.selection.createRange && document.selection.createRange().text));
		}
		catch(e){ // access denied on https sites
			t = "";
		}

		var quotestring = t.toString();

		if (quotestring == ""){
			quotestring = "";
		}


		var iframe_url = SERVERURL + "roundtable.html?d=&c=" + encodeBase64ForURL(quotestring);

		var existing_iframe = document.getElementById('roundtable_iframe');

		if (existing_iframe){
			showItem('roundtable_bookmarklet');
			// if has text selected, copy into iframe
			if (quotestring != ""){
				existing_iframe.src = iframe_url;
			}
			else{
				// want to set focus back to that item! but can't - access denied
			}
			return;
		}
		
		var boxheight = 400;
		var boxwidth = 700;

		addCSS(SERVERURL + "stylesheets/roundtable.css");

		var div = document.createElement("div");
		div.id = "roundtable_bookmarklet";

		var str = "";
		str += "<table id='roundtable_table' valign='middle' width='"+boxwidth+"' cellspacing='0' cellpadding='0'>"
		str += "<tr><td width ='"+boxwidth+"' height='"+boxheight+"'>";
		str += "<iframe frameborder='0' scrolling='no' name='roundtable_iframe' id='roundtable_iframe' src='"
		str += iframe_url + "' width='"+boxwidth+"' height='"+boxheight+"' style='text-align: center; background-color: white;'>";
		str += "</iframe></td><td onClick='toggleItem(\"roundtable_bookmarklet\");' title='click to close window' valign='top' align='center' width='20px'>";
		str += "<a href='javascript:void(0);' style='width:100%; text-align: middle; color: black; font-family: Arial;'>(X)</a>";
		str += "</td></tr></table>";

		div.innerHTML = str;

		div.onkeypress = keyPressHandler;
		document.body.insertBefore(div, document.body.firstChild);
		
		$('#roundtable_iframe').contents().find('#body').html(t);
		console.log(t);
	}


  