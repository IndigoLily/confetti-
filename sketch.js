"use strict";
const cnv = document.getElementById('cnv'),
        c = cnv.getContext('2d'),
        w = cnv.width  = innerWidth, //512,
        h = cnv.height = innerHeight,//512,
        r = 10,
        k = 30,
        s = 20,
   points = [],
     hash = [];

c.shadowBlur = 10;
c.shadowColor = '#000';

for (let x = 0, len = Math.ceil(w/r); x < len; ++x) {
    hash[x] = [];

    for (let y = 0, len = Math.ceil(h/r); y < len; ++y) {
        hash[x][y] = [];
    }
}

{
    let seed = new Point(Math.random()*w, Math.random()*h);
    let seed2 = new Point(w - seed.x, h - seed.y);
    points.push(seed);
    points.push(seed2);
    hash[Math.floor(seed.x/r)][Math.floor(seed.y/r)].push(seed);
    hash[Math.floor(seed2.x/r)][Math.floor(seed2.y/r)].push(seed2);

    c.beginPath();
    c.arc(seed.x, seed.y, s/2, 0, Math.PI*2);
    c.fill();

    c.beginPath();
    c.arc(seed2.x, seed2.y, s/2, 0, Math.PI*2);
    c.fill();
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
}

function randDist() {
    return Math.random() * r / 2 + r;
}

function randNear(p) {
    let a = Math.random() * Math.PI * 2;
    let d = randDist();
    return new Point(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d);
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

        // get furthest valid candidate
        let cand = cands.reduce((max, next) => {
            if (dist(it, next) > dist(it, max)) {
                return next;
            } else {
                return max;
            }
        }, it);

        points.push(cand);
        hash[Math.floor(cand.x/r)][Math.floor(cand.y/r)].push(cand);

        let l = Math.floor((cand.n/(k-1))**1 * 200);
        c.fillStyle = `rgb(${l}, ${l}, ${l})`;
        c.beginPath();
        c.arc(cand.x, cand.y, s/2, 0, Math.PI*2);
        c.fill();
    }

    if (points.filter(p => p.active).length == 0) {
        //alert('done');
        return;
    } else {
        requestAnimationFrame(draw);
    }
}

draw();
