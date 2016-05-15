const Dispatcher = {
	updateUser({data}) {
		this.$store.merge({user: data});
	},

	updateGame({data}) {
		this.$store.merge({game: data});
	}
};

module.exports = Dispatcher;