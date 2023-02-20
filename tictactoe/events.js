
let handleDrop = (event) => {
  // the element with the word sets off the trigger. Its id starts with x-
  // we want the parent square whose id starts with s-
  let newHome = event.target
  let newHomeId = newHome.id
  logEvent(event, `${gDraggedElement.id} dropped on ${newHomeId}`)
  if (newHomeId.startsWith('x-')) {
    newHome = newHome.parentElement
    newHomeId = newHome.id
    logEvent(event, `handed off to ${newHomeId}`)
  }
  if (!newHomeId.startsWith('s-')) {
    logEvent(event, `${newHomeId} should not have caught the drop.`)
    return false
  }
  if (gWhoseMove === 1){playIfNotMute(moveSound)} else {playIfNotMute(move2Sound)}

  const $newHome = $(newHome)
  logEvent(event, `${gDraggedElement.id} dropped on ${newHomeId}`)
  let newHomeIndex = parseInt(newHomeId[2])
  $newHome.css("background-color", "transparent")
  // get dragged piece data
  let $thePiece = $('.dragging:first')
  let thePieceId = $thePiece.attr('id')
  let teamNo = parseInt(thePieceId[1])

  // get dragged piece's previous home data
  let $oldHome = $thePiece.parent()
  let oldHomeId = $oldHome.attr('id')

  teamSquares[newHomeIndex] = teamNo
  $newHome.empty().append($thePiece) // get rid of the word on the square
  $newHome.off("dragover dragenter dragleave drop") // turn off all its drag and drop handlers
  logEvent(event, `${thePieceId} appended to ${newHomeId}`)

  // the old home could have been another square on the board or #homebox
  if ($oldHome.hasClass('square')) {

    // put the old square back to its original state
    let oldHomeIndex = parseInt(oldHomeId.slice(-1))
    teamNo[oldHomeIndex] = -1 // mark square as unoccupied
    $oldHome.html(`<div id="x-${oldHomeIndex}" class="sword">${words[oldHomeIndex]}</div>`) // put the word back
    addContainerHandlers(`#x-${oldHomeIndex}`)
  } else {
    // this is handling a normal move
    gWhoseMove = 1 - gWhoseMove   // flip between 0 and 1
    gMoveCount++                  // increase the move count
    buildPiece(gWhoseMove)
  }
  // After the 5th move we need to start checking for the game to be over
  if (gMoveCount < 5) {
    logEvent(event, `Move ${gMoveCount} - skipping winner check`)

  } else {
    // is the game over
    let gameStatus = getGameStatus()
    logEvent(event, `Game status is ${statusTxt[gameStatus]}`)
    if (gameStatus === GameStatus.Draw) {
      playIfNotMute(failSound)
      $('.square').off("dragover dragenter dragleave drop")
      $.colorbox({html: "The game was a tie. Try again!"});
    } else if (gameStatus === GameStatus.Unfinished) {
      buildPiece(gWhoseMove)
      logEvent(event, "setting gDragged* to null")
    } else { // we must have a winner
      $('.square').off("dragover dragenter dragleave drop")
      winner()
    }
  }
}

let addContainerHandlers = (selector) => {
  let $targets = $(selector)
  // $targets.css("z-index", "10");
  $targets.on({

    dragover: (event)  => {event.preventDefault();},

    dragenter: (event) => {
      event.preventDefault();
      logEvent(event);
      let selector = '#s-' + event.target.id[2]
      $(selector).css("background-color", "#f2fbfc")
      // logEvent(event, "adds dragpver class to  " + selector)
      // $(selector).addClass("dragover")
    },

    dragleave: (event) => {
      event.preventDefault();
      logEvent(event);
      let selector = '#s-' + event.target.id[2]
      $(selector).css("background-color", "white")
      // logEvent(event, "removes dragpver class to  " + selector)
      // $(selector).removeClass("dragover")
    },

    drop: (event) => handleDrop(event)
  })
}

let addMovedItemHandlers = (selector) => {
  let $targets = $(selector)
  $targets.attr("draggable", "true");

  $targets.on({
    dragstart: (event) => {
      logEvent(event)
      let piece = event.target
      if (piece.id.startsWith('x-')) {piece = piece.parentElement; }
      $(piece).addClass("dragging")
      gDraggedElement = piece
      gDraggedParent = piece.parentElement
      $("#home-caption").css("visibility", "hidden");
      logEvent(event, `dragged element is ${gDraggedElement.id}`)
    },
    dragend: (event) => {
      logEvent(event)
      let piece = event.target
      if (piece.id.startsWith('x-')) {piece = piece.parentElement; }
      $(piece).removeClass("dragging")
      logEvent(event, "setting gDragged* to null")
      gDraggedElement = null
      gDraggedParent = null
    },
    touchstart: (event) => {logEvent(event);event.preventDefault();},
    touchend: (event) => {
      logEvent(event)
      event.preventDefault()
      let touchedElement = event.target
      if (!$(touchedElement).hasClass("receptacle")) {
        throwIfNull(gDraggedElement, 'gDraggedElement', "cannot fine element begin dragged")

        touchedElement.innerText = ""
        touchedElement.appendChild(gDraggedElement)
        gDraggedElement = null
        gDraggedParent = null
      }
      touchState = TouchState.None
    },
    touchmove: (event) => {
      event.preventDefault();
      logEvent(event)
      let touchPosition = event.targetTouches[0]
      let pageX = (touchPosition.pageX - 50) + "px"
      let pageY = (touchPosition.pageY - 50) + "px"
      $(event.target).css({"position": "fixed", "left": pageX, "top": pageY})
      touchState = TouchState.Moving
    }
  });
}


