//defining urls to be accessed later
BASE_URL = "http://localhost:3000/api/v1/"
USERS_URL = BASE_URL+"users"
LOC_URL = BASE_URL+"locations"

let map = document.getElementById("map")
let pano = document.getElementById('pano')
pano.style.display='none'
map.style.display='none'

const newUserBtn = document.getElementById('new-user-btn')
const existingUserBtn = document.getElementById('existing-user-btn')

const newUserForm = document.getElementById('new-user-form')
newUserForm.style.display="none"

const existingUserForm = document.getElementById('existing-user-form')
existingUserForm.style.display="none"


const nUSubmitBtn = document.getElementById('NU-submit_btn')
const eUSubmitBtn = document.getElementById('EU-submit_btn')

const startBtn = document.getElementById('start-btn')

function renderHomePage(){

  randomLocation()

  startBtn.style.display="none"

  newUserBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    console.log("Why?")
    newUserBtn.style.display="none"
    existingUserBtn.style.display="none"
    newUserForm.style.display="block"
  })

  existingUserBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    console.log("Why?")
    newUserBtn.style.display="none"
    existingUserBtn.style.display="none"
    existingUserForm.style.display="block"
  })
}

//addevent listener for submit buttons to initiate saving user and start sudo session of game

nUSubmitBtn.addEventListener('click', (ev) => {
  ev.preventDefault();

  saveUsername()
})

eUSubmitBtn.addEventListener('click', (ev) => {
  ev.preventDefault();
  fetchEU()
})

function fetchEU(){
  fetch(USERS_URL)
  .then(res => res.json()).then(json => isEU(json))
}

function isEU(json){
  let input = document.getElementById("existing-username-input")
  json.forEach((user) => {
    if(user.username === input.value){
      renderStartGamePage(user)
    }
  })
  input.placeholder = "Invalid Username"
  input.value = ""
}

function saveUsername(){
  let input = document.getElementById("new-username-input")
  let newUsername = input.value;
  fetch(USERS_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({username: newUsername}),
  }).then(res => res.json()).then(json => renderStartGamePage(json))
}

function renderLogin(json){
  console.log('renderLogin')
  let input = document.getElementById("new-username-input")
  input.value = ""
  input.placeholder = json.errors
}

function renderStartGamePage(user){
  console.log(user)
  if(user.errors){
    renderLogin(user)
  }else{
  let hiddenDiv = document.getElementById('hidden-div')
  let userId = hiddenDiv.getElementsByTagName('p')
  let heading = document.getElementById('heading')
  userId.id = user.id
  heading.textContent = "How Did I Get Here?"
  newUserBtn.style.display="none"
  existingUserBtn.style.display="none"
  newUserForm.style.display="none"
  existingUserForm.style.display="none"
  startBtn.style.display="block"
  startBtn.addEventListener('click', () => {
    startGame()
  })
  }
}

function startGame(){
  map.style.display='block'
  pano.style.display='block'
  startBtn.style.display='none'
  loc = {}
  // randomLocation()
}

//generating random set of coordinates
let loc = {}
function randomLocation(){
  console.log("randomLocation")
  hiddenDiv = document.getElementById('hidden-div')
  userId = hiddenDiv.getElementsByTagName('p')
  let id = userId.id
  let lat = 90 * Math.random()
  let lng = 180 * Math.random()
    if (Math.random() > .5){
      lat = -lat
    }
  loc = {lat: lat, lng: lng, user_id: id}
  fetch(LOC_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({lat: lat, lng: lng, user_id: id})
  })
  // .then(res => res.json()).then(json => renderStreetView(json))
}

// function renderStreetView(input){
//   startBtn.style.display="none"
//   // let coords = {lat: input["lat"], lng: input["lng"]}
//     //
//     js_file = document.createElement('script');
//     js_file.type = 'text/javascript';
//     js_file.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAs8NuY41IRs4g1qOKKtfm_3vXQrKRb47k&callback=initialize"
//     document.getElementsByTagName('head')[0].appendChild(js_file)
// }
// document.addEventListener('DOMContentLoaded', function () {
//   if (document.querySelectorAll('#map').length > 0)
//   {
//
//     var js_file = document.createElement('script');
//     js_file.type = 'text/javascript';
//     js_file.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAs8NuY41IRs4g1qOKKtfm_3vXQrKRb47k&callback=initialize";
//     document.getElementsByTagName('head')[0].appendChild(js_file);
//   }
// });

// function initialize() {
//   console.log("initialize")
//   let lat = loc["lat"]
//   let lng = loc["lng"]
//   let mapDiv = document.getElementById('map')
//   let streetViewDiv = document.getElementById('pano')
//     let map = new google.maps.Map(mapDiv, {
//       center: {lat: lat, lng: lng},
//       zoom: 14
//     });
//     let panorama = new google.maps.StreetViewPanorama(
//         streetViewDiv, {
//           position: {lat: loc["lat"], lng: loc["lng"]},
//           pov: {
//             heading: 34,
//             pitch: 10
//           }
//         });
//       map.setStreetView(panorama)
//   }

renderHomePage()
