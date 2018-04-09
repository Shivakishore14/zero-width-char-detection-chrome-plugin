'use strict';

console.log("12")

const setAction = function(msg) {
  localStorage.setItem("action", msg)
  console.log(msg)
  sendMsg({action:msg});
}

const init = function() {
  let radios = document.getElementsByClassName('radio-selection');
  for(let radio in radios) {
    if (typeof(radios[radio]) !== "object"){
      console.log("skipping", radios[radio])
      continue;
    }
    radios[radio].onclick = function() {
        setAction(this.value);
    }
  }
  let action = localStorage.getItem('action') || 'remove';
  for(let radio in radios) {
    if (typeof(radios[radio]) !== "object"){
      continue;
    }
    if (radios[radio].value === action){
      radios[radio].checked = true;
    }
  }
  sendMsg({action:action});
  console.log("action", action);
}
const sendMsg = function(data){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
      console.log(response);
    });
  });
}
init();