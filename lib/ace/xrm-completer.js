ace.define("ace/xrm/completer",["require","exports","module"], function(require, exports, module) {
    "use strict";
    
    var xrmDefinitions = [
        "Xrm", 
        "Page", 
        "getAttribute", 
        "data", 
        "context"
    ];

    exports.completer = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, xrmDefinitions.map(function (word) {
                return { value: word, score: 1000, meta:"Xrm" };
            }));
        }
    };
});

(function () {
    ace.require(["ace/xrm/completer"], function () { });
})();