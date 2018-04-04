Game = {
    start: function () {
        var FramesPerSecond = 30;

        var canvas = document.getElementById("pong_canvas");
        // Make canvas as large as the parent div
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / FramesPerSecond)
            };

        this.runningGame = pong(canvas.width, canvas.height, canvas.getContext('2d'),
            animFrame);
    },
    restart: function () {
        this.runningGame.stop();
        this.start();
    }
};