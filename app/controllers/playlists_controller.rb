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
    playlist = Playlist.find(params[:id])
    playlist.name = params[:playlist][:name]
    
    if params[:playlist][:songs]
      params[:playlist][:songs].each do |song|
        playlist.playlist_songs.where(:song_id => song).first.destroy
      end
    end

    playlist.save

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => playlist }
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
