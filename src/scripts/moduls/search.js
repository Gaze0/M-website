export default {
    get(keyword,id){
        return $.ajax({
            url :`/api/ajax/search?kw=${keyword}&cityId=${id}&stype=-1`
        })
    }
}