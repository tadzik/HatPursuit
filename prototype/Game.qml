import QtQuick 2.0;
import "game.js" as Engine

Rectangle {
    id: screen
    width: 540
    height: 960
    color: "gray"

    Image {
        id: car
        width: 120
        height: 242
        x: 200
        y: 0
        source: "racecar.png"
    }

    Timer {
        id: gameTimer
        interval: 16
        repeat: true
        running: true
        onTriggered: Engine.onUpdate()
    }
}
