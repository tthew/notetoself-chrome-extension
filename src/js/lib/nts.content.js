(function (window) {
	if (!window.NTS)
		window.NTS = {};

	if (!window.NTS.Content) {
		window.NTS.Content = {
			resetDom: function() {
				$('span.highlight').contents().unwrap();
				$('a.highlight').removeClass('highlight');
			},
			highlight: function(selection) {
				if (selection.selectionText) {
					// We've got selection text
					$('body').highlight(selection.selectionText);	
				}
				if (selection.linkUrl) {
					// We've got a link
					$('a[href="' + selection.linkUrl +'"]').addClass('highlight');
				}			
			},
			lookup: function() {
				chrome.extension.sendMessage({type:"lookup",url:window.location.href}, function (response) {
					for(var i = 0; i < response.length; i++) {
						highlight(response[i]);
					}
				});	
			}
		};
	}
})(window);
