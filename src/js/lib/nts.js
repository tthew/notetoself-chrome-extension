var NTS = {
    Models: {
    },
    Collections: {
    },
    Views:  {

    }, 
    init: function(notes) {
        this.notes = notes;
        chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
            var notes;
            switch (msg.type) {
                case "lookup": 
                    sendResponse(notes.where({'pageUrl': msg.url}));
                break;
                case "delete":              
                    notes.get(msg.noteId).destroy({
                        success: function() {
                            sendResponse({"type":"success"});
                            NTS.updateBadge();
                        }
                    });
                break;
                case "createNote":
                    NTS.createNote(msg.note);
                    sendResponse({"type":"success"});
                break;
                case "updateUI":
                    NTS.updateUI(sender.tab);
                    sendResponse({"type": "success"});
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
        return this.notes;
    },
    clickHandler: function (info, tab) {
        NTS.createNote(_.extend({title: tab.title, context: info.menuItemId}, info));
        NTS.updateUI(tab);
    },
    createNote: function(data) {
        var note,
            now = new Date();

        note = new NTS.Models.Note();
        note.save({           
            dateCreated: now.getTime(),
            title: data.title,
            context: data.context,
            pageUrl: data.pageUrl || null,
            linkUrl: data.linkUrl || null,
            srcUrl: data.srcUrl || null,
            selectionText: data.selectionText || null
        });

    },
    updateUI: function(tab) {
        console.log("UPDATE UI");
        console.log(tab);

        chrome.tabs.sendMessage(tab.id, {'type':'render'});
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
    }
}