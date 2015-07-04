var cars = []
var carComponent = Qt.createComponent("Car.qml")
var crashed = false
var crash_direction = 1

init();

function init() {
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

    if ((motor.x + motor.velocity) >= 0
       && (motor.x + motor.velocity) <= (screen.width - motor.width)) {
        motor.x += motor.velocity;
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
        c.y -= c.height * 1.5 // half a car of space between cars
        c.x = Math.random() * (screen.width - c.width)
        c.velocity = 10
        if (c == null) {
            console.log("ERROR: " + carComponent.errorString())
        } else {
            cars.push(c)
        }
    }
}
