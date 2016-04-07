try{

    // arrow position in blog

    function blogArrowPosition(){

        $('.news-item').each(function(index, el) {

            var itemPos = $(this).position().left;
            var itemWidth = $(this).width();
            var arrowWidth = $(this).find('.blog-arrow').width();
            var arrowPos = itemPos+(itemWidth/2)-(arrowWidth/2);

            $(this).find('.blog-arrow').css({'left':arrowPos+'px'});

        });

    }

    //init slider in blog-page

    function initSliderBlogPage(){

        if($('.blog-inside').length != 0 && $('.blog-inside .blog-slider').length != 0){

            if($('.blog-slider-big .slider-item').length > 1){

                $('.blog-slider-small .slider-item').click(function(){
                    var i = $(this).index();
                    $('.blog-slider-big .slider-item').removeClass('active');
                    $('.blog-slider-big .slider-item').eq(i).addClass('active');
                });

                $('.blog-slider-small').on('init', function(event, slick, currentSlide, nextSlide){
                    $('.blog-slider-small .slider-item').eq(0).click();
                });

                $('.blog-slider-small').slick({
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

        }

    }

    $(document).ready(function(){

        blogArrowPosition();

        initSliderBlogPage();

    });

    $(window).load(function(){

        blogArrowPosition()

    });

    $(window).resize(function(){

        blogArrowPosition();

    });

}
catch(e){

    console.log('develop_1.js \n Error! '+e.name+':'+e.message+'\n'+e.stack);

}