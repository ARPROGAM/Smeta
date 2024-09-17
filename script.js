const languages = {
  en: {
    productId: 'ID',
    productName: 'Product Name',
    productUnit: 'Unit',
    productQuantity: 'Quantity',
    productPrice: 'Price',
    productTotal: 'Total',
    siteTitle: 'Product List',
    actions: 'Actions',
    save: 'Save'
  },
  ru: {
    productId: 'ID',
    productName: 'Название продукта',
    productUnit: 'Единица',
    productQuantity: 'Количество',
    productPrice: 'Цена',
    productTotal: 'Итого',
    siteTitle: 'Список продуктов',
    actions: 'Действия',
    save: 'Сохранить'
  },
  uz: {
    productId: 'ID',
    productName: 'Mahsulot nomi',
    productUnit: 'Birlik',
    productQuantity: 'Miqdor',
    productPrice: 'Narx',
    productTotal: 'Jami',
    siteTitle: 'Mahsulot ro\'yxati',
    actions: 'Harakatlar',
    save: 'Saqlash'
  }
};

let products = [];

async function loadProducts() {
  const response = await fetch('data/products.json');
  products = await response.json();
  return products;
}

function updateTable(products, language) {
  const tableBody = document.getElementById('product-table-body');
  const headers = languages[language];
  
  document.getElementById('product-id-header').innerText = headers.productId;
  document.getElementById('product-name-header').innerText = headers.productName;
  document.getElementById('product-unit-header').innerText = headers.productUnit;
  document.getElementById('product-quantity-header').innerText = headers.productQuantity;
  document.getElementById('product-price-header').innerText = headers.productPrice;
  document.getElementById('product-total-header').innerText = headers.productTotal;
  document.getElementById('actions-header').innerText = headers.actions;
  document.getElementById('site-title').innerText = headers.siteTitle;

  tableBody.innerHTML = products.map((product, index) => `
    <tr>
      <td>${product.id}</td>
      <td><input type="text" value="${product.name[language]}" onchange="updateProduct(${index}, 'name', this.value)"></td>
      <td>${product.unit}</td>
      <td><input type="number" value="${product.quantity}" onchange="updateProduct(${index}, 'quantity', this.value)"></td>
      <td><input type="number" step="0.01" value="${product.price}" onchange="updateProduct(${index}, 'price', this.value)"></td>
      <td>${(product.quantity * product.price).toFixed(2)}</td>
      <td><button onclick="saveProduct(${index})">${headers.save}</button></td>
    </tr>
  `).join('');
}

function updateProduct(index, field, value) {
  products[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) : value;
  products[index].total = (products[index].quantity * products[index].price).toFixed(2);
  saveProducts();
}

function saveProduct(index) {
  saveProducts();
}

function saveProducts() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadData() {
  saveProducts();
}

function setLanguage(language) {
  loadProducts().then(products => updateTable(products, language));
}

// Default language
setLanguage('en');
