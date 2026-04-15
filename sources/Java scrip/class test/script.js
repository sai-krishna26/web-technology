function validateForm(event) 
{
const nameValue = document.getElementById("inputname4").value;
const usnValue = document.getElementById("inputusn").value;
const mobileValue = document.getElementById("inputphnumber").value;
const emailValue = document.getElementById("inputEmail4").value;
const passwordValue = document.getElementById("inputPassword4").value;
const addressValue = document.getElementById("inputAddress").value;
const agreeChecked = document.getElementById("gridCheck").checked;

console.log("Name:", nameValue);
 console.log("USN:", usnValue);
console.log("Mobile Number:", mobileValue);
console.log("Email:", emailValue);
console.log("Password:", passwordValue);
console.log("Address:", addressValue);
console.log("Agreed:", agreeChecked);

  alert("Entries are correct. Form is submitted!");
}
