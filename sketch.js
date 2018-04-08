const cnv = document.getElementById('cnv'),
        c = cnv.getContext('2d'),
        w = cnv.width  = 512,
        h = cnv.height = 512,
        r = 3,
        k = 3,
        s = 2**0.5,
   points = [],
     hash = [];

for (let x = 0, len = Math.ceil(w/r+1); x < len; ++x) {
    hash[x] = [];

    for (let y = 0, len = Math.ceil(h/r+1); y < len; ++y) {
        hash[x][y] = [];
    }
}

points.push(new Point(w/2, h/2));
c.fillRect(points[0].x, points[0].y, s, s);

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
}

function randDist() {
    return Math.random() * r * r + r;
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
        if (dist(point, others[i]) < r) {
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

        if (collides(it, cand)) {
            it.active = false;
            continue;
        } else {
            points.push(cand);
            hash[Math.floor(cand.x/r)][Math.floor(cand.y/r)].push(cand);
            c.fillRect(cand.x, cand.y, s, s);
        }
    }

    if (points.filter(p => p.active).length == 0) {
        alert('done');
        return;
    } else {
        requestAnimationFrame(draw);
    }
}

draw();
