import MoviedbService from '../../services/MoviedbService';

const key = 'cc1dcf97688dfad4070d8e273bcabc3b';
const urlBase = 'https://api.themoviedb.org/3';
const guestSessionIDRequest = `${urlBase}/authentication/guest_session/new?api_key=${key}`;
const genresUrl = `${urlBase}/genre/movie/list?api_key=${key}&language=en-US`;

class SessionService {
  getGuestSessionInfo() {
    return MoviedbService.getResource(guestSessionIDRequest);
  }

  getGenres() {
    return MoviedbService.getResource(genresUrl);
  }

  getRatedFilms(guestSessionId) {
    if (!guestSessionId) {
      return;
    }
    let pageNumber = 1;
    const sessionURL = `${urlBase}/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`;
    MoviedbService.getResource(sessionURL).then((body) => {
      const ratedFilmsArrray = [];
      if (body.total_pages === 1) {
        ratedFilmsArrray.push(body.results);
      }
      const promiseArray = [];
      let i = 1;
      while (i <= body.total_pages) {
        pageNumber = i;
        promiseArray.push(
          MoviedbService.getResource(
            `${urlBase}/guest_session/${guestSessionId}/rated/movies?api_key=${key}&language=en-US&sort_by=created_at.asc&page=${pageNumber}`
          )
        );
        i += 1;
      }
      Promise.all(promiseArray).then((arrOfResults) => {
        arrOfResults.forEach((el) => ratedFilmsArrray.push(...el.results));
      });
      return ratedFilmsArrray;
    });
  }
}

export default new SessionService();
