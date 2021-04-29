(function (win, doc) {
  'use strict'

  const $buttonGame = doc.querySelectorAll('[data-js="button-game"]')
  const $buttonCompleteGame = doc.querySelector('[data-js="complete-game"]')
  const $buttonClearGame = doc.querySelector('[data-js="clear-game"]')
  const $buttonAddToCart = doc.querySelector('[data-js="add-to-cart"]')

  const $betsContainer = doc.querySelector('[data-js="bets"]')

  const $numbersContainer = doc.querySelector('[data-js="numbers"]')
  const $descriptionGame = doc.querySelector('[data-js="description-game"]')
  const $addBetToCart = doc.querySelector('[data-js="bets"]')
  const $totalPrice = doc.querySelector('[data-js="total-price"]')

  let arrayRandomNumber
  let bets = []
  let dataGame = []

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
      color: dataGame[0].color,
      timestamp: Date.now()
    })

  }

  function convertToCurrency(number) {
    return number.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
  }

  function calcTotalPrice() {
    const arrayPrices = bets.map(item => item.price)

    return arrayPrices.reduce((accumulator, currentValue) => accumulator + currentValue)
  }

  function removeBet(event, btn) {
    const bet = btn.parentNode

    $betsContainer.removeChild(bet)

    bets.forEach((item, index) => {
      if (item.timestamp == event.path[2].id) {
        bets.splice(index, 1)
      }
    })

    totalPriceText()

  }

  function createDeleteButton() {
    const $button = doc.createElement('button')
    const $img = doc.createElement('img')
    $img.setAttribute('src', '/assets/trash.svg')

    $button.setAttribute('type', 'button')
    $button.addEventListener('click', (event) => removeBet(event, $button), false)

    $button.appendChild($img)
    return $button
  }

  function addButtonDelete() {
    const betClass = doc.querySelectorAll('[data-js="bet"]')

    Array.prototype.forEach.call(betClass, (button) => {
      button.appendChild(createDeleteButton())
    })
  }

  function totalPriceText() {
    let totalPriceText = convertToCurrency(calcTotalPrice())
    $totalPrice.innerHTML = ''
    $totalPrice.innerHTML += `<span>Cart</span> Total: ${totalPriceText}`
  }

  function addToCart() {
    if (arrayRandomNumber.length > 1) {
      createBet(arrayRandomNumber)
      $addBetToCart.innerHTML = ''
      bets.forEach(bet => {
        $addBetToCart.innerHTML += `
        <div data-js="bet" class="bet" id="${bet.timestamp}">
          <div class="bet-info">
            <h4>${bet.arrayNumbers}</h4>
            <div>
              <strong style="color: ${bet.color};">${bet.type}</strong><span>${convertToCurrency(bet.price)}</span>
            </div>
          </div>
          <div class="separator" style="background-color: ${bet.color};"></div>
        </div>
        `
      })
      addButtonDelete()
      totalPriceText()

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
