export async function checkChromaDocker() {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/collections`);
        if (res.status === 200) {
            console.log(await res.json());
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        return false;
    }
}
