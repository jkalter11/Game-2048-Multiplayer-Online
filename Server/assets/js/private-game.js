// /*
//  * ----------------------------------
//  *           PRIVATE GAME
//  * ----------------------------------
//  * */
//
// // Play button
// $(".play-button").click(function () {
//   socket.post('/v1/player/private-start-game', {start: room_private});
// });
// // end
//
// // Listen realtime
// socket.on(room_private, function (event) {
//   if (event && event.gameover) {
//
//     if (event.user.id.toString() === thisPlayer) {
//       alert('You lose, Please wait your friend start game!!!');
//     } else {
//       $('#player-1 .game-message').addClass('game-over');
//       $('#player-1 .game-message p').text('Lose');
//       $('.vs').css({display: 'none'});
//       statusGame = 0;
//       $('.play-button').show();
//
//       alert('You Win !!!');
//     }
//
//     return;
//   }
//   if (event && event.startgame) {
//
//     statusGame = 1;
//     $('.vs').css({display: 'block'});
//     $('#player-1 .game-message').removeClass('game-over');
//     $('#player-1 .game-message p').text('');
//     loadGame.restart();
//   } else {
//     // Create user => update user's data;
//     if (private_player.length === 0) {
//       private_player.push(event);
//     } else {
//       var indexPlayer = index(event.user.id, private_player);
//       if (indexPlayer === -1) {
//         private_player.push(event)
//       } else {
//         private_player[indexPlayer] = event;
//       }
//     }
//     // end
//
//     // Show button play only for owner, hide for all
//     if (owner === private_player[0].user.id.toString() && statusGame == 0) {
//       $('.play-button').show();
//     } else {
//       $('.play-button').hide();
//     }
//     // end
//
//     // Play game
//     if (private_player[1]) {
//       $("#player-1 .title").text(private_player[1].user.name);
//       if (statusGame == 1) {
//         new OtherManager(4, HTMLActuator, private_player[1], '#player-1');
//       }
//     }
//   }
//
//
// });
