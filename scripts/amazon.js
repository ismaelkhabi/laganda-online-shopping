import { cart } from "../data/cart.js";

let productsHTML = "";

products.forEach((product) => {
  productsHTML += `
   <div class="product-container">
          <div class="product-image-container">
            <img
              class="product-image clickable-product-image"
              src="${product.image}"
              alt="${product.name}"
            />
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img
              class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png"
            />
            <div class="product-rating-count link-primary">${product.rating.count}</div>
          </div>

          <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>

          <div class="product-quantity-container">
            <select class="js-product-quantity">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <button class="
            add-to-cart-button 
            button-primary 
            js-add-to-cart
          "
            data-product-id="${product.id}"
          >
            Add to Cart
          </button>
        </div>`;
});

document.querySelector(".js-products-grid").innerHTML = productsHTML;

const imageViewer = document.querySelector(".image-viewer");
const imageViewerImage = document.querySelector(".image-viewer-image");

document.addEventListener("click", (event) => {
  const productImage = event.target.closest(".clickable-product-image");

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
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageViewer.classList.contains("is-open")) {
    imageViewer.classList.remove("is-open");
    imageViewer.setAttribute("aria-hidden", "true");
  }
});
