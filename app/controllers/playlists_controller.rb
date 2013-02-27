class PlaylistsController < ApplicationController
  def create
    if params[:playlist][:day]
      playlist = create_playlist_by_day(params)
    end

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => format_return_json(playlist) }
    end
  end

  def show
    playlist = Playlist.find(params[:id])

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => format_return_json(playlist) }
    end
  end

  def index
    playlists = Playlist.all

    playlist_json = playlists.map { |playlist| format_return_json(playlist) }

    respond_to do |format|
      format.html
      format.json { render :json => playlist_json }
    end
  end

  def destroy
    playlist = Playlist.find(params[:id])
    playlist.destroy

    render :nothing => true
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

    def format_return_json(playlist)
      formatted_songs = playlist.songs.map  do |song|
        create_song_json(song, Band.find(song.band_id))
      end

      { :playlist => playlist, :songs => formatted_songs }
    end

    def create_playlist_by_day(params)
      day = params[:playlist][:day]
      name = params[:playlist][:name]

      if name.nil? || name == ""
        t = Time.new.strftime("%m/%d/%Y")
        name = "New Playlist #{t}"
      end

      bands = Band.where(:set_time => day)
      songs = []
      bands.each { |band| songs << band.songs }
      playlist_songs = songs.flatten!.shuffle![0..20]

      p = Playlist.new(:name => name)
      p.songs = playlist_songs
      p.save!
      p
    end
end
