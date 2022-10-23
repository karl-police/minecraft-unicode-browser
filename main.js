// included in .html

var __DEBUG = false; // For debugging

var _baseURL = ""

if (__DEBUG) {
    _baseURL = "https://karl-police.github.io/minecraft-unicode-browser/"
}

imagesheet_handler_Module.cropImage(_baseURL + "assets/textures/font/unicode_page_00.png", 16,16, 16, 0).then(function(result) {
    document.getElementById("testing_1").setAttribute("src", result)
})