module.exports = {
   get({URL = "movieOnInfoList?token="}){
        return $.ajax({
            // movieOnInfoList?token=&movieIds=1230121%2c1277939%2c1250700%2c342146%2c1225993%2c503342%2c1211270%2c1219701%2c1260354%2c359377%2c1215605%2c1245196%2c1298794%2c1227611%2c1258394%2c360504%2c1222078%2c334625
            url:`/api/ajax/${URL}`,
            // url:'/api/listmore.json?pageNo=2&pageSize=15',
            // url:'/api/ajax/moreComingList?token=&movieIds=1298794%2C1227611%2C1258394%2C360504%2C1222078%2C334625',
            // success:function(data){
                // console.log(data);
            // }
        })
    }
}