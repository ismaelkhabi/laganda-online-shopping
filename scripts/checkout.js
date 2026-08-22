import { cart } from "../data/cart.js";

const cartItemsContainer = document.querySelector(".js-cart-items");
const itemCountElement = document.querySelector(".checkout-item-count");
const summaryItemCount = document.querySelector(".summary-item-count");
const summaryItemsPrice = document.querySelector(".summary-items-price");
const summaryShipping = document.querySelector(".summary-shipping");
const summarySubtotal = document.querySelector(".summary-subtotal");
const summaryTax = document.querySelector(".summary-tax");
const summaryTotal = document.querySelector(".summary-total");

function updateOrderSummary(itemCount, itemsPriceCents) {
  const shippingCents = [
    ...document.querySelectorAll(".delivery-option-input:checked"),
  ].reduce((total, option) => total + Number(option.dataset.shippingCents), 0);
  const subtotalCents = itemsPriceCents + shippingCents;
  const taxCents = Math.round(subtotalCents * 0.1);

  summaryItemCount.textContent = itemCount;
  summaryItemsPrice.textContent = `$${(itemsPriceCents / 100).toFixed(2)}`;
  summaryShipping.textContent = `$${(shippingCents / 100).toFixed(2)}`;
  summarySubtotal.textContent = `$${(subtotalCents / 100).toFixed(2)}`;
  summaryTax.textContent = `$${(taxCents / 100).toFixed(2)}`;
  summaryTotal.textContent = `$${((subtotalCents + taxCents) / 100).toFixed(2)}`;
}

function updateCartSummary() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const itemsPriceCents = cart.reduce((total, cartItem) => {
    const product = products.find((item) => item.id === cartItem.productId);
    return total + (product ? product.priceCents * cartItem.quantity : 0);
  }, 0);

  itemCountElement.textContent = itemCount;
  updateOrderSummary(itemCount, itemsPriceCents);
}

function renderCartItems() {
  let itemCount = 0;
  let itemsPriceCents = 0;
  let cartItemsHTML = "";

  cart.forEach((cartItem, index) => {
    const product = products.find((item) => item.id === cartItem.productId);

    if (!product) {
      return;
    }

    itemCount += cartItem.quantity;
    itemsPriceCents += product.priceCents * cartItem.quantity;
    cartItemsHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">Delivery date: Tuesday, June 21</div>
        <div class="cart-item-details-grid">
          <div class="cart-item-image-container">
            <img class="product-image clickable-product-image" src="${product.image}" alt="${product.name}" />
          </div>
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
            <div class="product-quantity">
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              <input class="quantity-update-input" type="number" min="1" step="1" placeholder="Update" data-product-id="${product.id}" aria-label="Update quantity for ${product.name}" />
              <span class="remove-one-link link-primary" data-product-id="${product.id}">Remove 1</span>
              <span class="delete-quantity-link link-primary" data-product-id="${product.id}">Delete all</span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            <div class="delivery-option">
              <input type="radio" checked data-shipping-cents="0" class="delivery-option-input" name="delivery-option-${index}" />
              <div>
                <div class="delivery-option-date">Tuesday, June 21</div>
                <div class="delivery-option-price">FREE Shipping</div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" data-shipping-cents="499" class="delivery-option-input" name="delivery-option-${index}" />
              <div>
                <div class="delivery-option-date">Wednesday, August 26</div>
                <div class="delivery-option-price">$4.99 - Shipping</div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" data-shipping-cents="999" class="delivery-option-input" name="delivery-option-${index}" />
              <div>
                <div class="delivery-option-date">Monday, August 24</div>
                <div class="delivery-option-price">$9.99 - Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });

  cartItemsContainer.innerHTML = cartItemsHTML || "<p>Your cart is empty.</p>";
  updateCartSummary();
}

document.addEventListener("change", (event) => {
  if (event.target.matches(".delivery-option-input")) {
    updateCartSummary();
  }
});

document.addEventListener("input", (event) => {
  const quantityInput = event.target.closest(".quantity-update-input");

  if (!quantityInput || quantityInput.value === "") {
    return;
  }

  const quantity = Number(quantityInput.value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return;
  }

  const cartItem = cart.find(
    (item) => item.productId === quantityInput.dataset.productId,
  );

  if (cartItem) {
    cartItem.quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    quantityInput
      .closest(".product-quantity")
      .querySelector(".quantity-label").textContent = quantity;
    updateCartSummary();
  }
});

document.addEventListener("click", (event) => {
  const productImage = event.target.closest(".clickable-product-image");
  const imageViewer = document.querySelector(".image-viewer");
  const imageViewerImage = document.querySelector(".image-viewer-image");

  if (productImage) {
    imageViewerImage.src = productImage.src;
    imageViewerImage.alt = productImage.alt;
    imageViewer.classList.add("is-open");
    imageViewer.setAttribute("aria-hidden", "false");
    return;
  }

  if (
    event.target.closest(".image-viewer-close") ||
    event.target === imageViewer
  ) {
    imageViewer.classList.remove("is-open");
    imageViewer.setAttribute("aria-hidden", "true");
    return;
  }

  const placeOrderButton = event.target.closest(".place-order-button");

  if (placeOrderButton) {
    const hasProducts = cart.some(
      (cartItem) =>
        cartItem.quantity > 0 &&
        products.some((product) => product.id === cartItem.productId),
    );

    if (!hasProducts) {
      window.alert("There is no product");
    }

    return;
  }

  const removeOneLink = event.target.closest(".remove-one-link");
  const deleteLink = event.target.closest(".delete-quantity-link");

  if (!removeOneLink && !deleteLink) {
    return;
  }

  const itemIndex = cart.findIndex(
    (item) =>
      item.productId === (removeOneLink || deleteLink).dataset.productId,
  );

  if (itemIndex !== -1) {
    if (removeOneLink && cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
  }
});

document.addEventListener("keydown", (event) => {
  const imageViewer = document.querySelector(".image-viewer");

  if (event.key === "Escape" && imageViewer.classList.contains("is-open")) {
    imageViewer.classList.remove("is-open");
    imageViewer.setAttribute("aria-hidden", "true");
  }
});

renderCartItems();
