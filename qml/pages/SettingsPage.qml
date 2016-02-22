import QtQuick 2.0
import Sailfish.Silica 1.0
import "../all.js" as Engine

Page {
    id: page
    property var engine

    SilicaFlickable {
        anchors.fill: parent
        contentHeight: column.height
        Column {
            id: column
            width: page.width
            PageHeader {
                title: "Settings"
            }

            TextSwitch {
                text: "Hat autopickup"
                checked: page.engine.hat_autopickup

                onCheckedChanged: {
                    page.engine.hat_autopickup = checked;
                }
            }

            Slider {
                visible: false
                label: "Car spacing"
                width: parent.width
                minimumValue: 1
                maximumValue: 5
                stepSize: 0.5
                value: page.engine.car_spacing
                valueText: value
                onValueChanged: {
                    page.engine.car_spacing = value;
                }
            }
            Slider {
                visible: false
                label: "Car speed"
                width: parent.width
                minimumValue: 1
                maximumValue: 10
                stepSize: 1
                value: page.engine.base_velocity
                valueText: value
                onValueChanged: {
                    page.engine.base_velocity = value;
                }
            }
            Slider {
                visible: false
                label: "Bike turn speed"
                width: parent.width
                minimumValue: 1
                maximumValue: 15
                stepSize: 1
                value: page.engine.bike_turn_velocity
                valueText: value
                onValueChanged: {
                    console.log("Now is " + value);
                    page.engine.bike_turn_velocity = value;
                }
            }
        }
    }
}
