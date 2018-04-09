'use strict';

const unicodeList = ['\u200B', '\u200C', '\u200D', '\uFEFF'];

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    for (let mI in mutations){
        actionFunction(mutations[mI].target)
    }
});
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const checkForZeroWidthChars = function(text) {
    for (let zwChar in unicodeList){
        if (text.indexOf(unicodeList[zwChar]) != -1){
            return true;
        }
    }
    return false;
}

const removeZWCFromRootElement = function(element){
    replaceZWC(element, ['', '', '', '']);
    let childList = getElementChildren(element);
    if (childList.length == 0) {
        return
    }
    for (let ci in childList){
        removeZWCFromRootElement(childList[ci]);
    }
}
const markNodesWithZWC = function(element) {
    let text = textWithoutChildren(element);
    if (checkForZeroWidthChars(text)){
        markElement(element);
        return
    }
    let childList = getElementChildren(element);
    for (let ci in childList){
        markNodesWithZWC(childList[ci]);
    }
}
const emojiZWCFromRootElement = function(element){
    replaceZWC(element, [decodeURIComponent('%F0%9F%98%B3'), decodeURIComponent('%F0%9F%98%82'), decodeURIComponent('%F0%9F%A4%94'), decodeURIComponent('%F0%9F%98%B3')]);
    let childList = getElementChildren(element);
    if (childList.length == 0) {
        return
    }
    for (let ci in childList){
        emojiZWCFromRootElement(childList[ci]);
    }
}
const getElementChildren = function(element) {
    let tempChidrens = element.children;
    let childrens = [];
    for (let ci in tempChidrens){
        if (tempChidrens[ci].nodeType === 1){
            childrens.push(tempChidrens[ci])
        }
    }
    return childrens;
}
const textWithoutChildren = function( element ) {
    let child = element.firstChild;
    let texts = [];
  
    while (child) {
        if (child.nodeType == 3) {
            texts.push(child.data);
        }
        child = child.nextSibling;
    }
  
    return texts.join('');
}

const markElement = function(element){
    element.style['background-color'] = 'red';
    // console.log('marked', element)
}

const replaceZWC = function(element, replaceData) {
    let child = element.firstChild;
  
    while (child) {
        if (child.nodeType == 3) {
            let text = child.data;
            for (let i in unicodeList){
                text = text.replaceAll(unicodeList[i], replaceData[i]);
            }
            child.data = text;
        }
        child = child.nextSibling;
    }
}

const dummy = function(data) {
    // dummy implementation
}

let actionFunction = dummy;
let actions = {"highlight":markNodesWithZWC, "remove":removeZWCFromRootElement, "nothing":dummy, "emoji": emojiZWCFromRootElement }

observer.observe(document, {
    subtree: true,
    childList: true,
    characterData: true
});
chrome.runtime.onMessage.addListener( 
    function(request, sender, sendResponse) {
        localStorage.setItem("action", request.action);
        location.reload();
    }
);

const start = function() {
    let actionState = localStorage.getItem("action") || "remove";
    actionFunction = actions[actionState];
    actionFunction(document);
}
start();