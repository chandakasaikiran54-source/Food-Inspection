async function testGeocode() {
    const lat = 17.6868;
    const lng = 83.2185;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'FoodInspectionApp/1.0'
            }
        });
        const data = await response.json();
        console.log('API Response:', data.address);
    } catch (e) {
        console.error('API Error:', e);
    }
}
testGeocode();
