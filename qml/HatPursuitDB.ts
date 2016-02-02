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
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Score(score TEXT)');
            tx.executeSql('INSERT INTO Score VALUES("0")');

            tx.executeSql('CREATE TABLE IF NOT EXISTS Hats(hat TEXT, datetime STRING)');
        });
        db.changeVersion("", "1.0");
    }

    getFormattedDate() : string {
        var date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1)
                                  + "-" + date.getDate()
                                  + " " +  date.getHours()
                                  + ":" + date.getMinutes()
                                  + ":" + date.getSeconds();
    }
    
    get_latest_hat() : any {
        var hat = null
    
        this.dbh.transaction(function (tx) {
            var rs = tx.executeSql('SELECT * FROM Hats ORDER BY datetime DESC LIMIT 1')
            if (rs.rows.item(0)) {
                hat = rs.rows.item(0).hat.split(",")
            }
        });
    
        return { name: hat[0], primaryColor: hat[1], secondaryColor: hat[2] }
    }
    
    hat_exists(hat: any) : boolean {
        var exists = false
    
        this.dbh.transaction(function (tx) {
            var rs = tx.executeSql('SELECT * FROM Hats WHERE hat = ?', [ hat.name + ',' + hat.primaryColor + ',' + hat.secondaryColor ])

            if (rs.rows.item(0)) {
                exists = true
            }
        });
    
        return exists;
    }
    
    store_hat(hat: any) {
        this.dbh.transaction(function (tx) {
            tx.executeSql('INSERT INTO Hats VALUES (?, ?)', [
                hat.name + ',' + hat.primaryColor + ',' + hat.secondaryColor,
                this.getFormattedDate()
            ]);
        });
    }

    get_high_score() : number {
        var highScore;

        this.dbh.transaction(function (tx) {
            var rs = tx.executeSql('SELECT * FROM Score');
            highScore = rs.rows.item(0).score;
        });
        return parseInt(highScore);
    }

    add_score(score: string) {
        this.dbh.transaction(function (tx) {
            tx.executeSql('UPDATE Score SET score = ?', [ score ]);
        });
    }
}
