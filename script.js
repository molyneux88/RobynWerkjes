let answers=[];

function rand(max){
return Math.floor(Math.random()*max)+1;
}

function generate(){

answers=[];

const ops=[];
if(add.checked) ops.push("+");
if(sub.checked) ops.push("-");
if(mul.checked) ops.push("*");
if(div.checked) ops.push("/");

const tables=[...document.querySelectorAll(".table:checked")].map(x=>parseInt(x.value));

const qDiv=document.getElementById("questions");
qDiv.innerHTML="";

for(let i=0;i<10;i++){

const op=ops[Math.floor(Math.random()*ops.length)];

let a=rand(10);
let b=tables[Math.floor(Math.random()*tables.length)];

let text="";
let ans=0;

if(op=="+"){text=`${a} + ${b}`; ans=a+b;}
if(op=="-"){text=`${a+b} - ${b}`; ans=a;}
if(op=="*"){text=`${a} × ${b}`; ans=a*b;}
if(op=="/"){text=`${a*b} ÷ ${b}`; ans=a;}

answers.push(ans);

qDiv.innerHTML+=`
<div class="question">
${i+1}. ${text} =
<input type="number" id="q${i}">
<span id="r${i}"></span>
</div>
`;
}

result.innerText="";
}

function checkAnswers(){

let score=0;

for(let i=0;i<answers.length;i++){

const val=parseInt(document.getElementById("q"+i).value);
const r=document.getElementById("r"+i);

if(val===answers[i]){
r.innerHTML=" ✅";
r.className="correct";
score++;
}else{
r.innerHTML=" ❌";
r.className="wrong";
}

}

if(score===10){
result.innerText="🎉 PERFECT SCORE 🎉";
}else{
result.innerText="Score: "+score+"/10";
}

}