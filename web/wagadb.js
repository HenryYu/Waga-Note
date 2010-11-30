(function() {

    if (!window.WN) {
        window['WN'] = {}
    }

    function forTest() {
        return false;
    }

    window['WN']['forTest'] = forTest;


    var noteDB = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);

    function prepareDB() {
        noteDB.transaction(function(tx) {
            var isExisting = false;
            tx.executeSql(String.format('select * from sqlite_master where name = "notes"'), [], function(tx, results) {
                if (results.rows.length > 0) {
                    return;
                }

                createTable(tx);
            });
        });
    }

    function createTable(tx) {
        var notesTableSql = 'create table notes (id, url, bgcolor, opacity, xPos, yPos, width, height, text)';

        tx.executeSql(notesTableSql, [], function(tx) {
            console.log('create table notes successfully!');
        }, errorHandler);
    }

    var handleError = function(tx, error) {
        console.error(String.format("!!: {0}", error.message));
    }

    var dummySqlCallback = function(tx, result) {

    }

    function addNote() {
        var newNote = workspace.createNote();
        workspace.freshNotes.push(newNote);
    }

    window['WN']['addNote'] = addNote;

    var errorHandler = function(tx, error) {
        console.log("!!" + error.message);
    };

    function getLargestId(resultRows) {
        var largestId = 0;
        for (var i = 0; i < resultRows.length; i++) {
            var id = parseInt(resultRows.item(i).id.replace(/note/g, ''));
            if (id > largestId)
                largestId = id;
        }

        return largestId;
    }
    window['WN']['getLargestId'] = getLargestId;


    function pointNextPosIfFirstPosHasOneNote(resultRows) {
        for (var i = 0; i < resultRows.length; i++) {
            var note = resultRows.item(i);
            if (!('xPos' in note && 'yPos' in note)) continue;
            if (note.xPos == firstNotXpos && note.yPos == firstNotYpos) {
                workspace.notePos.nextPos();
                break;
            }
        }
    }
    window.WN.pointNextPosIfFirstPosHasOneNote = pointNextPosIfFirstPosHasOneNote;

    function loadAndCreateAllNotes(resultRows) {
        for (var i = 0; i < resultRows.length; i++) {
            var note = resultRows.item(i);
            console.log('Load note that id is: ' + note.id);
            var eNote = workspace.createNote(note);
            workspace.notes[eNote.id] = eNote;
        }
    }
    window.WN.loadAndCreateAllNotes = loadAndCreateAllNotes;


    function loadNotes() {
        noteDB.transaction(function (tx) {
            tx.executeSql('select * from notes where url = ?', [document.location], function(tx, results) {
                var resultRows = results.rows;

                loadAndCreateAllNotes(resultRows);
                pointNextPosIfFirstPosHasOneNote(resultRows);
                workspace.nextNoteNum = getLargestId(resultRows) + 1;
            }, errorHandler);
        });
    }

    function saveLocalDB() {
        noteDB.transaction(function (tx) {
            var notes = getUpdateNotes();
            for (var i = 0; i < notes.length; i++) {
                updateNote(notes[i], tx);
            }

            for (var i = 0; i < workspace.freshNotes.length; i++) {
                var tmpNote = workspace.freshNotes[i];
                saveNote(tmpNote, tx);
            }

            workspace.freshNotes = [];

            for (var i = 0; i < workspace.deleteNotes.length; i++) {
                deleteNote(workspace.deleteNotes[i], tx);
            }

            workspace.deleteNotes = [];

            alert('save successfully!');
        });
    }

    function getUpdateNotes() {
        var shouldUpdateNotes = [];
        for (var index = 0; index < workspace.nextNoteNum; index++) {
            var note = workspace.notes['note' + index];

            if (note == null)
                continue;

            if (workspace.freshNotes.contains(note))
                continue;

            if (workspace.deleteNotes.contains(note))
                continue;

            shouldUpdateNotes.push(note);
        }

        return shouldUpdateNotes;
    }

    function deleteNote(note, tx) {
        console.log('delete sql: ' + String.format('delete from notes where id = "{0}"', note.id));
        tx.executeSql('delete from notes where id = ?', [note.id], dummySqlCallback, errorHandler);
    }

    window.WN.deleteNote = deleteNote;

    function saveNote(tmpNote, tx) {
        var template = 'insert into notes (id, xPos, yPos, width, height, text, url, bgcolor, opacity) ' +
                       'values ("{0}", "{1}", "{2}", "{3}", "{4}", "{5}", "{6}", "{7}", "{8}")';
        var sql = String.format(template,
                tmpNote.id,
                'getPosition' in tmpNote && tmpNote.getPosition().x,
                'getPosition' in tmpNote && tmpNote.getPosition().y,
                'getSize' in tmpNote && tmpNote.getSize().x,
                'getSize' in tmpNote && tmpNote.getSize().y,
                tmpNote.text,
                document.location,
                'bgColor' in tmpNote && tmpNote.bgColor.toString(),
                tmpNote.opacity);
        console.log('insert sql: ' + sql)
        tx.executeSql(sql, [], dummySqlCallback, errorHandler);
    }

    window.WN.saveNote = saveNote;

    function updateNote(tmpNote, tx) {
        var template = 'update notes set xPos="{0}", yPos="{1}", width="{2}", height="{3}", text="{4}", ' +
                       'bgcolor="{5}", opacity="{6}" where id="{7}"'
        var sql = String.format(template,
                tmpNote.getPosition().x,
                tmpNote.getPosition().y,
                tmpNote.getSize().x,
                tmpNote.getSize().y,
                tmpNote.text,
                tmpNote.bgColor.toString(),
                tmpNote.opacity,
                tmpNote.id);
        console.log('update sql: ' + sql)
        tx.executeSql(sql, [], dummySqlCallback, errorHandler);
    }

    window.WN.updateNote = updateNote;

    function clearTable() {
        noteDB.transaction(function (tx) {
            tx.executeSql('delete from notes', [], function(tx, result) {
                console.log("clear all the data in table notes.");
                workspace.destroyAllNotes();
            }, errorHandler);
        });
    }

    window.WN.clearTable = clearTable;

    //    window['WN']['clearTable'] = clearTable;

    //    global call

        prepareDB();
        loadNotes();

        var menuDivWaga = document.createElement('div');
        menuDivWaga.id = 'menuDivWaga';
        document.body.insertBefore(menuDivWaga, document.body.firstChild);

        var menuUlWaga = document.createElement('ul');
        menuDivWaga.appendChild(menuUlWaga);

        var addLiWaga = document.createElement('li');
        var addButtonWaga = document.createElement('input');
        addButtonWaga.type = 'button';
        addButtonWaga.id = 'addNote';
        addButtonWaga.value = 'Add Note';
        addButtonWaga.onclick = addNote;
        addLiWaga.appendChild(addButtonWaga);

        var saveLiWaga = document.createElement('li');
        var saveButtonWaga = document.createElement('input');
        saveButtonWaga.type = 'button';
        saveButtonWaga.id = 'saveNote';
        saveButtonWaga.value = 'Save Notes';
        saveButtonWaga.onclick = saveLocalDB;
        saveLiWaga.appendChild(saveButtonWaga);

        var clearLiWaga = document.createElement('li');
        var clearButtonWaga = document.createElement('input');
        clearButtonWaga.type = 'button';
        clearButtonWaga.id = 'clearNotes';
        clearButtonWaga.value = 'Clear Notes';
        clearButtonWaga.onclick = clearTable;
        clearLiWaga.appendChild(clearButtonWaga);

        menuUlWaga.appendChild(addLiWaga);
        menuUlWaga.appendChild(saveLiWaga);
        menuUlWaga.appendChild(clearLiWaga);

})();    


//wagadb script end







