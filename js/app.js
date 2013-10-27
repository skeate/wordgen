require.config({
    baseUrl: 'js',
    paths: {
        cs: 'lib/cs',
        'coffee-script': 'lib/coffee-script',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min'
    },
    urlArgs: "bust="+(new Date()).getTime()
});

require(['jquery', 'app/generator'], function($, gen){
    $(document).ready(function(){
        $(document).keypress(function(event){
            if( event.ctrlKey && ( event.keyCode == 10 || event.keyCode == 13 ) ){
                var rulesArray = $("#rules textarea").val().trim().split('\n');
                var outputDiv = $("#output");
                gen(rulesArray, outputDiv);
            }
        }); 
    });
});
