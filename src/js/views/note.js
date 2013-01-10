NTS.Views.Note = Backbone.View.extend({

	template: function() { return Handlebars.compile($('#nts-tmpl-feedItem-context-page').html()); },
	events: {
		'click': 'deleteNote'
	},

	initialize: function() {
		if (this.options.template) {
			this.template = this.options.template;
		}
	},

	deleteNote: function () {
		var self = this;
		this.model.destroy({
			success: function (model, response) {
				self.$el.fadeOut('slow', function() {
					$(this).remove();
				});
			}
		});
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});