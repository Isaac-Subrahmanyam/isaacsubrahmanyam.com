
// sound
var doveS;
var bgMusic;
var walk;
var jumpS;
var portalS;
var wind;
var squid;

var levelMap;

// for setting up levels
function populateMaps () {
    levelMap = [
    {
        bgImg: [loadImage("images/testmap.jpg", 0, 0)],
        fgImg: [],
        
        Canvas: 20000, // canvas width 
        CanvasH: 10000, // canvas height
        spanX: 0, spanY: 0, spanSize: 100,
        
        player: new Player(250 + 1000, 9300, 30, 100), // player
        
        portal: new Portal(3000, 600, 50, 50), // portal
        
        // bezier curves
        curves: [new Curv(892, 9468, 1499, 9477, 2),new Curv(1499, 9477, 1721, 9499, 9),new Curv(1721, 9499, 1838, 9516, -8),new Curv(1759, 9581, 2334, 9410, -45),new Curv(2305, 9457, 2757, 9251, -35),new Curv(2757, 9251, 3119, 9241, -7),new Curv(3119, 9241, 3553, 9249, 12),new Curv(3471, 9282, 4052, 9125, -3),new Curv(3526, 8986, 3960, 9106, -7),new Curv(3664, 8970, 4098, 8879, 1),new Curv(3516, 8801, 3964, 8858, -7),new Curv(3038, 8702, 3267, 8729, -14),new Curv(2555, 8610, 2847, 8672, -34),new Curv(2111, 8554, 2329, 8553, -17),new Curv(2474, 8447, 2747, 8337, -34),new Curv(2982, 8241, 3335, 8253, -31),new Curv(3618, 8331, 4583, 8308, -8),new Curv(2621, 9350, 2906, 9300, -81),new Curv(1391, 9511, 1630, 9554, -57),new Curv(1630, 9554, 1910, 9593, -74),new Curv(4583, 8308, 5157, 8446, -3),new Curv(5157, 8446, 6211, 8618, 79),new Curv(6211, 8618, 6307, 8660, -14),new Curv(6531, 8775, 6687, 8747, -17),new Curv(6687, 8747, 6982, 8812, -12),new Curv(6982, 8812, 7746, 8891, 41),new Curv(7746, 8891, 8258, 9016, -41),new Curv(8404, 8982, 8546, 8912, -23),],
        
        // camera boxes
        camboxes: [],
    
        // doves
        hope: [],
        
        // evil black squids
        badplayer: [],
        
        // story text
        storytxt: [
            new StoryTxt("Hope you enjoyed!", 300, 250, 30, -15,
            100, 200, 600, 400, false)],
            
            // checkpoints
            checkpoints: [],
            
            // shadow floaters
            floaters: [],
        },
        
    ];
};

// preload images and sounds
function preload() {
    
    // load game sounds
    doveS = new Audio('sounds/whistle.mp3');
    bgMusic = new Audio('sounds/Mae.mp3');
    walk = new Audio("sounds/walk.mp3");
    jumpS = new Audio("sounds/jump.mp3");
    portalS = new Audio("sounds/portal.mp3");
    wind = new Audio("sounds/wind.mp3");
    squid = new Audio("sounds/squid.mp3");
    
    populateMaps();
    
    // fine tune volume and reverb settings
    doveS.volume = 0.05;
    doveS.reverb = 1;
    jumpS.volume = 0.25;
    portalS.volume = 0.05;
    wind.volume = 1;
    squid.volume = 0.2;
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    angleMode(DEGREES);
    frameRate(60);
}

// define bezier collision at a point
function bezierCollisionPoint (i, obj1, obj2) {
    return  obj1.x + obj1.w >= (obj2.x1 + i) && 
    obj1.y + obj1.h >= obj2.y1 + (obj2.c*sin(pi*(i/((obj2.x2-obj2.x1)/57.4)))) + (obj2.y2 - obj2.y1)*i/(obj2.x2 - obj2.x1) &&
    obj1.x <= (obj2.x1 + i) &&
    obj1.y + obj1.h / 1.5 <=  obj2.y1 + (obj2.c*sin(pi*(i/((obj2.x2-obj2.x1)/57.4)))) + (obj2.y2 - obj2.y1)*i/(obj2.x2 - obj2.x1);
}

// current level
var level = 0;

// for scouting map
var scoutMap = [0, 0];

// spectator mode
var spectMode = true;

// transition for scenes
var trans = 0;

// detect when portal can be open
var portalAccess = false;

// for curve detection
var pi = Math.PI;

// for live camera span;ning
var spanLiveSize;
var spanLiveX;
var spanLiveY;

// camera for game
var cam;

// for rectangular collision hit boxes
function rectCollide (one, two) {
    return one.x + one.w > two.x &&
    one.y + one.h > two.y &&
    one.x < two.x + two.w &&
    one.y < two.y + two.h;
};

var spanGrow;

// sprite for anastasia
function ana (stage) {

    if(stage === "stag")
    {
        ellipse(200, 111, 40, 50);
        beginShape();
        vertex(193, 135);
        vertex(207, 135);
        vertex(210 + 10, 242);
        vertex(190 - 10, 242);
        vertex(193, 135);
        endShape();
    }

    if(stage === "stag")
    {
        bezier(201, 86, 217, 87, 169, 88, 163, 129 + sin(frameCount * 2) * 4);
        bezier(201, 86, 217, 87, 169, 88, 176, 129 + sin(frameCount * 3) * 4);
        bezier(201, 86, 217, 87, 169, 88, 176, 93 + sin(frameCount * 2) * 9);
        bezier(201, 86, 217, 87, 169, 71, 150, 100 + sin(frameCount * 2) * 4);
        bezier(201, 86, 217, 87, 169, 71, 150, 125 + sin(frameCount * 1) * 7);
        push();
        translate(400, 0);
        scale(-1.00, 1.00);
        bezier(201, 86, 217, 87, 169, 88, 163, 129 + sin(frameCount * 2) * 4);
        bezier(201, 86, 217, 87, 169, 88, 176, 129 + sin(frameCount * 3) * 4);
        bezier(201, 86, 217, 87, 169, 88, 176, 93 + sin(frameCount * 2) * 9);
        bezier(201, 86, 217, 87, 169, 71, 150, 100 + sin(frameCount * 2) * 4);
        bezier(201, 86, 217, 87, 169, 71, 150, 125 + sin(frameCount * 1) * 7);
        pop();
    }

    if(stage === "move" && levelMap[level].player.jump === false)
    {
        push();
        translate(197, 160);
        rotate(sin(frameCount * 8) * 30);
        line(0, 0, -19, 23);
        line(0 -sin(frameCount * 8) * 10, 39 +sin(frameCount * 1) * 5, -18, 23);
        pop();

        push();
        translate(216, 160);
        rotate(-77-sin(frameCount * 8) * 30);
        line(0, 0, -19, 23);
        line(-9 +sin(frameCount * 8) * 10, 39 -sin(frameCount * 1) * 5, -18, 23);
        pop();

        push();
        translate(190, 243);
        rotate(-25+ sin(frameCount * 8) * 35);
        line(0, 0, 0, 20);

        line(-11 - sin(frameCount * 8) * 12, 45, 0, 20);
        pop();

        push();
        translate(210, 243);
        rotate(5 - sin(frameCount * 8) * 35);
        line(0, 0, 0, 20);
        line(-11 + sin(frameCount * 8) * 12, 45, 0, 20);
        pop();
    }

    if(stage === "move")
    {
        push();
        translate(10,0);
        bezier(201, 86, 217, 87, 169, 88, 163, 129 + sin(frameCount * 2) * 4);
        bezier(201, 86, 217, 87, 169, 88, 176, 129 + sin(frameCount * 3) * 4);
        bezier(201, 86, 217, 87, 169, 88, 176, 93 + sin(frameCount * 2) * 9);
        bezier(201, 86, 217, 87, 169, 71, 150, 100 + sin(frameCount * 2) * 4);
        bezier(201, 86, 217, 87, 169, 71, 150, 125 + sin(frameCount * 1) * 7);
        pop();

        ellipse(200 + 10, 111, 40, 50);
        beginShape();
        vertex(193 + 10, 135);
        vertex(207 + 10, 135);
        vertex(210 + 10, 242);
        vertex(190 - 10, 242);
        vertex(193 + 8, 135);
        endShape();
    }

    if(stage === "stag" && levelMap[level].player.jump === false)
    {
        line(189, 160 + sin(frameCount * 2) * 4, 172, 183);
        line(189, 199 + sin(frameCount * 2) * 4, 172, 183);
        line(210, 160 + sin(frameCount * 2) * 4, 228, 183);
        line(210, 199 + sin(frameCount * 2) * 4, 228, 183);
    }

    if(stage === "stag" || levelMap[level].player.jump === true)
    {

        line(190, 243, 190, 243 + 40);
        line(210, 243, 210, 243 + 40);
    }

    if(levelMap[level].player.jump === true && stage === "stag")
    {
        line(189, 160, 172, 183 - 50);
        line(210, 160, 228, 183 - 50);
    }

    if(levelMap[level].player.jump === true && stage === "move")
    {
        line(189 + 5, 160, 172 + 5, 183 - 50);
        line(210 + 8, 160, 228 + 8, 183 - 50);
    }    
};
function anaSprite(x, y, s){

    push();
    translate(x, y);
    scale(s / 100);


    // right
    if((keys[39] || keys[68]))
    {
        noFill();
        strokeWeight(15);
        stroke(255, 255, 255, 50);
        ana("move");
        strokeWeight(3);
        stroke(255);
        ana("move");
    }

    // left
    else if((keys[37] || keys[65]))
    {
        push();
        translate(400, 0);
        scale(-1.00, 1.00);
        noFill();
        strokeWeight(15);
        stroke(255, 255, 255, 50);
        ana("move");
        strokeWeight(3);
        stroke(255);
        ana("move");
        pop();
    }

    else
    {
        push();
        translate(400, 0);
        scale(-1.00, 1.00);
        noFill();
        strokeWeight(15);
        stroke(255, 255, 255, 50);
        ana("stag");
        strokeWeight(3);
        stroke(255);
        ana("stag");
        pop();
    }

    pop();
};

// slender enemy sprite
function slender (sw) {

    noFill();
    ellipse(193, 179, 100, 100);
    bezier(195, 229, 159+ sin(frameCount * 6) * 5, 269+ sin(frameCount * 6) * 5, 153+ sin(frameCount * 6) * 5, 282, 182+ sin(frameCount * 1) * 4, 356+ sin(frameCount * 5) * 2);
    bezier(207, 228, 225+ sin(frameCount * 6) * 5, 269+ sin(frameCount * 6) * 5, 153+ sin(frameCount * 4) * 6, 282, 223+ sin(frameCount * 6) * 5, 356+ sin(frameCount * 3) * 19);
    bezier(198, 230, 225+ sin(frameCount * 6) * 5, 332+ sin(frameCount * 6) * 5, 153+ sin(frameCount * 4) * 3, 244, 149+ sin(frameCount * 4) * 6, 356+ sin(frameCount * 7) * 10);
    bezier(170, 224, 108+ sin(frameCount * 6) * 5, 325+ sin(frameCount * 6) * 5, 190+ sin(frameCount * 5) * 6, 242, 125+ sin(frameCount * 3) * 8, 356+ sin(frameCount * 3) * 8);
    bezier(218, 224, 196+ sin(frameCount * 6) * 5, 338+ sin(frameCount * 6) * 5, 271+ sin(frameCount * 8) * 4, 297, 242+ sin(frameCount * 7) * 10, 356+ sin(frameCount * 4) * 6);
    bezier(218, 223, 269+ sin(frameCount * 6) * 5, 361+ sin(frameCount * 6) * 5, 231+ sin(frameCount * 5) * 5, 339, 232+ sin(frameCount * 3) * 19, 356+ sin(frameCount * 6) * 5);
    bezier(213, 225, 249+ sin(frameCount * 6) * 5, 354+ sin(frameCount * 6) * 5, 200+ sin(frameCount * 2) * 18, 273, 215+ sin(frameCount * 5) * 2, 356+ sin(frameCount * 1) * 4);
    bezier(178, 227, 204, 301+ sin(frameCount * 6) * 5, 156, 258, 168+ sin(frameCount * 6) * 8, 356);

    line(225, 139, 250, 128);
    line(162, 139, 134, 128);
    line(243, 169, 250, 128);
    line(144, 169, 134, 128);

    if(sw === "left")
    {
        push();
        translate(-10, -10);
        line(163, 200, 176, 180);
        line(193, 200, 176, 180);
        line(193, 200, 209, 180);
        line(223, 200, 209, 180);
        pop();
    }

    if(sw === "right")
    {
        push();
        translate(10, -10);
        line(163, 200, 176, 180);
        line(193, 200, 176, 180);
        line(193, 200, 209, 180);
        line(223, 200, 209, 180);
        pop();
    }
}
function slenderSprite (sw, x, y, s) {
    push();
    translate(x, y);
    scale(s / 100);
    stroke(0, 0, 0, 50);
    strokeWeight(15);
    slender(sw);
    stroke(0);
    strokeWeight(3);
    slender(sw);
    pop();
}

// hope sprite
function hope () {

    push();
    translate(270, 226);
    scale(2.7);
    rotate(- 4 + sin(frameCount * 10) * 12);
    ellipse(12,0,25,4);
    rotate(1 + sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 + sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 + sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 + sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 + sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 + sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    pop();

    push();
    translate(239, 226);
    scale(-2.7);
    rotate(- 4 - sin(frameCount * 10) * 12);
    ellipse(12,0,25,4);
    rotate(1 - sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 - sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 - sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 - sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 - sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    rotate(1 - sin(frameCount * 10) * 10);
    ellipse(12,0,25,4);
    pop();
}
function hopeSprite (x, y, s) {
    push();
    translate(x, y + sin(frameCount * 5) * 4);
    scale(s / 100);
    noFill();
    stroke(255, 255, 255, 30);
    strokeWeight(5);
    ellipse(255,224,31,37);
    hope();
    stroke(255, 255, 255);
    strokeWeight(1);
    hope();
    strokeWeight(2);
    ellipse(255,224,25,30);
    ellipse(251,220,1,1);
    ellipse(259,220,1,1);
    triangle(250, 226, 254, 230, 258, 226);
    pop();
}

// camera that is set to follow an element (player in this case)
class Camera {

    constructor (x, y) {
        this.x = x; this.y = y; this.w = window.innerWidth; this.h = window.innerHeight;
        this.scaleW = 0;
        this.scaleH = 0;
    }

    view (plyer) {

        // set spangrow to be initialized with map
        spanGrow = levelMap[level].spanSize;

        // interpolation for camera following player
        this.x = lerp(this.x, plyer.x + levelMap[level].spanX, 0.05);
        this.y = lerp(this.y, plyer.y + levelMap[level].spanY, 0.05);

        // scale based on map span grow settings
        scale(spanGrow / 100);

        this.w = window.innerWidth;
        this.h = window.innerHeight;

        // scale width and height based on span grow
        this.scaleW = (this.w / (spanGrow / 100)) / 2;
        this.scaleH = (this.h / (spanGrow / 100)) / 2;

        // constrain player to ends of screen
        this.x = constrain(this.x, this.scaleW, levelMap[level].Canvas - this.scaleW);
        this.y = constrain(this.y, this.scaleH, levelMap[level].CanvasH - this.scaleH);

        // translate accordingly
        translate(this.scaleW - this.x, this.scaleH - this.y);
    };
};

// class for dove
class Hope {

    constructor (x, y) {
        this.x = x; this.y = y;
        this.originy = y;
        this.w = 40; this.h = 40;
        this.s = 40;
        this.collected = false;
        this.anim = this.s;
        this.fadeIn = 0;
    }
    draw () {

        // show collision box for spectator mode
        if(spectMode)
        {
            stroke(255, 255, 255);
            noFill();
            rect(this.x, this.y, this.w, this.h);
        }

        if(view(this))
        {
            // if collect start effect
            if (this.collected === true)
            {
                noStroke();
                fill(255, 255, 255, 50 - this.fadeIn);
                ellipse(this.x + this.s / 2, this.originy + this.fadeIn / 2, this.fadeIn * 1.5, this.fadeIn * 1.5);
                ellipse(this.x + this.s / 2, this.originy + this.fadeIn / 2, this.fadeIn, this.fadeIn);
                ellipse(this.x, this.originy, this.fadeIn, this.fadeIn);
                ellipse(this.x + this.fadeIn, this.originy, this.fadeIn, this.fadeIn);
            }

            hopeSprite(this.x - 108, this.y - 94, 50);

            // play dove chirps
            if(rectCollide(this, levelMap[level].player) && this.collected === false)
            {
                doveS.play();
                this.collected = true;
            }
        }

        // make bird fly if collected
        if (this.collected === true)
        {
            this.y -= 3;
            this.fadeIn += 2;
        }
    }
}

// class for portal
class Portal {

    constructor (x, y, w, h) {
        this.particles = { x: [], y: [], s: [], r: [], upAmount: [] };
        this.x = x;  this.y = y;
        this.w = w;  this.h = h;
    }

    draw () {

        if(view(this))
        {
            // start particle effect if portal is activated 
            if(portalAccess)
            {
                // go to next level once collided
                if(levelMap[level].player.x + levelMap[level].player.w >= this.x && 
                levelMap[level].player.y + levelMap[level].player.h >= this.y &&
                levelMap[level].player.x <= this.x + this.w &&
                levelMap[level].player.y <=  this.y + this.h)
                {
                    portalS.play();
                    reset();
                    level ++;
                }

                // particle effect
                fill(250, 242, 243, 150);
                noStroke();

                for(var i = 0; i < this.particles.x.length; ++i)
                {
                    push();
                    translate(this.particles.x[i], this.particles.y[i]);
                    rotate(this.particles.r[i]);
                    ellipse(0, this.particles.upAmount[i], this.particles.s[i], this.particles.s[i]);
                    pop();

                    this.particles.s[i] -= 2;
                    this.particles.upAmount[i] += this.particles.s[i] / 20;

                    if(this.particles.s[i] <= 0)
                    {
                        this.particles.x[i] = this.x + this.w / 2;
                        this.particles.y[i] = this.y + this.h / 2;
                        this.particles.s[i] = random(0, this.w);
                        this.particles.r[i] = random(0, 360);
                        this.particles.upAmount[i] = 0;
                    }

                }

                if(this.particles.x.length <= 30)
                {
                    this.particles.x.push(10000);
                    this.particles.y.push(10000);
                    this.particles.s.push(random(0, this.w));
                    this.particles.r.push(random(0, 360));
                }
            }

            // base portal
            noFill();
            stroke(255, 255, 255, 50);
            strokeWeight(5);
            ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w/1.1, this.h/1.1);
            strokeWeight(8);
            ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w/1.1, this.h/1.1);
            stroke(255, 255, 255);
            strokeWeight(2);
            ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w/1.1, this.h/1.1);
        }
    }
};

// slender class
class Badplayer {

    constructor (x, y, leftBound, rightBound, switcher, speed) {
        this.x = x;  this.y = y;
        this.w = 30;  this.h = 60;
        this.s = speed;  this.g = 1;
        this.xorig = x; this.yorig = y;
        this.leftBound = leftBound;  this.rightBound = rightBound;
        this.switcher = switcher;
    }

    draw () {

        // show collision box for spectator mode
        if(spectMode)
        {
            stroke(255, 255, 255);
            noFill();
            rect(this.x, this.y, this.w, this.h);
        }

        if(view(this))
        {
            fill(255);
            slenderSprite(this.switcher, this.x - 39, this.y - 38, 28);
        }
    }

    update () {

        if(view(this))
        {
            // go from left and right
            if(this.x <= this.leftBound) { this.switcher = "right"; }
            if(this.x >= this.rightBound) { this.switcher = "left"; }
            if(this.switcher === "left") { this.x -= this.s; }
            if(this.switcher === "right") { this.x += this.s; }

            // set gravity for slender
            this.y += this.g;
            this.g += 0.98;

            // if players touched enemy reset map
            if(rectCollide(this, levelMap[level].player))
            {
                squid.play();
                reset();
            }
        }
    }
}

// class for bezier collision
class Curv {    
    constructor (x1 ,y1 ,x2 , y2, c) {

        this.x1 = x1;  this.y1 = y1;
        this.x2 = x2;  this.y2 = y2;
        this.c = c;

        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }

    draw (p, e) {

        // create a box around bezier curve for camera purposes
        if(this.c <= 0)
        {
            if(this.y1 <= this.y2)
            {
                this.x = this.x1 - 10;
                this.y = this.y1 - abs(this.c);
                this.w = this.x2 - this.x1 + 20;
                this.h = (this.y2 - this.y1) + abs(this.c);
            } else
            {
                this.x = this.x1 - 10;
                this.y = this.y2 - abs(this.c);
                this.w = this.x2 - this.x1 + 20;
                this.h = (this.y1 - this.y2) + abs(this.c);
            }
        } else {
            if(this.y1 <= this.y2)
            {
                this.x = this.x1 - 10;
                this.y = this.y1;
                this.w = this.x2 - this.x1 + 20;
                this.h = (this.y2 - this.y1) + abs(this.c);
            } else
            {
                this.x = this.x1 - 10;
                this.y = this.y2;
                this.w = this.x2 - this.x1 + 20;
                this.h = (this.y1 - this.y2) + abs(this.c);
            }
        }

        stroke(255);  
        strokeWeight(2);

        // show collision box for spectator mode
        if(spectMode)
        {
            noFill();
            // drect(this.x, this.y, this.w, this.h);
            for(var i = 0; i < this.x2 - this.x1; i += 5)
            {
                point(this.x1 + i, this.y1 + (this.c*sin(pi*(i/((this.x2-this.x1)/57.4)))) + (this.y2 - this.y1)*i/(this.x2 - this.x1));
            }
        }

        if(view(this))
        {
            if(spectMode)
            {
                this.x1 = applyNob(this.x1, this.y1, "x");
                this.y1 = applyNob(this.x1, this.y1, "y");
                this.x2 = applyNob(this.x2, this.y2, "x");
                this.y2 = applyNob(this.x2, this.y2, "y");
                this.c = applyCurve(this);
            }

            // collide with squid enemy
            for(var j = 0; j < e.length; j++)
            {
                if(!rectCollide(e[j], this))
                {
                    continue;
                }

                var i = (e[j].x - this.x1);

                if(bezierCollisionPoint(i, e[j], this))
                {
                    e[j].y = this.y1 + (this.c*sin(pi*(i/((this.x2-this.x1)/57.4)))) + (this.y2 - this.y1)*i/(this.x2 - this.x1) - e[j].h;
                    e[j].g = 1;
                }
            }

        }
    }
}

// appearing text in game
class StoryTxt {

    constructor (m, tx, ty, s, r, x, y, w, h, seeBox) {
        this.m = m;
        this.tx = tx; this.ty = ty;
        this.s = s; this.r = r;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.seeBox = seeBox;
        this.inView = false;
        this.show = 300;
    }

    draw () {

        // showcase
        noStroke();
        textFont("serif");
        textSize(this.s);
        fill(255, 255, 255, 30  - this.show);
        push();
        translate(this.tx, this.ty);
        rotate(this.r);
        text(this.m, 0, 0 - this.s / 12);
        text(this.m, 0, 0 + this.s / 12);
        text(this.m, 0 + this.s / 12, 0 + this.s / 12);
        text(this.m, 0 - this.s / 12, 0 - this.s / 12);
        fill(255, 255, 255, 300 - this.show);
        text(this.m, 0, 0);
        pop();

        // if collide in apear box make woosh sound and fade in text
        if(rectCollide(this,levelMap[level].player) && !this.inView)
        {
            this.inView = true;
            wind.play();
        }

        // once in view show text
        if(this.inView || this.seeBox)
        {
            this.show /= 1.1;
        }

        // for spectating
        if(this.seeBox)
        {
            fill(255);
            rect(this.x, this.y, this.w, this.h);
        }
    }

}

// checkpoint
class Checkpoint {
    constructor (x, y) {        
        this.x = x; this.y = y;
        this.w = 30; this.h = 100;
        this.gotit = false;
        this.shade = 300;
    }
    draw () {

        // show collision box for spectator mode
        if(spectMode)
        {
            stroke(255, 255, 255);
            noFill();
            rect(this.x, this.y, this.w, this.h);
        }

        if(view(this))
        {
            noFill();
            strokeWeight(6);
            stroke(255, 255, 255, 100);
            ellipse(this.x + this.w / 2, this.y + this.w / 2 - 2, this.w, this.w);
            line(this.x + this.w / 2, this.y + this.w, this.x + this.w / 2, this.y + this.h);
            strokeWeight(2);
            stroke(255);
            ellipse(this.x + this.w / 2, this.y + this.w / 2 - 2, this.w, this.w);
            line(this.x + this.w / 2, this.y + this.w, this.x + this.w / 2, this.y + this.h);

            noStroke();

            // effect
            if(this.gotit)
            {
                this.shade /= 1.01;
                fill(255, 255, 255, 300 - this.shade)
                ellipse(this.x + this.w / 2, this.y + this.w / 2 - 2, this.w, this.w);
            }

            // if player touches portal
            if(rectCollide(this, levelMap[level].player))
            {
                this.gotit = true;
                levelMap[level].player.origx = this.x + this.w / 2 + 30;
                levelMap[level].player.origy = this.y + this.h / 2 - 100;
            }
        }
    }
}

// camera spanner boxes
class CamBox {

    constructor (spanX, spanY, spanSize, x, y, w, h, see)
    {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.spanX = spanX; this.spanY = spanY;
        this.spanSize = spanSize;
    }

    draw ()
    {
        // show collision box for spectator mode
        if(spectMode)
        {
            noFill();
            fill(255, 255, 255, 50);
            rect(this.x, this.y, this.w, this.h);
        }

        // update live camera spanners if player touches box
        if(rectCollide(this, levelMap[level].player))
        {
            spanLiveX = this.spanY;
            spanLiveSize = this.spanSize;
            spanLiveX = this.spanX;
        }
    }
}

// class for main player
class Player {

    constructor (x, y, w, h)
    {
        this.x = x;  this.y = y;
        this.xvel = 0;
        this.yvel = 0;
        this.origy = y;  this.origx = x;
        this.w = w;  this.h = h;
        this.s = 6;   this.g = 1;
        this.CanX = 0; this.CanY = 0;
        this.jump = false;
        cam = new Camera(this.x,this.y);
    }
    update () {

        if(spectMode)
        {
            stroke(255, 255, 255);
            noFill();
            rect(this.x, this.y, this.w, this.h);
        }

        if(spectMode)
        {
            this.x = applyNob(this.x, this.y, "x");
            this.y = applyNob(this.x, this.y, "y");
        }

        // move with keys
        if((keys[37] || keys[65])) { this.xvel -= 2; }
        if((keys[39] || keys[68])) { this.xvel += 2; }

        if(!keys[37] && !keys[39] && !keys[65] && !keys[68])
        {
            this.xvel *= 0.7;
        }

        this.xvel = constrain(this.xvel, -this.s, this.s);

        this.x += this.xvel;

        // jump with keys
        if((keys[38] || keys[32] || keys[87]) && !this.jump && this.g <= 5) {
            this.jump = true;
            this.g = -10;
            jumpS.play();
        }

        // walk sound
        if((keys[37] || keys[65] || keys[39] || keys[68]) && this.jump === false && this.g <= 5)
        {
            walk.play();
            walk.volume = 0.05;
        } else
        {
            walk.volume = 0;
            walk.currentTime = 0;
        }

        if(!movingPlayer)
        {
            // gravity
            this.y += this.g;
            this.g += 0.35;
        }

        if(this.g >= 10)
        {
            this.g = 10;
        }

        if(this.y >= levelMap[level].CanvasH)
        {
            reset();
        }

        if(this.x <= 0)
        {
            this.x = 0; 
        }

        if(this.x >= levelMap[level].Canvas - this.w)
        {
            this.x = levelMap[level].Canvas - this.w;
        }

        this.applyCollision(0, this.g);
    }
    draw () {
        // draw player
        push();
        translate(this.x, this.y);
        anaSprite(-85, -40, 50);
        pop();
    }
}

// shadow floater
class Floater {
    constructor(x,y,s,r)
    {
        this.originX = x;
        this.originY = y;
        this.x = x  - s /4;
        this.y = y  - s /2;
        this.s = s;
        this.w = this.s;
        this.h = this.s;
        this.f = 0;
        this.r = r;
        this.block();
    }

    image()
    {
        noFill();
        quad(200, 100, 175, 150, 200, 200, 224, 150);

        triangle(217, 136, 225, 108, 209, 118);
        triangle(232 -50, 136, 225 - 50, 108, 241 - 50, 118);

        var rotSpeed = 0.5;
        var triDist = 60;

        noFill();

        for(var i = 0; i < 12; i ++)
        {
            triangle(195 - ((67 + (10*sin(3 *frameCount))) *cos((frameCount + (triDist * i)) * rotSpeed)), 155  - ((67 + (10*sin(3 *frameCount))) *sin((frameCount + (triDist * i)) * rotSpeed)), 205 - ((67 + (10*sin(3 *frameCount))) *cos((frameCount + (triDist * i)) * rotSpeed)), 155 - ((67 + (10*sin(3 *frameCount))) *sin((frameCount + (triDist * i)) * rotSpeed)), 200 - ((67 + (10*sin(3 *frameCount))) *cos((frameCount + (triDist * i)) * rotSpeed)), 146 - ((67 + (10*sin(3 *frameCount))) *sin((frameCount + (triDist * i)) * rotSpeed)));   
        }

        arc(192, 150, 10, 10, 264, 458);
        arc(192, 155, 10, 10, 429, 632);

        arc(207, 155, 10, 10, 264, 458);
        arc(207, 150, 10, 10, 429, 632);
    }

    draw()
    {
        noFill();

        var size;
        noStroke();
        fill(0, 0, 0, 150);
        
        for(var i = 0; i < this.r * 2; i++)
        {
            size = 2 + 3* sin((i / 90) * frameCount);
            ellipse(this.originX + ((this.r - 30 + size/2)*sin(2 * i)), this.originY+ ((this.r - 30 + size /2)*cos(2 * i)), size, size);  
        }

        if(view(this) - 100)
        {
            push();
            translate(this.x, this.y);
            translate(this.s * -1.74, this.s * -0.99);
            scale(this.s / 100);
            strokeWeight(7);
            stroke(0, 0, 0, 60);
            this.image();
            strokeWeight(2);
            stroke(0, 0, 0);
            this.image();
            pop();
        }
    }

    movement()
    {
        var seekX;
        var seekY;
        var d;

        if(dist(levelMap[level].player.x + levelMap[level].player.w/2, levelMap[level].player.y + levelMap[level].player.h/2, this.originX , this.originY) <= this.r)
        {
            seekX = levelMap[level].player.x + levelMap[level].player.w/2;
            seekY = levelMap[level].player.y + levelMap[level].player.h/2;
        }
        else
        {
            seekX = this.originX;
            seekY = this.originY;
        }

        var e = new createVector(this.x  + this.s /4, this.y  + this.s/2);
        var p = new createVector(seekX, seekY);

        p.sub(e);

        d = dist(seekX, seekY, this.x, this.y);

        this.x += ( 2 *(p.x) / 200);
        this.y += ( 2 *(p.y) / 200);
    }

    block()
    {
        this.meshX = [];
        this.meshY = [];
        this.meshW = [];
        this.meshH = [];

        for(var i = 0; i < 12; i++)
        {
            this.meshX.push(this.x);
            this.meshY.push(this.y);
            this.meshW.push(this.s/6.5);
            this.meshH.push(this.s/6.5);
        }
    }

    mesh()
    {
        for(var i = 0; i < 12; i++)
        {
            this.meshX[i] = this.x + this.s / 4 - (this.s / 6.5)/2 - (this.s/1.52 + (this.s / 10) *sin(frameCount * 3)) *sin(0.5*frameCount + (i*30));    
            this.meshY[i] = this.y + this.s/2  - (this.s / 6.5)/2 + (this.s/1.52 + (this.s / 10) * sin(frameCount * 3)) *cos(0.5*frameCount  + (i*30));

            if(spectMode)
            {
                stroke(255, 255, 255);
                noFill();
                rect(this.meshX[i], this.meshY[i], this.meshW[i], this.meshH[i]);
            }
        }
    }

    collision()
    {
        this.mesh();

        for(var i = 0; i < 12; i++)
        {
            if(levelMap[level].player.x + levelMap[level].player.w > this.meshX[i] && levelMap[level].player.x < this.meshX[i] + this.meshW[i] && levelMap[level].player.y + levelMap[level].player.h > this.meshY[i] && levelMap[level].player.y < this.meshY[i] + this.meshH[i])
            {
                reset();
            }
        }
    }

    apply()
    {
        this.collision();
        this.draw();
        this.movement();
    }
}

// only view objects if they are visible in camera for efficency
var view = function(obj){
    return obj.x + (window.innerWidth / 2) - cam.x < window.innerWidth && obj.x + (window.innerWidth / 2) - cam.x > -obj.w && obj.y + (window.innerHeight / 2) - cam.y < window.innerHeight && obj.y + (window.innerHeight / 2) - cam.y > -obj.h;
};

var movingPlayer = false;

function applyNob (setx, sety, xory) {

    stroke(255, 255, 255, 50);
    fill(255, 255, 255, 30);
    ellipse(setx - 30 + 40, sety - 30 + 40, 20 + 60, 20 + 60);

    fill(255, 255, 255, 100);

    mX = mouseX + cam.x - (window.innerWidth / 2);
    mY = mouseY + cam.y - (window.innerHeight / 2);

    if(mX > setx && mX < setx + 20 && mY > sety && mY < sety + 20)
    {
        fill(255, 255, 255, 150);
    }

    if(mouseIsPressed && mX > setx - 30 && mX < setx + 20 + 30 && mY > sety - 30 && mY < sety + 20 + 30)
    {
        setx = mX - 10;
        sety = mY - 10;
        movingPlayer = true;
    } else
    {
        movingPlayer = false;
    }

    rect(setx, sety, 20, 20);

    if(xory === "x") return setx;
    else return sety;
};
function applyCurve (obj) {   

    setx = (obj.x1 + obj.x2) / 2;
    sety = (obj.y1 + obj.y2) / 2 + obj.c - 10;

    stroke(255, 255, 255, 50);
    fill(255, 255, 255, 30);
    ellipse(setx - 30 + 40, sety - 30 + 40, 20 + 60, 20 + 60);
    fill(255, 255, 255, 100);

    mX = mouseX + cam.x - (window.innerWidth / 2);
    mY = mouseY + cam.y - (window.innerHeight / 2);

    if(mX > setx && mX < setx + 20 && mY > sety && mY < sety + 20)
    {
        fill(255, 255, 255, 150);
    }

    if(mouseIsPressed && mX > setx - 30 && mX < setx + 20 + 30 && mY > sety - 30 && mY < sety + 20 + 30)
    {
        sety = mY - 10;
    }

    rect(setx, sety, 20, 20);

    return -(((obj.y1 + obj.y2) / 2 - 10) - sety);
}

// particles for snow effect
var particles = { x: [], y: [], s: [], r: [], upAmount: [] };

/** Key stuff **/
var keys = [];
function keyPressed () {
    keys[keyCode] = true;
};
function keyReleased (){
    keys[keyCode] = false;
};

// for reseting game when player is dead
function reset () {
    trans = 50;
    levelMap[level].player.x = levelMap[level].player.origx;
    levelMap[level].player.y = levelMap[level].player.origy;
    levelMap[level].player.g = -10;
};

Player.prototype.applyCollision = function(xvel, yvel) {

    for(var i = 0; i < levelMap[level].curves.length; i++)
    {
        var c = levelMap[level].curves[i];

        if(view(c))
        {
            // collide with player
            if(!rectCollide(this, c)) continue;

            for(var i = abs((this.x - c.x1)) + 5; i < (c.x2 - c.x1) + abs((this.x - c.x2 + 30)); i += 5)
            {   
                if(!(bezierCollisionPoint(i, this, c) && 
                this.y - 10 <= (c.y1 + (c.c*sin(pi*(i/((c.x2-c.x1)/57.4)))) + (c.y2 - c.y1)*i/(c.x2 - c.x1) - this.h))) continue;

                if (yvel > 0)
                {
                    this.y = c.y1 + (c.c*sin(pi*(i/((c.x2-c.x1)/57.4)))) + (c.y2 - c.y1)*i/(c.x2 - c.x1) - this.h;
                    this.jump = false;
                    this.g = 0;
                }
            }
        }
    }
};

// snow effect
function snow (w){

    push();
    noStroke();

    //particles
    for(var i = 0; i < particles.x.length; ++i)
    {
        //fill
        fill(255, 255, 255, 200);
        ellipse(particles.x[i], particles.y[i], particles.s[i], particles.s[i]); // circle for particle

        //particles.s[i] -= 0.4; // size decreases
        particles.y[i] += particles.s[i]; // particl goes up
        particles.x[i] -= 0.5;

        if(particles.y[i] >= levelMap[level].CanvasH) // is particle is totally shrunk
        {
            //reset particle
            particles.x[i] = random(0, w);
            particles.y[i] = -10;
            particles.s[i] = random(1, 3);
        }
    }

    //appear
    if(particles.x.length <= 150)
    {
        particles.x.push(random(0, w));
        particles.y.push(random(-600, -10));
        particles.s.push(random(1, 3));
        particles.r.push(random(0, 360));
    }
    pop();
};

// draw all elements
function drawLevels () {

    portalAccess = true;

    push();
    translate(scoutMap[0], scoutMap[1]);
    cam.view(levelMap[level].player);

    snow(levelMap[level].Canvas + 100);

    /** DRAW ALL MAP ELEMENTS**/

    for(var i = 0; i < levelMap[level].bgImg.length; i++)
    {
        image(levelMap[level].bgImg[i], 0, 0);
    }

    for(var i = 0; i < levelMap[level].curves.length; i++)
    {
        levelMap[level].curves[i].draw(levelMap[level].player, levelMap[level].badplayer);
    }

    for(var i = 0; i < levelMap[level].hope.length; i++) {
        levelMap[level].hope[i].draw();

        if(levelMap[level].hope[i].collected === false) { 
            portalAccess = false;
        }
    }

    for(var i = 0; i < levelMap[level].storytxt.length; i++) {
        levelMap[level].storytxt[i].draw();
    }

    for(var i = 0; i < levelMap[level].checkpoints.length; i++) {
        levelMap[level].checkpoints[i].draw();
    }

    for(var i = 0; i < levelMap[level].badplayer.length; i++) {
        levelMap[level].badplayer[i].draw();
        levelMap[level].badplayer[i].update();
    }

    for(var i = 0; i < levelMap[level].floaters.length; i++)
    {
        levelMap[level].floaters[i].apply();
    }

    for(var i = 0; i < levelMap[level].camboxes.length; i++)
    {
        levelMap[level].camboxes[i].draw();
    }

    levelMap[level].portal.draw();
    levelMap[level].player.draw();
    levelMap[level].player.update();

    for(var i = 0; i < levelMap[level].fgImg.length; i++)
    {
        image(levelMap[level].fgImg[i], 0, 0);
    }


    /** LIVE CAMERA SPANNING DETECTION **/

    if(levelMap[level].spanSize <= spanLiveSize)
    {
        levelMap[level].spanSize += 0.2;
    }
    if(levelMap[level].spanSize >= spanLiveSize)
    {
        levelMap[level].spanSize -= 0.2;
    }
    if(levelMap[level].spanSize === spanLiveSize)
    {
        levelMap[level].spanSize = spanLiveSize;
    }

    if(levelMap[level].spanX <= spanLiveX)
    {
        levelMap[level].spanX += 2;
    }
    if(levelMap[level].spanX >= spanLiveX)
    {
        levelMap[level].spanX -= 2;
    }
    if(levelMap[level].spanX === spanLiveX)
    {
        levelMap[level].spanX = spanLiveX;
    }

    if(levelMap[level].spanY <= spanLiveY)
    {
        levelMap[level].spanY += 2;
    }
    if(levelMap[level].spanY >= spanLiveY)
    {
        levelMap[level].spanY -= 2;
    }
    if(levelMap[level].spanY === spanLiveY)
    {
        levelMap[level].spanY = spanLiveY;
    }

    pop();
};

// clicked state
var clickDalay = 0;
var clicked = false;
var imgGround = "";
var img;
var input;

// draw level editor
function buttonAsset (x, y, w, h, txt, txtSize, state) {
    fill(255, 255, 255, 50);
    textSize(txtSize);
    
    if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h)
    {
        fill(255, 255, 255, 100);
        
        if(mouseIsPressed && !clicked)
        {
            switch(state)
            {
                case "curve":
                    levelMap[level].curves.push(
                        new Curv(cam.x - (window.innerWidth / 2) + 150, cam.y - (window.innerHeight / 2) + 80, cam.x - (window.innerWidth / 2) + 500, cam.y - (window.innerHeight / 2) + 80, -40)
                    );
                    break;
                case "box":
                    break;
                case "bg-":
                    imgGround = "bg-";
                    input = createFileInput(handleFile);
                    break;
                case "bg+":
                    imgGround = "bg+";
                    break;
                case "fg-":
                    imgGround = "fg-";
                    break;
                case "fg+":
                    imgGround = "fg+";
                    break;
                case "print":
                    var writer = createWriter("level.txt");
                    for(var i = 0; i < levelMap[level].curves.length; i++)
                    {
                        writer.write("new Curv(" + round(levelMap[level].curves[i].x1) + ", " + round(levelMap[level].curves[i].y1) + ", " + round(levelMap[level].curves[i].x2) + ", " + round(levelMap[level].curves[i].y2) + ", " + round(levelMap[level].curves[i].c)+ "),");
                    }

                    writer.close();
                    break;
                case "spect":
                    switch(spectMode)
                    {
                        case true:
                                spectMode = false;
                            break;
                        case false:
                                spectMode = true;
                            break;
                    }
                    break;
            }
            
            clickDalay = 50;
            clicked = true;
        }
    }
    
    rect(x, y, w, h);
    text(txt, x + w / 2, y + h / 2);
};
function spectateModeAssets () {

    stroke(255);
    fill(255, 255, 255, 50);

    if(spectMode)
    {
        rect(0, 0, 100, window.innerHeight);

        buttonAsset(10, 10, 80, 80, "CURVE", 20, "curve");
        buttonAsset(10, 10 + 90, 80, 80, "BOX", 20, "box");
        buttonAsset(10, 10 + 90 * 2, 80, 80, "BG | |", 20, "bg-");
        buttonAsset(10, 10 + 90 * 3, 80, 80, "BG +", 20, "bg+");
        buttonAsset(10, 10 + 90 * 4, 80, 80, "FG | |", 20, "fg-");
        buttonAsset(10, 10 + 90 * 5, 80, 80, "FG +", 20, "fg+");
        buttonAsset(100, 0, 80, 30, "PRINT", 20, "print");
    }

    buttonAsset(window.innerWidth - 100, 0, 100, 30, "SPECT: " + spectMode, 17, "spect");

    clickDalay --;

    if(clickDalay <= 0)
    {
        clickDalay = 0;
        clicked = false;
    }
};
function handleFile (file) {

    if (file.type === 'image') {
        img = loadImage("images/" + file.name);
        levelMap[level].bgImg.push(
        img
        );
    }
}

var startMusicDelay = 0;

var h = window.innerHeight;

function draw() {

    createCanvas(window.innerWidth, window.innerHeight);

    // if in levels
    startMusicDelay ++;
    if(startMusicDelay >= 100)
    {
        // bgMusic.play();
        startMusicDelay = 100;
    }

    textAlign(CENTER, CENTER);
    background(0);
    drawLevels();

    spectateModeAssets();

    trans /= 1.1;
    fill(255, 255, 255, trans);
    rect(0, 0, window.innerWidth, window.innerHeight);

}
