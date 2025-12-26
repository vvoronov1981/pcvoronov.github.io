const button = document.getElementById("button");
function go()
{
const inputValue = document.getElementById('input').value;
localStorage.setItem('savedValue', inputValue);
console.log(inputValue);

}
button.addEventListener("click",go);
