const body_parser = require('body-parser')
module.exports = (app)=>{
    app.use(body_parser.json());
    app.post('/api/login',(req,res)=>{
        console.log(req.body);
        res.send({
            code:200,
            Token:Math.random().toString(16).slice(2,16)
        })
    })
}