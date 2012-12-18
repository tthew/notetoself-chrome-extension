(function(){

	var resetDom = function() {
		$('span.highlight').contents().unwrap();
		$('a.highlight').removeClass('highlight');
	}

	var highlight = function(selection) {

			if (selection.selectionText) {
				// We've got selection text
				$('body').highlight(selection.selectionText);	
			}
			
			if (selection.linkUrl) {
				// We've got a link
				$('a[href="' + selection.linkUrl +'"]').addClass('highlight');
			}
			
	};

	var lookup = function() {
		chrome.extension.sendMessage({type:"lookup",url:window.location.href}, function(response) {
			for(var i = 0; i < response.length; i++) {
				highlight(response[i]);
			}
  		});	
	};

  	chrome.extension.onMessage.addListener(function(msg) {
  		if (msg.type === "render") {
  			resetDom();
  			lookup();
  		}
  	});

  	lookup();
})();