let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];
let label = document.getElementById("label");
let shoppingCart = document.getElementById("shopping-cart");

const dbName = "the_products";
let store;
const request = indexedDB.open(dbName, 2);

request.onerror = (event) => {
  // Handling errors.
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  const objectStore = db.createObjectStore("alldata", { keyPath: "id" });

  objectStore.transaction.oncomplete = (event) => {
    let customerObjectStore = db
      .transaction("alldata", "readwrite")
      .objectStore("alldata");
    shopItemsData.forEach((shopItem) => {
      customerObjectStore.add(shopItem);
    });
  };
};

let generateShop = () => {
  request.onsuccess = (event) => {
    const db = event.target.result;
    const customerObjectStore = db
      .transaction("alldata", "readwrite")
      .objectStore("alldata");
    customerObjectStore.oncomplete = (ev) => {
      //transaction for reading all objexts
    };

    let getReq = customerObjectStore.getAll();
    getReq.onsuccess = (e) => {
      let newRequest = e.target;
      return (shop.innerHTML = newRequest.result
        .map((x) => {
          let { id, name, price, desc, img } = x;
          let search = basket.find((x) => x.id === id) || [];
          return `  <div id= product-id-${id} class="item">
                        <img id="img" width="100%" src="${img}" alt="" />
                        <div class="details1">
                       	 <h3>${name}</h3>
                         <p>In Stock: ${desc}</p>
                      		<div class="price-quantity">
                         	  <h2>$ ${price}</h2>
                       			<div class="buttons">
                          		  <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                          		  <div id=${id} class="quantity">${
            search.item === undefined ? 0 : search.item
          }</div>
                         		  <i onclick="increment(${id},${desc})" class="bi bi-plus-lg"></i>
                        		</div>
                      		</div>
                     	</div>
                    </div>`;
        })
        .join(""));

      // console.log(newRequest.result);
    };
    getReq.onerror = (e) => {
      console.log("error");
    };
  };
};
generateShop();
let generateCartItems = () => {
  document.getElementById("popup").classList.toggle("active");
  TotalAmount();
  if (basket.length !== 0) {
    return (shoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return `
        <div class="cart-item">
         <img  width="100" src=${search.img} alt="" />
        	<div class="details2">
           		<div class="title-price-x">
             	  <h4 class="title-price">
               		<p>${search.name}</p>
               		<p class="cart-item-price">$ ${search.price}</p>
            	  </h4>
        
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

let increment = (id, desc) => {
  

  let selectedItem = id;
  console.log(selectedItem);
  let search = basket.find((x) => x.id === selectedItem.id);
  // console.log(search);
  if (search === undefined && desc == 0) {
    window.alert("Sorry..!!! No more stock available");
  } else if (search === undefined && desc != 0) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
    search = {
      item: 0,
    };
  } else if (search.item < desc) {
    search.item += 1;
  } else {
    search.item = desc;
    window.alert("Sorry..!!! No more stock available");
  }

  if (search.item <= desc) {
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
  } else {
    window.alert("Sorry..!!! Stock is over");
  }
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

  localStorage.setItem("data", JSON.stringify(basket));
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  let count = search.item;
  document.getElementById(id).innerHTML = count;

  calculation();
  TotalAmount();
};
let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};

let checkout = () => {
  window.location.href = "checkout.html";
};
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");

  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();
document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.toggle("active");
  });
