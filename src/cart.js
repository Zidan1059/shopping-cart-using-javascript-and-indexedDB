let label = document.getElementById("label");
let shoppingCart = document.getElementById("shopping-cart");
let basket = JSON.parse(localStorage.getItem("data")) || [];
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");

  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();
const dbName = "the_products";
let store;
const request = indexedDB.open(dbName, 2);
const newRequest = indexedDB.open("alldata", 2);

request.onerror = (event) => {
  // Handle errors.
};
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  const objectStore = db.createObjectStore("alldata", { keyPath: "id" });

  objectStore.transaction.oncomplete = (event) => {
    const customerObjectStore = db
      .transaction("alldata", "readwrite")
      .objectStore("alldata");
    shopItemsData.forEach((shopItem) => {
      customerObjectStore.add(shopItem);
    });
  };
};

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (shoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
        <div class="cart-item">
            <img  width="100" src=${search.img} alt="" />
            <div class="details">
                <div class="title-price-x">
                    <h4 class="title-price">
                      <p>${search.name}</p>
                      <p class="cart-item-price">$ ${search.price}</p>
                    </h4>
                 <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                </div>
                <div id=${id} class="quantity">Quantity: ${item}</div>
                <h3>$ ${item * search.price}</h3>
            </div>       
        </div> 
        `;
      })
      .join(""));
  } else {
    shoppingCart.innerHTML = ``;
    label.innerHTML = `<h2>Cart is Empty</h2>
    <a href = "index.html">
    <button class = "HomeBtn"> Back to home </button></a>`;
  }
};
generateCartItems();
let increment = (id) => {
  let selectedItem = id;

  let search = basket.find((x) => x.id === selectedItem.id);
  console.log("search", search);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  generateCartItems();
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);
  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);

  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();

  localStorage.setItem("data", JSON.stringify(basket));
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  let count = search.item;

  document.getElementById(id).innerHTML = count;

  calculation();
  TotalAmount();
};
let removeItem = (id) => {
  let selectedItem = id;

  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  TotalAmount();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};
let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];

        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    label.innerHTML = `
      <h2>Total Bill : $ ${amount}</h2>
      <button onclick="checkout()" class="checkout">Checkout</button>
      <button onclick="clearCart()" class="removeAll">Clear Cart</button>
      `;
  } else return;
};
TotalAmount();
let shopData = [];

let checkout = () => {
  window.location.href = "checkout.html";
};
// window.location.href = "checkout.html";
// window.localStorage.clear();
