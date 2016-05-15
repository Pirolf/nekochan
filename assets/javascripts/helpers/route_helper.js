const url = require('url');
function getRoute() {
	const {pathname} = url.parse(window.location.href);
	const compact = require('lodash.compact');
	const pathParams = compact(pathname.split('/'));
	const routeName = pathParams.length > 0 ? pathParams[0] : '';
	return {routeName, pathParams};
}

module.exports = getRoute;