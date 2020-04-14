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


// Show all close every game screen
function open_screen(id) {
  document.getElementById(id).style.display = "block";
}
function close_screen(id) {
  document.getElementById(id).style.display = "none";
}



function start_new_game() {
  open_screen("mode_screen");

  // Singleplayer Screen
  document.getElementById("singleplayer").addEventListener("click", function(){
      close_screen("mode_screen");
      open_screen("level_screen");
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

};
