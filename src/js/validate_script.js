/*валидация формы*/
function validate(form, options){
    var setings = {
        errorFunction:null,
        submitFunction:null,
        highlightFunction:null,
        unhighlightFunction:null
    }
    $.extend(setings, options);

    var $form = $(form);

    if ($form.length && $form.attr('novalidate') === undefined) {
        $form.on('submit', function(e) {
            e.preventDefault();
        });

        $form.validate({
            errorClass : 'errorText',
            focusCleanup : true,
            focusInvalid : false,
            invalidHandler: function(event, validator) {
                if(typeof(setings.errorFunction) === 'function'){
                    setings.errorFunction(form);
                }
            },
            errorPlacement: function(error, element) {
                error.appendTo( element.closest('.form_input'));
            },
            highlight: function(element, errorClass, validClass) {
                $(element).addClass('error');
                $(element).closest('.form_row').addClass('error').removeClass('valid');
                if( typeof(setings.highlightFunction) === 'function' ) {
                    setings.highlightFunction(form);
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).removeClass('error');
                if($(element).closest('.form_row').is('.error')){
                    $(element).closest('.form_row').removeClass('error').addClass('valid');
                }
                if( typeof(setings.unhighlightFunction) === 'function' ) {
                    setings.unhighlightFunction(form);
                }
            },
            submitHandler: function(form) {
                if( typeof(setings.submitFunction) === 'function' ) {
                    setings.submitFunction(form);
                } else {
                    $form.submit();
                }
            }
        });

        $('[required]',$form).each(function(){
            $(this).rules( "add", {
                required: true,
                messages: {
                    required: "Вы пропустили"
                }
            });
        });

        if($('[type="email"]',$form).length) {
            $('[type="email"]',$form).rules( "add",
            {
                messages: {
                    email: "Невалидный email"
                 }
            });
        }

        if($('.tel-mask[required]',$form).length){
            $('.tel-mask[required]',$form).rules("add",
            {
                messages:{
                    required:"Введите номер мобильного телефона."
                }
            });
        }

        $('[type="password"]',$form).each(function(){
            if($(this).is("#re_password") == true){
                $(this).rules("add", {
                    minlength:3,
                    equalTo:"#password",
                    messages:{
                        equalTo:"Неверный пароль.",
                        minlength:"Недостаточно символов."
                    }
                });
            }
        })
    }
}

/*Отправка формы с вызовом попапа*/
function validationCall(form){

  var thisForm = $(form);
  var formSur = thisForm.serialize();

    $.ajax({
        url : thisForm.attr('action'),
        data: formSur,
        method:'POST',
        success : function(data){
            if ( data.trim() == 'true') {
                thisForm.trigger("reset");
                popNext("#call_success", "call-popup");
            }
            else {
               thisForm.trigger('reset');
            }

        }
    });
}

/* Отправка формы с файлом */
function validationCallDocument(form){

    var thisForm = $(form);
    var formData = new FormData($(form)[0]);

    formData.append('file', thisForm.find('input[type=file]')[0].files[0]);

    $.ajax({
        url: thisForm.attr('action'),
        type: "POST",
        data: formData,
        contentType:false,
        processData:false,
        cache:false,
        success: function(response) {
            thisForm.trigger("reset");
            popNext("#call_success", "call-popup");
        }
    });

}

/* Отправка формы с файлaми */
function validationCallDocuments(form){

    var thisForm = $(form);
    var formData = new FormData($(form)[0]);

    $.each(thisForm.find('input[type="file"]')[0].files, function(index, file){
        formData.append('file-'+index, file);
    });

    $.ajax({
        url: thisForm.attr('action'),
        type: "POST",
        data: formData,
        contentType:false,
        processData:false,
        cache:false,
        success: function(response) {
            thisForm.trigger("reset");
            popNext("#call_success", "call-popup");
        }
    });

}

function popNext(popupId, popupWrap){

    $.fancybox.open(popupId,{
        padding:0,
        fitToView:false,
        wrapCSS:popupWrap,
        autoSize:true,
        afterClose: function(){
            $('form').trigger("reset");
            clearTimeout(timer);
        }
    });

    var timer = null;

    timer = setTimeout(function(){
        $('form').trigger("reset");
        $.fancybox.close(popupId);
    },2000);

}

/*маска на инпуте*/
function Maskedinput(){
    if($('.tel-mask')){
        $('.tel-mask').mask('+9 (999) 999-99-99 ');
    }
}

/*fansybox на форме*/
function fancyboxForm(){
  $('.fancybox-form').fancybox({
    openEffect  : 'fade',
    closeEffect : 'fade',
    autoResize:true,
    wrapCSS:'fancybox-form',
    'closeBtn' : true,
    fitToView:true,
    padding:'0'
  })
}

//ajax func for programmer (only for click)

function someAjax(item, someUrl, successFunc, someData){

    $(document).on('click', item, function(e){

        e.preventDefault();

        var itemObject = $(this);

        $.ajax({
            url:someUrl,
            data:someData,
            method:'POST',
            success : function(data){
                successFunc(data, itemObject);
            }
        });

    });

}

/* example for someAjax func

    write like this
    someAjax('.link', '/programer_item.php', someFuncName, {action:'someAction', item_id:id});

*/

// likes click func ajax

function likesClickAjax(){

    $(document).on('click', '.blog-chats-like', function(e){

        e.preventDefault();

        var item = $(this);
        var likeWay = item.data('type');
        var newsId = item.data('news-id');

        $.ajax({
            url:'ajax.php',
            data:{likeWay:item.data('type'), newsId:item.data('news-id')},
            method:'POST',
            success:function(data){
                item.parents('.blog-chats-likes').find('.likes-value').text(data);
            }
        });

    });

}

// main func for load blog info
function showBlog(){

    // destroy all content before load items
    function destroyAll(){

        var pretyDestroy = $('.blog-main.active');
        $('.news-item').css('margin-bottom','25px');

        pretyDestroy.css('height','0px');

        pretyDestroy.removeClass('active show');

        setTimeout(function(){

            pretyDestroy.find('.blog-slider-big .slider-item').remove();
            if(pretyDestroy.find('.blog-slider-small').is('.slick-slider')){
                pretyDestroy.find('.blog-slider-small').slick('destroy').remove();

            }
            pretyDestroy.find('.blog-text h6').text('');
            pretyDestroy.find('.blog-text .blog-text-main').html('');

            pretyDestroy.find('.blog-chats-retwite span').text('');
            pretyDestroy.find('.likes-value').text('');
            if(pretyDestroy.find('.blog-comment-item').length != 0){
                pretyDestroy.find('.blog-comment-item').remove();
            }

        },500);

    }

    // blog item height after item load func

    var realHeightTimer = null;

    function trueBlogItemHeight(){

        var commentHeight = 0;

        $('.blog-main.active .blog-comment-item').each(function(){
            commentHeight = commentHeight + parseInt($(this).height())+parseInt($(this).css('margin-bottom'));
        });

        $('.blog-main.active .blog-comments').height(commentHeight);

        clearTimeout(realHeightTimer);
        realHeightTimer = setTimeout(function(){
            var blogWrapHeight = $('.blog-main.active .blog-wrap').outerHeight();
            $('.blog-main.active').parent().css('margin-bottom', (blogWrapHeight + parseInt($('.blog-main.active').css('padding-top'))+10));
            $('.blog-main.active').height(blogWrapHeight);
        }, 300);

    };

    $(window).resize(function(){

        trueBlogItemHeight();

    });

    //loading blog content from json file

    var obj = null;
    var timer = null;
    var showTimer = null;

    //close active blog window
    $(document).on('click', '.close-button', function(){

        destroyAll();

    });

    $(document).on('click', '.item-wrap:not(.active)', function(){

        clearInterval(timer);
        clearTimeout(showTimer);

        var showTime = 0;
        if($('.blog-main.active').length != 0){
            showTime = 500;
        }

        var itemMain = $(this).parent();
        var itemNum = itemMain.index();
        var blogItem = itemMain.find('.blog-main');

        //show blog block
        destroyAll();

        showTimer = setTimeout(function(){

            itemMain.css('margin-bottom','200px');
            blogItem.addClass('active').css('height','200px');

            $.ajax({
                url:'js/params.json',
                method:'POST',
                success : function(data){

                    //obj = JSON.parse(data); //for server
                    obj = data; //for local

                    var images = obj.images;
                    var imagesLength = images.length;

                    var textTitle = obj.text.title;
                    var textContent = obj.text.content;

                    var retwiteValue = obj.retwite;
                    var likesValue = obj.likes;

                    var comments = obj.comments;

                    var sliderDone = false;
                    var commentsDone = false;


                    // add images to big slider
                    blogItem.find('.blog-slider').removeClass('hide');

                    images.forEach(function(item, i){
                        blogItem.find('.blog-slider-big').append('<div class="slider-item"><img src='+item+'></div>');
                    });

                    if(imagesLength > 1){

                        blogItem.find('.blog-slider').append('<div class="blog-slider-small"></div>');

                        //add images to small slider
                        var pointImg = 1;
                        images.forEach(function(item, i){
                            blogItem.find('.blog-slider-small').append('<div class="slider-item cfix"><span class="slider-item-wrap"><img src='+item+' alt="" /></span></div>');
                            pointImg++;
                            if(pointImg > imagesLength){

                                blogItem.find('.blog-slider-small .slider-item').click(function(){
                                    var i = $(this).index();
                                    blogItem.find('.blog-slider-big .slider-item').removeClass('active');
                                    blogItem.find('.blog-slider-big .slider-item').eq(i).addClass('active');
                                });

                                blogItem.find('.blog-slider-small').on('init', function(event, slick, currentSlide, nextSlide){
                                    sliderDone = true;
                                    blogItem.find('.blog-slider-small .slider-item').eq(0).click();
                                });

                                blogItem.find('.blog-slider-small').slick({
                                    slidesToShow:4,
                                    slidesToScroll:1,
                                    focusOnSelect:true,
                                    infinite:false,
                                    draggable:false,
                                    swipe:false,
                                    responsive: [
                                        {
                                            breakpoint: 375,
                                            settings:{
                                                slidesToShow:2
                                            }
                                        }
                                    ]
                                });


                            }
                        });
                    }else if(imagesLength == 1){
                        blogItem.find('.blog-slider-big .slider-item').addClass('active');
                        sliderDone = true;
                    }else{
                        blogItem.find('.blog-slider').addClass('hide');
                        sliderDone = true;
                    }

                    // add text content

                    blogItem.find('.blog-text h6').text(textTitle);
                    blogItem.find('.blog-text .blog-text-main').html(textContent);


                    // add coments

                        // retwite & likes script

                        blogItem.find('.blog-chats-retwite span').text(retwiteValue);
                        blogItem.find('.blog-chats-likes .likes-value').text(likesValue);

                        // add comments content

                        var commentsLength = comments.length;

                        if(commentsLength != 0){
                            comments.forEach(function(item, i){

                                blogItem.find('.blog-comments').prepend('<div class="blog-comment-item"><div class="blog-comment-avatar"></div><div class="blog-comment-content"><div class="blog-comment-user-name"></div><div class="blog-comment-text"></div><div class="blog-comment-date"></div></div></div>');
                                var neededItem = blogItem.find('.blog-comment-item').eq(0);
                                neededItem.find('.blog-comment-avatar').prepend('<img src='+item.useravatar+' alt="" />');
                                neededItem.find('.blog-comment-user-name').text(item.username);
                                neededItem.find('.blog-comment-text').html(item.usertext);
                                neededItem.find('.blog-comment-date').text(item.userdate);

                                if(i == (commentsLength-1)){

                                    commentsDone = true;
                                }

                            });
                        }else{
                            commentsDone = true;
                        }

                    //is all loaded

                    timer = setInterval(function(){
                        if(sliderDone && commentsDone){
                            setTimeout(function(){
                                blogItem.addClass('show');
                                trueBlogItemHeight();
                            }, 300);
                            clearInterval(timer);
                        }
                    }, 0);

                }
            });

        }, showTime);

    });

    // blog chat validate
    function blogChatValidate(){

        $('.blog-form').each(function(index, el) {

            var formClass = '.blog-form[data-form='+index+']';
            validate(formClass, {submitFunction:addComment});

        });

        function addComment(form){

            var formComment = $(form);

            var formData = new FormData($(form)[0]);
            formData.append('file', formComment.find('input[type=file]')[0].files[0]);
            var formId = formComment.data('form');
            var formText = formComment.find('textarea').val();

            $('.blog-main.active .blog-comments').addClass('loading').height(200);

            $.ajax({
                url:'ajax-json.php',
                processData: false,
                contentType: false,
                data:{idPost:formId, formData:formData},
                method:'POST',
                success:function(data){

                    $('.blog-main.active .blog-comment-item').remove();

                    var dataParsed = JSON.parse(data);

                    dataParsed.forEach(function(item, index){

                        var userAvatar = item.useravatar;
                        var userName = item.username;
                        var userText = item.usertext;
                        var userDate = item.userdate;

                        $('.blog-main.active .blog-comments').prepend('<div class="blog-comment-item"><div class="blog-comment-avatar"><img src='+userAvatar+' alt="" /></div><div class="blog-comment-content"><div class="blog-comment-user-name">'+userName+'</div><div class="blog-comment-text">'+userText+'</div><div class="blog-comment-date">'+userDate+'</div></div></div>');

                        if(index == (dataParsed.length - 1)){

                            trueBlogItemHeight();

                            $('.blog-main.active .blog-comments').removeClass('loading');

                        }

                    });

                }
            });

        }

    }

    // change input type file
    function changeInputTypeFile(){

        //show loaded file name

        $('.blog-form input[type="file"]').change(function(){

            var formWrap = $(this).parents('.blog-form');

            formWrap.find('.load-file-text').text($(this)[0].files[0].name);

            formWrap.find('.remove-file').addClass('show');

            trueBlogItemHeight();

        });

        //remove loaded file

        $(document).on('click', '.blog-form .remove-file.show', function(){

            var formWrap = $(this).parents('.blog-form');
            formWrap.find('input[type="file"]').val('');
            formWrap.find('.remove-file.show').removeClass('show');
            formWrap.find('.load-file-text').text('');
            trueBlogItemHeight();

        });

    }

    changeInputTypeFile();
    blogChatValidate();

};



$(document).ready(function(){
   validate('#call-popup .contact-form', {submitFunction:validationCall});
   Maskedinput();
   fancyboxForm();

   showBlog();

   likesClickAjax();


});