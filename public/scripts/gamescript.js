
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
let reposPerMutation = 100;      // chance to mutate every time reproduce. 
                                    //TODO make this upgradeable 
                                    //TODO is this random or every x set interval 
let repoRate = 0;          // % of population that splits every tick. 

//6CO2+6H2O→C6H12O6+6O2
//but was this different when photosynthesis was in development?
//tldr, # co2 to # o2 is the same 
let o2ProduceRate  = 0; // o2 produced per pop. 
let co2ConsumeRate = 0; // co2 consumed per pop.

//so need some sort of co2 production- from where?
//or just don't have co2 move 


//the question is. can we store information about each individual bacteria. 
//some kind of set of values plus the number of bacteria that fit those values 




let elem_o2, elem_co2, elem_n2;
let div_o2, div_co2, div_n2;
let elem_time;
let elem_population, elem_genetic;
let div_population;
let elem_buyBtnParent;
let div_container;


let btnIdCounter = 0;
//button representing and managing logic for an upgrade
class BuyButton {

    //id: element id
    //text: title of button
    //fn: function called when clicked 
    constructor(text, cost, f) {
        this.id = 'buy_' + btnIdCounter++;
        this.cost = cost;
        this.text = text;
        this.clickFn = f;
        this.elem = undefined;
        this.count = 0; //number of upgrades purchased 
    }

    updateText() {
        this.elem.textContent = this.text + " \n (" + this.cost[this.count] + " mut)";
    }

    //instantiate on the dom, default to buy button parent 
    addToPage(parent = elem_buyBtnParent) {
        this.elem = document.createElement('button');
        parent.appendChild(this.elem);
        this.updateText();
        this.elem.classList.add('buybutton');
        this.elem.id = this.id;

        //gross, but it gets it to work
        let th = this;
        this.elem.addEventListener('click', function(evt, buy = th,) {
            evt.preventDefault();

            //check we can afford it and spend the mutations if so 
            if(buy.cost[buy.count] > mutations) {
                console.log('couldnt afford this');
            } else {
                mutations = mutations - buy.cost[buy.count];
                if(buy.count < buy.cost.length - 1) { //if run out of cost arr, stops- TODO change this behavior
                    buy.count++;
                }
                buy.clickFn();
                buy.updateText();
            }
        });
        this.display(false);
    }

    //display/undisplay on page
    display(bool = true) {
        if(bool) {
            this.elem.style.display = 'block';
        } else {
            this.elem.style.display = 'none';
        }
    }
}

/*
    UPGRADES TODO 

    - array of strings so different upgrade text?
    - different string for description of what stat it will upgrade for each?

*/

//upgrade buttons 
const btn_divide = new BuyButton(
    'Divide.', 
    [0],
    () => {
        reproduce(1);
    }
);
const btn_photo = new BuyButton(
    'Develop photosynthesis. \n 6CO2 + 6H2O → C6H12O6 + 6O2', 
    [50, 100, 500, 1000],
    () => {
        console.log('photo bought');
        o2ProduceRate = o2ProduceRate + (1 / 10000000000);
        co2ConsumeRate = co2ConsumeRate + (1 / 1000000000);
    }
);
const btn_mut = new BuyButton( 
    'Increase mutation rate. \n Genetic recombination', 
    [1, 500, 1000, 5000, 10000],
    () => {
        console.log('mut bought');
        reposPerMutation = reposPerMutation / 1.5;
    }
);
const btn_repo = new BuyButton(
    'Increase automatic division rate.', 
    [5, 100, 500, 1000, 5000, 10000],
    () => {
        console.log('repo bought');
        repoRate = repoRate + (1 / 75);
    }
);



//don't load until page loaded 
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed, loading");

    //save element references 
    div_container = document.querySelector('.content');
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

    //add buttons to page 
    btn_divide.addToPage(document.querySelector('.population'));
    btn_photo.addToPage(); btn_photo.display();
    btn_mut.addToPage(); btn_mut.display();
    btn_repo.addToPage(); btn_repo.display();
    
    
    //const bbtn_test = new BuyButton('add 1000 pop for testing', () => { reproduce(1000) });
    //bbtn_test.addToPage();
    //bbtn_test.display(true);

    //game start button 
    var btnStart = document.getElementById('btn-start');
    btnStart.addEventListener('click', function(evt) {
        evt.preventDefault();
        btnStart.remove();
        btn_divide.display(true);
        console.log('starting game!');
        setInterval(tick, 1000);
    });

    //a single tick to get starting values 
    tick();

    console.log('loaded');

});

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
        div_population.style.minWidth = Math.round(population / baseHeight) + 'px';
    } else {
        div_population.style.minWidth = width;
        div_population.style.minHeight = Math.round(population / width) + 'px';
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

function tick() {


    //TODO 
    //game logic happens

    //consume co2 
    //CO2 = CO2 - (population * co2ConsumeRate);

    //currently bullshitting to keep the percentage out of 100 

    //produce o2 
    let o2Prod = (population * o2ProduceRate);
    O2 = O2 + o2Prod;
    N2 = N2 - o2Prod;

    //model other things changing this ^ ? 

    //multiply
    reproduce(Math.floor(population * repoRate));


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