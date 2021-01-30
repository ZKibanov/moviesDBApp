export default class RateFilmService {
  async rateFilm(rating, filmId, guestSessionID) {
    const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
    const url = `https://api.themoviedb.org/3/movie/${filmId}/rating?api_key=${key}&guest_session_id=${guestSessionID}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: rating,
      }),
    });
    if (!res.ok) {
      throw new Error(`Huoston,we have a problem: ${res.status} at ${url}`);
    }
    const body = await res.json();
    return body;
  }
}
