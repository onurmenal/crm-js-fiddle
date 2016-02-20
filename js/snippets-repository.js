var snippetsRepository = {
	dbPromise: null,
	dbName: "crmJSFiddle",
	storageName: "snippets",
	storageIndexes: ["name", "code"],

	createDBPromise: function () {
		if (!this.dbPromise) {
			this.dbPromise = $.indexedDB(this.dbName, {
				"schema": {
					2: function (v) {
						var objectStore = v.createObjectStore(this.storageName, {
							"keyPath": "id",
							"autoIncrement": true
						});
						storageIndexes.forEach(function (index) {
							objectStore.createIndex(index);
						});
					}
				}
			});
		}
	},
	
	fillSnippets: function (snippets) {
		this.createDBPromise();
		return $.indexedDB(this.dbName).objectStore(this.storageName).each(function (snippet) {
			snippets.push(snippet);
		});

	},
	
	getSnippet: function (id) {
		this.createDBPromise();
		return $.indexedDB(this.dbName).objectStore(this.storageName).get(parseInt(id));
	},
	
	addSnippet: function (name, code) {
		this.createDBPromise();
		return $.indexedDB(this.dbName).objectStore(this.storageName, true).add({
			name: name,
			code: code
		});
	},
	
	addMultipleSnippet: function (arr) {
		if (arr) {
			if (arr.length > 1) {
				this.addSnippet(arr[0].name, arr[0].code).done(function () {
					arr.shift();
					this.addMultipleSnippet(arr);
				});
			} else {
				return this.addSnippet(arr[0].name, arr[0].code);
			}
		}
	},
	
	deleteSnippet: function (id) {
		this.createDBPromise();
		return $.indexedDB(this.dbName).objectStore(this.storageName).delete(parseInt(id));
	},
	
	updateSnippet: function (id, name, code) {
		this.createDBPromise();
		return $.indexedDB(this.dbName).objectStore(this.storageName).put({
			name: name,
			code: code
		}, parseInt(id));
	}
};     