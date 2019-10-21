const layoutView = require('../views/indexList.art');

const positionModel = require('../moduls/indexList');

const positionListView = require('../views/moveList.art');

import indexConstroller from './index';
import positionConstroller from './position';

import _ from 'lodash';

const BScroll = require('better-scroll');
class IndexList{
    constructor(){
        // this.render();
        this.result = [];
        this.length = 0;
    }
    //处理数据
    deal(result){
        if(result.movieList){
            this.result = result.movieList;
        }else{
            this.result = result.coming;
        }
        for(var i=0;i<this.result.length;i++){
            let img = this.result[i].img.replace(/\/w.h/,'/128.180');
            this.result[i].img = img;
        }
    }
    //加载电影
    renderer(list){
        let positionListHtml = positionListView({
            list
        })

        $('#Move-list .Moves').html(positionListHtml);

        $('main .Moves .item').on('tap',function(){
            let id = $(this).attr('data-id');
            // console.log(id);
            location.hash = `detail/${id}`;
        })
    }
    dealActive(){
        let hash = location.hash;
        let re = /^(#\w+)(\/)?/;
        hash = re.exec(hash)
        hash = hash[1].substr(1);
        $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active')
    }
    dealPositionActive(){
        let hash = location.hash;
        var reg = /([^#]+)$/
        hash = hash.match(reg)[1];
        // console.log(hash);
        $(`.switch-hot div[data-to='/#${hash}']`).addClass('active').siblings().removeClass('active');
    }
    async render(){
        
        //数据处理
        let result = await positionModel.get({});
        const html = layoutView({});
        // console.log(result)
        let total = result.total;
        let moveArr = _.chunk(result.movieIds,12);
        // console.log(_.chunk(result.movieIds,12));
        //加载position
        indexConstroller.render();
        this.dealActive();
        positionConstroller.render();
        this.dealPositionActive();
        // console.log($('.top-bar .city-name'))
        let $MoveList = $('#Move-list');
        $MoveList.html(html);
        this.deal(result);
        this.renderer(this.result);
        this.length+=this.result.length;
        // console.log(this.result);

        //渲染城市
        
        let city = sessionStorage.getItem('city');
        if(city){
            $('.top-bar .city-name').html(city);
        }
       

        let bScroll = new BScroll.default($MoveList.get(0),{
            probeType:2
        });
        let $headImg = $('.refresh>img');

        let $footImg = $('.addMore>img');
        //隐藏下拉刷新
        bScroll.scrollBy(0,-40);
        //下滑刷新
        var that = this;
        let num = 0;
        bScroll.on('scrollEnd',async function(){ 
            // console.log(this.maxScrollY,this.y)
            if(this.y>=0){
                $('.addMore p').html('上拉加载更多...')
                $headImg.attr('src','/assets/images/ajax-loader.gif');
                let result = await positionModel.get({});
                that.deal(result);
                that.renderer(that.result);
                moveArr = _.chunk(result.movieIds,12);
                $headImg.attr('src','/assets/images/arrow.png');
                $headImg.removeClass('down');
                bScroll.scrollBy(0,-40);
                that.length = 0;
                that.length+=that.result.length;
                num = 0;
                $footImg.removeClass('up');
            }
            else if(this.y<0&&this.y>-40) {
                bScroll.scrollTo(0,-40);
            }
        })

       
        let refresh  = async function(){
            if(this.maxScrollY>=this.y){
                console.log(that.length)
                num++;
                if(that.length>=total){
                    $('.addMore p').html('已经到底了')
                    bScroll.scrollBy(0,40);
                }
                else{
                    // console.log(1)
                    $footImg.attr('src','/assets/images/ajax-loader.gif');
                    let result = await positionModel.get({
                        URL:`moreComingList?token=&movieIds=${moveArr[num]}`
                    });
                    let list = that.result;
                    that.length+=result.coming.length;
                    that.deal(result);
                    that.result = [...list,...result.coming];
                    // console.log(that.result)
                    // console.log(that.length)
                    that.renderer(that.result);
                    $footImg.attr('src','/assets/images/arrow.png');
                    $footImg.css({
                        transform:"rotateZ(180deg)"
                    })
                    $footImg.removeClass('up');
                    
                }
            }
        }
        //防抖
        var deb = _.debounce(refresh ,250)
        bScroll.on('scrollEnd',deb);



        bScroll.on('scroll',function(){
            if(this.y<=-130){
                $('.download').hide();
            }
            else{
                 $('.download').show();
            }

            if(this.y>0){
                $headImg.addClass('down');
            }
            // console.log(this.maxScrollY,this.y)
            if(this.maxScrollY>this.y){
                $footImg.css({
                    transform:"none"
                })
                $footImg.addClass('up');
            }
        })

    }
}
export default new IndexList();