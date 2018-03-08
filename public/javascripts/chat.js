$(function () {
    // socket.io 서버에 접속한다
    var socket = io();
    var userID = $(".UserID").text();

    // 서버로 자신의 정보를 전송한다.
    socket.emit("login", {
        id: userID 
    });

    // 채팅방입장시 입장한사람의 아이디값을 보여주며 모두에게 입장사실을 알려준다.
    socket.on("login", function (data) {
        var chatLogs = $("#chatLogs").text();
        $("#chatLogs").append("<div><strong>" + data + "</strong> has joined</div>");
    });

    // 채팅내역을 불러온다
    $.ajax({
        type: 'post',
        url: '/chatlist',
        dataType: 'json',
        data: {},
        success: function (result) {
            if (!result) $("#chatLogs").append("<div class='p-2'>채팅목록을 가지고오는데 실패함</div>");
            else {
                result.forEach(function (element) {
                    $("#chatLogs").append("<div class='p-2'>" + element.message + " : from <strong>" + element.from + "</strong> to: <strong>" + element.to + "</strong></div>");
                });
            }
        },
        error: function (error) {
            console.log("error:", error);
            $("#chatLogs").append("<div class='p-2'>채팅목록을 가지고오는데 실패함</div>");
        }
    });

    // 채팅시 메시지를 받을경우
    socket.on("chat", function (data) {
        if (data.to === '') data.to = 'ALL';
        $("#chatLogs").append("<div class='p-2'>" + data.message + " : from <strong>" + data.from + "</strong> to: <strong>" + data.to + "</strong></div>");
    });

    // Send Event
    $("form").submit(function (event) {
        event.preventDefault();

        var $msgForm = $("#msgForm");
        var $whisper = $("#whisper");

        var msg = {
            from: userID,
            to: $whisper.val() === '' || $whisper.val() == null ? 'ALL' : $whisper.val(),
            message: $msgForm.val()
        }

        // if (data.to === '') data.to = 'ALL';
        $("#chatLogs").append("<div>" + msg.message + " : from <strong> "+ msg.from + "</strong> to: <strong>" + msg.to + "</strong></div>");

        // 메시지전송
        socket.emit("chat", msg);
        $msgForm.val("");
    });
});
