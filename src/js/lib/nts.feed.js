
    if (!NTS)
        var NTS = {};

    if (!NTS.Feed) {
        window.NTS.Feed = {
            render: function() {
                var notes = new NTS.Collections.Notes();
                var tmpl = Handlebars.compile($('#nts-tmpl-feed').html());
                var html;
                var view;
                notes.fetch({
                    success: function () {
                        // console.log(notes);
                        var html, view, notesView;

                        notesView = new NTS.Views.Notes({
                            collection: notes,
                            template: tmpl
                        });

                        notesView.render();

                        // html = tmpl(views);
                        // $('.nts-notes').append(notesView.el);   
                    }
                });
            }
        };
    }

