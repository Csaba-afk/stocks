import "./chart.js"

let submitButton = document.getElementById("search")
let reloadButton = document.getElementById("reload")
let switcher = 0
let counter = 0
let mainData = {"labels": [], "datasets": []}
reloadButton.addEventListener("click", function () {
    location.reload()
})

document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }

});

submitButton.addEventListener('click', () => {
    const symbol = document.getElementById("input").value.toUpperCase()
    mainData.datasets[counter] = {"label": symbol}
    getRequest(
        'https://financialmodelingprep.com/api/v3/company/profile/' + symbol,
        drawOutput
    );

    function drawOutput(responseText) {

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
                    if (key2 === "volAvg" || key2 === "lastDiv" || key2 === "range" ||
                        key2 === "image" || key2 === "changes" || key2 === "changesPercentage" ||
                        key2 === "exchange" || key2 === "industry") {
                        eletd.textContent = key2;
                    } else if (key2 === "website") {
                        let link = document.createElement("a")
                        link.href = financial[key2]
                        link.innerText = financial[key2]
                        link.target = "_blank"
                        link.rel = "noopener noreferrer"
                        eletd.appendChild(link)
                        line.appendChild(eletd)
                    } else {
                        eletd.textContent = financial[key2];
                        line.appendChild(eletd);
                    }

                }
            }
            body.appendChild(line)

            table.appendChild(body);
            switcher += 1;


        }

        document.getElementById("card-body").appendChild(table);
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
        'https://financialmodelingprep.com/api/v3/historical-price-full/' + symbol + '?from=2015-03-12&to=2020-05-13',
        apiGet
    );
    let label = symbol;
    let labels = [];
    let data = [];

    function apiGet(responseText) {
        let resp = [JSON.parse(responseText).historical][0];
        for (let i = 0; i < resp.length; i++) {

            let financial = resp[i];
            labels.push(financial['label'])
            data.push(parseFloat(financial['close']))
        }
        mainData.labels = labels
        mainData.datasets[counter].data = data
        let red = Math.round(Math.random() * (255));
        let green = Math.round(Math.random() * (255));
        let blue = Math.round(Math.random() * (255));
        let backgroundColor = "rgba(" + String(red) + "," + String(green) + "," + String(blue) + ", 0.2)"
        let borderColor = "rgba(" + String(red) + "," + String(green) + "," + String(blue) + ", 1)"
        mainData.datasets[counter].backgroundColor = backgroundColor
        mainData.datasets[counter].borderColor = borderColor
        counter += 1
        drawChart(mainData)
    }


})

function drawChart(data) {
    document.getElementById("myChart").remove()
    let newCanvas = document.createElement("canvas")
    newCanvas.id = "myChart"
    newCanvas.height = 400
    newCanvas.width = 1200
    document.getElementById("chartContainer").appendChild(newCanvas)
    let ctx = document.getElementById('myChart').getContext('2d');
    let myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0
        }
    })
    myLineChart.update();
}

let modal = document.getElementById("myModal");
let btn = document.getElementById("info");
let span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}