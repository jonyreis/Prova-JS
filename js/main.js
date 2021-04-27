(function (win, doc) {
  'use strict'

  console.log('Main.js')

  const $buttonGame = doc.querySelectorAll('[data-js="button-game"]')
  const $descriptionGame = doc.querySelector('[data-js="description-game"]')

  let dataGame = []

  function initialize() {
    initEvents()
    getJson()
  }

  function initEvents() {
    Array.prototype.forEach.call($buttonGame, (button) => {
      button.addEventListener('click', (event) => getJson(event.target.textContent), false)
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
    }
  }

  initialize()

})(window, document)
