class PlaylistsController < ApplicationController
 before_filter :authenticate_user!

  def create
    if params[:playlist][:day] && params[:playlist][:day] != "0"
      playlist = Playlist.create_by_day(params[:playlist][:day],
                                        params[:playlist][:name],
                                        current_user)
    elsif params[:playlist][:bands]
      playlist = Playlist.create_by_bands(params[:playlist][:bands],
                                          params[:playlist][:name],
                                          current_user)
    end

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => playlist.formatted_json(current_user) }
    end
  end

  def update
    if params[:song]
      playlist = Playlist.find(params[:id])

      playlist.playlist_songs.where(:song_id => params[:song]).first.destroy
      playlist.save

      respond_to do |format|
        format.html { render :nothing => true }
        format.json { render :json => "update successful" }
      end
    else
      respond_to do |format|
        format.html { render :nothing => true }
        format.json { render :status => 400 }
      end
    end
  end

  def show
    playlist = Playlist.find(params[:id])

    respond_to do |format|
      format.json { render :json => playlist.formatted_json(current_user) }
    end
  end

  def index
    playlists = current_user.playlists.map { |playlist| playlist.formatted_json(current_user) }

    respond_to do |format|
      format.html
      format.json { render :json => playlists }
    end
  end

  def destroy
    playlist = Playlist.find(params[:id])
    playlist.destroy

    respond_to do |format|
      format.json { render :json => playlist.formatted_json(current_user) }
    end
  end
end
