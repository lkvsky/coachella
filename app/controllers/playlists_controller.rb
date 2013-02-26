class PlaylistsController < ApplicationController
  def create
    if params[:band][:day]
      song_json = create_playlist_by_day(params[:band][:day])
    end

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => song_json }
    end
  end

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

  def create_playlist_by_day(day)
    bands = Band.where(:set_time => day)
    song_json = []

    bands.each do |band|
      songs = band.songs.map { |song| create_song_json(song, band) }
      song_json.concat(songs)
    end

    song_json.shuffle![0..20]
  end
end
