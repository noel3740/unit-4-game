var yourCharacterDiv;
var defenderCharacterDiv;


function characterChosen (characterDiv) {
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

function addDefender (enemyCharacterDiv) {
    
    defenderCharacterDiv = enemyCharacterDiv;

    enemyCharacterDiv.detach();
    $(".defender").append(enemyCharacterDiv);

    enemyCharacterDiv.removeClass("clickable");

    /* Remove clickable class from all enemy divs */
    $(".character[isYourCharacter!='1']").removeClass("clickable");

    /* Enable attack button */
    $("#attackButton").prop('disabled', false);
}

function restart () {
    console.log("got here");

    /* Reset global variables */
    yourCharacterDiv = undefined;
    defenderCharacterDiv = undefined;

    /* Disable the attack button */
    $("#attackButton").prop('disabled', true);

    $(".character").each(function() {
        /* Move the characters back to the character select div */
        var characterDiv = $(this).detach();
        $(".selectCharacter").append(characterDiv);

        /* Add the clickable class back */
        characterDiv.addClass("clickable");

        /* Remove the isYourCharacter attribute*/
        characterDiv.removeAttr("isYourCharacter");
    });
}

$("#restartButton").on("click", restart);

$(".character").on("click", function(event){
    var characterDiv = $(this);

    if (!yourCharacterDiv) {
        characterChosen(characterDiv);
    }
    else if (characterDiv &&
        characterDiv.hasClass("clickable")) {
        addDefender(characterDiv);
    }
});

