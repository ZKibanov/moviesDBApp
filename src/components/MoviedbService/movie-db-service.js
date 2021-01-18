export default class MoviedbService {
  async getResource(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Huoston,we have a problem ${res.status} at ${url}`);
    }
    const body = await res.json();
    return body;
  }
}
