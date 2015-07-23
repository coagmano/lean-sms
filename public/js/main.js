
var $textarea = $('textarea[name=message]');
$textarea.on('keyup', function(e){
    var len = $textarea.val().length;
    var num = Math.ceil(len/153);
    $("#message-count").text(len+" Characters - "+num+" messages");
});