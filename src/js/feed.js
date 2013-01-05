(function() {
	$(document).ready(function() {
		Handlebars.registerHelper('if_eq', function(context, options) {
			if (context == options.hash.compare)
				return options.fn(this);
			return options.inverse(this);
		});

		chrome.extension.onMessage.addListener(function(msg) {
			if (msg.type === "render") {
				NTS.Feed.render();
			}
		});

		$('.delete').live("click",function() {
			var el = this;
			var id = $(this).parent().data("nts-note-id");
			chrome.extension.sendMessage({"type":"delete", "noteId": id}, function(response) {
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