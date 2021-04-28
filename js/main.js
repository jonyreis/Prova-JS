(function (win, doc) {
  'use strict'

  const $buttonGame = doc.querySelectorAll('[data-js="button-game"]')
  const $buttonCompleteGame = doc.querySelector('[data-js="complete-game"]')
  const $buttonClearGame = doc.querySelector('[data-js="clear-game"]')
  const $numbersContainer = doc.querySelector('[data-js="numbers"]')
  const $descriptionGame = doc.querySelector('[data-js="description-game"]')

  let dataGame = []
  let arr

  function getJson(nameGame = "Mega-Sena") {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", "./games.json")
    ajax.send()
    ajax.addEventListener("readystatechange", () => getGameInfo(ajax, nameGame), false)
  }

  function getGameInfo(ajax, nameGame) {
    if (ajax.readyState === 4 && ajax.status === 200) {
      const { types } = JSON.parse(ajax.responseText)

      dataGame = types.filter(item => item.type === nameGame)
      $descriptionGame.innerHTML = dataGame[0].description

      createNumbers(dataGame[0].range)
    }
  }

  function createNumbers(range) {
    $numbersContainer.innerHTML = ''
    for (let i = 1; i <= range; i++) {
      $numbersContainer.innerHTML += `<div class="number">${i}</div>`
    }
  }

  function selectNumber(arr, range) {
    console.log(arr, range)
    $numbersContainer.innerHTML = ''
    for (let i = 1; i <= range; i++) {
      if (arr.indexOf(i) === -1) {
        $numbersContainer.innerHTML += `<div class="number">${i}</div>`
      } else {
        $numbersContainer.innerHTML += `<div class="number selected">${i}</div>`
      }
    }
  }

  function completeGame() {
    let randomNumber = ''
    arr = []

    while (arr.length < dataGame[0]['max-number']) {
      randomNumber = Math.ceil(Math.random() * dataGame[0].range)

      if (arr.indexOf(randomNumber) == -1) {
        arr.push(randomNumber)
      }
    }

    selectNumber(arr, dataGame[0].range)
  }

  function clearGame() {
    createNumbers(dataGame[0].range)
    arr = []
  }

  Array.prototype.forEach.call($buttonGame, (button) => {
    button.addEventListener('click', (event) => getJson(event.target.value), false)
  })

  $buttonCompleteGame.addEventListener('click', completeGame, false)
  $buttonClearGame.addEventListener('click', clearGame, false)


  getJson()

})(window, document)
