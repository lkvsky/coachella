class PlaylistsController < ApplicationController
  def create
    user = current_or_guest_user

    if params[:playlist][:day] && params[:playlist][:day] != "0"
      playlist = Playlist.create_by_day(params[:playlist][:day],
                                        params[:playlist][:name],
                                        user)
    elsif params[:playlist][:bands]
      playlist = Playlist.create_by_bands(params[:playlist][:bands],
                                          params[:playlist][:name],
                                          user)
    end

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => playlist.formatted_json(user) }
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
    user = current_or_guest_user
    playlist = Playlist.find(params[:id])

    respond_to do |format|
      format.json { render :json => playlist.formatted_json(user) }
    end
  end

  def index
    user = current_or_guest_user
    playlists = user.playlists.map { |playlist| playlist.formatted_json(user) }

    respond_to do |format|
      format.html
      format.json { render :json => playlists }
    end
  end

  def destroy
    user = current_or_guest_user
    playlist = Playlist.find(params[:id])
    playlist.destroy

    respond_to do |format|
      format.json { render :json => playlist.formatted_json(user) }
    end
  end
end
