(function (win, doc) {
  'use strict'

  const $buttonCompleteGame = doc.querySelector('[data-js="complete-game"]')
  const $buttonClearGame = doc.querySelector('[data-js="clear-game"]')
  const $buttonAddToCart = doc.querySelector('[data-js="add-to-cart"]')

  const $ulButtonGame = doc.querySelector('[data-js="ul-button"]')
  const $descriptionGame = doc.querySelector('[data-js="description-game"]')
  const $newBet = doc.querySelector('[data-js="new-bet"]')
  const $numbersContainer = doc.querySelector('[data-js="numbers"]')
  const $betsContainer = doc.querySelector('[data-js="bets"]')
  const $totalPrice = doc.querySelector('[data-js="total-price"]')

  let arrayNumbers = []
  let bets = []
  let data = []
  let selectedGameData = []

  const colors = {
    '#7F3992': 'purple',
    '#01AC66': 'green',
    '#F79C31': 'orange',
    '#EE0EE7': 'pink'
  }

  $buttonCompleteGame.addEventListener('click', completeGame, false)
  $buttonClearGame.addEventListener('click', clearGame, false)
  $buttonAddToCart.addEventListener('click', addToCart, false)

  function getJson() {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", "./games.json")
    ajax.send()
    ajax.addEventListener("readystatechange", () => getGameJson(ajax), false)
  }
  getJson()

  function getGameJson(ajax) {
    if (ajax.readyState === 4 && ajax.status === 200) {
      const { types } = JSON.parse(ajax.responseText)
      data = types

      createButtonGame()
    }
  }

  function createButtonGame() {
    // const styleCheck = ``
    data.forEach(item => {
      $ulButtonGame.innerHTML += `
      <li class="${colors[item.color]}">
        <input style="display: none" data-js="button-game" type="radio" id=${item.type.toLowerCase()} name="game" value=${item.type}>
        <label for=${item.type.toLowerCase()}>${item.type}</label>
      </li>
      `
    })
    addEventOnBtnGame()
  }

  function addEventOnBtnGame() {
    const btnGame = doc.querySelectorAll('[data-js="button-game"]')

    Array.prototype.forEach.call(btnGame, (input) => {
      input.addEventListener('click', (e) => getGameInfo(e.target.value), false)
    })
  }

  function getGameInfo(nameGame) {
    selectedGameData = data.filter(item => item.type === nameGame)
    changeOfGameDescription()
    clearGame()
  }

  function changeOfGameDescription() {
    $descriptionGame.innerHTML = selectedGameData[0].description
    $newBet.innerHTML = `<span>New Bet</span> for ${selectedGameData[0].type}`
  }

  function clearGame() {
    createNumbers(selectedGameData[0].range)
    arrayNumbers = []
  }

  function createNumbers(range) {
    $numbersContainer.innerHTML = ''
    for (let i = 1; i <= range; i++) {
      $numbersContainer.appendChild(createNumber(i))
    }
  }

  function createNumber(value, select) {
    const $divNumber = doc.createElement('div')

    $divNumber.setAttribute('data-js', 'number')
    $divNumber.setAttribute('class', `number ${select && 'selected'}`)
    $divNumber.setAttribute('id', `number-${value}`)
    $divNumber.addEventListener('click', (e) => selectNumber(Number(e.target.innerHTML)), false)

    $divNumber.appendChild(doc.createTextNode(String(value).padStart(2, '0')))

    return $divNumber
  }

  function selectNumber(value) {
    const numberClicked = doc.querySelector(`#number-${value}`)

    if (arrayNumbers.indexOf(value) === -1 && arrayNumbers.length < selectedGameData[0]['max-number']) {
      numberClicked.setAttribute('class', 'number selected')
      arrayNumbers.push(value)
    } else if (arrayNumbers.indexOf(value) !== -1) {
      numberClicked.setAttribute('class', 'number')
      const indexSelect = arrayNumbers.indexOf(value)
      arrayNumbers.splice(indexSelect, 1)
    }

    return
  }

  function completeGame() {
    let randomNumber = ''

    if (arrayNumbers.length >= selectedGameData[0]['max-number']) {
      arrayNumbers = []
    }

    while (arrayNumbers.length < selectedGameData[0]['max-number']) {
      randomNumber = Math.ceil(Math.random() * selectedGameData[0].range)

      if (arrayNumbers.indexOf(randomNumber) == -1) {
        arrayNumbers.push(randomNumber)
      }
    }

    selectRandomNumber(arrayNumbers, selectedGameData[0].range)
  }

  function selectRandomNumber(arrayNumbers, range) {
    $numbersContainer.innerHTML = ''

    for (let i = 1; i <= range; i++) {
      if (arrayNumbers.indexOf(i) === -1) {
        $numbersContainer.appendChild(createNumber(i))
      } else {
        $numbersContainer.appendChild(createNumber(i, 'select'))
      }
    }
  }

  function addToCart() {
    if (arrayNumbers.length === selectedGameData[0]['max-number']) {
      createBet(arrayNumbers)
      $betsContainer.innerHTML = ''
      bets.forEach(bet => {
        $betsContainer.innerHTML += `
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
      addButtonDeleteInHTML()
      totalPriceText()
      clearGame()

    } else {
      alert(`${selectedGameData[0].type} deve ter ${selectedGameData[0]['max-number']} números selecionados.`)

    }

  }

  function createBet(arrayNumbers) {
    arrayNumbers.sort(function(a, b) {
      return a - b
    })

    bets.push({
      arrayNumbers: arrayNumbers,
      type: selectedGameData[0].type,
      price: selectedGameData[0].price,
      color: selectedGameData[0].color,
      timestamp: Date.now()
    })
  }

  function addButtonDeleteInHTML() {
    const betClass = doc.querySelectorAll('[data-js="bet"]')

    Array.prototype.forEach.call(betClass, (button) => {
      button.appendChild(createDeleteButton())
    })
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

  function removeBet(event, btn) {
    const bet = btn.parentNode

    $betsContainer.removeChild(bet)

    bets.forEach((bet, index) => {
      if (bet.timestamp == event.path[2].id) {
        bets.splice(index, 1)
      }
    })

    totalPriceText()
    bets.length < 1 && emptyCart()
  }

  function totalPriceText() {
    let totalPriceText = convertToCurrency(calcTotalPrice())
    $totalPrice.innerHTML = ''
    $totalPrice.innerHTML += `<span>Cart</span> Total: ${totalPriceText}`
  }

  function convertToCurrency(number) {
    return number.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
  }

  function calcTotalPrice() {
    const arrayPrices = bets.length > 0 ? bets.map(item => item.price) : [0]

    return arrayPrices.reduce((accumulator, currentValue) => accumulator + currentValue)
  }

  function emptyCart() {
    if (bets.length < 1) {
      $betsContainer.innerHTML = '<p class="empty-cart" >Carrinho Vazio</p>'
    }
  }

  emptyCart()

})(window, document)
