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
var car_spacing = 2.5
var bike_turn_velocity = 6

var all_colors = [
    "aliceblue", "aqua", "aquamarine", "azure", "beige", "bisque",
    "black", "blue", "burlywood",
    "chartreuse", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan",
    "darkgoldenrod", "darkgreen",
    "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange",
    "darkslategray",
    "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
    "firebrick", "fuchsia",
    "gold", "goldenrod",
    "hotpink", "indigo", "ivory", "khaki", "lavender",
    "lawngreen", "lemonchiffon", "lightcoral",
    "lightgoldenrodyellow", "lightgrey",
    "lightseagreen", "lightskyblue",
    "lightsteelblue", "limegreen", "maroon",
    "mediumaquamarine", "mediumblue", "mediumorchid", "mediumseagreen",
    "mediumspringgreen",
    "midnightblue", "mintcream", "mistyrose", "moccasin",
    "oldlace", "orange", "orangered", "orchid",
    "papayawhip", "peachpuff", "peru",
    "pink", "plum", "powderblue", "purple", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "snow", "springgreen", "tan",
    "thistle", "tomato", "turquoise", "violet", "wheat",
    "yellow", "yellowgreen"
]

/////////////////////
/// DATABASE SHIT ///
/////////////////////

function getFormattedDate() {
    var date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function get_latest_hat() {
    var db = screen.get_DB(), hat = null

    db.transaction(
        function (tx) {
            var rs = tx.executeSql('SELECT * FROM Hats ORDER BY datetime DESC LIMIT 1')
            if (rs.rows.item(0)) {
                hat = rs.rows.item(0).hat.split(",")
            }
        }
    );

    return { name: hat[0], primaryColor: hat[1], secondaryColor: hat[2] }
}

function hat_exists(hat) {
    var db = screen.get_DB(), exists = false

    db.transaction(
        function (tx) {
            var rs = tx.executeSql('SELECT * FROM Hats WHERE hat = ?', [ hat.name + ',' + hat.primaryColor + ',' + hat.secondaryColor ])

            if (rs.rows.item(0)) {
                exists = true
            }
        }
    );

    return exists;
}

function store_hat(hat) {
    var db = screen.get_DB()

    db.transaction(
        function (tx) {
            tx.executeSql('INSERT INTO Hats VALUES (?, ?)', [
                hat.name + ',' + hat.primaryColor + ',' + hat.secondaryColor,
                getFormattedDate()
            ]);
        }
    );
}

////////////////////////////
/// END OF DATABASE SHIT ///
////////////////////////////

var chosen_hat = null
var bike = null
var hatDrop = null
var hats = {
    "bowler": bowlerComponent,
    "tophat": topHatComponent
};

var running = true
function mode_menu() {
    running = false
    screen.mode_menu()
}

function mode_game() {
    crashed = false
    bike = null
    score.distance = 0
    running = true
    screen.mode_game()
}

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

function create_hat_component(hat, parent) {
    console.log(hat.name)
    return hats[hat.name].createObject(parent, {
        primaryColor: hat.primaryColor,
        secondaryColor: hat.secondaryColor,
        z: screen.layer_hats,
    })
}

function select_hat(hat) {
    chosen_hat = hat
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
    b.color = "green"
    b.turnVelocity = bike_turn_velocity
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
// want to debug this mess -- me, 4.07.2015
// update 20.01.2016: fuck it, I'll just copypaste from MDN
function collides(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) {
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
        console.log("Current high score is " + score.getHighScore());
        if (score.distance > score.getHighScore()) {
            console.log("Updating high score");
            score.addScore(score.text);
        }
        bike.destroy()
        mode_menu()
    }
}

var colors = [];
function get_car_color() {
    var index = Math.floor(Math.random() * colors.length);

    if (colors.length == 0) {
        colors = all_colors.slice();
    }

    return colors.splice(index, 1)[0];
}

function get_hat_color() {
    return get_car_color()
}

function update_cars() {
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

    if (roomForMore) {
        var c = carComponent.createObject(screen, {
            x: 200,
            y: 0,
            z: screen.layer_cars,
            color: get_car_color()
        });
        console.log("Spawning car with color " + c.color)
        c.y -= c.height * car_spacing // space between cars
        c.x = Math.random() * (screen.width - c.width)
        c.velocity = base_velocity
        if (c === null) {
            console.log("ERROR: " + carComponent.errorString())
        } else {
            cars.push(c)
        }

        if (should_hat_drop()) {
            hatDrop = generate_hat()
            console.log("Generating hat with colors " + hatDrop.primaryColor + ", " + hatDrop.secondaryColor)
            if ((c.x + c.width/2) < screen.width/2) {
                hatDrop.x = c.x + 2 * c.width
            } else {
                hatDrop.x = c.x - c.width
            }
            hatDrop.y = c.y + c.height/2
        }
    }

}

function update_stripes() {
    if (stripes.length == 0) {
        init_stripes()
    }

    for (var i = 0; i < stripes.length; i++) {
        stripes[i].y += base_velocity
        if (stripes[i].y > screen.height) {
            stripes[i].y -= stripes[i].height * 0.5 * stripes.length
        }
    }
}

function update_hats() {
    if (hatDrop) {
        hatDrop.y += base_velocity
        if (hatDrop.y > screen.height) {
            hatDrop.destroy()
            hatDrop = null
        }
    }
}

function update() {
    update_stripes()
    update_cars()
    update_hats()

    if (crashed) {
        return after_crash()
    }

    if (!running) return

    if (!bike) {
        bike = init_bike()
        if (chosen_hat === null) {
            chosen_hat = get_latest_hat()
        }

        bike.attach_hat(create_hat_component(chosen_hat, bike))
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

    if (hatDrop && collides(bike, hatDrop)) {
        var clone = hats[hatDrop.name].createObject(bike, {
            primaryColor: hatDrop.primaryColor,
            secondaryColor: hatDrop.secondaryColor,
            component: hatDrop.component,
        })
        if (!hat_exists(clone)) {
            store_hat(clone)
        }
        hatDrop.destroy()
        hatDrop = null
    }
}
