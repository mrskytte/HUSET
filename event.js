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

var searchPara = new URLSearchParams(window.location.search);
var id = searchPara.get("id");

init();

function init() {
    fetch("http://camelsaidwhat.com/T9WP/wp-json/wp/v2/huset-event/" + id)
        .then(response => response.json())
        .then(showPost);
}

function showPost(post) {
    fetch(
        "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
            post.featured_media
    )
        .then(response => response.json())
        .then(showImg);

    var date = new Date(post.event_date);
    var time = post.event_time;
    time = time.substring(0, time.length - 3);

    document.querySelector(".event-title").innerHTML = post.title.rendered;
    document.querySelector(".event-time").textContent = time;
    document.querySelector(".event-date").textContent = date.toDateString();
    document.querySelector(".event-location").textContent = post.location;
    document.querySelector(".event-price").textContent = Math.round(post.price) + " kr";
    document.querySelector(".event-longdescription").innerHTML =
        post.content.rendered;
    document.querySelector("article").setAttribute("id", id);
    document
        .querySelector(".event-img")
        .setAttribute("id", post.featured_media);

    function showImg(img) {
        document
            .getElementById(img.id)
            .setAttribute("src", img.media_details.sizes.medium.source_url);
        document
            .getElementById(img.id)
            .setAttribute("alt", img.media_details.alt_text);
    }
}
