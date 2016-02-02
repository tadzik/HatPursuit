import QtQuick 2.0

Text {
    property string title
    anchors.right: parent.right

    Component.onCompleted: {
        text = title
        font.pointSize = 2 * font.pointSize
    }
}
