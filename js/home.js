// ======================================
// HOME.JS
// PART 1
// FIREBASE + AUTH + UI
// ======================================


import { auth, db } from "./firebase.js";



import {

onAuthStateChanged,

signOut

}

from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";



import {

ref,

push,

set,

onValue,

remove,

update

}

from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";




// ======================================
// GLOBAL VARIABLES
// ======================================


let currentUser = null;

let allHomework = [];

let chart = null;




// ======================================
// ELEMENTS
// ======================================


const userEmail =
document.getElementById("userEmail");


const toast =
document.getElementById("toast");


const sidebar =
document.getElementById("sidebar");


const menuBtn =
document.getElementById("menuBtn");


const darkBtn =
document.getElementById("darkModeBtn");


const logoutBtn =
document.getElementById("logoutBtn");




// ======================================
// TOAST MESSAGE
// ======================================


function showToast(message){


toast.textContent = message;


toast.style.display="block";



setTimeout(()=>{


toast.style.display="none";


},3000);



}



window.showToast = showToast;





// ======================================
// AUTH CHECK
// ======================================


onAuthStateChanged(auth,(user)=>{


if(!user){


window.location.href="index.html";


return;


}



currentUser=user;


userEmail.textContent=user.email;




// LOAD DATA

loadHomework();

loadExams();

loadProjects();

loadDashboard();



});







// ======================================
// LOGOUT
// ======================================


logoutBtn.addEventListener("click",()=>{


signOut(auth)

.then(()=>{


showToast(
"U shkyçët me sukses!"
);



setTimeout(()=>{


window.location.href="index.html";


},1000);



});



});








// ======================================
// CHANGE SECTION
// ======================================


window.showSection=function(id, btn){


document
.querySelectorAll(".section")
.forEach(section=>{

section.classList.remove("active");

});



document
.getElementById(id)
.classList.add("active");



document
.querySelectorAll("nav button")
.forEach(button=>{

button.classList.remove("active");

});



if(btn){

btn.classList.add("active");

}



}






// ======================================
// DARK MODE
// ======================================



let dark =
localStorage.getItem("darkMode");



if(dark==="true"){


document.body.classList.add("dark");


darkBtn.textContent="☀ Light Mode";


}



darkBtn.addEventListener("click",()=>{


document.body.classList.toggle("dark");



let active =
document.body.classList.contains("dark");



localStorage.setItem(
"darkMode",
active
);



darkBtn.textContent =
active
?
"☀ Light Mode"
:
"🌙 Dark Mode";



});








// ======================================
// MOBILE MENU
// ======================================


menuBtn.addEventListener("click",()=>{


sidebar.classList.toggle("active");


});

// ======================================
// PART 2
// HOMEWORK SYSTEM
// ======================================



const saveHomeworkBtn =
document.getElementById("saveHomeworkBtn");


const homeworkList =
document.getElementById("homeworkList");


const homeworkCount =
document.getElementById("homeworkCount");





// ======================================
// ADD HOMEWORK
// ======================================


saveHomeworkBtn.addEventListener("click",()=>{


if(!currentUser){

showToast(
"Nuk ka përdorues aktiv!"
);

return;

}



let subject =
document
.getElementById("homeworkSubject")
.value
.trim();



let description =
document
.getElementById("homeworkDescription")
.value
.trim();



let date =
document
.getElementById("homeworkDate")
.value;



let priority =
document
.getElementById("homeworkPriority")
.value;




if(
subject==="" ||
description==="" ||
date===""
){


showToast(
"Plotëso të gjitha fushat!"
);


return;


}





let homeworkRef =
ref(
db,
"homework/"
+
currentUser.uid
);




let newHomework =
push(homeworkRef);





set(newHomework,{


subject:subject,


description:description,


date:date,


priority:priority,


status:"Pending",


created:
new Date().toISOString()



})

.then(()=>{


showToast(
"✅ Detyra u shtua!"
);



document
.getElementById("homeworkSubject")
.value="";



document
.getElementById("homeworkDescription")
.value="";



document
.getElementById("homeworkDate")
.value="";



});



});








// ======================================
// LOAD HOMEWORK
// ======================================


function loadHomework(){



if(!currentUser)
return;



const homeworkRef =
ref(
db,
"homework/"
+
currentUser.uid
);





onValue(homeworkRef,(snapshot)=>{


allHomework=[];



snapshot.forEach(child=>{


let data=child.val();


data.id=child.key;


allHomework.push(data);



});




homeworkCount.textContent =
allHomework.length;



displayHomework(allHomework);



});



}










// ======================================
// DISPLAY HOMEWORK
// ======================================


function displayHomework(list){


homeworkList.innerHTML="";



list.forEach(task=>{


let div =
document.createElement("div");



div.className="task";



div.innerHTML=`

<div>


<h3>
📘 ${task.subject}
</h3>



<p>
${task.description}
</p>



<p>
📅 ${task.date}
</p>



<p>
⭐ Prioritet:
${task.priority}
</p>



<p>
${
task.status==="Completed"
?
"🟢 Përfunduar"
:
"🟡 Në pritje"
}

</p>



<p>
⏳ ${getRemainingDays(task.date)}
</p>


</div>



<div>


<button onclick="editHomework('${task.id}')">

✏️

</button>



<button onclick="completeHomework('${task.id}')">

✔

</button>



<button onclick="deleteHomework('${task.id}')">

🗑

</button>



</div>

`;



homeworkList.appendChild(div);



});



}









// ======================================
// COMPLETE HOMEWORK
// ======================================


window.completeHomework=function(id){



update(

ref(

db,

"homework/"
+
currentUser.uid
+
"/"
+
id

),

{


status:"Completed"


}


);



showToast(
"Detyra u përfundua ✔"
);



}









// ======================================
// DELETE HOMEWORK
// ======================================


window.deleteHomework=function(id){



if(
confirm(
"A dëshiron ta fshish detyrën?"
)

){



remove(

ref(

db,

"homework/"
+
currentUser.uid
+
"/"
+
id

)

);



showToast(
"Detyra u fshi!"
);



}



}









// ======================================
// EDIT HOMEWORK
// ======================================


window.editHomework=function(id){



let task =
allHomework.find(
item=>item.id===id
);



if(!task)
return;




let newSubject =
prompt(
"Ndrysho emrin e lëndës:",
task.subject
);



if(!newSubject)
return;




update(

ref(

db,

"homework/"
+
currentUser.uid
+
"/"
+
id

),

{


subject:newSubject


}

);



showToast(
"Detyra u ndryshua ✏️"
);



}









// ======================================
// SEARCH HOMEWORK
// ======================================


document
.getElementById("searchHomework")
.addEventListener("input",(e)=>{


let value =
e.target.value
.toLowerCase();




let result =
allHomework.filter(task=>{


return task.subject
.toLowerCase()
.includes(value);



});



displayHomework(result);



});









// ======================================
// FILTER
// ======================================


document
.getElementById("filterHomework")
.addEventListener("change",(e)=>{


let value =
e.target.value;



if(value==="all"){


displayHomework(allHomework);


}

else{


let result =
allHomework.filter(task=>{


return task.status
.toLowerCase()
===
value;


});



displayHomework(result);


}



});










// ======================================
// SORT
// ======================================


document
.getElementById("sortHomework")
.addEventListener("change",(e)=>{


let value=e.target.value;



let copy =
[...allHomework];




if(value==="newest"){


copy.sort(
(a,b)=>
new Date(b.date)
-
new Date(a.date)

);


}




if(value==="oldest"){


copy.sort(
(a,b)=>
new Date(a.date)
-
new Date(b.date)

);


}





if(value==="priority"){


let order={


High:1,


Medium:2,


Low:3



};



copy.sort(
(a,b)=>
order[a.priority]
-
order[b.priority]

);


}



displayHomework(copy);



});











// ======================================
// COUNTDOWN
// ======================================


function getRemainingDays(date){



let today =
new Date();



let deadline =
new Date(date);



let diff =
deadline-today;



let days =
Math.ceil(
diff /
(1000*60*60*24)
);



if(days<0)

return "❌ Afati ka kaluar";



if(days===0)

return "⚠️ Sot";



return days+
" ditë kanë mbetur";


}
// ======================================
// PART 3
// EXAMS SYSTEM
// ======================================



const saveExamBtn =
document.getElementById("saveExamBtn");



const examList =
document.getElementById("examList");



const examCount =
document.getElementById("examCount");







// ======================================
// ADD EXAM
// ======================================


saveExamBtn.addEventListener("click",()=>{



if(!currentUser){


showToast(
"Nuk ka përdorues aktiv!"
);


return;


}





let subject =
document
.getElementById("examSubject")
.value
.trim();




let description =
document
.getElementById("examDescription")
.value
.trim();




let date =
document
.getElementById("examDate")
.value;







if(
subject==="" ||
description==="" ||
date===""
){


showToast(
"Plotëso të gjitha fushat!"
);


return;


}







let examRef =
ref(
db,
"exams/"
+
currentUser.uid
);






let newExam =
push(examRef);






set(newExam,{


subject:subject,


description:description,


date:date,


status:"Pending",


created:
new Date().toISOString()



})

.then(()=>{


showToast(
"🧪 Provimi u shtua!"
);



document
.getElementById("examSubject")
.value="";



document
.getElementById("examDescription")
.value="";



document
.getElementById("examDate")
.value="";



});



});









// ======================================
// LOAD EXAMS
// ======================================


function loadExams(){



if(!currentUser)
return;




const examRef =
ref(
db,
"exams/"
+
currentUser.uid
);





onValue(examRef,(snapshot)=>{


examList.innerHTML="";



let count=0;




snapshot.forEach(child=>{



count++;



let exam =
child.val();



let id =
child.key;





let div =
document.createElement("div");



div.className="task";





div.innerHTML=`

<div>


<h3>
🧪 ${exam.subject}
</h3>



<p>
${exam.description}
</p>



<p>
📅 ${exam.date}
</p>




<p>
⏳ ${getRemainingDays(exam.date)}
</p>



<p>

${
exam.status==="Completed"
?
"🟢 Përfunduar"
:
"🟡 Në pritje"

}

</p>



</div>




<div>



<button onclick="completeExam('${id}')">

✔

</button>




<button onclick="deleteExam('${id}')">

🗑

</button>




</div>

`;




examList.appendChild(div);



});





examCount.textContent=count;



});



}









// ======================================
// COMPLETE EXAM
// ======================================


window.completeExam=function(id){



update(

ref(

db,

"exams/"
+
currentUser.uid
+
"/"
+
id

),

{


status:"Completed"


}


);



showToast(
"Provimi u përfundua ✔"
);



}









// ======================================
// DELETE EXAM
// ======================================


window.deleteExam=function(id){



if(
confirm(
"A dëshiron ta fshish provimin?"
)

){



remove(

ref(

db,

"exams/"
+
currentUser.uid
+
"/"
+
id

)

);



showToast(
"Provimi u fshi!"
);



}



}
// ======================================
// PART 4
// PROJECTS SYSTEM + DASHBOARD
// ======================================




const saveProjectBtn =
document.getElementById("saveProjectBtn");



const projectList =
document.getElementById("projectList");



const projectCount =
document.getElementById("projectCount");








// ======================================
// ADD PROJECT
// ======================================


saveProjectBtn.addEventListener("click",()=>{



if(!currentUser){


showToast(
"Nuk ka përdorues aktiv!"
);


return;


}





let title =
document
.getElementById("projectTitle")
.value
.trim();




let description =
document
.getElementById("projectDescription")
.value
.trim();




let date =
document
.getElementById("projectDate")
.value;







if(
title==="" ||
description==="" ||
date===""
){


showToast(
"Plotëso të gjitha fushat!"
);


return;


}







let projectRef =
ref(
db,
"projects/"
+
currentUser.uid
);






let newProject =
push(projectRef);







set(newProject,{


title:title,


description:description,


date:date,


status:"Pending",


created:
new Date().toISOString()



})

.then(()=>{


showToast(
"💡 Projekti u shtua!"
);



document
.getElementById("projectTitle")
.value="";



document
.getElementById("projectDescription")
.value="";



document
.getElementById("projectDate")
.value="";



});



});










// ======================================
// LOAD PROJECTS
// ======================================


function loadProjects(){



if(!currentUser)
return;



const projectRef =
ref(
db,
"projects/"
+
currentUser.uid
);






onValue(projectRef,(snapshot)=>{


projectList.innerHTML="";



let count=0;




snapshot.forEach(child=>{


count++;


let project =
child.val();



let id =
child.key;






let div =
document.createElement("div");



div.className="task";







div.innerHTML=`

<div>



<h3>
💡 ${project.title}
</h3>




<p>
${project.description}
</p>




<p>
📅 ${project.date}
</p>




<p>

⏳ ${getRemainingDays(project.date)}

</p>




<p>

${
project.status==="Completed"
?
"🟢 Përfunduar"
:
"🟡 Në pritje"

}

</p>



</div>




<div>



<button onclick="completeProject('${id}')">

✔

</button>




<button onclick="deleteProject('${id}')">

🗑

</button>




</div>


`;





projectList.appendChild(div);



});





projectCount.textContent=count;



});



}










// ======================================
// COMPLETE PROJECT
// ======================================


window.completeProject=function(id){



update(

ref(

db,

"projects/"
+
currentUser.uid
+
"/"
+
id

),

{


status:"Completed"


}


);



showToast(
"Projekti u përfundua ✔"
);



}









// ======================================
// DELETE PROJECT
// ======================================


window.deleteProject=function(id){



if(
confirm(
"A dëshiron ta fshish projektin?"
)

){



remove(

ref(

db,

"projects/"
+
currentUser.uid
+
"/"
+
id

)

);



showToast(
"Projekti u fshi!"
);



}



}









// ======================================
// DASHBOARD
// ======================================




const recentTasks =
document.getElementById("recentTasks");



const upcomingTasks =
document.getElementById("upcomingTasks");



const chartCanvas =
document.getElementById("taskChart");








function loadDashboard(){



if(!currentUser)
return;





let homework=[];




onValue(

ref(

db,

"homework/"
+
currentUser.uid

),

(snapshot)=>{


homework=[];



snapshot.forEach(child=>{


let item=child.val();


item.id=child.key;


homework.push(item);



});




showRecentTasks(homework);



showUpcomingTasks(homework);



createChart();



});



}










// ======================================
// RECENT TASKS
// ======================================


function showRecentTasks(list){



recentTasks.innerHTML="";



let last =
list.slice(-5).reverse();





last.forEach(task=>{



let div =
document.createElement("div");



div.className="task";



div.innerHTML=`

<b>
📘 ${task.subject}
</b>

<br>

📅 ${task.date}


`;



recentTasks.appendChild(div);



});



}









// ======================================
// UPCOMING TASKS
// ======================================


function showUpcomingTasks(list){



upcomingTasks.innerHTML="";



let today =
new Date();




let result =
list
.filter(task=>{


return new Date(task.date)>=today;


})

.sort(
(a,b)=>
new Date(a.date)
-
new Date(b.date)

)
.slice(0,5);







result.forEach(task=>{



let div =
document.createElement("div");



div.className="task";



div.innerHTML=`

<b>
${task.subject}
</b>

<br>

📅 ${task.date}

<br>

⏳ ${getRemainingDays(task.date)}

`;



upcomingTasks.appendChild(div);



});



}









// ======================================
// CHART
// ======================================


function createChart(){



if(!chartCanvas)
return;





let homework =
document.getElementById("homeworkCount").textContent;



let exams =
document.getElementById("examCount").textContent;



let projects =
document.getElementById("projectCount").textContent;







if(chart){

chart.destroy();

}






chart =
new Chart(chartCanvas,{

type:"doughnut",



data:{


labels:[

"Detyra",

"Provime",

"Projekte"

],



datasets:[{

data:[

homework,

exams,

projects

]

}]


},



options:{


responsive:true


}



});



}

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeMenu = document.getElementById("closeMenu");


menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
});


closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("active");
});
