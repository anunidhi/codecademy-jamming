import React from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

this.state = { searchResults: [
  {
  name: 'George Michael',
  artist: 'WHAM',
  album: 'xxx1',
  id: 'yyy1'
  },

  {
  name: 'Madonna',
  artist: 'Like a Virgin',
  album: 'xxx2',
  id: 'yyy2'
  },

  {
  name: 'Bruce Springsteen',
  artist: 'Born in the USA',
  album: 'xxx3',
  id: 'yyy3'
  }],

  playListName: 'New Playlist',
  playlistTracks: []

  }

  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);
}



addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
        return;
    } else {
      let addedPlayList = this.state.playlistTracks.push(track);
      this.setState({playlistTracks: addedPlayList});
    }
}

removeTrack (track) {
  let deletedPlayListTrack = this.state.playlistTracks.filter(playListTrack =>
    playListTrack.id !== track.id);
    this.setState({playlistTracks: deletedPlayListTrack});

}

updatePlaylistName(name) {
  this.setState({playListName: name});
}

savePlaylist() {
  let trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (this.state.playListName && trackURIs && trackURIs.length > 0) {
      Spotify.savePlaylist(this.state.playListName, trackURIs).then(() => {
			    this.setState({ playListName: 'New Playlist Name', playlistTracks: [] });
        })
  } else {
    return;
  }
}

async search(term) {
		const trackResults = await Spotify.search(term);
		this.setState({searchResults: trackResults});
}

  render () {
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults
          tracks={this.state.searchResults}
          onAdd={this.addTrack}
          onRemove={this.removeTrack}/>
          <Playlist
          title={this.state.playListName}
          playlistTracks={this.state.playlistTracks}
          onNameChange={this.state.playListName}
          onSave={this.savePlaylist}
          onRemove={this.removeTrack}/>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
