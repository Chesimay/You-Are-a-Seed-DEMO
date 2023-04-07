import './style.css'
import {addH2OTesta, changeH2O} from "./resources"
import { awakening } from './changePhase'

let textEvents = ["","","","",""];

//do at the beginning
addDefListener("testa_INTRO", "seed coating", false);
addDefListener("testa_INTRO", "testa", true);
getNonNullElement("testa_INTRO").addEventListener("mouseleave", (ev)=>{
  awakening();
})

function addDefListener(tag : string, newText : string, leave : boolean) {
  const element = getNonNullElement(tag);

  if (leave) {
      element.addEventListener("mouseleave", (ev) => {
          element.innerHTML = newText;
      })
  }
  else {
      element.addEventListener("mouseenter", (ev) => {
          element.innerHTML = newText;
      })
  }
}

function addDefListenerToElm(element : Element, newText : string, leave : boolean) {
  if (leave) {
      element.addEventListener("mouseleave", (ev) => {
          element.innerHTML = newText;
      })
  }
  else {
      element.addEventListener("mouseenter", (ev) => {
          element.innerHTML = newText;
      })
  }
}

function addButtonListener(tag : string, resource : string, incrementBy : number) {
  getNonNullElement(tag).addEventListener("mouseup", (ev) => {
      switch (resource){
          case "H2O_testa":
              addH2OTesta();
              break;
          case "H2O":
              changeH2O(incrementBy);
              break;
      }
  })
}

function createDefinedSpan(text : string, definition : string) : HTMLSpanElement{
  const span = document.createElement("span");
  span.textContent = text;
  span.id = text;
  span.setAttribute("style", "color: goldenrod;");
  addDefListenerToElm(span, definition, false);
  addDefListenerToElm(span, text, true);
  return span;
}

function getNonNullElement(tag : string): HTMLElement{
  let element = document.getElementById(tag);

  if(element == null){
    throw "there's no element called "+tag;
  }
  return element;
}

function newTextEvent(event : string){
  let narrativeText = getNonNullElement("narrative");

  //clear the last <p> in the list
  let lastItem = textEvents[textEvents.length-1];
  if(!(lastItem === "")){//don't try to query the document for blank ids
    let currentChild = document.querySelector("#narrative #"+lastItem);
    currentChild?.remove();
    for(let i =0; i<2; i++){
      if(narrativeText.lastChild != null){
        narrativeText.removeChild(narrativeText.lastChild);} //remove the <br>s
    }
  } 
    
  //add new event with a unique string as the first child and shift everything else over 1
  for(let i = textEvents.length-1; i > 0; i--){
    textEvents[i] = textEvents[i-1];
  }
  textEvents[0] = event;
  if(event.indexOf(" ")>=0){
    textEvents[0] = event.replaceAll("<","").replaceAll(">","").replaceAll("|","");
    textEvents[0] = textEvents[0].substring(0, textEvents[0].indexOf(" "));
  }
  //add a chain of '2's until it doesn't match any entry
  let unique = false;
  while(!unique){
    unique = true;
    for(let i = 1; i<textEvents.length; i++){
      if(textEvents[0] === textEvents[i]){
        unique = false;
      }
    }
    if(!unique){
      textEvents[0]+=""+2; 
    }
  }

  //Add the new text to the top of the narrative text section
  let newP = document.createElement("paragraph");
  //id the event 
  newP.id = textEvents[0];

  if(!event.includes("<span>")){
    newP.textContent = event;
  }
  else{
    //an integer representing the starting index of the first <span> token
    let posOfSubscript = event.indexOf("<span>");
    while(posOfSubscript>=0){ //while there's another span token
        //make the label have some plain text
        newP.appendChild(document.createTextNode(event.substring(0,posOfSubscript)));

        //make the label have some text in a span
        let posOfEndSubscript = event.indexOf("</span>");
        if(posOfEndSubscript<0){
            throw new Error('event contained a starting "<span>" token, but no ending "</span>" token');
        }
        //grab the text until the | and use it as the word, then the rest of the text is the definition
        const word = event.substring(posOfSubscript+6,event.indexOf("|"));
        const def = event.substring(event.indexOf("|")+1,posOfEndSubscript);
        newP.appendChild(createDefinedSpan(word, def));

        //update chemTitle and posOfSubscript
        event = event.substring(posOfEndSubscript+7);
        posOfSubscript = event.indexOf("<span>");
    }
    //put whatever remains of chemTitle into chemLabel 
    newP.appendChild(document.createTextNode(event));
  } 
  narrativeText.insertBefore(document.createElement("br"), narrativeText.firstChild);
  narrativeText.insertBefore(document.createElement("br"), narrativeText.firstChild);
  narrativeText.insertBefore(newP, narrativeText.firstChild);

  //adjust all the <p>s' transparency appropriately
  let i = 0
  for(i = 0; i < textEvents.length; i++){
    let id = textEvents[i];
    if(id === ""){continue;} //don't try to query the document for blank ids

    let currentChild = document.querySelector("#narrative #"+id);
    if(currentChild == null){
      throw ("newTextEvent improperly added "+textEvents[i]+" to the document");
    }

    (currentChild as HTMLElement).style.opacity = ""+((textEvents.length - i)/textEvents.length);
  }
}
export{addDefListener,addDefListenerToElm, addButtonListener, createDefinedSpan, getNonNullElement, newTextEvent}