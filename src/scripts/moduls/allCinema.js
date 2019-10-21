export default  {
    get(day,offset,limit,id){
       return $.ajax({
           url:`api/ajax/cinemaList?day=${day}&offset=${offset}&limit=${limit}&districtId=-1&lineId=-1&hallType=-1&brandId=-1&serviceId=-1&areaId=-1&stationId=-1&item=&updateShowDay=true&reqId=1571021255042&cityId=${id}`
       })
   }
  
}