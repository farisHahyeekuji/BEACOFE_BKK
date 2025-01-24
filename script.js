let cart = [];  // ตัวแปรเก็บข้อมูลในตะกร้า

// เพิ่มเครื่องดื่มลงตะกร้า
function addToCart(name, price, button) {
    const sweetnessDropdown = button.parentElement.querySelector('select'); // ค้นหาค่า sweetness จาก select
    const sweetness = sweetnessDropdown.value;  // รับค่าจาก dropdown (0%, 50%, 100%)
    const quantityInput = button.parentElement.querySelector('input'); // ค้นหาจำนวนแก้ว
    const quantity = parseInt(quantityInput.value) || 1;  // รับค่าจำนวนแก้ว (ถ้าไม่กรอกจะใช้ค่า 1 แก้ว)

    // เพิ่มข้อมูลเครื่องดื่มลงในตะกร้า โดยมีจำนวนแก้ว
    cart.push({ name, price, sweetness, quantity });

    updateCart();  // อัปเดตการแสดงผลในตะกร้า
}

// อัปเดตตะกร้า
function updateCart() {
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");
    cartList.innerHTML = "";  // เคลียร์รายการในตะกร้า
    let total = 0;

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.sweetness}) x${item.quantity} - ${item.price * item.quantity} บาท`;  // แสดงรายการในตะกร้า
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌ ลบ";
        removeButton.onclick = () => {
            cart.splice(index, 1);  // ลบรายการจากตะกร้า
            updateCart();
        };
        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
        total += item.price * item.quantity;  // คำนวณราคาทั้งหมด
    });

    totalPrice.textContent = total;  // อัปเดตราคาทั้งหมด
}

// ส่งคำสั่งซื้อไปยัง Telegram
function submitOrder() {
    const customerName = document.getElementById("customer-name").value;  // รับชื่อลูกค้า

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
        orderText += `- ${item.name} (${item.sweetness}) x${item.quantity} - ${item.price * item.quantity} บาท\n`;  // แสดงรายการเครื่องดื่ม
    });

    orderText += `\n💰 ราคารวม: ${document.getElementById("total-price").textContent} บาท`;

    // 🔹 ใส่ Token และ Chat ID ของคุณ
    const telegramBotToken = "7287220804:AAH2y3PqAkEnl8E5ZuoonE0QqV2BgpUnfss";  // ใส่ Token ของคุณ
    const chatId = "8116386478";  // ใส่ Chat ID ของคุณ

    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: orderText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert("สั่งซื้อสำเร็จ! กรุณารอพนักงานทำเครื่องดื่ม ☕");
            cart = [];  // ล้างตะกร้าหลังการสั่งซื้อ
            updateCart();  // อัปเดตตะกร้า
        }
    })
    .catch(error => console.error("Error:", error));
}