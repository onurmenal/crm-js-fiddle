chrome.storage.sync.get([CONSTANTS.CODE_KEY], function (data) {
	if (data[CONSTANTS.CODE_KEY]) {
		window.location.href = CONSTANTS.SCRIPT_POINTER + data[CONSTANTS.CODE_KEY];
		data[CONSTANTS.CODE_KEY] = null;
		chrome.storage.sync.set(data);
	};
});
