export default {
    post(obj){
        return $.ajax({
            type: 'post',
            url : `api/ajax/movie?forceUpdate=${obj.time}`,
            data: {
                "reqId": `${obj.time}`,
                "movieId": `${obj.id}`,
                "day": `${obj.Today}`,
                "offset": `${obj.offset}`,
                "limit": `${obj.limit}`,
                "districtId": -1,
                "lineId": -1,
                "hallType": -1,
                "brandId": -1,
                "serviceId": -1,
                "areaId": -1,
                "stationId": -1,
                "updateShowDay": true,
                "cityId": `${obj.cityId}`,
            },
        })
    }
}