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
          cartCount.textContent = cart.length; // อัปเดตจำนวนสินค้าที่อยู่ในตะกร้า
      }

      updateCart();

      function togglePaymentFields() {
          const paymentMethod = document.getElementById('payment-method').value;
          const cashPayment = document.getElementById('cash-payment');
          const transferPayment = document.getElementById('transfer-payment');
          const qrCode = document.getElementById('qr-code');

          if (paymentMethod === 'cash') {
              cashPayment.style.display = 'block';
              transferPayment.style.display = 'none';
              qrCode.style.display = 'none'; // ซ่อน QR Code เมื่อเลือกเงินสด
          } else if (paymentMethod === 'transfer') {
              cashPayment.style.display = 'none';
              transferPayment.style.display = 'block';
              qrCode.style.display = 'block'; // แสดง QR Code เมื่อเลือกโอนเงิน
          }
      }

     
  const TELEGRAM_BOT_TOKEN = "7694936636:AAHhJcIRXPH4HLRfuvfWpR4wwagylNQyKyg"; // 🔴 ใส่ Bot Token ของคุณ
  const TELEGRAM_CHAT_ID = "5963263519"; // 🔴 ใส่ Chat ID ของกลุ่มหรือบัญชี

  function submitOrder() {
  const customerName = document.getElementById("customer-name").value.trim();
  if (!customerName) {
      alert("❌ กรุณากรอกชื่อก่อนทำการสั่งซื้อ!");
      return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
      alert("❌ ตะกร้าว่างเปล่า!");
      return;
  }

  let orderDetails = `👤 *ลูกค้า: ${customerName}* \n`;
  orderDetails += `🛒 *ออเดอร์ใหม่* \n\n`;

  let totalAmount = 0;
  cart.forEach((item, index) => {
      orderDetails += `${index + 1}. ${item.name} (${item.sweetness}) x${item.quantity} = ${item.price * item.quantity} บาท\n`;
      totalAmount += item.price * item.quantity;
  });

  orderDetails += `\n💰 *รวมทั้งหมด: ${totalAmount} บาท*`;

  const paymentMethod = document.getElementById("payment-method").value;

  if (paymentMethod === "cash") {
      orderDetails += "\n💵 *ชำระเงิน: เงินสด*";
  } else if (paymentMethod === "transfer") {
      orderDetails += "\n🏦 *ชำระเงิน: โอนเงิน*";
  }

  // 🔄 ส่งข้อความไปยัง Telegram ก่อน
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
          if (paymentMethod === "transfer") {
              sendSlipToTelegram(); // ถ้าเป็นโอนเงินให้ส่งสลิป
          } else {
              alert("✅ สั่งซื้อสำเร็จ! ออเดอร์ถูกส่งไปยัง Telegram แล้ว");
              localStorage.removeItem("cart");
              updateCart();
          }
      } else {
          alert("❌ ไม่สามารถส่งออเดอร์ไปยัง Telegram ได้");
      }
  })
  .catch(error => {
      console.error("Telegram API Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
  });
}

// 📸 ฟังก์ชันส่งสลิปไป Telegram
function sendSlipToTelegram() {
  const slipFile = document.getElementById("slip-upload").files[0];

  if (!slipFile) {
      alert("❌ กรุณาอัพโหลดสลิปก่อนส่ง!");
      return;
  }

  let formData = new FormData();
  formData.append("chat_id", TELEGRAM_CHAT_ID);
  formData.append("photo", slipFile);

  const telegramPhotoAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  fetch(telegramPhotoAPI, {
      method: "POST",
      body: formData,
  })
  .then(response => response.json())
  .then(data => {
      if (data.ok) {
          alert("✅ สั่งซื้อสำเร็จ! สลิปถูกส่งไปยัง Telegram แล้ว");
          localStorage.removeItem("cart");
          updateCart();
      } else {
          alert("❌ ไม่สามารถส่งสลิปไปยัง Telegram ได้");
      }
  })
  .catch(error => {
      console.error("Telegram API Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งสลิป");
  });
}

