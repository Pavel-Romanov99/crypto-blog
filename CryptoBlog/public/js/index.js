let ids = [1, 2, 3]
let coins = ["BTC", "ATOM", "ETH"]
let price = ["price1", "price2", "price3"]
let fullnames = ['bitcoin', 'cosmos', 'ethereum']

//create a card for a new coin
addCard = function (coin, id1, price1, fullname) {
    const cards = document.getElementsByClassName('cards')[0]

    const coinContainer = document.createElement('coin');
    coinContainer.classList.add('coin-class')

    cards.appendChild(coinContainer)

    const card = document.createElement('card');
    card.classList.add('asset-info')

    coinContainer.appendChild(card)

    const div1 = document.createElement('div')
    div1.classList.add('title')

    card.appendChild(div1)

    const img = document.createElement('img')
    img.src = `https://cryptologos.cc/logos/${fullname}-${coin.toLowerCase()}-logo.svg?v=013`
    console.log(img.src)

    const header = document.createElement('h1')
    header.innerHTML = coin;

    const div2 = document.createElement('div')
    div2.classList.add('details')

    const header2 = document.createElement('h2')
    header2.classList.add('asset-price')
    header2.id = price1

    div2.appendChild(header2)

    div1.appendChild(img)
    div1.appendChild(header)
    card.appendChild(div2)

    const canvas = document.createElement('canvas')
    canvas.id = id1

    coinContainer.appendChild(canvas)

    ids.push(id1)
    coins.push(coin)
    price.push(price1)
    fullnames.push(fullname)
}



///  Calling API and modeling data for each chart ///
const coinData = async (coin) => {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histominute?fsym=${coin}&tsym=USD&limit=119&api_key=0646cc7b8a4d4b54926c74e0b20253b57fd4ee406df79b3d57d5439874960146`);
    const json = await response.json();
    const data = json.Data.Data
    const times = data.map(obj => obj.time)
    const prices = data.map(obj => obj.high)
    return {
        times,
        prices
    }
}

/// Error handling ///
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

async function printCoinChart(coin, id) {
    let { times, prices } = await coinData(coin)

    let chart = document.getElementById(id).getContext('2d');

    let gradient = chart.createLinearGradient(0, 0, 0, 400);

    gradient.addColorStop(0, 'rgba(78,56,216,.5)');
    gradient.addColorStop(.425, 'rgba(118,106,192,0)');

    Chart.defaults.global.defaultFontFamily = 'Red Hat Text';
    Chart.defaults.global.defaultFontSize = 12;

    createChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: '$',
                data: prices,
                backgroundColor: gradient,
                borderColor: 'rgba(118,106,192,1)',
                borderJoinStyle: 'round',
                borderCapStyle: 'round',
                borderWidth: 3,
                pointRadius: 0,
                pointHitRadius: 10,
                lineTension: .2,
            }]
        },

        options: {
            title: {
                display: false,
                text: 'Heckin Chart!',
                fontSize: 35
            },

            legend: {
                display: false
            },

            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },

            scales: {
                xAxes: [{
                    display: false,
                    gridLines: {}
                }],
                yAxes: [{
                    display: false,
                    gridLines: {}
                }]
            },

            tooltips: {
                callbacks: {
                    //This removes the tooltip title
                    title: function () { }
                },
                //this removes legend color
                displayColors: false,
                yPadding: 10,
                xPadding: 10,
                position: 'nearest',
                caretSize: 10,
                backgroundColor: 'rgba(255,255,255,.9)',
                bodyFontSize: 15,
                bodyFontColor: '#303030'
            }
        }
    });
}



addCard('ADA', '4', 'price4', 'cardano')
addCard('DOGE', '5', 'price5', 'dogecoin')
addCard('XRP', '6', 'price6', 'xrp')

//update prices
async function updateCoinPrice(coin, price) {
    let { times, prices } = await coinData(coin)
    let currentPrice = prices[prices.length - 1].toFixed(2);

    document.getElementById(price).innerHTML = "$" + currentPrice;
}

for (let i = 0; i < ids.length; i++) {
    updateCoinPrice(coins[i], price[i])
    printCoinChart(coins[i], ids[i])
}



