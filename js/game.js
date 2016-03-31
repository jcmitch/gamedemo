$(document).ready(function(){
    var game;
    var curX = 0;
    var curY = 0;
    var pageX = 0;
    var pageY = 0;

    var imageRepository = new function() {
        this.background = new Image();
        this.background.src = "images/bg.png";

        this.background1 = new Image();
        this.background1.src = "images/red.png";
        this.background2 = new Image();
        this.background2.src = "images/orange.png";
        this.background3 = new Image();
        this.background3.src = "images/yellow.png";
        this.background4 = new Image();
        this.background4.src = "images/green.png";
        this.background5 = new Image();
        this.background5.src = "images/blue.png";
        this.background6 = new Image();
        this.background6.src = "images/purple.png";
        this.background7 = new Image();
        this.background7.src = "images/pink.png";
        this.background8 = new Image();
        this.background8.src = "images/lblue.png";

        var loadImage = function(img) {
            var deferred = $.Deferred();
            img.onload = function() {
                deferred.resolve();
            };
            return deferred.promise();
        }
        $.when.apply(null, [loadImage(this.background), loadImage(this.background1), loadImage(this.background2), loadImage(this.background3), loadImage(this.background4), loadImage(this.background5), loadImage(this.background6), loadImage(this.background7), loadImage(this.background8)]).done(function() {
            initGame();
        });
    };

    function Drawable() {
        this.init = function(x, y) {
            this.x = x;
            this.y = y;
        };
        this.speed = 0;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.draw = function() {};
    }

    function Background() {
        this.draw = function(maxXPages, maxYPages) {
            // Check bounds
            if (pageX === 0 && curX > 0) {
                curX = 0;
            }
            if (pageX === maxXPages-1 && curX < 0) {
                curX = 0;
            }
            if (pageY === 0 && curY < 0) {
                curY = 0;
            }
            if (pageY === maxYPages-1 && curY > 0) {
                curY = 0;
            }
            this.x = curX;
            this.y = curY;

            // row above
            if (pageY < maxYPages) {
                if (pageX > 0) {
                    this.context.drawImage(imageRepository.background1, this.x - this.canvasWidth, this.y - this.canvasHeight, this.canvasWidth, this.canvasHeight);
                }
                this.context.drawImage(imageRepository.background2, this.x, this.y - this.canvasHeight, this.canvasWidth, this.canvasHeight);
                if (pageX < maxXPages) {
                    this.context.drawImage(imageRepository.background3, this.x + this.canvasWidth, this.y - this.canvasHeight, this.canvasWidth, this.canvasHeight);
                }
            }
            // middle
            if (pageX > 0) {
                this.context.drawImage(imageRepository.background4, this.x - this.canvasWidth, this.y, this.canvasWidth, this.canvasHeight);
            }
            this.context.drawImage(imageRepository.background, this.x, this.y, this.canvasWidth, this.canvasHeight);
            if (pageX < maxXPages) {
                this.context.drawImage(imageRepository.background5, this.x + this.canvasWidth, this.y, this.canvasWidth, this.canvasHeight);
            }
            // row below
            if (pageY > 0) {
                if (pageX > 0) {
                    this.context.drawImage(imageRepository.background6, this.x - this.canvasWidth, this.y + this.canvasHeight, this.canvasWidth, this.canvasHeight);
                }
                this.context.drawImage(imageRepository.background7, this.x, this.y + this.canvasHeight, this.canvasWidth, this.canvasHeight);
                if (pageX < maxXPages) {
                    this.context.drawImage(imageRepository.background8, this.x + this.canvasWidth, this.y + this.canvasHeight, this.canvasWidth, this.canvasHeight);
                }
            }

            // move pane
            if (this.x > this.canvasWidth) {
                this.x = this.canvasWidth;
                curX = 0;
                pageX--;
            } else if (this.x < -this.canvasWidth) {
                this.x = 0;
                curX = this.x;
                pageX++;
            }
            if (this.y > this.canvasHeight) {
                this.y = 0;
                curY = this.y;
                pageY++;
            } else if (this.y < -this.canvasHeight) {
                this.y = this.canvasHeight;
                curY = 0;
                pageY--;
            }
        };
    }
    Background.prototype = new Drawable();

    function Game() {
        this.init = function(xPages, yPages) {
            this.xPages = xPages;
            this.yPages = yPages;
            this.bgCanvas = document.getElementById('background');
            if (this.bgCanvas.getContext) {
                this.bgContext = this.bgCanvas.getContext('2d');
                Background.prototype.context = this.bgContext;
                Background.prototype.canvasWidth = this.bgCanvas.width;
                Background.prototype.canvasHeight = this.bgCanvas.height;
                this.background = new Background();
                this.background.init(0,0);
                return true;
            } else {
                return false;
            }
        };

        this.start = function() {
            drawBackground();
        };
    }

    function drawBackground() {
        game.background.draw(game.xPages, game.yPages);
    }

    $(document).keydown(function(e) {
        var moveSpeed = 3;
        switch (e.which) {
            case 37: //left
            curX+=moveSpeed;
            break;
            case 38: //up
            curY+=moveSpeed;
            break;
            case 39: //right
            curX-=moveSpeed;
            break;
            case 40: //down
            curY-=moveSpeed;
            break;
            default:
            return;
        }
        e.preventDefault();
        requestAnimFrame(drawBackground);
    });

    /**
     * requestAnim shim layer by Paul Irish
     * Finds the first API that works to optimize the animation loop,
     * otherwise defaults to setTimeout().
     */
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame   ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    function initGame() {
        game = new Game();
        if(game.init(2, 2)) {
            game.start();
        }
    }
});