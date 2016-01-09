var cars = []
var stripes = []
var carComponent = Qt.createComponent("Car.qml")
var bikeComponent = Qt.createComponent("Bike.qml")
var stripeComponent = Qt.createComponent("Stripe.qml")
var crashed = false
var crash_direction = 1
var base_velocity = 8
var car_colors = ["red", "green", "blue"];
var bike = null

function onLeft() {
    console.log("Left!")
    bike.velocity = -8
}

function onRight() {
    console.log("Right!")
    bike.velocity = 8
}

function new_stripe(x, i) {
    var s = stripeComponent.createObject(screen, {
        x: x,
        y: 0 });
    s.x -= s.width / 2;
    s.y += i * s.height * 1.5;

    stripes.push(s);
}

function init_bike() {
    var b = bikeComponent.createObject(screen)
    b.anchors.bottom = screen.bottom
    b.anchors.bottomMargin = 50
    b.x = (screen.width - b.width) / 2
    b.color =  "green"
    return b
}

function init_stripes() {
    for (var i = 0; i < 8; i++) {
        new_stripe(screen.width / 4, i);
        new_stripe(screen.width - screen.width / 4, i);
        new_stripe(screen.width / 2, i);
    }
}

// this shit better be correct for I really don't
// want to debug this mess
function collides(a, b) {
    if (((b.x <= a.x && a.x <= b.x + b.width)
    || b.x < a.x + a.width && a.x + a.width < b.x + b.width)
    && ((b.y <= a.y && a.y <= b.y + b.height)
    || b.y <= a.y + a.height && a.y + a.height <= b.y + b.height)) {
        return true
    }
    return false
}

function after_crash() {
    bike.x += 4 * crash_direction
    bike.rotationAngle += 4.0
    if (bike.rotationAngle % 360 == 0
    || bike.x > screen.width
    || bike.x + bike.width < 0) {
        Qt.quit()
    }
}

var colors = [];
function get_color() {
    var index = Math.floor(Math.random() * colors.length);

    if(colors.length == 0) {
        colors = car_colors.slice();
    }

    return colors.splice(index, 1)[0];
}

function update() {
    if (stripes.length == 0) {
        init_stripes()
    }
    if (!bike) {
        bike = init_bike()
    }
    if (crashed) {
        return after_crash()
    }
    var newcars = []
    var roomForMore = true
    for (var i = 0; i < cars.length; i++) {
        var car = cars[i]
        car.y += car.velocity
        if (car.y <= screen.height) {
            newcars.push(car)
            if (car.y < 0) {
                roomForMore = false
            }
        } else {
            car.destroy()
        }
    }

    for (var i = 0; i < stripes.length; i++) {
        stripes[i].y += base_velocity
        if (stripes[i].y > screen.height) {
            stripes[i].y -= stripes[i].height * 0.5 * stripes.length
        }
    }

    score.distance += 0.1;
    bike.x += bike.velocity;
    if (bike.x + bike.velocity < leftBorder.width) {
        crashed = true;
        crash_direction = -1;
    }
    if ((bike.x + bike.velocity) > (rightBorder.x - bike.width)) {
        crashed = true;
        crash_direction = 1;
    }

    cars = newcars

    for (var i = 0; i < cars.length; i++) {
        if (collides(bike, cars[i])) {
            console.log("CRASH")
            crashed = true;
            if ((bike.x + bike.width / 2)
            < (cars[i].x + cars[i].width / 2)) {
                console.log("Going left")
                crash_direction = -1
            }
        }
    }

    if (roomForMore) {
        var c = carComponent.createObject(screen, {
            x: 200,
            y: 0,
            color: get_color()
        });
        c.y -= c.height * 1.9 // space between cars
        c.x = Math.random() * (screen.width - c.width)
        c.velocity = base_velocity
        if (c == null) {
            console.log("ERROR: " + carComponent.errorString())
        } else {
            cars.push(c)
        }
    }
}
