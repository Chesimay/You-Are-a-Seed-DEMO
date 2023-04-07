/*Resources (all in “arbitrary units”):
Water (H2O)
Carbon dioxide (CO2)
Nitrogen (ammonia, NH3, is an available form of nitrogen)
LOW-ENERGY? NADP+
HIGH-ENERGY? NADPH
ATP <-(+/- Water)-> ADP
NAD+ <-> NADH
FAD <-> FADH2
Calvin Cycle components
Glucose
Your energy reserves are growing low. (show “energy” (ATP, C10H16N5O13P3) becoming “spent energy” (ADP, C10H15N5O10P2))
break down starch into maltose or glucose
Cellularly respire in cotyledon to gain ATP
1 C6H12O6, 6O2 -> 6CO2, 6H2O, 34 ATP
*/
import {getNonNullElement, createDefinedSpan, newTextEvent} from "./main";

let H2O = 0; //water
//let CO2 = 0; //carbon dioxide - CO2
//let O2 = 0; //oxygen gas - enters passively via diffusion in seed forme?
let ATP = 34; //adenosine triphosphate - ATP
let ADP = 0; //adenosine diphosphate - ADP - C10H15N5O10P2 - made using 5 ammonia, 10 CO2, and phosphorous
let starch = 100; // starch - (C6H10O5)n
let glucose = 0; //glucose - C6H12O6
//let NH3 = 0; //ammonia with nitrogen in it

let amylaseRate = 0;
let starchToGlucose = false;

function changeH2O(numToAdd : number){
    H2O += numToAdd;
    getNonNullElement("water_counter").textContent = ""+H2O;
}

function changeATP(numToAdd : number){
    ATP += numToAdd;
    getNonNullElement("energy_counter").textContent = ""+ATP;
}

function changeADP(numToAdd : number){
    ADP += numToAdd;
    getNonNullElement("spent_energy_counter").textContent = ""+ADP;
}

function addH2OTesta(){
    //display the resources tab if it isn't shown already
    const rsc = document.getElementById("resources_sector");
    if(rsc === null){
        throw "resources sector is gone somehow?";
    }
    if(rsc.style.opacity != "1"){
        rsc.style.opacity = "1";
        showResource("Water", "H<sub>2</sub>O", 1);
    }
    
    //degrade the testa the more water you uptake with it
    if(document.getElementById("dry_INTRO")){
        const introText = getNonNullElement("dry_INTRO");
    
        if(H2O >= 20){
            introText.style.opacity = "0.85";
            introText.textContent = "Your ";
            introText.appendChild(createDefinedSpan("testa", "seed coating"));
            introText.appendChild(document.createTextNode(" is beginning to break down."));
        }
        if(H2O >= 40){
            introText.style.opacity = "0";
            setTimeout(() => { introText.remove(); }, 1000);
            newTextEvent("Deep in your cells, <span>RNA|‘r’ibo’n’ucleic ‘a’cid, a single-stranded molecule with many different forms that all help in protein synthesis,</span> conveys instructions from your <span>DNA|‘d’eoxyribo’n’ucleic ‘a’cid, a double-stranded molecule that stores information,</span> to produce <span>amylase|a protein that helps break down starches</span>. This uses energy.");
            showResource("Starch","long chains of sugars", starch);
            showResource("Energy","ATP, C<sub>10</sub>H<sub>16</sub>N<sub>5</sub>O<sub>13</sub>P<sub>3</sub>", ATP);
            showResource("Spent Energy","ADP, C<sub>10</sub>H<sub>15</sub>N<sub>5</sub>O<sub>10</sub>P<sub>2</sub>", ADP);
            initialAmylaseProduction();
        }
        
    }
    //increment H2O
    changeH2O(1);
}

function initialAmylaseProduction(){
    //when energy at 10, say "Your energy reserves are growing low."
    if(ATP == 10){
        newTextEvent("Your energy reserves are growing low.");
    }
    //when all energy is converted to spent energy, prompt the visibility of the switch for
    //  glucose production and say
    //"Amylase production concludes. You now have enough amylase to convert starches to glucose."
    if(ATP == 0){
        newTextEvent("<span>Amylase|A protein that helps break down starches</span> production concludes. You now have enough <span>amylase|proteins that help break down starches</span> to convert starches to glucose.");
        amylaseRate = 1;
        
    }
    else{
        //energy -> spent energy once per second
        changeATP(-1);
        changeADP(1);
        setTimeout(() => {
            initialAmylaseProduction();    
        }, 1000);
    }

}

function showResource(resource : string, chemTitle : string, startingNum : number){
    const tableSection = document.getElementById("resources_list");
    if(tableSection == null){
        throw "resources list doesn't exist";
    }

    const newRow = document.createElement("tr");

    //give the resource cell the appropriate label
    const label = document.createElement("td");
    label.textContent = resource;

    //give the chemTitle cell the appropriate label, including subscripts
    const chemLabel = document.createElement("td");
    if(!chemTitle.includes("<sub>")){
        chemLabel.textContent = chemTitle;
    }
    else{
        //an integer representing the starting index of the first <sub> token
        let posOfSubscript = chemTitle.indexOf("<sub>");
        while(posOfSubscript>=0){ //while there's another subscript token
            //make the label have some plain text
            chemLabel.appendChild(document.createTextNode(chemTitle.substring(0,posOfSubscript)));

            //make the label have some subscript text
            let posOfEndSubscript = chemTitle.indexOf("</sub>");
            if(posOfEndSubscript<0){
                throw new Error('chemTitle contained a starting "<sub>" token, but no ending "</sub>" token');
            }
            const subText = document.createElement("sub");
            subText.textContent = chemTitle.substring(posOfSubscript+5,posOfEndSubscript);
            chemLabel.appendChild(subText);

            //update chemTitle and posOfSubscript
            chemTitle = chemTitle.substring(posOfEndSubscript+6);
            posOfSubscript = chemTitle.indexOf("<sub>");
        }
        //put whatever remains of chemTitle into chemLabel 
        chemLabel.appendChild(document.createTextNode(chemTitle));
    }

    //give the number cell the appropriate starting value and label
    const num = document.createElement("td");
    num.textContent = ""+startingNum;
    num.id = ""+resource.normalize().toLowerCase().replaceAll(" ", "_")+"_counter";
    
    newRow.appendChild(label);
    newRow.appendChild(chemLabel);
    newRow.appendChild(num);
    tableSection.appendChild(newRow);
}
export{addH2OTesta, changeH2O, amylaseRate, starchToGlucose}