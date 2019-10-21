import searchAllView from '../views/searchAll.art'
import searchAllModul from '../moduls/searchAll'
import bScroll from 'better-scroll';
import searchAllListView from '../views/searchAllList.art';
import '../../styles/modules/searchAll.scss';
import _ from 'lodash';

import searchCinemaAllView from '../views/searchAllCinema.art';
class SearchAll{
    get(keyWord){
        this.keyWord = keyWord;
    }
    getOneInfo(info){
        console.log(info)
        this.oneInfo = info;
    }
    getResult(type){
        this.type = type;
        console.log(type)
    }
    async render(){
        let id = sessionStorage.getItem('id');
        if(!id){
            id = 10;
        }
        this.offset = 1;
        this.limit = 20;
        if(this.type == 'movies'){
            let result = await searchAllModul.get({
                type: this.type,
                offset:this.offset,
                limit: this.limit,
                keyword: this.keyWord,
                id
            })
            result =  result.movies;
            // console.log(result)
            this.offset +=this.limit;
            if(result){
                for(var i=0;i<result.length;i++){
                    let img = result[i].img.replace(/\/w.h/,'/128.180');
                    result[i].img = img;
                }
            }
            let html = searchAllView({});
            $('#root').html(html);
    
            function back(){
                window.history.back();
            }
            $('.back').on('tap',_.debounce(back,500))
            result = [this.oneInfo,...result];
            let searchAllhtml = searchAllListView({
                result,
            });
            $('.search-movie-result').html(searchAllhtml);
            let that = this;
            let bscoll = new bScroll($('.search-wrap').get(0),{
    
            })
    
    
            async function add(){
                if(this.maxScrollY <= this.y){
                    let Moreresult = await searchAllModul.get({
                        type: that.type,
                        offset:that.offset,
                        limit: that.limit,
                        keyword:that.keyWord,
                        id
                    })
                    console.log(Moreresult)
                    Moreresult =  Moreresult.movies;
                    if(Moreresult){
                        for(var i=0;i<Moreresult.length;i++){
                            let img = Moreresult[i].img.replace(/\/w.h/,'/128.180');
                            Moreresult[i].img = img;
                        }
                    }
                    result = [...result,...Moreresult];
                    that.offset +=that.limit;
                    let morehtml = searchAllListView({
                        result,
                    });
                    $('.search-movie-result').html(morehtml);
                }
            }
            bscoll.on('scrollEnd',_.debounce(add,1000))
        }
        else if(this.type == 'cinemas'){
            let result = await searchAllModul.get({
                type: this.type,
                offset:this.offset,
                limit: this.limit,
                keyword: this.keyWord,
                id
            })
            let html = searchAllView({});
            $('#root').html(html);
            let cinemaResult = result.cinemas;
            let  searchCinemaAllHtml = searchCinemaAllView({
                List:cinemaResult,
            });
            $('.search-wrap .cinema-result').html(searchCinemaAllHtml);
            function back(){
                window.history.back();
            }
            $('.back').on('tap',_.debounce(back,500))
            let that = this;
            let bscoll = new bScroll($('.cinema-result-wrap').get(0),{
    
            })
            async function add(){
                if(this.maxScrollY >= this.y){
                    let Moreresult = await searchAllModul.get({
                        type: that.type,
                        offset:that.offset,
                        limit: that.limit,
                        keyword:that.keyWord,
                        id
                    })
                    console.log(Moreresult)
                    Moreresult =  Moreresult.cinemas;
                    cinemaResult = [...cinemaResult,...Moreresult];
                    that.offset += that.limit;
                    let morehtml = searchCinemaAllView({
                        List:cinemaResult,
                    });
                    $('.cinema-result-wrap .cinema-result').html(morehtml);
                }
            }
            bscoll.on('scrollEnd',_.debounce(add,1000))
        }
        
    }
}
export default new SearchAll();