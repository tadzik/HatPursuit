import QtQuick 2.0;
import "game.js" as Engine

Rectangle {
    id: screen
    width: 540
    height: 960
    color: "gray"

    Timer {
        id: gameTimer
        interval: 16
        repeat: true
        running: true
        onTriggered: Engine.update()
    }
}
