const moment = require('moment'); // require
moment().format(); 

console.log(moment().diff(moment("2012-07-15T00:00:00.000Z") , "months"));