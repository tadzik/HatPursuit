import QtQuick 2.0
import QtQuick.Controls 1.4

Slider {
    property string valueText: ""
    property string label: ""
    implicitHeight: vlTxt.implicitHeight * 3
    Text {
        id: vlTxt
        text: valueText
        anchors.top: parent.top

        Component.onCompleted: {
            parent.valueChanged.connect(adjustPosition)
        }

        function adjustPosition() {
            var max = parent.maximumValue - parent.minimumValue
            var cur = parent.value - parent.minimumValue
            x = parent.x + parent.width * cur/max - width/2
        }
    }

    Text {
        id: lbl
        text: label
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter

        Component.onCompleted: {
            font.pointSize = 0.8 * font.pointSize
        }
    }

    onWidthChanged: {
        vlTxt.adjustPosition()
    }
}
