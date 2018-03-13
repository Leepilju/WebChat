module.exports.bash = function(server) {
    var io = require('socket.io').listen(server);
    var spawn = require('child_process').spawn;
    var sh = spawn('bash');
    sh.stdout.on('data', function(data) {
        io.emit('message', data);
    });

    sh.stderr.on('data', function(data) {
        io.emit('message', data);
    });

    sh.on('exit', function (code) {
        io.emit('exit', '** Shell exited: '+code+' **');
    });

    io.on('connection', function(client){
        client.on('message', function(data){
            sh.stdin.write(data+"\n");
            io.emit('message', new Buffer("> "+data));
        });
    });
};