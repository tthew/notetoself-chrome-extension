(function() {
	$(document).ready(function() {
		var render = function() {
			$(".nts-notes").empty();
			var nts = JSON.parse(localStorage['nts']);
			var tmpl = _.template($('#nts-tmpl-feedItem').html(),{'feed':nts.reverse()});
			$('.nts-notes').append(tmpl);	
		};

		$('.delete').live("click",function() {
			var id = $(this).parent().data("nts-note-id");
			chrome.extension.sendMessage({"type":"delete", "noteId": id}, function(response) {
				console.log(response);
				if (response.type === "success") {
					render();	
				}
			});
		});

		render();
	});
	
})();