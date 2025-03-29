const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const paintingCards = document.getElementById("painting-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
//const itemName = document.getElementById("item_name");
//const itemAmount = document.getElementById("amount");
let isCartShowing = false;

const products = [];

//const fetch = require('node-fetch');

async function getRepoContents(user, repo, token, path = '') {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${token}` // Используем токен
        }
    });

    if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map(item => item.name); // Список имен файлов и папок
}

const user = 'PC-Voronov';  // Замените на имя пользователя или организацию
const repo = 'Images';  // Замените на имя репозитория
const token = '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';  // Ваш личный токен доступа
const path = 'images';  // Укажите путь внутри репозитория (оставьте пустым для корневой директории)

let imagesFiles=[];
getRepoContents(user, repo, token, path)
    .then(files => {console.log('Список файлов:', files); imagesFiles=files;
// Фильтруем только изображения
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
const filteredImages = imagesFiles.filter(file => {
    const extension = file.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
});

console.log('Только изображения:', filteredImages);
let count=0;
let num=1;
let result={};
function parseString(input) {
    // Убираем начальную часть пути "images/"
    let parts = input.replace("images/", "").split("_");

    // Переменные
    let part1 = parts[0]; // "ee"
    let part2 = parts[1]; // "10"
    let part3 = parts[2]; // "rr"
    let part4 = parts.slice(3).join("_"); // "n.tmp"

    // Результат
    return { part1, part2, part3, part4 };
}
async function fetchAndDisplayImage(fname) {
const url = "https://api.github.com/repos/PC-Voronov/Images/contents/images/"+fname;
        const token = "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"; // Ваш токен для аутентификации;

        try {
          const response = await fetch(url, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/vnd.github.v3.raw"
            }
          });

          if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
          }
	  //else 
	  //{
          //  console.log("Данные загружены");	
          const blob = await response.blob(); // Читаем ответ как Blob
	  count++;
	  console.log("Данные загружены|"+blob);
	  result = parseString(fname);	
 	  products.push({id:num,name:result.part1,price:result.part2,category:result.part3,im:blob});
          num++;	         
	  console.log(products);
          if (count===filteredImages.length) 
	  {
            console.log("alles");
	    //основной код
products.forEach(
  ({ name, id, price, category }) => {
    console.log("Зашли");
    paintingCards.innerHTML += `
      <div class="painting-card">
        <h2>${name}</h2>
	<img src="${URL.createObjectURL(blob)}"/>
        <p class="painting-price">$${price}</p>
        <p class="product-category">Category: ${category}</p>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Add to cart
        </button>
      </div>
    `;
  }
);

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, price } = product;
    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((painting) => {
      totalCountPerProduct[painting.id] = (totalCountPerProduct[painting.id] || 0) + 1;
    })

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);

    currentProductCount > 1 
      ? currentProductCountSpan.textContent = `${currentProductCount}x`
      : productsContainer.innerHTML += `
      <div id="painting${id}" class="product">
        <p>
          <span class="product-count" id="product-count-for-id${id}"></span>${name}
        </p>
        <p>$${price}</p>
      </div>
      `;
  }

  getCounts() {
    return this.items.length;
  }

  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  calculateTotal() {
    console.log(this.items);
    const subTotal = parseFloat(this.items.reduce((total, item) => {return total + item.price}, ''));
    console.log(subTotal);	
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    cartSubTotal.textContent = "$"+ `${subTotal.toFixed(2)}`;
    cartTaxes.textContent = "$"+`${tax.toFixed(2)}`;
    cartTotal.textContent = "$"+`${this.total.toFixed(2)}`;
  //  itemName.value = "Products";
  //  itemAmount.value = `${parseFloat(this.total.toFixed(2))}`;		
    return this.total;
  }
};

const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach(
  (btn) => {
    btn.addEventListener("click", (event) => {
      cart.addItem(Number(event.target.id), products);
      totalNumberOfItems.textContent = cart.getCounts();
      cart.calculateTotal();
    })
  }
);

cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});
clearCartBtn.addEventListener("click",cart.clearCart.bind(cart));
//окончание основного кода
	  
          }	
          // Создаем URL для отображения изображения
          //const imageURL = URL.createObjectURL(blob);
          //const img = document.createElement("img");
          //img.src = imageURL;
          //img.alt = "Изображение из GitHub";
          //document.body.appendChild(img);

        } catch (error) {
          console.error("Ошибка:", error.message);
        }
      }

     // document.addEventListener("DOMContentLoaded", fetchAndDisplayImage);

filteredImages.forEach(file=>
{console.log("g");
fetchAndDisplayImage(file);
console.log("g+")});

//do {} while (count<filteredImages.length);
    console.log("Основной код");
//};
console.log("Выполняем с");
//cr();
})
    .catch(err => console.error(err));

//imagesFiles.filter(file => 



