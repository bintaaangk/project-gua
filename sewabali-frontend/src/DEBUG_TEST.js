// FILE INI UNTUK TESTING KONEKSI KE BACKEND
// Buka console browser dan jalankan: testBackendConnection()

window.testBackendConnection = async function() {
    console.log("=== TESTING BACKEND CONNECTION ===");
    
    const testData = {
        name: "Test User",
        email: "test@example.com",
        nomor_telepon: "08123456789",
        password: "testpass123",
        password_confirmation: "testpass123",
        role: "penyewa",
        alamat: "Test Address, Bali"
    };

    try {
        console.log("📤 Mengirim test request ke backend...");
        console.log("URL: http://127.0.0.1:8000/api/register");
        console.log("Data:", testData);

        const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log("✓ Response Status:", response.status);
        const data = await response.json();
        console.log("✓ Response Data:", data);

        if (response.ok) {
            console.log("✅ BACKEND BERFUNGSI DENGAN BAIK!");
        } else {
            console.log("⚠️ Backend mengembalikan error:", data);
        }
    } catch (err) {
        console.error("❌ ERROR SAAT MENGHUBUNGI BACKEND:");
        console.error(err);
        console.error("Pastikan:");
        console.error("1. Backend sudah jalan (php artisan serve)");
        console.error("2. Port benar (127.0.0.1:8000)");
        console.error("3. CORS sudah dikonfigurasi");
    }
};

console.log("✓ DEBUG_TEST.js loaded. Jalankan testBackendConnection() di console");
