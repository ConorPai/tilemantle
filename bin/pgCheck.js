const pg = require('pg');

var globalThis = undefined;

function pgCheck (options) {

    var dbconfig = {
        host:       options.host == undefined ? 'localhost' : options.host,
        port:       options.port,
        database:   options.database,
        user:       options.user,
        password:   options.password,

        max:100,
        idleTileoutMillis:3000,
    }
    this.pgpool = new pg.Pool(dbconfig);
    this.tablename = options.tablename;
    this.tablewhere = options.tablewhere;
    globalThis = this;
};

module.exports = pgCheck;

//sql查询
function sqlquery (sql, calback) {

    globalThis.pgpool.query(sql, (err, res) => {
        calback(err, res);
      });
};


pgCheck.prototype.checkNeedRequest = (bbox, callback) => {
    
    var sql = "select count(*) as datacount from " + globalThis.tablename + " where st_intersects(geom, st_setsrid(st_makeenvelope(" + bbox[0] + "," + bbox[1] + "," + bbox[2] + "," + bbox[3] + "),4490))"

    if (globalThis.tablewhere != undefined)
        sql += " and " + globalThis.tablewhere;

    sqlquery(sql, function(err, res){
        callback(res.rows[0]["datacount"] > 0);
    });
};