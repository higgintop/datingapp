/**************************************************************************************
Logic for:
  - index.html page
      - login Form
      - register form
      - click event for loginRevealBtn, registerRevealBtn
      - click event for loginBtn, registerBtn
***************************************************************************************/

'use strict'

var FIREBASE_URL = 'https://datingappcohort8.firebaseio.com';
var fb = new Firebase(FIREBASE_URL);
var usersFbUrl;
var usersFb;
var token;

// initially login and register forms are hidden
$('.loginForm').hide();
$('.registerForm').hide();


// LoginRevealBtn - toggle the visibility of login form
$('body').on('click', '#loginRevealBtn', function(event) {
  $('.loginForm').toggle();
});


// RegisterRevealBtn - toggle the visibility of register form
$('body').on('click', '#registerRevealBtn', function(event) {
 $('.registerForm').toggle();
});


// Log in button
$('#loginBtn').on('click', function(event) {
  event.preventDefault();

  var email = $('#logInEmail').val();
  var password = $('#logInPassword').val();

  // authenticate email and password
  fb.authWithPassword({email: email, password: password}, function(err, auth){
    if(err){
      alert("invalid login");
    } else{
      location.reload(true);
    }
  });
});

// Register button
$('#registerBtn').on('click', function(event) {
  event.preventDefault();

  var email = $('#registerEmail').val();
  var password = $('#registerPassword').val();

  // get values from input fields
  var name = $('#name').val();
  var gender = $('input[name=gender]:checked').val();
  var description = $('textarea').val();


  // create new user with email and password
  fb.createUser({email: email, password: password}, function(err, auth){
    if(!err){
      //log in
      fb.authWithPassword({email: email, password: password}, function(err, auth){
          // post to firebase
          var url = FIREBASE_URL + '/users/' + fb.getAuth().uid + '/profile.json';
          var jsonifiedData = JSON.stringify({name: name, gender: gender, desc: description});
          $.post(url, jsonifiedData, function (res) {
            // refresh once post returns
            location.reload(true);
          });
          
      });
    } else {
      alert("User already exists");
      location.reload(true);
    }
  });
  
});


$('#logout').on('click', function() {
  // execute unauth
  fb.unauth();
  //refresh the page
  location.reload(true);
});



/*******************************************
  Logic for logging in or registering
*******************************************/
if(fb.getAuth()) {
  // if user is logged in, remove the login div from dom
  $('.loginArea').remove();
  $('.profileContainer').toggleClass('hidden');
  $('.matchesContainer').toggleClass('hidden');
  $('.undecidedContainer').toggleClass('hidden');
  $('#logout').toggleClass('hidden');
  
  // do a GET to get the profile info
  usersFb = fb.child('users/' + fb.getAuth().uid + '/profile');
  
  usersFb.once('value', function (res){
    var data = res.val();
    Object.keys(data).forEach(function (uuid) {
      addProfileInfo(uuid, data[uuid]);
    });
  })

}

function addProfileInfo(uuid, data) {
  var $profileContainer = $('.profileContainer');
  var $infoContainer = $('<div></div>');
  var $nameDiv = $('<div> Name: ' + data.name + '</div>');
  var $genderDiv = $('<div> Gender: ' + data.gender +'</div>');
  var $descDiv = $('<div> About Me: ' + data.desc + '</div>');
  $infoContainer.append($nameDiv);
  $infoContainer.append($genderDiv);
  $infoContainer.append($descDiv);
  $infoContainer.attr('data-uuid', uuid);
  $profileContainer.append($infoContainer);
}


fb.child('users').on('value', function (snap) {
  var usersObj = snap.val();
  var myUid = fb.getAuth().uid;

  // Undecided
  var undecidedList = undecided(usersObj, myUid);
  var $undecidedContainer = $('.undecidedContainer');
  _.forEach(undecidedList, function(person) {
    console.log('i havent decided if i like', person);
    $undecidedContainer.append('<div><h3 class="name">'+ person +'</h3><button class="likeBtn">LIKE</button><button class="dislikeBtn">DISLIKE</button></div>');
  });


  // Likes
  var likesList =  matches(usersObj, myUid);
  var $matchesContainer = $('.matchesContainer');
  _.forEach(likesList, function(person) {
    $matchesContainer.append('<div><h3 class="name">'+ person +'</h3></div>');
  });

});

$('body').on('click', '.likeBtn', function(event) {

  var $target = $(event.target);
  var likedPerson = $target.prev().text();

  // add liked person to firebase
  console.log('likes = ', likesFb);
  var uuid = likesFb.push(likedPerson).key();

  location.reload(true);

});

$('body').on('click', '.dislikeBtn', function(event) {

  var $target = $(event.target);
  var dislikedPerson = $target.prev().prev().text();

  var uuid = dislikesFb.push(dislikedPerson).key();
  location.reload(true);

});

function undecided(data, uid) {

  var userList   = _.keys(data),
      myLikes    = usersLikes(data[uid].data),
      myDislikes = usersDislikes(data[uid].data),
      self       = [uid];
 
  return _.difference(userList, self, myLikes, myDislikes);
}

// Find a users matches
function matches(data, uid) {
  var myLikes = usersLikes(data[uid].data);
  
  return _.filter(myLikes, function (user, i) {
    var userData  = data[user].data,
        userLikes = usersLikes(userData);
    
    return _.includes(userLikes, uid);
  });
}


function usersLikes(userData) {
  if (userData && userData.likes) {
    return _(userData.likes)
      .values()
      .map(function (user) {
        return user;
      })
      .value();
  } else {
    return [];
  }
}

function usersDislikes(userData) {
  if (userData && userData.dislikes) {
    return _(userData.dislikes)
      .values()
      .map(function (user) {
        return user;
      })
      .value();
  } else {
    return [];
  }
}








