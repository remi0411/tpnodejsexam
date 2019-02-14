const axios = require('axios');

module.exports = function (io) {

    io.on('connection', function (socket) {
        const _id = socket.id;
        socket.on('userHere', function (data) {
            axios.put('http://localhost:3010/api/conferences/' + data.conf + '/attendance', {
                    uid: data.my
                })
                .then((res) => {

                }, (err) => {

                });
        });

        socket.on('chat message', function (data) {
            io.emit('chat message', data);
        });
    });
}