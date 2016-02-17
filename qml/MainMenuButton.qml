import QtQuick 2.0

Text {
    property var cb
    property string label
    font.pixelSize: screen.height * 0.075
    text: label
    MouseArea {
        anchors.fill: parent
        onClicked: {
            cb()
        }
    }
}

