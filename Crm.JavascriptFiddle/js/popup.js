(function ($) {
	var snippets = [];
	var aceEditor;
	var fadeTime = 350;
	var defaultNotificationTime = 1700;

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

	function loadSnippets() {
		$("#snippets option:not(:first)").remove();
		snippetsRepository.fillSnippets(function (result) {
		    snippets = result;
		    if (!snippets.length) {
		        defaultSnippets.forEach(function (snippet) {
		            snippetsRepository.addSnippet(snippet.name, jsCodePlayer.getFunctionContent(snippet.code));
		        });
		        loadSnippets();
		    }

		    for (index = 0; index < snippets.length; index++)
		    {
		        var snippet = snippets[index];

		        $("#snippets").append($('<option>', {
		            value: snippet.rowid,
		            text: snippet.name
		        }));
		        
		    }
		});
	}

	function showNotification(type, message, messageTime) {
		messageTime = messageTime || defaultNotificationTime;
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

		    snippetsRepository.updateSnippet(
                selectedSnippet,
                $("#snippet-name").val(),
                aceEditor.getValue(),
                function () {
                    loadSnippets();
                    showNotification("success", "Snippet has been updated.");
		        });
		} else {
			//add new snippet
			var snippetName = $("#snippet-name").val();

			if (snippetName && aceEditor.getValue()) {
			    snippetsRepository.addSnippet(
                    $("#snippet-name").val(),
                    aceEditor.getValue(),
                    function () {
                        loadSnippets();
                        showNotification("success", "Snippet has been added.");
                    })
			} else {
				showNotification("danger", "Please fill the Snippet name and content.");
			}
		}
	});

	$("#snippets").on("change", function () {
		try {
			if (this.value) {
			    snippetsRepository.getSnippet(this.value, function (result) {
			        aceEditor.setValue(result.code, 1);
			        $("#snippet-name").val(result.name);
			        var beautify = ace.require("ace/ext/beautify"); // get reference to extension
			        beautify.beautify(aceEditor.session);
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
			    snippetsRepository.deleteSnippet(selectedSnippet, function(){
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