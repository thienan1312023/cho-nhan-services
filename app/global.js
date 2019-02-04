module.exports = {
    isNullOrUndefinedOrEmpty: function(obj){
        if(obj == null || obj == "" || obj == undefined){
            return true;
        }else{
            return false;
        }
    },

    escapeRegex: function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$|");
    }
}