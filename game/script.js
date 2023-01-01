// Add your JavaScript code here

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
    // Add player's data to the CSV file and update the leaderboard

    // Add code to write player data to the CSV file with the time in milliseconds
    // Add code to update the leaderboard table with the new player's data
    // Reset the player form and hide the WhatsApp button
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
    timerInterval = setInterval(function () {
        timer += 100;
        timerElement.innerHTML = timer / 1000;
    }, 100); // Update timer interval to 1 millisecond
}
