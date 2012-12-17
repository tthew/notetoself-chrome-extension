(function(){
	chrome.extension.sendMessage({type:"lookup",url:window.location.href}, function(response) {
		console.log(response);
		for(var i = 0; i < response.length; i++) {
			$('body').highlight(response[i].selectionText);
			$('a[href="' + response[i].linkUrl +'"]').addClass('highlight');
		}
  });	
})();