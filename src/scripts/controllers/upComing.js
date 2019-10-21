const layoutView = require('../views/upComing.art');
import exportedItemView from '../views/exportedItem.art';
import comingItemView from '../views/comingItem.art';
// import layoutView from '../views/upComing.art';

const comingListModule = require('../moduls/comingList');

import exportListModule from '../moduls/exportList';

import positionConstroller from './position';
import indexConstroller from './index';

import _ from 'lodash';
// const exportListModule = require('../moduls/exportList');

const BScroll = require('better-scroll');
class upComing{
    constructor(){
        // this.render();
        this.limit = 10,
        this.offset = 10,
        this.exportList = [],
        this.result = [],
        this.moveArr = [],
        this.moveLimit = 10,
        this.getMoveNum = 0
    }
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
    dealExport(exportList){
        if(exportList.movieList){
            this.exportList = exportList.movieList;
        }else{
            this.exportList = exportList.coming;
        }
        for(var i=0;i< this.exportList.length;i++){
            let img =  this.exportList[i].img.replace(/\/w.h/,'/128.180');
            let length =  this.exportList[i].comingTitle.length;
            // console.log(length)
            let data =  this.exportList[i].comingTitle.substring(0,length-2);
            // console.log(data);
            this.exportList[i].img = img;
            this.exportList[i].comingTitle = data;
        }
    }

    dealMoveIDs(list){
        // console.log(list.movieIds)
        let str = '';
        let arr = [];
        for(var i=10;i<list.movieIds.length;){
            for(var j=0;j<this.moveLimit;j++,i++){
                str += list.movieIds[i] +'%2c';
            }
            str = str.substr(0,str.length-3);
            arr.push(str);
            str = '';
        }
       if(str!=''){
            arr.push(str);
       }
    //    console.log(arr)
       this.moveArr = arr;
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
        //请求exportList数据并处理
        let exportList = await exportListModule.get({});
        this.dealExport(exportList);
        //请求list数据并处理
        let list =await comingListModule.get({});
        // console.log(list);
        this.deal(list);
        this.dealMoveIDs(list);
        indexConstroller.render();
        this.dealActive();
        positionConstroller.render();
        this.dealPositionActive();
        //加载界面的架构
        let html = layoutView({});
        let $MoveList = $('#Move-list');
        $MoveList.html(html);
        //加载exportHtml
        let city = sessionStorage.getItem('city');
        if(city){
            $('.top-bar .city-name').html(city);
        }
        

        let exportHtml = exportedItemView({
            exportList: this.exportList
        })
        let $expectedList = $('.expected-list');
        $expectedList.html(exportHtml);
        //加载comingListHtml
        let comingListHtml = comingItemView({
            list:this.result,
        })
        let $comingList = $('.coming-list');
        $comingList.html(comingListHtml);

        let $expectedListWrap = $('.expected-listWrap');
        let $comingListWrap = $('.coming-list-wrap');
        let expectedbScroll = new BScroll.default($expectedListWrap.get(0),{
            scrollX:true,
            scrollY:false,
            click:true,
            probeType:2
        });
        let that = this;
        expectedbScroll.on('scrollEnd',async function(e){
            if(this.maxScrollX>=this.x){
                let exportList = await exportListModule.get({
                    limit:that.limit,
                    offset:that.offset
                });
                that.offset += that.limit;
                let lastExportList =  that.exportList;
                that.dealExport(exportList);
                if(exportList!=null){
                    that.exportList = [...lastExportList,...that.exportList];
                    let html =exportedItemView({
                        exportList:that.exportList
                    })
                    $expectedList.html(html);
                }
            }
        })

        let MovebScroll = new BScroll.default($MoveList.get(0),{
            scrollY:true,
            click:true,
            probeType:3
        });

        let res = async function(e){
            // console.log(this.maxScrollY,this.y);
            if(this.maxScrollY>=this.y){
                // that.dealMoveIDs(list);
                // that.getMoveNum
                if(that.moveArr[that.getMoveNum]){
                    let list =await comingListModule.get({
                        URL:`moreComingList?ci=387&token=&limit=10&movieIds=${that.moveArr[that.getMoveNum]}`
                    });
                    let lastList =  that.result;
                    that.deal(list);
                    that.getMoveNum++;
                    that.result = [...lastList,...that.result];
                    // console.log(that.result)
                    let html = comingItemView({
                        list:that.result,
                    })
                    $comingList.html(html);
                }
            }
            // return false;
        }
        var deb = _.debounce(res,250,{'maxWait':1000})
        MovebScroll.on('scrollEnd',deb);
    }
}
export default new upComing();