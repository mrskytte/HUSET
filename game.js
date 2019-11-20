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
    fetch("http://camelsaidwhat.com/T9WP/wp-json/wp/v2/huset-event/" + id + "?_embed")
        .then(response => response.json())
        .then(showPost);
}

function showPost(post) {
    var tagCount = post._embedded["wp:term"][1].length - 1;
    while (tagCount != -1){
        tagLink = 'index.html?tag=' + post._embedded["wp:term"][1][tagCount].id;
        var listTag = document.createElement("li");
        listTag.innerHTML = '<a href=""></a>';
        listTag.querySelector("a").setAttribute("href", tagLink);
        listTag.querySelector("a").textContent = post._embedded["wp:term"][1][tagCount].name;
        document.querySelector(".tags").appendChild(listTag)
        tagCount --;

    }
    console.log(post.categories);
    fetch(
        "http://camelsaidwhat.com/T9WP/wp-json/wp/v2/media/" +
            post.featured_media
    )
        .then(response => response.json())
        .then(showImg);

    document.querySelector(".game-title").innerHTML = post.title.rendered;
    document.querySelector(".game-longdescription").innerHTML =
        post.content.rendered;
    document.querySelector(".game-img").setAttribute("id", post.featured_media);
    document.querySelector("article").setAttribute("id", id);
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
