
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "executeCode") {
        try {
            chrome.tabs.executeScript(null, { code: "var x = 10; x" },
                function (results) {
                    console.log(results);
                });
            
        } catch (e) {
            alert(e);
        }
    }
});


