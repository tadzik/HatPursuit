var cars = []
var stripes = []
var carComponent = Qt.createComponent("Car.qml")
var bikeComponent = Qt.createComponent("Bike.qml")
var stripeComponent = Qt.createComponent("Stripe.qml")
var topHatComponent = Qt.createComponent("hats/TopHat.qml")
var bowlerComponent = Qt.createComponent("hats/Bowler.qml")
var crashed = false
var crash_direction = 1
var base_velocity = 8
var car_colors = [
    "red", "green", "blue", "orange", "lime", "steelblue",
    "crimson", "darkgoldenrod", "orchid", "deeppink"
];
var bike = null
var hatDrop = null
var hats = {
    "bowler": bowlerComponent,
    "tophat": topHatComponent
};

function on_left() {
    if (crashed) return
    bike.turn_left()
}

function on_right() {
    if (crashed) return
    bike.turn_right()
}

function should_hat_drop() {
    return hatDrop == null
}

function generate_hat() {
    var components = [bowlerComponent, topHatComponent];
    var idx = Math.floor(Math.random() * components.length);
    return components[idx].createObject(screen, {
        primaryColor: get_hat_color(),
        secondaryColor: get_hat_color(),
        z: screen.layer_hats,
        component: components[idx],
    })
}

function deserialize_hat(hatString) {
    var hat = hatString.split(",");
    return hats[hat[0]].createObject(bike, {
        primaryColor: hat[1],
        secondaryColor: hat[2],
        z: screen.layer_hats,
        component: hats[hat[0]]
    });
}

function new_stripe(x, i) {
    var s = stripeComponent.createObject(screen, {
        x: x,
        y: 0,
        z: screen.layer_stripes });
    s.x -= s.width / 2;
    s.y += i * s.height * 1.5;

    stripes.push(s);
}

function init_bike() {
    var b = bikeComponent.createObject(screen)
    b.anchors.bottom = screen.bottom
    b.anchors.bottomMargin = 50
    b.x = (screen.width - b.width) / 2
    b.z = screen.layer_cars
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
        console.log("Score:", score.text);
        if (score.text > score.getHighScore()) {
            score.addScore(score.text);
        }
        Qt.quit();
    }
}

var colors = [];
function get_car_color() {
    var index = Math.floor(Math.random() * colors.length);

    if(colors.length == 0) {
        colors = car_colors.slice();
    }

    return colors.splice(index, 1)[0];
}

function get_hat_color() {
    return get_car_color()
}

function update() {
    if (stripes.length == 0) {
        init_stripes()
    }
    if (!bike) {
        bike = init_bike()
        var hat = bike.get_latest_hat();
        if (hat != null) {
            bike.attach_hat(deserialize_hat(hat))
        }
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
    cars = newcars

    for (var i = 0; i < stripes.length; i++) {
        stripes[i].y += base_velocity
        if (stripes[i].y > screen.height) {
            stripes[i].y -= stripes[i].height * 0.5 * stripes.length
        }
    }

    if (hatDrop) {
        hatDrop.y += base_velocity
        if (hatDrop.y > screen.height) {
            hatDrop.destroy()
            hatDrop = null
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

    for (var i = 0; i < cars.length; i++) {
        if (collides(bike, cars[i])) {
            console.log("CRASH")
            crashed = true;
            if ((bike.x + bike.width / 2)
            < (cars[i].x + cars[i].width / 2)) {
                crash_direction = -1
            }
        }
    }

    if (roomForMore) {
        var c = carComponent.createObject(screen, {
            x: 200,
            y: 0,
            z: screen.layer_cars,
            color: get_car_color()
        });
        c.y -= c.height * 1.9 // space between cars
        c.x = Math.random() * (screen.width - c.width)
        c.velocity = base_velocity
        if (c == null) {
            console.log("ERROR: " + carComponent.errorString())
        } else {
            cars.push(c)
        }

        if (should_hat_drop()) {
            hatDrop = generate_hat()
            if ((c.x + c.width/2) < screen.width/2) {
                hatDrop.x = c.x + 2 * c.width
            } else {
                hatDrop.x = c.x - c.width
            }
            hatDrop.y = c.y + c.height/2
        }
    }

    if (hatDrop && collides(bike, hatDrop)) {
        var clone = hatDrop.component.createObject(bike, {
            primaryColor: hatDrop.primaryColor,
            secondaryColor: hatDrop.secondaryColor,
            component: hatDrop.component,
        })
        bike.attach_hat(clone)
        if (!bike.hat_exists(clone)) {
            bike.store_hat(clone);
        }
        hatDrop.destroy()
        hatDrop = null
    }
}
