module("Without db operation:");
test('Should return largest id in method getLargetId()', function() {
    jack(function() {
        var list = [
            {id: 'note0'},
            {id: 'note1'},
            {id: 'note5'},
            {id: 'note1'}
        ];

        var resultRows = jack.create("resultRows", ['item']);
        resultRows.length = 4;

        for (var i = 0; i < list.length; i++) {
            jack.expect("resultRows.item").exactly("1 time").withArguments(i).returnValue(list[i]);
        }

        equal(WN.getLargestId(resultRows), 5, "test method getLargestId()");
    });
});

test('Should point next Position if there is a note that has been in the initial position', function() {
    jack(function() {
        var resultRows = jack.create('resultRows', ['item']);
        resultRows.length = 1;

        var note = jack.create('note', ['getPosition']);
        note.xPos = 170;
        note.yPos = 40;
        note.id = 'note0';

        jack.expect("resultRows.item").exactly("1 time").withArguments(0).returnValue(note);

        equal(workspace.notePos.x, 170, 'First note should be in initial position{170, 40} if no verification for next position');
        equal(workspace.notePos.y, 40, 'First note should be in initial position{170, 40} if no verification for next position');
        WN.pointNextPosIfFirstPosHasOneNote(resultRows);
        equal(workspace.notePos.x, 190, 'First note should be in next position if the position has a note');
        equal(workspace.notePos.y, 60, 'First note should be in next position if the position has a note');
    })
});

module("Test functions operating note into db", {
    setup: function() {
        this.noteDB = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
        ok(this.noteDB, 'DB should be created');
    },

    teardown: function() {
        WN.clearTable();
    }
});

asyncTest('should save note', function() {

    var noteDB = this.noteDB;
    jack(function() {
        stop(500);
        noteDB.transaction(function(tx) {
            var tmpNote = jack.create('tmpNote', ['getPosition', 'getSize']);
            var bgColor = jack.create('bgColor', ['toString']);
            tmpNote.id = 'note0';
            tmpNote.bgColor = bgColor;
            tmpNote.opacity = 0.8;
            jack.expect('tmpNote.getPosition').exactly('2 times').returnValue({x:1, y:2});
            jack.expect('tmpNote.getSize').exactly('2 times').returnValue({x:3, y:4});
            jack.expect('bgColor.toString').returnValue('#000000');

            WN.saveNote(tmpNote, tx);

            tx.executeSql('select * from notes', [], function(tx, results) {
                result1 = results;
                var note = results.rows.item(0);
                equal(note.id, 'note0', 'Note id should be note0');
                equal(note.xPos, '1', "Note's top should be 1");
                equal(note.yPos, '2', "Note's left should be 2");
                equal(note.width, '3', "Note's width should be 3");
                equal(note.height, '4', "Note's height should be 4");
                equal(note.bgcolor, '#000000', "Note's color should be there");
                equal(note.opacity, '0.8', "Note's opacity should be 0.8");
            });
        });
    });

    start();
});


asyncTest('Should update note', function() {
    var noteDB = this.noteDB;
    jack(function() {
        stop(500);
        noteDB.transaction(function(tx) {
            var tmpNote = jack.create('tmpNote', ['getPosition', 'getSize']);
            var bgColor = jack.create('bgColor', ['toString']);
            tmpNote.id = 'note0';
            tmpNote.bgColor = bgColor;
            tmpNote.opacity = 0.8;
            tmpNote.text = 'testText';
            jack.expect('tmpNote.getPosition').exactly('2 times').returnValue({x:1, y:2});
            jack.expect('tmpNote.getSize').exactly('2 times').returnValue({x:3, y:4});
            jack.expect('bgColor.toString').returnValue('#000000');

            WN.saveNote(tmpNote, tx);

            tmpNote.opacity = 0.6;
            tmpNote.text = "new testText";
            WN.updateNote(tmpNote, tx);

            tx.executeSql('select * from notes', [], function(tx, results) {
                result1 = results;
                var note = results.rows.item(0);
                equal(note.id, 'note0', 'Note id should be note0');
                equal(note.xPos, '1', "Note's top should be 1");
                equal(note.yPos, '2', "Note's left should be 2");
                equal(note.width, '3', "Note's width should be 3");
                equal(note.height, '4', "Note's height should be 4");
                equal(note.bgcolor, '#000000', "Note's color should be there");
                equal(note.opacity, '0.6', "Note's opacity should be 0.6");
                equal(note.text, 'new testText', "Note's text should be [new testText]");
            });
        });
    });

    start();
});

asyncTest('Should delete specific note', function() {
    var noteDB = this.noteDB;
    jack(function() {
        stop(500);
        noteDB.transaction(function(tx) {
            var tmpNote0 = {id: "note0"};
            var tmpNote1 = {id: "note1"};
            var tmpNote2 = {id: "note2"};

            WN.saveNote(tmpNote0, tx);
            WN.saveNote(tmpNote1, tx);
            WN.saveNote(tmpNote2, tx);

            tx.executeSql("select * from notes", [], function(tx, results) {
                equal(results.rows.length, 3, "Three notes should be saved in db");
            });

            WN.deleteNote(tmpNote1, tx);
            tx.executeSql("select * from notes", [], function(tx, results) {
                equal(results.rows.length, 2, "Two notes should still exist in db");
                equal(results.rows.item(0).id, tmpNote0.id, "First note should be note0");
                equal(results.rows.item(2).id, tmpNote2.id, "Second note should be note2");
            });
        });
    });

    start();
});