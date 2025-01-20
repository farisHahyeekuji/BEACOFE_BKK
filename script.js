let cart = [];

function addToCart(name, price) {
    const sweetness = document.querySelector('.sweetness').value;
    cart.push({ name, price, sweetness });
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.sweetness}) - ${item.price} บาท`;
        
        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.onclick = () => {
            cart.splice(index, 1);
            updateCart();
        };

        li.appendChild(removeButton);
        cartList.appendChild(li);
        total += item.price;
    });

    document.getElementById("total-price").textContent = `ราคารวม: ${total} บาท`;
}

function submitOrder() {
    const tableNumber = document.getElementById("table-number").value;

    if (cart.length === 0) {
        alert("กรุณาเลือกสินค้าในตะกร้าก่อนสั่งซื้อ!");
        return;
    }
    if (!tableNumber) {
        alert("กรุณากรอกหมายเลขโต๊ะ!");
        return;
    }

    let orderText = `📢 คำสั่งซื้อใหม่!\n📍 โต๊ะ: ${tableNumber}\n`;
    cart.forEach(item => {
        orderText += `- ${item.name} (${item.sweetness}) - ${item.price} บาท\n`;
    });

    orderText += `\n💰 ราคารวม: ${document.getElementById("total-price").textContent}`;

    // ✅ ส่งออเดอร์ไป Telegram
    const telegramBotToken = "7694936636:AAHhJcIRXPH4HLRfuvfWpR4wwagylNQyKyg";
    const chatId = "7694936636";
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: orderText
        })
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
