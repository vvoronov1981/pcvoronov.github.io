const arr=[];
const arr1=[];

function c(fileContent, fileName)
{ 
console.log('Зашли!');
console.log(fileContent);
console.log(fileName);

const uploadToGitHub = async (fileContent, fileName) => 
{
console.log('Зашли d uploadhub!');
  const url = 'https://api.github.com/repos/PC-Voronov/Images/contents/' + fileName;

//let encodedContent='';
//const img = document.getElementById("image");

//const canvas = document.createElement("canvas");
//canvas.width = 150;//img.width;
//canvas.height = 150;//img.height;

//const ctx = canvas.getContext("2d");
//ctx.drawImage(img, 0, 0);

//canvas.toBlob((blob) => {
//  blob.arrayBuffer()
//  .then((buf) => {
  // тут как-то отправить эту буффонаду через WebSocket
  // Кодирование файла в Base64
  const  encodedContent = btoa(
    new TextEncoder().encode(localStorage.getItem('myImage')).reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '')
  );
  //return encodedContent;  
  //})
  //.catch(console.error)
  //;

//}, "image/png");

console.log('Do 1!');
const data = {
    message: 'Добавление файла через API',
    content: encodedContent, // Кодированный файл
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': 'token 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',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
console.log('Do 2!');

  if (response.ok) {
    console.log('Файл успешно записан!');
  } else {
    const error = await response.json();
    console.error('Ошибка:', error);
  }
}
uploadToGitHub(fileContent, fileName);
};

function save (file)  {
        let f = file;//1.files[0];
        if (f) {
            //image1.src = URL.createObjectURL(f);
            localStorage.setItem('myImage', f);//URL.createObjectURL(f));//image1.src);
        }
    }
    
    
function loadFiles(e) {  
    const files = e.target.files;   // получаем все выбранные файлы  
    let output = "";
    for (let i = 0; i < files.length; i++) {        // Перебираем все выбранные файлы   
        const file = files[i];      // Получаем файл 
        console.log(file);
        output += "<li><p><strong>" + file.name + "</strong></p>";
        output += "<p>Type: " + file.type || "n/a</p>";
        output += "<p>Size: " + file.size + " bytes</p>";   
        output += "<p>Changed on: " +  file.lastModifiedDate.toLocaleDateString() + "</p>";
	output += '<p><img id="image"/></p></li>'		  
    	save(file);
        arr.push(file.name);
	arr1.push(file);
    } 
    document.getElementById("list").innerHTML = "<ul>" + output + "</ul>";

    document.getElementById("image").src = localStorage.getItem('myImage')
    c('test', arr[0]);
}
document.getElementById("files").addEventListener("change", loadFiles);
// Пример использования
//document.getElementById("upload").addEventListener("onclick", c(arr1[0], arr[0]));
