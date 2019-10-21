import allCityLiatView from '../views/allCityList.art';

import '../../styles/modules/allCityList.scss';


import _ from 'lodash';

class allCityLiat{
    render(){

    let html = allCityLiatView({});
    $('#root').html(html);
    $(function () {
            $('.container').show();


            function stor() {
                sessionStorage.setItem("city" ,$(this).html());
                // console.log($(this).attr('data-id'))
                sessionStorage.setItem("id" ,$(this).attr('data-id'));
                window.history.back();
                
            }

            function stor1() {
                var s = $(this).html();
                $(".all-city-wrap").scrollTop($('#' + s + '1').get(0).offsetTop);
                $("#showLetter span").html(s);
                $("#showLetter").show().delay(500).hide(0);
            }

            function stor2() {
                $("#showLetter").show().delay(500).hide(0);
            }
            $('.all-city-wrap ').on('tap', '.city-list div',_.debounce(stor,300));
            $('.all-city-wrap').on('click', '.letter a',_.debounce(stor1,300) );
            $('.all-city-wrap').on('onMouse', '.showLetter span', _.debounce(stor2,300));
        })
    }
}

export default new allCityLiat();