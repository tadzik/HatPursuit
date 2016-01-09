var cars = []
var stripes = []
var carComponent = Qt.createComponent("Car.qml")
var stripeComponent = Qt.createComponent("Stripe.qml")
var crashed = false
var crash_direction = 1
var base_velocity = 8

function new_stripe(x, i) {
    var s = stripeComponent.createObject(screen, {
        x: x,
        y: 0 });
    s.x -= s.width / 2;
    s.y += i * s.height * 1.5;

    stripes.push(s);
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
    motor.x += 4 * crash_direction
    motor_rotation.angle += 4
    if (motor_rotation.angle % 360 == 0
    || motor.x > screen.width
    || motor.x + motor.width < 0) {
        Qt.quit()
    }
}

function update() {
    if (crashed) {
        return after_crash();
    }
    if (stripes.length == 0) {
        init_stripes();
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

    motor.x += motor.velocity;
    if (motor.x + motor.velocity < leftBorder.width) {
        crashed = true;
        crash_direction = -1;
    }
    if ((motor.x + motor.velocity) > (rightBorder.x - motor.width)) {
        crashed = true;
        crash_direction = 1;
    }

    cars = newcars

    for (var i = 0; i < cars.length; i++) {
        if (collides(motor, cars[i])) {
            console.log("CRASH")
            crashed = true;
            if ((motor.x + motor.width / 2)
            < (cars[i].x + cars[i].width / 2)) {
                console.log("Going left")
                crash_direction = -1
            }
        }
    }

    if (roomForMore) {
        var c = carComponent.createObject(screen, { x: 200, y: 0 })
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
