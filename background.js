// Generic Click Handler
var clickHandler = function(info, tab) {
	var note,
		nts,
		now = new Date();

	note = info;
	note.context = info.menuItemId;
	note.id = now.getTime();
	note.title = tab.title;
	delete note.menuItemId;

	nts = JSON.parse(localStorage["nts"]);
	nts.push(note);
	localStorage["nts"] = JSON.stringify(nts);

	chrome.tabs.sendMessage(tab.id, {'type':'render'})
	// tab.sendMessage({'type':'render'});

};

chrome.extension.onMessage.addListener(function(msg, __, sendResponse) {
	var nts;
	console.log(msg);
	switch (msg.type) {
		case "lookup": 
			nts = JSON.parse(localStorage["nts"]);
			sendResponse(_.where(nts,{'pageUrl': msg.url}));
		break;
	}
});

var navigateTo = function() {
	chrome.tabs.create({url:chrome.extension.getURL("feed.html")});	
}

// Install time set-up
chrome.runtime.onInstalled.addListener(function() {
	// Set up localStorage
	if (!localStorage.nts) localStorage.nts = JSON.stringify([]);
	// Set up context menu tree
	var contexts = ["page","selection","link","editable","image","video","audio"];
	for (var i = 0; i < contexts.length; i++) {
	  var context = contexts[i];
	  var title = "Note '" + context + "' to self";
	  var id = chrome.contextMenus.create({"id": "context-" + context,"title": title, "contexts":[context], "onclick": clickHandler}); 
	}

	chrome.contextMenus.create({"id": "context-feed", "title": 'View my NTS', "onclick": function() {navigateTo("feed.html")}})
});

