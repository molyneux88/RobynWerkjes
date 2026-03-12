// ----------------------
// Global variables
// ----------------------
let answers = [];

let activeInput = null;

let stars = parseInt(localStorage.getItem("mathStars") || 0);

const mascotData = [
  {emoji:"🦊", name:"Fox", stars:0},
  {emoji:"🐶", name:"Dog", stars:10},
  {emoji:"🐱", name:"Cat", stars:25},
  {emoji:"🦄", name:"Unicorn", stars:50},
  {emoji:"🦖", name:"Dinosaur", stars:100}
];

let autoCheck = localStorage.getItem("autoCheck") === "true";

// ----------------------
// Initialization
// ----------------------
function init() {

  document.getElementById("autoCheck").checked = autoCheck;
  updateCheckButton();

  document.getElementById("autoCheck").addEventListener("change", updateCheckButton);

  // Set star count
  document.getElementById("starCount").innerText = stars;

  // Load mascot
  let savedMascot = localStorage.getItem("mathMascot") || "🦊";
  document.getElementById("mascot").innerText = savedMascot;

  updateUnlocks();
  updateMascotList();

  generate(); // Generate 10 questions on load

  // Mascot selection listener
  document.getElementById("mascotSelect").addEventListener("change", function(){
    const mascot = this.value;
    document.getElementById("mascot").innerText = mascot;
    localStorage.setItem("mathMascot", mascot);
  });
}

// ----------------------
// Utility functions
// ----------------------
function rand(max) {
  return Math.floor(Math.random()*max)+1;
}

function toggleOptions() {
  document.getElementById("optionsMenu").classList.toggle("hidden");
}

// ----------------------
// Question generation
// ----------------------
function generate() {
  // Reset message
  document.getElementById("mascotMessage").innerText = "Let's do some math!";

  // Restore currently selected mascot
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

  for (let i = 0; i < 10; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)];

    let a = rand(10);
    let b = tables[Math.floor(Math.random() * tables.length)];

    let text = "";
    let ans = 0;

    if (op === "+") { text = `${a} + ${b}`; ans = a + b; }
    if (op === "-") { text = `${a + b} - ${b}`; ans = a; }
    if (op === "*") { text = `${a} × ${b}`; ans = a * b; }
    if (op === "/") { text = `${a * b} ÷ ${b}`; ans = a; }

    answers.push(ans);

    qDiv.innerHTML += `
      <div class="question-row">
        <div class="q-number">${i + 1}</div>
        <div class="q-text">${text} =</div>
        <div class="answer-area">
          <input type="text" id="q${i}" onclick="setActive(this)" readonly>
          <span class="result-icon" id="r${i}"></span>
        </div>
      </div>
    `;
  }

  result.innerText = "";
}

// ----------------------
// Answer checking
// ----------------------
function checkAnswers() {
  let score=0;

  for(let i=0;i<answers.length;i++){
    const val=parseInt(document.getElementById("q"+i).value);
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

  if(score===10){
    result.innerText="🎉 PERFECT SCORE 🎉";
    confetti();
  } else {
    result.innerText=`Score: ${score}/10`;
  }
}

// ----------------------
// Confetti animation
// ----------------------
function confetti() {
  for(let i=0;i<120;i++){
    let conf=document.createElement("div");
    conf.style.position="fixed";
    conf.style.width="8px";
    conf.style.height="8px";
    conf.style.background=`hsl(${Math.random()*360},80%,60%)`;
    conf.style.left=Math.random()*100+"vw";
    conf.style.top="-10px";
    conf.style.opacity="0.8";
    conf.style.zIndex="999";
    document.body.appendChild(conf);

    let fall=5+Math.random()*3;
    conf.animate([
      {transform:"translateY(0) rotate(0)"},
      {transform:`translateY(100vh) rotate(${Math.random()*720}deg)`}
    ],{ duration:fall*1000, iterations:1 });

    setTimeout(()=>conf.remove(),fall*1000);
  }
}

// ----------------------
// Mascot & rewards
// ----------------------
function updateMascot(score) {
  const mascot=document.getElementById("mascot");
  const message=document.getElementById("mascotMessage");

  if(score===10){
    mascot.innerText="🤩";
    message.innerText="Amazing!!";
    mascot.classList.add("happy");
  } else if(score>=7){
    mascot.innerText="🙂";
    message.innerText="Great job!";
  } else if(score>=4){
    mascot.innerText="😐";
    message.innerText="Good try!";
  } else {
    mascot.innerText="🤔";
    message.innerText="Let's try again!";
  }

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
  stars = 0;
  localStorage.setItem("mathStars", 0);
  document.getElementById("starCount").innerText = 0;
  updateUnlocks();
  updateMascotList();
}

function updateMascotList(){
  const select = document.getElementById("mascotSelect");
  select.innerHTML="";

  mascotData.forEach(m => {
    const option = document.createElement("option");
    option.value = m.emoji;
    if(stars < m.stars){
      option.textContent = `${m.name} 🔒 (${m.stars}⭐)`;
      option.disabled = true;
    } else {
      option.textContent = m.name;
    }
    select.appendChild(option);
  });
}

function setActive(input){

activeInput = input;

document.getElementById("keypad").classList.remove("hidden");

}

function pressKey(num){

if(!activeInput) return;

activeInput.value += num;

if(autoCheck){
checkSingle(activeInput);
}

}

function deleteKey(){

if(!activeInput) return;

activeInput.value = activeInput.value.slice(0,-1);

}

function hideKeypad(){

document.getElementById("keypad").classList.add("hidden");

activeInput = null;

}

function updateCheckButton(){

autoCheck = document.getElementById("autoCheck").checked;

localStorage.setItem("autoCheck", autoCheck);

const btn = document.querySelector(".primary-button");

if(autoCheck){
btn.style.display = "none";
}else{
btn.style.display = "block";
}

}

function checkSingle(input){

if(resultIcon.innerHTML.includes("⭐")) return; 

let id = input.id.replace("q","");
let correct = answers[id];

let value = parseInt(input.value);

let resultIcon = document.getElementById("r"+id);

if(value === correct){

resultIcon.innerHTML = `<span class="star">⭐</span>`;

stars++;
localStorage.setItem("mathStars", stars);
document.getElementById("starCount").innerText = stars;

updateUnlocks();

}else{

resultIcon.innerHTML = "❌";

}

}

// ----------------------
// Start everything after DOM loaded
// ----------------------
document.addEventListener("DOMContentLoaded", init);