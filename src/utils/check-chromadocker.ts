export async function checkChromaDocker() {
  try {
    const res = await fetch(`http://localhost:8765/api/v2/heartbeat`);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
