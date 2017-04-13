window.logi = function () {
	if (this.console && this.console.log) {
		this.console.log(Array.prototype.slice.call(arguments));
	}
};
window.log  = function () {
	if (this.console && this.console.info) {
		this.console.info(JSON.stringify(Array.prototype.slice.call(arguments), null, '  '));
	}
};