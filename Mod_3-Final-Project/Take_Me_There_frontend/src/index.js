//defining urls to be accessed later
BASE_URL = "http://localhost:3000/api/v1/"
USERS_URL = BASE_URL+"users/"
LOC_URL = BASE_URL+"locations"

let mapDiv = document.getElementById('map')
let panoDiv = document.getElementById('pano')
panoDiv.style.display='none'
mapDiv.style.display='none'

let map;

const heading = document.getElementById('heading')
const instructions = document.getElementById('instructions')

const newUserBtn = document.getElementById('new-user-btn')
const existingUserBtn = document.getElementById('existing-user-btn')

const newUserForm = document.getElementById('new-user-form')
newUserForm.style.display="none"

const existingUserForm = document.getElementById('existing-user-form')
existingUserForm.style.display="none"


const nUSubmitBtn = document.getElementById('NU-submit_btn')
const eUSubmitBtn = document.getElementById('EU-submit_btn')

const startBtn = document.getElementById('start-btn')

const showActualLocBtn = document.getElementById('show-loc-btn')
showActualLocBtn.style.display='none'

const newMapBtn = document.getElementById('new-map-btn')
newMapBtn.style.display='none'

function renderHomePage(){

  // randomLocation()

  startBtn.style.display="none"

  newUserBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    newUserBtn.style.display="none"
    existingUserBtn.style.display="none"
    newUserForm.style.display="block"
  })

  existingUserBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
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
  let input = document.getElementById("new-username-input")
  input.value = ""
  input.placeholder = json.errors
}

function renderStartGamePage(user){
  if(user.errors){
    renderLogin(user)
  }else{
  let hiddenDiv = document.getElementById('hidden-div')
  let userId = hiddenDiv.getElementsByTagName('p')
  userId.id = user.id
  let id = userId.id
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
  mapDiv.style.display='block'
  panoDiv.style.display='block'
  startBtn.style.display='none'
}

let loc = {}
let guessLoc = {}
// function createLoc(lat, lng, id){
//   loc = {lat: lat, lng: lng, user_id: id}
//   console.log(loc)
//   fetch(LOC_URL, {
//     method: 'POST',
//     headers: {
//       'Content-type': 'application/json',
//       Accept: 'application/json'
//     },
//     body: JSON.stringify({lat: lat, lng: lng, user_id: id})
//   })
// }

function getLocations(id){
fetch(LOC_URL)
.then(res => res.json()).then(data => getUserLocations(data, id))
}

function getUserLocations(data, id){
  let locations = []
  data.forEach(location =>{
    if(location.user_id === id) {
      locations.push(location)
    }
   })
  getGuessDistance(randLat, randLng, guessLoc["lat"], guessLoc["lng"])
}

function getGuessDistance(lat1, lng1, lat2, lng2) {
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lng2 - lng1) * p))/2;

  let guessDist = (12742 * Math.asin(Math.sqrt(a)));
  document.getElementById('distance').innerText = `You were off by ${guessDist} kms`

}
function displayMap(){
heading.textContent = "Make a Guess!"
instructions.textContent = "Use the street view to figure out your location then click on the map to make a guess!"
document.getElementById('map').style.display = "block";
document.getElementById('pano').style.display = 'block'
initialize();
}

function initialize() {
  hiddenDiv = document.getElementById('hidden-div')
  userId = hiddenDiv.getElementsByTagName('p')
  document.getElementById('distance').innerText = ""
    map = new google.maps.Map(mapDiv, {
      center: {lat: 47.6062, lng: 122.3321},
      zoom: 1
    });
    google.maps.event.addListener(map, 'click', function(event) {
      //add marker for click
      let guessLocMarker = new google.maps.Marker({
          position: {lat: event.latLng.lat(),lng: event.latLng.lng()} ,
          map: map,
          title: 'Your Guess!'
        })
      guessLoc = {lat: event.latLng.lat(),lng: event.latLng.lng()}
      let URL = USERS_URL + userId.id
      fetch(URL, {
        method: 'PATCH',
        headers: {
          'Content-Type':'application/json',
          Accept:'application/json'
        },
        body: JSON.stringify({latGuess: event.latLng.lat(), lngGuess: event.latLng.lng()})
      })
      getLocations(userId.id)
    })
    createLoc()
    showActualLocBtn.style.display='block'
    newMapBtn.style.display='block'
  }

    function showActualLocation(){
      //add marker for guess
      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      var beachMarker = new google.maps.Marker({
        position: {lat: randLat, lng: randLng},
        map: map,
        icon: image
      });
    }

let randLocations = [
  ["sleeping_guy",[40.0636123,-76.3309253]],
  ["cow",[52.1996161,0.1157753]],
  ["speeding",[
  55.87263,-4.2660584]],
  ["horse_head",[
  45.6208283,12.5372125,2013]],
  ["murder_scene",[
  55.9735307,-3.1727109,2012]],
  ["yoga",[
  51.3646871,1.042568,2009]],
  ["screen_clean",[
  54.1404008,-4.5615523]],
  ["car_crash",[
  57.9286927,-5.1977147]],
  ["australia",[-32.0106442,115.7522814]],
  ["scareCrows",[65.0931691,28.9032023,2009]],
  ["survivalSuitFight",[59.6738319,10.6057555]],
  ["ufo",[25.927629,-81.2982216]],
  ["funnyface",[55.7034416,12.7298498]],
  ["HalfSkate",[32.7475363,-117.2523968]],
  ["llama",[-16.7361482,-69.713215]],
  ["prank",[36.9678512,-122.0078888]],
  ["alaska",[71.3497157,-156.6757869]],
  ["creepyGuy",[48.7006366,6.1894127]],
  ["catConductor",[37.3955452,139.9322455]],
  ["mapsCar",[70.2424939,-148.3919899]],
  ["Cats",[41.895495,12.4773]],
  ["witnesProtec",[49.5465958,8.444658]],
  ["forrestView",[59.6756083,9.5215632]],
  ["iceland",[65.5729294,-16.9560432]],
  ["russianChurch",[55.0423154,82.9126065]],
  ["kazakMosque",[51.1253575,71.472137]],
  ["somewhereMongolia",[49.2917815,100.6954063]],
  ["alsoMongolia",[51.7643223,100.6761177]],
  ["HalfGuyRussia",[49.6996918,112.6680832]],
  ["NK/SK",[37.8742829,127.725624]],
  ["ChineseMtns",[28.37528,100.34785]],
  ["bhutan",[27.3763258,88.760695]],
  ["bangladesch",[25.1575589,90.6427538]],
  ["Sherper",[25.0067456,90.0179266]],
  ["Kalkutta",[22.5442003,88.3423638]],
  ["jungle",[23.3061097,89.1356398]],
  ["bangladesh",[21.9203212,89.6381098]],
  ["kualaLampur",[2.8108651,101.6217243]],
  ["pauPete",[-17.5717678,-149.8668985]],
  ["nome",[64.4979132,-165.4100073]],
  ["bolivia",[-17.7837363,-63.1823188]],
  ["brazil",[-23.9602895,-46.1821506]],
  ["argentina",[-45.8601587,-67.4739175]],
  ["Malvania",[-51.2928182,-60.546011]],
  ["rioGrande",[-53.7876013,-67.7333034]],
  ["colombia",[4.6056728,-74.0555255]],
  ["Cali",[3.4677736,-76.629654]],
  ["peru",[-13.2572675,-72.2658157]],
  ["peru2",[-13.634965,-72.8943505]],
  ["cuba1",[23.1410164,-82.3517592]],
  ["texas-mex",[31.7491435,-106.4874349]],
  ["SAM",[47.6169924,-122.3563495]],
  ["Squam",[49.6910659,-123.1464894]],
  ["place",[40.281,-105.66625]]
]

//making varaibles global so I can access them elsewhere
let randLat;
let randLng;
let num;

// function getUserLocs(){
//
// hiddenDiv = document.getElementById('hidden-div')
// userId = hiddenDiv.getElementsByTagName('p')
// id = userId.id
// let locales =[]
//   fetch(LOC_URL)
//   .then(res => res.json()).then(data => data.forEach(location=>{
//     if(location.user_id === id){
//       locales.push(location)
//     }
//   })
// )}
//
// function checkLoc(locations){
// let num = (((randLocations.length)-1) * Math.random())
// num = Math.round(num)
// randLat = randLocations[num][1][0]
// randLng = randLocations[num][1][1]
// console.log(locations)
// if(locations.length > 0){
//   locations.forEach(locale =>{
//     if(locale["lat"] === randLat){
//     createLoc()
//   }else{
//
//     console.log("stuff1")
//
//     fetch(LOC_URL, {
//       method: 'POST',
//       headers: {
//         'Content-type': 'application/json',
//         Accept: 'application/json'
//       },
//       body: JSON.stringify({lat: randLat, lng: randLng, user_id: id}).then(res=>res.json().then(loc => addPano(loc)))})
//     }})}
//     else{
//       console.log("stuff2")
//     fetch(LOC_URL, {
//         method: 'POST',
//         headers: {
//           'Content-type': 'application/json',
//           Accept: 'application/json'
//         },
//         body: JSON.stringify({lat: randLat, lng: randLng, user_id: id})
//         // .then(res=>res.json().then(loc => addPano(loc)))})
//     }).then(res => res.json()).then(data => addPano(data))
// }
// }

function createLoc(){

hiddenDiv = document.getElementById('hidden-div')
userId = hiddenDiv.getElementsByTagName('p')
id = userId.id
let locales =[]
  fetch(LOC_URL)
  .then(res => res.json()).then(data => data.forEach(location=>{
    if(location.user_id === id){
      locales.push(location)
    }
  })
).then(console.log(locales))
let num = (((randLocations.length)-1) * Math.random())
num = Math.round(num)
randLat = randLocations[num][1][0]
randLng = randLocations[num][1][1]
if(locales.length > 0){
  locales.forEach(loca=>{
    if(locales["lat"] === randLat){
    createLoc()
  }else{

    console.log("stuff1")

    fetch(LOC_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({lat: randLat, lng: randLng, user_id: id}).then(res=>res.json().then(loc => addPano(loc)))})
    }})}
    else{
      console.log("stuff2")
    fetch(LOC_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({lat: randLat, lng: randLng, user_id: id})
        // .then(res=>res.json().then(loc => addPano(loc)))})
    }).then(res => res.json()).then(data => addPano(data))
}
}

function addPano(loc){
console.log("addingPano")
let panorama = new google.maps.StreetViewPanorama(
    panoDiv, {
      position: {lat: randLat, lng: randLng},
      pov: {
        heading: 34,
        pitch: 10
      },
      addressControl:false
    })
  }


renderHomePage()

'____________________________________________________________________________________________'

// generating random set of coordinates

// function randomLocation(){
//   console.log("randomLocation")
//   hiddenDiv = document.getElementById('hidden-div')
//   userId = hiddenDiv.getElementsByTagName('p')
//   let id = userId.id
//   let lat = 90 * Math.random()
//   let lng = 180 * Math.random()
//     if (Math.random() > .5){
//       lat = -lat
//     }
//     if (Math.random() > .5){
//       lng = -lng
//     }
//   loc = {lat: lat, lng: lng, user_id: id}
// }

//#takes too long to render a street view
// function addMoreRandoPano(){
//     loc = {}
//     randomLocation()
//     let streetViewDiv = document.getElementById('pano')
//     var streetViewService = new google.maps.StreetViewService();
//     var STREETVIEW_MAX_DISTANCE = 100;
//     var latLng = new google.maps.LatLng(loc["lat"], loc["lng"]);
//       streetViewService.getPanoramaByLocation(latLng, STREETVIEW_MAX_DISTANCE, function (streetViewPanoramaData, status) {
//     if (status === google.maps.StreetViewStatus.OK) {
//       fetch(LOC_URL, {
//         method: 'POST',
//         headers: {
//           'Content-type': 'application/json',
//           Accept: 'application/json'
//         },
//         body: JSON.stringify({lat: loc["lat"], lng: loc["lng"], user_id: userId.id})
//       })
//       let panorama = new google.maps.StreetViewPanorama(
//           streetViewDiv, {
//             position: latLng,
//             pov: {
//               heading: 34,
//               pitch: 10
//             },
//             addressControl:false
//           })
//     } else {
//         addMoreRandoPano()
//     }
//   })
// }

// function renderStreetView(input)[
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

// function getLocations(id){
// fetch(LOC_URL)
// .then(res => res.json()).then(data => getUserLocations(data, id))
// }
//
// function getUserLocations(data, id){
//   let locations = data.findAll((location)=>{
//      location.user_id === id
//    })
//    let location = locations.last
//    console.log(location)
//
// }
