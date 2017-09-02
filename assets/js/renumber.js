function renumber(){
    // var element = tinymce.activeEditor.dom.select("span[class*='pid']");
    var lvl1 = 1;
    var lvl2 = 1;
    var lvl3 = 0; //uses alphabet array
    var lvl4 = 1;
    var lvl5 = 1;
    var lvl6 = 0; //uses alphabet array
    var lvl7 = 1;
    // alphabet reflects a, aa, aaa lettering. Goes up to 'zzz'.
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","aa","bb","cc","dd","ee","ff","gg","hh","ii","jj","kk","ll","mm","nn","oo","pp","qq","rr","ss","tt","uu","vv","ww","xx","yy","zz","aaa","bbb","ccc","ddd","eee","fff","ggg","hhh","iii","jjj","kkk","lll","mmm","nnn","ooo","ppp","qqq","rrr","sss","ttt","uuu","vvv","www","xxx","yyy","zzz"];

    // pulled from kiiac.js in kmauthor
    function toSmallRoman(n) { // works up to xxxix
        if (n < 1) return "";
        if (n > 99) return "c" + toSmallRoman(n - 100);
        if (n > 89) return "xc" + toSmallRoman(n - 90);
        if (n > 49) return "l" + toSmallRoman(n - 50);
        if (n > 39) return "xl" + toSmallRoman(n - 40);
        if (n > 9) return "x" + toSmallRoman(n - 10);
        if (n == 9) return "ix";
        if (n > 4) return "v" + toSmallRoman(n - 5);
        if (n == 4) return "iv";
        return n == 3 ? "iii" : (n == 2 ? "ii" : "i");
    };

    function secondlvl(lvl){
        if(lvl > 1){
            return lvl - 1;
        } else {
            return lvl;
        }
    };

    // The core logic of the renumbering. Could probably be refactored
    $('p.numbered').each(function(e){
        var lvl = $(this).attr('class');
        var parent = $(this).parent();
        if ($(this).hasClass('L1')){
            // Format of 1. 
            $(this).prepend(lvl1 + ". ");
            // Add one to lvl1
            lvl1 += 1;
            // Reset lvl2 because the next top-level clause will need to repeat 1.1 format, etc
            lvl2 = 1;
            lvl3 = 0;
        } else if ($(this).hasClass('L2')){
            // 1.1 format
            $(this).prepend(secondlvl(lvl1) + "." + lvl2 + ". ");
            lvl2 += 1;
            lvl3 = 0;
        } else if ($(this).hasClass('L3')){
            // (a) format
            $(this).prepend("(" + alphabet[lvl3] + ") ");
            lvl3 += 1;
            lvl4 = 1
        } else if ($(this).hasClass('L4')){
            // (i) format
            $(this).text("(" + toSmallRoman(lvl4) + ") ");
            lvl4 += 1;
            lvl5 = 1;
        } else if ($(this).hasClass('L5')){
            // (1) format
            $(this).text("(" + lvl5 + ") ");
            lvl5 += 1;
            lvl6 = 0;
        } else if ($(this).hasClass('L6')){
            // (A) format
            $(this).text("(" + alphabet[lvl6].toUpperCase() + ") ");
            lvl6 += 1;
            lvl7 = 1;
        }  else if ($(this).hasClass('L7')){
            // (I) format
            $(this).prepend("(" + toSmallRoman(lvl7).toUpperCase() + ") ");
            lvl7 += 1;
            lvl8 = 0;
        } else if ($(this).hasClass('L8')){
            // a. format
            $(this).prepend(alphabet[lvl8] + ". ");
            lvl8 += 1;
            lvl9 = 1;
        } else if ($(this).hasClass('L9')){
            // i. format
            $(this).prepend(toSmallRoman(lvl9) + ". ");
            lvl9 += 1;
            lvl10 = 1;
        }
        else if ($(this).hasClass('L10')){
            // 1. format
            $(this).prepend(lvl10 + ". ");
            lvl10 += 1;
        }
    });
};