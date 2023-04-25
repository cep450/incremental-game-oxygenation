
//TODO: get these numbers right. 
const timeStarting = 3.4;
let timeTracker = 0;
const timeFrame = 0.001; //add this to timeTracker every animation frame 

//atmosphere content, in percentage of atmosphere 
let O2 = 0.001 * 21; //began at 0.001% of present day amount (21%)
let N2 = 0.80;
let CO2 = 280 * 20 / 1000000;


//numbers that accumulate 
let population = 1;
    //probably have separate trackers of microbes with various properties 
    //maybe some kind of array of arrays of traits checked off, with the amount with that on the side
let reproductionEvents = 0; //number of times reproduced. genetic changes happen every x of these.
let mutations = 0; //definitely shown


//upgradeable rates that change how numbers accumulate.
//arrays represent upgrade and genetic change cost. 
let reposPerMutation = 30;      // chance to mutate every time reproduce. 
                                    //TODO make this upgradeable 
                                    //TODO is this random or every x set interval 
let repoRate = 1 / 10;          // % of population that splits every tick. 
let o2ProduceRate = undefined;  // o2 produced per pop. 
let co2ConsumeRate = undefined; // co2 consumed per pop.


//the question is. can we store information about each individual bacteria. 
//some kind of set of values plus the number of bacteria that fit those values 




let elem_o2, elem_co2, elem_n2;
let div_o2, div_co2, div_n2;
let elem_time;
let elem_population, elem_genetic;
let div_population;
let elem_buyBtnParent;

let div_container;

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
        this.display(false);

        //associated stat it can reveal when bought 
    }

    display(bool) {
        if(bool) {
            this.elem.style.display = 'block';
        } else {
            this.elem.style.display = 'none';
        }
    }

    bought() {

        //if it hasn't been bought yet, 
        //reveal its associated stat 

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
    div_population = document.querySelector('.population');

    elem_buyBtnParent = document.querySelector('.mutations');

    div_container = document.querySelector('.content');

    //add events to buttons 
    //const bbtn_divide = new BuyButton('buy_1', 'Divide.', buy1, document.querySelector('.population'));
    //const bbtn_photo = new BuyButton('buy_2', 'Better photosynthesis.', buy_photo, elem_buyBtnParent);
    //const bbtn_mut = new BuyButton('buy_3', 'Increase mutation rate.', buy_mut, elem_buyBtnParent);
    
    const bbtn_test = new BuyButton('buy_test', 'add 10000 pop for testing', () => { reproduce(10000) }, elem_buyBtnParent);
    bbtn_test.display(true);
    const bbtn_test2 = new BuyButton('buy_test', 'add 1000 pop for testing', () => { reproduce(1000) }, elem_buyBtnParent);
    bbtn_test2.display(true);

    //game start button 
    var btnStart = document.getElementById('btn-start');
    btnStart.addEventListener('click', function(evt) {
        evt.preventDefault();
        btnStart.remove();
        bbtn_divide.display(true);
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
    elem_time.textContent = digits(timeStarting - timeTracker, 5);
    
    visUpdatePopulation();

    div_o2.style.height = O2 * 100 + "%";
    div_co2.style.height = CO2 * 100 + "%";
    div_n2.style.height = N2 * 100 + "%";

}

let baseHeight = undefined;
function visUpdatePopulation() {
    elem_population.textContent = population;

    //div grows as pop grows, but will always fit content
    //the area of the div will be equal to the population 
    //let width = window.getComputedStyle(div_container).getPropertyValue("width");
    let width = window.innerWidth - 60;
    //if(baseHeight == undefined) {
    //    baseHeight = div_population.style.minHeight;
    //}
    let baseHeight = 125; //initial min-width of div
    
    if(population / baseHeight <= width) {
        console.log(population, ' ', width);
        div_population.style.minWidth = Math.round(population / baseHeight) + 'px';
        console.log(div_population.style.minWidth); 
    } else {
        div_population.style.minWidth = width;
        div_population.style.minHeight = Math.round(population / width) + 'px';
        console.log(div_population.style.minHeight);
    }
}

function visUpdateGenetic() {
    elem_genetic.textContent = mutations;
}

function reproduce(amount) {
    population += amount;
    reproductionEvents += amount; 
    if(reproductionEvents > reposPerMutation) {
        let g = Math.round(reproductionEvents / reposPerMutation);
        reproductionEvents -= g * reposPerMutation;
        mutations += g;
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

//display a number as a string with a certain number of digits. 
//Note that the decimal point counts towards the number of digits since it takes up an index.
function digits(number, length) {
    return number.toString().padEnd(length, '0').slice(0, length);
}

//display a number with this many significant digits (zeros don't count)
function significantDigits(number, length) {
    //TODO 
}