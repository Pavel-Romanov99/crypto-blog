import {addCard, updateCoinPrice, printCoinChart}  from './index.js'

let coins = []
let fullnames = []

let url = document.URL.split('posts/')[1].toString();
let coin = url.split('-')[0];
let fullName = url.split('-')[1];

function getCoinData(coin){
    addCard(coin, fullName);
    updateCoinPrice(coin)
    printCoinChart(coin)
}

getCoinData(coin);