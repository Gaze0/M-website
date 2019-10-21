const layoutView = require('../views/cinema.art');

import indexConstroller from './index';

import '../../styles/modules/cinema.scss'
import allCinemaModul from '../moduls/allCinema';

import allCinemaListView from '../views/allCinemaList.art';
import Bscroll from 'better-scroll';
import _ from 'lodash';

import showsConstroller from './shows';
class Cinema{
    constructor(){
        // this.render()
        this.offset = 0;
        this.limit = 20;
        this.result = [];
    }
    dealActive(){
        let hash = location.hash.substr(1);
        $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active')
    }
    async render(){
        let id = sessionStorage.getItem('id');
        if(id == null){
            id=10;
        }
        this.offset = 0;
        this.limit = 20;
        let data = new Date();
        let day = data.toLocaleDateString();
        this.day = day.replace(/\//g,'-');
        // console.log(this.day);
        let result = await allCinemaModul.get(this.day,this.offset,this.limit,id);
        // console.log(this.offset,this.limit,id)
        // let total=result.paging.total;
        // console.log(result.paging.total)
        this.result = [...result.cinemas];
        this.offset += this.limit;
        indexConstroller.render();

        this.dealActive();
        let html = layoutView({});
        // console.log(html)
        $('main').html(html);
        //加载数据
        let allCinemaHtml = allCinemaListView({
            List :  this.result
        });
        let $listWrap =  $('.list-wrap');
        let $cinemaList =  $('.cinema-list');
        $listWrap.html(allCinemaHtml);
        //设置header
        $('#content-warp header h1').html('影院');

        //修改城市
        let city = sessionStorage.getItem('city');
        if(city){
            $('.cinema-wrap .city-entry .city-name').html(city);
        }

        $('.cinema-wrap .city-entry').on('tap',function () {
            let name = $(this).attr('data-name');
            location.hash = name;
        });

         //搜索
         $('.top-bar .search-entry').on('tap',function(){
            location.hash = 'search'
        })

        //选择影院
        $('.list-wrap .list').on('tap',function(){
            let hash = location.hash.substr(1)
            location.hash = hash + '/#shows/' + $(this).data('id');
            showsConstroller.getId($(this).data('id'));
        })

        let bScroll = new Bscroll($cinemaList.get(0),{});
        let that = this;
        let res = async function(){
            console.log(that.offset,that.result.length)
            if(this.maxScrollY>=this.y){
                let resultmore = await allCinemaModul.get(that.day,that.offset,that.limit,id);
                console.log(resultmore)
                resultmore = resultmore.cinemas;
                
                that.result = [...that.result,...resultmore];
                that.offset += that.limit;
                let allCinemaHtml = allCinemaListView({
                    List :  that.result 
                });
                $listWrap.html(allCinemaHtml);
                // if(that.offset > total){
                    
                // }
                $('.list-wrap .list').on('tap',function(){
                    let hash = location.hash.substr(1)
                    location.hash = hash + '/#shows/' + $(this).data('id');
                    showsConstroller.getId($(this).data('id'));
                })
            }
        }
        var deb = _.debounce(res,1000)
        bScroll.on('scrollEnd',deb);
    }
}
export default new Cinema;