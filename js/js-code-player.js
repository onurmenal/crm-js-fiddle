var jsCodePlayer = {
	getFunctionContent: function (func) {
		var functionString = func.toString();
		return functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim().replace(/\t\t\t/g, '');;
	},
	
	getXrm: function () {
		return this.getFunctionContent(function () {
			var Xrm = $("iframe:visible")[0].contentWindow.Xrm;
		});
	},
	
	run: function (codeOrFunction) {
		var code = (codeOrFunction instanceof Function) ? this.getFunctionContent(codeOrFunction) : codeOrFunction;
		var data = {};
		data[CONSTANTS.CODE_KEY] = this.getXrm() + code;
		chrome.storage.sync.set(data);
		chrome.tabs.executeScript(null, {
			file: CONSTANTS.CONSTANTJS_PATH
		});
		chrome.tabs.executeScript(null, {
			file: CONSTANTS.CONTENTJS_PATH
		});
	}
}