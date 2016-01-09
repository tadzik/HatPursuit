import QtQuick 2.0

Item {
    width: 120
    height: 200

    property int velocity
    property int wheelWidth: 16
    property int wheelHeight: 45
    property int lightRadius: 24

    Rectangle {
        id: leftLight
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.leftMargin: parent.wheelWidth
        anchors.topMargin: -parent.lightRadius / 4
        width: parent.lightRadius
        height: parent.lightRadius
        radius: parent.lightRadius
        color: "yellow"
    }

    Rectangle {
        id: rightLight
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.rightMargin: parent.wheelWidth
        anchors.topMargin: -parent.lightRadius / 4
        width: parent.lightRadius
        height: parent.lightRadius
        radius: parent.lightRadius
        color: "yellow"
    }

    Rectangle {
        id: topLeftWheel
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.topMargin: 25
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: 25.0
        color: "black"
    }

    Rectangle {
        id: topRightWheel
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.topMargin: 25
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: 25.0
        color: "black"
    }

    Rectangle {
        id: bottomLeftWheel
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.bottomMargin: 25
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: 25.0
        color: "black"
    }

    Rectangle {
        id: bottomRightWheel
        anchors.bottom: parent.bottom
        anchors.right: parent.right
        anchors.bottomMargin: 25
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: 25.0
        color: "black"
    }

    Rectangle {
        id: body
        width: parent.width
        height: parent.height
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.leftMargin: parent.wheelWidth / 2
        anchors.rightMargin: parent.wheelWidth / 2
        anchors.topMargin: parent.lightRadius / 2
        color: "red"
        radius: 15.0
    }

    Rectangle {
        id: roof
        radius: 15.0
        width: body.width
        height: body.height / 2
        anchors.horizontalCenter: body.horizontalCenter
        anchors.verticalCenter: body.verticalCenter
        color: body.color
        border.color: "black"
        border.width: 3
    }
}
