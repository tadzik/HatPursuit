var cars = []
var carComponent = Qt.createComponent("Car.qml")

function init() {
}

function update() {
    var newcars = []
    for (var i = 0; i < cars.length; i++) {
        var car = cars[i]
        car.y += car.velocity
        if (car.y <= screen.height) {
            newcars.push(car)
        } else {
            car.destroy()
        }
    }
    cars = newcars

    while (cars.length < 1) {
        var c = carComponent.createObject(screen, { x: 200, y: 0 })
        c.y -= c.height
        c.velocity = 10
        if (c == null) {
            console.log("ERROR: " + carComponent.errorString())
        } else {
            cars.push(c)
        }
    }
}
