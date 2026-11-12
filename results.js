/* ==========================================
   Lupa™ - Lupa Index
   Retropixel™
========================================== */

/* ===========================
   Inicialização
=========================== */

window.onload = function () {

    var query = getQueryParameter("q");

    var input = document.getElementById("query");
    var form = document.getElementById("resultsSearchForm");
    var provider = document.getElementById("searchProvider");

    if (input) {
        input.value = query;
    }

    if (form) {
        form.onsubmit = function () {

            var text = input.value.replace(/^\s+|\s+$/g, "");

            if (text === "") {
                alert("Digite algo para pesquisar.");
                input.focus();
                return false;
            }

            if (provider.value === "google") {

                window.location.href =
                    "https://www.google.com/search?q=" +
                    encodeURIComponent(text);

            } else {

                window.location.href =
                    "results.html?q=" +
                    encodeURIComponent(text);

            }

            return false;

        };
    }

    if (query === "") {

        showMessage("Digite um termo para pesquisar.");

        return;

    }

    searchIndex(query);

};

/* ===========================
   Parâmetros da URL
=========================== */

function getQueryParameter(name) {

    var params = window.location.search.substring(1).split("&");

    for (var i = 0; i < params.length; i++) {

        var parts = params[i].split("=");

        if (decodeURIComponent(parts[0].replace(/\+/g, " ")) === name) {

            return decodeURIComponent(
                (parts.slice(1).join("=")).replace(/\+/g, " ")
            );

        }

    }

    return "";

}

/* ===========================
   Normalização
=========================== */

function normalizeText(text) {

    text = String(text).toLowerCase();

    var accents = {
        "á": "a", "à": "a", "ã": "a", "â": "a",
        "é": "e", "ê": "e",
        "í": "i",
        "ó": "o", "ô": "o", "õ": "o",
        "ú": "u",
        "ç": "c"
    };

    return text.replace(/[áàãâéêíóôõúç]/g, function (letter) {
        return accents[letter];
    });

}

/* ===========================
   Carregar índice
=========================== */

function searchIndex(query) {

    var request = new XMLHttpRequest();

    request.open("GET", "index.json", true);

    request.onreadystatechange = function () {

        if (request.readyState !== 4) {
            return;
        }

        if (request.status !== 200) {

            showMessage("Não foi possível carregar o Índice Lupa.");

            return;

        }

        var index;

        try {

            index = JSON.parse(request.responseText);

        } catch (e) {

            showMessage("O arquivo index.json contém dados inválidos.");

            return;

        }

        if (!(index instanceof Array)) {

            showMessage("O Índice Lupa possui um formato inválido.");

            return;

        }

        findResults(query, index);

    };

    request.onerror = function () {

        showMessage("Erro ao conectar com o Índice Lupa.");

    };

    request.send(null);

}

/* ===========================
   Pesquisa e relevância
=========================== */

function findResults(query, index) {

    var terms = normalizeText(query).split(/\s+/);

    var matches = [];

    for (var i = 0; i < index.length; i++) {

        var item = index[i];

        var title = normalizeText(item.title || "");
        var description = normalizeText(item.description || "");

        var keywords = "";

        if (item.keywords instanceof Array) {
            keywords = normalizeText(item.keywords.join(" "));
        }

        var score = 0;

        for (var j = 0; j < terms.length; j++) {

            var term = terms[j];

            if (term.length === 0) {
                continue;
            }

            if (title.indexOf(term) !== -1) {
                score += 10;
            }

            if (description.indexOf(term) !== -1) {
                score += 4;
            }

            if (keywords.indexOf(term) !== -1) {
                score += 6;
            }

        }

        if (score > 0) {

            matches.push({
                item: item,
                score: score
            });

        }

    }

    matches.sort(function (a, b) {

        return b.score - a.score;

    });

    displayResults(matches);

}

/* ===========================
   Exibir resultados
=========================== */

function displayResults(matches) {

    var container = document.getElementById("results");
    var counter = document.getElementById("resultCount");

    if (counter) {

        counter.innerHTML =
            "Índice Lupa: " +
            matches.length +
            " resultados encontrados";

    }

    if (!container) {
        return;
    }

    if (matches.length === 0) {

        showMessage("Nenhum resultado encontrado. Tente outros termos.");

        return;

    }

    var html = "";

    for (var i = 0; i < matches.length; i++) {

        var item = matches[i].item;

        var title = escapeHTML(item.title || "Sem título");
        var description = escapeHTML(item.description || "");
        var url = escapeHTML(item.url || "");

        if (!/^https?:\/\//i.test(item.url || "")) {
            continue;
        }

        html += '<div class="search-result">';

        html += '<a class="result-link" href="' + url + '">';

        html += '<span class="result-title">' +
            title +
            '</span>';

        html += '<br>';

        html += '<span class="result-description">' +
            description +
            '</span>';

        html += '<br>';

        html += '<span class="result-url">' +
            url +
            '</span>';

        html += '</a>';

        html += '</div>';

    }

    if (html === "") {

        showMessage("Nenhum resultado válido encontrado.");

        return;

    }

    container.innerHTML = html;

}

/* ===========================
   Mensagens
=========================== */

function showMessage(message) {

    var container = document.getElementById("results");
    var counter = document.getElementById("resultCount");

    if (counter) {
        counter.innerHTML = "Índice Lupa";
    }

    if (container) {

        container.innerHTML =
            '<p class="no-results">' +
            escapeHTML(message) +
            '</p>';

    }

}

/* ===========================
   Segurança HTML
=========================== */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}
