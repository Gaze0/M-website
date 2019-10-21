module.exports = {
    get({URL= 'comingList?ci=387&token=&limit=10'}){
        return $.ajax({
            url:`/api/ajax/${URL}`
        })
    }
}