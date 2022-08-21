let label = document.getElementById("label");
label.innerHTML = `<h2>Thank You for shopping...!</h2>
<a href = "index.html">
<button class = "HomeBtn"> Back to home </button></a>`;
let basket = JSON.parse(localStorage.getItem("data")) || [];
const dbName = "the_products";
let store;
const request = indexedDB.open(dbName, 2);

request.onerror = (event) => {
  // Handle errors.
};

let shopData = [];
if (basket.length !== 0) {
  request.onsuccess = (event) => {
    const db = event.target.result;

    let customerObjectStore = db
      .transaction("alldata", "readwrite")
      .objectStore("alldata");
    customerObjectStore.oncomplete = (ev) => {
      //transaction for reading all objexts
    };

    let getReq = customerObjectStore.getAll();
    getReq.onsuccess = (e) => {
      let newRequest = e.target;
      shopData = [...newRequest.result];
      //console.log(shopData);
      basket.map((x) => {
        let { item, id } = x;
        //console.log(x);
        let search = shopData.findIndex((y) => y.id === id) || 0;
        //console.log("search", search);

        shopData[search].desc = shopData[search].desc - item;
      });
      //console.log("shopData", shopData);
      customerObjectStore.clear();

      customerObjectStore = db
        .transaction("alldata", "readwrite")
        .objectStore("alldata");
      shopData.forEach((shopItem) => {
        customerObjectStore.add(shopItem);
      });

      //const newData = customerObjectStore.put(db, shopData);
    };
    getReq.onerror = (e) => {
      console.log("error");
    };
  };
}
window.localStorage.clear();
