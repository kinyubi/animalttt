
// ====================================================
// Word Spinner -- used by the Spell tab
// ====================================================
let WPrefix = "";
let WVowel = "";
let WSuffix = "";
let acceptedWords = [];
let completedWords = [];

WSpin = {		// Word Spinner

	init: function(){
		//alert("in WSpin.init");
		WPrefix = "";
		WVowel  = "";
		WSuffix = "";
	},

    setAcceptedWords: function(words){
        acceptedWords = words.trim().replace(/\s+/g, ' ').split(' ');
    },

    spinIt: function(pvs, letters, finalVowel) {
        if(pvs==="p") {WPrefix = letters;}
        if(pvs==="v") {WVowel = letters;}
        if(pvs === "s") {WSuffix = finalVowel != '' ? letters + finalVowel : letters}

        let wordFormed = WPrefix+WVowel+WSuffix;
        let isLettersLesson = document.getElementById('isChainLetters').value;

        let isAcceptedWord = false;

        if(isLettersLesson == "true")
            isAcceptedWord = true;
        else
            isAcceptedWord = WPrefix != "" && WVowel != "" && WSuffix != "";

        let isCompletedWord = false;

        if(isAcceptedWord){
            isCompletedWord = completedWords[completedWords.length - 1] == wordFormed;
            if(!isCompletedWord) {
                completedWords.push(wordFormed);
                let spanWord = document.createElement('SPAN');
                spanWord.classList.add("chain-completed-word");
                spanWord.innerHTML = wordFormed;
                let foundWordContainer = document.createElement('DIV');
                foundWordContainer.appendChild(spanWord);

                let wordsFoundContainer = document.getElementById('words-found');
                wordsFoundContainer.prepend(foundWordContainer);

            }
        }

        document.getElementById("spinResult").innerHTML = wordFormed;
    },



    wordSpinner: function (pvs,letters){this.spinIt(pvs, letters, "");},

    wordSpinnerPlusE: function (pvs,letters){this.spinIt(pvs, letters, "e");}
}

// ====================================================
// Turn scrolling off when colorbox modal is active
// see https://www.geeksforgeeks.org/how-to-disable-scrolling-temporarily-using-javascript/
// ====================================================

function disableScroll() {
    document.body.classList.add("body__scroll_disable");
}

function enableScroll() {
    document.body.classList.remove("body__scroll_disable");
}

function eraseSpellBox() {
    $("#spinResult").html("");
    WSpin.init();
}

// ====================================================
// Sets a cookie to give PHP screen and window size
// ====================================================

function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function setScreenCookie() {
    let cookieName = 'readxyz_screen';
    let screenStr = screen.width.toString() + ',' + screen.height.toString();
    let windowStr = window.innerWidth.toString() + ',' + window.innerHeight.toString();
    let deviceStr = mobileCheck() ? 'mobile' : 'desktop';
    let cookieValue = screenStr + ',' + windowStr + ',' + deviceStr;
    // from js-cookie library
    Cookies.set(cookieName, cookieValue, { expires: 1 });
}

function format(fmt, ...args){
    return fmt.split("%%").reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ""), "");
}

function seeZoo() {
    let width = (screen.availWidth < 700) ? screen.availWidth - 20 : Math.min((window.innerWidth - 40), 900);
    let height = (screen.availWidth < 700) ? screen.availHeight -20 : window.innerHeight - 40;
    let staticConfig = 'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no,left=10,top=10';
    let specs = format('height=%%,width=%%,%%', height, width, staticConfig);
    window.open('/seeZoo', 'newwindow', specs);
    // setTimeout( function(){document.location.href='/My_Folder/PHP/file_2.php'}, 1000 );
}

function doNothing(data) {}

function noAward(data) {
    if (data === '0') {
        alert("Sorry. You can't earn prizes that quickly.")
    } else {
        window.location.assign('/reloadLesson');
    }
}

function advanceAnimal() {
    let animalIndexDiv = document.getElementById("animal-index");
    let animalIndex = parseInt(animalIndexDiv.innerText);
    let firstStr = (animalIndex + 1).toString();
    let secondStr = (animalIndex + 2).toString();
    let url = '/handler/award?n=' + firstStr+ '&t=' + Date.now().toString();

    document.getElementById('next-animal').href = '/award.php?n=' + secondStr;
    document.getElementById("current-animal-img").src = "/images/animals/numbered150/" + firstStr + ".png";
    document.getElementById("next-animal-img").src = "/images/animals/gray150/" + secondStr + ".png";
    animalIndexDiv.innerText = firstStr;

    $.post(url).done(() => {
        window.location.reload();
    });
}

$(document).ready(function () {
    WSpin.init();
    if(document.getElementById('chain-accepted-words') !== null){
        WSpin.setAcceptedWords(document.getElementById('chain-accepted-words').value);
    }

    setScreenCookie();
});
