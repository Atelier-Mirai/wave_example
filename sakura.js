/*=============================================================================
 * ð¸ã®è±ã³ããèãæ£ãJavaScript
 * https://actyway.com/8351 ãåã«ä½æ
 *
 * ã¯ã©ã¹ãä½¿ãããéåéã§é å¼µã£ã¦å¦ç
=============================================================================*/

(
() => {
  // =========================================================================
  // å®æ°å®£è¨ç­
  // =========================================================================
  const NUMBER_OF_HANABIRAS = 50; // è±ã³ãã®ææ°
  const FPS                 = 24; // ä¸ç§éã«24å åãã
  const HANABIRA_HEIGHT     = 30; // è±ã³ãã®é«ã åè»¢ããã®ã§æå¤§å¤ã¯ 29px
  const HANABIRA_WIDTH      = 30; // è±ã³ãã®å¹ åè»¢ããã®ã§æå¤§å¤ã¯ 29px
  const HANABIRA_Z_BASE     = 10000; // è±ã³ãã® z-index ã®åºæºå¤

  // ã¦ã£ã³ãã¦ã®é«ã
  const windowHeight = window.innerHeight;
  // ã¦ã£ã³ãã¦ã®å¹(ã¹ã¯ã­ã¼ã«ãã¼é¤ã)
  const windowWidth  = document.documentElement.clientWidth
  // ã¹ã¯ã­ã¼ã«ä½ç½®
  let scroll         = document.documentElement.scrollTop || document.body.scrollTop;

  // ã¹ã¯ã­ã¼ã«æã®ã¤ãã³ãç»é² (ã¹ã¯ã­ã¼ã«æã«è±ã³ããã¦ã£ã³ãã¦åã«ç´ã¾ãçºã«)
  document.addEventListener('scroll', () => {
    scroll = document.documentElement.scrollTop || document.body.scrollTop;
  }, false);

  // =========================================================================
  // ä¹±æ°é¢æ°
  // min ä»¥ä¸ max ä»¥ä¸ã®ä¹±æ°ãè¿ã (integer)
  // min ä»¥ä¸ max æªæºã®ä¹±æ°ãè¿ã (float)
  // =========================================================================
  let rand = (min, max, type = "integer") => {
    if(type === "integer"){
      return Math.floor(Math.random() * (max-min+1)) + min;
    } else {
      return Math.random() * (max-min) + min;
    }
  };

  // =========================================================================
  // åæåå¦ç
  // ð¸ã®è±ã³ãã®ããã®æ°ãã div è¦ç´ ãä½æããbody ã®æ«å°¾ã«è¿½å 
  // ä½æ¥­ç¨ã® è±ã³ãéåéãé©å®åæåãã
  // =========================================================================

  const divSakura = document.createElement("div");
  document.body.after(divSakura);

  // å¤æ°å®£è¨
  // -------------------------------------------------------------------------
  let domHanabiras = []; // è±ã³ãè¦ç´ ã®éå
  let jsHanabiras  = []; // è±ã³ãjsãªãã¸ã§ã¯ãã®éå
  let jsHanabirasY = []; // è±ã³ãéã® X åº§æ¨ã®éå
  let jsHanabirasX = []; // è±ã³ãéã® Y åº§æ¨ã®éå
  let tremorMax    = []; // è±ã³ãã®é£ç¶ãã¦æºãããåæ°ã®éå
  let tremorCount  = []; // è±ã³ãã®æºãã ç´¯ç©åæ°ã®éå
  let fallingSpeed = []; // è½ä¸éåº¦ã®éå


  // ããããã®è±ã³ãã«ã¤ãã¦ãä½ç½®ç­ã®åæè¨­å®ãè¡ã
  // -------------------------------------------------------------------------
  for(let i = 0; i < NUMBER_OF_HANABIRAS; i++){
    // è±ã³ãã® div ãä½ã
    let domHanabira = document.createElement('div');

    // ã©ã³ãã ã«çæããåæè¡¨ç¤ºä½ç½®ãè¨­å®ãã
    jsHanabirasX[i] = rand(HANABIRA_WIDTH / 2, windowWidth - HANABIRA_WIDTH);
    jsHanabirasY[i] = rand(-500, 0) + scroll;
    domHanabira.setAttribute('style', `z-index: ${HANABIRA_Z_BASE + i}; top: ${jsHanabirasY[i]}px; left: ${jsHanabirasX[i]}px;`);

    // ã©ã³ãã ã«çæããè±ã³ãã®è²ã¨ã¢ãã¡ã¼ã·ã§ã³ã®ããã® css class ãè¨­å®ãã
    domHanabira.setAttribute('class', `hana t${rand(1, 5)} a${rand(1, 5)}`);

    // æ±ããããããããã«ãè±ã³ãè¦ç´ éãéåã«æ ¼ç´
    domHanabiras[i] = domHanabira;

    // ä½æããè±ã³ããDOMã«è¿½å ãç»é¢ã«è¡¨ç¤ºãããããã«ãã
    divSakura.appendChild(domHanabira);

    // é£ç¶ãã¦åä¸æ¹åã¸æºãããåæ°ãã©ã³ãã ã«çæ
    tremorMax[i]    = rand(15, 50);
    // é£ç¶ãã¦åä¸æ¹åã¸æºããã åæ°ã0ã§åæå
    tremorCount[i]  = 0;
    // è½ä¸éåº¦ãã©ã³ãã ã«çæ
    fallingSpeed[i] = rand(1, 3);
  }

  // =========================================================================
  // ã¡ã¤ã³å¦ç
  // çæããããããã®è±ã³ãã®ä½ç½®æå ±ãæ´æ°ããç»é¢ã«åæ ããã
  // =========================================================================
  setInterval(() => {
    // åè±ã³ãã«å¯¾ãç§»åå¦çãç¹°ãè¿ã
    for(let i = 0; i < NUMBER_OF_HANABIRAS; i++){
      // è±ã³ãã®ä½ç½®ï¼topï¼ãã¦ã£ã³ãã¦åãªã
      if (jsHanabirasY[i] < scroll + windowHeight - HANABIRA_HEIGHT){
        // æºããã åæ°ããé£ç¶ãã¦æºãããåæ°ä»¥åãªããå³ã¸ç§»åããã
        if (tremorCount[i] <= tremorMax[i]){
          jsHanabirasX[i] += rand(0.3, 0.6, "float");
          // ãããè±ã³ããå³ã«ã¯ã¿åºããããªããå·¦ç«¯ã«ç§»åããã
          if (jsHanabirasX[i] + HANABIRA_WIDTH >= windowWidth){
            jsHanabirasX[i] = HANABIRA_WIDTH;
          }
          // é£ç¶ãã¦å³ã¸æºããã ãªãã°ãä»åº¦ã¯å·¦ã¸ç§»åããã
        } else {
          jsHanabirasX[i] -= rand(0.3, 0.6, "float");
          // ãããè±ã³ããå·¦ã«ã¯ã¿åºããããªããå³ç«¯ã«ç§»åããã
          if (jsHanabirasX[i] <= HANABIRA_WIDTH / 2){
            jsHanabirasX[i] = windowWidth - HANABIRA_WIDTH;
          }
        }

        // å³ã¸tremorMaxåãå·¦ã¸tremorMaxåãæºããã ããç´¯ç©åæ°ã0ã«åæå
        // ããã«ãããåã³ãå³ã¸æºãããããã«ãã
        if (tremorCount[i] >= tremorMax[i] * 2){
          tremorCount[i] = 0;
        }

      // è±ã³ããã¦ã£ã³ãã¦ã®ä¸ã¾ã§ããã
      } else {
        // è±ã³ããã¦ã£ã³ãã¦ã®ä¸ã«æ»ããç»é¢å¹åã«è¡¨ç¤ºãã
        jsHanabirasX[i] = rand(0, windowWidth - HANABIRA_WIDTH);
        jsHanabirasY[i] = scroll;
      }

      // è¡¨ç¤ºä½ç½®ã«è½ä¸éåº¦åãè¿½å ãã
      jsHanabirasY[i]               += fallingSpeed[i];

      // è±ã³ãã®ä½ç½®ãè¨­å®ãã
      domHanabiras[i].style.left = `${jsHanabirasX[i]}px`;
      domHanabiras[i].style.top  = `${jsHanabirasY[i]}px`;
      // åä¸æ¹åã¸ã®ç§»ååæ°æ´æ°
      tremorCount[i]++;
    }
  }, 1000 / FPS);
}
)();
