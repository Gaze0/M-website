module.exports = {
    get({limit='10',offset='0'}){
        return $.ajax({
            // beforeSend(){
            //     console.log(123)
            // },
            url:`/api/ajax/mostExpected?ci=387&limit=${limit}&offset=${offset}&token=`
        })
    }
}