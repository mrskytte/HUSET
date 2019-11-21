// INIT PAGE
getData();

// HEADER JS
const menuBtn = document.querySelector(".menu");
menuBtn.addEventListener("click", openMenu);
const menuWrap = document.querySelector(".navwrap");
const body = document.querySelector("body");

// SHOW MENU
function openMenu() {
    menuWrap.classList.remove("hide");
    setTimeout(function() {
        body.addEventListener("click", closeMenu);
    }, 100);
}

// HIDE MENU
function closeMenu(event) {
    const ignore = document.querySelector(".navbar");
    console.log(event.target);
    if (event.target != ignore) {
        menuWrap.classList.add("hide");
        body.removeEventListener("click", closeMenu);
    }
}

// LOG BASE URL FOR LATER LINKING
var url = window.location.origin;

// SEARCH URL FOR SECTION PROPERTY
var searchPara = new URLSearchParams(window.location.search);
var section = searchPara.get("section");
var tag = searchPara.get("tag");
var searchPara = searchPara.get("search");

// FETCH DATA FROM JSON / ?PER_PAGE=100 ALLOWS ME TO ACCESS ALL POSTS
function getData() {
    fetch(
        "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/huset-event?per_page=100"
    )
        .then(response => response.json())
        .then(showPosts);
}

function getSearch() {
    fetch(
        "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/huset-event?search=" +
            searchPara
    )
        .then(res => res.json())
        .then(handleSearch);
}

// DISPLAY DIFFERENT DATA DEPENDING ON SECTION PROPERTY'S VALUE
function showPosts(post) {
    if (section == "events") {
        post.forEach(showEvents);
    } else if (searchPara) {
        getSearch();
    } else if (section == "games") {
        post.forEach(showGames);
    } else if (tag) {
        post.forEach(showTags);
    } else {
        post.forEach(frontPage);
    }
}

const eventSection = document.querySelector("#events");
const gameSection = document.querySelector("#games");

function search() {
    var searchText = document.querySelector(".searchinfo").value;
    window.open(url + "/index.html?search=" + searchText, "_self");
}

function handleSearch(mySearch){
    mySearch.forEach(searchPosts)
}

// LOAD INDEX PAGE FROM SEARCH
function searchPosts(onePost) {
    var id = onePost.id
    var eventsDiv = document.querySelector(".eventsheader")
    var gamesDiv = document.querySelector(".gamesheader")
    console.log(gamesDiv)
    if (onePost.categories.indexOf(3) != -1) {
        gamesDiv.classList.remove("hide");
        console.log(gamesDiv)
        const gameTemp = document.querySelector(".game-template").content;
        var gameClone = gameTemp.cloneNode(true);

        // FETCH FUNCTION THAT GRABS THE FEATURED IMG
        fetch(
            "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                onePost.featured_media
        )
            .then(response => response.json())
            .then(showImg);

        gameClone.querySelector(".game-title").innerHTML =
            onePost.title.rendered;
        gameClone.querySelector(".game-shortdescription").textContent =
            onePost.short_description;
        // SET ID OF THIS POST SO IT CAN BE TARGET INSIDE THE DOM
        gameClone.querySelector("article").setAttribute("id", id);
        // SET ID OF THE FEATURED IMG SO IT CAN BE GRABBED BY A ABOVE IMG JSON FETCH
        gameClone
            .querySelector(".game-img")
            .setAttribute("id", onePost.featured_media);
        // APPEND POST TO PARENT ELEMENT
        gameSection.appendChild(gameClone);

        // APPENDS THE IMG AFTER THE POST HAS BEEN APPENDED / I COULDN'T MAKE IT WORK WITHOUT FIRST APPENDING THE POST SO THIS STEP MIGHT NOT BE BEST PRACTICE BUT IT WORKS
        function showImg(img) {
            document
                .getElementById(img.id)
                .setAttribute("src", img.media_details.sizes.medium.source_url);
            document
                .getElementById(img.id)
                .setAttribute("alt", img.media_details.alt_text);
        }
        // ADD EVENTLISTENER THAT'LL OPEN A NEW PAGE ONLY DISPLAYING THE CLICKED POST
        document.getElementById(id).addEventListener("click", function(target) {
            window.open(url + "/game.html?id=" + id, "_self");
        });
    } else {
        const eventTemp = document.querySelector(".event-template").content;
        var eventClone = eventTemp.cloneNode(true);

        // FETCH FUNCTION THAT GRABS THE FEATURED IMG
        fetch(
            "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                onePost.featured_media
        )
            .then(response => response.json())
            .then(showImg);
        // DEFINE DATE
        var date = new Date(onePost.event_date);
        // DEFINE TIME AND SUBTRACT THREE CHARACTERS FROM THE STRING
        var time = onePost.event_time;
        time = time.substring(0, time.length - 3);

        eventClone.querySelector(".event-title").innerHTML =
            onePost.title.rendered;
        eventClone.querySelector(".event-time").textContent = time;
        // ADD toDateString() TO MAKE THE DATE READABLE
        eventClone.querySelector(
            ".event-date"
        ).textContent = date.toDateString();
        eventClone.querySelector(".event-location").textContent =
            onePost.location;
        // MATH.ROUND TO CUT OFF DECIMALS
        eventClone.querySelector(".event-price").textContent =
            Math.round(onePost.price) + " kr";
        eventClone.querySelector(".event-shortdescription").textContent =
            onePost.short_description;
        // SET ID OF THIS POST SO IT CAN BE TARGET INSIDE THE DOM
        eventClone.querySelector("article").setAttribute("id", id);
        // SET ID OF THE FEATURED IMG SO IT CAN BE GRABBED BY A ABOVE IMG JSON FETCH FUNCTION
        eventClone
            .querySelector(".event-img")
            .setAttribute("id", onePost.featured_media);
        eventSection.appendChild(eventClone);

        // APPENDS THE IMG AFTER THE POST HAS BEEN APPENDED / I COULDN'T MAKE IT WORK WITHOUT FIRST APPENDING THE POST SO THIS STEP MIGHT NOT BE BEST PRACTICE BUT IT WORKS
        function showImg(img) {
            document
                .getElementById(img.id)
                .setAttribute("src", img.media_details.sizes.medium.source_url);
            document
                .getElementById(img.id)
                .setAttribute("alt", img.media_details.alt_text);
        }
        // ADD EVENTLISTENER THAT'LL OPEN A NEW PAGE ONLY DISPLAYING THE CLICKED POST
        document.getElementById(id).addEventListener("click", function(target) {
            window.open(url + "/event.html?id=" + id, "_self");
        });
        // ELSE SEE IF GAMES CATEGORY IS APPLIED
    }
}

// LOAD INDEX PAGE WITH TAGS
function showTags(onePost) {
    var id = onePost.id;
    console.log(id);
    tags = parseInt(tag, 10);
    if (onePost.tags.indexOf(tags) != -1) {
        if (onePost.categories.indexOf(3) != -1) {
            const gameTemp = document.querySelector(".game-template").content;
            var gameClone = gameTemp.cloneNode(true);

            // FETCH FUNCTION THAT GRABS THE FEATURED IMG
            fetch(
                "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                    onePost.featured_media
            )
                .then(response => response.json())
                .then(showImg);

            gameClone.querySelector(".game-title").innerHTML =
                onePost.title.rendered;
            gameClone.querySelector(".game-shortdescription").textContent =
                onePost.short_description;
            // SET ID OF THIS POST SO IT CAN BE TARGET INSIDE THE DOM
            gameClone.querySelector("article").setAttribute("id", id);
            // SET ID OF THE FEATURED IMG SO IT CAN BE GRABBED BY A ABOVE IMG JSON FETCH
            gameClone
                .querySelector(".game-img")
                .setAttribute("id", onePost.featured_media);
            // APPEND POST TO PARENT ELEMENT
            gameSection.appendChild(gameClone);

            // APPENDS THE IMG AFTER THE POST HAS BEEN APPENDED / I COULDN'T MAKE IT WORK WITHOUT FIRST APPENDING THE POST SO THIS STEP MIGHT NOT BE BEST PRACTICE BUT IT WORKS
            function showImg(img) {
                document
                    .getElementById(img.id)
                    .setAttribute(
                        "src",
                        img.media_details.sizes.medium.source_url
                    );
                document
                    .getElementById(img.id)
                    .setAttribute("alt", img.media_details.alt_text);
            }
            // ADD EVENTLISTENER THAT'LL OPEN A NEW PAGE ONLY DISPLAYING THE CLICKED POST
            document
                .getElementById(id)
                .addEventListener("click", function(target) {
                    window.open(url + "/game.html?id=" + id, "_self");
                });
        } else {
            const eventTemp = document.querySelector(".event-template").content;
            var eventClone = eventTemp.cloneNode(true);

            // FETCH FUNCTION THAT GRABS THE FEATURED IMG
            fetch(
                "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                    onePost.featured_media
            )
                .then(response => response.json())
                .then(showImg);
            // DEFINE DATE
            var date = new Date(onePost.event_date);
            // DEFINE TIME AND SUBTRACT THREE CHARACTERS FROM THE STRING
            var time = onePost.event_time;
            time = time.substring(0, time.length - 3);

            eventClone.querySelector(".event-title").innerHTML =
                onePost.title.rendered;
            eventClone.querySelector(".event-time").textContent = time;
            // ADD toDateString() TO MAKE THE DATE READABLE
            eventClone.querySelector(
                ".event-date"
            ).textContent = date.toDateString();
            eventClone.querySelector(".event-location").textContent =
                onePost.location;
            // MATH.ROUND TO CUT OFF DECIMALS
            eventClone.querySelector(".event-price").textContent =
                Math.round(onePost.price) + " kr";
            eventClone.querySelector(".event-shortdescription").textContent =
                onePost.short_description;
            // SET ID OF THIS POST SO IT CAN BE TARGET INSIDE THE DOM
            eventClone.querySelector("article").setAttribute("id", id);
            // SET ID OF THE FEATURED IMG SO IT CAN BE GRABBED BY A ABOVE IMG JSON FETCH FUNCTION
            eventClone
                .querySelector(".event-img")
                .setAttribute("id", onePost.featured_media);
            eventSection.appendChild(eventClone);

            // APPENDS THE IMG AFTER THE POST HAS BEEN APPENDED / I COULDN'T MAKE IT WORK WITHOUT FIRST APPENDING THE POST SO THIS STEP MIGHT NOT BE BEST PRACTICE BUT IT WORKS
            function showImg(img) {
                document
                    .getElementById(img.id)
                    .setAttribute(
                        "src",
                        img.media_details.sizes.medium.source_url
                    );
                document
                    .getElementById(img.id)
                    .setAttribute("alt", img.media_details.alt_text);
            }
            // ADD EVENTLISTENER THAT'LL OPEN A NEW PAGE ONLY DISPLAYING THE CLICKED POST
            document
                .getElementById(id)
                .addEventListener("click", function(target) {
                    window.open(url + "/event.html?id=" + id, "_self");
                });
            // ELSE SEE IF GAMES CATEGORY IS APPLIED
        }
    }
}

// LOAD DEFAULT INDEX PAGE
function frontPage(onePost) {
    // CAROUSEL FUN

    // DEFINE THE ID OF THIS PARTICULAR POST
    var id = onePost.id;
    eventSection.classList.remove("hide");
    gameSection.classList.remove("hide");
    // CHECK WHETHER OR NOT THE RELEVANT CATEGORY APPLIES TO POST (10 = RETRO & 7 = EVENT) / CATEGORIES ID NUMBER CAN BE CHECKED HERE: http://camelsaidwhat.com/T9WP/wp-json/wp/v2/categories
    // WHAT THIS STATEMENT CHECKS IS THE POSITION OF THE VALUE IN THE ARRAY. IF THE VALUE DOESN'T SHOW UP THE RESULT IS -1. SO THIS STATEMENT ALLOWS US TO GRAB ALL POST WITH THESE TO VALUES ANYWHERE IN THE CATEGORIES ARRAY
    if (
        onePost.categories.indexOf(10) != -1 &&
        onePost.categories.indexOf(7) != -1
    ) {
        const eventTemp = document.querySelector(".event-template").content;
        var eventClone = eventTemp.cloneNode(true);

        // FETCH FUNCTION THAT GRABS THE FEATURED IMG
        fetch(
            "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                onePost.featured_media
        )
            .then(response => response.json())
            .then(showImg);
        // DEFINE DATE
        var date = new Date(onePost.event_date);
        // DEFINE TIME AND SUBTRACT THREE CHARACTERS FROM THE STRING
        var time = onePost.event_time;
        time = time.substring(0, time.length - 3);

        eventClone.querySelector(".event-title").innerHTML =
            onePost.title.rendered;
        eventClone.querySelector(".event-time").textContent = time;
        // ADD toDateString() TO MAKE THE DATE READABLE
        eventClone.querySelector(
            ".event-date"
        ).textContent = date.toDateString();
        eventClone.querySelector(".event-location").textContent =
            onePost.location;
        // MATH.ROUND TO CUT OFF DECIMALS
        eventClone.querySelector(".event-price").textContent =
            Math.round(onePost.price) + " kr";
        eventClone.querySelector(".event-shortdescription").textContent =
            onePost.short_description;
        // SET ID OF THIS POST SO IT CAN BE TARGET INSIDE THE DOM
        eventClone.querySelector("article").setAttribute("id", id);
        // SET ID OF THE FEATURED IMG SO IT CAN BE GRABBED BY A ABOVE IMG JSON FETCH FUNCTION
        eventClone
            .querySelector(".event-img")
            .setAttribute("id", onePost.featured_media);
        eventSection.appendChild(eventClone);

        // APPENDS THE IMG AFTER THE POST HAS BEEN APPENDED / I COULDN'T MAKE IT WORK WITHOUT FIRST APPENDING THE POST SO THIS STEP MIGHT NOT BE BEST PRACTICE BUT IT WORKS
        function showImg(img) {
            document
                .getElementById(img.id)
                .setAttribute("src", img.media_details.sizes.medium.source_url);
            document
                .getElementById(img.id)
                .setAttribute("alt", img.media_details.alt_text);
        }
        // ADD EVENTLISTENER THAT'LL OPEN A NEW PAGE ONLY DISPLAYING THE CLICKED POST
        document.getElementById(id).addEventListener("click", function(target) {
            console.log("worki");
            window.open(url + "/event.html?id=" + id, "_self");
        });
        // ELSE SEE IF GAMES CATEGORY IS APPLIED
    } else if (onePost.categories.indexOf(3) != -1) {
        const gameTemp = document.querySelector(".game-template").content;
        var gameClone = gameTemp.cloneNode(true);

        // FETCH FUNCTION THAT GRABS THE FEATURED IMG
        fetch(
            "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                onePost.featured_media
        )
            .then(response => response.json())
            .then(showImg);

        gameClone.querySelector(".game-title").innerHTML =
            onePost.title.rendered;
        gameClone.querySelector(".game-shortdescription").textContent =
            onePost.short_description;
        // SET ID OF THIS POST SO IT CAN BE TARGET INSIDE THE DOM
        gameClone.querySelector("article").setAttribute("id", id);
        // SET ID OF THE FEATURED IMG SO IT CAN BE GRABBED BY A ABOVE IMG JSON FETCH
        gameClone
            .querySelector(".game-img")
            .setAttribute("id", onePost.featured_media);
        // APPEND POST TO PARENT ELEMENT
        gameSection.appendChild(gameClone);

        // APPENDS THE IMG AFTER THE POST HAS BEEN APPENDED / I COULDN'T MAKE IT WORK WITHOUT FIRST APPENDING THE POST SO THIS STEP MIGHT NOT BE BEST PRACTICE BUT IT WORKS
        function showImg(img) {
            document
                .getElementById(img.id)
                .setAttribute("src", img.media_details.sizes.medium.source_url);
            document
                .getElementById(img.id)
                .setAttribute("alt", img.media_details.alt_text);
        }
        // ADD EVENTLISTENER THAT'LL OPEN A NEW PAGE ONLY DISPLAYING THE CLICKED POST
        document.getElementById(id).addEventListener("click", function(target) {
            window.open(url + "/game.html?id=" + id, "_self");
        });
    }
}

// DISPLAY ALL RELEVANT EVENTS AND NO BOARDGAMES
function showEvents(onePost) {
    var id = onePost.id;
    // RINSE AND REPEAT ABOVE FUNCTION BUT ONLY EVENTS PART OF IT
    eventSection.classList.remove("hide");
    gameSection.classList.add("hide");
    if (
        onePost.categories.indexOf(10) != -1 &&
        onePost.categories.indexOf(7) != -1
    ) {
        // DEFINE DATE
        var date = new Date(onePost.event_date);
        // DEFINE TIME AND SUBTRACT THREE CHARACTERS FROM THE STRING
        var time = onePost.event_time;
        time = time.substring(0, time.length - 3);

        const eventTemp = document.querySelector(".event-template").content;
        var eventClone = eventTemp.cloneNode(true);

        console.log(onePost.categories);
        fetch(
            "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                onePost.featured_media
        )
            .then(response => response.json())
            .then(showImg);

        eventClone.querySelector(".event-title").innerHTML =
            onePost.title.rendered;
        eventClone.querySelector(".event-time").textContent = time;
        eventClone.querySelector(
            ".event-date"
        ).textContent = date.toDateString();
        eventClone.querySelector(".event-location").textContent =
            onePost.location;
        eventClone.querySelector(".event-price").textContent =
            onePost.price + " kr";
        eventClone.querySelector(".event-shortdescription").textContent =
            onePost.short_description;
        eventClone.querySelector("article").setAttribute("id", id);
        eventClone
            .querySelector(".event-img")
            .setAttribute("id", onePost.featured_media);
        eventSection.appendChild(eventClone);

        function showImg(img) {
            document
                .getElementById(img.id)
                .setAttribute("src", img.media_details.sizes.medium.source_url);
            document
                .getElementById(img.id)
                .setAttribute("alt", img.media_details.alt_text);
        }
        document.getElementById(id).addEventListener("click", function(target) {
            console.log("worki");
            window.open(url + "/event.html?id=" + id, "_self");
        });
    }
}

// DISPLAY ALL BOARD GAMES
function showGames(onePost) {
    // RINSE AND REPEAT ABOVE FUNCTION BUT ONLY EVENTS PART OF IT
    var id = onePost.id;
    eventSection.classList.add("hide");
    gameSection.classList.remove("hide");
    if (onePost.categories.indexOf(3) != -1) {
        const gameTemp = document.querySelector(".game-template").content;
        var gameClone = gameTemp.cloneNode(true);

        console.log(onePost.categories);
        fetch(
            "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
                onePost.featured_media
        )
            .then(response => response.json())
            .then(showImg);

        gameClone.querySelector(".game-title").innerHTML =
            onePost.title.rendered;
        gameClone.querySelector(".game-shortdescription").textContent =
            onePost.short_description;
        gameClone
            .querySelector(".game-img")
            .setAttribute("id", onePost.featured_media);
        gameClone.querySelector("article").setAttribute("id", id);
        gameSection.appendChild(gameClone);

        function showImg(img) {
            document
                .getElementById(img.id)
                .setAttribute("src", img.media_details.sizes.medium.source_url);
            document
                .getElementById(img.id)
                .setAttribute("alt", img.media_details.alt_text);
        }
        document.getElementById(id).addEventListener("click", function(target) {
            console.log("worki");
            window.open(url + "/game.html?id=" + id, "_self");
        });
    }
}
