let  re = /\d{1,3}/g;
function callbackNeuronTeach(){
    if(!$('.panel').hasClass('closed')){
        $('.panel').toggleClass('closed');
        $('.button-no').parent().toggleClass('clicked');
    }
    if($('.button').hasClass('clicked')){
        $('.button').toggleClass('clicked');
        
        h=randomRange(0,360);
        s=randomRange(0,100);
        l=randomRange(0,100);
        valColor=neuron([Math.sin((h*Math.PI)/360),Math.cos((h*Math.PI)/360),s/100,l/100]);
        changeColor();
    }
    if($('.color-inf').hasClass('clicked')){
        $('.color-inf').toggleClass('clicked');
    }
}
function maxPersent(x){
    let maxpr = x[0];
    let maxIn = 0;
    for(let i=1;i<x.length;i++){
        if(maxpr<x[i]){
            maxpr=x[i];
            maxIn = i;
        }
    }
    return maxIn;
}
function changeColor(){
    let max = maxPersent(valColor);
    $('body').css('background-color',`hsl(${h},${s}%,${l}%)`);
    $('#main .background .name-color').html(colors[max]);
}
function init_colors(){
    let newcl;
    let colorshsl;
    $('.panel .color-inf').each(function(index){
            newcl = $(this).children('.color-block').data('color');
            colorshsl = newcl.match(re);
            $(this).children('.color-block').css('background-color',`hsl(${colorshsl[0]},${colorshsl[1]}%,${colorshsl[2]}%)`);
            
        }
    );
}
let h,s,l;
let valColor;
$(document).ready(function(){
   
    init();
    h=randomRange(0,360);
    s=randomRange(0,100);
    l=randomRange(0,100);
    valColor=neuron([Math.sin((h*Math.PI)/360),Math.cos((h*Math.PI)/360),s/100,l/100]);
    changeColor();
    init_colors();
    $('.button-yes').on('click',(event)=>{
        event.preventDefault();
        if(!$('.button-yes').hasClass('clicked')){
            $('.button').toggleClass('clicked');
            Ts.push([Math.sin((h*Math.PI)/360),Math.cos((h*Math.PI)/360),s/100,l/100,trueResArray(maxPersent(valColor),11)]);
            teach(Math.round(Ts.length/2),0.01);
        }
    });
    $('.button-no').on('click',(event)=>{
        event.preventDefault();
        if(!$('.button').hasClass('clicked')){
            $('.button').toggleClass('clicked');
            $('.button-no').parent().toggleClass('clicked');
            $('.panel').toggleClass('closed');
        }
    })
    $(document).on('click',(e)=>{
        if((!$('.button').is(e.target)) && !$('.panel').is(e.target) && !$('.panel').hasClass('closed') &&  ($('.panel').has(e.target).length === 0) && (valColor>=0) ){
            $('.panel').toggleClass('closed');
            $('.button').toggleClass('clicked');
            $('.button-no').parent().toggleClass('clicked');
        }
        if((!$('.message').is(e.target)) && ($('.message').has(e.target).length ===0) && (!$('#add-new-color-block').hasClass('closed'))){
            $('#add-new-color-block').toggleClass('closed');
        }
    });
    $('.panel #skip').on('click',(e)=>{
        e.stopPropagation();
        // $('#add-new-color-block').toggleClass('closed');
        // $('#add-new-color-block .current-color').attr('data-color',`hsl(${h},${s},${l})`);
        // $('#add-new-color-block .current-color').css('background-color',`hsl(${h},${s},${l})`);
        // $('#h-input').val(h);
        // $('#s-input').val(s);
        // $('#l-input').val(l); Пока что скип
        if(!$('.color-inf').hasClass('clicked')){
            $('.color-inf').toggleClass('clicked');
            callbackNeuronTeach();
        }
    })
    $('#add-new-color-block input').on('change',()=>{
        let newH = $('#h-input').val();
        let newS = $('#s-input').val();
        let newL = $('#l-input').val();
        $('#add-new-color-block .current-color').attr('data-color',`hsl(${newH},${newS},${newL})`);
        $('#add-new-color-block .current-color').css('background-color',`hsl(${newH},${newS},${newL})`);
    })
    $('#add-new-color-block .add-new-color-in-list').on('click',(e)=>{
        e.preventDefault();
        let newH = $('#h-input').val();
        let newS = $('#s-input').val();
        let newL = $('#l-input').val();
        // let newColorName = $('#name-new-color').val();
        // colors.push(newColorName);
        // $('.color-inf').last().after(`<li id="color${colors.length-1}" class="color-inf"><div data-color="hsl(${newHsl[0]},${newHsl[1]},${newHsl[2]})" class="color-block"></div><h3 class="color-name-inf">${newColorName}</h3></li>`);
        // init_colors();
        ///// Дописать
        // $('#add-new-color-block').toggleClass('closed');
        ////////////////////////// ну А пока что пусть это будет скип
       
        
    }) 
    $('.panel').on('click','.color-inf',function(){
        if(!$('.color-inf').hasClass('clicked')){
            $('.color-inf').toggleClass('clicked');
            $('.panel').toggleClass('closed');
            $('.button-no').parent().toggleClass('clicked');
            let idElem = $(this).attr('id');
            let reg = /\d{1,}/g;
            let res = idElem.match(reg);
            Ts.push([Math.sin((h*Math.PI)/360),Math.cos((h*Math.PI)/360),s/100,l/100,trueResArray(res,11)]);
            teach(Math.round(Ts.length/2),0.01);
        }
       
    })
})