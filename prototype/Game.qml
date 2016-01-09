import QtQuick 2.0;
import "game.js" as Engine

Rectangle {
    id: screen
    width: 540
    height: 960
    color: "gray"
    focus: true

    Keys.onLeftPressed:  { console.log("Left!"); motor.velocity  = -8; }
    Keys.onRightPressed: { console.log("Right!"); motor.velocity =  8; }

    Rectangle {
        id: leftBorder
        width: 10
        height: 960
        color: "black"

        // Component.onCompleted: {}
    }

    Rectangle {
        id: rightBorder
        width: 10
        height: 960
        color: "black"

        Component.onCompleted: { x = screen.width - rightBorder.width }
    }

    Rectangle {
        id: motor
        width: 50
        height: 50
        color: "green"
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 50
        Component.onCompleted: { x = screen.width / 2 - motor.width / 2 }

        property int velocity

        transform: Rotation {
            id: motor_rotation
            origin.x: motor.width / 2
            origin.y: motor.height / 2
            axis { x: 0; y: 0; z: 1 }
            angle: 0
        }
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
            onClicked: { console.log("Left!"); motor.velocity = -8 }
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
            onClicked: { console.log("Right!"); motor.velocity = 8; }
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
