/// <reference path="createjs-2015.11.26.min.js" />
// JavaScript Document
window.onload = function () {

    var theCanvas = document.getElementById("myCanvas");
    //create stage
    var stage = new createjs.Stage(theCanvas);
    //set ticker 
    createjs.Ticker.setFPS(40);

    function handleTick() {
        stage.update();
    }

    createjs.Ticker.on("tick", handleTick)

    //container for stage objects
    function initialize() {

        //create game objects
        var mainBox, library, userScoreContainer, termsLibrary, term;

        // Main game box
        mainBox = new createjs.Shape();
        mainBox.x = 120;
        mainBox.y = 40;
        mainBox.graphics.setStrokeStyle(1).beginStroke("black").beginFill("red");
        mainBox.graphics.drawRect(0, 0, 390, 440);

        // terms library container
        function library() {
            library = new createjs.Shape();
            library.x = 525;
            library.y = 40
            library.graphics.setStrokeStyle(1).beginStroke("black").beginFill("yellow");
            library.graphics.drawRect(0, 0, 100, 210);

            //library of terms
            termsLibrary = new createjs.Shape();

        }


        function createUserScoreContainer() {
            //user score container
            var container = new createjs.Container();
      
            //user score backgound
            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(1).beginStroke("black").beginFill("blue");
            background.graphics.drawRect(0, 0, 100, 50);
            container.addChild(background);

            //user score title
            var scoreLabel = new createjs.Text();
            scoreLabel.color = "white";
            scoreLabel.text = "Score:";
            container.addChild(scoreLabel);

            //user score score
            var scoreText = new createjs.Text();
            scoreText.color = "white";
            scoreText.text = 900;
            container.addChild(scoreText);

            return container;
        }

        userScoreContainer = createUserScoreContainer();
        userScoreContainer.x = 525;
        userScoreContainer.y = 265;

        // adding elements to stage
        stage.addChild(mainBox, termsLibrary, userScoreContainer);

        var terms = [];

        var offset_x, offset_y;
        var numberOfItemsPerColumn = 5;
        for (var i = 0; i < 10; ++i) {

            offset_x = Math.floor(i / numberOfItemsPerColumn);
            offset_y = i % numberOfItemsPerColumn;

            //create individual term
            term = new createjs.Shape();
            term.x = 530 + (offset_x * 35);
            term.y = 45 + (25 * offset_y);
            term.graphics.setStrokeStyle(1).beginStroke("black").beginFill("green");
            term.graphics.drawRect(0, 0, 30, 20);
            term.original_x = term.x;
            term.original_y = term.y;

            term.on("pressmove", handleTermDrag);
            term.on("pressup", handleTermPressUp)

            terms.push(term);
            stage.addChild(term);
        }

        function handleTermDrag(evt) {

            evt.currentTarget.x = evt.stageX;
            evt.currentTarget.y = evt.stageY;
        }

        function handleTermPressUp(evt) {
            if (!mainBox.hitTest(evt.stageX - mainBox.x, evt.stageY - mainBox.y)) {

                createjs.Tween.get(evt.currentTarget).to({ x: evt.currentTarget.original_x, y: evt.currentTarget.original_y }, 250);
            }
        }
    }

    function reset() {

        stage.removeAllChildren();
        initialize();

    }

    initialize();
}