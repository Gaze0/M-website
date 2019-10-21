import searchView from '../views/search.art';

import '../../styles/modules/search.scss';
import searchListView from '../views/searchList.art';

import searchModul from '../moduls/search';
import _ from 'lodash';
import SearchAllController from '../controllers/searchAll';
import searchCinemaView from '../views/searchCinema.art';

class Search{
    
    async render(){
        let html = searchView({});
        $('#root').html(html);

        let id = sessionStorage.getItem('id');
        if(id == null){
            id = 10;
        }
        // let $val = '影院'
        async function search(){
           let $val = $(this).val();
           if($val){
                let result = await searchModul.get($val,id);
                let cinemaResult = result.cinemas;
                console.log(result)
                let data = new Date();
                let day = data.toLocaleDateString();
                let today = day.replace(/\//g,'');
                let all;
                if(result.movies){
                    all = result.movies.total;
                    result = result.movies.list;
                    if(result){
                        for(var i=0;i<result.length;i++){
                            let img = result[i].img.replace(/\/w.h/,'/128.180');
                            result[i].img = img;
                            result[i].delrt =  (result[i].rt).replace(/-/g,'');
                        }
                        let listArr = _.chunk(result,3);
        
                        let listHtml = searchListView({
                            list:listArr[0],
                            all,
                            today
                        })
                        $('.search-result').html(listHtml);
                        $('.search-result .more-reslut').on('tap',function(){
                            let hash = location.hash.substr(1);
                            location.hash = hash+ $(this).attr('data-all');
                            SearchAllController.get($val);
                            SearchAllController.getOneInfo(listArr[0][0]);
                            SearchAllController.getResult($(this).attr('data-type'));
                        })
                    }
                }
                // all = result.movies.total;
                


                //添加影院
                console.log(cinemaResult)
                if(cinemaResult){
                    $('.search-cinema-wrap').show()
                    let Cinemaall;
                    let listArr = _.chunk(cinemaResult.list,2);
                    if(cinemaResult.total){
                        Cinemaall = cinemaResult.total;
                    }
                    let  searchCinemaHtml = searchCinemaView({
                        list:listArr[0],
                        all:Cinemaall
                    });
                    $('.search-cinema-wrap .cinema-wrap').html(searchCinemaHtml);
                    $('.cinema-wrap .more-reslut').on('tap',function(){
                        let hash = location.hash.substr(1);
                        location.hash = hash+ $(this).attr('data-all');
                        SearchAllController.get($val);
                        SearchAllController.getResult($(this).attr('data-type'));
                    })
                    
                }else{
                    $('.search-cinema-wrap').hide()
                }
           }
        }
        let $inp = $('.search-header input');
        $inp.on('input',_.debounce(search,1000))
    
        $inp.on('focus',function(){
            $('.search-header .del-search').css({
                display:'block'
            })
        })

        $('.inp-wrap .del-search').on('click',function(){
            $('.search-header .del-search').css({
                display:'none'
            })
            $inp.val('');
            $('.result').hide();
            $('.search-cinema-wrap').hide();
        })


        function back(){
            window.history.back();
        }
        $('.search-header .cancel').on('tap',_.debounce(back,300))
    }
}
export default new Search();