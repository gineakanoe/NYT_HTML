
const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';     //NYT API endpoint to collect our data from & getting info from
const key = 'UA8FBE0dxZGwxGx2WYy2RjqCwdH63cay';                                 //Personal Key assigned when NYT account and app was created
let url;                                                                        //Defined 'url' -variable is used for dynamic search url - empty string to build URL from

//* REFERENCE TO DOM ELEMENTS - We Define our Variables & connect them to their related class in the index.html
//SEARCH FORM
let searchTerm = document.querySelector('.search');
let startDate = document.querySelector('.start-date');
let endDate = document.querySelector('.end-date');
let searchForm = document.querySelector('form');
//const submitBtn = document.querySelector('.submit');                          // don't use this term since it's part of the Search Form
//RESULTS NAVIGATION & SECTION
let nextBtn = document.querySelector('.next');
let previousBtn = document.querySelector('.prev');
let section = document.querySelector('section');
let nav = document.querySelector('nav');

nav.style.display = 'none';                                                     //This makes the 'next' and 'previous' buttons disappear until a search has been initiated

let pageNumber = 0;                                                             //Defines variable and connects it to main page; varification
//let displayNav = false;                                                       //Ensures navBar is not visible on home page; pageNumber 0.

//* EVENT LISTENERS - They fire off function when each button is clicked       
searchForm.addEventListener('submit', submitSearch);                            //function submitSearch()
nextBtn.addEventListener('click', nextPage);                                    //function nextPage()
previousBtn.addEventListener('click', previousPage);                            //function previouPage

function submitSearch(e) {                                                      //(e) -Event Handling Function- allows interaction with bunch of properties (variables) and methods (functions).
    pageNumber = 0;                                                             //pageNumber resets to 0 everytime a 'submitSearch' is fired
    fetchResults(e);                                                            //invokes funtion fetchResults when event listener 'submitSearch' is fired
}

//* FETCHRESULTS() & ACCESSING A REST API
function fetchResults(e) {
    e.preventDefault();                                                         //default form method is to POST, this form is to GET -Preventing the default from happening
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value + '&fq=document_type:("article")';  //creating a 'versatile query string' => values inside '' are terms connected to NYT API's search; the other values are terms defined in our javascript.
//  console.log("URL:", url);

    if(startDate.value !== '') {                                                //conditional statement - (!== '') - IF date values, add to url string; IF blank, conditionals are ignored.
        url += '&begin_date=' + startDate.value;                                //URL string for when data values are entered. - += adds values to url string
    };
    if(endDate.value !== '') {
        url += '&end_date=' + endDate.value;
    };

    fetch(url).then(function(result) {                                          //made fetch request; passed 'url' through; created promise that '.then' returns response of 'result'
        return result.json();                                                   //promise async returns 'result.json()' to convert result into usable json format
    }).then(function(json) {                                                    //2nd Promise takes usable json object and returns defined variable 'displayResults(json)'
        displayResults(json);
    });
}

//*Display the data
function displayResults(json) {                                                 //turns 'displayResults(json) variable into function that fires when 'submit' button is clicked
    while (section.firstChild) {                                                //Checks if 'section' element has any child elements in the html file  //!'while' is a loop'
        section.removeChild(section.firstChild);                                //If there are child elements; clear them from the 'section' element
    }
    let articles = json.response.docs;                                          //defines 'articles' and where to find them
    
    if(articles.length === 10) {                                                //if array has 10 items(articles)
//      console.log("No results");
        nav.style.display = 'block';                                            //shows the 'nextPage' and 'previousPage' buttons
    } else {                                                                    //otherwise
        nav.style.display = 'none';                                             //do not show the 'nextPage' and 'previousPage' buttons
    }
    if(articles.length === 0) {                                                 //if array has 0 items
        let para = document.createElement('p');
        para.textContent = 'No results returned.'                               //return no results
        section.appendChild(para);
      } else {                                                                  //if array has items
        for(let i = 0; i < articles.length; i++) {                              //for loop (i)

//*DOM CONTAINER - Think of nodes as branches in a family tree of sorts
            let article = document.createElement('article');                    //create node of 'article' in DOM (article is a child of SECTION in index.html)
            let heading = document.createElement('h2');                         //create node of heading    - is a 'h2' element
            let link = document.createElement('a');                             //create node of link       - is an 'a' element
            let img = document.createElement('img');                            //create node of imag       - is an 'img' element
            let para1 = document.createElement('p');                            //create node of para1      - is a 'p' element
            let para2 = document.createElement('p');                            //create node of para2      - is a 'p' element
            let clearfix = document.createElement('div');                       //create node of clearfix   - is a 'div' element

            let current = articles[i];                                          //create 'current' variable; holds data for iteratted current article
            console.log("Current: ", current);                                  //log to see 'current' data in console

            link.href = current.web_url;                                        //attaches href property to 'a' element; 'current.web.url' grabs href for article from json results
            link.textContent = current.headline.main;                           //attaches 'a' element to current article 'h2' element

            para1.textContent = current.snippet;                                //'textContent' attribute contains current article 'snippet' text
            para2.textContent = 'Keywords: ';                                   //'textContent' attribute contains current article 'keyword' text

            for(let j = 0; j < current.keywords.length; j++) {                  //for loop iterates through the length of 'keywords' array in the 'current' result object //!Dont forget, this for loop is happening inside another for loop
                let span = document.createElement('span');                      //create 'span' for each keyword; 'span' element ends when item ends.
                span.textContent = current.keywords[j].value + ' ';             //'textContent' for span is the value inside the keywords array inside the json object
                para2.appendChild(span);                                        //add each 'span' to 'para2' node
            }

            if(current.multimedia.length > 0) {                                 //Check json data for if there is a multimedia property (length > 0)
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url; //If object, we chain a string with url for the 'html' 'src' value with the 'current' item in multimedia array 
                img.alt = current.headline.main;                                //Alt for if image isn't available; alt value set to headline
            }

            clearfix.setAttribute('class','clearfix');                          //'setAttribute' method targets '.clearfix' class inside css file - does nothing?

            article.appendChild(heading);                                       //heading is child node of article  -'h2' element created in each article
            heading.appendChild(link);                                          //link is child node of heading     -'a' element created in each heading
            article.appendChild(img);                                           //img is child node of article      -'img' element created in each article
            article.appendChild(para1);                                         //para1 is child node of article    -'p' element created in each article 
            article.appendChild(para2);                                         //para2 is child node of article    -'p' element created in each article
            article.appendChild(clearfix);                                      //clearfix is child node of article -'div' element created in each article
            section.appendChild(article);                                       //article is child node of section  -makes section for next article
        }
    }
};

//* PAGINATION - Separates print/digital content into seperate pages; auto precess to identify sequential order of pages
function nextPage(e) {                                                          //define 'nextPage' as a function
    pageNumber++;                                                               //increase value of 'pageNumber' variable
    fetchResults(e);                                                            //reruns 'fetchResults' function
//  console.log("Page number:", pageNumber);                                    //prints 'pageNumber' variable to see it increment
};

function previousPage(e) {                                                      //define 'previousPage' as a function
    if(pageNumber > 0) {                                                        //first page = 0; 'previousPage' will not work on pageNumber 0
      pageNumber--;                                                             //if # > 0, we decrement pageNumber by 1
    } else {
      return;                                                                   //if # == 0, return nothing and exit/break function
    }
    fetchResults(e);                                                            //if # > 0, run 'fetchResults' again
//  console.log("Page:", pageNumber);                                           //prints 'pageNumber' variable to see it decrement
};


/*
                                                    NYT APP FAMILY TREE
                                                            ↓
                                                        |Document|
                                                            ↓
                                                          |Body|
                                                            ↓
                                                        |Section|
                                                            ↓
                                                        |Article|
                                    -------------------------------------------------                                           
                                    ↓               ↓               ↓               ↓
                                |Heading|        |Image|    |Paragraph 1 & 2|     |Div|                                                        
                                    ↓
                                 |Link|
*/