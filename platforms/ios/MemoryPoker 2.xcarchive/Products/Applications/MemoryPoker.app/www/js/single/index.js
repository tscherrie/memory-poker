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
        open_screen("mode_screen");

    },
    // onDevicePause: function() {
    //     this.receivedEvent('pause');
    //     open_screen("mode_screen");
    // },
    //
    // onDeviceResume: function() {
    //     this.receivedEvent('resume');
    //     open_screen("mode_screen");
    // },
    onBackButton: function() {
        // By default, the back button behavior will kill the WebView in Android.
        // We still do it, for testing purposes, but also log the event.
        this.receivedEvent('backbutton');
        open_screen("mode_screen");
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
var memory_number;
var chosen_suit;
var chosen_rank;
var chosen_card;
var startTime = null;
var endTime;

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






  // Singleplayer Screen
  document.getElementById("singleplayer").addEventListener("click", function(){
      close_screen("mode_screen");
      open_screen("level_screen");
      console.log('Hans2');
      console.log('Hans3');
      choose_level_singleplayer();
    });

  // Multiplayer Screen
  document.getElementById("multiplayer").addEventListener("click", function(){
      alert('Coming soon!');
      // close_screen("mode_screen");
      // open_screen("level_screen");
      // choose_level_multiplayer();
    });

  // Howto Tutorial Screen
  document.getElementById("howto").addEventListener("click", function(){
    alert('Coming soon!');
  });
