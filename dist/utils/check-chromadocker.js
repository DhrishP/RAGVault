export async function checkChromaDocker() {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/collections`);
        if (res.status === 200) {
            return true;
        }
        else {
            const res = await fetch(`http://0.0.0.0:8000/api/v1/health`);
            if (res.status === 200) {
                return true;
            }
            return false;
        }
    }
    catch (error) {
        return false;
    }
}
