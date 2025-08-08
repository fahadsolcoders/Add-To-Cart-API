const cartContainer = document.querySelector("#cart-table-body");

const fetchProduct = async () => {
  const url = "https://dummyjson.com/products";
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

fetchProduct()
  .then((response) => response.json())
  .then((data) => {
    const cart = data.products || [];
    if (!cart.length) {
      cartContainer.innerHTML = `<tr><td colspan="23">No products available.</td></tr>`;
      return;
    }

    cart.forEach((item) => {
      if (!item.id) {
        console.warn(
          `Product with title "${item.title}" has no ID and will be skipped.`
        );
        return;
      }

      const productRow = document.createElement("tr");
      productRow.innerHTML = `
        <td class="list-img"><img src="${
          item.images?.[0] || item.thumbnail || "https://via.placeholder.com/60"
        }" alt="${item.title || "No title"}" /></td>
        <td class="list-title">${item.title || "N/A"}</td>
        <td class="list-description">${item.description || "N/A"}</td>
        <td class="list-category">${item.category || "N/A"}</td>
        <td class="list-price">$${item.price?.toFixed(2) || "N/A"}</td>
        <td class="list-AS">${item.availabilityStatus || "N/A"}</td>
        <td class="list-brand">${item.brand || "N/A"}</td>
        <td class="list-dimensions">${
          item.dimensions
            ? `${item.dimensions.width || "N/A"} x ${
                item.dimensions.height || "N/A"
              } x ${item.dimensions.depth || "N/A"}`
            : "N/A"
        }</td>
        <td class="list-DP">${item.discountPercentage?.toFixed(1) || 0}%</td>
        <td class="list-MC">${
          item.meta?.createdAt
            ? new Date(item.meta.createdAt).toLocaleDateString()
            : "N/A"
        }</td>
        <td class="list-MU">${
          item.meta?.updatedAt
            ? new Date(item.meta.updatedAt).toLocaleDateString()
            : "N/A"
        }</td>
        <td class="list-MB">${item.meta?.barcode || "N/A"}</td>
        <td class="list-MOQ">${item.minimumOrderQuantity || "N/A"}</td>
        <td class="list-rating">${item.rating?.toFixed(1) || "N/A"}</td>
        <td class="list-RP">${item.returnPolicy || "N/A"}</td>
        <td class="list-review">${
          item.reviews?.[0]
            ? `${item.reviews[0].rating}/5 - ${item.reviews[0].comment} (by ${
                item.reviews[0].reviewerName
              }, ${new Date(item.reviews[0].date).toLocaleDateString()})`
            : "No reviews"
        }</td>
        <td class="list-SI">${item.shippingInformation || "N/A"}</td>
        <td class="list-sku">${item.sku || "N/A"}</td>
        <td class="list-stock">${item.stock || "N/A"}</td>
        <td class="list-tags">${item.tags?.join(", ") || "N/A"}</td>
        <td class="list-warranty">${item.warrantyInformation || "N/A"}</td>
        <td class="list-weight">${item.weight ? `${item.weight}kg` : "N/A"}</td>
        <td><button class="add-to-cart" data-id="${
          item.id
        }">Add to Cart</button></td>
      `;
      cartContainer.appendChild(productRow);
    });

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        const product = cart.find((item) => item.id === parseInt(productId));

        if (!product) {
          console.error(`Product with ID ${productId} not found.`);
          alert("Error adding product to cart.");
          return;
        }

        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        cartItems.push(product);
        try {
          localStorage.setItem("cart", JSON.stringify(cartItems));
          console.log(
            `Added product ${product.title} to cart. Current cart:`,
            cartItems
          );
          alert(`${product.title} added to cart!`);
          window.location.href = "index2.html";
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          alert("Error saving to cart. Please try again.");
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error processing data:", error);
    cartContainer.innerHTML = `<tr><td colspan="23">Error loading products. Please try again later.</td></tr>`;
  });
