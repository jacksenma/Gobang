/**
 * Created by fjj on 16-9-29.
 */
var over=false;
var chessBoard=[];
for(var i=0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
    }
}
var me=true;


//赢法数组(三维数组)
var wins=[];
for(var i=0;i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}

var count=0;//count代表第count种赢法
//所有竖线赢法（因为原点在左上角）
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
//横线
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
//斜线左上到右下
for(var i=0;i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
//反斜线（左下到右上）
for(var i=0;i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}

//赢法的统计数组
var myWin=[];
var computerWin=[];

for(var i=0;i<count;i++){
    myWin[i]=0;
    computerWin[i]=0;
}

var chess=document.getElementById('chess');
var context=chess.getContext('2d');
// console.log(context.width);
context.strokeStyle='#BFBFBF';

for(var i=0;i<15;i++){
    //竖
    context.moveTo(15+i*30,15);
    context.lineTo(15+i*30,435);
    //横
    context.moveTo(15,15+i*30);
    context.lineTo(435,15+i*30);
    context.stroke();
}
// oneStep(0,0,true);
// oneStep(1,1,false);
//画棋子
function oneStep(i,j,me) {

    // context.save();
    context.beginPath();
    context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    context.closePath();
    var gra=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30,15+j*30,0);
    if(me){
        gra.addColorStop(0,"#0A0A0A");
        gra.addColorStop(1,"#636766");
    }else{
        gra.addColorStop(0,"#D1D1D1");
        gra.addColorStop(1,"#F9F9F9");
    }

    context.fillStyle=gra;
    context.fill();
    // context.restore();
}

chess.onclick=function (e) {
    if(over){
        return;
    }
    if(!me){
        return;//这时候如果不是我方下棋则return;
    }
    var x=e.layerX;
    var y=e.layerY;
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);

    if(chessBoard[i][j]==0){

        oneStep(i,j,me);

            chessBoard[i][j]=1;
            for (var k=0;k<count;k++){
                if(wins[i][j][k]){
                    myWin[k]++;
                    computerWin[k]=6;//表示另一方无法以此法取胜
                    if(myWin[k]==5){
                        over=true;
                        setTimeout("finish(1)",100);
                    }
                }
            }

        if(!over){
            me=!me;
            computerAI();
        }

    }


}
function computerAI() {
    var myScore = [];//二维数组，用来标记棋盘上所有点的玩家的分数
    var comScore = [];//二维数组，用来标记棋盘上所有点的计算机的分数
    var max=0;//最高分，计算机将在最高分点落子，决定u,v的值
    var u=0,v=0;//计算机最终落子的坐标

    //初始化两个得分数组
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        comScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            comScore[i][j] = 0;
        }
    }

    //检查包含（i,j）这个点的所有赢法
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {//(i,j)点还没有落子

                //检查完了（ｉ，j）这个点，计算出了此点的分数————myScore和comScore
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {//判断在第k种赢法上，玩家和计算机的落子个数，然后根据不同情况加上不同分数
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {//玩家在这条赢法路径上下了4个子
                            myScore[i][j] += 10000;
                        }


                        if (computerWin[k] == 1) {
                            comScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            comScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            comScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            comScore[i][j] += 20000;
                        }
                    }
                }//end for


                //把计算出的分数与最大值比较，如果大于最大值，则把它作为最大值，若等于最大值，则选出最大的comScore
                if(myScore[i][j]>max){
                    max=myScore[i][j];
                    u=i;
                    v=j;
                }else if(myScore[i][j]==max){
                    if(comScore[i][j]>comScore[u][v]){
                        u=i;
                        v=j;
                    }
                }

                //把comSore放在最后判断是因为，如果com和my都大于最大值，优先选择comScore最大的落子，因为要优先下计算机能赢的位置而不是一直去堵玩家路

                if(comScore[i][j]>max){
                    max=comScore[i][j];
                    u=i;
                    v=j;
                }else if(comScore[i][j]==max){//若等于最大值,说明这个点和上一个最大点comScore一样，再比较两个点的myScore
                    if(myScore[i][j]>myScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }

    //选出最大点后计算机落子
    oneStep(u,v,false);
    chessBoard[u][v]=2;


    for (var k=0;k<count;k++){
        if(wins[u][v][k]){//因为这个方法写在计算机下子的步骤中，所以不会把玩家的计算进去，即不会影响computerWin的值
            computerWin[k]++;
            myWin[k]=6;
            if(computerWin[k]==5){
                over=true;
                // setTimeout(window.alert("计算机赢了"),2000);
                setTimeout("finish(0)",100);




            }
        }
    }
    if(!over){
        me=!me;
    }
}

//结束时的输出信息
function finish(f) {
    if(f){
        alert("你赢了");
    }else{
        alert("计算机赢了");
    }

}
