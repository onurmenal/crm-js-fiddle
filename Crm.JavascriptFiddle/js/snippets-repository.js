
var snippetsRepository = {
    dbName: "crmJsFiddle",
    dbVersion: "1.0",
    dbDescription: "Crm Js Fiddle Snippets",
    dbSize: 10 * 1024 * 1024, // 10MB

    dbObject: function () {
        return openDatabase(this.dbName, this.dbVersion, this.dbDescription, this.dbSize);
    },

    executeQuery: function (queries) {
        
        if (Object.prototype.toString.call(queries) !== '[object Array]')
            queries = [queries];

        this.dbObject().transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS snippets (name, code)');
            queries.forEach(function (query) {
                tx.executeSql(query.text, query.params || [], query.callback);
            });
        });
    },

    fillSnippets: function (callback) {

        var query = {
            text: 'SELECT rowid,* FROM snippets',
            params: [],
            callback: function (tx, results) {
                callback(results.rows);
            }
        }

        this.executeQuery(query)
    },

    addSnippet: function (name, code, callback) {
        var query = {
            text: 'INSERT INTO snippets (name, code) VALUES (?, ?)',
            params: [name, code],
            callback: callback
        }
        this.executeQuery(query);
    },

    deleteSnippet: function (id, callback) {
        var query = {
            text: 'DELETE FROM snippets WHERE rowid = ?',
            params: [id],
            callback: callback
        }
        this.executeQuery(query);
    },

    updateSnippet: function (id, name, code, callback) {
        var query = {
            text: 'UPDATE snippets SET name=?, code=? WHERE rowid=?',
            params: [name, code, id],
            callback: callback
        }
        this.executeQuery(query);
    },

    getSnippet: function (id, callback) {
        var query = {
            text: 'SELECT rowid,* FROM snippets WHERE rowid=?',
            params: [id],
            callback: function (tx, results) {
                callback(results.rows[0]);
            }
        }

        this.executeQuery(query)
    }
}
