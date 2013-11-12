$(document).ready(function(){
  generateCardNames(cardNames);
  generateSuits(suits);
  generateDeck();
  shuffleDeck(deck);
  generatePlayers();
  dealCards(3);
  draw();
});

var cardNames = [],
 suits = [],
 deck = [], 
 players = [],
 playersSource  = $("#player-template").html(),
 playersTemplate = Handlebars.compile(playersSource);

/*
  * Players have a name, cards[], lifeCount 
  */
var generatePlayers = function(){
  for(var i = 0; i < 4; i++){
    var player = {};
    player.name = "player-" + i;
    player.lifeCount = 3; // for scat
    player.hand = [];
    players.push(player);
  }
}

var draw = function(){
  renderPlayers(players);
}

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
    var suit = ""+this;
    var suitIndex = suitCount;
    suitCount+=1;
    var cardCount = 0;
    $.each(cardNames, function(){
      card = {};
      var cardName = ""+this;
      card.suitId = suitIndex;
      card.suit = suit;
      card.name = cardName;
      card.nameId = cardCount; 
      var cardValue = cardCount + 1; // For Scat

      if(cardCount == 0) {
        cardValue = 11;
      }
      else if(cardCount == 10 || cardCount == 11 || cardCount == 12 ){ // Jacks Queens and Kings are all worth 10 in scat
        cardValue= 10;
      }
      card.countValue = cardValue;
      deck.push(card);
      cardCount+=1;
    });
  });
} 

var shuffleDeck = function(localDeck) {
  var localDeck = splitAndCombine(localDeck);
  localDeck = splitAndCombine(localDeck);
  localDeck = splitAndShift(localDeck);
  localDeck = splitAndCombine(localDeck);
  localDeck = splitAndShift(localDeck);
  deck = localDeck;
}

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
var generateCardNames = function(cardNames){
  cardNames[0] = "Ace";
  cardNames[1] = "Two";
  cardNames[2] = "Three";
  cardNames[3] = "Four";
  cardNames[4] = "Five";
  cardNames[5] = "Six";
  cardNames[6] = "Seven";
  cardNames[7] = "Eight";
  cardNames[8] = "Nine";
  cardNames[9] = "Ten";
  cardNames[10] = "Jack";
  cardNames[11] = "Queen";
  cardNames[12] = "King";
}

var generateSuits = function(suits){
  suits[0] = "Spades";
  suits[1] = "Hearts";
  suits[2] = "Clubs";
  suits[3] = "Diamonds";
}