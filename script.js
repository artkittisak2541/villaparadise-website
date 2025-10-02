document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
    });

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = mobileNav.querySelectorAll('a.mobile-link');

    const openMobileNav = () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const closeMobileNav = () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));
    
    // --- Data for Rooms (including Panorama Image) ---
    // ## แก้ไขลิงก์รูปภาพ Panorama ให้เรียกจากโฟลเดอร์ images ##
    const roomData = {
        "Villa 2 Bedrooms": {
            desc: "วิลล่าขนาดกะทัดรัด พร้อม 2 ห้องนอน 2 ห้องน้ำ และสระว่ายน้ำส่วนตัว เหมาะสำหรับกลุ่มเพื่อนหรือครอบครัวเล็กๆ",
            features: ["สระว่ายน้ำส่วนตัว", "ห้องนั่งเล่น", "ห้องครัว", "คาราโอเกะ"],
            panoramaImage: "images/pano-2br.jpeg" // แก้ไขแล้ว
        },
        "Villa 3 Bedrooms": {
            desc: "วิลล่าขนาดกลาง 3 ห้องนอน 4 ห้องน้ำ พร้อมสระว่ายน้ำส่วนตัว เหมาะสำหรับครอบครัวที่ต้องการพื้นที่กว้างขวาง",
            features: ["สระว่ายน้ำส่วนตัว", "ห้องนั่งเล่นกว้าง", "พื้นที่นั่งเล่นกลางแจ้ง", "ครัวครบครัน"],
            panoramaImage: "images/pano-3br.jpeg" // แก้ไขแล้ว
        },
        "Villa 4 Bedrooms": {
            desc: "วิลล่าขนาดใหญ่ พร้อม 4 ห้องนอน 5 ห้องน้ำ สระว่ายน้ำส่วนตัวขนาดใหญ่และพื้นที่จัดปาร์ตี้",
            features: ["สระส่วนตัวขนาดใหญ่", "พื้นที่ BBQ", "คาราโอเกะ", "ครัวครบครัน"],
            panoramaImage: "images/pano-4br.jpeg" // แก้ไขแล้ว
        },
        "Villa 6 Bedrooms": {
            desc: "วิลล่าขนาดพิเศษ รองรับผู้เข้าพักได้สูงสุด 20 คน พร้อม 6 ห้องนอน และสิ่งอำนวยความสะดวกสำหรับงานเลี้ยงขนาดใหญ่",
            features: ["สระส่วนตัวขนาดใหญ่", "ครัวแบบเปิด", "เครื่องเสียงและคาราโอเกะ", "โต๊ะพลู"],
            panoramaImage: "images/pano-6br.jpeg" // แก้ไขแล้ว
        },
    };

    // --- New Popup Logic ---
    const detailsPopup = document.getElementById("details-popup");
    const bookingPopup = document.getElementById("booking-popup");
    const openBookingBtn = document.getElementById("open-booking-btn");
    let currentRoomName = '';
    let panoramaViewer = null;

    const openPopup = (popupElement) => {
        popupElement.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closePopup = (popupElement) => {
        popupElement.classList.remove("active");
        if (!document.querySelector('.popup-overlay.active')) {
            document.body.style.overflow = "";
        }
        if (popupElement === detailsPopup && panoramaViewer) {
            panoramaViewer.destroy();
            panoramaViewer = null;
        }
    };
    
    document.querySelectorAll(".popup-close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            closePopup(btn.closest(".popup-overlay"));
        });
    });

    document.querySelectorAll(".popup-overlay").forEach(popup => {
        popup.addEventListener("click", (event) => {
            if (event.target === popup) {
                closePopup(popup);
            }
        });
    });

    document.querySelectorAll(".room-card").forEach((card) => {
        card.addEventListener("click", () => {
            currentRoomName = card.dataset.room;
            const data = roomData[currentRoomName];

            if (data) {
                detailsPopup.querySelector("#roomTitle").textContent = currentRoomName;
                detailsPopup.querySelector("#roomDesc").textContent = data.desc;
                detailsPopup.querySelector("#roomFeatures").innerHTML = data.features.map(f => `<li>${f}</li>`).join("");

                if(panoramaViewer) panoramaViewer.destroy();
                panoramaViewer = pannellum.viewer('panorama-viewer', {
                    "type": "equirectangular",
                    "panorama": data.panoramaImage,
                    "autoLoad": true,
                    "autoRotate": -2,
                    "showControls": false,
                    "compass": false,
                    "hfov": 120
                });

                openPopup(detailsPopup);
            }
        });
    });

    openBookingBtn.addEventListener("click", () => {
        bookingPopup.querySelector("#bookingRoomName").textContent = `สำหรับ: ${currentRoomName}`;
        closePopup(detailsPopup);
        openPopup(bookingPopup);
    });

    // --- Booking Form ---
    const bookingForm = document.getElementById("bookingForm");
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const bookingResult = document.getElementById("bookingResult");
        const name = new FormData(bookingForm).get("name");
        
        bookingResult.textContent = `ขอบคุณ ${name}! เราได้รับคำขอจองแล้ว และจะติดต่อกลับโดยเร็วที่สุด ✅`;
        bookingForm.reset();
        setTimeout(() => { 
            bookingResult.textContent = ''; 
            closePopup(bookingPopup);
        }, 4000);
    });

    // --- Scroll to Top Button ---
    const scrollBtn = document.getElementById("scrollToTopBtn");
    window.addEventListener("scroll", () => {
        scrollBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // --- Scroll Reveal Animation ---
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach((r) => observer.observe(r));

});