require("../models/db");
const Counter = require('../models/counter')
    async function insertCounter() {
        Counter.remove({name: "id_count"});

        await Counter.create({
            name: "id_count",
            current: 0
        })
        .then(counter => {
            console.log(counter)
        })
        .catch(error=>{
            res.json(error)
        }) 
    }
    insertCounter();