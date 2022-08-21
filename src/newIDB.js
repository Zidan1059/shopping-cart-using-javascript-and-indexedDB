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
let shopData = [];
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
    shopData = [...newRequest.result];
    console.log("shopData", shopData);
  };
  getReq.onerror = (e) => {
    console.log("error");
  };
};

//old code
// db.productList.toArray((r) => {
//   shopData = [...r];
//   console.log("Array", shopData);

//   return (shop.innerHTML = shopData
//     .map((x) => {
//       let { id, name, price, desc, img } = x;
//       let search = basket.find((x) => x.id === id) || [];
//       return ` <div id= product-id-${id}
//       class="item">
//     <img id="img" width="100%" src="${img}" alt="" />
//     <div class="details1">
//       <h3>${name}</h3>
//       <p>In Stock: ${desc}</p>
//       <div class="price-quantity">
//         <h2>$ ${price}</h2>
//         <div class="buttons">
//           <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
//           <div id=${id} class="quantity">${
//         search.item === undefined ? 0 : search.item
//       }</div>
//           <i onclick="increment(${id},${desc})" class="bi bi-plus-lg"></i>
//         </div>
//       </div>
//     </div>
//   </div>`;
//     })
//     .join(""));
// });
