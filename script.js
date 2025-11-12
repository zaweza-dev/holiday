document.addEventListener('DOMContentLoaded', function() {
    // Nomor WhatsApp Anda
    const whatsappNumber = '6285136236798'; // Menggunakan kode negara 62

    // Pesan default yang akan dikirim
    const defaultMessage = 'Halo, saya tertarik untuk menyewa villa di Holiday. Mohon info ketersediaan dan harga.';

    // Cari semua tombol dengan class 'whatsapp'
    const whatsappButtons = document.querySelectorAll('.btn.whatsapp');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ambil nama villa dari atribut data-villa
            const villaName = this.getAttribute('data-villa');

            // Buat pesan khusus berdasarkan nama villa
            const message = `Halo Holiday, saya tertarik dengan Villa *${villaName}* di Bali. Apakah villa ini tersedia pada tanggal ...?`;

            // Encode pesan untuk URL
            const encodedMessage = encodeURIComponent(message);

            // Buat URL WhatsApp
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Arahkan pengguna ke WhatsApp
            window.open(whatsappURL, '_blank');
        });
    });

    // Opsional: Untuk tombol primary di hero section
    const primaryButton = document.querySelector('.btn.primary');
    if (primaryButton) {
        primaryButton.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Untuk smooth scrolling pada navigasi
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
