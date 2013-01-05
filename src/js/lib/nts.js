(function (window, undefined) {
	window.NTS = {
		init: function() {
			chrome.extension.onMessage.addListener(function(msg, __, sendResponse) {
				var allNotes, notes;
				allNotes = JSON.parse(localStorage["nts"]);
				switch (msg.type) {
					case "lookup": 
						sendResponse(_.where(nts,{'pageUrl': msg.url}));
					break;
					case "delete":
						 notes = _.reject(allNotes, function(note) {
						 	return note.id === msg.noteId;
						 });

						 localStorage.nts = JSON.stringify(notes);
						 sendResponse({"type":"success"});
						 NTS.updateBadge();
					break;
				}
			});

			chrome.browserAction.onClicked.addListener(function(tab) {
				NTS.navigateTo("feed.html");
			});
			// Install time set-up
			chrome.runtime.onInstalled.addListener(function() {
				// Set up localStorage
				if (!localStorage.nts) localStorage.nts = JSON.stringify([]);
				
			});
			chrome.runtime.onStartup.addListener(function() {
				NTS.setUpContextMenus();
			});

			NTS.setUpContextMenus();
		},
		getNotes: function () {
			return JSON.parse(localStorage["nts"]);
		},
		clickHandler: function (info, tab) {
			var note,
				nts,
				now = new Date();

			note = info;
			note.context = info.menuItemId;
			note.id = now.getTime();
			note.title = tab.title;
			delete note.menuItemId;

			nts = NTS.getNotes();
			nts.push(note);
			localStorage["nts"] = JSON.stringify(nts);

			chrome.tabs.sendMessage(tab.id, {'type':'render'})
			chrome.extension.sendMessage({'type':'render'});
			NTS.updateBadge();
		},
		configureBadge: function () {
			chrome.browserAction.setBadgeBackgroundColor({color: "#ff8000"});
		},
		updateBadge: function () {
			var nts = NTS.getNotes();
			if (nts.length > 0) {
				chrome.browserAction.setBadgeText({"text": "" + nts.length + ""});
			} else {
				chrome.browserAction.setBadgeText({"text":""});
			}
		},
		navigateTo: function (url) {
			chrome.tabs.create({url:chrome.extension.getURL(url)});	
		},
		setUpContextMenus: function () {
			// Set up context menu tree
			var contexts = ["page","selection","link","editable","image","video","audio"];
			for (var i = 0; i < contexts.length; i++) {
			  var context = contexts[i];
			  var title = "Note '" + context + "' to self";
			  var id = chrome.contextMenus.create({"id": "context-" + context,"title": title, "contexts":[context], "onclick": NTS.clickHandler}); 
			}
		},
		Feed: {
			render: function() {
				var notes = NTS.getNotes();
				var tmpl = Handlebars.compile($('#nts-tmpl-feedItem').html());
				var html = tmpl({'feed':notes.reverse()});

				$(".nts-notes").empty();
				$('.nts-notes').append(html);	
			}
		}
	}
})(window);