import QtQuick 2.0

Item {
    width: 25
    height: 100

    property int velocity: 0
    property string color: "green"
    property real rotationAngle: 0

    transform: Rotation {
        origin.x: width / 2
        origin.y: height / 2
        axis { x: 0; y: 0; z: 1 }
        angle: rotationAngle
    }

    Rectangle {
        id: body
        width: parent.width
        height: parent.height
        color: parent.color
        radius: 15.0
    }
}
