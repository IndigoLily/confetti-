const cnv = document.getElementById('cnv'),
        c = cnv.getContext('2d'),
        w = cnv.width  = 512,
        h = cnv.height = 512,
        r = 5,
        k = 2,
        s = 1,
   points = [];

points.push(new Point(w/2, h/2));
c.fillRect(points[0].x, points[0].y, s, s);

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
}

function randDist() {
    return Math.random() * r + r;
}

function randNear(p) {
    let a = Math.random() * Math.PI * 2;
    let d = randDist();
    return new Point(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d);
}

function collides(p1, p2) {
    if (dist(p1, p2) < r) {
        return true;
    } else if (p1.x < 0 || p1.x >= w || p1.y < 0 || p1.y >= h) {
        return true;
    } else {
        return false;
    }
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

            for (let jj = 0; jj < points.length; ++jj) {
                if (jj != i && collides(test, points[jj])) {
                    valid = false;
                    break;
                }
            }

            if (valid) cands.push(test);
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
