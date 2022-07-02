/*global $*/
$(document).ready(function(){
  $("#numbers").html(0);
  var num1 = "";  // 最初に入力した数字
  var num2 = "";  // 2番目に入力した数字
  var symbol = "";  // 演算子記号
  var number = "";  // 計算した数字
  var symbolClick = false;  // 演算子押下フラグ
  var resultClick = false;  // イコール押下フラグ
  var numberClick = false;  // 数字押下フラグ
  var pointClick = false;  // 小数点押下フラグ
  var array = [];  // 表示するための配列
  var num2count = 0;
  
  // 0以外の番号押下
  $(".number").click(function () {
    var clickNumber = $(this).val();

    strage(clickNumber);
    display();
  });
  
  // 小数点押下時
  $(".point").click(function() {
    // 小数点を一回しか押せないように制御
    if(!pointClick){
      var clickNumber = $(this).val();
      
      // 数字を入力せずに小数点を入力した場合
      if(!numberClick){
        if((num1 == "" || num1 == 0) || (num2 =="" || num2 == 0)){
          clickNumber = 0 + clickNumber;
        }
      }
      // 数字格納
      strage(clickNumber);
      // 表示
      display();
    }
    pointClick = true;
  });
  
  // 0番押下時
  $("#zero").click(function() {
    // 0を押下する前に他のボタンを押下していた場合
    if(numberClick || pointClick || symbolClick || resultClick){
      if(num2count == 1 && (num2 === 0 || num2 === "0")){
        return;
      }
      var clickNumber = $(this).val();
      // 数字格納
      strage(clickNumber);
      // 表示
      display();
    }
  });
  
  // 00番押下時
  $("#zero_double").click(function() {
    // 00を押下する前に他のボタンを押下していた場合
    if(numberClick || pointClick || symbolClick || resultClick){
      if(num2count == 1 && (num2 === 0 || num2 === "0")){
        return;
      }
      var clickNumber = $(this).val();
      var zero = $("#numbers").html();
      // 表示が0、演算子押下後2番目の数字が入力されていない場合
      if(zero == "0" || (num2 == "" && symbolClick)){
        clickNumber = 0;
      }
      // 数字格納
      strage(clickNumber);
      // 表示
      display();
    }
  });
  
  // 演算子押下時
  $(".symbol").click(function() {
    // 数字が0.の時以外
    if(num1 != "0." && num2 != "0."){
      // 2番目の数字が入力されている場合
      if(num2){
        clickSymbol();
        num1 = "";
        num2 = "";
      }
      // 配列の最後取得
      var last = array.slice(-1)[0];
      // 演算子が連続で押せないように制御
      if(last == "+" || last == "-" || last == "*" || last == "/"){
        array.pop();
      }
      
      // 入力した演算子取得
      symbol = $(this).val();
      // 配列に格納
      array.push(symbol);
      // 表示
      display();
      numberClick = false;
      resultClick = false;
      pointClick = false;
      symbolClick = true;
      num2count = 0;
    }
    
  });
  
  // AC押下時
  $("#reset").click(function(){
    // リセット
    reset();
    number = "";
    $("#numbers").html(0);
    
  });
  
  // =押下時
  $("#result").click(function(){
    // 数字クリック後、イコールクリックした場合
    if(!number && !symbolClick){
      number = num1;
      var zero = $("#numbers").html();
      // 表示が0の場合
      if(zero == 0){
        number = 0;
      }
    // 演算子クリック後、イコールクリックした場合
    }else if(!numberClick){
      if(!number){
        number = num1;
      }
    }else{
      clickSymbol();
    }
    
    $("#numbers").html(number);
    // リセット
    reset();
    // 配列に追加
    array.push(number);
    resultClick = true;
    pointClick = false;
  });
  
  // 計算
  function clickSymbol(){
    // 数字入力せずに演算子入力した場
    if(!num1){
      num1 = 0; 
    }
    // 文字列変換
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    // 小数点の位置取得
    var dotPositionNum1 = dotPosition(num1);
    var dotPositionNum2 = dotPosition(num2);
    // 大きい値を取得
    var max = Math.max(dotPositionNum1,dotPositionNum2);
    // 小数点移動
    num1 = parseInt((num1.toFixed(max) + '').replace('.', ''));
    num2 = parseInt((num2.toFixed(max) + '').replace('.', ''));
    // 累乗の値
    var power1 = Math.pow(10,max);
    var power2 = Math.pow(100,max);
    
    // 演算子による計算
    switch (symbol) {
      case '+':
        number = (num1 + num2) / power1;
        break;
      
      case '-':
        number = (num1 - num2) / power1;
        break;
      
      case '*':
        number = (num1 * num2) / power2;
        break;
      
      case '/':
        number = (num1 / num2);
        break;
    }
  }
  
  // リセット
  function reset(){
    num1 = "";
    num2 = "";
    symbol = "";
    symbolClick = false;
    resultClick = false;
    numberClick = false;
    pointClick = false;
    array = [];
    num2count = 0;
  }
  
  // 表示
  function display(){
    var values = "";
    // 配列を取り出し格納
    array.forEach((value) =>{
      values = values + value;
    });
    $("#numbers").html(values);
  }
  
  // 小数点の位置確認
  function dotPosition(value){
    var strVal = String(value);
    var dotPosition = 0;
    // 小数点が存在するか確認
    if(strVal.lastIndexOf('.') !== -1){
      // 小数点があったら位置を取得
      dotPosition = (strVal.length-1) - strVal.lastIndexOf('.');
    }
    return dotPosition;
  }
  
  // 数字格納
  function strage(clickNumber){
    numberClick = true;
    // resultボタン押下時
    if(numberClick && resultClick){
      number = "";
      array = [];
    }
    // 2回以上symbolボタン押下時
    if(number && !resultClick){
      num1 = number;
    }
    
    // 押下した数字を格納
    if(!symbolClick){
      num1 = num1 + clickNumber;
    }else {
      num2 = num2 + clickNumber;
      var number2 = num2.slice(0,1);
      var dot = num2.slice(1,2);
      // 2番目に入力した数字が0から始まらないように制御
      if(number2 == 0 && dot != "." && num2count == 1){
        array.pop();
      }
      num2count++;
    }
    // 配列に追加
    array.push(clickNumber);
    resultClick = false;
  }
});