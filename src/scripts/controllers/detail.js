import detailView from '../views/detail.art'
import detailListView from '../views/detailList.art';
import '../../styles/modules/detail.scss'

import cinemaListModul from '../moduls/cinemaList';
import detailCinemaModul from '../moduls/detailCinema';
import showConstroller from '../controllers/shows';
import Bscroll from 'better-scroll';
import _ from 'lodash';

class Detail{
    constructor(){
        this.offset = 0;
        this.limit = 20;
    }

    future(){
        //获取未来6天日期
        function timestampToTime(timestamp,i) {
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var starday =  date.getDay();
            // console.log(starday)
            if(starday==0){
                starday = '日';
            }else if(starday ==1){
                starday = '一';
            }
            else if(starday ==2){
                starday = '二';
            }
            else if(starday==3){
                starday = '三';
            }
            else if(starday==4){
                starday = '四';
            }else if(starday==5){
                starday = '五';
            }else if(starday==6){
                starday = '六';
            }
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
            var D = date.getDate();
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            if(i>=3){
                if(D<10){
                    D = '0'+D
                }
                if(M<10){
                    M='0'+M
                }
                return '周'+ starday +M+D+'日';
            }else{
                if(D<10){
                    D = '0'+D
                }
                if(M<10){
                    M='0'+M
                }
                return M+D+'日';
            }
            
        }
        var date = Date.parse(new Date())/1000;; //获取当前日期
        this.dateList=[];
        for(var i=0;i<6;i++){
          this.dateList[i] =  timestampToTime(date,i);
          date = date+86400;
        }
    }
    async render(){
        let hash = location.hash;
        let reg = /(\d+)/;
        let id = reg.exec(hash)[1];
        let result = await cinemaListModul.get(id)
        // console.log(result.detailMovie.snum)
        result.detailMovie.snum = (result.detailMovie.snum /10000).toFixed(1);
        let img = result.detailMovie.img.replace(/\/w.h/,'/128.180');
        result.detailMovie.img = img;

        //获取未来6天
        this.future();

        let data = new Date;
        let time = data.getTime();
        // console.log((time-820889653)/)
        let year = data.getFullYear();
        let month = data.getMonth();
        let day = data.getDate();
        let Today = year + '-' +month + '-' + day;

        
        //
        this.offset = 0;
        this.limit = 20;
        let cityId = sessionStorage.getItem('id');
        let cinemaResult;
        if(cityId){
            cinemaResult = await detailCinemaModul.post({
                offset:this.offset,
                limit:this.limit,
                time:time,
                cityId:cityId,
                id:id,
                Today:Today
            });
            this.offset +=this.limit;
        }else{
            cityId = 10;
            cinemaResult = await detailCinemaModul.post({
                offset:this.offset,
                limit:this.limit,
                time:time,
                cityId:cityId,
                id:id,
                Today:Today
            });
            this.offset +=this.limit;
        }
        
        let $root = $('#root');
        let html = detailView({
            moveInfo:result.detailMovie,
            dateList:this.dateList
        })
        $root.html(html);

        function back(){
            window.history.back();
        }
        $('.back').on('tap',_.debounce(back,500))

        //添加电影院list
        let cinemaList = cinemaResult.cinemas;
        let detailListHtml = detailListView({
            cinemaList : cinemaList
        })
        $('.cinema-list ').html(detailListHtml);

        //切换日期
        $('.show-days .show-day').on('tap',async function(){
            this.offset = 0;
            this.limit = 20;
            $(this).addClass('active').siblings().removeClass('active');
            let clickDay = $(this).html().substr(2);
            clickDay = clickDay.substr(0,clickDay.length-1)
            clickDay = clickDay.split('月').join("-");
            clickDay = year + '-' + clickDay;
            let cityId = sessionStorage.getItem('id');
            var cinemaResult;
            if(cityId){
                cinemaResult = await detailCinemaModul.post({
                    offset:this.offset,
                    limit:this.limit,
                    time:time,
                    cityId:cityId,
                    id:id,
                    Today:clickDay
                });
            }else{
                cityId = 10;
                cinemaResult = await detailCinemaModul.post({
                    offset:this.offset,
                    limit:this.limit,
                    time:time,
                    cityId:cityId,
                    id:id,
                    Today:clickDay
                });
            }
            // console.log(cinemaResult)
            cinemaList = cinemaResult.cinemas;
            let detailListHtml = detailListView({
                cinemaList : cinemaList,
            })
            $('.cinema-list ').html(detailListHtml);
            this.offset +=this.limit;
        })

        let bscroll = new Bscroll($("#detail-warp").get(0),{
            scrollY:true,
            click:true,
            probeType:3
        });
        let that = this;
        new Bscroll($('.show-days').get(0),{
            scrollX:true,
            scrollY:false,
            // click:true,
            probeType:2
        });

        async function addMore(){
            if(this.maxScrollY>=this.y){
                let moreCinemaResult = await detailCinemaModul.post({
                    offset:that.offset,
                    limit:that.limit,
                    time:time,
                    cityId:cityId,
                    id:id,
                    Today:Today
                });
                // console.log(moreCinemaResult)
                cinemaList = [...cinemaList,...moreCinemaResult.cinemas];
                let detailListHtml = detailListView({
                    cinemaList : cinemaList,
                })
                $('.cinema-list ').html(detailListHtml);
                that.offset +=that.limit;
                // console.log(cinemaList);
            }
        }
        bscroll.on('scrollEnd',_.debounce(addMore,1000))
       
        bscroll.on('scroll',function(){
            if(this.y>=0){
                bscroll.scrollTo(0,0)
            }
        })
        $('.list-wrap .list').on('tap',function(){
            location.hash = 'cinema/#shows/' + $(this).data('show');
            showConstroller.getId($(this).data('show'));
            showConstroller.getName($('.move-detail').data('name'));
            console.log($('.move-detail').data('name'))
        })
    }
}
export default new Detail();