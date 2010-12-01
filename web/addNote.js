(function() {

    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (!is_chrome) {
        alert('Beta version, please use chrome browser!');
        return;
    }

    var menuDiv = document.getElementById('toolBarDivWaga');
    if (menuDiv != null) {
        document.body.removeChild(menuDiv);
        workspace.destroyAllNotes();
        return;
    }

//    var baseUrl = "http://localhost:8080"
    var baseUrl = "http://10.18.8.175:8080/app/Waga-Note/web"
//    var baseUrl = "http://waganote.appspot.com"
    //    var baseUrl = "http://localhost:8888/waganote"

    var cssWaga = document.createElement('link');
    cssWaga.setAttribute("href", baseUrl + "/style.css");
    cssWaga.setAttribute("rel", "stylesheet")
    cssWaga.setAttribute("type", "text/css")
    document.body.appendChild(cssWaga);

    var hugeJSWaga = document.createElement('script');
    hugeJSWaga.setAttribute('src', baseUrl + '/huge.js')
    document.body.appendChild(hugeJSWaga);

    return;

    var objectsJSWaga = document.createElement('script');
    objectsJSWaga.setAttribute('src', baseUrl + '/objects.js')
    document.body.appendChild(objectsJSWaga);

    var stringsJSWaga = document.createElement('script');
    stringsJSWaga.setAttribute('src', baseUrl + '/strings.js');
    document.body.appendChild(stringsJSWaga);

    var urchinJSWaga = document.createElement('script');
    urchinJSWaga.setAttribute('src', baseUrl + '/objects.js');
    document.body.appendChild(urchinJSWaga);

    var wagaJSWaga = document.createElement('script');
    wagaJSWaga.setAttribute("src", baseUrl + '/waga.js');
    document.body.appendChild(wagaJSWaga);

    var wagaNoteJSWaga = document.createElement('script');
    wagaNoteJSWaga.setAttribute("src", baseUrl + '/webnote-full.js');
    document.body.appendChild(wagaNoteJSWaga);

    var wagaDBJSWaga = document.createElement('script');
    wagaDBJSWaga.setAttribute("src", baseUrl + '/wagadb.js');
    document.body.appendChild(wagaDBJSWaga);

    var doThatJSWaga = document.createElement('script');
    doThatJSWaga.setAttribute("src", baseUrl + '/doThat.js');
    document.body.appendChild(doThatJSWaga);
})();


                                                                            