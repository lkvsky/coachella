class PlaylistsController < ApplicationController
  def index
    songs = Song.random_selection

    song_json = songs.map { |song| create_song_json(song, Band.find(song.band_id)) }

    respond_to do |format|
      format.html
      format.json { render :json => song_json }
    end
  end

  private
  
  def create_song_json(song, band)
    {
      :band_id => song.band_id,
      :id => song.id,
      :name => song.name,
      :url => song.url,
      :thumbnail => song.thumbnail,
      :band => band.name
    }
  end
end
