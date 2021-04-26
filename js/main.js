(function (win, doc) {
  'use strict'

  console.log('Main.js')

  const $buttonGame = doc.querySelectorAll('[data-js="button-game"]')

  function initialize() {
    initEvents()
  }

  function initEvents() {
    Array.prototype.forEach.call($buttonGame, (button) => {
      button.addEventListener('click', (event) => handleClickGame(event), false)
    })
  }

  function getJson() {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", "./games.json")
    ajax.send()
    ajax.addEventListener("readystatechange", () => getCompanyInfo(ajax), false)
  }

  function getCompanyInfo(ajax) {
    if (ajax.readyState === 4 && ajax.status === 200) {
      const data = JSON.parse(ajax.responseText)
      console.log(data)
    }
  }

  function handleClickGame(event) {
    console.log(event.target.textContent)
    getJson()
  }

  initialize()

})(window, document)
