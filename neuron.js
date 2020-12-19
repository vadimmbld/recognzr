let body = document.querySelector('body');
const N = [13,11];
const X = 4,L=N.length;
// N=[16,12,14,12,9,1];
let w = [], S,Ts=[];
let v,out,gr,iteration;
iteration = 0;
let Er = [];

let colors = ['Black','Gray','Red','Orange','Yellow','Green','Blue','Purple', 'Pink','White','Brown'];   

function trueResArray(trueInd,leng){
  let arr = Array(leng).fill(0);
  for(let i=0;i<leng;i++){
    if(i==trueInd){
      arr[i]++;
    }
  }
  return arr;
}
function rnd(min, max)
{
  return ( min + Math.random() * (max - min) );
}
function init(){
    w = [];
    N.forEach((neurons,layer)=>{
        w.push([]);
        for(let i=0;i<neurons;i++){
            w[layer].push([]);
            for(let j=0;j<(layer>0?N[layer-1]:X);j++){
                w[layer][i].push(rnd(-0.5,0.5));
            }
        }
    });
}
function softmax(x){
  let summ=0;
  let newArr=[];
  for(let i=0;i<x.length;i++){
      summ+=Math.exp(x[i]);
  }
  for(let i=0;i<x.length;i++){
    newArr.push(Math.exp(x[i])/summ);
  }
  return newArr;
}

function randomRange(min,max){
  if(min < max){
      return Math.floor(Math.random()*(max-min+1) + min);
  }else if(min==max){
      return min;
  }else{
    return NaN;
  }
}
function LuActive(x){
  if((x>=0)&&(x<=11)){
      return x;
    }else{
      if(x<0){
        return 0.01*x;
      }else{
        return 11+0.01*(x-11)
      }
    }
  
}

function dxLu(x){
  if((x>=0)&&(x<=11)){
    return 1
  }else{
    return 0.01
  }
}
function neuron(x){
  out = new Array(N.length);
  for(let i=0;i<out.length;i++){
      out[i] = new Array(N[i]).fill(0);
  }
  N.forEach((neuron,layer)=>{
      for(let i=0;i<neuron;i++){
          S=0;
          for(let j=0;j<w[layer][i].length;j++){
              S+= w[layer][i][j]*(layer>0?out[layer-1][j]:x[j])
          }
          out[layer][i] = LuActive(S);
      }
  });
  if(out[L-1].length>1){
    return softmax(out[L-1]);
  }else{
    return out[L-1][0];
  } 
}
function teach(epoch,lr=0.1){
  let train;
  let Len = N.length-1;
  for(let k=0;k<epoch;k++){
      Ts.forEach((noooone,num)=>{
          train=Ts[randomRange(0,Ts.length-1)];
          ///////////////////
          let y = neuron(train.slice(0,X));
          if(!Array.isArray(y)){
            let e=y-train[X];
            gr = [];
            N.forEach( (v,i) => gr.push([]));
            for(let l=Len;l>=0;--l){
                for(let Neur=0;Neur<N[l];Neur++){
                    if(l==Len){
                        gr[l].push(e*dxLu(y));
                    }else{
                        let sum = 0;
                        gr[l+1].forEach((grr,neuro)=>{
                            sum+= grr * w[l+1][neuro][Neur];
                           
                        })
                        gr[l].push(sum*dxLu(out[l][Neur]));
                        
                    }
                }
            }
          }else{
            let e = [];
            for(let errr=0;errr<y.length;errr++){
              e.push(y[errr]-train[X][errr]);
            }
            gr = [];
            N.forEach( (v,i) => gr.push([]));
            for(let l=Len;l>=0;--l){
              for(let Neur=0;Neur<N[l];Neur++){
                  if(l==Len){
                    gr[l].push(e[Neur]*dxLu(y[Neur])); 
                  }else{
                      let sum = 0;
                      gr[l+1].forEach((grr,neuro)=>{
                          sum+= grr * w[l+1][neuro][Neur];
                         
                      })
                      gr[l].push(sum*dxLu(out[l][Neur]));
                  }
              }
            }
          }
         
          out.forEach(        // Проходимся по всем слоям сети
              (layer, l) =>     //layer - содержит все нейроны в слое, а l - номер слоя
              {
                w[l].forEach(   //Проходимся по всем нейронам в слое
                  (k, j) =>       //k - массив весовых коэффициентов нейрона, а j - номер нейрона
                  {
                    let fp =  dxLu(out[l][j]);  
                    k.forEach(      //Перебираем весовые коэффициенты нейрона
                      (weight,i) =>   //weight - весовой коэффициент, а i номер весового коэффициента
                      { 
                        
                        w[l][j][i] += -lr*gr[l][j]*fp*( l==0 ? train[i] : out[l-1][i] );  //Корректировка весового коэффициента
                      }
                    ); 
                  }
                )
              }
            );
          
      })
  }
  Er.push([iteration,(out[L-1].length==1)?E():softErr()]);                   //Добавление значения ошибки сети в массив по конкретной итерации обучения
  iteration++; 
  callbackNeuronTeach();
}
function softErr(){
let errs,s,yTr;  
s=0;
Ts.forEach((value,index)=>{
  errs = [];
  
  yTr = neuron(value.slice(0,X));
  
  for(let i=0;i<value[X].length;i++){
    errs.push(-value[X][i]*Math.log(yTr[i]));
  } 
  for(let i=0;i<errs.length;i++){
    s+=errs[i];
  }
  
});
return s;

}
function E()
{
var s=0;
Ts.forEach( (value, index) => 
            {
              s+=(neuron(value.slice(0,X))-value[X])**2;
            }
          );
return 1/Ts.length*s;
}

function writeW(){
  let st='['       
  for(let i=0;i<w.length;i++){
      st+='[';
      for(let j=0;j<w[i].length;j++){
        st+='[';
        for(let k=0;k<w[i][j].length;k++){
          if(k<w[i][j].length-1){
            st+=`${w[i][j][k]} ,`
          }else{
            st+=`${w[i][j][k]}`
          }
        }
        st+=']';
        if(j<w[i].length-1){
          st+=` ,`
        }
      }
      st+=']';
      if(i<w.length-1){
        st+=` ,`
      }
  }
  st+=']'
  console.log(st);
}




///////////////////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////
 


