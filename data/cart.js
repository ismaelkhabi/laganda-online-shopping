export const cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  const cartQuantityElement = document.querySelector(".cart-quantity");

  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

const addedMessageTimeouts = new WeakMap();

document.addEventListener("click", (event) => {
  const button = event.target.closest(".js-add-to-cart");

  if (!button) {
    return;
  }

  const productId = button.dataset.productId;
  const productContainer = button.closest(".product-container");
  const quantity = Number(
    productContainer.querySelector(".js-product-quantity").value,
  );
  const matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({ productId: productId, quantity: quantity });
  }

  const originalButtonText = "Add to Cart";
  button.textContent = "Added";
  button.classList.add("is-added");
  clearTimeout(addedMessageTimeouts.get(button));
  const addedMessageTimeout = setTimeout(() => {
    button.textContent = originalButtonText;
    button.classList.remove("is-added");
  }, 2000);
  addedMessageTimeouts.set(button, addedMessageTimeout);
  saveCart();
  updateCartQuantity();
});

updateCartQuantity();
