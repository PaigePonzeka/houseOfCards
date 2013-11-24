
var cardValues = [],
 suits = [],
 deck = [], 
 players = [],
 cardValues = [],
 playerTurn,
 numOfPlayers = 4,
 randomNames = ["GMA O'Doh", "Colleen", "Uncle Gary", "Skylar Anne"],
 playersSource  = $("#player-template").html(),
 playersTemplate = Handlebars.compile(playersSource),
 cardsSource  = $("#card-template").html(),
 cardsTemplate = Handlebars.compile(cardsSource);

$(document).ready(function(){
  init();
  shuffleDeck(deck);
  generatePlayers();
  dealCards(3);
  draw();
  playerTurn = 0;
  highlightActivePlayer();
});

/*
 * initializes the Deck, Generates Suites, Generates Card Values Data,
 * Generates Deck Iterating through each Card Value for the Numbers of suits that exist
 */
var init = function(){
  cardValues = generateCardValues();
  generateSuits();
  generateDeck();
}

var setPlayerTurn = function() {
  playerTurn++;

  if(playerTurn == numOfPlayers){
    playerTurn = 0;
  }
}

var endTurn = function() {
  setPlayerTurn();
  highlightActivePlayer();
}

var highlightActivePlayer = function() {
  $('.player').removeClass('active-player');
  $('.player-' + playerTurn).addClass('active-player');
}
/*
 * Draws items on the board
 */
var draw = function(){
  renderPlayers(players);
}

/*
 * Generates a Card Object from the template an appends it to the cards container
 */
var printAllCards = function(){
  $.each(deck, function(){
    var cardHtml = cardsTemplate(this);
    $('.js-cards-container').append(cardHtml);
  });
  
}
/*
  * Players have a name, cards[], lifeCount 
  */
var generatePlayers = function(){
  for(var i = 0; i < 4; i++){
    var player = {};
    player.id = i;
    player.name = randomNames[i];
    player.lifeCount = 3; // hardcoded for scat
    player.hand = [];
    players.push(player);
  }
}

/* 
 * generates each player from the player template
 */
var renderPlayers = function(){
  console.log(players);
  var playersHtml = playersTemplate(players);
  $('.js-players-container').html(playersHtml);
}

/*
 * Deals cards (hard coded to 3 for scat for now)
 */
var dealCards = function(cardTotal) {
  for(var i = 0; i < cardTotal; i++) {
    $.each(players, function(){
      var card = deck.pop();
      this.hand.push(card);
    });
  }
}

/*
  * Generates an in order deck of cards
  */
var generateDeck = function(){
  var suitCount = 0;
  $.each(suits, function(){
    var suit = this;
    $.each(cardValues, function(){
      card = {};
      var value = this;
      card.value = value;
      card.suit = suit;
      deck.push(card);
    });
  });
} 

/* 
 * Runs several methods to shuffle the cards adequetely
 */
var shuffleDeck = function(localDeck) {
  var localDeck = splitAndCombine(localDeck);
  localDeck = splitAndCombine(localDeck);
  localDeck = splitAndShift(localDeck);
  localDeck = splitAndCombine(localDeck);
  localDeck = splitAndShift(localDeck);
  deck = localDeck;
}

/*
 * Shuffling Helper Method
 */
var splitAndCombine = function(localDeck){
  // simulate shuffling
  // split deck in half
  // append items to a new deck one after the other
  var newDeck = [];
  var size = localDeck.length/2;

  var topHalf = localDeck.slice(0, size);
  var bottomHalf = localDeck.slice(size, deck.length)

  // combine the halfs one at a time
  while(topHalf.length > 0 && bottomHalf.length > 0) {
    var topCard = topHalf.shift();
    var bottomCard = bottomHalf.shift();
    newDeck.push(topCard);
    newDeck.push(bottomCard);
  }
  return newDeck;
}

/* 
 * Shuffling Helper Method
 */
var splitAndShift = function(localDeck) {
  var newDeck = [];
  // simulates grabbing  a section of moving it around
  // split the deck into 5 random sized parts 
  var sectionOne = localDeck.slice(0, 12);
  var sectionTwo = localDeck.slice(12, 25);
  var sectionThree = localDeck.slice(25, 38);
  var sectionFour = localDeck.slice(38, 51);

   // combine the halfs one at a time
  while(sectionOne.length > 0 && sectionTwo.length > 0 && sectionThree.length > 0 && sectionFour.length > 0) {
    var oneCard = sectionOne.pop();
    var twoCard = sectionTwo.shift();
    var threeCard = sectionThree.pop();
    var fourCard = sectionFour.shift();
    newDeck.push(fourCard);
    newDeck.push(twoCard);
    newDeck.push(oneCard);
    newDeck.push(threeCard);
  }
  return newDeck;
}

/*
 *  Variable Generating Utilities
 */
var generateCardValues = function(cards){
  var cards = [];
  cards[0] = setCard(0, 11, "A")
  cards[1] = setCard(1, 2, "2")
  cards[2] = setCard(2, 3, "3")
  cards[3] = setCard(3, 4, "4")
  cards[4] = setCard(4, 5, "5")
  cards[5] = setCard(5, 6, "6")
  cards[6] = setCard(6, 7, "7")
  cards[7] = setCard(7, 8, "8")
  cards[8] = setCard(8, 9, "9")
  cards[9] = setCard(9, 10, "10")
  cards[10] = setCard(10, 10, "J")
  cards[11] = setCard(11, 10, "Q")
  cards[12] = setCard(12, 10, "K")
  return cards;
}

var setCard = function(index, countValue, name){
  var card = {};
  card.id = index;
  card.name = name;
  card.countValue = countValue;
  return card;
}

var setSuit = function(symbol, id, name){
  var suit = {};
  suit.symbol = symbol;
  suit.id = id;
  suit.name = name;
  return suit;
}

var generateSuits = function(){
  suits[0] = setSuit("&spades;", 0, "spade");
  suits[1] = setSuit("&diams;", 1, "diamond");
  suits[2] = setSuit("&clubs;", 2, "club");
  suits[3] = setSuit("&hearts;", 3, "heart");
}

var generateCard = function(cardObj) {
  return cardsTemplate(cardObj);
}
/*
 * Event Listeners
 */

/* 
 * Allows Users to select a New Card from the Deck
 */
 $('.js-card-deck').click(function(){
  // draw a new card to the deck and add it to the active players hand
  var newCard = deck.pop();
  var cardHtml = generateCard(newCard);
  $('.active-player').find('.js-player-hand').addClass('js-player-hand-discard').append('<li>' + cardHtml +"</li>");
 });

/*
 * Lets Users select a card from the discard pile for their hand
 */
 $('.js-discarded-cards').on('click', '.js-discarded-card', function(){
  console.log("discarded clicked");
    var discardedCard = $(this).remove();
    console.log(discardedCard.attr('class'));
    discardedCard.removeClass('js-discarded-card');
    $('.active-player').find('.js-player-hand').addClass('js-player-hand-discard').append(discardedCard);
 });

/*
 * Lets Users discard a card when they have four cards in their hand
 */
 $('.js-board').on('click', '.js-player-hand-discard > li', function(){
    var discardedCard = $(this).remove().addClass('js-discarded-card');
    $('.js-player-hand-discard').removeClass('.js-player-hand-discard');
    $('.js-discarded-cards').append(discardedCard);
    endTurn();
 });

/* --------------------------
 *  Handlebar Helpers 
 * ----------------------------
 */
Handlebars.registerHelper('symbols', function(cardId, suitSymbol) {
  var symbolHtml = "";
  var numOfSyms = cardId + 1; 
  for(var i = 0; i < numOfSyms; i++){
    symbolHtml += "<span class='suit symbol-"+ i +"'>"+suitSymbol+"</span>";
  }
  return symbolHtml;
});

/* 
 * Shows the Coins the player has left in the game
 */
 Handlebars.registerHelper('showCoins', function(lifeCount) {
  var coinsString= '';
  for(var i = 0; i < lifeCount; i++) {
    coinsString += "<li class='icon-coin'></li>"
  }
  return coinsString;
 });