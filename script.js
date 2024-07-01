const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passWordDisplay=document.querySelector("[data-password-display]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copy-msg]");

const upppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initial condition
let password="";    
let passwordLength=10;
let checkCount=0;
handelSlide();
// set strength circle color to grey
setIndicator("#ccc");




// set password length on display
function handelSlide(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    if(passwordLength==1){
        inputSlider.style.backgroundSize="5%" + "100%"
    }
    else{
        inputSlider.style.backgroundSize=( (passwordLength-min)*100/(max-min)) + "100%";
    }
      //############ imp
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow add
    indicator.style.boxShadow= `1px 2px 12px 1px ${color}`;
}

function getRandomInteger(max,min){
   return  Math.floor(Math.random()*(max-min))+min
}

function generateRandomNumber(){

    return getRandomInteger(0,9);
}

function generateLowerCase(){

    return String.fromCharCode(getRandomInteger(97,123)) ;   //integer to char
}

function generateUpperCase(){

    return String.fromCharCode(getRandomInteger(65,91)) ;
}

function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);   // access char from a string
    
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
      setIndicator("#ff0");
    } 
    else {
      setIndicator("#f00"); 
    }
}

async function copyContent(){   
    try{
        await navigator.clipboard.writeText(passWordDisplay.value); // return promise
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //css property visible korbo copymsg er  ###
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e)=>{ // here input=slider age pi6e kora
    passwordLength=e.target.value;
    handelSlide();
})   

copyBtn.addEventListener('click',()=>{
    if(passWordDisplay.value){  // password jdi thake tobei run hbe
        copyContent();
    }
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handelSlide();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

function sufflePassword(arr){   //imp ########
    //Fisher Yates methods
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    let str="";
    arr.forEach((el)=>(str+=el)); // convert array to string
    
    return str;
}
generateBtn.addEventListener('click',()=>{     //imp for interview ###########################
    // none of the check box are selected
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handelSlide();
    }
    //main concept
    //1. remove old password
    password="";
    //2. put the stufs mentioned by check box
    // if(upppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
    if(upppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    } 
    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    //suffle the passwprd
    password=sufflePassword(Array.from(password));  // convert string to array

    //show in UI
    passWordDisplay.value=password;
    //cal strength
    calStrength();
})
