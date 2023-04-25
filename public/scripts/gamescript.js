
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


let btnIdCounter = 0;
//button representing and managing logic for an upgrade
class BuyButton {

    //id: element id
    //text: title of button
    //fn: function called when clicked 
    constructor(text, f) {
        this.id = 'buy_' + btnIdCounter++;
        this.text = text;
        this.clickFn = f;
        this.elem = undefined;
        this.count = 0; //number of upgrades purchased 
    }

    //instantiate on the dom, default to buy button parent 
    addToPage(parent = elem_buyBtnParent) {
        this.elem = document.createElement('button');
        parent.appendChild(this.elem);
        this.elem.textContent = this.text;
        this.elem.classList.add('buybutton');
        this.elem.id = this.id;
        let ff = this.clickFn; //gross, but it gets it to work
        this.elem.addEventListener('click', function(evt, f = ff) {
            evt.preventDefault();
            f();
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
    () => {
        console.log('divide');
        reproduce(1);
    }
);
const btn_photo = new BuyButton(
    'Develop photosynthesis. (100 mut)', 
    () => {
        console.log('photo');
    }
);
const btn_mut = new BuyButton( 
    'Genetic recombination: increase mutation rate. (1000 mut)', 
    () => {
        console.log('mut');
    }
);
const btn_repo = new BuyButton(
    'Increase auto division rate. (100 mut)',
    () => {
        console.log('repo');
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
    btn_repo.addToPage(); btn_repo.display();
    btn_mut.addToPage(); btn_mut.display();
    
    const bbtn_test = new BuyButton('add 1000 pop for testing', () => { reproduce(1000) });
    bbtn_test.addToPage();
    bbtn_test.display(true);

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