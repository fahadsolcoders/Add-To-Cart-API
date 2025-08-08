const cartContainer = document.querySelector("#cart-table-body");
const cartSummary = document.querySelector(".cart-summary .total");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  cartContainer.innerHTML = `<tr><td colspan="23" class="empty-cart">Your cart is empty.</td></tr>`;
} else {
  console.log("Cart items loaded:", cart);
  cart.forEach((item, index) => {


    item.quantity = item.quantity || 1;

    const productRow = document.createElement("tr");
    productRow.innerHTML = `
      <td class="list-img"><img src="${item.images?.[0] || item.thumbnail || 'https://via.placeholder.com/50'}" alt="${item.title || 'No title'}" /></td>
      <td class="list-title">${item.title || "N/A"}</td>
      <td class="list-description">${item.description || "N/A"}</td>
      <td class="list-category">${item.category || "N/A"}</td>
      <td class="list-price">$${item.price?.toFixed(2) || "N/A"}</td>
      <td class="list-AS">${item.availabilityStatus || "N/A"}</td>
      <td class="list-brand">${item.brand || "N/A"}</td>
      <td class="list-dimensions">${item.dimensions ? `${item.dimensions.width || "N/A"} x ${item.dimensions.height || "N/A"} x ${item.dimensions.depth || "N/A"}` : "N/A"}</td>
      <td class="list-DP">${item.discountPercentage?.toFixed(1) || 0}%</td>
      <td class="list-MC">${item.meta?.createdAt}</td>
      <td class="list-MU">${item.meta?.updatedAt}</td>
      <td class="list-MB">${item.meta?.barcode || "N/A"}</td>
      <td class="list-MOQ">${item.minimumOrderQuantity || "N/A"}</td>
      <td class="list-rating">${item.rating?.toFixed(1) || "N/A"}</td>
      <td class="list-RP">${item.returnPolicy || "N/A"}</td>
      <td class="list-review">${item.reviews?.[0] ? `${item.reviews[0].rating}/5 - ${item.reviews[0].comment} (by ${item.reviews[0].reviewerName}, ${new Date(item.reviews[0].date).toLocaleDateString()})` : "No reviews"}</td>
      <td class="list-SI">${item.shippingInformation || "N/A"}</td>
      <td class="list-sku">${item.sku || "N/A"}</td>
      <td class="list-stock">${item.stock || "N/A"}</td>
      <td class="list-tags">${item.tags?.join(", ") || "N/A"}</td>
      <td class="list-warranty">${item.warrantyInformation || "N/A"}</td>
      <td class="list-weight">${item.weight ? `${item.weight}kg` : "N/A"}</td>
      <td>
        <div class="quantity-controls">
          <button class="decrement" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increment" data-id="${item.id}">+</button>
        </div>
        <button class="remove-from-cart" data-id="${item.id}">Remove</button>
      </td>
    `;
    cartContainer.appendChild(productRow);
  });

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  if (cartSummary) {
    cartSummary.textContent = `$${total.toFixed(2)}`;
  }

  document.querySelectorAll(".increment").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const item = cart.find((item) => item.id === productId);
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
      }
    });
  });

  document.querySelectorAll(".decrement").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const item = cart.find((item) => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
      }
    });
  });

  document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const updatedCart = cart.filter((item) => item.id !== productId);
      try {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        console.log(`Removed product ID ${productId}. Updated cart:`, updatedCart);
        window.location.reload();
      } catch (error) {
        console.error("Error updating localStorage:", error);
        alert("Error removing product from cart.");
      }
    });
  });
}