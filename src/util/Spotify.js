let userAccessToken;
const redirectUri = "http://localhost:3000";
const clientId = "df85f56e489346569af1cb2fc3f1b4a2";
let accessToken=""
const apiURL = 'https://api.spotify.com/v1';
const headers = { headers: { Authorization: `Bearer ${accessToken}` } };

const Spotify = {
  getAccessToken() {
    if(userAccessToken){
      console.log(userAccessToken);
      return userAccessToken;

    }
    else if (window.location.href.match(/access_token=([^&]*)/) != null) {
          userAccessToken = window.location.href.match(/access_token=([^&]*)/)[0].split("=")[1];
          let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].split("=")[1];
          window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
      } else {
          window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

      }
  },

  search(term) {
    const accessUrl = 'https://api.spotify.com/v1/search?type=track&q=term'
    return fetch(accessUrl, {
			headers: {
			  Authorization: `Bearer ${accessToken}`
			}
  })
  .then(response => {
        if (response.ok) {
            return response.json();
        } else {

            console.log('API request failed');
            //console.log(response.json());
				}
	 })
   .then(jsonResponse => {
     	if (!jsonResponse.tracks) {
        return [];
      } else {
			     return jsonResponse.tracks.items.map(track => {
			          return {
				            id: track.id,
				            name: track.name,
            				artist: track.artists[0].name,
            				album: track.album.name,
            				uri: track.uri
			           }
			     });
		  }
    });
  },

  savePlaylist (playListName, trackURIs) {
    if (!playListName || !trackURIs) { return }
    else {
      let userId;
      let url = 'me';
      // get userID //
      return fetch(url, headers).then(response => response.json()).then(jsonResponse => {
        userId = jsonResponse.id;
        url = `${apiURL}/users/${userId}/playlists`;
        let body = { name: playListName };
        let thePost = { headers: headers, method: 'POST', body: JSON.stringify(body) };
        // get playlistID //
        return fetch(url, thePost).then(response => response.json()
          ).then(jsonResponse => jsonResponse.id).then(playlistId => {
          console.log("Spotify.playlistid: " + playlistId);
          url = `${apiURL}/users/${userId}/playlists/${playlistId}/tracks`;
          body = { uris: trackURIs };
          thePost = { headers: headers, method: 'POST', body: JSON.stringify(body) };
          // save trackURIs //
          return fetch(url, thePost).then(response => console.log("Spotify said: " + response));
        });
      });
    }
  }
};


export default Spotify;
