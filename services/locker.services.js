var mqtt = require('mqtt');


const service = {
    async unlock(req,res) {
        const topic = req.body.topic;
        try {
            var client = mqtt.connect('mqtt://broker.emqx.io:1883', {
            username:'emqx',
            password:"public"
        });

            var ssd1406topic = `${client.options.username}${topic}`;
            var ssd1306topic = `${client.options.username}/locker/ssd1306`;
            
            console.log(ssd1406topic)
            client.on('connect',function(){
                console.log('connected');

                client.subscribe(ssd1406topic,function(err){
                if(!err){
                    console.log('subscribed');

                    client.publish(ssd1306topic, "unlock");
                    res.status(200);
                }
                
            })
            });
            client.on('message',function(topic,message){
            console.log(message.toString());
            message="";
            })
            res.end();
        } catch (error) {
            console.log("Cant unlock",error);
            res.sendstatus(500)
        }
    },

}

module.exports= service;