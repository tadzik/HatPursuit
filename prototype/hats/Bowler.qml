import QtQuick 2.0

Item {
    width: 30
    height: 20

    property string primaryColor: "black"
    property string secondaryColor: "red"
    property real rotationAngle: 10
    property var component: null

    Rectangle {
        id: topThing
        width: parent.width * 0.6
        height: parent.height
        color: primaryColor
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        border.width: 1
        border.color: "grey"
        radius: height / 2
    }

    Rectangle {
        id: baseThing
        width: parent.width
        height: parent.height / 4
        color: primaryColor
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        border.width: 1
        border.color: "grey"
        radius: 3
    }

    Rectangle {
        id: stripe
        height: topThing.height / 5
        width: topThing.width
        color: secondaryColor
        anchors.bottom: baseThing.top
        anchors.horizontalCenter: topThing.horizontalCenter
        radius: 2
    }

    transform: Rotation {
        origin.x: width / 2
        origin.y: height / 2
        axis { x: 0; y: 0; z: 1 }
        angle: rotationAngle
    }
}
