// cart.js
let cart = [];

function addToCart(name, price, quantity) {
    const item = { name, price, quantity };
    cart.push(item);
    updateCart();
}

function updateCart() {
    // แสดงจำนวนในตะกร้า
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;

    // แสดงรายการในหน้าตะกร้า
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = ''; // เคลียร์รายการเดิม
    let totalPrice = 0;
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p>${item.name} x ${item.quantity} - ${item.price * item.quantity} บาท</p>
        `;
        cartItems.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    // แสดงราคารวม
    const totalPriceElement = document.getElementById("total-price");
    totalPriceElement.textContent = totalPrice + " บาท";
}

function confirmOrder() {
    alert("คำสั่งซื้อของคุณได้รับการยืนยันแล้ว");
    cart = []; // ลบรายการในตะกร้า
    updateCart(); // อัปเดตรายการในตะกร้า
}
