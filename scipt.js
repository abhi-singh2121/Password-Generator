const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const cpyBtn =document.querySelector("[data-copy]");
const cpyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolCheck= document.querySelector("#symbol");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateBtn");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";       //starting koi value nhi (self)
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle color grey
setIndicator("#ccc");


//set passwordlength
function handleSlider(){                        // handleSlider password length koUI par reflect karwata hai
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // for jitna select hai utne me hi color rahe
    const  min= inputSlider.min;
    const  max= inputSlider.max;
    inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor= color;
    indicator.style.boxshadow=`0px 0px 12px 1px $(color)`; 
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,122));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
        let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;
        if (uppercaseCheck.checked) hasUpper = true;
        if (lowercaseCheck.checked) hasLower = true;
        if (numbersCheck.checked) hasNum = true;
        if (symbolCheck.checked) hasSym = true;
      
        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
          setIndicator("#0f0");
        } else if (
          (hasLower || hasUpper) &&
          (hasNum || hasSym) &&
          passwordLength >= 6
        ) {
          setIndicator("#ff0");
        } else {
          setIndicator("#f00");
        }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    cpyMsg.innerText="copied";
  } 
  catch(e){
    cpyMsg.innerText="Failed";

  }

  //to make copy msg visible
  cpyMsg.classList.add("active");

  //to invisible the text
  setTimeout(() =>{
    cpyMsg.classList.remove("active");
  },2000);
}

function shufflePassword(array){
  //Fisher yates method an algo for shuffling
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach( (checkbox)=>{
    if(checkbox.checked)
      checkCount++;
  });

  //special condition
  if(passwordLength< checkCount){
    passwordLength=checkCount;
    handleSlider(); //it is bec. to change in UI also
  }
}

allCheckBox.forEach( (checkbox) =>{
  checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input' , (e) =>{
  passwordLength= e.target.value;
  handleSlider();
})

cpyBtn.addEventListener('click', ()=>{
  if(passwordDisplay.value)     //password empty nhi hai to copy
  copyContent();
})

generateBtn.addEventListener ('click', ()=>{
  //if none of the checkbox selected
  if (checkCount == 0) 
    return;    //no password generated
  // password-length should be >= selected no. of checkbox
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let start the journey to find the new password 
  console.log("starting the journey");
  //remove old password 
  password="";

  // lets puts the stuff mention by the checkboxes
  // if(uppercaseCheck.checked){
  //   password+= generateUppercase();
  // }
  // if(lowercaseCheck.checked){
  //   password+= generateLowercase();
  // }
  // if(numberCheck.checked){
  //   password+= generateRandomNumber();
  // }
  // if(symbolCheck.checked){
  //   password+= generateSymbol();
  // }

  // add selected checkbox functions to an array
  let funcArr = [];  //starting me empty
  if (uppercaseCheck.checked) funcArr.push(generateUppercase);
  if (lowercaseCheck.checked) funcArr.push(generateLowercase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolCheck.checked) funcArr.push(generateSymbol);

   //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("compulsory addition done");
  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndx = getRndInteger(0, funcArr.length);
    password += funcArr[randIndx]();
  }
  console.log("remaining addition done");
  //shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("shuffling done");
  passwordDisplay.value = password;   //show in UI
  console.log("UI addition done");
  calcStrength();

})