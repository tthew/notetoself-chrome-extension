(function() {
  $(document).ready(function() {

    chrome.runtime.onMessage.addListener(function(msg) {
      if (msg.type === "render") {
        NTS.Feed.render();
      }
      return true;
    });

    chrome.storage.onChanged.addListener(function () {
      NTS.Feed.render();
      return true;
    });

    Handlebars.registerHelper('if_eq', function(context, options) {
      if (context == options.hash.compare)
        return options.fn(this);
      return options.inverse(this);
    });

    $(document).on('click', '.delete', function () {
      var el = this;
      var id = $(this).parent().data("nts-note-id");
      chrome.runtime.sendMessage({"type":"delete", "noteId": id}, function(response) {
        if (response.type === "success") {
          $(el).parent().fadeOut("slow", function() {
            $(this).remove();
          })
        }
      });
    });

    NTS.Feed.render();
  });

})();
