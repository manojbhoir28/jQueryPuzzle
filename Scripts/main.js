// This is a JavaScript event. It means - once DOM is finished loading,
// execute everything inside the callback function scope
// This is where we initialize the game
$(document).ready(function() {
    // Initialize the game and create the plugin

    // When the squares swap places, the moving square must always appear on top
    var zi = 1; // We increment z-index each time a square is shifted

    // The index of the empty square by default, the 16th square
    var EmptySquare = 16;


    var LastSquare;

    var TotalMoves = 0;

    var FreezPuzzle = false;
    // Now, this is where we create the plugin and call it fifteen.
 
    $.fn.extend({ fifteen:
 
        function(square_size, puzzle_image) {
            // Grab the id of the HTML element into which we are placing the game,
            // it is the selector - "#game_object" from  $("#game_object").fifteen(175);
            var gameObjectElement = '#' + $(this).attr('id'); 
 
            var sqSize = square_size + 'px';
            var boardSize = (square_size * 4) + 'px';

            // Inject DIV into game_object, this is our game board
            $(gameObjectElement).html('<div id="board"></div>'); 

            $('#board').css({ position:'absolute', width: boardSize, height: boardSize, border: '1px solid gray' });

            // Populate the game board's HTML container with 15 squares
            for (var i = 0; i < 16; i++) {
                //$('#board').children('div').css("background", "#ffffff url(CSS/Puzzle2.jpg) no-repeat 0 0");
                // A dirty way to create an arbitrary DIV and append it into HTML dynamically
                // Notice each square uses the same image. It just uses a different x/y offset for each square
                $('#board').append("<div id=" + i + " style='background: #ffffff url(" + puzzle_image + ") no-repeat; left: " + ((i % 4) * square_size) + "px; top: " + Math.floor(i / 4) * square_size + "px; width: " + square_size + "px; height: " + square_size + "px; background-position: " + (-(i % 4) * square_size) + "px " + -Math.floor(i / 4) * square_size + "px '></div>");
            }
            
            // Empty up the 16th square, as the starting point
            // EmptySquare = 16
            $('#board').children("div:nth-child(" + EmptySquare + ")").css({backgroundImage: "", background: "#ffffff"});

            // Attach click event to each square
            $('#board').children('div').click(function () {
                if (!FreezPuzzle)
                    Move(this, square_size);
                
            });
        }
    });

    // Move() is the function that is called when a square is clicked
    // Note that it is independent of the plugin itself which is described above
    // It takes two parameters,
    //     1. object handle to the square that was clicked, and
    //     2. the width of the square
    function Move(clicked_square, square_size) {
        // We need to locate movable tiles based on where the empty spot is,
        // We can only move the four surrounding squares
        var movable = false;

        // Swap x/y between the clicked square and the currently empty square
        var oldx = $('#board').children("div:nth-child(" + EmptySquare + ")").css('left');
        var oldy = $('#board').children("div:nth-child(" + EmptySquare + ")").css('top');

        var newx = $(clicked_square).css('left');
        var newy = $(clicked_square).css('top');
 
        // The clicked square is north of the empty square
        if (oldx == newx && newy == (parseInt(oldy) - square_size) + 'px')
            movable = true;
 
        // The clicked square is south of the empty square
        if (oldx == newx && newy == (parseInt(oldy) + square_size) + 'px')
            movable = true;
 
        // The clicked square is west of the empty square
        if ((parseInt(oldx) - square_size) + 'px' == newx && newy == oldy)
            movable = true;
 
        // The clicked square is east of the empty square
        if ((parseInt(oldx) + square_size) + 'px' == newx && newy == oldy)
            movable = true;
 
        if (movable) {
            // Increment zindex so the new tile is always on top of all others
            $(clicked_square).css('z-index', zi++);
 
            // Swap squares... Animate new square into old square position
            $(clicked_square).animate({ left: oldx, top: oldy }, 200, function() {
                //Move old square into new square position
                $('#board').children("div:nth-child(" + EmptySquare + ")").css('left', newx);
                $('#board').children("div:nth-child(" + EmptySquare + ")").css('top', newy);
                validatepuzzle();
            });

            TotalMoves = TotalMoves + 1;
            $('#totalmoves').text(TotalMoves);
            $('#lblstatus').text('In Progress');
            
        }
    }
    $.fn.extend({
        randomize:
            function (puzzlediv) {
                var divs = $("#board").find('div');
                divs = shuffle(divs);
                for (var i = 0; i < divs.length; i++) {
                    var j = makeUniqueRandom();
                    var leftpx = ((i % 4) * 100);
                    var toppx = Math.floor(i / 4) * 100;
                    $(divs[i]).css('left', toppx + 'px');
                    $(divs[i]).css('top', leftpx + 'px');
                    LastSquare = divs[i];
                };
                for (var i = 0; i < divs.length; i++) {
                    if ($(divs[i]).css("backgroundImage") == "none") {
                        var leftpx = $(divs[i]).css('left');
                        var toppx = $(divs[i]).css('top');
                        var lastsqr = $(LastSquare);
                        $(lastsqr).css('left', leftpx);
                        $(lastsqr).css('top', toppx);
                        $(divs[i]).css('left', '300px');
                        $(divs[i]).css('top', '300px');
                    }
                };
                TotalMoves = 0;
                FreezPuzzle = false;
                blinkeffect('#gamestatus', false);
                $('#totalmoves').text(TotalMoves);
            }

    });

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
   
    function validatepuzzle() {
        var divs = $("#board").find('div');
        var iscomplete = true;
        for (var i = 0; i < divs.length; i++) {
            var divid = $(divs[i]).attr('id');
                var leftpx = $(divs[i]).css('left');
                var toppx = $(divs[i]).css('top');
                if (divid == 0 && (leftpx != '0px' || toppx != '0px'))
                    iscomplete = false;
                if (divid == 1 && (leftpx != '100px' || toppx != '0px'))
                    iscomplete = false;
                if (divid == 2 && (leftpx != '200px' || toppx != '0px'))
                    iscomplete = false;
                if (divid == 3 && (leftpx != '300px' || toppx != '0px'))
                    iscomplete = false;
                if (divid == 4 && (leftpx != '0px' || toppx != '100px'))
                    iscomplete = false;
                if (divid == 5 && (leftpx != '100px' || toppx != '100px'))
                    iscomplete = false;
                if (divid == 6 && (leftpx != '200px' || toppx != '100px'))
                    iscomplete = false;
                if (divid == 7 && (leftpx != '300px' || toppx != '100px'))
                    iscomplete = false;
                if (divid == 8 && (leftpx != '0px' || toppx != '200px'))
                    iscomplete = false;
                if (divid == 9 && (leftpx != '100px' || toppx != '200px'))
                    iscomplete = false;
                if (divid == 10 && (leftpx != '200px' || toppx != '200px'))
                    iscomplete = false;
                if (divid == 11 && (leftpx != '300px' || toppx != '200px'))
                    iscomplete = false;
                if (divid == 12 && (leftpx != '0px' || toppx != '300px'))
                    iscomplete = false;
                if (divid == 13 && (leftpx != '100px' || toppx != '300px'))
                    iscomplete = false;
                if (divid == 14 && (leftpx != '200px' || toppx != '300px')) {
                   
                    iscomplete = false;
                }
                if (divid == 15 && (leftpx != '300px' || toppx != '300px')) {
                    iscomplete = false;
                   // alert(i + ' | ' + leftpx + ' | ' + toppx);
                }
        };
        if (iscomplete) { FreezPuzzle = true; $('#txtscore').text(TotalMoves * makeUniqueRandom()); $('#lblstatus').text('Completed'); blinkeffect('#gamestatus', true); }
    }

    function blinkeffect(selector, flag) {
        
        $(selector).fadeOut('slow', function() {
            $(this).fadeIn('slow', function () {
                $(this).css('color', 'green');
                //if (flag) blinkeffect(this, true);
            });
        });
    }

    var uniqueRandoms = [];
    var numRandoms = 15;
    function makeUniqueRandom() {
        // refill the array if needed
        if (!uniqueRandoms.length) {
            for (var i = 0; i < numRandoms; i++) {
                uniqueRandoms.push(i);
            }
        }
        var index = Math.floor(Math.random() * uniqueRandoms.length);
        var val = uniqueRandoms[index];

        // now remove that value from the array
        uniqueRandoms.splice(index, 1);

        return val;

    }

    // Ok, we're ready to initialize the game, let's do it.
    // Create a game with 175 by 175 squares inside "#game_object" div:
    $('#game_object').fifteen(100, 'CSS/Puzzle1.jpg');
    $("#board").randomize();
   

    

});

$(document).bind("contextmenu", function (event) {
    event.preventDefault();
    $("div.custom-menu").hide();
    $("<div class='custom-menu'>Copyright &copy; " + new Date().getFullYear() + " Manoj Kishor Bhoir</div>")
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + "px" });

}).bind("click", function (event) {
    $("div.custom-menu").hide();
});


