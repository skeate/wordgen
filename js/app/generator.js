define(['jquery','./rules'], function($, Rules){
    return function(rules,output){
        var gen = new Rules(rules);
        $(output).text(gen.output());
    };
});
