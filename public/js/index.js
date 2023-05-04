let createProductbtn = document.querySelector("#createProductbtn");
let orderEditbtn = document.querySelector("#orderEditbtn");
let logoutbtn = document.querySelector("#logOutBtn");

createProductbtn.addEventListener('click', ()=>{
 window.location.href = "/createProduct";
})

orderEditbtn.addEventListener('click', ()=>{
 window.location.href = "/orderEdit.html";
})

logoutbtn.addEventListener('click', ()=>{
 window.location.href = "/logout";
})


