class BandsController < ApplicationController
  def index
    bands = Band.sort_alphabetically

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => bands }
    end
  end

  def show
    user = current_or_guest_user
    band = Band.find(params[:id])
    songs = band.songs.map { |song| song.formatted_json(user) }

    band_json = { "info" => band, "songs" => songs }

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => band_json }
    end
  end
end
