"use strict";
const cnv = document.getElementById('cnv'),
        c = cnv.getContext('2d'),
        r = 5,
        w = cnv.width  = innerWidth  + r*2,
        h = cnv.height = innerHeight + r*2,
        k = 100,
        s = r*2,
   points = [],
     hash = [];

cnv.style.position = 'absolute';
cnv.style.top  = -r + 'px';
cnv.style.left = -r + 'px';

c.shadowBlur = 10;
c.shadowColor = '#000';

function Point(x, y, f = 0) {
    this.x = x;
    this.y = y;
    this.n = Math.random()*k;
    this.from = f;
    this.active = true;
}

Point.prototype.draw = function() {
    if (this.from == 0) {
        c.fillStyle = '#f48'
    } else if (this.from == 1) {
        c.fillStyle = '#48f';
    } else if (this.from == 2) {
        c.fillStyle = '#8f4';
    } else if (this.from == 3) {
        c.fillStyle = '#fd4';
    }

    c.beginPath();
    c.arc(this.x, this.y, s/2, 0, Math.PI*2);
    c.fill();
}

for (let x = 0, len = Math.ceil(w/r); x < len; ++x) {
    hash[x] = [];

    for (let y = 0, len = Math.ceil(h/r); y < len; ++y) {
        hash[x][y] = [];
    }
}

for (let i = 0, seed; i < 3; i++) {
    do {
        seed = new Point(Math.random()*w, Math.random()*h, i)
    } while(collides(seed, points));
    points.push(seed);
    hash[Math.floor(seed.x/r)][Math.floor(seed.y/r)].push(seed);
    seed.draw();
}

function randDist() {
    return Math.random() * r + r;
}

function randNear(p) {
    let a = Math.random() * Math.PI * 2;
    let d = randDist();
    return new Point(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, p.from);
}

function collides(point, others) {
    if (point.x < 0 || point.x >= w || point.y < 0 || point.y >= h) {
        return true;
    }

    for (let i = 0; i < others.length; ++i) {
        if (others[i] == point) {
            continue;
        } else if (dist(point, others[i]) < r) {
            return true;
        }
    }

    return false;
}

function dist(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function draw() {
    for (let i = 0, len = points.length; i < len; ++i) {
        let it = points[i];

        let cands = [];

        for (let j = 0; it.active && j < k; ++j) {
            let test = randNear(it);
            test.n = j;
            let valid = true;

            let others = [];
            for (let dx = -1; dx < 2; dx++) {
                let hx = Math.floor(test.x/r) + dx;
                if (hash[hx] == undefined) continue;

                for (let dy = -1; dy < 2; dy++) {
                    let hy = Math.floor(test.y/r) + dy;
                    if (hash[hx][hy] == undefined) continue;

                    others.push(...hash[hx][hy]);
                }
            }

            if (!collides(test, others)) cands.push(test);
        }

        if (cands.length == 0) {
            it.active = false;
            continue;
        }

        let cand = cands.reduce((max, next) => {
            if (dist(it, next) > dist(it, max)) {
                return next;
            } else {
                return max;
            }
        }, it);

        points.push(cand);
        hash[Math.floor(cand.x/r)][Math.floor(cand.y/r)].push(cand);

        cand.draw();
    }


    if (points.filter(p => p.active).length == 0) {
        // setTimeout(()=>redraw(), 10000);
    } else {
        requestAnimationFrame(draw);
    }
}

// function redraw(re = 0) {
//     for (let i = 0; i < 100 && re < points.length; ++i, ++re) {
//         let point = points[points.length - 1 - re];
//         point.draw();
//     }
// 
//     requestAnimationFrame(()=>redraw(re+1));
// }

draw();
