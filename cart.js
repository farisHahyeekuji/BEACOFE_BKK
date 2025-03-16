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
    

      function togglePaymentFields() {
        const paymentMethod = document.getElementById("payment-method").value;
        const cashPayment = document.getElementById("cash-payment");
        const transferPayment = document.getElementById("transfer-payment");
        const qrCode = document.getElementById("qr-code");
    
        if (paymentMethod === "cash") {
            cashPayment.style.display = "block";
            transferPayment.style.display = "none";
            qrCode.style.display = "none"; // ซ่อน QR Code เมื่อเลือกเงินสด
        } else if (paymentMethod === "transfer") {
            cashPayment.style.display = "none";
            transferPayment.style.display = "block";
            qrCode.style.display = "block"; // แสดง QR Code เมื่อเลือกโอนเงิน
        }
    }
    
    // ให้โค้ดทำงานเมื่อหน้าโหลดเสร็จ
    document.addEventListener("DOMContentLoaded", function () {
        togglePaymentFields();
    });
    
     
  const TELEGRAM_BOT_TOKEN = "7694936636:AAHhJcIRXPH4HLRfuvfWpR4wwagylNQyKyg"; // 🔴 ใส่ Bot Token ของคุณ
  const TELEGRAM_CHAT_ID = "5963263519"; // 🔴 ใส่ Chat ID ของกลุ่มหรือบัญชี

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

    // เพิ่มจำนวนการสั่งซื้อเฉพาะเมื่อกดปุ่ม "สั่งซื้อ" ในหน้า cart.html
    let orderCount = localStorage.getItem("orderCount") || 0;
    orderCount = parseInt(orderCount) + 1;  // เพิ่ม 1 ทุกครั้งที่กด "สั่งซื้อ"
    localStorage.setItem("orderCount", orderCount); // อัปเดต LocalStorage

    let orderDetails = `🛒 *ออเดอร์ใหม่* \n\n`;
    orderDetails += `👤 *ลูกค้า: ${customerName}* \n`;
    orderDetails += `🪑 *โต๊ะที่เลือก: โต๊ะ ${tableSelection}* \n\n`;

    let totalAmount = 0;
    cart.forEach((item, index) => {
        orderDetails += `${index + 1}. ${item.name} (${item.sweetness}) x${item.quantity} = ${item.price * item.quantity} บาท\n`;
        totalAmount += item.price * item.quantity;
    });

    orderDetails += `\n💰 *รวมทั้งหมด: ${totalAmount} บาท*`;

    const paymentMethod = document.getElementById("payment-method").value;
    orderDetails += paymentMethod === "cash" ? "\n💵 *ชำระเงิน: เงินสด*" : "\n🏦 *ชำระเงิน: โอนเงิน*";

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
            alert("✅ สั่งซื้อสำเร็จ! ทีมงานของเราจะเริ่มเตรียมเครื่องดื่มให้คุณทันที");
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

  
  // ฟังก์ชันสำหรับส่งสลิปการโอนเงินไปยัง Telegram
  function sendSlipToTelegram(slipFile) {
      const formData = new FormData();
      formData.append("chat_id", TELEGRAM_CHAT_ID);
      formData.append("document", slipFile);
    
      const telegramAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;
      fetch(telegramAPI, {
          method: "POST",
          body: formData,
      })
      .then(response => response.json())
      .then(data => {
          if (data.ok) {
              alert("✅ สลิปการโอนเงินถูกส่งไปยัง Telegram แล้ว");
              localStorage.removeItem("cart"); // ลบตะกร้าหลังจากส่ง
              updateCart(); // อัปเดตตะกร้า
              window.location.href = 'thankyou.html'; // ไปยังหน้าขอบคุณ
          } else {
              alert("❌ ไม่สามารถส่งสลิปไปยัง Telegram ได้");
          }
      })
      .catch(error => {
          console.error("Telegram API Error:", error);
          alert("❌ เกิดข้อผิดพลาดในการส่งสลิป");
      });
  }
  