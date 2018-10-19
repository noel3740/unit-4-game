//Define global variables
var yourCharacterDiv;
var defenderCharacterDiv;
var resultsDiv = $(".result");
var attackButton = $("#attackButton");
var battleSectionDiv = $(".battleSection");
var selectCharacterSectionDiv = $(".selectCharacter");

//Function will run when character is chosen
function characterChosen (characterDiv) {

    //Show the select battle section and hide the character select section
    selectCharacterSectionDiv.hide();
    battleSectionDiv.show();

    //Set the selected character global variable to the current div
    yourCharacterDiv = characterDiv;

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

//Function will add a defender to the fight section
function addDefender (enemyCharacterDiv) {

    defenderCharacterDiv = enemyCharacterDiv;

    //Clear the results div.
    resultsDiv.text("");

    //Remove enemy character from the available to be selected section and move to the defender/enemy section
    enemyCharacterDiv.detach();
    $(".defender").append(enemyCharacterDiv);

    //Remove clickable class from all enemy divs 
    $(".character[isYourCharacter!='1']").removeClass("clickable");

    //Enable attack button 
    attackButton.prop('disabled', false);
}

//Function will restart the game
function restart () {
    //Reset global variables
    yourCharacterDiv = undefined;
    defenderCharacterDiv = undefined;

    //Show the select character section and hide the battle section
    selectCharacterSectionDiv.show();
    battleSectionDiv.hide();

    //Disable the attack button 
    attackButton.prop('disabled', true);

    //Reset the character health and attack
    resetCharacterCurrentHealthAndAttack();

    //Clear the result div
    resultsDiv.text("");

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

//Function to reset all the characters health and attack
function resetCharacterCurrentHealthAndAttack() {
    
    //Loop through all the characters
    $(".character").each(function() {
        var characterDiv = $(this);

        //Get the healthPoints attribute value
        var healthPoints = characterDiv.attr("healthPoints");

        //Set the characters current health points
        setCurrentHealthPoints(characterDiv, healthPoints);        

        //Reset current attack power to attack power attribute
        characterDiv.attr("currentAttackPower", characterDiv.attr("attackPower"));
    });
}

//Function to be run when the user attacks an enemy
function attack() {

    //Store in variables the current health points, current attack power and attack power attributes for user's character and convert those values to integer
    var yourHealth = parseInt(yourCharacterDiv.attr("currentHealthPoints"));
    var yourAttackPower = parseInt(yourCharacterDiv.attr("currentAttackPower"));
    var yourOriginalAttackPower = parseInt(yourCharacterDiv.attr("attackPower"));

    //Store in variables the current health points and counter attack power attributes from the enemy/defender character and convert those values to integer
    var defenderHealth = parseInt(defenderCharacterDiv.attr("currentHealthPoints"));
    var defenderCounterAttackPower = parseInt(defenderCharacterDiv.attr("counterAttackPower"));

    //Get the enemy/defender's name and place it in a variable
    var defenderName = defenderCharacterDiv.find(".characterName").text();

    //Display to the user how many health points they attacked for and how much the enemy/defender counter attacked their character for. 
    resultsDiv.text("You attached " + defenderName + " for " + yourAttackPower + " damage. " + defenderName + " attacked you back for " + defenderCounterAttackPower + " damage.");

    //Subtract from the defender/enemy health the amount of current attack power the user's character has
    defenderHealth -= yourAttackPower;
    //Subtract from the user's health the amount of counter attack power the defender/enemy has
    yourHealth -= defenderCounterAttackPower;

    //Set the defender and user's character health to 0 if either is less than 0
    if (defenderHealth < 0) { defenderHealth = 0; }
    if (yourHealth < 0 ) { yourHealth = 0; }

    //Set the current health points attributes for both user's character and defender's character
    setCurrentHealthPoints(yourCharacterDiv, yourHealth);
    setCurrentHealthPoints(defenderCharacterDiv, defenderHealth);

    //Increase user's attack power by the amount of the user's character original attack power and set the character div attribute value to the value
    yourAttackPower += yourOriginalAttackPower;
    yourCharacterDiv.attr("currentAttackPower", yourAttackPower);

    //If user's character health is 0 and the defender's health is greater than 0 
    //or both the user's character health and defender's character health are both 0 then the user lost
    if (yourHealth === 0 && defenderHealth >= 0) {
        playerLost();
    }
    //If the user's character health is greater than 0 and the defender's health is 0 or less then the user defeated the enemy/defender
    else if (yourHealth > 0 && defenderHealth <= 0) {
        playerDefeatedEnemy(defenderName);
    }    
}

//Function to be run when the enemy has been defeated
function playerDefeatedEnemy(defenderName) {

    //Assign the defeated flag
    defenderCharacterDiv.attr("isDefeated", "1");
    
    //Disable the attack button
    attackButton.prop('disabled', true);

    //Get all enemies that are undefeated (all character class divs where isYourCharater attribute is not 1 and isDefeated attribute is not 1)
    var undefeatedEnemies = $(".character[isYourCharacter !='1'][isDefeated != '1']");

    //If there are no more undefeated enemies then the player won
    if (undefeatedEnemies.length <= 0) {
        //Display to the user that they won
        resultsDiv.text("You Won!! Game Over!!");
    }
    //There are still enemies to be defeated
    else {
        //Display to the user that they defeated the enemy and that they can choose another enemy to fight
        resultsDiv.text("You have defeated " + defenderName + ". You can choose to fight another enemy.");
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

//Set current helth points function
function setCurrentHealthPoints(characterDiv, healthPoints) {
    /*Set the character health span text to the health points*/
    characterDiv.find(".characterHealth span").text(healthPoints);
    /*Set current health points attribute*/
    characterDiv.attr("currentHealthPoints", healthPoints);
}

//Attach on click even to restart button
$("#restartButton").on("click", restart);

//Attach on click even to attack button
attackButton.on("click", attack);

//Attach on click even to character divs
$(".character").on("click", function(event){
    var characterDiv = $(this);

    //Your character has not been chosen
    if (!yourCharacterDiv) {
        characterChosen(characterDiv);
    }
    //Character has already been chosen
    else if (characterDiv &&
        characterDiv.hasClass("clickable")) {
        //Add the defender to the fight section
        addDefender(characterDiv);
    }
});

//Call the reset character health and attack function
resetCharacterCurrentHealthAndAttack();

//Hide the battle section initially
battleSectionDiv.hide();

