document.addEventListener('DOMContentLoaded', function() {
    // Nomor WhatsApp Anda (085136236798 diubah ke format internasional 6285136236798)
    const whatsappNumber = '6285136236798'; 
    const villaNameDisplay = document.getElementById('selectedVillaName');
    const hiddenVillaNameInput = document.getElementById('hiddenVillaName');
    const bookingForm = document.getElementById('bookingForm');

    // 1. Logika untuk Memilih Villa (Saat tombol 'Pesan Villa Ini' di klik)
    const selectVillaButtons = document.querySelectorAll('.select-villa');

    selectVillaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const villaName = this.getAttribute('data-villa');
            
            // Perbarui tampilan di formulir pemesanan
            villaNameDisplay.textContent = villaName;
            hiddenVillaNameInput.value = villaName;

            // Lakukan smooth scrolling ke bagian pemesanan
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 2. Logika Pengiriman Formulir ke WhatsApp
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Ambil nilai dari input form
        const villaName = hiddenVillaNameInput.value;
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('guests').value;

        // Validasi: pastikan villa sudah dipilih
        if (!villaName || villaName === '-- Belum Ada Villa yang Dipilih --') {
            alert('⚠️ Mohon pilih villa yang ingin Anda pesan terlebih dahulu pada bagian "Villa Kami".');
            return;
        }

        // Buat pesan WhatsApp
        const message = 
            `*FORMULIR PEMESANAN VILLA - HOLIDAY*\n\n` +
            `*Villa Pilihan:* ${villaName}\n` +
            `*Nama Pemesan:* ${fullName}\n` +
            `*No. Telp:* ${phone}\n` +
            `*Check-In:* ${checkIn}\n` +
            `*Check-Out:* ${checkOut}\n` +
            `*Jumlah Tamu:* ${guests} orang\n\n` +
            `Halo, saya ingin melanjutkan proses pemesanan villa ini. Mohon info lebih lanjut mengenai ketersediaan dan total harga. Terima kasih.`;

        // Encode pesan dan buat URL WhatsApp
        const encodedMessage = encodeURIComponent(message);
        
        // Bersihkan format nomor telepon
        const cleanNumber = whatsappNumber.replace(/\s|-/g, ''); 
        
        const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

        // Arahkan pengguna ke WhatsApp
        window.open(whatsappURL, '_blank');
    });

    // 3. Smooth Scrolling untuk Navigasi
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
