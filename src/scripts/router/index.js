import indexConstroller from '../controllers/index';

// import indexListConstroller from '../controllers/indexList';
import cinemaConstroller from '../controllers/cinema';
// import mineConstroller from '../controllers/mine';
import detailConstroller from '../controllers/detail'

import indexListConstroller from '../controllers/indexList'
import upComingConstroller from '../controllers/upComing';
import allCityListConstroller from '../controllers/allCityList';
import searchConstroller from '../controllers/search';
import  searchAllConstroller from '../controllers/searchAll';
import showsConstroller from '../controllers/shows'

class Router{
    constructor(){
        this.render();
    }
    render(){
        window.addEventListener('load',this.handlePageload.bind(this));
        window.addEventListener('hashchange',this.handleHashChange.bind(this))
    }
    renderDOM(hash){
        let pageConstroller = {
            indexListConstroller,
            cinemaConstroller,
            detailConstroller,
            upComingConstroller,
            allCityListConstroller,
            searchConstroller,
            searchAllConstroller,
            showsConstroller
        }
        // console.log(hash+'Constroller');
        // console.log(hash);
        var reg = /([^#]\w+)(\/[#]\w+)?/
        hash = reg.exec(hash);
        if(hash[2]){
            hash = reg.exec(hash)[2].substr(2);
        }else{
            hash = reg.exec(hash)[1];
        }
        // console.log(hash)
        pageConstroller[hash+'Constroller'].render();
    }

    setActiveClass(){
        let hash = location.hash;
        let re = /^(#\w+)(\/)?/;
        hash = re.exec(hash)
        hash = hash[1].substr(1);
        $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active')
    }

    setIndexActiveClass(){
        let hash = location.hash;
        var reg = /([^#]+)$/
        hash = hash.match(reg)[1];
        // console.log(hash);
        $(`.switch-hot div[data-to='/#${hash}']`).addClass('active').siblings().removeClass('active');
    }

    handlePageload(){
        let hash = location.hash.substr(1) || 'indexList'
        indexConstroller.render();
        location.hash = hash;
        this.setIndexActiveClass();
        this.setActiveClass();
        this.renderDOM(hash);
        
    }


    handleHashChange(){
        let hash = location.hash.substr(1);
        location.hash = hash;
        this.setIndexActiveClass();
        this.setActiveClass();
        this.renderDOM(hash);
    }
}

new Router;