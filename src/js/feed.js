$(document).ready(function() {

    chrome.extension.onMessage.addListener(function(msg) {
        if (msg.type === "render") {
            NTS.Feed.render();
        }
    });

    Handlebars.registerHelper('if_eq', function(context, options) {
        if (context == options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });

    // Handlebars.registerHelper('feed', function(items) {
    //     console.log(items);

    //     var template, html, view;

    //   for(var i=0, l=items.length; i<l; i++) {
    //     template = null;

    //     view = new NTS.Views.Note({
    //         model: new NTS.
    //     });




    //     template = Handlebars.compile($('#nts-tmpl-feedItem-context-page').html());

    //     html += template(items[i]);

    //     // console.log(html);
    //   }

    //   return new Handlebars.SafeString(html);
    // });

    // $('.delete').live("click",function() {
    //     var el = this;
    //     var id = $(this).parent().data("nts-note-id");
    //     console.log(id);
    //     // chrome.extension.sendMessage({"type":"delete", "noteId": id}, function(response) {
    //     //     if (response.type === "success") {
    //     //         $(el).parent().fadeOut("slow", function() {
    //     //             $(this).remove();
    //     //         })
    //     //     }
    //     // });
    // });
    NTS.Feed.render();
});