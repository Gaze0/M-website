import myView from'../views/my.art';

class My{
    constructor (){
        this.render();
    }
    change(){
        let $active = $(this).parent('ul').find('div');
        if( parseInt($active.css("left")) == 0){
            $active .css({
                left:"100%",
            })
            $('.login .form').css({
                display:'none'
            })
            $('.login .form2').css({
                display:'block'
            })
        }else{
            $active .css({
                left:"0",
            })
            $('.login .form2').css({
                display:'none'
            })
            $('.login .form').css({
                display:'block'
            })
        }
       
    }
    render(){
        let html = myView({})
        $('#root').html(html);

        $('.login .nav li').on('tap',this.change);
    }
}
new My();