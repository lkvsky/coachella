class SongsController < ApplicationController
  def index
    songs = Song.random_selection

    formatted_songs = songs.map do |song|
      format_song_json(song, Band.find(song.band_id))
    end

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => formatted_songs }
    end
  end

  private

    def format_song_json(song, band)
    {
      :id => song.id,
      :name => song.name,
      :url => song.url,
      :band_thumbnail => band.thumbnail,
      :band => band.name
    }
  end
end
