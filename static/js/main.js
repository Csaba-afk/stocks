let submitButton = document.getElementById("search")
let reloadButton = document.getElementById("reload")
let switcher = 0
reloadButton.addEventListener("click", function () {
    location.reload()
})

submitButton.addEventListener('click', () => {
    let form = document.getElementById("form")
    let symbol = form[0].value.toUpperCase()
    getRequest(
        'https://financialmodelingprep.com/api/v3/company/profile/' + symbol,
        drawOutput
    );

    function drawOutput(responseText) {

        console.log(JSON.parse(responseText));

        let resp = [JSON.parse(responseText).profile];

        let table = document.createElement("table");
        table.className += " table";

        let elements = document.querySelectorAll('.stock-name')[0];

        let head = document.createElement("thead");
        let body = document.createElement("tbody");

        let lineHeader = document.createElement("tr");

        for (let i = 0; i < resp.length; i++) {
            let financial = resp[i];
            let line = document.createElement("tr");


            for (let key in financial) {
                if (i === 0 && financial.hasOwnProperty(key)) {
                    let ele = document.createElement("th");
                    ele.textContent = key;
                    if (key === "volAvg" || key === "lastDiv" || key === "range" ||
                        key === "image" || key === "changes" || key === "changesPercentage" ||
                        key === "exchange" || key === "industry") {
                        ele.textContent = key;
                    } else if (key === "companyName") {
                        ele.textContent = "Name"
                        lineHeader.appendChild(ele)
                    } else if (key === "website") {
                        ele.textContent = "Website"
                        lineHeader.appendChild(ele)
                    } else if (key === "mktCap") {
                        ele.textContent = "Market Capitalization"
                        lineHeader.appendChild(ele)
                    } else if (key === "beta") {
                        ele.textContent = "Beta"
                        lineHeader.appendChild(ele)
                    } else if (key === "price") {
                        ele.textContent = "Price"
                        lineHeader.appendChild(ele)
                    } else if (key === "ceo") {
                        ele.textContent = "CEO"
                        lineHeader.appendChild(ele)
                    } else if (key === "sector") {
                        ele.textContent = "Sector"
                        lineHeader.appendChild(ele)
                    } else if (key === "description") {
                        ele.textContent = "Description"
                        lineHeader.appendChild(ele)
                    } else {
                        lineHeader.appendChild(ele);
                    }
                }
            }
            if (switcher === 0) {
                head.appendChild(lineHeader);
                table.appendChild(head);
            }

            for (let key2 in financial) {
                if (financial.hasOwnProperty(key2)) {
                    let eletd = document.createElement("td");
                    eletd.textContent = financial[key2];
                    if (key2 === "volAvg" || key2 === "lastDiv" || key2 === "range" ||
                        key2 === "image" || key2 === "changes" || key2 === "changesPercentage" ||
                        key2 === "exchange" || key2 === "industry") {
                        eletd.textContent = key2;
                    } else if (key2 === "website") {
                        eletd.addEventListener("click", function () {
                            window.open(financial[key2])
                        })
                        line.appendChild(eletd)
                    } else {
                        line.appendChild(eletd);
                    }

                }
            }
            body.appendChild(line)

            table.appendChild(body);
            switcher += 1;

        }

        document.body.appendChild(table);
    }

    function getRequest(url, success) {
        let req = false;
        try {
            req = new XMLHttpRequest();
        } catch (e) {
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    return false;
                }
            }
        }
        if (!req) return false;
        if (typeof success != 'function') success = function () {
        };
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    success(req.responseText)
                }
            }
        }
        req.open("GET", url, true);
        req.send(null);
        return req;
    }

    getRequest(
        'https://financialmodelingprep.com/api/v3/historical-price-full/' + symbol + '?from=2015-03-12&to=2019-03-12',
        apiGet
    );

    function apiGet(responseText) {

        console.log(JSON.parse(responseText));

        let resp = [JSON.parse(responseText).historical][0];
        let label = "";
        let labels = [];
        let data = [];
        for (let i = 0; i < resp.length; i++) {

            let financial = resp[i];
            labels.push(financial['label'])
            data.push(financial['close'])
        }

        console.log(labels)
        console.log(data)
    }
})
