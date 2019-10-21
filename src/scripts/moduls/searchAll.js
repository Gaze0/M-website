export default {
    get(obj){
        return $.ajax({
            url :`/api/searchlist/${obj.type}?keyword=${obj.keyword}&ci=${obj.id}&offset=${obj.offset}&limit=${obj.limit}`
        })
    }
}