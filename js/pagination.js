var pagination = (function() {
    
    var num_left_pages = 2;
    var num_right_pages = 2;
    var total_pages = 0;
    
    var div_pag = $('<div>',{id:"pag", class:"pagination pg col-md-8"});
    //Расположение div_pag внутри div_content:
    
    var div_indent_pag = $('<div>',{class:"row indentPag"});
    var div_position_pag = $('<div>',{class:"row positionPag"}).append($('<div>',{class:"col-md-2"}));

    function init(page, totalArticles, articles_on_page, div_content)
    {
        div_pag.empty();
        
        total_pages = Math.ceil(totalArticles/articles_on_page);
        if(total_pages == 1) return;

        // Количество отображаемых страниц
        var pages_in_pag = [];
        
        // Наша страница в середине пагинации
        if (page > num_left_pages && page < (total_pages - num_right_pages) )
        {
            for (var i = page - num_left_pages; i <= page + num_right_pages; i++)
            {
                pages_in_pag.push(i);
            }
            
        // Наша страница в ближе к началу(или в начале) пагинации
        }else if (page <= num_left_pages)
        {
            var end = Math.min(page + num_right_pages, total_pages);
            for (var i = 1; i <= end; i++)
            {
                pages_in_pag.push(i);
            }
            
        // Наша страница в ближе к концу(или в конце) пагинации
        }else
        {
            for (var i = page - num_left_pages; i <= total_pages; i++)
            {
                pages_in_pag.push(i);
            }
        }
        // Формируем пагинацию
        display_pages(page, pages_in_pag);     
        
        // Добавляем готовую пагинацию 
        div_position_pag.append(div_pag)
        div_content.append(div_indent_pag, div_position_pag);
    
    }
    
    function display_pages(on_page, pages_in_pag)
    {
        var ul_pag = $('<ul>');
         
        if (on_page !== 1 )
        {   
            var step_left = $('<li>').append ($('<a>',{class:"btn btn-sm black", id:"firstPage", text: "< назад   ", href:"#all/?page="+(+on_page - 1)+"", link:"ajax"}));
            ul_pag.append(step_left);
        }
        
        for (var number_page of pages_in_pag)
        {
            if (number_page == on_page)
            {
                var current = $('<li>').append ($('<a>',{class:"btn btn-sm border border-dark", id:"currentPage", text:number_page}));
            }else
            {
                var current = $('<li>').append ($('<a>',{class:"btn btn-sm black", id:"Page"+number_page, text:number_page, href: "#all/?page="+number_page+"", link:"ajax"}));
            }

            ul_pag.append(current);
        }
        
        if (on_page !== total_pages)
        {
            var step_right = $('<li>').append ($('<a>',{class:"btn btn-sm black", id:"lastPage", text: "   вперед >", href:"#all/?page="+(+on_page + 1)+"", link:"ajax"}));
            ul_pag.append(step_right);
        }

        div_pag.append(ul_pag);
    }
    
    return {
        init: init
    }
})();

export default pagination;

