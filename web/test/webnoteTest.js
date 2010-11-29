module("Test function addNote()", {
    setup: function() {
        ok(!get('note0'), 'Clear workspace should not contain an elment named "note0"');
        
    },
    teardown: function() {
        workspace.destroyAllNotes();
    }
});

test("Should add new node", function() {
    expect(5);
    WN.addNote();
    equal(workspace.numNotes, 1, 'The number of notes should be 1');
    equal(workspace.nextNoteNum, 1, 'The next note number should be 1');
    equal(workspace.freshNotes.length, 1, "The new note should add into freshNotes array")
    ok(get('note0'));
});

asyncTest('Should create notes when load all notes from database', function() {
    stop(500);
    jack(function() {
        var list = [
            {id: 'note0'},
            {id: 'note1'},
            {id: 'note5'},
            {id: 'note3'}
        ];

        var resultRows = jack.create("resultRows", ['item']);
        resultRows.length = 4;

        for (var i = 0; i < list.length; i++) {
            jack.expect("resultRows.item").exactly("1 time").withArguments(i).returnValue(list[i]);
        }

        equal(workspace.numNotes, 0, 'The number of notes should be 0');
        WN.loadAndCreateAllNotes(resultRows);
        equal(workspace.freshNotes.length, 0, 'There is no new note, all notes should be loaded from db');
        equal(workspace.deleteNotes.length, 0, 'There is no notes to be deleted');
    });
    start();
})

