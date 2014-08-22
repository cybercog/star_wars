var agent_strictHTML = 0;
var agent_usefx = 0;
var agent_isMac = (navigator.appVersion.indexOf("Mac") != -1);
var agent_NN4 = document.layers?1:0;
var agent_IE4 = document.getElementById?0:1;
var agent_OPR = (navigator.userAgent.indexOf("Opera")!=-1)?1:0;
var agent_OPR7 = 0;
var agent_NS6 = (document.getElementById && !document.all && !agent_OPR)?1:0;
if (agent_OPR) {
        temp = navigator.userAgent.split("Opera");
        if (temp[1].substring(0,1) == "/") {temp = temp[1].split("/");}
        ver = parseFloat(temp[1]);
        if (ver >= 7) agent_OPR7 = 1;
        if (ver < 7) agent_strictHTML=0;
}
if (navigator.appVersion.indexOf("MSIE")>-1) {
        temp = navigator.appVersion.split("MSIE");
        ver = parseFloat(temp[1]);
        if ((ver >= 5.5) && !agent_NS6 && !agent_OPR && !agent_isMac) agent_usefx = 1;
        if (ver<6 && !agent_isMac && !agent_OPR && !agent_NS6) agent_strictHTML=0;
}

var menuPadding = new Array(
        {
                left: 1,
                right: 1,
                top: 1,
                bottom: 1
        },
        {
                left: 3,
                right: 5,
                top: 1,
                bottom: 1
        }
);//main menu, sub menu
var menuHeader = new Array("Trebuchet MS,14px,#000000,none","Trebuchet MS,14px,#850101,underline");
var menuFont = new Array("Trebuchet MS,9pt,#56544d,none","Trebuchet MS,9pt,#ae5656,none"); //normal, active
var menuBackgroundColor = new Array("#e6dfd9","#e6dfd9","#e6dfd9","#ded5ce");//main menu, main menu hover, sub menu, sub menu hover
var menuBorder = new Array("1px solid #455555", "1px solid #e6dfd9");//main menu, sub menu
var menuFilter = "progid:DXImageTransform.Microsoft.Shadow(direction=135,color=#aaaaaa,strength=5)";
var animationFilter = "progid:DXImageTransform.Microsoft.Inset(duration=0.2)";

function buildMenu(){
        var str = "";
        var font = menuFont[0].split(",");
        var fontHeader = menuHeader[0].split(",");
        for ( var i in upMenu ){
                var menuItem = upMenu[i];
                var str1 = "<table id='upMenuContent_"+i+"' cellSpacing=0 ";
                str1 += "style='"+addFilter()+"z-index:999;position:absolute;top:0;left:0;visibility:hidden;";
                str1 += getPaddingTexts(menuPadding[0])+"background-color:"+menuBackgroundColor[0]+";border:"+menuBorder[0]+"'>";
                for ( var j = 0; j < menuItem.content.length; j++ ){
                        var subItem = menuItem.content[j].split("^");
                        var str2 = "<tr><td id='upMenuContent_"+i+"_"+j+"' ";
                        str2 += "style='white-space:nowrap;z-index:999;"+getPaddingTexts(menuPadding[1])+"background-color:"+menuBackgroundColor[2]+";border:"+menuBorder[1]+";";
                        str2 += "font-family:"+font[0]+";font-size:"+font[1]+";color:"+font[2]+";cursor:hand;'>&raquo;&nbsp;";
                        str2 += subItem[0];
                        str2 += "</tr></td>";
                        str1 += str2;
                }
                str1 += "</table>";
                str1 += "<span id='upMenu_"+i+"' style='cursor:hand;font-family:"+fontHeader[0]+";font-size:"+fontHeader[1]+";color:"+fontHeader[2]+";font-decoration:"+fontHeader[3]+"'>";
                str1 += "<b>"+menuItem.label+"</b>";
                str1 += "</span>&nbsp;&nbsp;";
                str += str1;
        }
        document.write(str);
        attachEvents();
}

function addFilter(){
        if (agent_usefx && (animationFilter || menuFilter))
                return "filter:"+animationFilter+" "+menuFilter+";";
        return "";
}

function attachEvents(){
        for ( var i in upMenu ){
                var menuItem = upMenu[i];
                var element = document.getElementById("upMenu_"+i);
                element.onmouseover = showMenu;
                element.onmouseout = hideMenu;
                var maxWidth = 0;
                var upMenuWidth = document.getElementById("upMenuContent_"+i).offsetWidth;
                for ( var j = 0; j < menuItem.content.length; j++ ){
                        element = document.getElementById("upMenuContent_"+i+"_"+j);
                        element.style.width = upMenuWidth;
                        element.onmouseover = highlightMenu;
                        element.onmouseout = removeHighlightFromMenu;
                        element.onclick = openLocation;
                }
        }
}

var shouldHideMenu = false, menuHideTimeout = null, activeMenu = null;

function openLocation(){
        var ID = this.id.split("_");
        var menuItem = upMenu[ID[1]];
        var content = menuItem.content[ID[2]];
        var item = content.split("^");
        if ( item.length == 2 ){
                var loc = item[1];
                if ( loc.indexOf("javascript:") == 0 ){
                        loc = loc.substring("javascript:".length);
                        setTimeout(loc, 0);
                }
                else
                        document.location.href = loc;
        }
}

function getElementPosition(element){
        var objectTop = element.offsetTop;
        var objectLeft = element.offsetLeft;
        var objectParent = element.offsetParent;
        while( objectParent.tagName.toUpperCase() != "BODY" ){
                objectTop += objectParent.offsetTop;
                objectLeft += objectParent.offsetLeft;
                objectParent = objectParent.offsetParent;
        }
        return [objectTop,objectLeft];
}

function showMenu(){
        shouldHideMenu = false;
        clearTimeout(menuHideTimeout);
        var ID = this.id.split("_");
        if ( activeMenu != null && activeMenu != ID[1] ){
                shouldHideMenu = true;
                hideSubMenu(activeMenu);
        }
        activeMenu = ID[1];
        var element = document.getElementById("upMenuContent_"+ID[1]);
        if ( agent_usefx && animationFilter)
                element.filters[0].apply();
        var position = getElementPosition(this);
        element.style.top = position[0]+this.offsetHeight;
        element.style.left = position[1]-15;
        element.style.visibility = "visible";
        hideElementsIfNeeded(element);
        highlightMainMenu(this, 1);
        if ( agent_usefx && animationFilter)
                element.filters[0].play();
}

function hideMenu(){
        shouldHideMenu = true;
        var ID = this.id.split("_");
        menuHideTimeout = setTimeout("hideSubMenu('"+ID[1]+"')", 300);
}

function highlightMainMenu(elem, highlightID){
        var headFont = menuHeader[highlightID].split(",");
        elem.style.fontFamily = headFont[0];
        elem.style.fontSize = headFont[1];
        elem.style.color = headFont[2];
        elem.style.textDecoration = headFont[3];
}

function highlightMenu(){
        shouldHideMenu = false;
        clearTimeout(menuHideTimeout);
        this.style.backgroundColor = menuBackgroundColor[3];
        var font = menuFont[1].split(",");
        this.style.fontFamily = font[0];
        this.style.fontSize = font[1];
        this.style.color = font[2];
        this.style.textDecoration = font[3];
        var headMenu = document.getElementById("upMenu_"+(this.id.split("_"))[1]);
        highlightMainMenu(headMenu, 1);
}

function hideSubMenu(id){
        if ( shouldHideMenu ){
                var element = document.getElementById("upMenuContent_"+id);
                element.style.visibility = "hidden";
                unhideElements();
                element.style.top = 0;
                element.style.left = 0;
                shouldHideMenu = false;
                var headMenu = document.getElementById("upMenu_"+id);
                highlightMainMenu(headMenu, 0);
        }
}

function removeHighlightFromMenu(){
        shouldHideMenu = true;
        this.style.backgroundColor = menuBackgroundColor[2];
        var font = menuFont[0].split(",");
        this.style.fontFamily = font[0];
        this.style.fontSize = font[1];
        this.style.color = font[2];
        this.style.textDecoration = font[3];
        var ID = this.id.split("_");
        menuHideTimeout = setTimeout("hideSubMenu('"+ID[1]+"')", 300);
}

function getPaddingTexts(padding){
        var str = "";
        for ( var i in padding ){
                str += "padding-"+i+":"+padding[i]+"px;";
        }
        return str;
}

var leftMenuFont = new Array("Arial,9pt,bold,#30414f","Arial,8pt,normal,#000000"); //main, sub
var leftMenuBackground = new Array("#E6E1CD","transparent","#F6F1DD"); //main, sub normal, sub active

function drawLeftMenu(){
        var str = "<table cellSpacing=0 cellPadding=0 align=center>";
        for ( var i in upMenu ){
                var menuItem = upMenu[i];
                var str1 = "<tr>";
                var font = leftMenuFont[0].split(",");
                var subFont = leftMenuFont[1].split(",");
                str1 += "<td style='padding-left:2pt;background-color:"+leftMenuBackground[0]+";";
                str1 += "font-family:"+font[0]+";font-size:"+font[1]+";font-weight:"+font[2]+";color:"+font[3]+"'>";
                str1 += menuItem.label+"</td>";
                for ( var j = 0; j < menuItem.content.length; j++ ){
                        var subItem = menuItem.content[j];
                        var itemName = subItem.split("^")[0];
                        var str2 = "<tr><td id='leftMenuContent_"+i+"_"+j+"' style='padding-left:2px;background-color:"+leftMenuBackground[1]+";";
                        str2 += "font-family:"+subFont[0]+";font-size:"+subFont[1]+";font-weight:"+subFont[2]+";color:"+subFont[3]+";cursor:hand;'>";
                        str2 += "&nbsp;&raquo;&nbsp;"+itemName;
                        str1 += "</td></tr>"+str2;
                }
                str += "</tr>"+str1;
        }
        str += "</table>";
        document.write(str);
        attachLeftMenuEvents();
}

function attachLeftMenuEvents(){
        for ( var i in upMenu ){
                var menuItem = upMenu[i];
                for ( var j = 0; j < menuItem.content.length; j++ ){
                        var element = document.getElementById("leftMenuContent_"+i+"_"+j);
                        element.onmouseover = highlightLeftMenuItem;
                        element.onmouseout = removeHighlightFromLeftMenuItem;
                        element.onclick = openLocation;
                }
        }
}

function highlightLeftMenuItem(){
        this.style.backgroundColor = leftMenuBackground[2];
}

function removeHighlightFromLeftMenuItem(){
        this.style.backgroundColor = leftMenuBackground[1];
}

var leftMenuObjects = new Array();

function setLeftMenuObjects(objects){
        for ( var i = 0; i < objects.length; i++ ){
                var name = objects[i];
                var element = document.getElementById(name);
                if ( !element )
                        continue;
                var cookieValue = getCookie(name);
                cookieValue = (cookieValue==1)?1:0;
                leftMenuObjects[name] = cookieValue;
                if ( cookieValue == 0 )
                        element.style.display = 'none';
                element = document.getElementById("a_"+name);
                if ( !element )
                        continue;
                element.onclick = openCloseLeftMenu;

                var element0 = document.getElementById("i_"+name+"_0");
                var element1 = document.getElementById("i_"+name+"_1");
                if ( !element0 || !element1 )
                        continue;
                element0.style.display = (cookieValue==0)?'':'none';
                element1.style.display = (cookieValue==0)?'none':'';
        }
}

function openCloseLeftMenu(){
        var ID = this.id.split("_");
        var name = ID[1];
        var element = document.getElementById(name);
        var img = new Image();
        var cookieValue = leftMenuObjects[name];
        cookieValue = cookieValue==1?0:1;
        element.style.display = (cookieValue==1)?'':'none';
        leftMenuObjects[name] = cookieValue;
        setCookie(name,cookieValue);
        var element0 = document.getElementById("i_"+name+"_0");
        var element1 = document.getElementById("i_"+name+"_1");
        if ( !element0 || !element1 )
                return;
        element0.style.display = (cookieValue==0)?'':'none';
        element1.style.display = (cookieValue==0)?'none':'';
}

var hiddenObjects = new Array();

function hideElementsIfNeeded(overDiv){
        unhideElements();
        if( agent_usefx )
                hideElements('SELECT', overDiv);
        hideElements('OBJECT', overDiv);
}

function hideElements(elmID, overDiv){
        for( var i = 0;        i <        document.all.tags( elmID ).length; i++ ){
                obj = document.all.tags(elmID)[i];
                if( !obj || !obj.offsetParent        )
                        continue;

                var position = getElementPosition(obj);
                objTop = position[0];
                objLeft = position[1];
                objHeight = obj.offsetHeight;
                objWidth = obj.offsetWidth;

                if ( ( overDiv.offsetLeft + overDiv.offsetWidth ) <= objLeft );
                else if ( ( overDiv.offsetTop + overDiv.offsetHeight ) <= objTop );
                else if ( overDiv.offsetTop >= ( objTop + objHeight ) );
                else if ( overDiv.offsetLeft >= ( objLeft + objWidth ) );
                else if ( obj.style.visibility = "visible" ){
                        hiddenObjects.push(obj);
                        obj.style.visibility = "hidden";
                }
        }
}

function unhideElements(){
        for ( var i = 0; i < hiddenObjects.length; i++ ){
                hiddenObjects[i].style.visibility = "visible";
        }
        hiddenObjects = new Array();
}

var expDays = 30;
var exp = new Date();
exp.setTime(exp.getTime() + (expDays*24*60*60*1000));

function setCookie(name, value){
    document.cookie = name + "=" + escape(value)+"; expires=" + exp.toGMTString();
}

function getCookie(name){
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
        begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
        end = dc.length;
    return unescape(dc.substring(begin + prefix.length, end));
}

function deleteCookie(name){
    if (getCookie(name))
        document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT";
}