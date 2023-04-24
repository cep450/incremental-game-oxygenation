
//TODO: get these numbers right. 
const timeStarting = 3.4;
let timeTracker = 0;
const timeFrame = 0.001; //add this to timeTracker every animation frame 

//atmosphere content, in percentage of atmosphere 
let O2 = 0.001 * 21; //began at 0.001% of present day amount (21%)
let N2 = 0.80;
let CO2 = 280 * 20 / 1000000;

let population = 1;
//probably have separate trackers of microbes with various properties 
//maybe some kind of array of arrays of traits checked off, with the amount with that on the side

let reproductionEvents = 0; //hidden?
let geneticChanges = 0; //definitely shown
let reposPerGeneticChange = 30; //chance to mutate every time reproduce. 
                                    //TODO make this upgradeable 
                                    //TODO is this random or every x set interval 


//the question is. can we store information about each individual bacteria. 




let elem_o2, elem_co2, elem_n2;
let div_o2, div_co2, div_n2;
let elem_time;
let elem_population, elem_genetic;
let elem_buyBtnParent;

class BuyButton {
    constructor(id, text, fn, parent) {
        this.id = id;
        //instantiate on DOM 
        this.elem = document.createElement('button');
        parent.appendChild(this.elem);
        this.elem.textContent = text;
        this.elem.classList.add('buybutton');
        this.elem.id = id;
        this.elem.addEventListener('click', function(evt) {
            evt.preventDefault();
            fn();
        });
        this.elem.hidden = true;
    }
}

//don't load until page loaded 
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed, loading");

    //save element references 
    elem_o2 = document.getElementById('O2');
    elem_co2 = document.getElementById('CO2');
    elem_n2 = document.getElementById('N2');
    elem_time = document.getElementById('time');
    elem_population = document.getElementById('population');
    elem_genetic = document.getElementById('genetic');

    div_o2 = document.querySelector('.O2');
    div_co2 = document.querySelector('.CO2');
    div_n2 = document.querySelector('.N2');

    elem_buyBtnParent = document.querySelector('.mutations');

    //add events to buttons 
    const bbtn_divide = new BuyButton('buy_1', 'Divide.', buy1, document.querySelector('.population'));
    const bbtn_photo = new BuyButton('buy_2', 'Better photosynthesis.', buy_photo, elem_buyBtnParent);
    const bbtn_mut = new BuyButton('buy_3', 'Increase mutation rate.', buy_mut, elem_buyBtnParent);
    
    //game start button 
    var btnStart = document.getElementById('btn-start');
    btnStart.addEventListener('click', function(evt) {
        evt.preventDefault();
        btnStart.remove();
        bbtn_divide.elem.style.visibility = 'visible';
        console.log('starting game!');
        setInterval(tick, 1000);
    });

    //a single tick to get starting values 
    tick();

});

function registerButton(id, callback) {
    document.getElement
}



function tick() {


    //TODO 
    //game logic happens

    //consume co2 
    //produce o2 

    //model other things changing this ^ ? 

    //multiply
    //add to opportunities for genetic changes 


    //keep track of time
    timeTracker += timeFrame;

    //update numbers displayed 
    elem_o2.textContent = O2;
    elem_co2.textContent = CO2;
    elem_n2.textContent = N2;
    elem_time.textContent = (timeStarting - timeTracker);
    
    visUpdatePopulation();

    div_o2.style.height = O2 * 100 + "%";
    div_co2.style.height = CO2 * 100 + "%";
    div_n2.style.height = N2 * 100 + "%";

}

function visUpdatePopulation() {
    elem_population.textContent = population;
}
function visUpdateGenetic() {
    elem_genetic.textContent = geneticChanges;
}

function reproduce(amount) {
    population += amount;
    reproductionEvents += amount; 
    if(reproductionEvents > reposPerGeneticChange) {
        let g = Math.round(reproductionEvents / reposPerGeneticChange);
        reproductionEvents -= g * reposPerGeneticChange;
        geneticChanges += g;
    }
    visUpdatePopulation();
    visUpdateGenetic();
}

//divide
function buy1() {
    reproduce(1);
}

//evolve early photosynthesis. starts putting O2 in atmosphere. 
//need enough genetic changes to buy this
//so acts as tutorial for how that works 
function buy_photo() {

}

function buy_mut() {

}