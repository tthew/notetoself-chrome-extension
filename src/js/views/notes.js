NTS.Views.Notes = Backbone.View.extend({
	el: '.nts-notes',
	initialize: function() {
		var self = this;
		// _.extend(this, this.options);
		this.views = [];
		var view;
		this.collection.each(function(note) {
	        view = new NTS.Views.Note({
	            model: note,
	            template: Handlebars.compile($('#nts-tmpl-feedItem-context-page').html())
	     	});
	     	self.$el.append(view.render().el);
	    });
	},
});