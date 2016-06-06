const Dispatcher = {
	updateUser({data}) {
		this.$store.merge({user: data});
	},

	updateGame({data}) {
		this.$store.merge({game: data});
	},

	updateActivityLogs({data: {timestamp, ...rest}}) {
		const time = (new Date(timestamp)).toString();
		this.$store.refine('activityLogs').push({time, ...rest});
	}
};

module.exports = Dispatcher;
