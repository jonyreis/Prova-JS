(function (win, doc) {
  'use strict'

  const $buttonGame = doc.querySelectorAll('[data-js="button-game"]')
  const $numbersContainer = doc.querySelector('[data-js="numbers"]')
  const $descriptionGame = doc.querySelector('[data-js="description-game"]')

  let dataGame = []

  function initialize() {
    initEvents()
    getJson()
  }

  function initEvents() {
    Array.prototype.forEach.call($buttonGame, (button) => {
      button.addEventListener('click', (event) => getJson(event.target.value), false)
    })
  }

  function getJson(nameGame) {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", "./games.json")
    ajax.send()
    ajax.addEventListener("readystatechange", () => getGameInfo(ajax, nameGame), false)
  }

  function getGameInfo(ajax, nameGame) {
    if (ajax.readyState === 4 && ajax.status === 200) {
      const { types } = JSON.parse(ajax.responseText)
      dataGame = types.filter(item => item.type === nameGame)
      $descriptionGame.innerHTML = dataGame.length > 0 ? dataGame[0].description : types[1].description
      dataGame.length > 0 ? createNumbers(dataGame[0].range) : createNumbers(types[1].range)
    }
  }

  function createNumbers(range) {
    $numbersContainer.innerHTML = ''
    for (let i = 1; i <= range; i++) {
      $numbersContainer.innerHTML += `<div class="number">${i}</div>`
    }
  }

  initialize()

})(window, document)
