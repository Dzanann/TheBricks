    var x = 180;
    var y = 300;
    var dx = 2;
    var dy = 4;
    var ctx;
    var canvas;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var intervalId; //interval, vsakih 10ms

    var paddlex;
    var paddleh;
    var paddlew;

    var rightDown = false;
    var leftDown = false;

    var canvasMinX;
    var canvasMaxX;

    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;

    var tocke; //spremenljivka za tocke

    //timer
    var sekunde;
    var sekundeI;
    var minuteI;
    var intTimer;
    var izpisTimer;

    //boolean za start
    var start = true;

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        ctx.fillStyle='rgba(255, 255, 255, 0.9)';
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        intervalId = setInterval(draw, 10);
        init_paddle();

        //premik s tipkami
        $(document).on("keydown", onKeyDown);
        $(document).on("keyup", onKeyUp);

        //premik z misko
        init_mouse();

        initbricks();

        
        //tocke
        tocke = 0;
        $("#tocke").html(tocke); //stevec tock

        //zacetek timerja
        sekunde = 0;
        izpisTimer = "00:00";
        $("#cas").html(izpisTimer); //zacetni timer

        var brickImage = new Image();
        brickImage.src = 'img/brick.png';

        var brickImage1 = new Image();
        brickImage1.src = 'img/brick1.png';

        var brickImage2 = new Image();
        brickImage2.src = 'img/brick2.png';

        var brickImage3 = new Image();
        brickImage3.src = 'img/brick3.png';
    }

    function draw() {
        clear();
        circle(x, y, 10);

        //premik ploscice levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        } else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }

        rowheight = BRICKHEIGHT + PADDING;
        colwidth = BRICKWIDTH + PADDING;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            dy = -dy;
            bricks[row][col] = 0;
            tocke += 1; //stevec tock
            $("#tocke").html(tocke); //obnovi stevec tock
            if(tocke==(NROWS*NCOLS)){       //ce je stevilo tock enako stevilu opek, ustavi igro 
                clearInterval(intervalId);
                Swal.fire({
                    title: 'Congratulations!',
                    text: 'You have finished the game!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                clear();
            }
        }
        if (x + dx > WIDTH - r || x + dx < 0 + r)
            dx = -dx;
        if (y + dy < 0 + r)
            dy = -dy;
        else if (y + dy > HEIGHT - (r + paddleh)) {
            if (x > paddlex && x < paddlex + paddlew) {
                //spremeni pot zoge
                dy = -dy;
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                start = true; //zacne timer
            } else if (y + dy > HEIGHT - r){
                clearInterval(intervalId);
                Swal.fire({
                    title: 'Game Over',
                    text: 'You lost the game! Press "Restart" to try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }            

        x += dx;
        y += dy;

        //timer
        if (start == true) {
            sekunde++;
            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;
            $("#cas").html(izpisTimer);
        } else {
            sekunde = 0;
            izpisTimer = "00:00";
            $("#cas").html(izpisTimer);
        }
    }

    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 75;
    }

    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (evt.which == 39)
            rightDown = true;
        else if (evt.which == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.which == 39)
            rightDown = false;
        else if (evt.which == 37) leftDown = false;
    }

    function init_mouse() {
        canvasMinX = $("canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH;

        //premik plosce z miško
        $(document).on("mousemove", onMouseMove);
    }

    function onMouseMove(evt) {
        var mouseX = evt.pageX - canvasMinX;
        if (mouseX > 0 && mouseX < WIDTH) {
            paddlex = mouseX - paddlew / 2;
            //da ne gre ven iz canvasa
            if (paddlex < 0) {
                paddlex = 0;
            } else if (paddlex + paddlew > WIDTH) {
                paddlex = WIDTH - paddlew;
            }
        }
    }

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 6;
        NCOLS = 6;
        BRICKWIDTH = (WIDTH / NCOLS) - 1;
        BRICKHEIGHT = 30;
        PADDING = 1;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                bricks[i][j] = 1;
            }
        }
    }

    document.getElementById("restart").addEventListener("click", function() {
        location.reload();
    }
);