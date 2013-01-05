(function (window) {
    if (!window.NTS)
        window.NTS = {};

    if (!window.NTS.Feed) {
        window.NTS.Feed = {
            render: function() {
                var notes = NTS.getNotes();
                var tmpl = Handlebars.compile($('#nts-tmpl-feedItem').html());
                var html = tmpl({'feed':notes.reverse()});

                $(".nts-notes").empty();
                $('.nts-notes').append(html);   
            }
        };
    }
})(window);
