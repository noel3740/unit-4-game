//Define global variables
var resultsDiv = $(".result");
var attackButton = $("#attackButton");
var battleSectionDiv = $(".battleSection");
var enemySelectionSectionDiv = $(".enemySelectionSection");
var selectCharacterSectionDiv = $(".selectCharacter");
var winAudio = $("#winAudio");
var attackAudio = $("#attackAudio");

var yourCharacter = {
    health: 0,
    attackPower: 0,
    name: "",
    cardDiv: undefined
}

var defender = {
    health: 0,
    counterAttackPower: 0,
    name: "",
    cardDiv: undefined
}

//Function will run when character is chosen
function yourCharacterChosen (characterDiv) {

    //Show the select battle section and hide the character select section
    selectCharacterSectionDiv.hide();
    battleSectionDiv.show();

    //Set the selected character global object
    yourCharacter.cardDiv = characterDiv;
    yourCharacter.name = characterDiv.find(".characterName").text();
    yourCharacter.attackPower =  parseInt(characterDiv.attr("attackPower"));
    yourCharacter.health = parseInt(characterDiv.attr("healthPoints"));

    //Add isYourCharacter attribute to the characterDiv*/
    characterDiv.attr("isYourCharacter", "1");

    //Move the selected character div from it's parent to the .yourCharacter div
    characterDiv.detach();
    $(".yourCharacter").append(characterDiv);

    //Remove the clickable class from the selected character div
    characterDiv.removeClass("clickable");

    //Move other characters to the enemies div 
    $(".character[isYourCharacter!='1']").each(function(){
        var enemyDiv = $(this).detach();
        enemyDiv.attr("isYourCharacter", "0");
        $(".enemies").append(enemyDiv);
    });
}

//Function will be run when a defender is chosen
function defenderChosen (characterDiv) {

    //Set the selected character global object
    defender.cardDiv = characterDiv;
    defender.name = characterDiv.find(".characterName").text();
    defender.counterAttackPower =  parseInt(characterDiv.attr("counterAttackPower"));
    defender.health = parseInt(characterDiv.attr("healthPoints"));

    //Clear the results div.
    resultsDiv.text("");

    //Remove enemy character from the available to be selected section and move to the defender/enemy section
    characterDiv.detach();
    $(".defender").append(characterDiv);

    //Remove clickable class from all enemy divs 
    $(".character[isYourCharacter!='1']").removeClass("clickable");

    //Enable attack button 
    attackButton.prop('disabled', false);

    //If there is only one remaining enemy (the one that was chosen) then hide the enemy selection section 
    if ($(".enemies .character").length <= 0) {
        enemySelectionSectionDiv.hide();
    }
}

//Function will restart the game
function restart () {
    //Reset global variables
    yourCharacter.cardDiv = undefined;
    defender.cardDiv = undefined;

    //Hide the battle section, show the select character section, 
    //and show the enemy selection section (will not be visible because it's parent is the battle section which was hidden)
    battleSectionDiv.hide();
    selectCharacterSectionDiv.show();
    enemySelectionSectionDiv.show();

    //Disable the attack button 
    attackButton.prop('disabled', true);

    //Reset the character health on screen
    resetAllCharactersHealthOnScreen();

    //Clear the result div
    resultsDiv.text("");

    //Pause the win audio
    winAudio[0].pause(); 
    //Set the current time on the win audio back to 0 so if the user wins again the audio plays from the beginning. 
    winAudio[0].currentTime = 0; 
    //Pause the attack audio
    attackAudio[0].pause();

    //Loop through all the characters
    $(".character").each(function() {
        //Move the characters back to the character select div 
        var characterDiv = $(this).detach();
        selectCharacterSectionDiv.append(characterDiv);

        //Add the clickable class back 
        characterDiv.addClass("clickable");

        //Remove the isYourCharacter and isDefeated attribute
        characterDiv.removeAttr("isYourCharacter").removeAttr("isDefeated");
    });
}

//Function to reset all the characters health on screen
function resetAllCharactersHealthOnScreen() {
    
    //Loop through all the characters
    $(".character").each(function() {
        //Set the characters current health points to their respective health points element attribute
        setHealthPointsOnScreen($(this), $(this).attr("healthPoints"));        
    });
}

//Function to be run when the user attacks an enemy
function attack() {

    //Play attack audio
    attackAudio[0].currentTime = 0;
    attackAudio[0].play();

    //Display to the user how many health points they attacked for 
    //and how much the enemy/defender counter attacked their character for. 
    resultsDiv.text("You attacked " + defender.name + " for " + yourCharacter.attackPower + " damage. " + defender.name + " attacked you back for " + defender.counterAttackPower + " damage.");

    //Subtract from the defender/enemy health the amount of current attack power the user's character has
    defender.health -= yourCharacter.attackPower;

    //Increase user's attack power by the amount of the user's character original attack power 
    //and set the character div attribute value to the value
    yourCharacter.attackPower += parseInt(yourCharacter.cardDiv.attr("attackPower"));

    //If the user's character health is greater than 0 and the defender's health is 0 
    //or less then the user defeated the enemy/defender
    if (yourCharacter.health > 0 && defender.health <= 0) {
        playerDefeatedEnemy();
    }    
    //If the user's charcter did not win then allow the enemy to counter attack
    else {
        //Subtract from the user's health the amount of counter attack power the defender/enemy has
        yourCharacter.health -= defender.counterAttackPower;

        //If user's character health is less than or equal 0 and the defender's health 
        //is greater than or equal 0 then the user lost
        if (yourCharacter.health <= 0 && defender.health >= 0) {
            playerLost();
        }
    }

    //Set the user's or defender's character health to 0 if either is less than 0
    if (yourCharacter.health < 0 ) { yourCharacter.health = 0; }
    if (defender.health < 0) { defender.health = 0; }

    //Display current health points on character card
    setHealthPointsOnScreen(yourCharacter.cardDiv, yourCharacter.health);
    setHealthPointsOnScreen(defender.cardDiv, defender.health);
}

//Function to be run when the enemy has been defeated
function playerDefeatedEnemy() {

    //Assign the defeated flag element attribute
    defender.cardDiv.attr("isDefeated", "1");
    
    //Disable the attack button
    attackButton.prop('disabled', true);

    //Get all enemies that are undefeated (all characters left in the "select enemy to attack section")
    var undefeatedEnemies = $(".enemies .character");

    //If there are no more undefeated enemies then the player won
    if (undefeatedEnemies.length <= 0) {
        //Display to the user that they won
        resultsDiv.text("You Won!! Game Over!!");
        //Stop the attack audio
        attackAudio[0].pause();
        //Play win audio
        winAudio[0].play();
    }
    //There are still enemies to be defeated
    else {
        //Display to the user that they defeated the enemy and that they can choose another enemy to fight
        resultsDiv.text("You have defeated " + defender.name + ". You can choose to fight another enemy.");
        //Add the clickable class back to all the undefeated enemies
        undefeatedEnemies.addClass("clickable");
    }
}

//Function to be run when the user lost
function playerLost() {

    //Display to the user that they lost
    resultsDiv.text("You Lost!! Game Over!!");

    //Disable the attack button
    attackButton.prop('disabled', true);
}

//Set current health points on screen function
function setHealthPointsOnScreen(characterDiv, healthPoints) {
    /*Set the character health span text to the health points*/
    characterDiv.find(".characterHealth span").text(healthPoints);
}

//Will be run when a character card is selected
function characterClicked(characterDiv) {
    //Your character has not been chosen
    if (!yourCharacter.cardDiv) {
        yourCharacterChosen(characterDiv);
    }
    //Character has already been chosen and the character card is clickable (aka has the clickable class)
    else if (characterDiv.hasClass("clickable")) {
        //Run the defender has been chosen function
        defenderChosen(characterDiv);
    }
}

//Attach on click event to restart button
$("#restartButton").on("click", restart);

//Attach on click event to attack button
attackButton.on("click", attack);

//Attach on click event to character card divs
$(".character").on("click", function() { characterClicked($(this)); });

//Reset the health of all the characters on screen
resetAllCharactersHealthOnScreen();

//Hide the battle section initially
battleSectionDiv.hide();

