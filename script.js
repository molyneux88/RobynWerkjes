// ----------------------
// Global variables
// ----------------------
let answers = [];
let activeInput = null;
let stars = parseInt(localStorage.getItem("mathStars") || 0);
let autoCheck = localStorage.getItem("autoCheck") === "true";

const mascotData = [
  {emoji:"🦊", name:"Fox", stars:0},
  {emoji:"🐶", name:"Dog", stars:10},
  {emoji:"🐱", name:"Cat", stars:25},
  {emoji:"🦄", name:"Unicorn", stars:50},
  {emoji:"🦖", name:"Dinosaur", stars:100}
];

// ----------------------
// Initialization
// ----------------------
function init() {

  document.getElementById("autoCheck").checked = autoCheck;
  updateCheckButton();

  // Buttons
  document.querySelector(".primary-button").addEventListener("click", checkAnswers);
  document.querySelector(".secondary-button").addEventListener("click", generate);
  document.querySelector(".options-button").addEventListener("click", toggleOptions);
  document.querySelector(".reset-stars").addEventListener("click", resetStars);

  // Auto-check toggle
  document.getElementById("autoCheck").addEventListener("change", updateCheckButton);

  // Mascot select
  document.getElementById("mascotSelect").addEventListener("change", function(){
    const mascot = this.value;
    document.getElementById("mascot").innerText = mascot;
    localStorage.setItem("mathMascot", mascot);
  });

  // Set star count
  document.getElementById("starCount").innerText = stars;

  updateUnlocks();
  updateMascotList();
  generate(); // Generate 10 questions on load

  // Click outside input to hide keypad
  document.addEventListener("click", function(e){
    const keypad = document.getElementById("keypad");
    const isInput = e.target.tagName === "INPUT";
    const insideKeypad = keypad.contains(e.target);
    if(!isInput && !insideKeypad){
      hideKeypad();
    }
  });

  // Keypad button listeners
  document.querySelectorAll("#keypad button").forEach(btn => {
    btn.addEventListener("click", function(){
      const key = btn.dataset.key;
      if(key === "del") deleteKey();
      else if(key === "hide") hideKeypad();
      else pressKey(parseInt(key));
    });
  });
}

// ----------------------
// Utility
// ----------------------
function rand(max){ return Math.floor(Math.random()*max)+1; }

function toggleOptions(){
  document.getElementById("optionsMenu").classList.toggle("hidden");
}

// ----------------------
// Generate questions
// ----------------------
function generate(){
  document.getElementById("mascotMessage").innerText = "Let's do some math!";
  const savedMascot = document.getElementById("mascotSelect").value || "🦊";
  document.getElementById("mascot").innerText = savedMascot;

  answers = [];

  const ops = [];
  if(add.checked) ops.push("+");
  if(sub.checked) ops.push("-");
  if(mul.checked) ops.push("*");
  if(div.checked) ops.push("/");

  const tables = [...document.querySelectorAll(".table:checked")].map(x => parseInt(x.value));
  const qDiv = document.getElementById("questions");
  qDiv.innerHTML = "";

  for(let i=0;i<10;i++){
    const op = ops[Math.floor(Math.random()*ops.length)];
    let a = rand(10);
    let b = tables[Math.floor(Math.random()*tables.length)];
    let text="", ans=0;
    if(op=="+"){ text=`${a} + ${b}`; ans=a+b; }
    if(op=="-"){ text=`${a+b} - ${b}`; ans=a; }
    if(op=="*"){ text=`${a} × ${b}`; ans=a*b; }
    if(op=="/"){ text=`${a*b} ÷ ${b}`; ans=a; }
    answers.push(ans);

    qDiv.innerHTML += `
      <div class="question-row">
        <div class="q-number">${i+1}</div>
        <div class="q-text">${text} =</div>
        <div class="answer-area">
          <input type="text" id="q${i}" readonly>
          <span class="result-icon" id="r${i}"></span>
        </div>
      </div>
    `;
  }

  // Add click listeners to inputs
  for(let i=0;i<10;i++){
    document.getElementById("q"+i).addEventListener("click", function(){
      setActive(this);
    });
  }

  document.getElementById("result").innerText="";
}

// ----------------------
// Answer handling
// ----------------------
function checkAnswers(){
  let score=0;
  for(let i=0;i<answers.length;i++){
    const input=document.getElementById("q"+i);
    if(input.value==="") continue;
    const val=parseInt(input.value);
    const r=document.getElementById("r"+i);
    if(val===answers[i]){
      r.innerHTML=`<span class="star">⭐</span>`;
      score++;
    } else {
      r.innerHTML="❌";
    }
  }
  stars += score;
  localStorage.setItem("mathStars", stars);
  document.getElementById("starCount").innerText = stars;
  updateUnlocks();
  updateMascot(score);
  document.getElementById("result").innerText = score===10?"🎉 PERFECT SCORE 🎉":`Score: ${score}/10`;
}

// ----------------------
// Keypad functions
// ----------------------
function setActive(input){
  activeInput=input;
  document.getElementById("keypad").classList.add("show");
  document.body.classList.add("keypad-open");
  input.scrollIntoView({behavior:"smooth", block:"center"});
}

function pressKey(num){
  if(!activeInput) return;
  let id = activeInput.id.replace("q","");
  let correct = answers[id];
  if(activeInput.value.length >= correct.toString().length) return;
  activeInput.value += num;
  if(autoCheck && parseInt(activeInput.value)===correct){
    checkSingle(activeInput);
  }
}

function deleteKey(){
  if(!activeInput) return;
  activeInput.value = activeInput.value.slice(0,-1);
}

function hideKeypad(){
  document.getElementById("keypad").classList.remove("show");
  document.body.classList.remove("keypad-open");
  if(activeInput) activeInput.blur();
  activeInput=null;
}

function updateCheckButton(){
  autoCheck = document.getElementById("autoCheck").checked;
  localStorage.setItem("autoCheck", autoCheck);
  const btn=document.querySelector(".primary-button");
  btn.style.display = autoCheck?"none":"block";
}

function checkSingle(input){
  let id = input.id.replace("q","");
  let resultIcon = document.getElementById("r"+id);  // declare first!
  let correct = answers[id];
  let value = parseInt(input.value);

  if(value === correct){
    resultIcon.innerHTML = `<span class="star">⭐</span>`;
    stars++;
    localStorage.setItem("mathStars", stars);
    document.getElementById("starCount").innerText = stars;
    updateUnlocks();
  } else {
    resultIcon.innerHTML = "❌";
  }
}

// ----------------------
// Mascot & stars
// ----------------------
function updateMascot(score){
  const mascot=document.getElementById("mascot");
  const message=document.getElementById("mascotMessage");
  if(score===10){ mascot.innerText="🤩"; message.innerText="Amazing!!"; mascot.classList.add("happy"); }
  else if(score>=7){ mascot.innerText="🙂"; message.innerText="Great job!"; }
  else if(score>=4){ mascot.innerText="😐"; message.innerText="Good try!"; }
  else { mascot.innerText="🤔"; message.innerText="Let's try again!"; }
  setTimeout(()=>{mascot.classList.remove("happy");},800);
}

function updateUnlocks(){
  let animals=[];
  if(stars>=10) animals.push("🐶");
  if(stars>=25) animals.push("🐱");
  if(stars>=50) animals.push("🦄");
  if(stars>=100) animals.push("🦖");
  document.getElementById("unlockArea").innerText=animals.join(" ");
}

function resetStars(){
  stars=0;
  localStorage.setItem("mathStars",0);
  document.getElementById("starCount").innerText=0;
  updateUnlocks();
  updateMascotList();
}

function updateMascotList(){
  const select=document.getElementById("mascotSelect");
  select.innerHTML="";
  mascotData.forEach(m=>{
    const option=document.createElement("option");
    option.value=m.emoji;
    if(stars<m.stars){
      option.textContent=`${m.name} 🔒 (${m.stars}⭐)`;
      option.disabled=true;
    } else option.textContent=m.name;
    select.appendChild(option);
  });
}

// ----------------------
// Start app
// ----------------------
document.addEventListener("DOMContentLoaded", init);