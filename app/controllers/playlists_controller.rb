class PlaylistsController < ApplicationController
  before_filter :authenticate_user!

  def create
    if params[:playlist][:day]
      playlist = Playlist.create_by_day(params[:playlist][:day],
                                        params[:playlist][:name],
                                        current_user)
    end

    respond_to do |format|
      format.html { render :nothing => true }
      format.json { render :json => playlist.formatted_json }
    end
  end

  def show
    playlist = Playlist.find(params[:id])

    respond_to do |format|
      format.json { render :json => playlist.formatted_json }
    end
  end

  def index
    playlists = current_user.playlists.map { |playlist| playlist.formatted_json }

    respond_to do |format|
      format.html
      format.json { render :json => playlists }
    end
  end

  def destroy
    playlist = Playlist.find(params[:id])
    playlist.destroy

    respond_to do |format|
      format.json { render :json => playlist.formatted_json }
    end
  end
end
