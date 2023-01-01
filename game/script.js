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

  const playersRef = firebase.database();
  playersRef.on('value', (snapshot) => {
    const data1 = snapshot.child("1").val();
    const data2 = snapshot.child("2").val();
    const data3 = snapshot.child("3").val();
    const data4 = snapshot.child("4").val();
    const data5 = snapshot.child("5").val();
    document.getElementById("1i").innerHTML=data1.instagramId;
  });

// Generate a random number between -100000 and 100000
const randomNumber = Math.floor(Math.random() * 100001);
alert(randomNumber);


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

// Start timer when start game button is clicked
document.getElementById('startGameButton').addEventListener('click', function () {

    timerInterval = setInterval(function () {
        timer += 100;
        timerElement.innerHTML = timer / 1000;
    }, 100); // Update timer interval to 1 millisecond
});

// Initialize feedback boxes
const lessThanBox = document.getElementById('lessThan');
const equalToBox = document.getElementById('equalTo');
const greaterThanBox = document.getElementById('greaterThan');

// Check guess and update feedback boxes
function checkGuess() {
    const guess = document.getElementById('guessInput').value;
    lessThanBox.classList.remove('red');
    equalToBox.classList.remove('green');
    greaterThanBox.classList.remove('red');
    if (guess === '') {
        lessThanBox.classList.remove('red');
        equalToBox.classList.remove('green');
        greaterThanBox.classList.remove('red');
    } else if (guess < randomNumber) {
        lessThanBox.classList.add('red');
        equalToBox.classList.remove('green');
        greaterThanBox.classList.remove('red');
    } else if (guess > randomNumber) {
        lessThanBox.classList.remove('red');
        equalToBox.classList.remove('green');
        greaterThanBox.classList.add('red');
    } else if (guess == randomNumber) {
        // Player has guessed the correct number
        lessThanBox.classList.remove('red');
        equalToBox.classList.add('green');
        greaterThanBox.classList.remove('red');
        clearInterval(timerInterval);

        //playerRank = setPlayerRank(timer);
        // Player has made it onto the leaderboard
        playerForm.style.display = 'block';
        whatsappButton.style.display = 'block';
    }
}


// Handle player form submission
playerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    const instagramId = document.getElementById('instagramInput').value;
    const time = parseInt(document.getElementById('timer').innerText);
    const player = {
        name: name,
        instagramId: instagramId,
        time: time
      };
      // Write player to database
  playersRef.set(player);
    alert("saved")

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
