'use strict';

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    for (let mI in mutations){
        markNodesWithZWC(mutations[mI].target)
    }
});


const checkForZeroWidthChars = function(text) {
    let unicodeList = ['\u200B', '\u200C', '\u200D', '\uFEFF']
    for (let zwChar in unicodeList){
        if (text.indexOf(zwChar) != -1){
            console.log(String(zwChar));
            return true;
        }
    }
    return false;
}

const markNodesWithZWC = function(element) {
    let text = textWithoutChildren(element);
    if (checkForZeroWidthChars(text)){
        markElement(element);
    }
    let childList = getElementChildren(element);
    for (let ci in childList){
        markNodesWithZWC(childList[ci]);
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
  
    return texts.join("");
}

const markElement = function(element){
    element.style["background-color"] = "red";
    // console.log("marked", element)
}

// start scanning the whole document.
markNodesWithZWC(document)

// listen for new changes.
observer.observe(document, {
    subtree: true,
    childList: true,
    characterData: true
});