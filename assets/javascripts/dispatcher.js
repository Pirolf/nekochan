const Dispatcher = {
	updateUser({data}) {
		this.$store.merge({user: data});
	},

	updateGame({data}) {
		this.$store.merge({game: data});
	},
  
  updateTechTree({data}) {
    this.$store.merge({techTree: data});
  },

	updateActivityLogs({data: {timestamp, ...rest}}) {
		const time = (new Date(timestamp)).toString();
		this.$store.refine('activityLogs').push({time, ...rest});
	},

	updateErrors({data}) {
		this.$store.merge({errors: data});
	},

	clearErrors() {
		this.$store.refine('errors').set({});
	}
};

module.exports = Dispatcher;
