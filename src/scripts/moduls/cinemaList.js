export default  {
     get(id){
        return $.ajax({
            url:`api/ajax/detailmovie?movieId=${id}`
        })
    }
   
}
// module.exports = {
//     get(id){
//         return $.ajax({
//             url:`/api/ajax/detailmovie?movieId=${id}`
//         })
//     }
// }