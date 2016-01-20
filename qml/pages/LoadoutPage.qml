import QtQuick 2.0
import Sailfish.Silica 1.0
import "../game.js" as Engine


Page {
    id: page
    property var engine
    property var db

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substr(1)
    }

    SilicaListView {
        id: listView
        anchors.fill: parent
        model: ListModel {
            id: model

            Component.onCompleted: {
                db.transaction(
                    function (tx) {
                        var rs = tx.executeSql('SELECT * FROM Hats ORDER BY datetime DESC')
                        for(var i = 0; i < rs.rows.length; i++) {
                            var hat = rs.rows.item(i).hat.split(",");
                            model.append({ name: hat[0], primaryColor: hat[1], secondaryColor: hat[2] })
                        }
                    }
                );

            }
        }

        delegate: Item {
            id: item
            width: ListView.view.width
            height: Theme.itemSizeSmall

            Row {
                spacing: Theme.paddingLarge

                Rectangle {
                    id: rekt
                    color: "grey"
                    width: parent.parent.height
                    height: parent.parent.height

                    Component.onCompleted: {
                        var hat = engine.hats[name].createObject(rekt, {
                            primaryColor: primaryColor,
                            secondaryColor: secondaryColor,
                        });
                        hat.anchors.centerIn = rekt
                    }
                }

                Label {
                    anchors.verticalCenter: parent.verticalCenter
                    text: page.capitalize(primaryColor) + "-" + page.capitalize(secondaryColor) + " " + page.capitalize(name)
                }
            }

            MouseArea {
                anchors.fill: parent
                onClicked: {
                    engine.select_hat({ name: name, primaryColor: primaryColor, secondaryColor: secondaryColor })
                    pageStack.pop()
                }
            }
        }
    }
}
