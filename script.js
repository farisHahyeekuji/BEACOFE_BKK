let cart = [];

// เพิ่มเครื่องดื่มลงตะกร้า
function addToCart(name, price, button) {
    const sweetness = button.previousElementSibling.value;
    cart.push({ name, price, sweetness });
    updateCart();
}

// อัปเดตตะกร้า
function updateCart() {
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.sweetness}) - ${item.price} บาท`;
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌ ลบ";
        removeButton.onclick = () => {
            cart.splice(index, 1);
            updateCart();
        };
        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
        total += item.price;
    });

    totalPrice.textContent = total;
}

// ส่งคำสั่งซื้อไปยัง Telegram
function submitOrder() {
    const customerName = document.getElementById("customer-name").value; // เปลี่ยนเป็นชื่อลูกค้า

    if (cart.length === 0) {
        alert("กรุณาเลือกสินค้าในตะกร้าก่อนสั่งซื้อ!");
        return;
    }
    if (!customerName) {
        alert("กรุณากรอกชื่อลูกค้า!");
        return;
    }
    let orderText = `📢 คำสั่งซื้อใหม่!\n📍 ชื่อ: ${customerName}\n`;
    cart.forEach(item => {
        orderText += `- ${item.name} (${item.sweetness}) - ${item.price} บาท\n`;
    });

    orderText += `\n💰 ราคารวม: ${document.getElementById("total-price").textContent} บาท`;

    // 🔹 ใส่ Token และ Chat ID ของคุณ
    const telegramBotToken = "7694936636:AAHhJcIRXPH4HLRfuvfWpR4wwagylNQyKyg";  // <-- เปลี่ยนเป็น Token ของคุณ
    const chatId = "5963263519";  // <-- เปลี่ยนเป็น Chat ID ของคุณ

    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: orderText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert("สั่งซื้อสำเร็จ! กรุณารอพนักงานทำเครื่องดื่ม ☕");
            cart = [];
            updateCart();
        }
    })
    .catch(error => console.error("Error:", error));
}
