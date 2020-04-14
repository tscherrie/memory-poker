// MEMORY POKER //
// This index.js holds the cient-side / singleplayer game methods. The more "server-like" methods are in serving.js


var socket;
var memory_number;
var chosen_suit;
var chosen_rank;
var startTime = null;
var endTime;


// Multiplayer Socket Connection
function choose_level_multiplayer() {
  var socket_multi = io.connect('http://memory.poker:8731');
  // Things to do whenever connected
  socket_multi.on('connect', function(){
    console.log('Connected');
    socket = socket_multi;
    close_screen("mode_screen");
    open_screen("level_screen");
  });
  // Things to do whenever not connected
  socket_multi.on('disconnect', function(){
    alert('Oh oh, server connection lost! Internet?');
    console.log('Disconnected');
    socket_single.close();
    memory_number = null;
    chosen_suit = null;
    chosen_rank = null;
    startTime = null;
    endTime = null;
    close_screen("level_screen");
    open_screen("mode_screen");
  });

}



// Level_Screen Logic
// Choose number of cards to play with
function cards_num(num) {
  num = 2;                          // FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING
  // Memory number is use in part two of the game to know how many cards to remember.
  memory_number = num;
  socket.emit('new game', num);
  close_screen("level_screen");
  open_screen("game_part_one");
};
// Or choose hardcore mode (cards > 52)
document.getElementById("cards_hardcore").addEventListener("click", function(){
  var num = document.getElementById('card_input').value
  // Exculde small numbers and text etc.
  if (num < 52 || num === undefined) {
    num = 52;
  }
  // Exclude huge numer of cards
  else if (num > 1000000) {
    num = 1000000;
  }
  // Memory number is use in part two of the game to know how many cards to remember.
  memory_number = num;
  socket.emit('new game', num);
  close_screen("level_screen");
  open_screen("game_part_one");
});
// End POPUPS






// NEW GAME - Part 1: Memorize
document.getElementById("card").addEventListener("click", function(){
  console.log('Next card?');
  socket.emit('next card?');
  if (startTime == null) {
    start_timer();
  }
  socket.on('next card', function(msg){
    // Check if last / empty card arrived and the go to game part two
    if (msg == "done") {
      start_between_screen();
    }
    else {
      //send next card to html
      var img_path = "./img/cards-svg/standard_deck/"+msg+".svg";
      document.getElementById("card").src=img_path;
    }
  });
});

// END Part 1: Memorize

function start_between_screen() {
  close_screen("game_part_one");
  open_screen("between_screen");
  document.getElementById("card2").addEventListener("click", function(){
    start_game_part_two();
  });
};

// GAME - Part 2: Remember

// Close first game screen and open the second screen for rememring
function start_game_part_two() {
  close_screen("between_screen");
  open_screen("game_part_two");
  remember_new_card();
};


function remember_new_card() {
  // Use SNAP library doc: http://snapsvg.io/docs/
  // load the remember card
  Snap.load("./img/cards-svg/remember.svg" , function(card){
    // the group of suits and ranks has an id in the svg file, defined with INKSCAPE
    //var suits_group = card.select("#all_colors")
    //var ranks_group = card.select("#all_numbers");
    // SelectAll stores the ids of all suit/rank cards from svg file into set (array)
    var suits = card.selectAll("#hearts, #clubs, #spades, #diamonds");
    var ranks = card.selectAll("#two, #three, #four, #five, #six, #seven, #eight, #nine, #ten, #jack, #queen, #king, #ace");
    // check for each suit in set of suits, if it gets clicked
    suits.forEach(function(suit){
        suit.node.onclick = function () {
          // get back the id of the clicked suit
          chosen_suit = suit.node.id;
          // show all suits again
          suits.forEach(function(co){
            co.attr("fill-opacity", "1");
            //co.attr("visibility", "visible");
          });
          // hide selected suit
          suit.attr("fill-opacity", "0.1");
          //suit.attr("visibility", "hidden");
          // Check if rank and card are chosen and if cards are remaining, then emit to get result and continue
          check_chosen_card();
        };
      });
      // check for each rank in set of ranks, if it gets clicked
      ranks.forEach(function(rank){
          rank.node.onclick = function () {
            // get back the id of the clicked rank
            chosen_rank = rank.node.id;

            // show all ranks again
            ranks.forEach(function(nu){
              nu.attr("fill-opacity", "1");
            });
            // hide selected rank
            rank.attr("fill-opacity", "0.1");
            // Check if rank and card are chosen and if cards are remaining, then emit to get result and continue
            check_chosen_card();
          };
        });
    var card_compare;
    // snaps grabs the svg element from dom and appends the following code to it
    var snap = Snap("#memory_card");
    // TODO don't append each time
    snap.append(card);
    //s.clear();
  });
};

// Check if rank and card are chosen, then emit to get result
function check_chosen_card() {
  // Check if suit and rank are chosen..
  if (chosen_suit && chosen_rank && memory_number > 0) {
    var chosen_card = chosen_rank + "_of_" + chosen_suit;
    chosen_suit = null;
    chosen_rank = null;
    // ..and emit the chosen combination to socket.io
    socket.emit('chosen card', chosen_card);
    console.log('Chosen Card: ' + chosen_card);
    // Get the result BOOlEAN from socket
    socket.on('next result', function(next_result){
      console.log('Next Result: ' + next_result);
      if (!next_result) {
        console.log('Game over!');
        looser();
      }
    });
    // Count down cards in the deck with each card that was remembered
    memory_number -= 1;
    // Go to next card or end the game
    if (memory_number >= 1) {
      // Move on in super class to remember next card
      remember_new_card();
    }
    else {
      // Got to results after last card
      winner();
    }
  }
}


// END - Part 2: Remember


// WINNER or LOOSER
function winner() {
  // Stop counting seconds
  stop_timer();
  console.log('Winner!');
  close_screen("game_part_two");
  open_screen("winner");
  document.getElementById("winner_card").addEventListener("click", function(){
    highscore();
  });
};
function looser() {
  stop_timer();
  console.log('Looser!');
  close_screen("game_part_two");
  open_screen("looser");
  document.getElementById("looser_card").addEventListener("click", function(){
    highscore();
  });
};
// END WINNER or LOOSER


// Highscore

function highscore () {
  close_screen("looser");
  close_screen("winner");
  open_screen("highscore");
};

document.getElementById("newgame").addEventListener("click", function(){
  close_screen("highscore");
  open_screen("mode_screen");
  });



function scoreboard() {
  var name = 'Jeremias';
  var score = '1000';
  var i = 1;
  var userids = "user1;user2;";
  var num = userids.split(";").length;
  document.getElementById("#scoreboard_tbody").append("<tr> <td>" + i + "</td><td><img class='avatar' src=''/>"+name+"</td><td>" + score + "</td></tr>");
};












// Helper functions

function start_timer() {
  startTime = performance.now();
};

function stop_timer() {
  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}


// END MEMORY POKER //
