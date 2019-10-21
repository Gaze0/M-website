const layoutView = require('../views/layout.art');


class Index{

    bindClick(){
        if( $(this).attr('data-to')=='mine'){
            location.href = 'http://localhost:8000/mine.html';
        }else{
            location.hash = $(this).attr('data-to')
        }
        
    }

    render(){
        const html = layoutView({});
        $('#root').html(html);
        $('footer li').on('click',this.bindClick)
    }
}
export default new Index;