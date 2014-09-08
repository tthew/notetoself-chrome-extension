(function (window, undefined) {
  window.NTS = {
    init: function() {
      chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
        NTS.getNotes(function (allNotes) {
          switch (msg.type) {
            case "lookup":
              var result = _.where(allNotes, {
                pageUrl: msg.url
              });
              sendResponse(result);
            break;
            case "delete":
              var notes = _.reject(allNotes, function (note) {
              return note.id === msg.noteId;
            });
            chrome.storage.sync.set({'nts': notes}, function () {
              sendResponse({"type":"success"});
            });
            break;
            case "createNote":
              NTS.createNote(msg.note, function () {
              sendResponse({"type":"success"});
            });
            break;
            case "updateUI":
              NTS.updateUI(sender.tab);
            sendResponse({"type": "success"});
            break;
          }
        });
        return true;
      });

      chrome.browserAction.onClicked.addListener(function(tab) {
        NTS.navigateTo("feed.html");
      });
      // Install time set-up
      chrome.runtime.onInstalled.addListener(function() {
        // Set up localStorage
        if (localStorage.nts) {
          console.log('Existing legacy user, we need to migrate them to new storage.sync');
          var localNts = JSON.parse(localStorage.nts);
          chrome.storage.sync.set({'nts': localNts}, function () {
            delete localStorage.nts;
            console.log('DONE');
          });
        }
      });
      chrome.runtime.onStartup.addListener(function() {
        NTS.setUpContextMenus();
      });

      chrome.storage.onChanged.addListener(function () {
        NTS.updateUI();
        return true;
      });

      NTS.setUpContextMenus();
      NTS.configureBadge();
    },
    getNotes: function (done) {
      return chrome.storage.sync.get(function (store) {
        done(store.nts);
      });
    },
    clickHandler: function (info, tab) {
      NTS.createNote(_.extend({title: tab.title, context: info.menuItemId}, info));
    },
    createNote: function(note, done) {
      var done = done || function() {};
      NTS.getNotes(function (notes) {
        var now = new Date();
        note.id = now.getTime();
        notes.push(note);
        chrome.storage.sync.set({'nts':notes}, function () {
          done();
        });
      });

    },
    updateUI: function(tab) {
      if (!tab) {
        chrome.tabs.query({}, function (tabs) {
          _.each(tabs, function (tab) {
            chrome.tabs.sendMessage(tab.id, {'type':'render'});
          });
        });
      } else {
        chrome.tabs.sendMessage(tab.id, {'type':'render'});
      }
      chrome.runtime.sendMessage({'type':'render'});
      NTS.updateBadge();
    },
    configureBadge: function () {
      chrome.browserAction.setBadgeBackgroundColor({color: "#ff8000"});
      chrome.storage.onChanged.addListener(function () {
        NTS.updateBadge();
        return true;
      });
    },
    updateBadge: function () {
      NTS.getNotes(function (nts) {
        if (nts.length > 0) {
          chrome.browserAction.setBadgeText({"text": "" + nts.length + ""});
        } else {
          chrome.browserAction.setBadgeText({"text":""});
        }
      });
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
        var id = chrome.contextMenus.create({
          "id": "context-" + context,
          "title": title,
          "contexts":[context],
          "onclick": NTS.clickHandler
        });
      }
    }
  }
})(window);
