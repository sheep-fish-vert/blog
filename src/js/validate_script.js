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

// show clicked blog item
function showBlogItem(index){

    destroyAll();

    $('.news-item').eq(index).css('margin-bottom','200px');
    $('.news-item').eq(index).find('.blog-main').addClass('active').css('height','200px');

};

function destroyAll(){

    $('.news-item').css('margin-bottom','25px');
    $('.news-item .blog-main').css('height','0px');
    $('.news-item .blog-main.active .blog-slider-big .slider-item').remove();
    if($('.news-item .blog-main.active .blog-slider-small').is('.slick-slider')){
        $('.news-item .blog-main.active .blog-slider-small').slick('destroy').remove();

    }
    $('.news-item .blog-main.active .blog-text h6').text('');
    $('.news-item .blog-main.active .blog-text .blog-text-main').html('');

    $('.news-item .blog-main.active .blog-chats-retwite span').text('');
    $('.news-item .blog-main.active .likes-value').text('');

    $('.news-item .blog-main').removeClass('active');

}

// blog item height after item load func
function trueBlogItemHeight(){

    var blogWrapHeight = $('.blog-main.active .blog-wrap').outerHeight();
    $('.blog-main.active').parent().css('margin-bottom', (blogWrapHeight + parseInt($('.blog-main.active').css('padding-top'))+10));
    $('.blog-main.active').height(blogWrapHeight);

};

function showBlog(){

    //loading blog content from json file

    obj = null;

    //close active blog window
    $(document).on('click', '.close-button', function(){

        destroyAll();

    });

    $(document).on('click', '.item-wrap', function(){

        var itemNum = $(this).parent().index();
        var blogItem = $('.news-item').eq(itemNum).find('.blog-main');

        //show blog block
        showBlogItem(itemNum);

        $.ajax({
            url:'js/params.json',
            method:'POST',
            success : function(data){

                obj = data[itemNum];

                var images = obj.images;
                var imagesLength = images.length;

                var textTitle = obj.text.title;
                var textContent = obj.text.content;

                var retwiteValue = obj.retwite;
                var likesValue = obj.likes;

                var sliderDone = false;


                // add images to big slider

                images.forEach(function(item, i){
                    blogItem.find('.blog-slider-big').append('<div class="slider-item"><img src='+item+'></div>');
                });

                if(imagesLength > 1){

                    blogItem.find('.blog-slider').append('<div class="blog-slider-small"></div>');

                    //add images to small slider
                    var pointImg = 1;
                    images.forEach(function(item, i){
                        blogItem.find('.blog-slider-small').append('<div class="slider-item"><span class="slider-item-wrap"><img src='+item+' alt="" /></span></div>');
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
                                swipe:false
                            });


                        }
                    });
                }else{
                    blogItem.find('.blog-slider-big .slider-item').addClass('active');
                    sliderDone = true;
                }

                // add text content

                blogItem.find('.blog-text h6').text(textTitle);
                blogItem.find('.blog-text .blog-text-main').html(textContent);


                // add coments

                    // retwite & likes script

                    blogItem.find('.blog-chats-retwite span').text(retwiteValue);
                    blogItem.find('.blog-chats-likes .likes-value').text(likesValue);

                //is all loaded

                var timer = setInterval(function(){
                    if(sliderDone){
                        blogItem.addClass('show');
                        trueBlogItemHeight();
                        clearInterval(timer);
                    }
                }, 0);



            }
        });

    });

};

$(document).ready(function(){
   validate('#call-popup .contact-form', {submitFunction:validationCall});
   Maskedinput();
   fancyboxForm();

   showBlog();

   likesClickAjax();

});