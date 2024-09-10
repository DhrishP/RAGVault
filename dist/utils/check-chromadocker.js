export async function checkChromaDocker() {
    const res = await fetch(`http://localhost:8000/api/v1/collections`);
    if (res.status === 200) {
        console.log(await res.json());
    }
    else {
        console.log("Chroma Docker is not running");
    }
}
