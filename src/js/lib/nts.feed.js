(function (window) {
  if (!window.NTS)
    window.NTS = {};

  if (!window.NTS.Feed) {
    window.NTS.Feed = {
      render: function() {
        NTS.getNotes(function (notes) {
          console.log(notes);
          _.each(notes, function(note) {
            note.date = new Date(note.id);
          });
          var tmpl = Handlebars.compile($('#nts-tmpl-feedItem').html());
          var html = tmpl({'feed':notes.reverse()});

          $(".nts-notes").empty();
          $('.nts-notes').append(html);
        });
      }
    };
  }
})(window);
