/* ==========================================
   Lupa™
   Retropixel™
========================================== */

var searchEngine = "https://www.google.com/search?q=";

window.onload = function () {

    updateDate();

    loadHistory();

    var form = document.getElementById("searchForm");

    if (form)
        form.onsubmit = search;

};

/* ===========================
   Pesquisa
=========================== */

function search() {

    var box =
        document.getElementById("query");

    var text =
        box.value.replace(/^\s+|\s+$/g, "");

    if (text === "") {

        alert("Digite algo para pesquisar.");

        box.focus();

        return false;

    }

    saveSearch(text);

    var url =
        searchEngine +
        encodeURIComponent(text);

    location.href = url;

    return false;

}

/* ===========================
   Dicas
=========================== */

function showTips() {

    location.href = "help.html";

}

/* ===========================
   Histórico
=========================== */

function saveSearch(text) {

    var list = [];

    try {

        list = JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];

    } catch (e) {

        list = [];

    }

    list.unshift(text);

    if (list.length > 10)
        list.length = 10;

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(list)
    );

    localStorage.setItem(
        "history",
        JSON.stringify(list)
    );

    loadHistory();

}

function loadHistory() {

    var recent =
        document.getElementById("recentSearches");

    var history =
        document.getElementById("history");

    var list = [];

    try {

        list = JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];

    } catch (e) {

        list = [];

    }

    if (list.length === 0) {

        if (recent)
            recent.innerHTML = "Nenhuma pesquisa.";

        if (history)
            history.innerHTML = "Nenhum registro.";

        return;

    }

    var html = "<ul>";

    for (var i = 0; i < list.length; i++) {

        html += "<li>" +
            escapeHtml(list[i]) +
            "</li>";

    }

    html += "</ul>";

    if (recent)
        recent.innerHTML = html;

    if (history)
        history.innerHTML = html;

}

/* ===========================
   Data
=========================== */

function updateDate() {

    var now = new Date();

    var d =
        ("0" + now.getDate()).slice(-2);

    var m =
        ("0" + (now.getMonth() + 1)).slice(-2);

    var y =
        now.getFullYear();

    var el =
        document.getElementById("lastUpdate");

    if (el)
        el.innerHTML = d + "/" + m + "/" + y;

}

/* ===========================
   Links rápidos
=========================== */

function openImages() {

    window.open("https://images.google.com/");

}

function openMaps() {

    window.open("https://maps.google.com/");

}

function openMail() {

    window.open("https://mail.google.com/");

}

function openTranslator() {

    window.open("https://translate.google.com/");

}

function openWeather() {

    window.open("https://weather.com/");

}

function openDictionary() {

    window.open("https://www.dicio.com.br/");

}

/* ===========================
   Rodapé
=========================== */

function showAbout() {

    location.href = "about.html";

}

function showHelp() {

    location.href = "help.html";

}

function showPrivacy() {

    location.href = "privacy.html";

}

function showTerms() {

    location.href = "tos.html";

}

/* ===========================
   Utilitários
=========================== */

function escapeHtml(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}

/* ===========================
   Favoritos (base)
=========================== */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    } catch (e) {

        return [];

    }

}

function saveFavorites(list) {

    localStorage.setItem(
        "favorites",
        JSON.stringify(list)
    );

}

function clearHistory() {

    localStorage.removeItem("history");
    localStorage.removeItem("recentSearches");

    loadHistory();

}

/* ===========================
   Versão
=========================== */

const LUPA_VERSION = "1.0 Alpha";