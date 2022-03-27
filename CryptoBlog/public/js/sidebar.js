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

const links = document.getElementsByTagName('a');

function setActiveTag(links){
  console.log("working")
  for(var i = 0; i < links.length; i++){
    if(links[i].getAttribute('href') === path){
      links[i].classList.add('active')
      console.log(links[i].innerHTML);
    }
  }
}

setActiveTag(links)