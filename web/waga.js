Array.prototype.contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
};

Array.prototype.menus = function (otherArray) {
    menusArray = [];
    for (var i = 0; i < this.length; i++) {
        if (otherArray.contains(this[i]))
            continue;
        menusArray.push(this[i]);
    }

    return menusArray;
};

String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

//waga script end