(function() {
	$(document).ready(function() {

	var nts = JSON.parse(localStorage['nts']);
	console.log(nts);
	var tmpl = _.template($('#nts-tmpl-feedItem').html(),{'feed':nts.reverse()});
		$('.nts-notes').append(tmpl);	
	});
	
})();