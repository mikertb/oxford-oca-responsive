questionnaire = {
    el: $('#questionnaire'),
    ui: {
        arrow_prev: null,
        arrow_next: null,
        choice_buttons: null,
        progress_arrow: null,
        progress_load: null,
        question_box: null,
        questions: []         // Array of question items as html elements.
    },
    ob: {
        iframe: null          // Iframe to load OCA requests.
    },
    data: {
        answers: [],          // Array of characters Y,M,N.
        cursor: 0,            // Index of currently viewed item.
        questions: [],        // Array of strings.
        update_url: 'https://www.oxfordcapacityanalysis.org/update.action'
    },
    init: function(){
        // Fetch questions and populate to elements.
        this.getData();

        // Initialize ojects.
        this.ob.iframe = document.createElement("IFRAME");
        document.querySelector('#frame_loader').appendChild(this.ob.iframe);

        // Identify ui elements.
        this.ui.arrow_prev = this.el.find(".questions-block .arrow-prev");
        this.ui.arrow_next = this.el.find(".questions-block .arrow-next");
        this.ui.choice_buttons = this.el.find(".choices-block .answer");
        this.ui.progress_arrow = this.el.find(".progress-block .meter-point");
        this.ui.progress_load = this.el.find(".progress-block .progress-load");
        this.ui.question_box = this.el.find(".questions-block ul");

        // Attach event handlers to elements.
        this.ui.arrow_prev.click(this.prev.bind(this));
        this.ui.arrow_next.click(this.next.bind(this));
        this.ui.choice_buttons.mousedown(this.choiceButtonPressed.bind(this));
        this.ui.choice_buttons.mouseout(this.choiceButtonNomal.bind(this));
        this.ui.choice_buttons.click(this.setAnswer.bind(this));
    },
    getData: function(){
        $.ajax({
            context: this,
            method: "GET",
            dataType: "json",
            url: "questions.min.json",
            success: function(data){
                this.data.questions = data;
                for(var i=0; i<data.length; i++){
                    var position = (i > 0)? 'right' : 'center';
                    var q_elem = $('<li class="'+position+'"><div><span class="number">'+(i+1)+'.</span> '+data[i]+'</div></li>');
                    this.ui.questions.push(q_elem);
                    q_elem.appendTo(this.ui.question_box);
                }
                var end_loader = '<li id="completed_loading" class="right"><div class="complete"><div>Processing your answers.</div><div><img src="images/loader.svg" /></div></div></li>';
                $(end_loader).appendTo(this.ui.question_box);
            }
        });
    },
    prev : function(){
        if(this.data.cursor > 0){
            this.ui.questions[this.data.cursor].removeClass('center').addClass('right');
            this.data.cursor--;
            this.ui.questions[this.data.cursor].removeClass('left').addClass('center');
        }
        this.render();
    },
    next : function(){
        var question_number = this.data.cursor+1;
        if(question_number < this.data.questions.length){
            this.ui.questions[this.data.cursor].removeClass('center').addClass('left');
            this.data.cursor++;
            this.ui.questions[this.data.cursor].removeClass('right').addClass('center');
        } else {
            this.ui.questions[this.data.cursor].removeClass('center').addClass('left');
            this.data.cursor++;
        }
        //console.log(this.data.cursor, '/', this.data.questions.length);
        this.render();
    },
    choiceButtonPressed: function(e){
        this.ui.choice_buttons.removeClass('active');
        $(e.target).addClass('active');
    },
    choiceButtonNomal: function(e){
        this.ui.choice_buttons.removeClass('active');
    },
    setAnswer: function(e){
        var answer = 'Y';
        if(e.type == 'click'){
            answer = $(e.target).data('answer');
        } else if(e.type == 'keydown') {
            if(/97|49/.test(e.which)) {
                $('.answer-yes').addClass('active');
            } else if(/98|50/.test(e.which)) {
                $('.answer-maybe').addClass('active');
            } else if(/99|51/.test(e.which)) {
                $('.answer-no').addClass('active');
            }
        } else if(e.type == 'keyup') {
            if(/97|49/.test(e.which)) {
                answer = 'Y';
            } else if(/98|50/.test(e.which)) {
                answer = 'M';
            } else if(/99|51/.test(e.which)) {
                answer = 'N';
            }
        }

        if(e.type == 'click' || e.type == 'keyup'){
            this.data.answers[this.data.cursor] = answer;
            if(this.data.answers.length < this.data.questions.length){
                if(this.data.answers.length % 5 == 0){
                    this.sendAnswers();
                } 
            } else {
                this.testComplete();
            }
            this.next();
        }
    },
    sendAnswers: function(){
        var answered = this.data.answers.join("");
        var send_url = this.data.update_url+'?answers='+ answered +'&refresh=' + Date.now();
        this.ob.iframe.src = send_url;
    },
    testComplete: function(){
        this.ob.iframe.onload = function(){
            setTimeout(function(){top.location = "thank-you.html";},1500);
        }
        this.sendAnswers();
    },
    render: function(){
        // Arrow display logic.
        if(this.data.cursor < this.data.answers.length){
            this.ui.arrow_next.removeClass('hidden');
        } else {
            this.ui.arrow_next.addClass('hidden');
        }
        if(this.data.cursor > 0){
            var prev_cursor = this.data.cursor - 1;
            this.ui.arrow_prev.removeClass('hidden');
        } else {
            this.ui.arrow_prev.addClass('hidden');
        }
        // Progress indicator display logic.
        if(this.data.questions.length > 0){
            var percent_answered = ((this.data.answers.length / this.data.questions.length) * 100) + "%";
            var percent_cursor   = ((this.data.cursor / this.data.questions.length) * 100) + "%";
            this.ui.progress_load.css('width',percent_answered);
            this.ui.progress_arrow.css('width',percent_cursor);
        }
        // Answer choices display logic.
        if(this.data.answers.length < this.data.questions.length){
            var current_answer = this.data.answers[this.data.cursor];
            this.ui.choice_buttons.each(function(){
                var choice = $(this).data('answer');
                if(choice == current_answer){
                    if(!$(this).hasClass('active')) $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        } else {
            this.ui.arrow_next.addClass('hidden');
            this.ui.arrow_prev.addClass('hidden');
            this.el.find('.choices-block').css('visibility','hidden');
            $('#completed_loading').removeClass('right').css('opacity','0');
            setTimeout(function(){
                $('#completed_loading').animate({opacity:1},250);
            },450);
        }
    },
    start : function(){
        // Greetings modal display.
        if($(window).width() < 480){ // Accepts name to display in greetings.
            $("header").css("display","none");
            $("#questionnaire_intro").css("display","block");
            $("#questionnaire_intro .tester-name").text(name);
        }
        $("#questionnaire_intro .button-ok").click(function(){
            $("header").css("display","block");
            $("#questionnaire_intro").css("display","none");
        });

        // Events.
        $(document).keydown(this.setAnswer.bind(this));
        $(document).keyup(this.setAnswer.bind(this));

        // All questions display logic.
        $("section.description").css({"opacity":"0"});
        $("section.how-it-works").css({"opacity":"0"});
        $("section.what-makes-it-unique").css({"opacity":"0"});
        $("section.the-real-you").css({"opacity":"0"});
        $("section.personal-success").css({"opacity":"0"});
        $("section.questionnaire").css({"opacity":"0"});

        setTimeout(function(){
            $("nav.header-docker").css("display","none");
            $("section.description").css("display","none");
            $("section.how-it-works").css("display","none");
            $("section.what-makes-it-unique").css("display","none");
            $("section.the-real-you").css("display","none");
            $("section.personal-success").css("display","none");
            $("section.questionnaire").css({"display":"block"});
        },500);
        this.render();
        setTimeout(function(){$("section.questionnaire").css({"opacity":"1"})},500);
    }
}
/* Bootstrap */
$(document).ready(function(){
    questionnaire.init();
});