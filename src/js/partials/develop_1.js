try{

    function blogArrowPosition(){

        $('.news-item').each(function(index, el) {

            var itemPos = $(this).position().left;
            var itemWidth = $(this).width();
            var arrowWidth = $(this).find('.blog-arrow').width();
            var arrowPos = itemPos+(itemWidth/2)-(arrowWidth/2);

            $(this).find('.blog-arrow').css({'left':arrowPos+'px'});

        });

    }


    $(document).ready(function(){

        blogArrowPosition();

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