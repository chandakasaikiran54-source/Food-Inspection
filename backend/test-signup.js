const payload = {
    fullName: 'Test User',
    email: 'test' + Date.now() + '@gvmc.gov.in',
    password: 'Password123',
    confirmPassword: 'Password123',
    role: 'INSPECTOR',
    department: 'Health'
};

async function run() {
    try {
        console.log("Sending payload:", payload);
        const res = await fetch('http://localhost:5000/api/v1/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Success:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}
run();
