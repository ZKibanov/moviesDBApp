import MoviedbService from '../../components/MoviedbService';

export default class GuestSessionService {
  sessionService = new MoviedbService();

  getGuestSessionInfo(guestSessionIDRequest) {
    this.sessionService
      .getResource(guestSessionIDRequest)
      .then((body) => {
        const date = this.expireGuestSessionDateParsing(body.expires_at);
        const id = body.guest_session_id;
        localStorage.setItem('guestSessionId', id);
        localStorage.setItem('guestSessionExpiresAt', date);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  guestSessionIsValid(expiresAt) {
    return Number(expiresAt) > Date.now();
  }

  expireGuestSessionDateParsing(someDate) {
    const expiresAt = someDate.split(' ');
    const expireDate = [...expiresAt[0].split('-'), ...expiresAt[1].split(':')];
    const date = new Date(
      Number(expireDate[0]),
      Number(expireDate[1]),
      Number(expireDate[2]),
      Number(expireDate[3]),
      Number(expireDate[4]),
      Number(expireDate[5])
    );
    const dateWithOffSet = -date.getTimezoneOffset() * 60 * 1000 + date.valueOf();
    return dateWithOffSet;
  }
}
