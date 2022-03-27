/* global bootstrap: false */
(function () {
    'use strict'
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })()
  
const url = document.URL;
const path = url.split('3000')[1];

const links = document.querySelectorAll('#sidebar a');

function setActiveTag(links){
  for(var i = 0; i < links.length; i++){
    if(links[i].getAttribute('href') === path){
      links[i].classList.add('active')
      const img = document.createElement('img')
      img.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gold_Bitcoin.svg/2048px-Gold_Bitcoin.svg.png');
      links[i].appendChild(img)
    }
  }
}

setActiveTag(links)