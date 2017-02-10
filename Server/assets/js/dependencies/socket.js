/**
 * Created by Administrator on 6/4/16.
 */
var host = 'http://128.199.211.233:6789';
//var host = 'http://demo.ohmyidol.com:6789';
var socket = io.sails.connect(host);


/*
* Detect Mobile
* */
var md = new MobileDetect(window.navigator.userAgent);
var isMobile = false;
if (md.os() !== null) {
  isMobile = true;
}
console.log( "isMobile:::", isMobile ); // false

// Stream data
function stream(data, user, room) {
  socket.post('/v1/player/stream', {data: data, user: user, currentRom: room})
}
/*
 * Game Over
 * */
function gameOver() {
  socket.post('/v1/player/private-game-over');
}

$('document').ready(function () {

  // Defined variables
  var idPlayer = $('#idPlayer').val();   // Người
  var idGame = $('#idGame').val();
  var namePlayer = $('#namePlayer').val();
  var owner = $('#thisOwner').val();
  var gameRoom, room;
  var UserGlobal = {
    name: namePlayer,
    id: idPlayer
  };

  var private_player = [];
  var room_private;
  var statusGame = 0;

  /*
  * Show use guide block
  * */
  if ($('#createAccount').hasClass('block')) {
    swal({
      title: "",
      text: "<b>Use the keys or swipe to play.</b>",
      confirmButtonText: "Got it !",
      imageSize: "270x150",
      html: true,
      imageUrl: "../images/keys.png"
    });
  }


  /*
  * Socket
  *
  * */
  socket.on('connect', function () {

    if ($('#createAccount').hasClass('none')) {
      if ($('#iGame').hasClass('pub-game')) {
        room = 'game-' + $('#roomGame').val();
        gameRoom = 'game-' + $('#roomGame').val();
      } else {
        room = $('#thisRoom').val();
      };

      // join room game
      socket.post('/v1/player/join', {room: room}, function (event) {
        console.log("Join room game:::", event);
      });

      if (room === gameRoom) {
        new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, "#player", UserGlobal, room);
      } else {
        // console.log("- Load game private.")
        var loadGame = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, "#player-owner");
      }
    } else {
      // console.log("-isLogin");
      return;
    }

    // GET INDEX PLAYER
    var index = function (id, items) {
      var i = 0;
      var len = items.length;
      for (i = 0; i < len; i++) {
        if (id === items[i].user.id) {
          return i;
        }
      }
      return -1;
    };


    // Load ranking
    /*
     * ----------------------------------
     *           PUBLISH GAME
     * ----------------------------------
     * */

    var current_players = [];
    if(!isMobile) {
      socket.on(gameRoom, function (event) {
        // if game over
        if (event && event.gameover) {
          return;
        }

        if (current_players.length === 0) {
          current_players.push(event);
        } else {
          if (event && event.user && event.user.id) {

            var indexPlayer = index(event.user.id, current_players);
            if (event.user.id === idPlayer) {
              $('.rank-container').text(indexPlayer + 1 + " of " + current_players.length);
            }
          }

          if (indexPlayer === -1) {
            current_players.push(event)
          } else {
            current_players[indexPlayer] = event;
          }
        }

        current_players.sort(function (a, b) {
          return b.score - a.score;
        });

        // BIND PLAYER TO HTML

        $('.board-player ul').html('');
        current_players.forEach(function (value, key) {
          if (key < 20) {
            $('.board-player ul').append("<li class='player-" + value.user.id + "'> <b>" + value.score + "</b> <span>" + value.user.name + "</span></li>");
          }
          if (key < 6) {
            $("#player-" + key + " .title").text(value.user.name);
            new OtherManager(4, HTMLActuator, value, "#player-" + key);
          }

        })
      });

      socket.on('disconnect', function () {
        //  console.log("Disconnect server - ROOM:::", gameRoom);
        socket.off(gameRoom);
      });
    }


  });


  /*
  *
  * For Advertisment
  *
  * */
  function countPlayForAds() {
    if (typeof(Storage) !== "undefined") {
      // console.log("Play count will show ads:::", localStorage.getItem('plays'));
      // Code for localStorage/sessionStorage.
      if (localStorage.getItem('plays') === null) {
        localStorage.setItem('plays', '0');
        return;
      }
      localStorage.setItem("plays", parseInt(localStorage.getItem('plays')) + 1);
    } else {
      // Sorry! No Web Storage support..
    }
  }

  if (parseInt(localStorage.getItem('plays')) > 4) {
    // $('.ads')
    //   .css({'display': 'block'})
    //   .append('<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-8928671125395435" data-ad-slot="9708174421"></ins>');
    localStorage.setItem('plays', '0');
  }
  function clickAds() {
    $('.ads').css({'display': 'none'});
  }


  $('.restart-button, .retry-button').click(function () {
    countPlayForAds();
    socket.post('/v1//player/play-game', {id: idGame});
  });
  $('.close').click(function () {
    clickAds();
  })
  countPlayForAds();


  /*
  * Social
  * */
  $( ".fb-comments" ).contents().find( "span" ).css( "color", "#fff" );
});
