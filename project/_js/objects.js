var paddle = function (gameWidth, gameHeight, posX, posY) {
    var MaxWidth = 10;
    var MaxHeight = 35;
    var MinWidthRatio = 50;
    var MinHeightRatio = 3;
    var RecoilDelta = 3;
    var MaxVel = 5;

    var Width = (gameWidth / MinWidthRatio < MaxWidth) ? gameWidth / MinWidthRatio : MaxWidth;
    var Height = (gameHeight / MinHeightRatio < MaxHeight) ? gameHeight / MinHeightRatio : MaxHeight;
    var Color = "#FFFFFF";
    var DefaultPosX = posX;

    return {
        update: function (ball) {
            // Only move if it's close to the ball
            if ((posX > gameWidth / 2 && ball.getVelX() > 0 && ball.getX() > gameWidth / 2) ||
                (posX < gameWidth / 2 && ball.getVelX() < 0 && ball.getX() < gameWidth / 2)) {
                // Make sure paddle doesn't go too fast
                var deltaY = ball.getY() - this.getPosY();
                var maxDeltaY = deltaY && deltaY / Math.abs(deltaY) * MaxVel;

                if (deltaY > 0) {
                    this.movePosY((deltaY > maxDeltaY) ? maxDeltaY : deltaY);
                } else {
                    this.movePosY((deltaY < maxDeltaY) ? maxDeltaY : deltaY);
                }
            }
            posX = lerp(posX, DefaultPosX, .1);
        },
        render: function (ctx) {
            ctx.fillStyle = Color;
            ctx.fillRect(posX - Width / 2,
                posY - Height / 2,
                Width, Height);
        },
        getPosY: function () {
            return posY;
        },
        movePosY: function (deltaPosY) {
            posY += deltaPosY;

            // Clamp to top and bottom game bounds
            if (posY + Height / 2 > gameHeight) {
                posY = gameHeight - Height / 2;
            } else if (posY - Height / 2 < 0) {
                posY = Height / 2;
            }
        },
        recoil: function (isRightRecoil) {
            posX = DefaultPosX + (isRightRecoil ? RecoilDelta : -1 * RecoilDelta);
        },
        ballCollide: function (ball) {
            return posX + Width > ball.getX() &&
                posX - Width < ball.getX() &&
                posY + Height > ball.getY() &&
                posY - Height < ball.getY()
        }
    }
};

var pongBall = function (gameBounds, leftPaddle, rightPaddle) {
    var StartX = gameBounds.width / 2;
    var StartY = gameBounds.height / 2;
    var StartVelX = 3;
    var StartVelY = 2;
    var Color = '#FFFFFF';
    var Width = 5;

    var posX = StartX;
    var posY = StartY;
    var velX = StartVelX;
    var velY = StartVelY;

    return {
        update: function () {
            posX += velX;
            posY += velY;
            if (posX < 0 || posX > gameBounds.width) {
                velX *= -1;
                this.restart();
            } else if (posY < 0 || posY > gameBounds.height) {
                velY *= -1;
                this.update();
            } else if (rightPaddle.ballCollide(this)) {
                rightPaddle.recoil(true);
                velX *= -1;
            } else if (leftPaddle.ballCollide(this)) {
                leftPaddle.recoil(false);
                velX *= -1;
            }
        },
        render: function (ctx) {
            ctx.fillStyle = Color;
            ctx.fillRect(posX - Width / 2, posY - Width / 2, Width, Width);
        },
        restart: function () {
            posX = StartX;
            posY = StartY;
            velX = StartVelX;
            velY = StartVelY;
        },
        getVelX: function() {
            return velX;
        },
        getX: function () {
            return posX;
        },
        getY: function () {
            return posY;
        }
    }
};

function lerp(x1, x2, t) {
    return x1 + t * (x2 - x1);
}