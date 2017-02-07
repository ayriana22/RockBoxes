/// <reference path="createjs-2015.11.26.min.js" />
// JavaScript Document
window.onload = function () {

    // assume this was created by an external builder being passed into this script
    var gameData = {
        terms: [
            {
                label: "Elbow",
                color: "blue",
                path: [
                    { x: 300, y: 0 },
                    { x: 390, y: 0 },
                    { x: 390, y: 200 },
                    { x: 200, y: 200 },
                    { x: 200, y: 100 },
                    { x: 300, y: 100 }
                ]
            },
            {
                label: "Knee",
                color: "red",
                path: [
                        { x: 100, y: 0 },
                        { x: 300, y: 0 },
                        { x: 300, y: 100 },
                        { x: 200, y: 100 },
                        { x: 200, y: 200 }
                ]
            },
            {
                label: "Face",
                color: "yellow",
                path: [
                        { x: 10, y: 20 },
                        { x: 20, y: 20 },
                        { x: 20, y: 10 },
                        { x: 30, y: 10 },
                        { x: 30, y: 30 },
                        { x: 10, y: 30 }
                ]
            },
            {
                label: "Neck",
                path: [
                        { x: 10, y: 20 },
                        { x: 20, y: 20 },
                        { x: 20, y: 10 },
                        { x: 30, y: 10 },
                        { x: 30, y: 30 },
                        { x: 10, y: 30 }
                ]
            }
        ],
        userImagePath: "background.jpg"
    };

    var theCanvas = document.getElementById("myCanvas");
    //create stage
    var stage = new createjs.Stage(theCanvas);
    //set ticker 
    createjs.Ticker.setFPS(60);

    function handleTick() {
        stage.update();

        // update the user's score label
        // eg: theUserScoreText.text = theUsersScore;
    }

    createjs.Ticker.on("tick", handleTick)

    //container for stage objects
    function initialize() {

        //create game objects
        var termsLibraryContainer, userScoreContainer, layer, rectangle;

        var mainBoxContainer = createMainBoxContainer();

        mainBoxContainer.x = 120;
        mainBoxContainer.y = 40;

        //create main game box layer to draw paths on and eventually upload image to maybe, or behind it. 
        //Don't forget to add to stage further down in script!

        layer = new createjs.Shape();
        layer.x = 120;
        layer.y = 40;
        layer.graphics.setStrokeStyle(1).beginFill("transparent");
        layer.graphics.drawRect(0, 0, 390, 440);





        //add terms library container
        termsLibraryContainer = createTermsLibraryContainer();
        termsLibraryContainer.x = 525;
        termsLibraryContainer.y = 40;


        //add user score container
        userScoreContainer = createUserScoreContainer();
        userScoreContainer.x = 525;
        userScoreContainer.y = 265;

        // adding elements to stage
        stage.addChild(mainBoxContainer, userScoreContainer, termsLibraryContainer);

        function createMainBoxContainer() {

            var container = new createjs.Container();

            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(1).beginStroke("black").beginFill("purple");
            background.graphics.drawRect(0, 0, 390, 440);

            container.addChild(background);


            // add the shapes here to the container
            // where there is one shape per term using the path property on each term

            //var rectangle = new createjs.Shape();
            //rectangle.graphics.beginStroke('#000');
            //rectangle.graphics.beginFill('#00FF00');
            //rectangle.graphics.moveTo(50, 0)
            //    .lineTo(50, 50)
            //    .lineTo(100, 50)
            //    .lineTo(100, 0)
            //    .lineTo(50, 0)
            //    .closePath;

            //rectangle.x = 20;
            //rectangle.y = 150;

            //container.addChild(rectangle);

            for (var i = 0; i < gameData.terms.length; ++i) {
                var termShape = new createjs.Shape();

                termShape.graphics.beginStroke('#000');
                termShape.graphics.beginFill(gameData.terms[i].color);
                termShape.graphics.moveTo(gameData.terms[i].path[0].x, gameData.terms[i].path[0].y);
                termShape.alpha = 0;
                for (var j = 1; j < gameData.terms[i].path.length; ++j) {

                    termShape.graphics.lineTo(gameData.terms[i].path[j].x, gameData.terms[i].path[j].y);

                }
                termShape.graphics.closePath();

                gameData.terms[i].target = termShape;

                container.addChild(termShape);
            }

            /*
            for each term in the gameData.terms
                draw the shape by:
                    MoveTo the first point
                    Lineto all subsequent points
                    then ClosePath when done
                add the shape to the container
            */


            return container;
        }

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

            for (var i = 0; i < gameData.terms.length; ++i) {
                var termContainer = createTermDraggableContainer(gameData.terms[i]);

                offset_x = Math.floor(i / numberOfItemsPerColumn);
                offset_y = i % numberOfItemsPerColumn;

                //create individual term
                termContainer.x = padding + (offset_x * 35);
                termContainer.y = padding + (offset_y * 25);
                termContainer.original_x = termContainer.x;
                termContainer.original_y = termContainer.y;

                gameData.terms[i].termContainer = termContainer;
                termContainer.termData = gameData.terms[i];

                container.addChild(termContainer);
            }


            return container;
        }

        function createTermDraggableContainer(data) {

            if (!data) {
                data = {}
            }


            var maxWidth = 30;

            //library of terms
            var container = new createjs.Container();

            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(1).beginStroke("black").beginFill("green");
            background.graphics.drawRect(0, 0, maxWidth, 20);

            var text = new createjs.Text(data.label);
            text.textAlign = "middle"
            text.lineWidth = maxWidth;


            container.on("pressmove", handleTermDrag);
            container.on("pressup", handleTermPressUp);

            var mouseDragPosition = null;

            container.addChild(background);
            container.addChild(text);

            //drag functionality
            function handleTermDrag(evt) {
                if (mouseDragPosition != null) {
                    var deltaX = evt.stageX - mouseDragPosition.x;
                    var deltaY = evt.stageY - mouseDragPosition.y;

                    evt.currentTarget.x += deltaX;
                    evt.currentTarget.y += deltaY;
                }

                mouseDragPosition = {
                    x: evt.stageX,
                    y: evt.stageY
                };
            }

            //determine if term is outside mainbox and return to terms library container
            function handleTermPressUp(evt) {
                mouseDragPosition = null;

                var theTermContainer = evt.currentTarget;
                var theCorrectTarget = evt.currentTarget.termData.target;

                var localMouseCoords = theCorrectTarget.globalToLocal(evt.stageX, evt.stageY);

                if (theCorrectTarget.hitTest(localMouseCoords.x, localMouseCoords.y)) {
                    alert("you rock!@");
                }
                else {
                    createjs.Tween.get(evt.currentTarget).to({ x: evt.currentTarget.original_x, y: evt.currentTarget.original_y }, 250);
                }

            }

            return container;
        }
        //Game Scores
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
            scoreText.text = "";
            scoreText.x = 30;
            scoreText.y = 20;
            container.addChild(scoreText);
            //Game score calculations - each correct answer gains the user 10 points. 

            var score = 0;
            //create var to hold score
            //calculate user score starting score + correct answer = current score


            return container;

            
            

            function updateScore() {
                if (theCorrectTarget = true) {
                    addScore = score + 10;
                    scoreText.text = (score(scoreText.text) + Number(value)).toString();

                    /* This is another idea for a score-keeping mechanism.
                    // Score
     
                    playerScore = new Text('0', 'bold 20px Arial', '#A3FF24');
                    playerScore.x = 211;
                    playerScore.y = 20;
     
                    cpuScore = new Text('0', 'bold 20px Arial', '#A3FF24');
                    cpuScore.x = 262;
                    cpuScore.y = 20;
     
                    stage.addChild(playerScore);
                    stage.update();
                    */


                }



            }


        }



        //reset button functionality
        function reset() {

            stage.removeAllChildren();
            initialize();

        }

        

    }

    initialize();
}