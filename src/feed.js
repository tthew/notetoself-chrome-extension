(function() {
	$(document).ready(function() {
		Handlebars.registerHelper('if_eq', function(context, options) {
			if (context == options.hash.compare)
				return options.fn(this);
			return options.inverse(this);
		});

		var render = function() {
			var nts = JSON.parse(localStorage['nts']);
			var tmpl = Handlebars.compile($('#nts-tmpl-feedItem').html());
			var html = tmpl({'feed':nts.reverse()});

			$(".nts-notes").empty();
			$('.nts-notes').append(html);	
		};

		chrome.extension.onMessage.addListener(function(msg) {
			if (msg.type === "render") {
				render();
			}
		});

		$('.delete').live("click",function() {
			var id = $(this).parent().data("nts-note-id");
			chrome.extension.sendMessage({"type":"delete", "noteId": id}, function(response) {
				if (response.type === "success") {
					render();	
				}
			});
		});

		render();
	});
	
})();