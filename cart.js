
// โหลดข้อมูลตะกร้าจาก Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");
    const cartCount = document.getElementById("cart-count");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.sweetness}) x${item.quantity} - ${item.price * item.quantity} บาท`;

        const removeButton = document.createElement("button");
        removeButton.textContent = " ลบ ";
        removeButton.classList.add("remove-btn"); // เพิ่มคลาสให้ปุ่ม

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
    cartCount.textContent = cart.length;
}

updateCart();

// ✅ ระบบนี้ใช้เฉพาะเงินสดเท่านั้น
function togglePaymentFields() {
    const cashPayment = document.getElementById("cash-payment");
    if (cashPayment) cashPayment.style.display = "block";
    // ถ้ามี element ที่เหลืออยู่ ก็ซ่อนไว้
    const transferPayment = document.getElementById("transfer-payment");
    const qrCode = document.getElementById("qr-code");
    if (transferPayment) transferPayment.style.display = "none";
    if (qrCode) qrCode.style.display = "none";
}

// ให้โค้ดทำงานเมื่อหน้าโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function () {
    togglePaymentFields();
});

// ข้อมูล Telegram
const TELEGRAM_BOT_TOKEN = "8246418985:AAE3XE_p7yzAMi_pXuH2D61o3MWRZoihLik"; // 🔴 ใส่ Bot Token ของคุณ
const TELEGRAM_CHAT_ID = "8298345920"; // 🔴 ใส่ Chat ID ของกลุ่มหรือบัญชี

function submitOrder() {
    const customerName = document.getElementById("customer-name").value.trim();
    const tableSelection = document.getElementById("table-selection").value;

    if (!customerName) {
        alert("❌ กรุณากรอกชื่อก่อนทำการสั่งซื้อ!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("❌ ตะกร้าว่างเปล่า!");
        return;
    }

    // เพิ่มจำนวนการสั่งซื้อเฉพาะเมื่อกดปุ่ม "สั่งซื้อ"
    let orderCount = localStorage.getItem("orderCount") || 0;
    orderCount = parseInt(orderCount) + 1;
    localStorage.setItem("orderCount", orderCount);

    let orderDetails = `🛒 *ออเดอร์ใหม่* \n\n`;
    orderDetails += `👤 *ลูกค้า:* ${customerName}\n`;
    orderDetails += `🪑 *โต๊ะที่เลือก:* โต๊ะ ${tableSelection}\n\n`;

    let totalAmount = 0;
    cart.forEach((item, index) => {
        orderDetails += `${index + 1}. ${item.name} (${item.sweetness}) x${item.quantity} = ${item.price * item.quantity} บาท\n`;
        totalAmount += item.price * item.quantity;
    });

    orderDetails += `\n💰 *รวมทั้งหมด:* ${totalAmount} บาท`;
    orderDetails += `\n💵 *ชำระเงิน:* เงินสด`;

    const telegramAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    fetch(telegramAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: orderDetails,
            parse_mode: "Markdown",
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert("✅ สั่งซื้อสำเร็จ! พนักงานของเราจะเริ่มเตรียมเครื่องดื่มให้คุณทันที");
            localStorage.removeItem("cart");
            updateCart();
            window.location.href = 'thankyou.html';
        } else {
            alert("❌ ไม่สามารถส่งออเดอร์ไปยังทีมงานได้");
        }
    })
    .catch(error => {
        console.error("Telegram API Error:", error);
        alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
    });
}

