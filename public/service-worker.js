const ICON = '/favicon.ico';
const URL = '/';

self.addEventListener('install', (event) => {
    console.log('Mini Garden Helper Installed!');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Mini Garden Helper Activated!');
    self.clients.claim();
});

export default async function updateWaterNotif() {
    try { const res = await fetch('/api/updateWater', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            console.warn('updateWater: server returned', res.status);
            return;
        }

        const payload = await res.json().catch(() => null);
        if (Array.isArray(payload)) {
            for (const n of payload) {
                const options = {
                    body: n,
                    icon: ICON,
                    data: { url: URL },
                };
                self.registration.showNotification('Watering Time!', options);
            }
        }
    } catch (err) {
        console.error('WE RAN OUT OF WATER! (updateWater failed)', err);
    }
    return;
}

setTimeout(() => void updateWater(), 5000); // run once after install
setInterval(() => void updateWater(), 360000); // ten times hourly
