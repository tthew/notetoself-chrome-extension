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
        console.log('lookup');
        chrome.runtime.sendMessage({type:'lookup',url:window.location.href}, function (response) {
          console.log(response);
          if (response.length) {
            $('body').addClass('nts-content');
            for(var i = 0; i < response.length; i++) {
              NTS.Content.highlight(response[i]);
            }
          }
        });
      },
      getSelectionText: function() {
        var html = "";

        var sel = window.getSelection();
        if (sel.rangeCount) {
          var container = document.createElement("div");
          for (var i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
          }

        }

        return container.innerText ? container.innerText : null;
      },
      setupKeyboardEventHandlers: function() {
        var note, selection;
        // Basic Keyboard Shortcut Implementation [Alt-C]
        $(window).keyup(function(e) {
          if (e.altKey && e.keyCode === 67) {
            selection = NTS.Content.getSelectionText();
            note = {
              pageUrl: location.href,
              context: 'context-page',
              title: $('title').text()
            }

            if (selection) {
              note.selectionText = selection;
              note.context = 'context-selection';
            }

            chrome.runtime.sendMessage({
              type:'createNote',
              note: note
            }, function (response) {
              if (response.type === 'success') {
                chrome.runtime.sendMessage({'type':'updateUI'});
              }
            });
          }
        });
      }
    };
  }
})(window);
