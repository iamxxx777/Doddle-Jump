document.addEventListener('DOMContentLoaded', () => {
 
    //Constants and Variables
    const Grid = document.querySelector('.grid');
    const doddler = document.createElement('div');
    let startPoint = 150;
    let doddlerBottom = startPoint;
    let doddlerLeft = 50;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId, downTimerId, leftTimerId, rightTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let score = 0;

    function createDoddler() {
        doddler.setAttribute('class', 'doddler');
        Grid.appendChild(doddler);
        doddler.style.left = doddlerLeft + 'px';
        doddler.style.bottom = doddlerBottom + 'px';
    }

    //Platform Class
    class Platform {
        constructor(platformBottom) {
            this.left = Math.random() * 315;
            this.bottom = platformBottom;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom+ 'px';
            Grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (var a = 0; a < platformCount; a++) {
            let platGap = 600 / platformCount;
            let newPlatformBottom = 100 + a * platGap; 
            var platform = new Platform(newPlatformBottom);
            platforms.push(platform);
        }

        doddlerLeft = platforms[0].left;
    }

    // Move the platforms downwards and add new ones
    function movePlatforms() {
        if (doddlerBottom > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                // When the platforms get this low remove them from the
                // platforms array(and the display by removing its classList) and add new ones
                 
                if (platform.bottom < 10) {
                    var oldPlatform = platforms[0].visual;
                    oldPlatform.classList.remove('platform');
                    platforms.shift();
                    score++;

                    var newPlatform = new Platform(580);
                    platforms.push(newPlatform);
                }
            })
        }
    }

// Define the jump function and the height at which the doddler should slowly descend
    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function() {
            doddlerBottom += 20;
            doddler.style.bottom = doddlerBottom + 'px';

            if (doddlerBottom > startPoint + 300) {
                fall();
            }

        }, 30);
    }

// After the jump set the doodler to slowly descend when it reaches a certain height
    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function() {
            doddlerBottom -= 5;
            doddler.style.bottom = doddlerBottom + 'px';

            if (doddlerBottom <= 0) {
                gameOver();
            }

        // Make the doddler jump when its on a platform
            platforms.forEach(platform => {
                if ((doddlerBottom <= platform.bottom + 15) &&
                    (doddlerBottom >= platform.bottom) && 
                    ((doddlerLeft + 60) >= platform.left) &&
                    (doddlerLeft <= platform.left + 85) && 
                    !isJumping
                ) {
                    jump();
                }
            })
            
        }, 30);
    }

// Set the movement controls left, right and up    

    function moveUp() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }

        isGoingLeft = true;
        leftTimerId = setInterval(() => {
            if (doddlerLeft >= 0) {
                doddlerLeft -= 5;
                doddler.style.left = doddlerLeft + 'px';
            } else {
                moveRight();
            }
        }, 30);
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }

        isGoingRight = true;
        rightTimerId = setInterval(() => {
            if (doddlerLeft <= 340) {
                doddlerLeft += 5;
                doddler.style.left = doddlerLeft + 'px';
            } else moveLeft();
        }, 30)
    }
// Event listener to get the key that calls the defined function 
    function controls(e) {
        if(e.key == 'ArrowUp') {
            moveUp();
        } else if (e.key == 'ArrowLeft') {
            moveLeft();
        } else if (e.key == 'ArrowRight') {
            moveRight();
        }
    }

// Game Over
    function gameOver() {
        isGameOver = true;
        isGoingLeft = false;
        isGoingRight = false;

        // Remove all existing platforms when its game over
        while(Grid.hasChildNodes()) {
            Grid.removeChild(Grid.firstChild);
        }
        //Display the final score
        Grid.innerHTML = `
            <h1>Game Over</h1>
            <h2>Your Score is</h2> 
            <h3 class="score">${score}</h3>
        `;

        // Clear all intervals to prevent glitching
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        
    }

// Start the game
    function startGame() {
        if (!isGameOver) {
            createPlatforms();
            createDoddler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keydown', controls)
        }
    }

    startGame();


});