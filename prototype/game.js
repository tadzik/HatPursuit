function onUpdate() {
    car.y += 10
    if (car.y > screen.height) {
        car.y = 0 - car.height
    }
}
