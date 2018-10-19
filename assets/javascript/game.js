/*Define global variables*/
var yourCharacterDiv;
var defenderCharacterDiv;
var gameOver = false;
var resultsDiv = $(".result");
var attackButton = $("#attackButton");
var battleSectionDiv = $(".battleSection");
var selectCharacterSectionDiv = $(".selectCharacter");

/*Function will run when character is chosen*/
function characterChosen (characterDiv) {

    //Show the select battle section and hide the character select section
    selectCharacterSectionDiv.hide();
    battleSectionDiv.show();

    /*Set the selected character global variable to the current div*/
    yourCharacterDiv = characterDiv;

    /*Add isYourCharacter attribute to the characterDiv*/
    characterDiv.attr("isYourCharacter", "1");

    /*Move the selected character div from it's parent to the .yourCharacter div*/
    characterDiv.detach();
    $(".yourCharacter").append(characterDiv);

    /*Remove the clickable class from the selected character div*/
    characterDiv.removeClass("clickable");

    /*Move other characters to the enemies div */
    $(".character[isYourCharacter!='1']").each(function(){
        var enemyDiv = $(this).detach();
        enemyDiv.attr("isYourCharacter", "0");
        $(".enemies").append(enemyDiv);
    });
}

/*Function will add a defender to the fight section*/
function addDefender (enemyCharacterDiv) {
    
    //Clear the results div.
    resultsDiv.text("");

    defenderCharacterDiv = enemyCharacterDiv;

    enemyCharacterDiv.detach();
    $(".defender").append(enemyCharacterDiv);

    enemyCharacterDiv.removeClass("clickable");

    /* Remove clickable class from all enemy divs */
    $(".character[isYourCharacter!='1']").removeClass("clickable");

    /* Enable attack button */
    attackButton.prop('disabled', false);
}

/*Function will restart the game*/
function restart () {
    /* Reset global variables */
    yourCharacterDiv = undefined;
    defenderCharacterDiv = undefined;
    gameOver = false;

    //Show the select character section and hide the battle section
    selectCharacterSectionDiv.show();
    battleSectionDiv.hide();

    /* Disable the attack button */
    attackButton.prop('disabled', true);

    /*Reset the character health and attack*/
    resetCharacterCurrentHealthAndAttack();

    /*Clear the result div*/
    resultsDiv.text("");

    /*Loop through all the characters*/
    $(".character").each(function() {
        /* Move the characters back to the character select div */
        var characterDiv = $(this).detach();
        selectCharacterSectionDiv.append(characterDiv);

        /* Add the clickable class back */
        characterDiv.addClass("clickable");

        /* Remove the isYourCharacter and isDefeated attribute*/
        characterDiv.removeAttr("isYourCharacter").removeAttr("isDefeated");
    });
}

/*Function to reset all the characters health and attack*/
function resetCharacterCurrentHealthAndAttack() {
    
    /*Loop through all the characters*/
    $(".character").each(function() {
        var characterDiv = $(this);

        /*Get the healthPoints attribute value*/
        var healthPoints = characterDiv.attr("healthPoints");

        /*Set the characters current health points*/
        setCurrentHealthPoints(characterDiv, healthPoints);        

        /*Reset current attack power to attack power attribute*/
        characterDiv.attr("currentAttackPower", characterDiv.attr("attackPower"));
    });
}

function attack() {

    if (!gameOver) {
        var yourHealth = parseInt(yourCharacterDiv.attr("currentHealthPoints"));
        var yourAttackPower = parseInt(yourCharacterDiv.attr("currentAttackPower"));
        var yourOriginalAttackPower = parseInt(yourCharacterDiv.attr("attackPower"));

        var defenderHealth = parseInt(defenderCharacterDiv.attr("currentHealthPoints"));
        var defenderCounterAttackPower = parseInt(defenderCharacterDiv.attr("counterAttackPower"));

        var defenderName = defenderCharacterDiv.find(".characterName").text();

        resultsDiv.text("You attached " + defenderName + " for " + yourAttackPower + " damage. " + defenderName + " attacked you back for " + defenderCounterAttackPower + " damage.");

        defenderHealth -= yourAttackPower;
        yourHealth -= defenderCounterAttackPower;

        if (defenderHealth < 0) { defenderHealth = 0; }
        if (yourHealth < 0 ) { yourHealth = 0; }

        setCurrentHealthPoints(yourCharacterDiv, yourHealth);
        setCurrentHealthPoints(defenderCharacterDiv, defenderHealth);

        yourAttackPower += yourOriginalAttackPower;
        yourCharacterDiv.attr("currentAttackPower", yourAttackPower);

        if ((yourHealth === 0 && defenderHealth > 0) ||
            yourHealth === 0 && defenderHealth === 0) {

            playerLost();
        }
        else if (yourHealth > 0 && defenderHealth === 0) {
            playerDefeatedEnemy(defenderName);
        }    
    }
}

function playerDefeatedEnemy(defenderName) {

    //Assign the defeated flag
    defenderCharacterDiv.attr("isDefeated", "1");
    
    //Disable the attack button
    attackButton.prop('disabled', true);

    var undefeatedEnemies = $(".character[isYourCharacter !='1'][isDefeated != '1']");

    if (undefeatedEnemies.length <= 0) {
        resultsDiv.text("You Won!! Game Over!!");
    }
    else {
        resultsDiv.text("You have defeated " + defenderName + ". You can choose to fight another enemy.");
        undefeatedEnemies.addClass("clickable");
    }
}

function playerLost() {
    resultsDiv.text("You Lost!! Game Over!!");

    //Disable the attack button
    attackButton.prop('disabled', true);
}

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

