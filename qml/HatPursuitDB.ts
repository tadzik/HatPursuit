/// <reference path="qmlstuff.d.ts" />

class HatPursuitDB {
    dbh: Database;

    //constructor(dbh: Database) {
    //    this.dbh = dbh;
    //}
    constructor() {
        this.dbh = LocalStorage.openDatabaseSync(
            "QQmlHatPursuitDb", "1.0", "The HatPursuit QML SQL!",
            1000, this.dbconfig)
    }

    dbconfig(db: Database) {
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Score(score TEXT)');
            tx.executeSql('INSERT INTO Score VALUES("0")');

            tx.executeSql('CREATE TABLE IF NOT EXISTS Hats(hat TEXT, datetime STRING)');
        });
        db.changeVersion("", "1.0");
    }

    deserialize_hat(hat: string) : Hat {
        var fields = hat.split(",");
        return { name: fields[0], primaryColor: fields[1], secondaryColor: fields[2] };
    }

    serialize_hat(hat: Hat) : string {
        return hat.name + ',' + hat.primaryColor + ',' + hat.secondaryColor
    }

    getFormattedDate() : string {
        var date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1)
                                  + "-" + date.getDate()
                                  + " " +  date.getHours()
                                  + ":" + date.getMinutes()
                                  + ":" + date.getSeconds();
    }
    
    get_latest_hat() : Hat {
        var hat = null
    
        this.dbh.transaction((tx) => {
            var rs = tx.executeSql('SELECT * FROM Hats ORDER BY datetime DESC LIMIT 1')
            if (rs.rows.item(0)) {
                hat = this.deserialize_hat(rs.rows.item(0).hat);
            }
        });
    
        return hat;
    }

    get_all_hats() : Hat[] {
        var ret = [];
        this.dbh.transaction((tx) => {
            var rs = tx.executeSql('SELECT * FROM Hats ORDER BY datetime DESC')
            for (var i = 0; i < rs.rows.length; i++) {
                var hat = this.deserialize_hat(rs.rows.item(i).hat);
                ret.push(hat);
            }
        });
        return ret;
    }
    
    hat_exists(hat: Hat) : boolean {
        var exists = false
    
        this.dbh.transaction((tx) => {
            var rs = tx.executeSql('SELECT * FROM Hats WHERE hat = ?', [ hat.name + ',' + hat.primaryColor + ',' + hat.secondaryColor ])

            if (rs.rows.item(0)) {
                exists = true
            }
        });
    
        return exists;
    }
    
    store_hat(hat: Hat) {
        this.dbh.transaction((tx) => {
            tx.executeSql('INSERT INTO Hats VALUES (?, ?)', [ this.serialize_hat(hat), this.getFormattedDate() ]);
        });
    }

    get_high_score() : number {
        var highScore;

        this.dbh.transaction((tx) => {
            var rs = tx.executeSql('SELECT * FROM Score');
            highScore = rs.rows.item(0).score;
        });
        return parseInt(highScore);
    }

    add_score(score: string) {
        this.dbh.transaction((tx) => {
            tx.executeSql('UPDATE Score SET score = ?', [ score ]);
        });
    }
}
