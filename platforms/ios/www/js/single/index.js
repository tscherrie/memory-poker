// CORDOVA //
var app = {
    // Application Constructor
    initialize: function() {
        // Bind any cordova events here. Common events are:
        // 'deviceready', pause', 'resume', etc.
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        // document.addEventListener('pause', this.onDevicePause.bind(this), false);
        // document.addEventListener('resume', this.onDeviceResume.bind(this), false);
        document.addEventListener('backbutton', this.onBackButton.bind(this), false);

        if (!(window && window.cordova)) { // browser dev
            $timeout(checkHttp, 2000);
        }
      },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        start_new_game();

    },
    // onDevicePause: function() {
    //     this.receivedEvent('pause');
    //     start_new_game();
    // },
    //
    // onDeviceResume: function() {
    //     this.receivedEvent('resume');
    //     start_new_game();
    // },
    onBackButton: function() {
        // By default, the back button behavior will kill the WebView in Android.
        // We still do it, for testing purposes, but also log the event.
        this.receivedEvent('backbutton');
        start_new_game();
        //navigator.app.exitApp();
    },
    receivedEvent: function(id) {
        //appendToLog('AngularJS Received Event: ' + id, true);
    }
};
app.initialize();

// END CORDOVA //





// MEMORY POKER FIRST SCREEN - SINGLE/MULTIPLAYER //

// Store global vars before each game
var number_of_cards_temp;
var number_of_cards;
var chosen_suit;
var chosen_rank;
var chosen_card;
var startTime = null;
var endTime;
var time_seconds;
// keep startup url (in case your app is an SPA with html5 url routing) (to restart App)
var initialHref = window.location.href;

//Number of cards in a cards deck
var deck_size;
var shuffled_deck;
var final_deck;
var snap;


// Show all close every game screen
function open_screen(id) {
  document.getElementById(id).style.display = "block";
}
function close_screen(id) {
  document.getElementById(id).style.display = "none";
}




function start_new_game() {
  // Use SNAP library doc: http://snapsvg.io/docs/
  // load the remember card
  Snap.load("./img/cards-svg/game_mode.svg" , function(card){
    // the group of suits and ranks has an id in the svg file, defined with INKSCAPE
    var solo = card.select("#singleplayer_btn");
    var multi = card.select("#multiplayer_btn");
    var howto = card.select("#howto_btn");
    var options = card.select("#options_btn");


    solo.node.onclick = function () {
      close_screen("mode_screen");
      open_screen("level_screen");
      choose_level_singleplayer();
    };
    multi.node.onclick = function () {
      alert('Coming soon!');
      // close_screen("mode_screen");
      // open_screen("level_screen");
      // choose_level_multiplayer();
    };
    howto.node.onclick = function () {
      // close_screen("mode_screen");
      alert('Coming soon!');
    };
    options.node.onclick = function () {
      // close_screen("mode_screen");
      alert('Coming soon!');
    };
    // snaps grabs the svg element from dom and appends the following code to it
    snapx = Snap("#game_mode_card");
    // TODO don't append each time
    snapx.append(card);

  });
};
