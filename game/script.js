// Add your JavaScript code here
const messagew = [
    "Welcome to the game! We're glad you're here!",
    "Thanks for joining us, let's have some fun!",
    "We're excited to have you play with us!",
    "Thanks for choosing to play with us, let's get started!",
    "We're glad you're here, let's have a great time playing together!"
];
const message0 = [
    "Don't give up, you're almost there!",
    "You can do it, just keep trying!",
    "Believe in yourself and your abilities!",
    "Every mistake is a learning opportunity, keep pushing forward!",
    "You're stronger than you think, keep pushing through!"
];
const message1 = [
    "You're never going to get it right!",
    "You're not smart enough for this game!",
    "I knew you couldn't do it!",
    "You're just wasting your time!",
    "You'll never be good enough!"
];
const message2 = [
    "You're too slow!",
    "You're not cut out for this!",
    "You'll never be able to compete with the top players!",
    "You're just a failure!",
    "You'll never be able to beat the top scores!"
];
const message3 = [
    "You're not worthy of being on the leaderboard!",
    "You're not even close to being good enough!",
    "You'll never be able to achieve greatness!",
    "You don't have what it takes to succeed!",
    "You'll never be able to compete with the best!"
];
const message4 = [
    "You're just a disappointment!",
    "You'll never be able to measure up to the top players!",
    "You're not talented enough for this game!",
    "You're a waste of space on the leaderboard!",
    "You'll never be able to beat the top scores!",
];
const message5 = [
    "You're not even worth the time it takes to play this game!",
    "You're not good enough to be on the leaderboard!",
    "You're just a disappointment to everyone!",
    "You're not talented enough to succeed in this game!",
    "You'll never be able to compete with the top players!"
];
const message6 = [
    "You're not worthy of even trying this game!",
    "You'll never be able to beat the top scores!",
    "You're just a failure in every aspect of life!",
    "You're not good enough to be on the leaderboard!",
    "You'll never be able to achieve greatness in this game!"
];
const message7 = [
    "You're a complete waste of time and space!",
    "You're not even close to being good enough for this game!",
    "You'll never be able to compete with the top players!",
    "You're a complete disappointment to everyone!",
    "You're not even worth the time it takes to play this game!"
];
const message8 = [
    "You're just a complete failure at everything you do!",
    "You're not even worth the time it takes to play this game!",
    "You're not good enough for this game, or any game for that matter!",
    "You'll never be able to achieve greatness in this game, or any game!",
    "You're a complete disappointment and failure in every aspect of life!"
];
const message9 = [
    "You're just a complete and total waste of space on this planet!",
    "You're not even worth the time it takes to play this game!",
    "You'll never be able to compete with the top players, or achieve greatness in any aspect of life!",
    "You're just a complete and total failure at everything you do!",
    "You're not even worth the breath it takes to speak your name!"
];
const message10 = [
    "You're a complete and total waste of space and oxygen on this planet!",
    "You're not even worth the time it takes to play this game, or the breath it takes to speak your name!",
    "You'll never be able to compete with the top players, or achieve greatness in any aspect of life!",
    "You're just a complete and total failure at everything you do, and always will be!",
    "You're not even worth the dirt on the bottom of my shoes!"
];
const messagess = [
    "Congratulations, you did it!",
    "Well done, you guessed the correct number!",
    "Great job, you're a pro at this game!",
    "Way to go, you figured it out!",
    "Awesome, you guessed the correct number!",
];
// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDkg1JQkas86H86YbvBQsq1VvyxTUbY5iY",
    authDomain: "game-7a573.firebaseapp.com",
    projectId: "game-7a573",
    storageBucket: "game-7a573.appspot.com",
    messagingSenderId: "562167920633",
    appId: "1:562167920633:web:1ba5e9fedad9d39fc12f28",
    measurementId: "G-G3GMJJ3RWC"
});

var a = [0, 0, 0, 0, 0];
var ab = 0;

let loadingIndex = 0;
let timerInterval1 = null;

function showLoading() {
    const loadingText = ['', '.', '..', '...', '....', '.....'];
    const loadingElement = document.getElementById('loading');
    loadingElement.textContent = loadingText[loadingIndex];
    loadingIndex = (loadingIndex + 1) % loadingText.length;
}

timerInterval1 = setInterval(showLoading, 500);

var playersRef = firebase.database().ref("guess");
const playersRe = firebase.database();
playersRef.on('value', (snapshot) => {
    const data1 = snapshot.child("1").val();
    const data2 = snapshot.child("2").val();
    const data3 = snapshot.child("3").val();
    const data4 = snapshot.child("4").val();
    const data5 = snapshot.child("5").val();
    document.getElementById("1n").innerHTML = data1.name;
    document.getElementById("1i").innerHTML = data1.instagramId;
    document.getElementById("1t").innerHTML = data1.time;
    document.getElementById("2n").innerHTML = data2.name;
    document.getElementById("2i").innerHTML = data2.instagramId;
    document.getElementById("2t").innerHTML = data2.time;
    document.getElementById("3n").innerHTML = data3.name;
    document.getElementById("3i").innerHTML = data3.instagramId;
    document.getElementById("3t").innerHTML = data3.time;
    document.getElementById("4n").innerHTML = data4.name;
    document.getElementById("4i").innerHTML = data4.instagramId;
    document.getElementById("4t").innerHTML = data4.time;
    document.getElementById("5n").innerHTML = data5.name;
    document.getElementById("5i").innerHTML = data5.instagramId;
    document.getElementById("5t").innerHTML = data5.time;
    console.log(data1.instagramId);
    a[0] = parseFloat(data1.time);
    a[1] = parseFloat(data2.time);
    a[2] = parseFloat(data3.time);
    a[3] = parseFloat(data4.time);
    a[4] = parseFloat(data5.time);
    document.getElementById("startGameButton").disabled = false;
    document.getElementById("startGameButton").innerText = "Start Game";
    console.log(a);
});

// Generate a random number between -100000 and 100000
const randomNumber = Math.floor(Math.random() * 100001);
console.log(randomNumber);


// Initialize player rank variable
let playerRank = 0;

// Initialize player form and WhatsApp button elements
const playerForm = document.getElementById('playerForm');
const whatsappButton = document.getElementById('whatsappButton');

// Initialize timer and timer interval variables
let timer = 0;
let timerInterval = null;
// Initialize timer element
const timerElement = document.getElementById('timer');

// Initialize feedback boxes
const lessThanBox = document.getElementById('lessThan');
const equalToBox = document.getElementById('equalTo');
const greaterThanBox = document.getElementById('greaterThan');

// Check guess and update feedback boxes
function checkGuess() {
    if (ab == 0) {
        timerInterval = setInterval(function () {
            timer += 100;
            timerElement.innerHTML = timer / 1000;
            if (timer == 100) {
                document.getElementById("witty").innerHTML = messagew[Math.floor(Math.random() * 5)];
            }
            if (timer == 30000) {
                document.getElementById("witty").innerHTML = message0[Math.floor(Math.random() * 5)];
            }
            if (timer == 60000) {
                document.getElementById("witty").innerHTML = message1[Math.floor(Math.random() * 5)];
            }
            if (timer == 80000) {
                document.getElementById("witty").innerHTML = message2[Math.floor(Math.random() * 5)];
            }
            if (timer == 100000) {
                document.getElementById("witty").innerHTML = message3[Math.floor(Math.random() * 5)];
            }
            if (timer == 120000) {
                document.getElementById("witty").innerHTML = message4[Math.floor(Math.random() * 5)];
            }
            if (timer == 140000) {
                document.getElementById("witty").innerHTML = message5[Math.floor(Math.random() * 5)];
            }
            if (timer == 160000) {
                document.getElementById("witty").innerHTML = message6[Math.floor(Math.random() * 5)];
            }
            if (timer == 180000) {
                document.getElementById("witty").innerHTML = message7[Math.floor(Math.random() * 5)];
            }
            if (timer == 200000) {
                document.getElementById("witty").innerHTML = message8[Math.floor(Math.random() * 5)];
            }
            if (timer == 220000) {
                document.getElementById("witty").innerHTML = message9[Math.floor(Math.random() * 5)];
            }
            if (timer == 240000) {
                document.getElementById("witty").innerHTML = message10[Math.floor(Math.random() * 5)];
            }
        }, 100); // Update timer interval to 1 millisecond
        ab++;
    }
    const guess = document.getElementById('guessInput').value;
    lessThanBox.style.backgroundColor = "#FFEBEE";
    equalToBox.style.backgroundColor = "#E8F5E9";
    greaterThanBox.style.backgroundColor = "#FFEBEE";
    if (guess === '') {
        lessThanBox.style.backgroundColor = "#FFEBEE";
        equalToBox.style.backgroundColor = "#E8F5E9";
        greaterThanBox.style.backgroundColor = "#FFEBEE";
    } else if (guess < randomNumber) {
        lessThanBox.style.backgroundColor = "#E53935";
        equalToBox.style.backgroundColor = "#E8F5E9";
        greaterThanBox.style.backgroundColor = "#FFEBEE";
    } else if (guess > randomNumber) {
        lessThanBox.style.backgroundColor = "#FFEBEE";
        equalToBox.style.backgroundColor = "#E8F5E9";
        greaterThanBox.style.backgroundColor = "#E53935";
    } else if (guess == randomNumber) {
        // Player has guessed the correct number
        document.getElementById("guessInput").disabled = true;
        lessThanBox.style.backgroundColor = "#FFEBEE";
        equalToBox.style.backgroundColor = "#43A047";
        greaterThanBox.style.backgroundColor = "#FFEBEE";
        clearInterval(timerInterval);
        clearInterval(timerInterval1);
        document.getElementById("loading").innerHTML="🎉";
        document.getElementById("witty").innerHTML = messagess[Math.floor(Math.random() * 5)];

        //playerRank = setPlayerRank(timer);
        // Player has made it onto the leaderboard
        if (parseFloat(document.getElementById('timer').innerText) < a[4])
            playerForm.style.display = 'block';
        whatsappButton.style.display = 'block';
    }
}


// Handle player form submission
playerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    const instagramId = document.getElementById('instagramInput').value;
    const time = parseFloat(document.getElementById('timer').innerText);
    var refr = "1";
    if (time < a[0]) {
        refr = "1";
    }
    else if (time < a[1]) {
        refr = "2";
    }
    else if (time < a[2]) {
        refr = "3";
    }
    else if (time < a[3]) {
        refr = "4";
    }
    else if (time < a[4]) {
        refr = "5";
    }
    else {
        return 0;
    }
    const player = {
        name: name,
        instagramId: instagramId,
        time: time
    };
    // Write player to database
    playersRe.ref('guess/' + refr).set(player);
    playerForm.reset();
    playerForm.style.display = 'none';
    whatsappButton.style.display = 'none';
});

// Handle WhatsApp button click
whatsappButton.addEventListener('click', function () {
    // Add code to open a WhatsApp chat with a message containing the player's rank on the leaderboard
});

function gamecontain() {
    document.getElementById("gamecontainer").style.display = "block";
    document.getElementById("startGameButton").style.display = "none";
    document.getElementById("REstartGameButton").style.display = "block";

}

