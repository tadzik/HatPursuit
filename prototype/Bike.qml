import QtQuick 2.0

Item {
    width: 25
    height: 100

    property int velocity: 0
    property string color: "green"
    property real rotationAngle: 0

    function turnLeft() {
        velocity = -8
        rotationAngle = -15
    }

    function turnRight() {
        velocity = 8
        rotationAngle = 15
    }

    function attachHat(hat) {
        hat.anchors.bottom = backWheel.top
        hat.anchors.horizontalCenter = body.horizontalCenter
    }

    transform: Rotation {
        origin.x: width / 2
        origin.y: height / 2
        axis { x: 0; y: 0; z: 1 }
        angle: rotationAngle
    }

    Rectangle {
        id: frontWheel
        width: parent.width
        height: parent.height / 3
        anchors.top: parent.top
        color: "black"
        radius: 25.0
    }

    Rectangle {
        id: backWheel
        width: parent.width
        height: parent.height / 3
        anchors.bottom: parent.bottom
        color: "black"
        radius: 25.0
    }

    Rectangle {
        id: body
        width: parent.width
        height: parent.height / 2
        anchors.verticalCenter: parent.verticalCenter
        color: parent.color
        radius: 15.0
    }

    Rectangle {
        id: handle
        width: parent.width * 2
        height: body.height / 5
        anchors.horizontalCenter: body.horizontalCenter
        anchors.top: body.top
        anchors.topMargin: height / 2
        radius: 15.0
        color: "green"
    }
}
