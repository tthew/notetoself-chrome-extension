var notes = new NTS.Collections.Notes();
notes.fetch({
	success: function () {
		console.log(notes);
		NTS.init(notes);
		NTS.configureBadge();
		NTS.updateBadge();		
	}
});
