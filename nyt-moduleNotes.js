//! This is unconnected to the HTML file !//

const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';         //1
const key = 'UA8FBE0dxZGwxGx2WYy2RjqCwdH63cay';                                     //2
let url;                                                                            //3

/*
    1. declare baseURL of the API.  This is the requires endpoint for the New York Times data.
    2. This is the key that was assigned to me when app was created in my account.  This is the 'key' variable. It IS user specific.
    3. 'let url' variable will be used to make a dynamic search url.
*/

//* REFERENCE TO DOM ELEMENTS

//SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
//const submitBtn = document.querySelector('.submit');                                   //I don't think we use this term since its within the 'form' tag

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');

//RESULTS SECTION
const section = document.querySelector('section');
const nav = document.querySelector('nav');

nav.style.display = 'none';                                                            //This makes the 'next' and 'previous' buttons disappear until a search has been initiated

let pageNumber = 0;
//let displayNav = false;                                                                 //Ensures navBar is not visible on home page; pageNumber 0.


//* EVENT LISTENERS


        //1                     //2
searchForm.addEventListener('submit', submitSearch);    //3.1
nextBtn.addEventListener('click', nextPage);            //3.2
previousBtn.addEventListener('click', previousPage);    //3.2

function submitSearch(e) {
    pageNumber = 0;
    fetchResults(e);
}

/*
    1. Want to submit a form with query: "sports", "politics", "weather", etc.
    2. Want to toggle through results when we click the next or previous button.
    3.
            1. With 'searchForm' variable we '.addEventListener' that fires off function 'fetchResults' when 'submit' is called. ('submit search button' fires off on a form not a button)
            2. When 'next' or 'previous' buttons are 'click'ed, the 'eventListener' fires off function called 'nextPage' and/or 'previousPage'
*/


//* FETCHRESULTS() & ACCESSING A REST API

/*                     //1
function fetchResults(e){
    console.log(e);             //2
    //Assemble the full URL
    url = baseURL + '?api-key=' + key + '&page' + pageNumber + '&q=' + searchTerm.value;        //3
    console.log(url);       //4
}
*/
/*
function nextPage(){
    console.log("Next button clicked");
}                                                           //5

function previousPage(){
    console.log("Previous button clicked");
}                                                           //5
*/

/*
    1. (e) in JS is called an 'event handling function'.  'e' is similar to a variable that allows interaction with object (bunch of properties (variables) and methods (functions)).
    2. logging event object for learning purposes.
    3. creating a 'versatile query string'.
    4. log string so we can see it.
    5. add basic functions to define 'nextPage' and 'previousPage' and log them.  Without this, the app will get an error.  ..which I was getting until this point.
*/

//*PREVENTDEFAULT()
    //This form is not a form we are signing up with or filling out data to be saved in its database, which is its default. (to send a POST request)
    //This form is to GET data using a request. preventDefault() prevents a POST so we can use form to GET data instead.

function fetchResults(e) {
    e.preventDefault();
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value + '&fq=document_type:("article")';
//  console.log("URL:", url);

    //Insert Here
    if(startDate.value !== '') {
//      console.log(startDate.value)
        url += '&begin_date=' + startDate.value;
    };
    
    if(endDate.value !== '') {
        url += '&end_date=' + endDate.value;
    };
    //End Here

    fetch(url).then(function(result) {
        //console.log(result); -removed in displayResults
        return result.json();
    }).then(function(json) {
        //console.log(json); -removed in displayResults ...good, 'cause this one was giving me errors
        displayResults(json);
    });
}
/*
function displayResults(json) {
    console.log("DisplayResults", json);
};
*/


    //What we did
    /*
    1. make the fetch request
    2. pass the NYT url
    3. create a promise '.then' that returns a response called 'result'.
    4. promise asynchronously returns a function ('result.json()') that converts the result into usable json format.
    5. Create second promise that has function that takes the 'json' object in.
    6. log the 'json' object for now....        which is erroring out on me...
    */


//* BEGINNING AND ENDING DATE

    // added end date and start date conditional statements (ifs) within the 'fetchResults' function
    // the (!== '') means that if there are date values they're added to url string; if blank the expression inside the conditionals are ignored.


//* DISPLAY RESULTS

/*
function displayResults(json) {
    console.log(json.response.docs);
}
*/

/*function displayResults(json) {
    let articles = json.response.docs;
    console.log(articles);
}
*/

function displayResults(json) {
    while (section.firstChild) {                           //*Clears out any articles before new search results are added
        section.removeChild(section.firstChild);
    }
    const articles = json.response.docs;
    
    if(articles.length === 10) {
//      console.log("No results");
        nav.style.display = 'block';                            //?shows the nav display if 10 items are in the array
    } else {
        nav.style.display = 'none';
    }
        //Display the data

    if(articles.length === 0) {
        const para = document.createElement('p');
        para.textContent = 'No results returned.'
        section.appendChild(para);
      } else {
        for(let i = 0; i < articles.length; i++) {
            //console.log(i);                                               //DOM CONTAINER
            const article = document.createElement('article');               //1
            const heading = document.createElement('h2');                    //2
            const link = document.createElement('a');                //!1
            const img = document.createElement('img');
            const para1 = document.createElement('p');
            const para2 = document.createElement('p');
            const clearfix = document.createElement('div');

            const current = articles[i];                            //!2
            console.log(current);                                   //!3

            link.href = current.web_url;                            //!4
            link.textContent = current.headline.main;               //!5

            para1.textContent = current.snippet;
            para2.textContent = 'Keywords: ';

            for(let j = 0; j < current.keywords.length; j++) {
                const span = document.createElement('span');
                span.textContent = current.keywords[j].value + ' ';
                para2.appendChild(span);
            }

            if(current.multimedia.length > 0) {
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;
            }

            clearfix.setAttribute('class','clearfix');

            article.appendChild(heading);                                  //3
            heading.appendChild(link);                              //!6
            article.appendChild(img);
            article.appendChild(para1);
            article.appendChild(para2);
            article.appendChild(clearfix); 
            section.appendChild(article);                                   //4
//          nav.style.display = 'none';                         //?hides the nav display if less than 10 items are in the array
        }
    }
};

/*
    1. We create an article variable that will create a node in the DOM that is an 'article' element. Remember that  is an HTML5 'article' element.
    2. We also create a heading variable that creates a node in the DOM that is an 'h2' element.
    3. We call appendChild() on the article element. This will create a child node on that element. We pass in 'heading' to the appendChild method. This means that there will be an 'h2' element created inside each 'article' element.
    4. Since we have a 'section' in our original 'html' file, we call the appendChild() method on the 'section' element. We pass in the 'article' to that. This way, the article is a child of 'section', and the 'h2' is a grandchild of 'section'.
*/

function nextPage(e) {
    pageNumber++;
    fetchResults(e);
};

function previousPage(e) {
    if(pageNumber > 0) {
      pageNumber--;
    } else {
      return;
    }
    fetchResults(e);
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