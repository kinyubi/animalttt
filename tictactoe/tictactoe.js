/* =============================================
   ENUMS AND CONSTANTS SECTION
================================================*/
/**
 * an enum for game state
 * @type {{TeamZeroWins: number, Draw: number, Unfinished: number, TeamOneWins: number}}
 */
const GameStatus = {Unfinished: 0, TeamZeroWins: 1, TeamOneWins: 2, Draw: 3}
const statusTxt = [':Unfinished', 'TeamZeroWins', 'TeamOneWins', 'Draw']

const PieceInfo = {Piece: 1, Team: 2, Both: 3}
/**
 * an enum to touch event state
 * @type {{Started: number, Moving: number, None: number}}
 */
const TouchState = {None: 0, Started: 1, Moving: 2}

const winnerSong = new Audio('/tictactoe/audio/game-win.mp3')
const moveSound = new Audio('/tictactoe/audio/notification-pop.wav')
const move2Sound = new Audio('/tictactoe/audio/supersound23__pop.mp3')
const failSound = new Audio('/tictactoe/audio/failfare.mp3')
const tadaSound = new Audio('/tictactoe/audio/ta-da.mp3')

/**
 * If a team has a piece on all 3 of the squares in a combination, that team has won
 * @type {number[][]}
 */
const winningCombinations = [
  [0, 1, 2], // top row win
  [3, 4, 5], // middle row win
  [6, 7, 8], // bottom row win
  [0, 3, 6], // left column win
  [1, 4, 7], // center column win
  [2, 5, 8], // right column win
  [0, 4, 8], // top-left to bottom-right diagonal win
  [2, 4, 6]  // bottom-left to top-right diagonal win
]

/**
 * this is where we store the 9 words that are on the tic-tac-toe board.
 * s-1 will be set to words[0], etc
 * @type {string[]}
 */
const words = new Array(9).fill('')

const currentPieceNumber = new Array(2).fill(0)

const teamSquares = new Array(9).fill(-1)

/**
 * Controls logging events and messages to the console
 * @type {boolean}
 */
const logToConsole = true


const gamePieceSize = 100

gMute = false

/* =============================================
   GLOBALS SECTION
================================================*/
/**
 * The id of the piece being touched or null
 * @type {string|null}
 */
let touchState = TouchState.None
/**
 * The current game state
 * @type {GameStatus}
 */

let gDraggedElement = null
let gDraggedParent = null
/**
 * an array containing the game piece image src for each team's pieces
 * @type {string[]}
 */
let gMascotImages = []
let gMascotNumbers = []
let gMascotWordLists = []
/**
 * Which team owns the current move - 0 for student, 1 for teacher
 * @type {number}
 */
let gWhoseMove = 0  // 0 for your-team, 1 for my-team
let gMoveCount = 0

let gWordList= [];

/* =============================================
   FUNCTIONS SECTION
   =============================================*/
/**
 * log an event to console
 * @param e the event we are reporting on
 * @param message the optional message
 */
function logEvent(e, message = "") {
  if (logToConsole) {
    console.log(`${e.target.id} triggered ${e.type}: ${message}`)
  }
}

function playIfNotMute(sound) {
  if ($('#tt-sound').get(0).checked) {sound.play();}
}

/**
 * logs a message identifying the function the message was sent from
 * @param message
 */
function logMessage(message = 'completed') {
  if (logToConsole) {
    console.log(`${logMessage.caller.name}: ${message}`)
  }
}

function throwIfNull(expr, exprName, message = "") {
  if (expr === null) {
    let errMessage = "ERROR(Null check): " + exprName + " cannot be null. " + message
    console.log(errMessage)
    throw Error(errMessage)
  }
}

function throwIfNotFound(selector) {
  if (typeof $(selector).attr('id') === undefined) {
    let errMessage = `${selector} does not resolve to a JQuery object`
    console.log(errMessage)
    throw Error(errMessage)
  }
}

function getLessons() {
  logMessage("ENTER getLessons")
  let response = await fetch("/tictactoe/ttt_words.json")
  jqxhr.done(function (data) {
    let len =  data.length;
    logMessage(`${len} word lists imported.`);
    gMascotWordLists = [];
    for (let number in gMascotNumbers){
      gMascotWordLists.push(data[number])
    }
    gWordList = gMascotWordLists[0]
    logMessage(gWordList.join(','))
    logMessage("EXIT getLessons")
  })
}

/**
 * called by buildTeamPieces.
 * randomly select avatars (img src) for two teams
 * @returns {string[]} a two-element array containing the src for the game piece img for each team
 */
function getMascotImages(count=6) {
  logMessage("ENTER getMascotImages")
  let mascots = new Array(10).fill(-1)
  const set = new Set(mascots)
  mascots = Array.from(set).slice(0, 6)
  for (let i=0; i<10; i++) mascots[i] = Math.floor(Math.random() * 104) + 1;
  let size = gamePieceSize

  gMascotImages = []
  for (let i = 0; i < 6; i++) {
    gMascotImages.push(`/images/tictactoe/animals/jpg70/${mascots[i]}.jpg`)
  }
  gMascotNumbers = mascots
  logMessage("EXIT getMascotImages")
}

/**
 * for each playing piece for each team create the playing pieces and append to the team-1 or team-2 DOM element:
 *  create a game piece div wrapper with draggable and gamePiece__wrapper classes
 *  inside the wrapper create an img element that has gamePiece and mover classes. The img source
 *  is the animal png randomly chosen for the team. The id for the img element is team<x>-piece<y> where
 *  <x> is 0 through1 and <y> is 0 through 8
 *
 *  team id convention: team-<team-number> where team-number is 0 or 1
 *  piece id convention team<team-number>-piece<piece-number> where piece-number is 0 through 4
 */
function buildPiece(team) {

  let pieceNumber = ++currentPieceNumber[team]
  let pieceId = `t${team}p${pieceNumber}`
  let size = gamePieceSize
  let imageSource = gMascotImages[team]
  let img = `<img id="${pieceId}" height="${size}" width="${size}" src="${imageSource}" alt="${pieceId} "`
  img += 'class="gamePiece mover mad"   draggable="true" >'
  let $homeBox =$('#home-box')
  $homeBox.empty()
  $homeBox.append(img)
  addMovedItemHandlers('#' + pieceId)

  logMessage(img)
}

function choosePiece(which) {
  if (which !== 0) {
    gMascotImages[0] = gMascotImages[which]
  }
  gMascotImages[1] = gMascotImages[5]
  const $homeBox = $('#home-box')
  $homeBox.empty()
  $homeBox.css("display", "grid")
  $homeBox.removeClass("choice--grid")
  $homeBox.addClass("home-box--grid")

  $('#new-game').css("display", "block")
  $('#choose-player').css("display", "none")

  for (let i=0; i<2; i++ ){
    gMascotImages[i] = gMascotImages[i].replace("jpg70", "jpg100")
  }
  buildPiece(gWhoseMove)
}

/**
 * Builds an HTML string that represents 5 different animals to choose
 * Turns off the NewGame button and swaps home-box class from home-box--grid
 * to choice--grid
 * Turns on the choose player message
 */
function buildChoices() {
  const CHOICES_COUNT = 5
  const $homeBox = $('#home-box')

  $homeBox.empty()

  let childStr = ''
  try {
    $homeBox.empty()
    for (let i=0; i<CHOICES_COUNT; i++) {
      let animalChoice = `<img id="choice-${i}" height="70" width="70" src="${gMascotImages[i]}" alt="choice"`
      animalChoice += `onclick="choosePiece(${i})" class="man choice-box"> `
      childStr += animalChoice
    }
    $homeBox.append(childStr)
  }
  catch(e) {
    console.error(e);
  }
  playIfNotMute(tadaSound)
  $homeBox.removeClass("home-box--grid")
  $homeBox.addClass("choice--grid")
  $('#new-game').css("display", "none")
  $('#choose-player').css("display", "block")

}
/**
 * randomly shuffles the array of words in place
 * @param array the array to be shuffled. The array consists of 9 elements representing each square
 * on the board. After shuffling, this array's elements are copied into the
 */
function shuffleInPlace(array) {
  array.sort(() => Math.random() - 0.5);
}

/**
 * Gets the <words> parameter passed in with the url. If there is no <words> parameter,
 * use a default list of words.
 * Shuffles the words. the index of each word corresponds to the square it belongs to.
 * Adds a word to innerText of each square(0 through 8)
 * @returns {string[]} the array of shuffled words.
 */
function fillSquaresWithWords() {
  let tempWords = gWordList;
  // let tempWords = ['fat', 'cat', 'hat', 'sat', 'mat', 'pat', 'bat', 'rat', 'vat']
  if (params.has("words")) {
    let list = params.get("words")
    tempWords = list.split('-')
  }
  shuffleInPlace(tempWords)
  for (let i = 0; i < 9; i++) {
    words[i] = tempWords[i]
    let square = $(`#s-${i}`)
    square.html(`<div id="x-${i}" class="sword">${words[i]}</div>`)
    // square.addClass("py-2")
  }
  logMessage()
}

/**
 * compares the winning combination triplet against the team's pieces on the board. Determines
 * if this combination makes us a winner, and if the opponent is blocking this combination
 * @param teamIndex the team we are getting the status for (0, 1)
 * @param combo a triplet of squares that represents one of the winning piece location combinations
 * @returns {boolean[]} a duple (IsWinner, IsBlocked]
 */
function getComboStatus(teamIndex, combo) {

  let a = teamSquares[combo[0]]
  let b = teamSquares[combo[1]]
  let c = teamSquares[combo[2]]
  let t = teamIndex
  let x = 1 - t  // x represents the teamIndex of the other team
  let isBlocked = (a === x) || (b === x) || (c === x)
  let isWinner = (a === t) && (b === t) && (c === t)
  return [isWinner, isBlocked]
}

/**
 * At the end of a move, Determine if the game is unfinished, a draw, or we have a winner
 * @returns {GameStatus}
 */
function getGameStatus() {
  let isTeamZeroUnBlocked = false
  let isTeamOneUnBlocked = false

  for (let combo of winningCombinations) {
    let [isWinner, isBlocked] = getComboStatus(0, combo)
    if (isWinner) {
      return GameStatus.TeamZeroWins
    }
    if (!isBlocked) {
      isTeamZeroUnBlocked = true
    }

    [isWinner, isBlocked] = getComboStatus(1, combo)
    if (isWinner) {
      return GameStatus.TeamOneWins
    }
    if (!isBlocked) {
      isTeamOneUnBlocked = true
    }
  }
  if (isTeamZeroUnBlocked && isTeamOneUnBlocked) {
    return GameStatus.Unfinished
  } else {
    return GameStatus.Draw
  }

}

/**
 * Randomly chooses one of the 10 winner gifs and returns it
 * @returns {string} a url to the winner gif
 */
function winnerPic() {
  let randomNum = Math.floor(Math.random()*10);
    return `/images/tictactoe/winner/${randomNum}.gif`;
}

/**
 * plays the winner sound clip (if sound not muted) and displays the gif
 */
function winner() {
    $('.sword').off("dragover dragenter dragleave drop")
    playIfNotMute(winnerSong)
    $.colorbox({
        closeButton: true, close: "X", opacity: 1, width: "500px", height: "500px", left: "18%", top: "25%",
        href: winnerPic()
    });
}


// getting some screen information
function screenInfo() {
  let width = $(window).width();
  let height = $(window).height();
  $('#info').text(`${width}W x ${height}H`)
}
// ========= Dynamic HTML Building
let response = await fetch("/tictactoe/ttt_words.json")
let json = await response.json();
/* =============================================
   MAIN SECTION
================================================*/
// get parameters passed in with URL
const params = new URLSearchParams(window.location.search)

$(document).ready(function () {
  getMascotImages()
  getLessons()

  fillSquaresWithWords()
  // $(".square").addClass("sword")
  addContainerHandlers(".sword")
  buildChoices()
});



