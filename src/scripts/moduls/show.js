export default {
    get(cinemaId){
        return $.ajax({
            url :`/api/ajax/cinemaDetail?cinemaId=${cinemaId}`
        })
    }
}