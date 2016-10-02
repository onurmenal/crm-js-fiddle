//TODO: geçerli window content'ine Xrm libraryi at ve  web resoruce'ları kullanabil.
var jsCodePlayer = {
	getFunctionContent: function (func) {
		var functionString = func.toString();
		return functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}")).trim().replace(/\t\t\t/g, '');;
	},

	injectCode: function (code) {
		var _$m =  this.getFunctionContent(function () {
			var _$c = Array.from(document.querySelectorAll('iframe')).filter(function (d) {
				return d.style.visibility !== 'hidden'
			})[0].contentWindow;
			Xrm = _$c.Xrm;
			_$c._$f = function(){_$uc};
			_$c._$f();
		});
		return _$m.replace("_$uc",code);
	},
	run: function (code) {
		var data = {};
		data[CONSTANTS.CODE_KEY] = this.injectCode(code);
		console.log(data[CONSTANTS.CODE_KEY]);
		chrome.storage.sync.set(data);
		chrome.tabs.executeScript(null, {
			file: CONSTANTS.CONSTANTJS_PATH
		});
		chrome.tabs.executeScript(null, {
			file: CONSTANTS.CONTENTJS_PATH
		});
	}
}