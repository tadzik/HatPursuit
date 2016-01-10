import QtQuick 2.0;
import "game.js" as Engine

Rectangle {
    id: screen
    width: 540
    height: 960
    color: "gray"
    focus: true

    Keys.onLeftPressed:  Engine.onLeft()
    Keys.onRightPressed: Engine.onRight()

    Text {
        property real distance: 0

        id: score
        text: Math.floor(distance).toString()
        font.pixelSize: 25

        anchors.top: parent.top
        anchors.left: parent.left
        anchors.topMargin: 10
        anchors.leftMargin: 25
    }

    Text {
        property real distance: 0

        id: highScore
        text: "Top Score: miljart"
        font.pixelSize: 25

        anchors.top: parent.top
        anchors.right: parent.right
        anchors.topMargin: 10
        anchors.rightMargin: 25
    }

    Rectangle {
        id: leftBorder
        width: 10
        height: 960
        color: "black"
    }

    Rectangle {
        id: rightBorder
        width: 10
        height: 960
        color: "black"

        Component.onCompleted: { x = screen.width - rightBorder.width }
    }

    Rectangle {
        id: leftHalf
        anchors.left: parent.left
        anchors.right: parent.horizontalCenter
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        opacity: 0
        MouseArea {
            anchors.fill: parent
            onClicked: Engine.onLeft()
        }
    }

    Rectangle {
        id: rightHalf
        anchors.left: parent.horizontalCenter
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        opacity: 0
        MouseArea {
            anchors.fill: parent
            onClicked: Engine.onRight()
        }
    }

    Timer {
        id: gameTimer
        interval: 16
        repeat: true
        running: true
        onTriggered: Engine.update()
    }
}
