
var getNts = function() {
	return JSON.parse(localStorage["nts"]);
}

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

	nts = getNts();
	nts.push(note);
	localStorage["nts"] = JSON.stringify(nts);

	chrome.tabs.sendMessage(tab.id, {'type':'render'})
	chrome.extension.sendMessage({'type':'render'});
	updateBadge();

};

chrome.extension.onMessage.addListener(function(msg, __, sendResponse) {
	var nts;
	nts = JSON.parse(localStorage["nts"]);
	switch (msg.type) {
		case "lookup": 
			sendResponse(_.where(nts,{'pageUrl': msg.url}));
		break;
		case "delete":
			 var notes = _.reject(nts, function(note) {
			 	return note.id === msg.noteId;
			 });

			 localStorage.nts = JSON.stringify(notes);
			 sendResponse({"type":"success"});
			 updateBadge();
		break;
	}
});

var updateBadge = function() {
	var nts = getNts();
	if (nts.length > 0) {
		chrome.browserAction.setBadgeText({"text": "" + nts.length + ""});
	} else {
		chrome.browserAction.setBadgeText({"text":""});
	}
}

var navigateTo = function(url) {
	chrome.tabs.create({url:chrome.extension.getURL(url)});	
};

chrome.browserAction.onClicked.addListener(function(tab) {
	navigateTo("feed.html");
});

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

chrome.browserAction.setBadgeBackgroundColor({color: "#ff8000"});
updateBadge();