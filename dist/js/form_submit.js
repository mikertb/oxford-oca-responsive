function getLocaleDateTime(){
    var now  = new Date();
    var YYYY = now.getFullYear();
    var MM   = String(now.getMonth()+1).length > 1? now.getMonth()+1 : '0'+String(now.getMonth()+1);
    var DD   = String(now.getDate()).length > 1? now.getDate() : '0'+String(now.getDate());
    var hh   = String(now.getHours()).length > 1? now.getHours() : '0'+String(now.getHours());
    var mm   = String(now.getMinutes()).length > 1? now.getMinutes() : '0'+String(now.getMinutes());
    var ss   = String(now.getSeconds()).length > 1? now.getSeconds() : '0'+String(now.getSeconds());
    var tz   = now.getTimezoneOffset()/60;
    var sign = "";

    if(tz < 0) sign = '+'; if(tz > 0) sign = '-';
    tz = String(Math.abs(tz)).length > 1? sign+Math.abs(tz)+':00' : sign+'0'+Math.abs(tz)+':00';

    var format = YYYY+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss+' UTC'+tz;

    return format;
}
function inf_form_submit(data,callback){
    var inf_frame = document.getElementById('infusion_frame');

    $(inf_frame.contentDocument).find('#f_name').val(data.fname);
    $(inf_frame.contentDocument).find('#l_name').val(data.lname);
    $(inf_frame.contentDocument).find('#email').val(data.email);
    $(inf_frame.contentDocument).find('#age').val(data.age);

    if(data.gender == "male") {
        $(inf_frame.contentDocument).find('#gender_female').prop("checked",false);
        $(inf_frame.contentDocument).find('#gender_male').prop("checked",true);
    } else if(data.gender == "female"){
        $(inf_frame.contentDocument).find('#gender_male').prop("checked",false);
        $(inf_frame.contentDocument).find('#gender_female').prop("checked",true);
    }

    if(data.receive_mails) {
        $(inf_frame.contentDocument).find('#receive_mails').prop("checked",true);
    } else {
        $(inf_frame.contentDocument).find('#receive_mails').prop("checked",false);
    }

    $(inf_frame.contentDocument).find('[name="inf_field_Phone1"]').val(data.phone);
    
    inf_frame.onload = function(){if(callback) callback.call(window);};
    $(inf_frame.contentDocument).find('#inf_form').submit();
}
function oca_form_submit(){
    // Process First name
    var full_name = $.trim($("#full_name").val());
    var name_parts = full_name.split(' ');
    var last_index = name_parts.length - 1;
    var fname, lname;
    fname = name_parts[0];
    lname = name_parts[last_index];
    if(name_parts.length > 2){
        for(var i in name_parts){
            if(i != 0 && i !=last_index){
                fname += ' ' + name_parts[i];
            }
        }
    }
    $('#register_form input[name="fname"]').val(fname);
    $('#register_form input[name="lname"]').val(lname);
    
    var values_raw = $('#register_form').serialize();
    var values = $('#register_form').serializeArray();
    var values_array = [];
    var values_final;

    for(var n in values){
        values_array.push('"'+values[n].name+'":"'+values[n].value+'"');
    }

    var values_object = '{'+values_array.join(',')+'}';
        values_final = JSON.stringify(JSON.parse(values_object));
    // Ajax submit
    $.ajax({
        url: 'https://www.oxfordcapacityanalysis.org/oca-service.action', 
        dataType: 'jsonp', 
        data: {
            id: 1, 
            method: 'startOCATest',
            params: values_final
        }, 
        success: function(data) {
            if (data.error){
                $('#register_form input').prop("disabled",false);
                $('#register_form select').prop("disabled",false);
                $('#register_form button[type="submit"]').text("START TEST").prop("disabled",false);
                return alert('Error starting OCA: ' + data.error);
            }
            else{
                inf_form_submit(JSON.parse(values_object),function(){
                    $('#infusion_frame_formsubmited').src = "infusion/form-submitted.html";
                });
                questionnaire.start();
                console.log('OCA started, OCA Id: ' + data.result);
                $('#register_form input').prop("disabled",false);
                $('#register_form select').prop("disabled",false);
                $('#register_form button[type="submit"]').text("Wait...").prop("disabled",false);
            } 
        } 
    });
    $('#register_form input').prop("disabled",true);
    $('#register_form select').prop("disabled",true);
    $('#register_form button[type="submit"]').text("Wait...").prop("disabled",true);
}
$("#register_form").paminta(oca_form_submit);