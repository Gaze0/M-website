const layoutView = require('../views/position.art');

// const BScroll = require('better-scroll');

import indexNav from '../router/indexNav';

class Position{
   constructor(){
       this.hashInit();
   }
   hashInit(){
       if(location.hash){
            let hash = location.hash;
            if(hash != '#indexList'){
                hash = '#indexList';
            }
            let re = /^(#\w+)(\/)?/;
            hash = re.exec(hash)
            hash = hash[1].substr(1);
            this.hash = hash;
       }
        else {
            this.hash = '#indexList'
        }
   }
    render(){
        const html = layoutView({});
        let $main = $('main');
        $main.html(html);
        var that = this;

        
        $('.switch-hot div').on('tap',function(){
            location.hash = that.hash + $(this).attr('data-to');
        });

        $('.top-bar .city-entry').on('tap',function () {
            let name = $('.top-bar .city-entry').attr('data-name');
            location.hash =that.hash + name;
        })

        $('.top-bar .search').on('tap',function(){
            location.hash = $(this).attr('data-to');
        })
    }
}
export default new Position;