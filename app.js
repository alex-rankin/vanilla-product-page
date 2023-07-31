let cart = {};
let selectedSize = null;
let products;

function addToCart(productId, sizeID) {
  if (selectedSize === null) {
    console.log("Please select a size before adding to cart.");
    return;
  }

  const cartItemId = `${productId}-${sizeID}`;
  
  if (cart.hasOwnProperty(cartItemId)) {
    cart[cartItemId].quantity += 1;
  } else {
    cart[cartItemId] = {
      productId,
      sizeID,
      quantity: 1,
      sizeOption: { ...selectedSize }
    };
  }
  // Update cart quantity
  updateCartQuantity();

  // Call to display items
  displayCartItems();
}

function updateCartQuantity() {
  // Function to calc the amount of items inside cart
  let totalQuantity = 0;
  for (const cartItemId in cart) {
    totalQuantity += cart[cartItemId].quantity
  }

  const cartQuantityElement = document.getElementById("productQuantity");
  cartQuantityElement.textContent = totalQuantity;
}

async function getProducts() {
  try {
    const cartAPI = await fetch("https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product");
    products = await cartAPI.json();

    // Update product image
    const productImage = document.getElementById("productImage");
    productImage.setAttribute("src", products.imageURL);
    productImage.setAttribute("alt", products.title);

    // Update title text
    const productTitle = document.getElementById("productTitle");
    productTitle.innerText = products.title;

    // Update price text
    const priceTitle = document.getElementById("productPrice");
    priceTitle.innerText = "$" + products.price.toFixed(2);

    // Update body text
    const productDesc = document.getElementById("productDesc");
    productDesc.innerText = products.description;

    // Loop through the sizeOptions and create li for each size
    const sizeList = document.getElementById("productSizes");

    products.sizeOptions.forEach((sizeOption) => {
      const li = document.createElement("li");
      li.textContent = sizeOption.label;
      li.setAttribute("data-sizeid", sizeOption.id);

      li.addEventListener("click", () => {
        selectedSize = sizeOption;

        const allLists = document.querySelectorAll("#productSizes li");
        allLists.forEach((element) => element.classList.remove("selected"));

        li.classList.add("selected");
        console.log(sizeOption.id, "size clicked");
      });

      sizeList.appendChild(li);
    });

    // Call update cart after getting the data
    updateCartQuantity();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the api to get data
getProducts()

// Add to cart click event listener
const addToCartButton = document.querySelector(".add-cart-btn");
addToCartButton.addEventListener("click", () => {
  if (selectedSize) {
    addToCart(products.id, selectedSize.id);

    const productSuccess= document.getElementById("productSuccess");
    productSuccess.style.display = "block";

    console.log("Added to cart:", selectedSize.label);

  } else {
    const productError = document.getElementById("productError");
    productError.style.display = "block";

    console.log("Please select a size before adding to cart.");
  }
});

// Display items inside of the cart
function displayCartItems() {
  const cartItemsList = document.getElementById("cartItemsList");
  cartItemsList.innerHTML = ""; // Remove items if any

  for (const cartItemId in cart) {
    const cartItem = cart[cartItemId];
    const product = products;

    // Create the cartMenu div
    const cartMenu = document.createElement("div");
    cartMenu.classList.add("cartMenu");

    // Create the cartMenu-img-wrapper div and add the image
    const cartMenuImgWrapper = document.createElement("div");
    cartMenuImgWrapper.classList.add("cartMenu-img-wrapper");
    const cartMenuImage = document.createElement("img");
    cartMenuImage.setAttribute("src", product.imageURL);
    cartMenuImage.setAttribute("alt", product.title);
    cartMenuImgWrapper.appendChild(cartMenuImage);

    // Create the cartMenu-Items div
    const cartMenuItems = document.createElement("div");
    cartMenuItems.classList.add("cartMenu-Items");

    // Create and set the product title
    const cartMenuProductTitle = document.createElement("p");
    cartMenuProductTitle.textContent =  product.title;

    // Create a wrapper to add quantity and price into
    const cartMenuWrapper = document.createElement("div");
    cartMenuWrapper.setAttribute("class", "cartMenu-flex")

      // Create and set the product quantity
      const cartMenuProductQuantity = document.createElement("p");
      cartMenuProductQuantity.textContent = cartItem.quantity + "x";

      // Create and set the product price
      const cartMenuProductPrice = document.createElement("p");
      cartMenuProductPrice.textContent = "$" + product.price.toFixed(2);

    // Create and set the product size
    const cartMenuProductSize = document.createElement("p");
    cartMenuProductSize.textContent = "Size: " + cartItem.sizeOption.label;

    // Append everything together
    cartMenuItems.appendChild(cartMenuProductTitle);

    cartMenuWrapper.appendChild(cartMenuProductQuantity);
    cartMenuWrapper.appendChild(cartMenuProductPrice);

    cartMenuItems.appendChild(cartMenuWrapper);

    cartMenuItems.appendChild(cartMenuProductSize);

    cartMenu.appendChild(cartMenuImgWrapper);
    cartMenu.appendChild(cartMenuItems);

    // Add the cartMenu to the cartItemsList
    cartItemsList.appendChild(cartMenu);
  }
}

// Cart Menu
const cartButton = document.querySelector(".cart-button");
cartButton.addEventListener("click", () => {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  cartItemsContainer.classList.toggle("show-cart-items");
});