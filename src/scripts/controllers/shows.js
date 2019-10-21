import showsView from '../views/shows.art';

import '../../styles/modules/shows.scss'
import showsModul from '../moduls/show';
import showsListView from '../views/showsList.art';
import Bscroll from 'better-scroll';
import _ from 'lodash';
class Show{
    getId(id){
        this.cinemaId = id;
        console.log(id)
    }

    getName(name){
        this.movieName = name;
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
                return '周'+ starday +M+D+'日';
            }else{
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

    getDay(){
        let $activeLiTime = $('.show-days li[class="show-day active"]').html();
        let data = new Date();
        let year = data.getFullYear();
        this.activeDay =year + '-'+$activeLiTime.slice(2,$activeLiTime.length-1).replace('月','-');
    }

    dealTime(start,long){
        let startHour = start.slice(0,2);
        let startMinues = start.substr(-2);
        let endMinues = Number(startMinues) + long%60;
        let endHour = Number(startHour) + Math.floor(long/60);
        if(endMinues>60){
            endHour += 1;
            endMinues -= 60;
        }
        if(endHour==24){
            endHour == 0;
        }
        
        if(endHour<10){
            endHour = '0'+ endHour;
        }
        if(endMinues<10){
            endMinues = '0' + endMinues;
        }
        return endHour+ ':' + endMinues;
    }
    async render(){
        let result = await showsModul.get(this.cinemaId)
        this.future();
        let movies = result.showData.movies;
        for(var i=0;i<movies.length;i++){
            movies[i].img=movies[i].img.replace(/\/w.h/,'/128.180');
        }
        let html = showsView({
            cinemaData:result.cinemaData,
            movies:movies,
            dateList:this.dateList
        })
       
        $('#root').html(html);
       
        let showListHtml = showsListView({
            movies:movies[0]
        })
        $('.list-wrap').html(showListHtml)
        //返回
        function back(){
            window.history.back();
        }
        $('.back').on('tap',_.debounce(back,500))

        //改变光亮
        function change(){
            $(this).find('.post').addClass('active');
            $(this).siblings().find('.post').removeClass('active');
        }
        $('.swiper-container .swiper-slide').on('tap',_.debounce(change,300))

        // //光亮初始化
        // console.log(movies)
        // let num;
        // movies.filter((val,index)=>{

        //     if(val.nm === this.movieName){
        //         num = index;
        //     }
        // })
        // console.log(num)
        
        // function initactiveMovie(num){
        //     let $this = $('.swiper-slide').eq(num);
        //     console.log($this)
        //         $this.find('.post').addClass('active');
        //         $this.siblings().find('.post').removeClass('active');

        //         //改变信息
        //         $('.movie-info .title').html(movies[num].nm)
        //         if (movies[num].globalReleased){
        //             if (movies[num].sc==0){
        //                 $('.movie-info .grade').html("暂无评分")
        //             }else{
        //                 $('.movie-info .grade').html(movies[num].sc)
        //             }
        //         }
        //         $('.movie-info .movie-desc').html(movies[num].desc)
        //         $('.post-bg img').attr('src',movies[num].img)
        // }
        //获取当前日期
        this.getDay();

        let that = this;
        // that.dealTime('09:05',117);
        let $activeLi = $('.show-days li[class="show-day active"]');
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            centeredSlides: true,
            paginationClickable: true,
            spaceBetween: 50,
            slideToClickedSlide:true,
            observeParents:true,
            onTransitionEnd: function(swiper){
                // alert(swiper.activeIndex) //切换结束时，告诉我现在是第几个slide
                let $this = $('.swiper-slide').eq(swiper.activeIndex);
                $this.find('.post').addClass('active');
                $this.siblings().find('.post').removeClass('active');

                //改变信息
                $('.movie-info .title').html(movies[swiper.activeIndex].nm)
                if (movies[swiper.activeIndex].globalReleased){
                    if (movies[swiper.activeIndex].sc==0){
                        $('.movie-info .grade').html("暂无评分")
                    }else{
                        $('.movie-info .grade').html(movies[swiper.activeIndex].sc)
                    }
                }
                $('.movie-info .movie-desc').html(movies[swiper.activeIndex].desc)
                $('.post-bg img').attr('src',movies[swiper.activeIndex].img)



                //
                let show = movies[swiper.activeIndex].shows;
                let flag = 0;
                for(var i=0;i<show.length;i++){
                    if(that.activeDay === show[i].showDate){
                        $('.list-wrap').show();
                        for(var j=0;j<show[i].plist.length;j++){
                            show[i].plist[j].end = that.dealTime(show[i].plist[j].tm,movies[swiper.activeIndex].dur);
                        }
                        let showListHtml = showsListView({
                            showList:show[i].plist
                        })
                        $('.list-wrap').html(showListHtml)
                        // for(var j=0;j<show[i].plist.length;j++){
                        //     // console.log(show[i].plist[j].sellPr)
                        //     $('.stonefont').eq(j).html(show[i].plist[j].sellPr)
                        // }
                        flag = 1;
                    }
                }
                if(flag==0){
                    $('.list-wrap').hide();
                }
            }
        });

        $('.show-days .show-day').on('tap',function(){
            $(this).addClass('active').siblings().removeClass('active');
            that.getDay();
            let $movie = $('.movie-info .title').html();

            let movie = movies.filter(function(val){
                return val.nm === $movie
            })
            let movieShows = movie[0].shows;
            let showList = movieShows.filter(function(val){
                return val.showDate === that.activeDay
            })
            if(showList[0]){
                $('.list-wrap').show();
                for(var i=0;i<showList[0].plist.length;i++){
                    showList[0].plist[i].end = that.dealTime(showList[0].plist[i].tm,movie[0].dur);
                }
                let showListHtml = showsListView({
                    showList:showList[0].plist,
                })
                $('.list-wrap').html(showListHtml)
            }else{
                $('.list-wrap').hide();
            }
            
            
            
            // for(var i=0;i<showList[0].plist.length;i++){
            //     console.log(showList[0].plist[i].sellPr)
            //     $('.stonefont').eq(i).html(showList[0].plist[i].sellPr)
            // }
                // console.log(val)
                // $('.stonefont').eq().html(val)

        })
    }
}
export default new Show();