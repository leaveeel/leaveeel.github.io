/*ie旋转定位*/
var xzwh=300,
    xzstyle=document.getElementById("xz").style;
xzstyle.width=xzwh+"px";
xzstyle.height=xzwh+"px";
function xuanzhuan(angle){
    var angle,radian,sin,cos,ang,wh,move;
    radian = angle*Math.PI/180;
    sin = Math.sin(radian);
    cos = Math.cos(radian);
    xzstyle.filter="progid:DXImageTransform.Microsoft.Matrix(M11="+cos+",M12="+(-sin)+",M21="+sin+",M22="+cos+",sizingMethod='auto expand')";
    xzstyle.transform="rotate("+angle+"deg)";
    wh=(sin+cos)*xzwh;
    move=xzwh/2-wh/2;
    if('transform' in document.documentElement.style){//判断是否支持“transform” 是否为旧版ie
        xzstyle.marginLeft=-xzwh/2+"px";
        xzstyle.marginTop=-xzwh/2+"px";
    }else{
        xzstyle.marginLeft=move-xzwh/2+"px";
        xzstyle.marginTop=move-xzwh/2+"px";
    }
}
xuanzhuan(30);
