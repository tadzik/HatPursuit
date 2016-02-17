import QtQuick 2.0

Item {
    height: screen.height * 0.21
    width: height * 0.6

    property int velocity
    property int wheelWidth: width * 0.13
    property int wheelHeight: height * 0.225
    property int lightRadius: width * 0.2
    property string color: "red"

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
        anchors.topMargin: parent.height / 8
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: parent.height / 8.0
        color: "black"
    }

    Rectangle {
        id: topRightWheel
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.topMargin: parent.height / 8
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: parent.height / 8.0
        color: "black"
    }

    Rectangle {
        id: bottomLeftWheel
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.bottomMargin: parent.height / 8
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: parent.height / 8.0
        color: "black"
    }

    Rectangle {
        id: bottomRightWheel
        anchors.bottom: parent.bottom
        anchors.right: parent.right
        anchors.bottomMargin: parent.height / 8
        width: parent.wheelWidth
        height: parent.wheelHeight
        radius: parent.height / 8.0
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
        color: parent.color
        radius: parent.width / 8.0
    }

    Rectangle {
        id: roof
        width: body.width
        height: body.height / 2
        anchors.horizontalCenter: body.horizontalCenter
        anchors.verticalCenter: body.verticalCenter
        color: body.color
        border.color: "black"
        border.width: 3
        radius: parent.width / 8.0
    }
}
