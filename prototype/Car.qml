import QtQuick 2.0;

Item {
    width: 120
    height: 200

    property int velocity
    property int wheelWidth: 16
    property int lightRadius: 24

    // left lights
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.leftMargin: parent.wheelWidth
        anchors.topMargin: -parent.lightRadius / 4
        width: parent.lightRadius
        height: parent.lightRadius
        radius: parent.lightRadius
        color: "yellow"
    }

    // right light
    Rectangle {
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.rightMargin: parent.wheelWidth
        anchors.topMargin: -parent.lightRadius / 4
        width: parent.lightRadius
        height: parent.lightRadius
        radius: parent.lightRadius
        color: "yellow"
    }

    // wheels
    // top left
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.topMargin: 25
        width: parent.wheelWidth
        height: 45
        radius: 25.0
        color: "black"
    }

    // top right
    Rectangle {
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.topMargin: 25
        width: parent.wheelWidth
        height: 45
        radius: 25.0
        color: "black"
    }

    // bottom left
    Rectangle {
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.bottomMargin: 25
        width: parent.wheelWidth
        height: 45
        radius: 25.0
        color: "black"
    }

    // bottom right
    Rectangle {
        anchors.bottom: parent.bottom
        anchors.right: parent.right
        anchors.bottomMargin: 25
        width: parent.wheelWidth
        height: 45
        radius: 25.0
        color: "black"
    }

    // body
    Rectangle {
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
}
