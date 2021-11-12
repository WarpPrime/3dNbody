function draw() {
    var canvas = document.getElementById("topview");
    var ctx = canvas.getContext("2d");
    var canvas2 = document.getElementById("sideview");
    var ctx2 = canvas2.getContext("2d");

    var radius = 0.5;

    var a;

    var zoom = 1/1e8;
    var zoom2 = 1/1e8;
    
    var i,j;

    for (i in objects) {
    // for (i in objhistory) {
        // for (j in objects)
            // a = objhistory[i][j];

            a = objects[i];

            ctx.beginPath();
            ctx.arc(a.x * zoom + canvas.width/2, a.y * zoom +  canvas.height/2, radius, 0, 2 * Math.PI, false);
            // console.log(a.color);
            ctx.fillStyle = a.color;
            ctx.fill();

            ctx2.beginPath();
            ctx2.arc(a.x * zoom2 + canvas2.width/2, a.z * zoom2 +  canvas2.height/2, radius, 0, 2 * Math.PI, false);
            // console.log(a.color);
            ctx2.fillStyle = a.color;
            ctx2.fill();
    }

    nbody();
}

var simulation = setInterval(draw,0.001);
