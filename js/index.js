//Based on a pen by Danie Clawson http://codepen.io/cl4ws0n/pen/YXXjWe

var ctx = document.body.appendChild(document.createElement('canvas')).getContext('2d'),
    points = [],
    angle = 0,
    dist = 1,
    maxDist = 200,
    increment = 16,
    v = new Voronoi();

window.onresize = function() {
  ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
  ctx.strokeStyle = 'darkred';
	ctx.lineWidth = 1;
};

window.onresize();

function update() {
  for(var i = 0; i < 2; i++) {
    points.unshift(new Point(
      ctx.canvas.width /2 + dist * Math.cos(angle),
      ctx.canvas.height /2 + dist * Math.sin(angle)
    ));

    dist = (dist + increment) % maxDist;
    angle += 1;
  }
  
  v.compute(points, ctx.canvas.width, ctx.canvas.height);
  
  if(points.length > 500) {
    var newCells = [];

    for(var c in v.cells) {
      var cellVerts = v.cells[c].vertices,
          base = new Point(0, 0);
      
      for(var cv in cellVerts) {
        var vert = cellVerts[cv];

        base.x += vert.x;
        base.y += vert.y;
      }

      base.x /= cellVerts.length;
      base.y /= cellVerts.length;
			
      if(base.x > -100 && base.y > -100 && base.x < ctx.canvas.width+100 && base.y < ctx.canvas.height+100)
      newCells.push(base);
    }

    points = newCells;

    v.compute(points, ctx.canvas.width, ctx.canvas.height);
  }
}

function draw() {
  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for(var c in v.cells) {
    var cell = v.cells[c].vertices;
    
		if(cell.length < 1) break;
    
    var dist = cell[0].distance(new Point(ctx.canvas.width/2,ctx.canvas.height/2), cell[0]);
    
    ctx.fillStyle = 'rgba('+
      (Math.min(1, (Math.max(0, 2 - dist / (ctx.canvas.width/4) ))) * 255)
      +','+
      (Math.min(1, (Math.max(0, 2 - dist / (ctx.canvas.width/4) ))) * 255)
      +','+
      (Math.min(1, (Math.max(0, 2 - dist / (ctx.canvas.width/4) ))) * 255)
      +',.05)';


    ctx.beginPath();

    ctx.moveTo(cell[0].x, cell[0].y);

    for(var vi in cell) {
      ctx.lineTo(cell[vi].x, cell[vi].y);
    }

    ctx.closePath();

    ctx.fill();
  }
  
  for(var e in v.edges) {
    var edge = v.edges[e];

    ctx.beginPath();

    ctx.moveTo(edge.start.x, edge.start.y);

    ctx.lineTo(edge.end.x, edge.end.y);

    ctx.stroke();
  }
}

function anim() {
  update();
  draw();
  
  requestAnimationFrame(anim);
}

anim();