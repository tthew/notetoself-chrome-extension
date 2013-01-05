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
            },
            getSelectionHtml: function() {
                var html = "";
                if (typeof window.getSelection != "undefined") {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        html = container.innerHTML;
                    }
                } else if (typeof document.selection != "undefined") {
                    if (document.selection.type == "Text") {
                        html = document.selection.createRange().htmlText;
                    }
                }
                return html;
            },
            setupKeyboardEventHandlers: function() {
                // Basic Keyboard Shortcut Implementation [Alt-C]
                $(window).keyup(function(e) {
                    if (e.altKey && e.keyCode === 67) {
                        var selection = NTS.Content.getSelectionHtml();
                        var note = {
                            pageUrl: location.href,
                            context: 'context-page',
                            title: $('title').text()
                        }

                        if (selection) {
                            console.log(selection);
                            note.selectionText = selection;
                            note.context = 'context-selection';
                        }

                        chrome.extension.sendMessage({
                                type:'createNote', 
                                note: note
                        }, function (response) {
                            if (response.type === 'success') {
                                chrome.extension.sendMessage({'type':'updateUI'}, function(response) {

                                });
                            }
                        });
                    }
                });
            }
        };
    }
})(window);
