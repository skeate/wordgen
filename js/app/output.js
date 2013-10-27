define(['./base','./merger'], function(Base,Merger){
    function Output(o){
        Base.call(this,'',o);
    }
    Output.prototype = new Merger();
    return Output;
});
