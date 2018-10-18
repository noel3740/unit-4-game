var selectedCharacterDiv;

var obiWan = {
    name: "Obi-Wan Kenobi",
    healthPoints: 120,
    attackPower: 6,
    counterAttackPower: 20,
    image: 'ObiWan.jpg',
    isYourCharacter: false
}

var luke = {
    name: "Luke Skywalker",
    healthPoints: 120,
    attackPower: 6,
    counterAttackPower: 20,
    image: 'Luke.jpg',
    isYourCharacter: false
}

/* var characters = [];

function initializeVariables() {
    $(".character").each(function(index, characterCardDiv) {
        characters.push(characterCardDiv);
    });
} 
initializeVariables();
*/

function characterChosen (characterDiv) {
    /*Move the selected character div from it's parent to the .yourCharacter div*/
    characterDiv.detach();
    $(".yourCharacter").append(characterDiv);

    /*Set the selected character global variable to the current div*/
    selectedCharacterDiv = characterDiv;

    /*Remove the clickable class from the selected character div*/
    characterDiv.removeClass("clickable");
}


$(".character").on("click", function(event){
    if (!selectedCharacterDiv) {
        characterChosen($(event.currentTarget));
    }
});


/* var character = [obiWan, luke];

var characterCardHTML = 
'<div class="card bg-dark text-white text-center character clickable"> \
    <img class="card-img characterImg" src="assets/images/DarthSidious.jpg" alt="Card image"> \
    <div class="card-img-overlay"> \
        <h5 class="card-title characterName">Darth Sidious</h5> \
        <p class="card-text align-bottom characterHealth">Health: <span></span></p> \
    </div> \
</div>'

 function createCharacterDivs () {
    $.each(characters, function(index, character){
        var characterCardDiv = $("<div>");
        characterCardDiv.addClass("card bg-dark text-white text-center character clickable");
        
        var characterImg = $("<img>");
        characterImg.attr("src", "assets/images/" + character.image);
        characterImg.attr("alt", character.name + " image");
        characterImg.addClass("card-img characterImg");
        characterCardDiv.append(characterImg);

        var cardOverlayDiv = $("<div>");
        cardOverlayDiv.addClass("card-img-overlay");

        var cardTitle = $("<h5>");
        cardTitle.addClass("card-title characterName");
        cardTitle.text(character.name);
        cardOverlayDiv.append(cardTitle);

        var cardHealth = $("<p>");
        cardHealth.addClass("card-text align-bottom characterHealth");
        var cardHealthSpan = $("")



        $('#characterSelect').append(characterImg);
    });
}
 
createCharacterDivs();
 */