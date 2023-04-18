
//TODO: get these numbers right. 
const timeStarting = 3.4;
let timeTracker = 0;
const timeFrame = 0.001; //add this to timeTracker every animation frame 

//atmosphere content, in percentage of atmosphere 
let O2 = 0.001 * 21; //began at 0.001% of present day amount (21%)
let N2 = "TODO";
let CO2 = "TODO";
const atmosphereUnitString = " %"

let population = 1;
//probably have separate trackers of microbes with various properties 
//maybe some kind of array of arrays of traits checked off, with the amount with that on the side

let reproductionEvents = 0;
let geneticMaterialChanges = 0;
const geneticChangesPerRepro = 0.01; //chance to mutate every time reproduce. 
                                    //TODO make this upgradeable 
                                    //TODO is this random or every x set interval 


//the question is. can we store information about each individual bacteria. 



let elem_o2, elem_co2, elem_n2;
let elem_time;
let elem_population;
let btn_buy1, btn_buy2, btn_buy3;

//don't load until page loaded 
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed, loading");

    //save element references 
    elem_o2 = document.getElementById('O2');
    elem_co2 = document.getElementById('CO2');
    elem_n2 = document.getElementById('N2');
    elem_time = document.getElementById('time');
    elem_population = document.getElementById('population');

    //add events to buttons 

    //buy buttons (which start hidden)
    btn_buy1 = document.getElementById('btn-buy-1');
    btn_buy1.addEventListener('click', function(evt) {
        evt.preventDefault();
        buy1();
    });
    
    //game start button 
    var btnStart = document.getElementById('btn-start');
    btnStart.addEventListener('click', function(evt) {
        evt.preventDefault();
        btnStart.remove();
        btn_buy1.style.visibility = 'visible';
        console.log('starting game!');
        setInterval(tick, 1000);
    });

});





function tick() {

    console.log('tick');


    //TODO 
    //game logic happens


    //keep track of time
    timeTracker += timeFrame;

    //update numbers displayed 
    elem_o2.style.textContent = O2;
    elem_co2.style.textContent = CO2;
    elem_n2.style.textContent = N2;
    elem_time.style.textContent = (timeStarting - timeTracker) + 'skfjsfjd';
    elem_population.style.textContent = population;

}


function buy1() {
    console.log('got buy 1');
}
