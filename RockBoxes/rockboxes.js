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
        var mainBox, termsLibraryContainer, userScoreContainer;

        // Main game box
        mainBox = new createjs.Shape();
        mainBox.x = 120;
        mainBox.y = 40;
        mainBox.graphics.setStrokeStyle(1).beginStroke("black").beginFill("red");
        mainBox.graphics.drawRect(0, 0, 390, 440);

        //add terms library container
        termsLibraryContainer = createTermsLibraryContainer();
        termsLibraryContainer.x = 525;
        termsLibraryContainer.y = 40;

        // terms library container
        function createTermsLibraryContainer() {

            //library container
            var container = new createjs.Container();

            //library background
            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(1).beginStroke("black").beginFill("yellow");
            background.graphics.drawRect(0, 0, 100, 210);
            container.addChild(background);

            var offset_x, offset_y;
            var numberOfItemsPerColumn = 5;
            var padding = 5;


            for (var i = 0; i < 10; ++i) {
                var termContainer = createIndividualTerms();

                offset_x = Math.floor(i / numberOfItemsPerColumn);
                offset_y = i % numberOfItemsPerColumn;

                //create individual term
                termContainer.x = padding + (offset_x * 35);
                termContainer.y = padding + (offset_y * 25);
                termContainer.original_x = termContainer.x;
                termContainer.original_y = termContainer.y;


                container.addChild(termContainer);
            }
            

            return container;
        }

        function createIndividualTerms() {
            //library of terms
            var container = new createjs.Container();

            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(1).beginStroke("black").beginFill("green");
            background.graphics.drawRect(0, 0, 30, 20);

            //create individual term
            var term = new createjs.Shape();
            term.graphics.setStrokeStyle(1).beginStroke("black").beginFill("green");
            term.graphics.drawRect(0, 0, 30, 20);

            container.on("pressmove", handleTermDrag);
            container.on("pressup", handleTermPressUp)

            
            container.addChild(term);
            container.addChild(background);


            //drag functionality
            function handleTermDrag(evt) {

                evt.currentTarget.x = evt.stageX;
                evt.currentTarget.y = evt.stageY;
            }

            //determine if term is outside mainbox and return to terms library container
            function handleTermPressUp(evt) {
                if (!mainBox.hitTest(evt.stageX - mainBox.x, evt.stageY - mainBox.y)) {

                    createjs.Tween.get(evt.currentTarget).to({ x: evt.currentTarget.original_x, y: evt.currentTarget.original_y }, 250);

                }
            }

            return container;
        }

        function createUserScoreContainer() {
            //user score container
            var container = new createjs.Container();

            //user score background
            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(1).beginStroke("black").beginFill("blue");
            background.graphics.drawRect(0, 0, 100, 50);
            container.addChild(background);

            //user score title
            var scoreLabel = new createjs.Text("", "15px Verdana", "");
            scoreLabel.color = "white";
            scoreLabel.text = "Score:";
            scoreLabel.x = 25;
            scoreLabel.y = 2;
            container.addChild(scoreLabel);

            //user score score
            var scoreText = new createjs.Text("", "20px Verdana", "");
            scoreText.color = "orange";
            scoreText.text = 900; //this will need to change later to be a var to hold user score. 
            scoreText.x = 30;
            scoreText.y = 20;
            container.addChild(scoreText);
            return container;
        }

        //add user score container
        userScoreContainer = createUserScoreContainer();
        userScoreContainer.x = 525;
        userScoreContainer.y = 265;



        // adding elements to stage
        stage.addChild(mainBox, userScoreContainer, termsLibraryContainer);

    }

    //reset button functionality
    function reset() {

        stage.removeAllChildren();
        initialize();

    }

    initialize();
}