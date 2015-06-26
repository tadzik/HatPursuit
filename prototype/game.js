var cars = []
var carComponent = Qt.createComponent("Car.qml")

function init() {
}

function update() {
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
