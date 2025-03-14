let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ฟังก์ชันเพิ่มสินค้าไปยังตะกร้า
function addToCart(name, price, button) {
    const sweetness = button.parentElement.querySelector(".sweetness")?.value || "ไม่ระบุ";
    const quantity = parseInt(button.parentElement.querySelector(".quantity")?.value) || 1;
    cart.push({ name, price, sweetness, quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// อัปเดตจำนวนสินค้าในตะกร้า
function updateCartCount() {
    document.getElementById("cart-count").textContent = cart.length;
}
updateCartCount();

// ฟังก์ชันค้นหาเมนู
function searchMenu() {
    const searchText = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll(".drink").forEach(drink => {
        drink.style.display = drink.querySelector("h3").textContent.toLowerCase().includes(searchText) ? "block" : "none";
    });
}

// อัปเดตตะกร้าสินค้า
function updateCart() {
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.sweetness}) x${item.quantity} - ${item.price * item.quantity} บาท`;
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌ ลบ";
        removeButton.onclick = () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        };
        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
        total += item.price * item.quantity;
    });

    totalPrice.textContent = total;
    document.getElementById("cart-count").textContent = cart.length;
}

// แสดง/ซ่อนช่องอัปโหลดสลิปโอนเงิน
function toggleSlipUpload() {
    document.getElementById("slip-upload-container").style.display = document.getElementById("payment-method").value === "transfer" ? "block" : "none";
}

// เลื่อนหน้าเว็บอย่างลื่นไหลเมื่อคลิกลิงก์ภายในหน้า
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// ฟังก์ชันแสดงหน้าตะกร้าสินค้า
function showCartPage() {
    window.location.href = "cart.html";
}
