function createAlertMessage(text) {
	// bootbox.alert(text);

	alert(text);
}

function collapseNavBar() {
	$('div.navbar-collapse.in').removeClass('in').addClass('collapse');
}

var $body = jQuery('body'); 

$(document).on('blur', 'input, textarea', function(e) {
	setTimeout(function() {
		window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
	}, 0);
});



document.addEventListener("deviceready", deviceReadyHandler, false);  


function deviceReadyHandler () {
	document.addEventListener("backbutton", backButtonHandler, false);
}

function backButtonHandler(e) {
	e.preventDefault();
}

function toBase64(toEncode) {
	return window.btoa(toEncode);
}