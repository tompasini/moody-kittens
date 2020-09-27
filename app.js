/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kitten
let kittens = [];
let possibleMoods = ["Happy", "Tolerant", "Angry", "Berserk"];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target


  let kitten = {
    id: generateId(),
    name: form.name.value,
    mood: possibleMoods[1],
    affection: 5,
  }

  kittens.push(kitten)
  saveKittens()
  form.reset()
}
//Pull robohash image during drawKittens() function.

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let storedKitties = JSON.parse(window.localStorage.getItem("kittens"))

  if (storedKitties) {
    kittens = storedKitties
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenListElement = document.getElementById('kittens')
  let kittensTemplate = ""

  kittens.forEach(kitten => {
    kittensTemplate += `
    <div id = "${kitten.name}" class="card">
          <h4>${kitten.name}</h4>
          <div>
            <img class="${kitten.mood}" id= "${kitten.name}Image" src="https://robohash.org/<${kitten.name}>?set=set4">
          </div>
          <div>
            <p class="my-custom-font d-flex space-between">
              <span>Mood: ${kitten.mood}</span>
              <span>Affection: ${kitten.affection}</span>
            </p>
            <button id = "${kitten.name}PetButton" onclick="pet('${kitten.id}')">Pet</button>
            <button id = "${kitten.name}CatnipButton" onclick="catnip('${kitten.id}')">Catnip</button>
            <button onclick="removeKitten('${kitten.id}')">Delete</button>
          </div>
    </div>
      `
  })

  kittenListElement.innerHTML = kittensTemplate
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let kittenPet = findKittenById(id)
  let index = kittens.findIndex(kitten => kitten.id == id)
  let randomNumber = Math.random()
  let currentKittenName = kittens[index].name

  if (randomNumber > .7) {
    kittens[index].affection++
  } else {
    kittens[index].affection--
  }

  setKittenMood(kittenPet)

  saveKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let index = kittens.findIndex(kitten => kitten.id == id)

  kittens[index].mood = "Tolerant"
  kittens[index].affection = 5

  saveKittens()
}

function removeKitten(kittenId) {
  let index = kittens.findIndex(kitten => kitten.id == kittenId)
  if (index == -1) {
    throw new Error("Invalid Kitten Id")
  }
  kittens.splice(index, 1)
  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {


  if (kitten.affection <= 0) {
    kitten.mood = "Berserk"
    document.getElementById(kitten.name + "Image").classList.add(kitten.mood)
  } else if (kitten.affection <= 3) {
    kitten.mood = "Angry"
    document.getElementById(kitten.name + "Image").classList.add(kitten.mood)
  } else if (kitten.affection <= 5) {
    kitten.mood = "Tolerant"
    document.getElementById(kitten.name + "Image").classList.add(kitten.mood)
  } else {
    kitten.mood = "Happy"
    document.getElementById(kitten.name + "Image").classList.add(kitten.mood)
  }

}

function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

loadKittens()
