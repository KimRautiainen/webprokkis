'use strict';


const url = 'http://localhost:3000'; // change url when uploading to server

let tinderContainer = document.querySelector('.tinder');
let allCards = document.querySelectorAll('.tinder--card');
let nope = document.getElementById('nope');
let love = document.getElementById('love');

let kayttaja = document.getElementById("kayttaja");
const kirjautunut = JSON.parse(sessionStorage.getItem('user'));

if (!kirjautunut) {
    location.href = "/registration.html"
}
kayttaja.innerHTML = kirjautunut.etunimi;

document.getElementById("logo").onclick = function () {
    location.href = "/home.html";
};



const createUserCards = (users) => {
    console.log(users);
    const ul = document.querySelector('.tinder--cards');

    users.forEach((user) => {
        // create li with DOM methods
        const li = document.createElement('li');
        li.classList.add('tinder--card');

        // Store the user ID as a data attribute on the card element
        const dataSet = li.dataset.userId = user['y-tunnus']
        console.log(dataSet);

        const img = document.createElement('img');
        img.src = url + '/uploads/' + user.filename;
        img.alt = user.nimi;
        img.classList.add('resp');

        const h3 = document.createElement('h3');
        h3.innerHTML = user.nimi;


        const p = document.createElement('p');
        p.innerHTML = user.kuvaus;


        li.appendChild(img);
        li.appendChild(h3);
        li.appendChild(p);
        ul.appendChild(li);

        // Add swipe listeners to the card
        let hammertime = new Hammer(li);

        hammertime.on('pan', function (event){
            li.classList.add('moving');
        });

        hammertime.on('pan', function (event){
            if (event.deltaX === 0) return;
            if (event.center.x === 0 && event.center.y === 0) return;

            tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
            tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

            let xMulti = event.deltaX * 0.03;
            let yMulti = event.deltaY / 80;
            let rotate = xMulti * yMulti;

            event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate (' + rotate + 'deg)';
        });

        hammertime.on('panend', function (event){
            li.classList.remove('moving');
            tinderContainer.classList.remove('tinder_love');
            tinderContainer.classList.remove('tinder_nope');

            let moveOutWidth = document.body.clientWidth;
            let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

            li.classList.toggle('removed', !keep);

            if (keep){
                event.target.style.transform = '';
            } else {
                let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
                let toX = event.deltaX > 0 ? endX : -endX;
                let endY = Math.abs(event.velocityY) * moveOutWidth;
                let toY = event.deltaY > 0 ? endY : -endY;
                let xMulti = event.deltaX * 0.03;
                let yMulti = event.deltaY / 80;
                let rotate = xMulti * yMulti;

                event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
                initCards();
            }
        });
    });
};
const getUser = async () => { // Define an asynchronous function getUser
    const token = sessionStorage.getItem('token'); // Retrieve the token from the session storage
    try {
        const response = await fetch(url + '/employer', { // Send a GET request to the server to retrieve employer users
            headers: {
                'Authorization': 'Bearer ' + token // Include the token in the request headers
            }
        });
        console.log(response); // Log the response object to the console
        const users = await response.json(); // Parse the response body as JSON and store the resulting array of users in a variable
        console.log(users); // Log the users array to the console
        createUserCards(users); // Call a function to create HTML cards for each user in the array
    } catch (error) { // Catch any errors that occur during the request or response handling
        console.log(error.message); // Log the error message to the console
    }
};

getUser(); // Call the getUser function to retrieve and display the employer users.





function initCards(card, index) {

        let newCards = document.querySelectorAll('.tinder--card:not(.removed)');
//console.log(users.length);
        newCards.forEach(function (card, index) {


            card.style.zIndex = allCards.length - index;
            card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
            card.style.opacity = (10 - index) / 10;


        });

        tinderContainer.classList.add('loaded');
    }


initCards();

allCards.forEach(function (el){

    let hammertime = new Hammer(el);

    hammertime.on('pan', function (event){
        el.classList.add('moving');
    });

    hammertime.on('pan', function (event){
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
        tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

        let xMulti = event.deltaX * 0.03;
        let yMulti = event.deltaY / 80;
        let rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate (' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event){
        el.classList.remove('moving');
        tinderContainer.classList.remove('tinder_love');
        tinderContainer.classList.remove('tinder_nope');

        let moveOutWidth = document.body.clientWidth;
        let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        event.target.classList.toggle('removed', !keep);

        if (keep){
            event.target.style.transform = '';
        } else {
            let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
            let toX = event.deltaX > 0 ? endX : -endX;
            let endY = Math.abs(event.velocityY) * moveOutWidth;
            let toY = event.deltaY > 0 ? endY : -endY;
            let xMulti = event.deltaX * 0.03;
            let yMulti = event.deltaY / 80;
            let rotate = xMulti * yMulti;

            event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
            initCards();
         }
    });
});

function createButtonListener(love) {
    return async function (event) {
        let cards = document.querySelectorAll('.tinder--card:not(.removed)');
        let moveOutWidth = document.body.clientWidth * 1.5;

        if (!cards.length) return false;

        let card = cards[0];

        card.classList.add('removed');

        if (love) {
            card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';

            try {
                const token = sessionStorage.getItem('token'); // Get the user's token from session storage or wherever you store it
                const userId = card.dataset.userId; // Get y-tunnus from dataset

                const response = await fetch('http://localhost:3000/createMatch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token // Include the user's token in the request headers for authentication
                    },
                    body: JSON.stringify({ userId }) // Send the user ID of the matched user in the request body
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.message); // Match created successfully message from the server
                    // You can perform any other UI updates or actions here upon successful match creation
                } else {
                    const errorData = await response.json();
                    console.log(errorData.message); // Error message from the server
                    // Handle any error cases or show error messages to the user
                }
            } catch (error) {
                console.error('Error creating match:', error.message);
                // Handle any fetch or other errors that might occur
            }
        } else {
            card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
        }

        initCards();

        event.preventDefault();
    };
}

let nopeListener = createButtonListener(false);
let loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-x');
    navbar.classList.toggle('open');
}
