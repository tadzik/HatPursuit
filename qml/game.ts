/// <reference path="HatPursuitDB.ts" />

var debug = false
function log(msg: string) {
    if (debug) console.log(msg)
}

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
    "mediumaquamarine", "mediumblue", "mediumseagreen",
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

class Engine {
    screen: Screen;
    db: HatPursuitDB;
    carComponent:    any = Qt.createComponent("Car.qml")
    bikeComponent:   any = Qt.createComponent("Bike.qml")
    stripeComponent: any = Qt.createComponent("Stripe.qml")
    topHatComponent: any = Qt.createComponent("hats/TopHat.qml")
    bowlerComponent: any = Qt.createComponent("hats/Bowler.qml")

    // configurable stuff
    base_velocity:      number  = 8
    car_spacing:        number  = 2.5
    bike_turn_velocity: number  = 6
    hat_autopickup:     boolean;

    hats: any = {
        "bowler": this.bowlerComponent,
        "tophat": this.topHatComponent
    }

    // game state stuff
    bike:            Bike           = null
    chosen_hat:      Hat            = null
    hatDrop:         HatComponent   = null
    cars:            Car[]          = []
    stripes:         Component[]    = []
    running:         boolean        = true
    crashed:         boolean        = false
    crash_direction: number         = 1
    disable_cars:    boolean        = false
    collected_hats:  HatComponent[] = []
    gameover:        boolean        = false

    constructor(s: Screen) {
        this.screen = s
        this.db = s.get_DB()
        this.read_settings()
    }

    write_settings() {
        this.db.set_setting("hat_autopickup", this.hat_autopickup ? "true" : "")
    }

    read_settings() {
        this.hat_autopickup = this.db.get_setting("hat_autopickup") === "true"
    }

    clear_cars() {
        for (var car of this.cars) {
            car.destroy()
        }
        this.cars = []
    }

    clear_hats() {
        if (this.hatDrop) {
            this.hatDrop.destroy()
            this.hatDrop = null
        }
    }

    /*
       game modes state machine:
                           +-------------------------------------+
                          \|/                                    |
       +-------+     +-----------+     +-----------+     +---------------+
       | START | --> | mode_menu | --> | mode_game | --> | mode_gameover |
       +-------+     +-----------+     +-----------+     +---------------+
                        |    /|\
                       \|/    |
                   +----------------+
                   | mode_highscore |
                   +----------------+
    */

    mode_menu() {
        this.running = false
        this.gameover = false
        this.disable_cars = false
        this.screen.mode_menu()
        for (var h of this.collected_hats) {
            h.destroy()
        }
        this.collected_hats = []
    }

    // like menu, but without cars
    mode_highscore() {
        this.clear_cars()
        this.clear_hats()
        this.disable_cars = true
        this.screen.mode_highscore()
    }

    mode_game() {
        this.crashed = false
        this.bike = null
        score.distance = 0
        this.clear_cars()
        this.clear_hats()
        this.running = true
        this.screen.mode_game()
    }

    mode_gameover() {
        this.gameover = true
        this.disable_cars = true
        this.clear_cars()
        this.clear_hats()
        this.screen.mode_gameover(this.collected_hats.length > 0)
    }

    on_left() {
        if (this.gameover) {
            this.mode_menu()
            return
        }
        if (this.crashed || !this.running) return
        this.bike.turn_left()
    }

    on_right() {
        if (this.gameover) {
            this.mode_menu()
            return
        }
        if (this.crashed || !this.running) return
        this.bike.turn_right()
    }

    should_hat_drop() : boolean {
        return this.hatDrop == null
    }

    generate_hat() : HatComponent {
        var components = []
        // of course, Javascript doesn't (yet) have obj.values()
        for (var key in this.hats) components.push(this.hats[key])
        var idx = Math.floor(Math.random() * components.length);
        return components[idx].createObject(this.screen, {
            primaryColor:   this.get_hat_color(),
            secondaryColor: this.get_hat_color(),
            z:              this.screen.layer_hats,
            component:      components[idx],
        })
    }

    create_hat_component(hat: Hat, parent) : HatComponent {
        return this.hats[hat.name].createObject(parent, {
            primaryColor: hat.primaryColor,
            secondaryColor: hat.secondaryColor,
            z: this.screen.layer_hats,
        })
    }

    select_hat(hat: Hat) {
        this.chosen_hat = hat
    }

    new_stripe(x: number, i: number) {
        var s = this.stripeComponent.createObject(this.screen, {
            x: x,
            y: 0,
            z: this.screen.layer_stripes });
        s.x -= s.width / 2;
        s.y += i * s.height * 1.5;

        this.stripes.push(s);
    }

    init_bike() : Bike {
        var b = this.bikeComponent.createObject(this.screen)
        b.anchors.bottom = this.screen.bottom
        b.anchors.bottomMargin = 50
        b.x = (this.screen.width - b.width) / 2
        b.z = this.screen.layer_cars
        b.color = "green"
        b.turnVelocity = this.bike_turn_velocity
        return b
    }

    init_stripes() {
        for (var i = 0; i < 8; i++) {
            this.new_stripe(this.screen.width / 4, i);
            this.new_stripe(this.screen.width - this.screen.width / 4, i);
            this.new_stripe(this.screen.width / 2, i);
        }
    }

    // this shit better be correct for I really don't
    // want to debug this mess -- me, 4.07.2015
    // update 20.01.2016: fuck it, I'll just copypaste from MDN
    collides(rect1: Component, rect2: Component) : boolean {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
            return true
        }
        return false
    }

    after_crash() {
        this.bike.x += 4 * this.crash_direction
        this.bike.rotationAngle += 4.0
        if (this.bike.rotationAngle % 360 == 0
        || this.bike.x > this.screen.width
        || this.bike.x + this.bike.width < 0) {
            var points = Math.floor(score.distance)
            if (points > parseInt(highScore.bestScore)) {
                this.db.add_score(points);
                highScore.bestScore = points.toString();
            }
            this.bike.destroy()
            this.mode_gameover()
        }
    }

    colors: string[] = [];
    get_car_color() : string {
        var index = Math.floor(Math.random() * this.colors.length);

        if (this.colors.length == 0) {
            this.colors = all_colors.slice();
        }

        return this.colors.splice(index, 1)[0];
    }

    get_hat_color() : string {
        return this.get_car_color()
    }

    update_cars() {
        if (this.disable_cars) return
        var newcars = []
        var roomForMore = true
        for (var car of this.cars) {
            car.y += car.velocity
            if (car.y <= this.screen.height) {
                newcars.push(car)
                if (car.y < 0) {
                    roomForMore = false
                }
            } else {
                car.destroy()
            }
        }
        this.cars = newcars

        if (roomForMore) {
            var c = this.carComponent.createObject(this.screen, {
                x:     200,
                y:     0,
                z:     this.screen.layer_cars,
                color: this.get_car_color()
            });
            c.y -= c.height * this.car_spacing // space between cars
            c.x = Math.random() * (this.screen.width - c.width)
            c.velocity = this.base_velocity
            if (c === null) {
                console.log("ERROR: " + this.carComponent.errorString())
            } else {
                this.cars.push(c)
            }

            if (this.should_hat_drop()) {
                this.hatDrop = this.generate_hat()
                if ((c.x + c.width/2) < this.screen.width/2) {
                    this.hatDrop.x = c.x + 2 * c.width
                } else {
                    this.hatDrop.x = c.x - c.width
                }
                this.hatDrop.y = c.y + c.height/2
            }
        }

    }

    update_stripes() {
        if (this.stripes.length == 0) {
            this.init_stripes()
        }

        for (var stripe of this.stripes) {
            stripe.y += this.base_velocity
            if (stripe.y > this.screen.height) {
                stripe.y -= stripe.height * 0.5 * this.stripes.length
            }
        }
    }

    update_hats() {
        if (this.hatDrop) {
            this.hatDrop.y += this.base_velocity
            if (this.hatDrop.y > this.screen.height) {
                this.hatDrop.destroy()
                this.hatDrop = null
            }
        }
    }

    update() {
        this.update_stripes()
        this.update_cars()
        this.update_hats()

        if (this.crashed) {
            return this.after_crash()
        }

        if (!this.running) return

        if (!this.bike) {
            this.bike = this.init_bike()
            var hat = this.chosen_hat
            if (hat === null) {
                hat = this.db.get_latest_hat()
            }

            if (hat) {
                this.bike.attach_hat(this.create_hat_component(hat, this.bike))
            }
        }


        score.distance += 0.1;
        this.bike.x += this.bike.velocity;
        if (this.bike.x + this.bike.velocity < leftBorder.width) {
            this.crashed = true;
            this.crash_direction = -1;
        }
        if ((this.bike.x + this.bike.velocity) > (rightBorder.x - this.bike.width)) {
            this.crashed = true;
            this.crash_direction = 1;
        }

        for (var car of this.cars) {
            if (this.collides(this.bike, car)) {
                this.crashed = true;
                if ((this.bike.x + this.bike.width / 2) < (car.x + car.width / 2)) {
                    this.crash_direction = -1
                }
            }
        }

        if (this.hatDrop && this.collides(this.bike, this.hatDrop)) {
            if (!this.db.hat_exists(this.hatDrop)) {
                this.db.store_hat(this.hatDrop)
            }
            if (this.hat_autopickup) {
                var clone = this.hats[this.hatDrop.name].createObject(this.bike, {
                    primaryColor:   this.hatDrop.primaryColor,
                    secondaryColor: this.hatDrop.secondaryColor,
                })
                this.bike.attach_hat(clone)
            }
            this.hatDrop.visible = false
            var hatparent = this.screen.get_hat_container()
            var hatCopy = this.create_hat_component(this.hatDrop, hatparent)
            this.collected_hats.push(hatCopy)
            this.hatDrop.destroy()
            this.hatDrop = null
        }
    }
}
