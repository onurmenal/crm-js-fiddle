(function ($) {
	var snippets = [];
	var aceEditor;

	ace.require("ace/ext/language_tools");
	aceEditor = ace.edit("editor");
	aceEditor.session.setMode("ace/mode/javascript");
	aceEditor.setTheme("ace/theme/twilight");
	aceEditor.setShowPrintMargin(false);
	aceEditor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: false
	});
	aceEditor.focus();
	getLastOperation();
	loadSnippets();

	function getLastOperation() {
		chrome.storage.sync.get(CONSTANTS.HISTORY_KEY, function (data) {
			if (data) {
				aceEditor.setValue(data[CONSTANTS.HISTORY_KEY], 1);
			}
		});
	}

	function fillSelectBox() {
		snippets.forEach(function (snippet) {
			$("#snippets").append($('<option>', {
				value: snippet.key,
				text: snippet.value.name
			}));
		});
	}

	function loadSnippets() {
		$("#snippets option:not(:first)").remove();
		snippets = [];
		snippetsRepository.fillSnippets(snippets).done(function () {
			fillSelectBox();
		}).always(function () {
			if (!snippets.length) {
				defaultSnippets.forEach(function (snippet) {
					snippetsRepository.addSnippet(snippet.name, jsCodePlayer.getFunctionContent(snippet.code)).then(function () {
						fillSelectBox();
					});
				});
			}
		});

	}

	function showNotification(type, message, messageTime) {
		var fadeTime = 350;
		messageTime = messageTime || 1700;
		var $notification = $("#notification");
		$notification.removeClass();
		$notification.addClass(type).text(message).fadeIn(fadeTime);
		setTimeout(function () {
			$notification.fadeOut(fadeTime);
		}, messageTime);
	}

	aceEditor.on("input", function () {
		var data = {};
		data[CONSTANTS.HISTORY_KEY] = aceEditor.getValue();
		chrome.storage.sync.set(data);
	});

	$(document).bind('keydown', function (event) {
		if (event.altKey) {

			switch (event.which) {
			case 82: //R
				$("#run-code").trigger("click");
				break;
			case 49: //1
				$("#snippets").focus().select();
				break;
			}
		}
	});

	$("#run-code").on("click", function () {
		try {
			jsCodePlayer.run(aceEditor.getValue());
			showNotification("success", "Code executed the current tab.");
		} catch (e) {
			showNotification("danger", "An error occurred!");
			console.error(e);
		}
	});

	$("#save-snippet").on("click", function () {
		var selectedSnippet = $("#snippets").val();
		if (selectedSnippet) {
			//Update snippet
			snippetsRepository
				.updateSnippet(selectedSnippet, $("#snippet-name").val(), aceEditor.getValue())
				.done(function () {
					loadSnippets();
					showNotification("success", "Snippet has been updated.");
				});
		} else {
			//add new snippet
			var snippetName = $("#snippet-name").val();

			if (snippetName && aceEditor.getValue()) {
				snippetsRepository.addSnippet($("#snippet-name").val(), aceEditor.getValue()).then(function () {
					loadSnippets();
					showNotification("success", "Snippet has been added.");
				});
			} else {
				showNotification("danger", "Please fill the Snippet name and content.");
			}
		}
	});

	$("#snippets").on("change", function () {
		try {
			if (this.value) {
				snippetsRepository.getSnippet(this.value).done(function (data) {
					aceEditor.setValue(data.code, 1);
					$("#snippet-name").val(data.name);
				});
				$("#delete").show();
			} else {
				$("#delete").hide();
				$("#snippet-name").val("");
			}
		} catch (e) {
			showNotification("danger", "An error occurred!");
			console.error(e);
		}
	});

	$("#delete").on("click", function () {
		try {
			var selectedSnippet = $("#snippets").val();
			if (selectedSnippet) {
				snippetsRepository.deleteSnippet(selectedSnippet).then(function () {
					$("#snippet-name").val("");
					aceEditor.setValue("");
					loadSnippets();
					showNotification("success", "Selected snippet has been deleted.");
				});
			}
		} catch (e) {
			showNotification("danger", "An error occurred!");
			console.error(e);
		}
	});
})(jQuery);