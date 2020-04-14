var cards = ["queen_of_spades", "queen_of_hearts", "queen_of_diamonds", "queen_of_clubs", "king_of_spades", "king_of_hearts", "king_of_diamonds", "king_of_clubs", "jack_of_spades", "jack_of_hearts", "jack_of_diamonds", "jack_of_clubs", "ace_of_spades", "ace_of_hearts", "ace_of_diamonds", "ace_of_clubs", "ten_of_spades", "ten_of_hearts", "ten_of_diamonds", "ten_of_clubs", "nine_of_spades", "nine_of_hearts", "nine_of_diamonds", "nine_of_clubs", "eight_of_spades", "eight_of_hearts", "eight_of_diamonds", "eight_of_clubs", "seven_of_spades", "seven_of_hearts", "seven_of_diamonds", "seven_of_clubs", "six_of_spades", "six_of_hearts", "six_of_diamonds", "six_of_clubs", "five_of_spades", "five_of_hearts", "five_of_diamonds", "five_of_clubs", "four_of_spades", "four_of_hearts", "four_of_diamonds", "four_of_clubs", "three_of_spades", "three_of_hearts", "three_of_diamonds", "three_of_clubs", "two_of_spades", "two_of_hearts", "two_of_diamonds", "two_of_clubs"];


// Create new socket but don't serve html (local client)
var port = 8731
var server = require('http').createServer();
const io = require('socket.io')(server, {
  path: '/',
  serveClient: false,
});


//Number of cards in a car deck
var cards_num;
var shuffled_deck;
var final_deck;

// Establish connection?
io.on('connection', function(socket){

  socket.on('error', (err) => {
      console.log('Socket.io: error: ' + err);
  });

  socket.on('close', () => {
      console.log('Socket.io: close ');
  });

  socket.on('disconnecting', (reason) => {
      console.log('Socket.io: disconnecting. Reason: ' + reason);
  });

  socket.on('disconnect', (reason) => {
      console.log('Socket.io: disconnected. Reason: ' + reason);
      socket.removeAllListeners();
  });

  // NEW GAME - Part 1: Memorize
  //Check for incoming user connection and if a new game on LEVEL SCREEN was startet by picking a number of cards to play with
  console.log('a user connected');
  socket.on('new game', function(num){
    console.log('new game - number of cards: ' + num);
    cards_num = num;

    // Use shuffle algorithm and slice of the last cards if user chose to play with less than 52
    if (cards_num <= 52) {
      shuffled_deck = shuffleArray(cards);
      shuffled_deck = shuffled_deck.slice(0, cards_num);
    }
    // Or shuffle and then use more than 1 deck
    else {
      // Round up num of decks
      var decks_num = Math.ceil(cards_num / 52);
      let multi_shuffled_decks = [];
      for(var i=0; i < decks_num; i++){
        shuffled_deck = shuffleArray(cards);
        // Add decks to each other after shuffling each, to form more decks in a row
        multi_shuffled_decks = multi_shuffled_decks.concat(shuffled_deck);
      }
      shuffled_deck = multi_shuffled_decks;
      // Shorten the multi deck and keep the num of cards needed
      shuffled_deck = shuffled_deck.slice(0, cards_num);
      console.log('Up rounded number of Decks: '+decks_num+' for '+cards_num+ ' cards.')
    }
    console.log("Shuffled deck: "+shuffled_deck);
    // Create a final deck to remove cards from. The shuffled deck stays as original for later comparison
    // The contact only makes the final_deck var independent from shuffled_deck (newb-style)
    final_deck = shuffled_deck.concat();

  });
  // Get new card request from user
  socket.on('next card?', function(){
    // Check if last card is played
    if (final_deck === undefined || final_deck.length == 0) {
      next_card = "done";
    }
    // Draw the next card from the deck and send it
    else {
      // Get next card in deck
      next_card = final_deck[0];
      // Remove this card from deck

      final_deck.shift();
    }
      io.emit('next card', next_card);
      console.log('Next Card: ' + next_card)
  });

  // END Part 1: Memorize
  // GAME - Part 2: Remember
  socket.on('chosen card', function(chosen_card){
    // Compare memorized and remembered card

    if (chosen_card == shuffled_deck[0]) {
      result = true;
      // Remove this card from deck
      shuffled_deck.shift();
    }
    else {
      result = false;
    }
    io.emit('next result', result);
    console.log('Next Result: ' + result)
  });

  // END - Part 2: Remember
});











// Start Server and helper functions
server.listen(port, function () {
    console.log('Webserver läuft und hört auf Port %d', port);
});



/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
