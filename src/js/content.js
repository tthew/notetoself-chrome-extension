(function(){

  	chrome.extension.onMessage.addListener(function(msg) {
  		if (msg.type === "render") {
  			NTS.Content.resetDom();
  			NTS.Content.lookup();
  		}
  	});

  	NTS.Content.lookup();
})();