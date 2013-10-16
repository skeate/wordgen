require.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min'
    }
});

require(['jquery', 'app/generator'], function($, gen){
    $(document).ready(function(){
        $(document).keypress(function(event){
            if( event.ctrlKey && event.keyCode == 10 ){
                var rulesArray = $("#rules textarea").val().trim().split('\n');
                var outputDiv = $("#output");
                gen(rulesArray, outputDiv);
            }
        }); 
    });
});
