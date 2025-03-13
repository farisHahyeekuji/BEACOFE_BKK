let cart = []; // อาร์เรย์เก็บสินค้าที่เพิ่มลงตะกร้า

// ฟังก์ชันเพิ่มสินค้าไปยังตะกร้า
function addToCart(itemName) {
    cart.push(itemName); // เพิ่มชื่อสินค้าไปยังอาร์เรย์
    updateCartCount(); // อัปเดตจำนวนสินค้าบนไอคอนตะกร้า
}



// ฟังก์ชันค้นหาเมนู
function searchMenu() {
    const searchText = document.getElementById("search").value.toLowerCase();
    const drinks = document.querySelectorAll(".drink");

    drinks.forEach(drink => {
        const name = drink.querySelector("h3").textContent.toLowerCase();
        drink.style.display = name.includes(searchText) ? "block" : "none";
    });
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
}
updateCartCount(); // อัปเดตเมื่อโหลดหน้า


function addToCart(name, price, button) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ดึงค่าความหวานและจำนวน
    const sweetnessDropdown = button.parentElement.querySelector('.sweetness');
    const sweetness = sweetnessDropdown ? sweetnessDropdown.value : "ไม่ระบุ";
    const quantityInput = button.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantityInput.value) || 1;

    cart.push({ name, price, sweetness, quantity });

    localStorage.setItem("cart", JSON.stringify(cart)); // บันทึกลง Local Storage
    updateCartCount(); // อัปเดตจำนวนสินค้า
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
    document.getElementById("cart-count").textContent = cart.length;

}



function togglePaymentFields() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cashPayment = document.getElementById('cash-payment');
    const transferPayment = document.getElementById('transfer-payment');

    if (paymentMethod === 'cash') {
        cashPayment.style.display = 'block';
        transferPayment.style.display = 'none';
    } else if (paymentMethod === 'transfer') {
        cashPayment.style.display = 'none';
        transferPayment.style.display = 'block';
    }
}


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
    const telegramBotToken = "7694936636:AAHhJcIRXPH4HLRfuvfWpR4wwagylNQyKyg";  // ใส่ Token ของคุณ
    const chatId = "5963263519";  // ใส่ Chat ID ของคุณ

    const fileInput = document.getElementById("slip-upload");
    const file = fileInput.files[0];

    if (file) {
        let formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('caption', orderText);  // ข้อความคำสั่งซื้อ
        formData.append('photo', file);  // แนบรูปสลิปโอนเงิน

        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("สั่งซื้อสำเร็จ! คุณลูกค้ารอสักครู่นะค๊าบ");
                cart = [];  // ล้างตะกร้าหลังการสั่งซื้อ
                updateCart();  // อัปเดตตะกร้า
            } else {
                alert('เกิดข้อผิดพลาดในการส่งสลิป');
            }
        })
        .catch(error => console.error("Error:", error));
    } else {
        // หากไม่มีการแนบสลิป
        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: orderText })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("สั่งซื้อสำเร็จ! คุณลูกค้ารอสักครู่นะค๊าบ");
                cart = [];  // ล้างตะกร้าหลังการสั่งซื้อ
                updateCart();  // อัปเดตตะกร้า
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

function toggleSlipUpload() {
    let paymentMethod = document.getElementById('payment-method').value;
    let slipContainer = document.getElementById('slip-upload-container');
    
    if (paymentMethod === 'transfer') {
        slipContainer.style.display = 'block';
    } else {
        slipContainer.style.display = 'none';
    }
}


function searchMenu() {
    const searchText = document.getElementById("search").value.toLowerCase();
    const drinks = document.querySelectorAll(".drink");

    drinks.forEach(drink => {
        const name = drink.querySelector("h3").textContent.toLowerCase();
        if (name.includes(searchText)) {
            drink.style.display = "block";
        } else {
            drink.style.display = "none";
        }
    });
}

function showCartPage() {
    window.location.href = "cart.html"; // ไปที่หน้าตะกร้าสินค้า
}




// ตรวจจับการคลิกที่ลิงก์เพื่อเลื่อนไปยังส่วนที่เกี่ยวข้อง
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // ป้องกันการทำงานตามปกติของลิงก์

        // เลื่อนไปยังส่วนที่มี id ตรงกัน
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth', // เลื่อนอย่างลื่นไหล
            block: 'start'      // ให้ไปที่จุดเริ่มต้นของ section
        });
    });
});

// ฟังก์ชันที่ใช้สลับเมนูให้แสดง/ซ่อนเมื่อคลิกปุ่ม hamburger
function toggleMenu() {
    const menu = document.querySelector('.menu-category');
    menu.classList.toggle('show');
}

