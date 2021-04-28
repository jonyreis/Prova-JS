(function (win, doc) {
  'use strict'

  const $buttonGame = doc.querySelectorAll('[data-js="button-game"]')
  const $buttonCompleteGame = doc.querySelector('[data-js="complete-game"]')
  const $buttonClearGame = doc.querySelector('[data-js="clear-game"]')
  const $buttonAddToCart = doc.querySelector('[data-js="add-to-cart"]')

  const $numbersContainer = doc.querySelector('[data-js="numbers"]')
  const $descriptionGame = doc.querySelector('[data-js="description-game"]')
  const $addBetToCart = doc.querySelector('[data-js="bets"]')

  let dataGame = []
  let arrayRandomNumber
  let bets = []
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

  function selectNumber(arrayRandomNumber, range) {
    console.log(arrayRandomNumber, range)
    $numbersContainer.innerHTML = ''
    for (let i = 1; i <= range; i++) {
      if (arrayRandomNumber.indexOf(i) === -1) {
        $numbersContainer.innerHTML += `<div class="number">${i}</div>`
      } else {
        $numbersContainer.innerHTML += `<div class="number selected">${i}</div>`
      }
    }
  }

  function completeGame() {
    let randomNumber = ''
    arrayRandomNumber = []

    while (arrayRandomNumber.length < dataGame[0]['max-number']) {
      randomNumber = Math.ceil(Math.random() * dataGame[0].range)

      if (arrayRandomNumber.indexOf(randomNumber) == -1) {
        arrayRandomNumber.push(randomNumber)
      }
    }

    selectNumber(arrayRandomNumber, dataGame[0].range)
  }

  function clearGame() {
    createNumbers(dataGame[0].range)
    arrayRandomNumber = []
  }

  function createBet(arrayNumbers) {
    arrayNumbers.sort(function(a, b) {
      return a - b
    })

    bets.push({
      arrayNumbers: arrayNumbers,
      type: dataGame[0].type,
      price: dataGame[0].price,
      color: dataGame[0].color
    })

  }

  function convertToCurrency(number) {
    return number.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
  }


  function addToCart() {
    if (arrayRandomNumber.length > 1) {
      createBet(arrayRandomNumber)
      $addBetToCart.innerHTML = ''
      bets.map(bet => {
        $addBetToCart.innerHTML += `
          <div class="bet">
            <img src="/assets/trash.svg" alt="trash" />
            <div class="separator" style="background-color: ${bet.color};"></div>
            <div class="bet-info">
              <h4>${bet.arrayNumbers}</h4>
              <div>
                <strong style="color: ${bet.color};">${bet.type}</strong><span>${convertToCurrency(bet.price)}</span>
              </div>
            </div>
          </div>
        `
      })

    arr = []
    }
  }

  Array.prototype.forEach.call($buttonGame, (button) => {
    button.addEventListener('click', (event) => getJson(event.target.value), false)
  })

  $buttonCompleteGame.addEventListener('click', completeGame, false)
  $buttonClearGame.addEventListener('click', clearGame, false)
  $buttonAddToCart.addEventListener('click', addToCart, false)

  getJson()

})(window, document)
